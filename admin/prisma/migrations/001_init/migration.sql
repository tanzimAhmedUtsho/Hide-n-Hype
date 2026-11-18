CREATE TABLE IF NOT EXISTS "schema_migrations" (
  "version" INTEGER PRIMARY KEY,
  "applied_at" TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS "cms_items" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "collection" TEXT NOT NULL,
  "lookup_key" TEXT,
  "data" TEXT NOT NULL,
  "created_at" TEXT NOT NULL,
  "updated_at" TEXT NOT NULL,
  UNIQUE("collection", "lookup_key")
);
CREATE INDEX IF NOT EXISTS "cms_items_collection_idx" ON "cms_items"("collection");
CREATE TABLE IF NOT EXISTS "admin_users" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "email" TEXT NOT NULL UNIQUE COLLATE NOCASE,
  "name" TEXT NOT NULL,
  "password_hash" TEXT NOT NULL,
  "role" TEXT NOT NULL CHECK ("role" IN ('owner', 'editor', 'orders_manager')),
  "status" TEXT NOT NULL CHECK ("status" IN ('active', 'invited', 'disabled')),
  "created_at" TEXT NOT NULL,
  "updated_at" TEXT NOT NULL
);
