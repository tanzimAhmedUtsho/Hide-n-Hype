import { randomUUID } from "node:crypto";
import { GridFSBucket, MongoClient, type Db } from "mongodb";

type DbGlobal = typeof globalThis & { hnhMongo?: Promise<Db> };
type AdminRecord = { _id: string; email: string; name: string; password_hash: string; role: string; status: string; created_at: string; updated_at: string };
const databaseName = process.env.MONGODB_DATABASE || "hidenhype";

async function connectDatabase(): Promise<Db> {
  const uri = process.env.DATABASE_URL;
  if (!uri?.startsWith("mongodb://") && !uri?.startsWith("mongodb+srv://")) {
    throw new Error("Set DATABASE_URL to your MongoDB Atlas connection string.");
  }

  const client = new MongoClient(uri, { maxPoolSize: 5, serverSelectionTimeoutMS: 10_000 });
  await client.connect();
  const database = client.db(databaseName);
  await Promise.all([
    database.collection("cms_items").createIndex({ collection: 1, created_at: -1 }),
    database.collection("cms_items").createIndex(
      { collection: 1, lookup_key: 1 },
      { unique: true, partialFilterExpression: { lookup_key: { $type: "string" } } },
    ),
    database.collection<AdminRecord>("admin_users").createIndex({ email: 1 }, { unique: true }),
    database.collection("customer_users").createIndex({ email: 1 }, { unique: true }),
  ]);

  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  if (email && passwordHash && !(await database.collection("admin_users").findOne({ email }))) {
    const now = new Date().toISOString();
    await database.collection<AdminRecord>("admin_users").insertOne({
      _id: randomUUID(), email, name: "Store Owner", password_hash: passwordHash,
      role: "owner", status: "active", created_at: now, updated_at: now,
    });
  }

  const metadata = database.collection<{ _id: string; imported_at?: string }>("cms_meta");
  const marker = await metadata.findOne({ _id: "legacy-json-import-v1" });
  if (!marker) {
    const { existsSync, readFileSync } = await import("node:fs");
    const path = await import("node:path");
    const adminRoot = path.basename(process.cwd()) === "admin" ? process.cwd() : path.join(process.cwd(), "admin");
    const legacyPath = path.join(adminRoot, ".data", "cms.json");
    if (existsSync(legacyPath)) {
      try {
        const legacy = JSON.parse(readFileSync(legacyPath, "utf8")) as Record<string, Array<Record<string, unknown>>>;
        const items = database.collection<{ _id: string; collection: string; lookup_key: string | null; data: Record<string, unknown>; created_at: string; updated_at: string }>("cms_items");
        for (const [collection, entries] of Object.entries(legacy)) {
          if (!Array.isArray(entries) || collection === "admins") continue;
          for (const item of entries) {
            if (typeof item.id !== "string") continue;
            const now = String(item.createdAt ?? new Date().toISOString());
            const lookup = collection === "products" || collection === "categories" ? String(item.slug ?? "").toLowerCase()
              : collection === "coupons" ? String(item.code ?? "").toLowerCase()
              : collection === "subscribers" ? String(item.email ?? "").toLowerCase() : null;
            await items.updateOne({ _id: item.id }, { $setOnInsert: {
              _id: item.id, collection, lookup_key: lookup || null, data: item,
              created_at: now, updated_at: String(item.updatedAt ?? now),
            } }, { upsert: true });
          }
        }
      } catch (error) {
        console.error("Could not import legacy CMS JSON data:", error);
      }
    }
    await metadata.updateOne({ _id: "legacy-json-import-v1" }, { $set: { imported_at: new Date().toISOString() } }, { upsert: true });
  }

  return database;
}

export function getDb(): Promise<Db> {
  const shared = globalThis as DbGlobal;
  if (!shared.hnhMongo) {
    shared.hnhMongo = connectDatabase().catch(error => {
      shared.hnhMongo = undefined;
      throw error;
    });
  }
  return shared.hnhMongo;
}

export async function getMediaBucket() {
  return new GridFSBucket(await getDb(), { bucketName: "media" });
}

export function publicAdmin(user: Record<string, unknown>) {
  return { id: user._id ?? user.id, email: user.email, name: user.name, role: user.role, status: user.status, createdAt: user.created_at };
}
