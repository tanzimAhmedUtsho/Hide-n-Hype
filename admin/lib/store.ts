import { randomUUID } from "node:crypto";
import { getDb, publicAdmin } from "@/lib/db";
import { hashPassword } from "@/lib/password";

export const collections = ["products", "categories", "media", "pages", "articles", "videos", "orders", "coupons", "subscribers", "admins"] as const;
export type Collection = typeof collections[number];
export type Entry = { id: string; [key: string]: unknown };
type DbItem = { id: string; collection: string; lookup_key: string | null; data: string; created_at: string; updated_at: string };

const starterProducts = [
  { id: "p-shadow-tee", name: "Shadow Oversized Tee", slug: "shadow-oversized-tee", sku: "HNH-TEE-001", category: "T-shirts", price: 1290, salePrice: "", stock: 24, status: "published", image: "https://images.unsplash.com/photo-1779040620684-17e2384f2f1e?w=600&h=750&fit=crop&auto=format", sizes: "S, M, L, XL", colors: "Black, Bone", description: "Premium oversized cotton tee." },
  { id: "p-denim", name: "Classic Denim Jeans", slug: "classic-denim-jeans", sku: "HNH-DNM-001", category: "Denim", price: 2490, salePrice: "", stock: 12, status: "published", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=750&fit=crop&auto=format", sizes: "30, 32, 34, 36", colors: "Indigo, Black", description: "Everyday relaxed denim." },
];
const seedCategories = ["T-shirts", "Denim", "Hoodies", "Jackets", "Accessories"].map((name, i) => ({ id: `cat-${i + 1}`, name, slug: name.toLowerCase().replaceAll(" ", "-"), description: "" }));
const seedPages = ["Home", "About", "Contact", "FAQ", "Privacy Policy"].map(name => ({ id: name.toLowerCase().replaceAll(" ", "-"), title: name, slug: name.toLowerCase().replaceAll(" ", "-"), status: "published", content: "" }));

function lookupKey(collection: Collection, input: Record<string, unknown>) {
  if (collection === "products" || collection === "categories") return String(input.slug ?? "").trim().toLowerCase() || null;
  if (collection === "coupons") return String(input.code ?? "").trim().toLowerCase() || null;
  if (collection === "subscribers") return String(input.email ?? "").trim().toLowerCase() || null;
  return null;
}
function parseRow(row: DbItem): Entry { return JSON.parse(row.data) as Entry; }
function seedIfNeeded() {
  const db = getDb();
  const total = (db.prepare("SELECT COUNT(*) AS count FROM cms_items").get() as { count: number }).count;
  if (total) return;
  const put = db.prepare("INSERT OR IGNORE INTO cms_items(id,collection,lookup_key,data,created_at,updated_at) VALUES(?,?,?,?,?,?)");
  const now = new Date().toISOString();
  const tx = db.transaction(() => {
    for (const [collection, items] of [["products", starterProducts], ["categories", seedCategories], ["pages", seedPages]] as const) {
      for (const item of items) put.run(item.id, collection, lookupKey(collection, item), JSON.stringify(item), now, now);
    }
  });
  tx();
}
export async function listItems(collection: Collection): Promise<Entry[]> {
  const db = getDb();
  if (collection === "admins") return (db.prepare("SELECT * FROM admin_users ORDER BY created_at DESC").all() as Record<string, unknown>[]).map(publicAdmin) as Entry[];
  seedIfNeeded();
  return (db.prepare("SELECT * FROM cms_items WHERE collection = ? ORDER BY created_at DESC").all(collection) as DbItem[]).map(parseRow);
}
export async function getSummary() {
  seedIfNeeded();
  const db = getDb();
  const orders = (db.prepare("SELECT data FROM cms_items WHERE collection='orders' ORDER BY created_at DESC").all() as { data: string }[]).map(row => JSON.parse(row.data) as Entry);
  const products = (db.prepare("SELECT COUNT(*) AS count FROM cms_items WHERE collection='products'").get() as { count: number }).count;
  return { products, orders: orders.length, pending: orders.filter(o => String(o.status).toLowerCase() === "pending").length, sales: orders.reduce((sum, order) => sum + Number(order.total ?? 0), 0), recentOrders: orders.slice(0, 5) };
}
export async function upsertItem(collection: Collection, input: Record<string, unknown>, id?: string): Promise<Entry | null> {
  const db = getDb();
  if (collection === "admins") return upsertAdmin(input, id);
  const items = db.prepare("SELECT * FROM cms_items WHERE collection=?").all(collection) as DbItem[];
  const now = new Date().toISOString();
  const key = lookupKey(collection, input);
  const duplicate = key ? items.find(row => row.lookup_key === key && row.id !== id) : undefined;
  if (duplicate) return null;
  const existing = id ? items.find(row => row.id === id) : undefined;
  if (id && !existing) return null;
  const current: Entry = existing ? parseRow(existing) : { id: "" };
  const item = { ...current, ...input, id: existing?.id ?? randomUUID(), createdAt: current.createdAt ?? now, updatedAt: now };
  if (existing) db.prepare("UPDATE cms_items SET lookup_key=?, data=?, updated_at=? WHERE id=? AND collection=?").run(key, JSON.stringify(item), now, id, collection);
  else db.prepare("INSERT INTO cms_items(id,collection,lookup_key,data,created_at,updated_at) VALUES(?,?,?,?,?,?)").run(item.id, collection, key, JSON.stringify(item), now, now);
  return item;
}
function upsertAdmin(input: Record<string, unknown>, id?: string): Entry | null {
  const db = getDb(); const email = String(input.email ?? "").trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("A valid admin email is required.");
  const existing = id ? db.prepare("SELECT * FROM admin_users WHERE id=?").get(id) as Record<string, unknown> | undefined : undefined;
  if (id && !existing) return null;
  const collision = db.prepare("SELECT id FROM admin_users WHERE email=? COLLATE NOCASE AND id != ?").get(email, id ?? "") as { id: string } | undefined;
  if (collision) throw new Error("An admin account already uses that email.");
  const now = new Date().toISOString();
  const role = String(input.role || existing?.role || "editor").toLowerCase().replaceAll(" ", "_");
  const status = String(input.status || existing?.status || "active").toLowerCase();
  if (!["owner", "editor", "orders_manager"].includes(role)) throw new Error("Invalid admin role.");
  if (!["active", "invited", "disabled"].includes(status)) throw new Error("Invalid admin status.");
  const passwordHash = typeof input.password === "string" && input.password ? hashPassword(input.password) : existing?.password_hash;
  if (!passwordHash) throw new Error("A password of at least 12 characters is required for new admins.");
  const userId = id ?? randomUUID();
  if (existing) db.prepare("UPDATE admin_users SET email=?, name=?, password_hash=?, role=?, status=?, updated_at=? WHERE id=?").run(email, String(input.name ?? existing.name).trim(), passwordHash, role, status, now, id);
  else db.prepare("INSERT INTO admin_users(id,email,name,password_hash,role,status,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?)").run(userId, email, String(input.name ?? "Store Admin").trim(), passwordHash, role, status, now, now);
  return publicAdmin(db.prepare("SELECT * FROM admin_users WHERE id=?").get(userId) as Record<string, unknown>) as Entry;
}
export async function findAdminByEmail(email: string) { return getDb().prepare("SELECT * FROM admin_users WHERE email=? COLLATE NOCASE AND status='active'").get(email) as Record<string, unknown> | undefined; }
export async function findAdminById(id: string) { return getDb().prepare("SELECT * FROM admin_users WHERE id=? AND status='active'").get(id) as Record<string, unknown> | undefined; }
export async function deleteItem(collection: Collection, id: string): Promise<boolean> {
  const db = getDb();
  if (collection === "admins") {
    const target = db.prepare("SELECT role FROM admin_users WHERE id=?").get(id) as { role: string } | undefined;
    if (!target) return false;
    if (target.role === "owner" && Number((db.prepare("SELECT COUNT(*) AS count FROM admin_users WHERE role='owner' AND status='active'").get() as { count: number }).count) <= 1) throw new Error("At least one active owner account must remain.");
    return db.prepare("DELETE FROM admin_users WHERE id=?").run(id).changes > 0;
  }
  return db.prepare("DELETE FROM cms_items WHERE id=? AND collection=?").run(id, collection).changes > 0;
}
export async function addSubscriber(email: string, name = "", source = "website") {
  const normalized = email.trim().toLowerCase();
  const current = (getDb().prepare("SELECT data FROM cms_items WHERE collection='subscribers' AND lookup_key=?").get(normalized) as { data: string } | undefined);
  if (current) return { duplicate: true, item: JSON.parse(current.data) as Entry };
  const item = await upsertItem("subscribers", { email: normalized, name: name.trim(), source, status: "active", subscribedAt: new Date().toISOString() });
  return { duplicate: false, item };
}
export async function createOrderInquiry(input: { customer: string; email: string; phone: string; product: string; message: string }) {
  const orderNumber = `HNH-${Date.now().toString(36).toUpperCase()}`;
  return upsertItem("orders", { orderNumber, customer: input.customer.trim(), email: input.email.trim().toLowerCase(), phone: input.phone.trim(), shippingAddress: "", items: JSON.stringify([{ product: input.product.trim(), quantity: 1 }]), inquiry: input.message.trim(), total: 0, paymentStatus: "unpaid", status: "pending", type: "inquiry", source: "storefront" });
}
