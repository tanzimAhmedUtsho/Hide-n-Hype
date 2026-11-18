import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const adminRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const root = path.dirname(adminRoot);
const envPath = path.join(adminRoot, ".env.local");
let envText = "";
try { envText = await readFile(envPath, "utf8"); } catch { /* Run first-time setup below. */ }
const hasValue = key => new RegExp(`^${key}=(?!paste-|replace-).+`, "m").test(envText);
if (!/^DATABASE_URL=["']?mongodb(?:\+srv)?:\/\//m.test(envText) || !hasValue("ADMIN_EMAIL") || !hasValue("ADMIN_PASSWORD_HASH") || !hasValue("ADMIN_SESSION_SECRET")) {
  const setup = spawn(process.execPath, [path.join(adminRoot, "scripts/setup-owner.mjs")], { cwd: root, stdio: "inherit" });
  const setupCode = await new Promise(resolve => setup.on("exit", resolve));
  if (setupCode !== 0) process.exit(Number(setupCode ?? 1));
}
const migration = spawn(process.execPath, [path.join(adminRoot, "scripts/migrate-sqlite-to-mongodb.mjs")], { cwd: root, stdio: "inherit" });
const migrationCode = await new Promise(resolve => migration.on("exit", resolve));
if (migrationCode !== 0) process.exit(Number(migrationCode ?? 1));
const next = spawn(process.execPath, [path.join(root, "node_modules/next/dist/bin/next"), "dev", "admin"], { cwd: root, stdio: "inherit" });
next.on("exit", code => process.exit(code ?? 0));
