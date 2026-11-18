import { randomBytes, scryptSync } from "node:crypto";
import { MongoClient } from "mongodb";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { fileURLToPath } from "node:url";

const adminRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const envPath = path.join(adminRoot, ".env.local");
let env = {};
try {
  const text = await readFile(envPath, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (match) env[match[1]] = match[2].replace(/^(["'])(.*)\1$/, "$2");
  }
} catch { /* First run. */ }

const ask = async (label, fallback = "") => {
  const rl = createInterface({ input: stdin, output: stdout });
  try { return (await rl.question(`${label}${fallback ? ` [${fallback}]` : ""}: `)).trim() || fallback; }
  finally { rl.close(); }
};
const askSecret = async label => {
  if (!stdin.isTTY || typeof stdin.setRawMode !== "function") return ask(label);
  stdout.write(`${label}: `);
  stdin.setEncoding("utf8");
  stdin.setRawMode(true);
  stdin.resume();
  let value = "";
  return new Promise((resolve, reject) => {
    const finish = error => {
      stdin.off("data", onData);
      stdin.setRawMode(false);
      if (error) reject(error); else resolve(value);
    };
    const onData = chunk => {
      for (const char of chunk) {
        if (char === "\r" || char === "\n") { stdout.write("\n"); finish(); return; }
        if (char === "\u0003") { finish(new Error("Setup cancelled.")); return; }
        if (char === "\u007f" || char === "\b") value = value.slice(0, -1);
        else value += char;
      }
    };
    stdin.on("data", onData);
  });
};

if (!env.DATABASE_URL?.startsWith("mongodb://") && !env.DATABASE_URL?.startsWith("mongodb+srv://")) {
    console.log("Paste the MongoDB Atlas application connection string. Input stays hidden and is saved only in ignored admin/.env.local.");
    while (true) {
      const uri = await askSecret("MongoDB URI");
      if (!uri.startsWith("mongodb://") && !uri.startsWith("mongodb+srv://")) {
        console.log("That does not look like a MongoDB connection string. Try again.");
        continue;
      }
      const client = new MongoClient(uri, { serverSelectionTimeoutMS: 8000 });
      try {
        await client.connect();
        await client.db("hidenhype").command({ ping: 1 });
        env.DATABASE_URL = uri;
        console.log("MongoDB Atlas connection verified.");
        break;
      } catch {
        console.log("MongoDB connection failed. Check the username, password, network access list, and database user permissions; try again.");
      } finally { await client.close().catch(() => {}); }
    }
}

if (!env.ADMIN_EMAIL || !env.ADMIN_PASSWORD_HASH) {
    env.ADMIN_EMAIL = await ask("Admin email", env.ADMIN_EMAIL || "admin@example.com");
    let password = "";
    while (password.length < 12) {
      password = await askSecret("Admin password (at least 12 characters)");
      if (password.length < 12) console.log("Use at least 12 characters.");
    }
    const salt = randomBytes(16);
    env.ADMIN_PASSWORD_HASH = `${salt.toString("hex")}:${scryptSync(password, salt, 64).toString("hex")}`;
}
env.ADMIN_SESSION_SECRET ||= randomBytes(32).toString("hex");
env.STOREFRONT_ORIGIN ||= "http://localhost:5173";
env.MONGODB_DATABASE ||= "hidenhype";
const ordered = ["DATABASE_URL", "MONGODB_DATABASE", "ADMIN_EMAIL", "ADMIN_PASSWORD_HASH", "ADMIN_SESSION_SECRET", "STOREFRONT_ORIGIN"];
const text = [...ordered.filter(key => env[key]), ...Object.keys(env).filter(key => !ordered.includes(key))]
  .map(key => `${key}=${JSON.stringify(env[key])}`).join("\n") + "\n";
await writeFile(envPath, text, { mode: 0o600 });
console.log("Local admin configuration saved.");
