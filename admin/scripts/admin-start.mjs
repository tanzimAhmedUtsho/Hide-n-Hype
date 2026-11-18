import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const adminRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const root = path.dirname(adminRoot);
const migration = spawn(process.execPath, [path.join(adminRoot, "scripts/migrate-sqlite-to-mongodb.mjs")], { cwd: root, stdio: "inherit" });
const code = await new Promise(resolve => migration.on("exit", resolve));
if (code !== 0) process.exit(Number(code ?? 1));
const next = spawn(process.execPath, [path.join(root, "node_modules/next/dist/bin/next"), "start", "admin"], { cwd: root, stdio: "inherit" });
next.on("exit", status => process.exit(status ?? 0));
