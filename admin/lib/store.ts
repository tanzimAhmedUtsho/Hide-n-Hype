import { randomUUID } from "node:crypto";
import { getDb, publicAdmin } from "@/lib/db";
import { hashPassword } from "@/lib/password";

export const collections = ["products", "categories", "media", "pages", "articles", "videos", "orders", "coupons", "subscribers", "admins"] as const;
export type Collection = typeof collections[number];
export type Entry = { id: string; [key: string]: unknown };
type DbItem = { _id: string; collection: string; lookup_key: string | null; data: Entry; created_at: string; updated_at: string };
type AdminRecord = { _id: string; email: string; name: string; password_hash: string; role: string; status: string; created_at: string; updated_at: string };

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

async function seedIfNeeded() {
  const db = await getDb();
  const items = db.collection<DbItem>("cms_items");
  if (await items.countDocuments()) return;
  const now = new Date().toISOString();
  const values = [["products", starterProducts], ["categories", seedCategories], ["pages", seedPages]] as const;
  await items.insertMany(values.flatMap(([collection, entries]) => entries.map(item => ({
    _id: item.id, collection, lookup_key: lookupKey(collection, item), data: item as Entry, created_at: now, updated_at: now,
  }))));
}

export async function listItems(collection: Collection): Promise<Entry[]> {
  const db = await getDb();
  if (collection === "admins") {
    const admins = await db.collection<AdminRecord>("admin_users").find().sort({ created_at: -1 }).toArray();
    return admins.map(admin => publicAdmin(admin) as Entry);
  }
  await seedIfNeeded();
  const rows = await db.collection<DbItem>("cms_items").find({ collection }).sort({ created_at: -1 }).toArray();
  return rows.map(row => row.data);
}

export async function getSummary() {
  await seedIfNeeded();
  const db = await getDb();
  const items = db.collection<DbItem>("cms_items");
  const [orders, products] = await Promise.all([
    items.find({ collection: "orders" }).sort({ created_at: -1 }).toArray(),
    items.countDocuments({ collection: "products" }),
  ]);
  const orderData = orders.map(row => row.data);
  return { products, orders: orderData.length, pending: orderData.filter(o => String(o.status).toLowerCase() === "pending").length, sales: orderData.reduce((sum, order) => sum + Number(order.total ?? 0), 0), recentOrders: orderData.slice(0, 5) };
}

export async function upsertItem(collection: Collection, input: Record<string, unknown>, id?: string): Promise<Entry | null> {
  if (collection === "admins") return upsertAdmin(input, id);
  const db = await getDb();
  const items = db.collection<DbItem>("cms_items");
  const now = new Date().toISOString();
  const key = lookupKey(collection, input);
  if (key && await items.findOne({ collection, lookup_key: key, _id: { $ne: id ?? "" } })) return null;
  const existing = id ? await items.findOne({ _id: id, collection }) : null;
  if (id && !existing) return null;
  const current = existing?.data ?? { id: "" };
  const item: Entry = { ...current, ...input, id: existing?._id ?? randomUUID(), createdAt: current.createdAt ?? now, updatedAt: now };
  const document: DbItem = { _id: item.id, collection, lookup_key: key, data: item, created_at: existing?.created_at ?? now, updated_at: now };
  try {
    await items.replaceOne({ _id: item.id }, document, { upsert: true });
    return item;
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === 11000) return null;
    throw error;
  }
}

async function upsertAdmin(input: Record<string, unknown>, id?: string): Promise<Entry | null> {
  const db = await getDb();
  const admins = db.collection<AdminRecord>("admin_users");
  const email = String(input.email ?? "").trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("A valid admin email is required.");
  const existing = id ? await admins.findOne({ _id: id }) : null;
  if (id && !existing) return null;
  if (await admins.findOne({ email, _id: { $ne: id ?? "" } })) throw new Error("An admin account already uses that email.");
  const now = new Date().toISOString();
  const role = String(input.role || existing?.role || "editor").toLowerCase().replaceAll(" ", "_");
  const status = String(input.status || existing?.status || "active").toLowerCase();
  if (!["owner", "editor", "orders_manager"].includes(role)) throw new Error("Invalid admin role.");
  if (!["active", "invited", "disabled"].includes(status)) throw new Error("Invalid admin status.");
  const passwordHash = typeof input.password === "string" && input.password ? hashPassword(input.password) : existing?.password_hash;
  if (!passwordHash) throw new Error("A password of at least 12 characters is required for new admins.");
  const userId = id ?? randomUUID();
  const admin = { _id: userId, email, name: String(input.name ?? existing?.name ?? "Store Admin").trim(), password_hash: passwordHash, role, status, created_at: existing?.created_at ?? now, updated_at: now };
  try {
    await admins.replaceOne({ _id: userId }, admin, { upsert: true });
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === 11000) throw new Error("An admin account already uses that email.");
    throw error;
  }
  return publicAdmin(admin) as Entry;
}

export async function findAdminByEmail(email: string) {
  const admin = await (await getDb()).collection<AdminRecord>("admin_users").findOne({ email: email.trim().toLowerCase(), status: "active" });
  return admin ? { ...admin, id: admin._id } : undefined;
}
export async function findAdminById(id: string) {
  const admin = await (await getDb()).collection<AdminRecord>("admin_users").findOne({ _id: id, status: "active" });
  return admin ? { ...admin, id: admin._id } : undefined;
}

export async function deleteItem(collection: Collection, id: string): Promise<boolean> {
  const db = await getDb();
  if (collection === "admins") {
    const admins = db.collection<AdminRecord>("admin_users");
    const target = await admins.findOne({ _id: id });
    if (!target) return false;
    if (target.role === "owner" && await admins.countDocuments({ role: "owner", status: "active" }) <= 1) throw new Error("At least one active owner account must remain.");
    return (await admins.deleteOne({ _id: id })).deletedCount > 0;
  }
  return (await db.collection<DbItem>("cms_items").deleteOne({ _id: id, collection })).deletedCount > 0;
}

export async function addSubscriber(email: string, name = "", source = "website") {
  const normalized = email.trim().toLowerCase();
  const db = await getDb();
  const items = db.collection<DbItem>("cms_items");
  const current = await items.findOne({ collection: "subscribers", lookup_key: normalized });
  if (current) return { duplicate: true, item: current.data };
  const item = await upsertItem("subscribers", { email: normalized, name: name.trim(), source, status: "active", subscribedAt: new Date().toISOString() });
  return { duplicate: false, item };
}

export async function createOrderInquiry(input: { customer: string; email: string; phone: string; product: string; message: string }) {
  const orderNumber = `HNH-${Date.now().toString(36).toUpperCase()}`;
  return upsertItem("orders", { orderNumber, customer: input.customer.trim(), email: input.email.trim().toLowerCase(), phone: input.phone.trim(), shippingAddress: "", items: JSON.stringify([{ product: input.product.trim(), quantity: 1 }]), inquiry: input.message.trim(), total: 0, paymentStatus: "unpaid", status: "pending", type: "inquiry", source: "storefront" });
}
