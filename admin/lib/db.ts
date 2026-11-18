import Database from "better-sqlite3";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { hashPassword } from "@/lib/password";

type DbGlobal = typeof globalThis & { hnhSqlite?: Database.Database };
const adminRoot = path.basename(process.cwd()) === "admin" ? process.cwd() : path.join(process.cwd(), "admin");
const configuredPath = process.env.DATABASE_URL?.startsWith("file:") ? process.env.DATABASE_URL.slice(5) : ".data/hnh.sqlite";
const databasePath = path.isAbsolute(configuredPath) ? configuredPath : path.resolve(adminRoot, configuredPath);
const migrations = [readFileSync(path.join(adminRoot, "prisma/migrations/001_init/migration.sql"), "utf8")];

function applyMigrations(database: Database.Database) {
  database.exec("CREATE TABLE IF NOT EXISTS schema_migrations (version INTEGER PRIMARY KEY, applied_at TEXT NOT NULL)");
  const applied = new Set((database.prepare("SELECT version FROM schema_migrations").all() as { version: number }[]).map(row => row.version));
  migrations.forEach((sql, index) => {
    const version = index + 1;
    if (applied.has(version)) return;
    const migrate = database.transaction(() => {
      database.exec(sql);
      database.prepare("INSERT INTO schema_migrations(version, applied_at) VALUES (?, ?)").run(version, new Date().toISOString());
    });
    migrate();
  });
}

function migrateLegacyJson(database: Database.Database) {
  const existingCount = database.prepare("SELECT COUNT(*) AS count FROM cms_items").get() as { count: number } | undefined;
  if (Number(existingCount?.count ?? 0) > 0) return;
  const legacyFile = path.join(adminRoot, ".data/cms.json");
  if (!existsSync(legacyFile)) return;
  try {
    const legacy = JSON.parse(readFileSync(legacyFile, "utf8")) as Record<string, Array<Record<string, unknown>>>;
    const insert = database.prepare("INSERT OR IGNORE INTO cms_items(id, collection, lookup_key, data, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)");
    const tx = database.transaction(() => {
      for (const [collection, items] of Object.entries(legacy)) {
        if (!Array.isArray(items) || collection === "admins") continue;
        for (const item of items) {
          if (typeof item.id !== "string") continue;
          const now = String(item.createdAt ?? new Date().toISOString());
          const lookup = collection === "products" || collection === "categories" ? String(item.slug ?? "").toLowerCase() : collection === "coupons" ? String(item.code ?? "").toLowerCase() : collection === "subscribers" ? String(item.email ?? "").toLowerCase() : null;
          insert.run(item.id, collection, lookup || null, JSON.stringify(item), now, String(item.updatedAt ?? now));
        }
      }
    });
    tx();
  } catch (error) { console.error("Could not import legacy CMS JSON data:", error); }
}

function ensureOwner(database: Database.Database) {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  if (!email || !passwordHash || database.prepare("SELECT 1 FROM admin_users LIMIT 1").get()) return;
  const now = new Date().toISOString();
  database.prepare("INSERT INTO admin_users(id,email,name,password_hash,role,status,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?)")
    .run(randomUUID(), email, "Store Owner", passwordHash, "owner", "active", now, now);
}

export function getDb() {
  const shared = globalThis as DbGlobal;
  if (shared.hnhSqlite) return shared.hnhSqlite;
  const database = new Database(databasePath);
  database.pragma("journal_mode = WAL");
  database.pragma("foreign_keys = ON");
  applyMigrations(database);
  migrateLegacyJson(database);
  ensureOwner(database);
  shared.hnhSqlite = database;
  return database;
}

export function publicAdmin(user: Record<string, unknown>) {
  return { id: user.id, email: user.email, name: user.name, role: user.role, status: user.status, createdAt: user.created_at };
}
