import Database from "better-sqlite3";
import { MongoClient, GridFSBucket } from "mongodb";
import { createReadStream, existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pipeline } from "node:stream/promises";

const adminRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = path.dirname(adminRoot);
const envPath = path.join(adminRoot, ".env.local");
let envText = "";
try { envText = await readFile(envPath, "utf8"); } catch { /* Render supplies environment variables directly. */ }
const envValue = key => process.env[key] || envText.match(new RegExp(`^${key}\\s*=\\s*["']?([^"'\\r\\n]+)["']?\\s*$`, "m"))?.[1];
const uri = envValue("DATABASE_URL");
if (!uri?.startsWith("mongodb://") && !uri?.startsWith("mongodb+srv://")) {
  throw new Error("DATABASE_URL must contain your MongoDB Atlas connection string.");
}

const sqlitePath = path.join(adminRoot, ".data", "hnh.sqlite");
const client = new MongoClient(uri, { maxPoolSize: 5, serverSelectionTimeoutMS: 10_000 });
try {
  await client.connect();
  const database = client.db(process.env.MONGODB_DATABASE || "hidenhype");
  await database.command({ ping: 1 });
  await Promise.all([
    database.collection("cms_items").createIndex({ collection: 1, created_at: -1 }),
    database.collection("cms_items").createIndex({ collection: 1, lookup_key: 1 }, { unique: true, partialFilterExpression: { lookup_key: { $type: "string" } } }),
    database.collection("admin_users").createIndex({ email: 1 }, { unique: true }),
  ]);

  if (!existsSync(sqlitePath)) {
    console.log("MongoDB connection is ready. No local SQLite database needs importing.");
    process.exitCode = 0;
  } else if (await database.collection("cms_meta").findOne({ _id: "sqlite-import-v1" })) {
    console.log("Local SQLite data was already imported to MongoDB.");
  } else {
    const sqlite = new Database(sqlitePath, { readonly: true, fileMustExist: true });
    const hasTable = name => Boolean(sqlite.prepare("SELECT 1 FROM sqlite_master WHERE type='table' AND name=?").get(name));
    const items = hasTable("cms_items") ? sqlite.prepare("SELECT * FROM cms_items ORDER BY created_at").all() : [];
    const admins = hasTable("admin_users") ? sqlite.prepare("SELECT * FROM admin_users ORDER BY created_at").all() : [];
    sqlite.close();

    const cms = database.collection("cms_items");
    for (const row of items) {
      let data;
      try { data = JSON.parse(row.data); } catch { continue; }
      for (const key of ["image", "url", "thumbnail", "coverImage"]) {
        if (typeof data[key] === "string" && data[key].startsWith("/uploads/")) data[key] = data[key].replace(/^\/uploads\//, "/api/media/");
      }
      let document = { _id: row.id, collection: row.collection, lookup_key: row.lookup_key || null, data, created_at: row.created_at, updated_at: row.updated_at };
      const duplicate = document.lookup_key ? await cms.findOne({ collection: document.collection, lookup_key: document.lookup_key }) : null;
      if (duplicate) {
        document = { ...document, _id: duplicate._id };
        document.data.id = duplicate._id;
        await cms.replaceOne({ _id: duplicate._id }, document);
      } else {
        await cms.updateOne({ _id: document._id }, { $setOnInsert: document }, { upsert: true });
      }
    }

    const adminUsers = database.collection("admin_users");
    for (const row of admins) {
      const duplicate = await adminUsers.findOne({ email: String(row.email).toLowerCase() });
      const document = { _id: duplicate?._id ?? row.id, email: String(row.email).toLowerCase(), name: row.name, password_hash: row.password_hash, role: row.role, status: row.status, created_at: row.created_at, updated_at: row.updated_at };
      await adminUsers.replaceOne({ _id: document._id }, document, { upsert: true });
    }

    const bucket = new GridFSBucket(database, { bucketName: "media" });
    const oldUploadFolders = [path.join(adminRoot, "public", "uploads"), path.join(adminRoot, ".data", "uploads")];
    let importedImages = 0;
    for (const folder of oldUploadFolders) {
      if (!existsSync(folder)) continue;
      for (const filename of await readdir(folder)) {
        if (!/^[0-9a-f-]{36}\.(jpg|png|webp|gif)$/i.test(filename)) continue;
        if (await bucket.find({ filename }).limit(1).hasNext()) continue;
        const extension = filename.split(".").pop().toLowerCase();
        const contentType = { jpg: "image/jpeg", png: "image/png", webp: "image/webp", gif: "image/gif" }[extension];
        await pipeline(createReadStream(path.join(folder, filename)), bucket.openUploadStream(filename, { metadata: { contentType } }));
        importedImages += 1;
      }
    }

    await database.collection("cms_meta").insertOne({ _id: "sqlite-import-v1", imported_at: new Date().toISOString(), itemCount: items.length, adminCount: admins.length, imageCount: importedImages });
    console.log(`Imported ${items.length} CMS records, ${admins.length} admin accounts, and ${importedImages} images to MongoDB.`);
  }
} finally {
  await client.close();
}
