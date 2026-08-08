import type { Request, Response } from "express";
import * as pty from "node-pty";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { siteModel } from "./site.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getSiteDir = (siteName: string): string => {
    const folderName = siteName.trim().toLowerCase().replaceAll(" ", "-").replace(/[^a-z0-9-_]/g, "");
    const sitesDir = path.resolve(process.cwd(), "sites");

    // Check if the exact folderName exists
    let siteDir = path.resolve(sitesDir, folderName);
    if (fs.existsSync(siteDir)) {
        return siteDir;
    }

    // Try collapsing multiple hyphens (e.g. "the-mood---speciality-coffee--drinks" -> "the-mood-speciality-coffee-drinks")
    const collapsed = folderName.replace(/-+/g, "-");
    siteDir = path.resolve(sitesDir, collapsed);
    if (fs.existsSync(siteDir)) {
        return siteDir;
    }

    // Try reading directory and doing a case-insensitive, hyphen-agnostic match
    try {
        if (fs.existsSync(sitesDir)) {
            const files = fs.readdirSync(sitesDir);
            const cleanTarget = folderName.replace(/[-_]/g, "");
            const match = files.find(f => f.toLowerCase().replace(/[-_]/g, "") === cleanTarget);
            if (match) {
                return path.resolve(sitesDir, match);
            }
        }
    } catch (e) {
        console.error("Error reading sites directory:", e);
    }

    // Default to the original name if not found
    return path.resolve(sitesDir, folderName);
};

let terminals: Map<string, pty.IPty> = new Map<string, pty.IPty>()
let initializedTerminals: Set<string> = new Set<string>()

const cleanUpTerminals = () => {
    console.log("Cleaning up all active terminals...");
    for (const terminal of terminals.values()) {
        try {
            terminal.kill();
        } catch (e) {
            // ignore
        }
    }
    terminals.clear();
    initializedTerminals.clear();
};

process.on("exit", cleanUpTerminals);
process.on("SIGINT", () => {
    cleanUpTerminals();
    process.exit(0);
});
process.on("SIGTERM", () => {
    cleanUpTerminals();
    process.exit(0);
});
process.on("SIGUSR2", () => {
    cleanUpTerminals();
    process.exit(0);
});

const BASE_PORT = 10000;

async function getNextPort(): Promise<number> {
    try {
        const sites = await siteModel.find({});
        const usedPorts = new Set(sites.map(s => (s as any).port).filter(p => typeof p === "number"));
        let p = BASE_PORT;
        while (usedPorts.has(p)) {
            p++;
        }
        return p;
    } catch {
        return BASE_PORT;
    }
}

export const createSite = async (req: Request<{}, {}, { name: string, phone: string }>, res: Response) => {
    const { name, phone } = req.body

    if (!name || !phone || typeof name !== "string" || typeof phone !== "string") {
        return res.status(400).json({ error: "invalid parameters" })
    }

    const folderName = name.trim().toLowerCase().replaceAll(" ", "-").replace(/[^a-z0-9-_]/g, "");
    const sitesDir = path.resolve(process.cwd(), "sites");
    if (!fs.existsSync(sitesDir)) {
        fs.mkdirSync(sitesDir, { recursive: true });
    }
    console.log(sitesDir, folderName)

    // Check if site already exists in database
    const existingSite = await siteModel.findOne({ name });
    if (existingSite) {
        return res.status(400).json({ error: "Site already exists" });
    }

    const cmd = `npx --yes create-next-app@latest ${folderName} --yes`;
    console.log(`Running: ${cmd} in ${sitesDir} via node-pty`);

    const shell = "/bin/zsh"
    const ptyProcess = pty.spawn(shell, [], {
        name: "xterm-256color",
        cols: 80,
        rows: 30,
        cwd: sitesDir,
        env: process.env,
    });

    let output = "";
    ptyProcess.onData((data) => {
        output += data;
        process.stdout.write(data);
    });

    ptyProcess.onExit(async ({ exitCode }) => {
        if (exitCode !== 0) {
            console.error(`Error creating site: exit code ${exitCode}`);
            return res.status(500).json({ error: "Failed to create site folder", details: `Exit code ${exitCode}` });
        }

        try {
            const assignedPort = await getNextPort();
            const newSite = new siteModel({
                name,
                phone,
                port: assignedPort,
                isDeployed: false
            });
            await newSite.save();

            return res.status(200).json({ message: "Site created successfully", site: newSite });
        } catch (dbErr: any) {
            console.error(`Database save error: ${dbErr.message}`);
            return res.status(500).json({ error: "Site folder created but failed to save to database", details: dbErr.message });
        }
    });

    ptyProcess.write(`${cmd}\n`);
    ptyProcess.write("exit\n");
}

