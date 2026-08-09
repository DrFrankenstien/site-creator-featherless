import * as pty from "node-pty";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { siteModel } from "./site.model.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const getSiteDir = (siteName) => {
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
    }
    catch (e) {
        console.error("Error reading sites directory:", e);
    }
    // Default to the original name if not found
    return path.resolve(sitesDir, folderName);
};
let terminals = new Map();
let initializedTerminals = new Set();
const cleanUpTerminals = () => {
    console.log("Cleaning up all active terminals...");
    for (const terminal of terminals.values()) {
        try {
            terminal.kill();
        }
        catch (e) {
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
async function getNextPort() {
    try {
        const sites = await siteModel.find({});
        const usedPorts = new Set(sites.map(s => s.port).filter(p => typeof p === "number"));
        let p = BASE_PORT;
        while (usedPorts.has(p)) {
            p++;
        }
        return p;
    }
    catch {
        return BASE_PORT;
    }
}
const copyTemplateWithoutNodeModules = (src, dest) => {
    fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (const entry of entries) {
        if (entry.name === "node_modules" || entry.name === ".next" || entry.name === ".git" || entry.name === ".vercel" || entry.name === "package-lock.json")
            continue;
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) {
            copyTemplateWithoutNodeModules(srcPath, destPath);
        }
        else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
};
function generateCustomPageTsx(businessName, phone = "(212) 555-0142") {
    const lower = businessName.toLowerCase();
    const isDental = lower.includes("dent") || lower.includes("ortho") || lower.includes("smile") || lower.includes("teeth") || lower.includes("clinic");
    const isLaw = lower.includes("law") || lower.includes("legal") || lower.includes("attorney") || lower.includes("advocate");
    const isCafe = lower.includes("cafe") || lower.includes("caff") || lower.includes("coffee") || lower.includes("bakery") || lower.includes("bistro");
    if (isDental) {
        return `"use client";

import { useState } from "react";

export default function DentalPage() {
  const [booking, setBooking] = useState({ name: "", phone: "", service: "Checkup & Cleaning" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", color: "#1e293b", background: "#f8fafc", minHeight: "100vh" }}>
      <header style={{ background: "#ffffff", borderBottom: "1px solid #e2e8f0", padding: "1.2rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontWeight: 800, fontSize: "1.25rem", color: "#0f172a", display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ background: "#2563eb", color: "#fff", width: "32px", height: "32px", borderRadius: "8px", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>🦷</span>
          ${businessName}
        </div>
        <nav style={{ display: "flex", gap: "20px", alignItems: "center", fontSize: "14px", fontWeight: 600 }}>
          <a href="#services" style={{ color: "#475569", textDecoration: "none" }}>Services</a>
          <a href="#about" style={{ color: "#475569", textDecoration: "none" }}>About Us</a>
          <a href="#book" style={{ background: "#2563eb", color: "#fff", padding: "0.6rem 1.2rem", borderRadius: "8px", textDecoration: "none" }}>Book Appointment</a>
        </nav>
      </header>

      <section style={{ padding: "5rem 2rem", maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", alignItems: "center" }}>
        <div>
          <span style={{ background: "#dbeafe", color: "#1d4ed8", padding: "0.4rem 0.8rem", borderRadius: "20px", fontSize: "12px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>✨ Top Rated Dental Practice</span>
          <h1 style={{ fontSize: "3.2rem", fontWeight: 900, lineHeight: 1.15, marginTop: "1rem", color: "#0f172a" }}>
            Comprehensive Dental Care for a Brighter, Healthier Smile.
          </h1>
          <p style={{ fontSize: "1.1rem", color: "#64748b", marginTop: "1.2rem", lineHeight: 1.6 }}>
            Welcome to ${businessName}. We deliver gentle, state-of-the-art cosmetic and restorative dentistry in a relaxing atmosphere.
          </p>
          <div style={{ marginTop: "2rem", display: "flex", gap: "16px", alignItems: "center" }}>
            <a href="#book" style={{ background: "#2563eb", color: "#fff", padding: "0.9rem 1.8rem", borderRadius: "10px", fontWeight: 700, textDecoration: "none", boxShadow: "0 4px 14px rgba(37,99,235,0.3)" }}>
              Book Your Visit Now
            </a>
            <a href="tel:${phone}" style={{ border: "1px solid #cbd5e1", padding: "0.9rem 1.6rem", borderRadius: "10px", color: "#334155", fontWeight: 600, textDecoration: "none" }}>
              📞 Call ${phone}
            </a>
          </div>
        </div>

        <div id="book" style={{ background: "linear-gradient(135deg, #2563eb, #1d4ed8)", borderRadius: "24px", padding: "3rem", color: "#fff", boxShadow: "0 20px 40px rgba(37,99,235,0.2)" }}>
          <h3 style={{ fontSize: "1.8rem", fontWeight: 800 }}>Schedule Your Appointment</h3>
          <p style={{ fontSize: "0.95rem", opacity: 0.9, marginTop: "0.5rem" }}>Instant online booking with our certified dental team.</p>

          {submitted ? (
            <div style={{ background: "rgba(255,255,255,0.15)", padding: "1.5rem", borderRadius: "12px", marginTop: "1.5rem", textAlign: "center" }}>
              <span style={{ fontSize: "2.5rem" }}>🎉</span>
              <h4 style={{ fontSize: "1.2rem", fontWeight: 700, marginTop: "0.5rem" }}>Appointment Request Received!</h4>
              <p style={{ fontSize: "0.9rem", marginTop: "0.3rem", opacity: 0.9 }}>We will confirm your visit shortly at {booking.phone || "${phone}"}.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "grid", gap: "14px", marginTop: "1.5rem" }}>
              <input
                type="text"
                placeholder="Full Name"
                required
                value={booking.name}
                onChange={(e) => setBooking({ ...booking, name: e.target.value })}
                style={{ padding: "0.8rem", borderRadius: "8px", border: "none", fontSize: "14px" }}
              />
              <input
                type="tel"
                placeholder="Phone Number"
                required
                value={booking.phone}
                onChange={(e) => setBooking({ ...booking, phone: e.target.value })}
                style={{ padding: "0.8rem", borderRadius: "8px", border: "none", fontSize: "14px" }}
              />
              <select
                value={booking.service}
                onChange={(e) => setBooking({ ...booking, service: e.target.value })}
                style={{ padding: "0.8rem", borderRadius: "8px", border: "none", fontSize: "14px", color: "#333" }}
              >
                <option>Checkup & Teeth Cleaning</option>
                <option>Cosmetic Whitening</option>
                <option>Dental Implants</option>
                <option>Invisalign & Orthodontics</option>
                <option>Emergency Care</option>
              </select>
              <button type="submit" style={{ background: "#0f172a", color: "#fff", padding: "0.9rem", borderRadius: "8px", border: "none", fontWeight: 700, cursor: "pointer", marginTop: "0.5rem" }}>
                Confirm Reservation →
              </button>
            </form>
          )}
        </div>
      </section>

      <section id="services" style={{ background: "#ffffff", padding: "5rem 2rem", borderTop: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto" }}>
            <h2 style={{ fontSize: "2.4rem", fontWeight: 800, color: "#0f172a" }}>Our Specialized Services</h2>
            <p style={{ color: "#64748b", marginTop: "0.5rem" }}>Gentle care designed for every stage of your oral health journey.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px", marginTop: "3rem" }}>
            {[
              { icon: "✨", title: "Cosmetic Whitening", desc: "Professional in-office laser whitening for up to 8 shades brighter in one hour." },
              { icon: "🦷", title: "Dental Implants", desc: "Permanent, natural-looking tooth replacements engineered for lifetime durability." },
              { icon: "🛡️", title: "Preventative Cleanings", desc: "Thorough digital imaging, plaque removal, and preventative enamel treatments." },
              { icon: "😁", title: "Invisalign Aligners", desc: "Discreet, removable clear aligners to straighten your teeth comfortably." },
              { icon: "⚡", title: "Emergency Care", desc: "Same-day appointments available for toothaches, fractures, and immediate relief." },
              { icon: "👑", title: "Crowns & Bridges", desc: "Custom ceramic porcelain crowns designed to match your natural smile perfectly." }
            ].map((s, i) => (
              <div key={i} style={{ background: "#f8fafc", padding: "2rem", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
                <span style={{ fontSize: "2rem" }}>{s.icon}</span>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginTop: "1rem", color: "#0f172a" }}>{s.title}</h3>
                <p style={{ color: "#64748b", fontSize: "0.95rem", marginTop: "0.5rem", lineHeight: 1.5 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer style={{ background: "#0f172a", color: "#94a3b8", padding: "3rem 2rem", textAlign: "center", borderTop: "1px solid #1e293b" }}>
        <p style={{ fontWeight: 700, color: "#fff", fontSize: "1.1rem" }}>${businessName}</p>
        <p style={{ marginTop: "0.5rem", fontSize: "0.9rem" }}>Contact: ${phone} | Open Monday - Saturday</p>
        <p style={{ marginTop: "1rem", fontSize: "0.8rem" }}>© {new Date().getFullYear()} ${businessName}. All rights reserved.</p>
      </footer>
    </div>
  );
}
`;
    }
    if (isLaw) {
        return `"use client";

import { useState } from "react";

export default function LawPage() {
  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", color: "#0f172a", background: "#0f172a", minHeight: "100vh" }}>
      <header style={{ padding: "1.5rem 2rem", borderBottom: "1px solid #1e293b", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ color: "#fff", fontWeight: 800, fontSize: "1.3rem" }}>⚖️ ${businessName}</div>
        <a href="tel:${phone}" style={{ background: "#c5a059", color: "#0f172a", padding: "0.6rem 1.2rem", borderRadius: "6px", fontWeight: 700, textDecoration: "none" }}>Consultation: ${phone}</a>
      </header>
      <section style={{ padding: "6rem 2rem", textAlign: "center", maxWidth: "900px", margin: "0 auto", color: "#fff" }}>
        <h1 style={{ fontSize: "3.5rem", fontWeight: 900, lineHeight: 1.15 }}>Relentless Representation. Uncompromising Results.</h1>
        <p style={{ fontSize: "1.2rem", color: "#94a3b8", marginTop: "1.5rem" }}>At ${businessName}, we fight tirelessly to protect your rights, business, and family.</p>
      </section>
    </div>
  );
}
`;
    }
    // Default General Business / Service Template
    return `"use client";

import { useState } from "react";

export default function GeneralPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", color: "#0f172a", background: "#ffffff", minHeight: "100vh" }}>
      <header style={{ padding: "1.2rem 2rem", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontWeight: 800, fontSize: "1.25rem", color: "#0f172a", display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ background: "#0f172a", color: "#fff", width: "32px", height: "32px", borderRadius: "8px", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>✦</span>
          ${businessName}
        </div>
        <a href="tel:${phone}" style={{ background: "#0f172a", color: "#fff", padding: "0.6rem 1.2rem", borderRadius: "8px", fontWeight: 700, textDecoration: "none" }}>Call ${phone}</a>
      </header>

      <section style={{ padding: "5rem 2rem", maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", alignItems: "center" }}>
        <div>
          <span style={{ background: "#f1f5f9", color: "#475569", padding: "0.4rem 0.8rem", borderRadius: "20px", fontSize: "12px", fontWeight: 700, textTransform: "uppercase" }}>Trusted Local Experts</span>
          <h1 style={{ fontSize: "3.2rem", fontWeight: 900, lineHeight: 1.15, marginTop: "1rem" }}>
            Premium Quality Services Provided by ${businessName}.
          </h1>
          <p style={{ fontSize: "1.1rem", color: "#64748b", marginTop: "1.2rem", lineHeight: 1.6 }}>
            Dedicated to excellence, customer satisfaction, and fast turnarounds for all your needs.
          </p>
        </div>

        <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "24px", padding: "2.5rem" }}>
          <h3 style={{ fontSize: "1.5rem", fontWeight: 800 }}>Get Your Free Consultation</h3>
          <p style={{ color: "#64748b", fontSize: "0.9rem", marginTop: "0.4rem" }}>Reach out directly to our support team.</p>
          <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} style={{ display: "grid", gap: "12px", marginTop: "1.2rem" }}>
            <input type="text" placeholder="Your Name" required style={{ padding: "0.8rem", borderRadius: "8px", border: "1px solid #cbd5e1" }} />
            <input type="tel" placeholder="Phone Number" required style={{ padding: "0.8rem", borderRadius: "8px", border: "1px solid #cbd5e1" }} />
            <textarea placeholder="How can we help you?" rows={3} style={{ padding: "0.8rem", borderRadius: "8px", border: "1px solid #cbd5e1" }} />
            <button type="submit" style={{ background: "#0f172a", color: "#fff", padding: "0.9rem", borderRadius: "8px", border: "none", fontWeight: 700, cursor: "pointer" }}>
              {submitted ? "Message Sent!" : "Submit Request →"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
`;
}
const customizeSiteTemplate = (sitePath, businessName, folderName, phone = "(212) 555-0142") => {
    try {
        const pagePath = path.join(sitePath, "app", "page.tsx");
        const customContent = generateCustomPageTsx(businessName, phone);
        fs.writeFileSync(pagePath, customContent, "utf-8");
        const pkgPath = path.join(sitePath, "package.json");
        if (fs.existsSync(pkgPath)) {
            let pkgContent = fs.readFileSync(pkgPath, "utf-8");
            pkgContent = pkgContent.replace(/"name":\s*"[^"]*"/, `"name": "${folderName}"`);
            fs.writeFileSync(pkgPath, pkgContent, "utf-8");
        }
    }
    catch (err) {
        console.error("Error customizing template for site:", err);
    }
};
export const createSite = async (req, res) => {
    const { name, phone } = req.body;
    if (!name || !phone || typeof name !== "string" || typeof phone !== "string") {
        return res.status(400).json({ error: "invalid parameters" });
    }
    const folderName = name.trim().toLowerCase().replaceAll(" ", "-").replace(/[^a-z0-9-_]/g, "");
    const sitesDir = path.resolve(process.cwd(), "sites");
    if (!fs.existsSync(sitesDir)) {
        fs.mkdirSync(sitesDir, { recursive: true });
    }
    // Check if site already exists in database
    let site = await siteModel.findOne({ name });
    if (site) {
        return res.status(200).json({ message: "Site already exists", site });
    }
    try {
        const assignedPort = await getNextPort();
        const termAId = `term-a-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        const termBId = `term-b-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        site = new siteModel({
            name,
            phone,
            port: assignedPort,
            isDeployed: false,
            terminals: [termAId, termBId]
        });
        await site.save();
        console.log(`Saved new site "${name}" to MongoDB with port ${assignedPort} and ID ${site._id}`);
        const sitePath = path.resolve(sitesDir, folderName);
        if (!fs.existsSync(sitePath)) {
            const templateSource = path.resolve(sitesDir, "almarino-caff");
            if (fs.existsSync(templateSource)) {
                console.log(`Copying template files to ${sitePath}...`);
                copyTemplateWithoutNodeModules(templateSource, sitePath);
                customizeSiteTemplate(sitePath, name, folderName, phone);
                console.log(`Running npm install in ${sitePath}...`);
                const ptyProcess = pty.spawn("/bin/zsh", [], {
                    name: "xterm-256color",
                    cols: 80,
                    rows: 30,
                    cwd: sitePath,
                    env: process.env,
                });
                ptyProcess.write("npm install\r");
            }
            else {
                const cmd = `npx --yes create-next-app@latest ${folderName} --yes`;
                console.log(`Running: ${cmd} in ${sitesDir} via node-pty`);
                const ptyProcess = pty.spawn("/bin/zsh", [], {
                    name: "xterm-256color",
                    cols: 80,
                    rows: 30,
                    cwd: sitesDir,
                    env: process.env,
                });
                ptyProcess.write(`${cmd} && exit 0\r`);
            }
        }
        return res.status(200).json({ message: "Site created successfully", site });
    }
    catch (err) {
        console.error("Error creating site in DB:", err);
        return res.status(500).json({ error: "Failed to save site to database", details: err.message });
    }
};
export const getAllSites = async (req, res) => {
    try {
        const sites = await siteModel.find({});
        return res.status(200).json({ sites });
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to fetch sites", details: error.message });
    }
};
export const getSiteById = async (req, res) => {
    try {
        const { id } = req.params;
        const site = await siteModel.findById(id);
        if (!site) {
            return res.status(404).json({ error: "Site not found" });
        }
        return res.status(200).json({ site });
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to fetch site", details: error.message });
    }
};
export const startSiteServer = async (req, res) => {
    const { siteId } = req.body;
    if (!siteId) {
        return res.status(400).json({ error: "siteId is required" });
    }
    const site = await siteModel.findById(siteId);
    if (!site) {
        return res.status(404).json({ error: "Site not found" });
    }
    if (!site.port && !site.isDeployed) {
        site.port = await getNextPort();
        await site.save();
    }
    const devPort = site.port || 10000;
    const siteDir = getSiteDir(site.name);
    const firstCmd = `npx next dev -p ${devPort}`;
    let terminalA = terminals.get(site.terminals[0]);
    if (!terminalA) {
        console.log(`[startSiteServer]: Starting Terminal A dev server for ${site.name} on port ${devPort} in ${siteDir}`);
        terminalA = pty.spawn("/bin/zsh", [], {
            name: "xterm-256color",
            cols: 80,
            rows: 30,
            cwd: siteDir,
            env: { ...process.env, PORT: String(devPort) }
        });
        terminals.set(site.terminals[0], terminalA);
        terminalA.onExit(() => {
            terminals.delete(site.terminals[0]);
        });
        terminalA.onData((data) => {
            console.log(`[TerminalA DevServer ${devPort}]:`, data);
        });
        terminalA.write(`${firstCmd}\r`);
        return res.status(200).json({
            message: `Site dev server started in Terminal A on port ${devPort}`,
            port: devPort,
            isRunning: true,
            isNewProcess: true
        });
    }
    return res.status(200).json({
        message: `Site dev server already running in Terminal A on port ${devPort}`,
        port: devPort,
        isRunning: true,
        isNewProcess: false
    });
};
const terminalErrors = new Map();
export const editSite = async (req, res) => {
    const { siteId, prompt } = req.body;
    if (!siteId || !prompt || typeof prompt !== "string") {
        return res.status(400).json({ error: "invalid params" });
    }
    const site = await siteModel.findById(siteId);
    if (!site) {
        return res.status(400).json({ error: "invalid params" });
    }
    if (!site.port && !site.isDeployed) {
        site.port = await getNextPort();
        await site.save();
    }
    const devPort = site.port || 10000;
    const cmd = "agy";
    const siteDir = getSiteDir(site.name);
    let terminalB = terminals.get(site.terminals[1]);
    if (!terminalB) {
        terminalB = pty.spawn("/bin/zsh", [], {
            name: "xterm-256color",
            cols: 80,
            rows: 30,
            cwd: siteDir,
            env: { ...process.env, PORT: String(devPort) }
        });
        terminals.set(site.terminals[1], terminalB);
        terminalB.onExit(() => {
            terminals.delete(site.terminals[1]);
            initializedTerminals.delete(site.terminals[1]);
            terminalErrors.delete(site.terminals[1]);
        });
        terminalB.onData((data) => {
            console.log(`[TerminalB agy]:`, data);
            if (data.includes("trust") || data.includes("Yes") || data.includes("yes")) {
                terminalB?.write("\r");
            }
            if (data.includes("experience so far") || data.includes("[0] Skip") || data.includes("Help us improve") || data.includes("[1] Good")) {
                terminalB?.write("0\r");
            }
            if (data.includes(">")) {
                terminalErrors.delete(site.terminals[1]);
            }
        });
        terminalB.write(`${cmd}\r`);
    }
    // Check if this is an internal server startup request
    const isInitCmd = prompt === "__INIT_SERVER__" || prompt === "Start site dev server";
    if (isInitCmd) {
        return res.status(200).json({ code: 200, message: `Dev server started on port ${devPort}`, port: devPort });
    }
    if (initializedTerminals.has(site.terminals[1])) {
        terminalErrors.delete(site.terminals[1]);
        terminalB.write(`${prompt}\r`);
        return res.status(200).json({ code: 200, message: "Changes applied successfully.", port: site.port });
    }
    if (terminalErrors.has(site.terminals[1])) {
        const errorMsg = terminalErrors.get(site.terminals[1]);
        terminalErrors.delete(site.terminals[1]);
        return res.status(400).json({ error: errorMsg, isVerifying: true });
    }
    let seenEmail = false;
    let listener;
    listener = terminalB.onData((data) => {
        if (data.includes("dumitruphilip123@gmail.com")) {
            seenEmail = true;
        }
        if (data.includes("experience so far") || data.includes("[0] Skip") || data.includes("Help us improve") || data.includes("[1] Good")) {
            terminalB.write("0\r");
        }
        if (data.includes(">")) {
            terminalErrors.delete(site.terminals[1]);
        }
        if (seenEmail && data.includes(">")) {
            terminalB.write(`${prompt}\r`);
            initializedTerminals.add(site.terminals[1]);
            listener.dispose();
        }
    });
    return res.status(200).json({ code: 200, message: "Changes applied successfully.", port: site.port });
};
export const deploy = async (req, res) => {
    const { siteId } = req.body;
    const site = await siteModel.findById(siteId);
    if (!site) {
        return res.status(400).json({ error: "invalid params" });
    }
    const siteDir = getSiteDir(site.name);
    const actualFolderName = path.basename(siteDir);
    // Construct the actual deploy command using the correct directory path and fixing option formatting
    const cmd = `git init && git add . && (git commit -m "add files" || echo "No changes to commit") && git branch -M main && (gh repo create "${actualFolderName}" --public --source=. --remote=origin --push || git push -u origin main || echo "GitHub repo already exists or push failed") && vercel --prod --yes && cd .. && rm -rf "${actualFolderName}"`;
    // Stop dev server terminal if running
    try {
        const term0 = terminals.get(site.terminals[0]);
        if (term0) {
            try {
                process.kill(-term0.pid, "SIGINT");
            }
            catch (err) { }
            term0.kill();
        }
    }
    catch (err) { }
    try {
        const term1 = terminals.get(site.terminals[1]);
        if (term1) {
            try {
                process.kill(-term1.pid, "SIGINT");
            }
            catch (err) { }
            term1.kill();
        }
    }
    catch (err) { }
    // Get or spawn terminal B
    let terminal;
    try {
        terminal = pty.spawn("/bin/zsh", [], {
            name: "xterm-256color",
            cols: 80,
            rows: 30,
            cwd: siteDir,
            env: process.env
        });
        terminals.set(site.terminals[0], terminal);
    }
    catch (spawnErr) {
        console.error("Failed to spawn deploy terminal:", spawnErr);
        return res.status(500).json({ error: "Failed to spawn deploy terminal", details: spawnErr.message });
    }
    // Write the command after a brief delay so the shell can initialize properly
    setTimeout(() => {
        try {
            terminal.write(`${cmd}\n`);
        }
        catch (err) {
            console.error("Error writing deploy command to terminal:", err);
        }
    }, 1000);
    terminal.onData((data) => {
        console.log(data);
    });
    terminal.onExit(() => {
        terminals.delete(site.terminals[0]);
    });
    // Update deployment status in DB and remove dev port
    site.isDeployed = true;
    site.port = null;
    await site.save();
    return res.status(200).send("success");
};
export const getRunningSites = async (req, res) => {
    try {
        const sites = await siteModel.find({});
        const running = sites.filter(site => {
            const isARunning = site.terminals[0] ? terminals.has(site.terminals[0]) : false;
            const isBRunning = site.terminals[1] ? terminals.has(site.terminals[1]) : false;
            return isARunning || isBRunning;
        });
        return res.status(200).json({ running });
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to fetch running processes", details: error.message });
    }
};
//# sourceMappingURL=site.controller.js.map