import Database from "better-sqlite3";
import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const adminRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
let configuredUrl = process.env.DATABASE_URL;
if (!configuredUrl) {
  try {
    const envFile = await readFile(path.join(adminRoot, ".env.local"), "utf8");
    configuredUrl = envFile.match(/^DATABASE_URL\s*=\s*["']?([^"'\r\n]+)["']?\s*$/m)?.[1];
  } catch { /* The default local database path is used when no env file exists. */ }
}
const configured = configuredUrl?.startsWith("file:") ? configuredUrl.slice(5) : ".data/hnh.sqlite";
const databasePath = path.isAbsolute(configured) ? configured : path.resolve(adminRoot, configured);
await mkdir(path.dirname(databasePath), { recursive: true });
const database = new Database(databasePath);
const sql = await readFile(path.join(adminRoot, "prisma/migrations/001_init/migration.sql"), "utf8");
database.exec("CREATE TABLE IF NOT EXISTS schema_migrations (version INTEGER PRIMARY KEY, applied_at TEXT NOT NULL)");
if (!database.prepare("SELECT 1 FROM schema_migrations WHERE version=1").get()) {
  const apply = database.transaction(() => {
    database.exec(sql);
    database.prepare("INSERT INTO schema_migrations(version, applied_at) VALUES(1, ?)").run(new Date().toISOString());
  });
  apply();
}
database.close();
console.log(`CMS SQLite migrations are up to date: ${databasePath}`);