export const getAllSites = async (req: Request, res: Response) => {
    try {
        const sites = await siteModel.find({});
        return res.status(200).json({ sites });
    } catch (error: any) {
        return res.status(500).json({ error: "Failed to fetch sites", details: error.message });
    }
}

export const getSiteById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const site = await siteModel.findById(id);
        if (!site) {
            return res.status(404).json({ error: "Site not found" });
        }
        return res.status(200).json({ site });
    } catch (error: any) {
        return res.status(500).json({ error: "Failed to fetch site", details: error.message });
    }
}

const terminalErrors = new Map<string, string>();

export const editSite = async (req: Request, res: Response) => {
    const { siteId, prompt } = req.body
    if (!siteId || !prompt || typeof prompt !== "string") {
        return res.status(400).json({ error: "invalid params" })
    }

    const site = await siteModel.findById(siteId)
    if (!site) {
        return res.status(400).json({ error: "invalid params" })
    }

    if (!site.port && !site.isDeployed) {
        site.port = await getNextPort();
        await site.save();
    }

    const devPort = site.port || 10000;
    const firstCmd = `npm run dev -- -p ${devPort}`;
    const cmd = "agy";

    const siteDir = getSiteDir(site.name);

    console.log(`Running editSite commands via node-pty in ${siteDir} on port ${devPort}`);

    let terminalA = terminals.get(site.terminals[0]!)
    let terminalB = terminals.get(site.terminals[1]!)

    if (!terminalA || !terminalB) {
        terminalA = pty.spawn("/bin/zsh", [], {
            name: "xterm-256color",
            cols: 80,
            rows: 30,
            cwd: siteDir,
            env: process.env
        })
        terminals.set(site.terminals[0]!, terminalA)

        terminalB = pty.spawn("zsh", [], {
            name: "xterm-256color",
            cols: 80,
            rows: 30,
            cwd: siteDir,
            env: process.env
        })
        terminals.set(site.terminals[1]!, terminalB)

        terminalA.onExit(() => {
            terminals.delete(site.terminals[0]!);
        });
        terminalB.onExit(() => {
            terminals.delete(site.terminals[1]!);
            initializedTerminals.delete(site.terminals[1]!);
            terminalErrors.delete(site.terminals[1]!);
        });

        terminalB.onData((data) => {
            console.log(data);
            if (data.includes("trust") || data.includes("Yes") || data.includes("yes")) {
                terminalB?.write("\r");
            }
            if (data.includes("experience so far") || data.includes("[0] Skip") || data.includes("Help us improve") || data.includes("[1] Good")) {
                terminalB?.write("0\r");
            }
            if (data.includes(">")) {
                terminalErrors.delete(site.terminals[1]!);
            }
        });

        terminalA.write(`${firstCmd}\r`);
        terminalB.write(`${cmd}\r`);
    }

    if (initializedTerminals.has(site.terminals[1]!)) {
        terminalErrors.delete(site.terminals[1]!);
        terminalB.write(`${prompt}\r`);
        return res.status(200).json({ code: 200, message: "Changes applied successfully.", port: site.port });
    }

    if (terminalErrors.has(site.terminals[1]!)) {
        const errorMsg = terminalErrors.get(site.terminals[1]!);
        terminalErrors.delete(site.terminals[1]!);
        return res.status(400).json({ error: errorMsg, isVerifying: true });
    }

    let seenEmail = false;
    let listener: pty.IDisposable;
    listener = terminalB.onData((data) => {
        if (data.includes("dumitruphilip123@gmail.com")) {
            seenEmail = true;
        }
        if (data.includes("experience so far") || data.includes("[0] Skip") || data.includes("Help us improve") || data.includes("[1] Good")) {
            terminalB.write("0\r");
        }
        if (data.includes(">")) {
            terminalErrors.delete(site.terminals[1]!);
        }
        if (seenEmail && data.includes(">")) {
            terminalB.write(`${prompt}\r`);
            initializedTerminals.add(site.terminals[1]!);
            listener.dispose();
        }
    });

    return res.status(200).json({ code: 200, message: "Changes applied successfully.", port: site.port });
}

