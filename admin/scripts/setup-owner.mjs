import { randomBytes, scryptSync } from "node:crypto";
import { createInterface } from "node:readline";
import { spawnSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Database from "better-sqlite3";

const adminRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = path.dirname(adminRoot);
const envPath = path.join(adminRoot, ".env.local");
const interactive = Boolean(process.stdin.isTTY && process.stdin.setRawMode);
let rl;
let pipedAnswers = [];
if (interactive) rl = createInterface({ input: process.stdin, output: process.stdout });
else {
  let input = "";
  process.stdin.setEncoding("utf8");
  for await (const chunk of process.stdin) input += chunk;
  pipedAnswers = input.split(/\r?\n/).filter((line, index, lines) => !(index === lines.length - 1 && line === ""));
}
const ask = question => interactive ? new Promise(resolve => rl.question(question, resolve)) : (process.stdout.write(question), Promise.resolve(pipedAnswers.shift() ?? ""));
function askPassword() {
  if (!interactive) return ask("Admin password (minimum 12 characters): ");
  return new Promise((resolve, reject) => {
    process.stdout.write("Admin password (minimum 12 characters): ");
    let value = "";
    process.stdin.setRawMode(true);
    process.stdin.resume();
    const finish = () => { process.stdin.setRawMode(false); process.stdin.pause(); process.stdin.removeListener("data", onData); process.stdout.write("\n"); };
    const onData = chunk => {
      const key = chunk.toString("utf8");
      if (key === "\u0003") { finish(); reject(new Error("Setup cancelled.")); return; }
      if (key === "\r" || key === "\n") { finish(); resolve(value); return; }
      if (key === "\u007f" || key === "\b") { value = value.slice(0, -1); process.stdout.write("\b \b"); return; }
      if (key >= " " && key !== "\u007f") { value += key; process.stdout.write("*"); }
    };
    process.stdin.on("data", onData);
  });
}
function readEnvValue(contents, key) {
  const line = contents.split(/\r?\n/).find(row => row.startsWith(`${key}=`));
  return line?.slice(key.length + 1).trim().replace(/^(["'])(.*)\1$/, "$2");
}
function setEnvValue(contents, key, value) {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const line = new RegExp(`^${escaped}=.*$`, "m");
  return line.test(contents) ? contents.replace(line, `${key}=${value}`) : `${contents.trimEnd()}\n${key}=${value}\n`;
}

try {
  const email = String(await ask("Admin email: ")).trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Please enter a valid email address.");
  if (interactive) rl.close();
  const password = String(await askPassword());
  if (password.length < 12 || password.length > 256) throw new Error("Password must be between 12 and 256 characters.");
  const confirmation = String(await askPassword()).trim();
  if (password !== confirmation) throw new Error("The passwords did not match. Please run setup again.");

  const salt = randomBytes(16);
  const passwordHash = `${salt.toString("hex")}:${scryptSync(password, salt, 64).toString("hex")}`;
  const sessionSecret = randomBytes(32).toString("hex");
  let envText = "";
  try { envText = await readFile(envPath, "utf8"); } catch { /* Create the file below on first setup. */ }
  envText = setEnvValue(envText, "ADMIN_EMAIL", email);
  envText = setEnvValue(envText, "ADMIN_PASSWORD_HASH", passwordHash);
  envText = setEnvValue(envText, "ADMIN_SESSION_SECRET", sessionSecret);
  if (!readEnvValue(envText, "DATABASE_URL")) envText = setEnvValue(envText, "DATABASE_URL", "file:.data/hnh.sqlite");
  if (!readEnvValue(envText, "STOREFRONT_ORIGIN")) envText = setEnvValue(envText, "STOREFRONT_ORIGIN", "http://localhost:5173");
  await mkdir(adminRoot, { recursive: true });
  await writeFile(envPath, envText, { mode: 0o600 });

  const migration = spawnSync(process.execPath, [path.join(adminRoot, "scripts/migrate.mjs")], { cwd: workspaceRoot, stdio: "inherit" });
  if (migration.status !== 0) throw new Error("Database setup failed. Check the migration output above.");
  const databaseUrl = readEnvValue(envText, "DATABASE_URL") ?? "file:.data/hnh.sqlite";
  const configuredPath = databaseUrl.startsWith("file:") ? databaseUrl.slice(5) : ".data/hnh.sqlite";
  const databasePath = path.isAbsolute(configuredPath) ? configuredPath : path.resolve(adminRoot, configuredPath);
  const db = new Database(databasePath);
  const now = new Date().toISOString();
  const existing = db.prepare("SELECT id FROM admin_users WHERE email=? COLLATE NOCASE").get(email);
  if (existing) db.prepare("UPDATE admin_users SET password_hash=?, status='active', role='owner', updated_at=? WHERE email=? COLLATE NOCASE").run(passwordHash, now, email);
  else db.prepare("INSERT INTO admin_users(id,email,name,password_hash,role,status,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?)").run(randomBytes(16).toString("hex"), email, "Store Owner", passwordHash, "owner", "active", now, now);
  db.close();
  process.stdout.write(`\nAdmin account is ready for ${email}.\n`);
} catch (error) {
  process.stderr.write(`\n${error instanceof Error ? error.message : "Admin setup failed."}\n`);
  process.exitCode = 1;
} finally { rl?.close(); }
