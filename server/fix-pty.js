import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const prebuildsDir = path.resolve(__dirname, "node_modules", "node-pty", "prebuilds");

if (fs.existsSync(prebuildsDir)) {
  const platforms = ["darwin-arm64", "darwin-x64"];
  for (const plat of platforms) {
    const helperPath = path.join(prebuildsDir, plat, "spawn-helper");
    if (fs.existsSync(helperPath)) {
      try {
        fs.chmodSync(helperPath, 0o755);
        console.log(`Successfully set executable permissions on ${plat}/spawn-helper`);
      } catch (err) {
        console.error(`Failed to set permissions on ${helperPath}:`, err.message);
      }
    }
  }
}