export const deploy = async (req: Request, res: Response) => {
    const { siteId } = req.body

    const site = await siteModel.findById(siteId)
    if (!site) {
        return res.status(400).json({ error: "invalid params" })
    }

    const siteDir = getSiteDir(site.name);
    const actualFolderName = path.basename(siteDir);

    // Construct the actual deploy command using the correct directory path and fixing option formatting
    const cmd = `git init && git add . && (git commit -m "add files" || echo "No changes to commit") && git branch -M main && (gh repo create "${actualFolderName}" --public --source=. --remote=origin --push || git push -u origin main || echo "GitHub repo already exists or push failed") && vercel --prod --yes && cd .. && rm -rf "${actualFolderName}"`

    // Stop dev server terminal if running
    try {
        const term0 = terminals.get(site.terminals[0]!);
        if (term0) {
            try {
                process.kill(-term0.pid, "SIGINT");
            } catch (err) { }
            term0.kill();
        }
    } catch (err) { }

    try {
        const term1 = terminals.get(site.terminals[1]!);
        if (term1) {
            try {
                process.kill(-term1.pid, "SIGINT");
            } catch (err) { }
            term1.kill();
        }
    } catch (err) { }

    // Get or spawn terminal B
    let terminal: pty.IPty;
    try {
        terminal = pty.spawn("/bin/zsh", [], {
            name: "xterm-256color",
            cols: 80,
            rows: 30,
            cwd: siteDir,
            env: process.env
        });
        terminals.set(site.terminals[0]!, terminal);
    } catch (spawnErr: any) {
        console.error("Failed to spawn deploy terminal:", spawnErr);
        return res.status(500).json({ error: "Failed to spawn deploy terminal", details: spawnErr.message });
    }

    // Write the command after a brief delay so the shell can initialize properly
    setTimeout(() => {
        try {
            terminal.write(`${cmd}\n`);
        } catch (err: any) {
            console.error("Error writing deploy command to terminal:", err);
        }
    }, 1000);

    terminal.onData((data) => {
        console.log(data)
    });

    terminal.onExit(() => {
        terminals.delete(site.terminals[0]!);
    });

    // Update deployment status in DB and remove dev port
    site.isDeployed = true;
    site.port = null;
    await site.save();

    return res.status(200).send("success")
}

export const getRunningSites = async (req: Request, res: Response) => {
    try {
        const sites = await siteModel.find({});
        const running = sites.filter(site => {
            const isARunning = site.terminals[0] ? terminals.has(site.terminals[0]) : false;
            const isBRunning = site.terminals[1] ? terminals.has(site.terminals[1]) : false;
            return isARunning || isBRunning;
        });
        return res.status(200).json({ running });
    } catch (error: any) {
        return res.status(500).json({ error: "Failed to fetch running processes", details: error.message });
    }
}