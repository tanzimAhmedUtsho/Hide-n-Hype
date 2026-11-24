"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { LayoutDashboard, Package, Tags, Images, FileText, Newspaper, Video, Users, ShoppingBag, Percent, Mail, ShieldCheck, Menu as MenuIcon, Trash2, RotateCcw, UserRound, ExternalLink } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { LandingPagesManager } from "@/components/LandingPagesManager";

type Item = { id: string; [key: string]: unknown };
type Section = "dashboard" | "products" | "categories" | "media" | "trash" | "pages" | "landingPages" | "articles" | "videos" | "team" | "orders" | "enquiries" | "customers" | "coupons" | "subscribers" | "admins";
const groups = [
  { title: "Overview", links: [["dashboard", "Dashboard", LayoutDashboard]] },
  { title: "Catalog", links: [["products", "Products", Package], ["categories", "Categories", Tags], ["media", "Media library", Images], ["trash", "Trash", Trash2]] },
  { title: "Content", links: [["pages", "Pages & content", FileText], ["landingPages", "Landing pages", ExternalLink], ["articles", "Articles / stories", Newspaper], ["videos", "Videos", Video], ["team", "Team members", Users]] },
  { title: "Commerce", links: [["orders", "Orders", ShoppingBag], ["enquiries", "Enquiries", Mail], ["customers", "Customers", UserRound], ["coupons", "Coupons", Percent], ["subscribers", "Subscribers", Mail]] },
  { title: "Settings", links: [["admins", "Admin users", ShieldCheck]] },
] as { title: string; links: [Section, string, LucideIcon][] }[];
const fields: Record<Exclude<Section, "dashboard">, [string, string, string?][]> = {
  products: [["name", "Product name"], ["slug", "URL slug (English)"], ["sku", "Product code (SKU)"], ["category", "Product category"], ["collection", "Website collection", "select:New Arrivals,Men,Women,Kids,Accessories,Leather,Denim,Riding Gear,Sale"], ["price", "Price (BDT, optional)", "number"], ["salePrice", "Sale price (BDT, optional)", "number"], ["stock", "Stock quantity (optional)", "number"], ["status", "Status", "select:Draft,Published"], ["image", "Main image URL"], ["galleryImages", "Additional images (optional)", "textarea"], ["sizes", "Sizes (comma separated)"], ["colors", "Available colors (comma separated)"], ["description", "Description", "textarea"], ["seoTitle", "Search title (optional)"], ["seoDescription", "Search description (optional)", "textarea"]],
  categories: [["name", "Category name"], ["slug", "Slug"], ["image", "Image URL"], ["description", "Description", "textarea"]],
  media: [["name", "Media name"], ["url", "Image URL"], ["alt", "Alt text"], ["productId", "Product ID"]],
  trash: [["name", "Product"], ["sku", "Product code"], ["collection", "Collection"], ["deletedAt", "Moved to trash"]],
  pages: [["title", "Page title"], ["slug", "Slug"], ["status", "Status", "select:Draft,Published"], ["content", "Page content", "textarea"]],
  landingPages: [],
  articles: [["title", "Title"], ["slug", "Slug"], ["excerpt", "Excerpt", "textarea"], ["coverImage", "Cover image URL"], ["status", "Status", "select:Draft,Published"], ["content", "Article content", "textarea"]],
  videos: [["title", "Video title"], ["url", "Video URL"], ["thumbnail", "Thumbnail URL"], ["status", "Status", "select:Draft,Published"]],
  team: [["name", "Full name"], ["designation", "Designation / role"], ["location", "Location"], ["image", "Portrait image URL"], ["bio", "Short biography", "textarea"], ["sortOrder", "Display order", "number"], ["status", "Visibility", "select:Active,Inactive"]],
  orders: [["orderNumber", "Order number"], ["customer", "Customer name"], ["email", "Email"], ["phone", "Phone"], ["shippingAddress", "Full address", "textarea"], ["items", "Items" , "textarea"], ["total", "Total (BDT)", "number"], ["paymentStatus", "Payment", "select:Unpaid,Paid,Refunded"], ["status", "Delivery status", "select:Pending,Processing,Shipped,Delivered,Cancelled"], ["deliveryCost", "Delivery cost (BDT)", "number"], ["inquiry", "Original enquiry", "textarea"]],
  enquiries: [["orderNumber", "Enquiry number"], ["customer", "Customer name"], ["email", "Email"], ["phone", "Phone"], ["shippingAddress", "Full address", "textarea"], ["inquiryType", "Enquiry type"], ["landingPageTitle", "Landing page source"], ["landingPageSlug", "Landing page URL"], ["utmSource", "UTM source"], ["utmMedium", "UTM medium"], ["utmCampaign", "UTM campaign"], ["inquiry", "Message", "textarea"], ["leadStatus", "Enquiry progress", "select:New,Contacted,Quoted,Confirmed,Closed"], ["followUpAt", "Next follow-up", "datetime-local"], ["adminNote", "Internal note", "textarea"], ["links", "Social / website links", "textarea"]],
  customers: [["name", "Customer name"], ["email", "Email address"], ["phone", "Phone / WhatsApp"], ["division", "Division"], ["district", "District"], ["postalCode", "Postal code"], ["address", "Delivery address"], ["createdAt", "Joined"]],
  coupons: [["code", "Coupon code"], ["type", "Discount type", "select:percent,fixed"], ["value", "Value", "number"], ["expiresAt", "Expiry date"], ["usageLimit", "Usage limit", "number"], ["status", "Status", "select:Active,Inactive"]],
  subscribers: [["email", "Email"], ["name", "Name"], ["status", "Status", "select:Active,Unsubscribed"]],
  admins: [["name", "Admin name"], ["email", "Email"], ["role", "Role", "select:Owner,Editor,Orders manager"], ["status", "Status", "select:Active,Invited,Disabled"], ["password", "Password (12+ characters; leave blank to keep current)", "password"]],
};
const orderTableFields = fields.orders.filter(([key]) => ["orderNumber", "customer", "phone", "shippingAddress", "status", "total"].includes(key));
const enquiryTableFields = fields.enquiries.filter(([key]) => ["orderNumber", "customer", "phone", "shippingAddress", "inquiryType", "landingPageTitle", "leadStatus", "followUpAt"].includes(key));
const label = (s: string) => s.replace(/([A-Z])/g, " $1").replace(/^./, c => c.toUpperCase());
const titleCase = (s: string) => s.replace(/\b\w/g, c => c.toUpperCase());
const toSlug = (value: string) => value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[\u0027\u2019]/g, "").replace(/&/g, " and ").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const isRequiredField = (section: Section, key: string, isNew: boolean) =>
  section === "products" ? ["name", "slug", "sku", "collection"].includes(key) :
  section === "categories" ? key === "name" :
  section === "team" ? ["name", "designation"].includes(key) :
  section === "admins" ? key === "email" || (isNew && key === "password") : false;

export default function AdminApp({ authenticated: initial, initialRole }: { authenticated: boolean; initialRole: "owner" | "editor" | "orders_manager" | null }) {
  const [authenticated, setAuthenticated] = useState(initial);
  const [role, setRole] = useState<"owner" | "editor" | "orders_manager" | null>(initialRole);
  const [section, setSection] = useState<Section>("dashboard"); const [items, setItems] = useState<Item[]>([]);
  const [summary, setSummary] = useState<{ products: number; orders: number; enquiries: number; pending: number; sales: number; followUpsDue: number; notificationReady: boolean; recentOrders: Item[]; recentEnquiries: Item[] } | null>(null);
  const [search, setSearch] = useState(""); const [leadFilter, setLeadFilter] = useState("all"); const [modal, setModal] = useState<Item | "new" | null>(null);
  const [followUpTarget, setFollowUpTarget] = useState<Item | null>(null); const [followUpValue, setFollowUpValue] = useState("");
  const [customerDetailTarget, setCustomerDetailTarget] = useState<Item | null>(null);
  const [form, setForm] = useState<Record<string, string>>({}); const [busy, setBusy] = useState(false); const [notice, setNotice] = useState(""); const [error, setError] = useState("");
  const [mobileNav, setMobileNav] = useState(false); const [page, setPage] = useState(1);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | "unsupported">("default");
  const load = useCallback(async (current: Section) => {
    if (current === "landingPages") return;
    if (current === "customers") {
      const r = await fetch("/api/customers", { cache: "no-store" });
      if (r.status === 401) { setAuthenticated(false); return; }
      if (r.ok) setItems(await r.json() as Item[]);
      else { const body = await r.json().catch(() => ({})); setError(body.error ?? "Could not load customer profiles."); }
      return;
    }
    if (current === "trash") {
      const r = await fetch("/api/trash", { cache: "no-store" });
      if (r.status === 401) { setAuthenticated(false); return; } if (r.ok) setItems(await r.json()); return;
    }
    if (current === "dashboard") {
      const r = await fetch("/api/data?summary=1", { cache: "no-store" });
      if (r.status === 401) { setAuthenticated(false); return; } if (r.ok) setSummary(await r.json()); return;
    }
    const collection = current === "enquiries" ? "orders" : current;
    const r = await fetch(`/api/data?collection=${collection}`, { cache: "no-store" });
    if (r.status === 401) { setAuthenticated(false); return; }
    if (r.ok) {
      const records = await r.json() as Item[];
      const isEnquiry = (item: Item) => { const type = String(item.type ?? "").toLowerCase(); return type ? ["inquiry", "contact"].includes(type) : ["storefront", "contact-form"].includes(String(item.source ?? "").toLowerCase()); };
      setItems(current === "enquiries" ? records.filter(isEnquiry) : current === "orders" ? records.filter(item => !isEnquiry(item)) : records);
    }
  }, []);
  useEffect(() => { if (authenticated) void load(section); }, [authenticated, section, load]);
  useEffect(() => { setNotificationPermission(typeof window !== "undefined" && "Notification" in window ? Notification.permission : "unsupported"); }, []);
  useEffect(() => {
    if (!authenticated || notificationPermission !== "granted" || !["owner", "orders_manager"].includes(String(role))) return;
    const checkDueReminders = async () => {
      try {
        const response = await fetch("/api/data?collection=orders", { cache: "no-store" });
        if (!response.ok) return;
        const orders = await response.json() as Item[];
        const now = Date.now();
        const storageKey = "hnh-followup-notifications-v1";
        const seen = new Set<string>(JSON.parse(localStorage.getItem(storageKey) ?? "[]"));
        let changed = false;
        for (const order of orders) {
          const dueAt = Date.parse(String(order.followUpAt ?? ""));
          const status = String(order.leadStatus ?? "new").toLowerCase();
          if (!Number.isFinite(dueAt) || dueAt > now || ["confirmed", "closed"].includes(status)) continue;
          const key = `${order.id}:${order.followUpAt}:${order.updatedAt ?? ""}`;
          if (seen.has(key)) continue;
          const notification = new Notification("Hide n Hype follow-up due", { body: `${String(order.customer ?? "Customer")} · ${String(order.orderNumber ?? "Enquiry")}`, tag: key });
          notification.onclick = () => { window.focus(); setSection("enquiries"); setLeadFilter("due"); notification.close(); };
          seen.add(key); changed = true;
        }
        if (changed) localStorage.setItem(storageKey, JSON.stringify([...seen]));
      } catch { /* Browser notifications are optional; the dashboard due count remains available. */ }
    };
    void checkDueReminders();
    const timer = window.setInterval(() => void checkDueReminders(), 60_000);
    return () => window.clearInterval(timer);
  }, [authenticated, notificationPermission, role]);
  const enableBrowserReminders = async () => {
    if (!("Notification" in window)) { setNotificationPermission("unsupported"); setNotice("This browser does not support notifications."); return; }
    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);
    setNotice(permission === "granted" ? "Browser follow-up alerts are enabled." : "Browser notifications were not allowed. You can still see due follow-ups on the Dashboard.");
  };
  const filtered = useMemo(() => items.filter(item => {
    if (!JSON.stringify(item).toLowerCase().includes(search.toLowerCase())) return false;
    if (section !== "enquiries" || leadFilter === "all") return true;
    if (leadFilter === "due") { const dueAt = Date.parse(String(item.followUpAt ?? "")); return Number.isFinite(dueAt) && dueAt <= Date.now() && !["confirmed", "closed"].includes(String(item.leadStatus ?? "new").toLowerCase()); }
    return String(item.leadStatus ?? "new").toLowerCase() === leadFilter;
  }), [items, search, section, leadFilter]);
  const pageSize = 10; const visible = filtered.slice((page - 1) * pageSize, page * pageSize);
  const currentFields = section === "dashboard" ? [] : fields[section];
  const visibleFields = section === "orders" ? orderTableFields : section === "enquiries" ? enquiryTableFields : currentFields.slice(0, section === "customers" ? 8 : section === "products" ? 8 : section === "admins" ? 4 : section === "team" ? 7 : 6);
  const signIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setError(""); setBusy(true); const data = new FormData(e.currentTarget);
    try { const r = await fetch("/api/auth", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email: data.get("email"), password: data.get("password") }) }); const body = await r.json(); if (!r.ok) throw new Error(body.error); setAuthenticated(true); setRole(body.user.role); setNotice("Welcome back."); }
    catch (e) { setError(e instanceof Error ? e.message : "Could not sign in."); } finally { setBusy(false); }
  };
  const openNew = () => { setForm(section === "products" ? { status: "published" } : section === "team" ? { status: "active", sortOrder: "0" } : section === "orders" ? { status: "pending", leadStatus: "new", paymentStatus: "unpaid", type: "order" } : {}); setModal("new"); setError(""); };
  const openEdit = (item: Item) => { setForm(Object.fromEntries(currentFields.map(([key]) => { let value = key === "password" ? "" : String(item[key] ?? ""); if (key === "followUpAt" && value) { const date = new Date(value); if (Number.isFinite(date.getTime())) value = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16); } return [key, value]; }))); setModal(item); setError(""); };
  const handleFieldChange = (key: string, value: string) => setForm(current => {
    const next = { ...current, [key]: value };
    const slugSourceKey = section === "products" || section === "categories" ? "name" : section === "pages" || section === "articles" ? "title" : null;
    if (slugSourceKey === key) {
      const previousGeneratedSlug = toSlug(current[slugSourceKey] ?? "");
      if (!current.slug || current.slug === previousGeneratedSlug) next.slug = toSlug(value);
    }
    return next;
  });
  const save = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); if (section === "dashboard") return; if (section === "products" && !form.collection) { setError("Choose the website collection where this product should appear."); return; } setBusy(true); setError("");
    const payload: Record<string, unknown> = { ...form };
    for (const [key, , type] of currentFields) if (type === "number" && form[key] !== "") payload[key] = Number(form[key]);
    if (section === "enquiries" && form.followUpAt) { const date = new Date(form.followUpAt); if (!Number.isFinite(date.getTime())) { setError("Choose a valid follow-up date and time."); setBusy(false); return; } payload.followUpAt = date.toISOString(); }
    if (section === "team" && !payload.status) payload.status = "active";
    try {
      if (section === "orders" && modal === "new") payload.type = "order";
      const collection = section === "enquiries" ? "orders" : section;
      const editing = modal !== "new" && modal !== null; const r = await fetch(`/api/data?collection=${collection}${editing ? `&id=${encodeURIComponent(modal.id)}` : ""}`, { method: editing ? "PATCH" : "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
      const body = await r.json(); if (!r.ok) throw new Error(body.error ?? "Save failed."); setModal(null); setNotice("Saved successfully."); await load(section);
    } catch (e) { setError(e instanceof Error ? e.message : "Save failed."); } finally { setBusy(false); }
  };
  const remove = async (item: Item) => {
    const name = String(item.name ?? item.title ?? item.code ?? item.email ?? "this item");
    const prompt = section === "products" ? `Move "${name}" to Trash? You can restore it later or permanently delete it from Trash.` : `Delete "${name}"? This cannot be undone.`;
    if (!confirm(prompt)) return;
    const collection = section === "enquiries" ? "orders" : section;
    const r = await fetch(`/api/data?collection=${collection}&id=${encodeURIComponent(item.id)}`, { method: "DELETE" });
    if (!r.ok) { const b = await r.json(); setError(b.error ?? "Delete failed."); }
    else { setNotice(section === "products" ? "Product moved to Trash. You can restore it at any time." : "Item deleted."); await load(section); }
  };
  const removeCustomerAccount = async (item: Item) => {
    const name = String(item.name ?? item.email ?? "this customer");
    if (!confirm(`Permanently delete ${name}'s customer account? Their orders and enquiries will remain.`)) return;
    const response = await fetch(`/api/customers?id=${encodeURIComponent(item.id)}`, { method: "DELETE" });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) { setError(body.error ?? "Could not delete customer account."); return; }
    setNotice("Customer account deleted. Orders and enquiries were kept.");
    await load("customers");
  };
  const restoreProduct = async (item: Item) => {
    const r = await fetch("/api/trash", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: item.id }) });
    if (!r.ok) { const body = await r.json(); setError(body.error ?? "Could not restore product."); }
    else { setNotice("Product restored to Products."); await load("trash"); }
  };
  const permanentlyDeleteProduct = async (item: Item) => {
    const name = String(item.name ?? "this product");
    if (!confirm(`Permanently delete "${name}"? This cannot be undone.`)) return;
    const r = await fetch(`/api/trash?id=${encodeURIComponent(item.id)}`, { method: "DELETE" });
    if (!r.ok) { const body = await r.json(); setError(body.error ?? "Could not permanently delete product."); }
    else { setNotice("Product permanently deleted."); await load("trash"); }
  };
  const updateOrder = async (item: Item, changes: Record<string, unknown>) => {
    const response = await fetch(`/api/data?collection=orders&id=${encodeURIComponent(item.id)}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify(changes) });
    const body = await response.json();
    if (!response.ok) { setError(body.error ?? "Could not update order."); return false; }
    setNotice("Saved successfully."); await Promise.all([load(section === "enquiries" ? "enquiries" : "orders"), load("dashboard")]); return true;
  };
  const openFollowUp = (item: Item) => {
    const existing = new Date(String(item.followUpAt ?? ""));
    const localValue = Number.isFinite(existing.getTime()) ? new Date(existing.getTime() - existing.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : "";
    setFollowUpValue(localValue); setFollowUpTarget(item); setError("");
  };
  const saveFollowUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!followUpTarget || !followUpValue) return;
    const date = new Date(followUpValue);
    if (!Number.isFinite(date.getTime())) { setError("Choose a valid follow-up date and time."); return; }
    if (await updateOrder(followUpTarget, { followUpAt: date.toISOString() })) { setFollowUpTarget(null); setNotice("Follow-up reminder saved."); }
  };
  const clearFollowUp = async () => {
    if (followUpTarget && await updateOrder(followUpTarget, { followUpAt: "" })) { setFollowUpTarget(null); setNotice("Follow-up reminder removed."); }
  };
  const exportOrdersCsv = () => {
    const columns = ["orderNumber", "customer", "email", "phone", "shippingAddress", "inquiryType", "inquiry", "items", "total", "deliveryCost", "paymentStatus", "status", "leadStatus", "followUpAt", "adminNote", "courier", "trackingNumber"];
    const escapeCsv = (value: unknown) => `"${String(value ?? "").replaceAll('"', '""')}"`;
    const csv = [columns.join(","), ...items.map(item => columns.map(column => escapeCsv(item[column])).join(","))].join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" })); const anchor = document.createElement("a"); anchor.href = url; anchor.download = section === "enquiries" ? "hide-n-hype-enquiries.csv" : "hide-n-hype-orders.csv"; anchor.click(); URL.revokeObjectURL(url);
  };
  const downloadBackup = async () => {
    setError("");
    try {
      const response = await fetch("/api/backup", { cache: "no-store" });
      if (!response.ok) { const body = await response.json(); throw new Error(body.error ?? "Backup failed."); }
      const blob = await response.blob(); const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url; anchor.download = `hide-n-hype-backup-${new Date().toISOString().slice(0, 10)}.json`; anchor.click(); URL.revokeObjectURL(url); setNotice("Database backup downloaded.");
    } catch (e) { setError(e instanceof Error ? e.message : "Backup failed."); }
  };
  const printInvoice = (item: Item, pdf = false) => {
    const escapeHtml = (value: unknown) => String(value ?? "-").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]!));
    let orderItems: unknown[] = [];
    try { const parsed = JSON.parse(String(item.items ?? "[]")); orderItems = Array.isArray(parsed) ? parsed : [{ product: String(item.items ?? "-") }]; } catch { orderItems = [{ product: String(item.items ?? "-") }]; }
    const rows = orderItems.map(value => { const row = value && typeof value === "object" ? value as Record<string, unknown> : { product: value }; return `<tr><td>${escapeHtml(row.product ?? row.name ?? row.title)}</td><td>${escapeHtml(row.quantity ?? 1)}</td><td>${escapeHtml(row.price ?? "-")}</td></tr>`; }).join("");
    const invoice = window.open("", "_blank", "width=800,height=900");
    if (!invoice) { setError("Allow pop-ups to print or save the invoice."); return; }
    invoice.document.write(`<!doctype html><html><head><title>Invoice ${escapeHtml(item.orderNumber)}</title><style>body{font:14px Arial,sans-serif;color:#171717;padding:40px;max-width:760px;margin:auto}header{display:flex;justify-content:space-between;border-bottom:2px solid #c8a84b;padding-bottom:20px}h1{margin:0}table{width:100%;border-collapse:collapse;margin-top:30px}th,td{text-align:left;padding:12px;border-bottom:1px solid #ddd}.total{text-align:right;margin-top:20px;font-size:18px;font-weight:bold}.muted{color:#666}@media print{button{display:none}}</style></head><body><header><div><h1>Hide n Hype</h1><p class="muted">Order invoice</p></div><div><b>${escapeHtml(item.orderNumber)}</b><br>${escapeHtml(item.createdAt ?? item.updatedAt ?? "")}</div></header><h3>Bill to</h3><p>${escapeHtml(item.customer)}<br>${escapeHtml(item.email)}<br>${escapeHtml(item.phone)}<br>${escapeHtml(item.shippingAddress)}</p><table><thead><tr><th>Item</th><th>Quantity</th><th>Price</th></tr></thead><tbody>${rows}</tbody></table><p class="total">Total: BDT ${escapeHtml(Number(item.total ?? 0) + Number(item.deliveryCost ?? 0))}</p><p class="muted">Payment: ${escapeHtml(item.paymentStatus)} · Status: ${escapeHtml(item.status)}</p><script>window.onload=()=>window.print()</script></body></html>`);
    invoice.document.close();
    if (pdf) setNotice("In the print window, choose Save as PDF to download the invoice.");
  };
  const handleOrderAction = async (item: Item, action: string) => {
    setError("");
    if (action === "fraud") {
      const email = String(item.email ?? "").trim().toLowerCase(); const phone = String(item.phone ?? "").replace(/\D/g, "");
      const matches = items.filter(order => order.id !== item.id && (email && String(order.email ?? "").trim().toLowerCase() === email || phone.length > 5 && String(order.phone ?? "").replace(/\D/g, "") === phone)).length;
      const flags = [matches ? `${matches} other order(s) use the same email or phone` : "No duplicate email or phone found", item.blockedCustomer ? "Customer is blocked" : "Customer is not blocked"];
      if (await updateOrder(item, { fraudCheckStatus: "reviewed", fraudCheckAt: new Date().toISOString(), fraudCheckResult: flags.join("; ") })) alert(`Fraud check for ${String(item.orderNumber ?? "order")}:\n${flags.join("\n")}`);
    } else if (action === "block") await updateOrder(item, { blockedCustomer: !item.blockedCustomer });
    else if (action === "note") { const note = prompt("Add an internal note to this order:", String(item.adminNote ?? "")); if (note !== null) await updateOrder(item, { adminNote: note.trim() }); }
    else if (action === "delivery") { const raw = prompt("Delivery cost (BDT):", String(item.deliveryCost ?? "0")); if (raw === null) return; const cost = Number(raw); if (!Number.isFinite(cost) || cost < 0) { setError("Enter a valid non-negative delivery cost."); return; } await updateOrder(item, { deliveryCost: cost }); }
    else if (action === "courier") { const courier = prompt("Courier service name (e.g. Pathao, Steadfast):", String(item.courier ?? "")); if (courier === null || !courier.trim()) return; const trackingNumber = prompt("Consignment or tracking number (optional):", String(item.trackingNumber ?? "")); if (trackingNumber === null) return; if (await updateOrder(item, { courier: courier.trim(), trackingNumber: trackingNumber.trim(), courierBookingStatus: "recorded" })) alert("Courier and tracking details saved. Automatic courier booking requires a courier API connection."); }
    else if (action === "whatsapp") { const phone = String(item.phone ?? "").replace(/\D/g, ""); if (phone.length < 6) { setError("This enquiry has no valid phone number."); return; } const message = encodeURIComponent(`Hello ${String(item.customer ?? "")}, we are contacting you about enquiry ${String(item.orderNumber ?? "")}.`); window.open(`https://wa.me/${phone}?text=${message}`, "_blank", "noopener,noreferrer"); }
    else if (["contacted", "quoted", "confirmed", "closed"].includes(action)) await updateOrder(item, { leadStatus: action, ...(action === "confirmed" ? { status: "processing", confirmedAt: new Date().toISOString() } : {}) });
    else if (action === "followup") openFollowUp(item);
    else if (action === "details") alert([`Order: ${item.orderNumber ?? item.id}`, `Customer: ${item.customer ?? "-"}`, `Email: ${item.email ?? "-"}`, `Phone: ${item.phone ?? "-"}`, `Address: ${item.shippingAddress ?? "-"}`, `Items: ${item.items ?? "-"}`, `Enquiry: ${item.inquiry ?? "-"}`, `Enquiry type: ${item.inquiryType ?? "-"}`, `Links: ${item.links ?? "-"}`, `Total: BDT ${item.total ?? 0}`, `Delivery: BDT ${item.deliveryCost ?? 0}`, `Payment: ${item.paymentStatus ?? "-"}`, `Status: ${item.status ?? "-"}`, `Note: ${item.adminNote ?? "-"}`, `Courier: ${item.courier ?? "-"} ${item.trackingNumber ?? ""}`].join("\n"));
    else if (action === "print") printInvoice(item);
    else if (action === "pdf") printInvoice(item, true);
    else if (action === "convert" && confirm(`Convert enquiry ${String(item.orderNumber ?? "")} into an order? It will move to the Orders section.`)) await updateOrder(item, { type: "order", status: "pending", paymentStatus: "unpaid", leadStatus: "confirmed", convertedAt: new Date().toISOString() });
    else if (action === "edit") openEdit(item);
    else if (action === "confirm") await updateOrder(item, { status: "processing", confirmationStatus: "confirmed", confirmedAt: new Date().toISOString() });
    else if (action === "cancel" && confirm(`Cancel order ${String(item.orderNumber ?? "")}?`)) await updateOrder(item, { status: "cancelled", confirmationStatus: "cancelled" });
    else if (action === "delete") await remove(item);
  };
  const logout = async () => { await fetch("/api/auth", { method: "DELETE" }); setAuthenticated(false); setRole(null); };
  const upload = async (file?: File) => { if (!file) return; const fd = new FormData(); fd.set("file", file); setBusy(true); try { const r = await fetch("/api/upload", { method: "POST", body: fd }); const b = await r.json(); if (!r.ok) throw new Error(b.error); if (section === "products" || section === "team") setForm(f => ({ ...f, image: b.url })); else if (section === "media") setForm(f => ({ ...f, url: b.url, name: f.name || file.name })); setNotice("Image uploaded."); } catch (e) { setError(e instanceof Error ? e.message : "Upload failed."); } finally { setBusy(false); } };
  const uploadGalleryImages = async (files?: FileList | null) => {
    if (!files?.length) return;
    const currentImages = String(form.galleryImages ?? "").split(",").map(url => url.trim()).filter(Boolean);
    const selectedFiles = Array.from(files).slice(0, Math.max(0, 5 - currentImages.length));
    if (!selectedFiles.length) { setError("You can add up to 5 additional product images."); return; }
    setBusy(true); setError("");
    const uploaded: string[] = []; let failed = 0;
    for (const file of selectedFiles) {
      try {
        const data = new FormData(); data.set("file", file);
        const response = await fetch("/api/upload", { method: "POST", body: data });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error ?? "Upload failed.");
        uploaded.push(String(result.url));
      } catch { failed += 1; }
    }
    if (uploaded.length) {
      setForm(current => ({ ...current, galleryImages: [...new Set([...String(current.galleryImages ?? "").split(",").map(url => url.trim()).filter(Boolean), ...uploaded])].slice(0, 5).join(", ") }));
      setNotice(`${uploaded.length} gallery image${uploaded.length === 1 ? "" : "s"} uploaded.`);
    }
    if (failed) setError(`${failed} image${failed === 1 ? "" : "s"} could not be uploaded.`);
    setBusy(false);
  };
  const exportSubscribers = () => { const csv = ["email,name,status", ...items.map(x => [x.email, x.name, x.status].map(v => `"${String(v ?? "").replaceAll('"', '""')}"`).join(","))].join("\n"); const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); a.download = "subscribers.csv"; a.click(); URL.revokeObjectURL(a.href); };
  if (!authenticated) return <main className="login"><div className="loginbox"><div className="brand">Hide n <span>Hype</span></div><h1>Sign in to your store</h1><p className="muted">Use your configured admin account to continue.</p>{error && <p className="error">{error}</p>}<form onSubmit={signIn}><label>Email<input className="field" name="email" type="email" required autoComplete="username" /></label><label>Password<input className="field" name="password" type="password" required autoComplete="current-password" /></label><button className="button" disabled={busy}>{busy ? "Signing in..." : "Sign in"}</button></form></div></main>;
  const canSee = (id: Section) => role === "owner" || role === "editor" && !["orders", "enquiries", "customers", "admins"].includes(id) || role === "orders_manager" && ["dashboard", "orders", "enquiries", "customers"].includes(id);
  const canEdit = (id: Section) => id !== "customers" && (role === "owner" || role === "editor" && !["orders", "enquiries", "admins"].includes(id) || role === "orders_manager" && ["orders", "enquiries"].includes(id));
  const activeTitle = section === "dashboard" ? "Dashboard" : groups.flatMap(g => g.links).find(x => x[0] === section)?.[1] ?? titleCase(section);
  return <div className="shell"><aside className={`sidebar ${mobileNav ? "open" : ""}`}><div className="brand">Hide n <span>Hype</span></div>{groups.map(group => { const links = group.links.filter(([id]) => canSee(id)); return links.length ? <div className="navgroup" key={group.title}><div className="navlabel">{group.title}</div>{links.map(([id, name, Icon]) => <button key={id} className={`navitem ${section === id ? "active" : ""}`} onClick={() => { setSection(id); setPage(1); setSearch(""); setMobileNav(false); }}><Icon size={16} strokeWidth={1.8} aria-hidden="true" />{name}</button>)}</div> : null; })}<div className="sidebarfoot">Hide n Hype CMS<br/>MongoDB Atlas content database</div></aside>
    <div className="main"><header className="topbar"><button className="hamb button light" onClick={() => setMobileNav(x => !x)} aria-label="Toggle menu"><MenuIcon size={18} /></button><span className="muted" style={{ marginRight: 6 }}>{role === "owner" ? "Owner" : role === "editor" ? "Editor" : "Orders manager"}</span><div className="avatar">H</div><button className="button light" onClick={logout}>Sign out</button></header><main className="content"><div className="heading"><div><h1>{activeTitle}</h1><div className="muted">{section === "trash" ? "Deleted products are hidden from your storefront. Restore them anytime or permanently remove them here." : section === "enquiries" ? "Product and contact form submissions. Track progress and convert confirmed enquiries into orders." : section === "orders" ? "Manage confirmed orders, delivery, payment and courier details." : "Manage your Hide n Hype store and content."}</div></div>{section === "dashboard" && <div className="rowactions">{canSee("orders") && <button className="button light" disabled={notificationPermission === "denied" || notificationPermission === "unsupported"} onClick={() => void enableBrowserReminders()}>{notificationPermission === "granted" ? "Follow-up alerts on" : notificationPermission === "denied" ? "Alerts blocked in browser" : notificationPermission === "unsupported" ? "Alerts unavailable" : "Enable follow-up alerts"}</button>}{role === "owner" && <><button className="button light" onClick={downloadBackup}>Download backup</button><button className="button light" onClick={() => { setSection("enquiries"); setLeadFilter("all"); }}>View enquiries</button></>}</div>}{section !== "dashboard" && <div className="rowactions">{section === "subscribers" && <button className="button light" onClick={exportSubscribers}>Export CSV</button>}{canEdit(section) && section !== "media" && section !== "trash" && section !== "enquiries" && section !== "landingPages" && <button className="button" onClick={openNew}>+ Add {section === "products" ? "product" : section === "categories" ? "category" : section === "orders" ? "order" : section === "coupons" ? "coupon" : section === "subscribers" ? "subscriber" : section === "pages" ? "page" : section === "videos" ? "video" : section === "team" ? "team member" : section === "admins" ? "admin" : "story"}</button>}</div>}</div>
      {notice && <div className="success" role="status" style={{ marginBottom: 15 }} onClick={() => setNotice("")}>{notice} &nbsp;x</div>}{error && authenticated && <div className="error" role="alert" style={{ marginBottom: 15 }}>{error}</div>}{section === "dashboard" && role === "owner" && summary && !summary.notificationReady && <div className="error" role="status" style={{ marginBottom: 15 }}>Email alerts are not set up. Add RESEND_API_KEY and RESEND_FROM_EMAIL to admin/.env.local. NOTIFICATION_EMAIL is optional; alerts go to ADMIN_EMAIL by default.</div>}
      {section === "dashboard" ? <><div className="cards">{[["Products", summary?.products ?? 0, "Items in catalog"], ["Orders", summary?.orders ?? 0, "Confirmed orders"], ["Enquiries", summary?.enquiries ?? 0, "Website submissions"], ["Pending orders", summary?.pending ?? 0, "Need attention"], ["Follow-ups due", summary?.followUpsDue ?? 0, "Contact these customers"], ["Recorded sales", `BDT ${Number(summary?.sales ?? 0).toLocaleString()}`, "From saved orders"]].map(([name, value, sub]) => name === "Follow-ups due" ? <button type="button" className="card follow-up-card" key={String(name)} onClick={() => { setSection("enquiries"); setLeadFilter("due"); setPage(1); }}><div className="statlabel">{name}</div><div className="stat">{value}</div><div className="muted">Open reminders</div></button> : <div className="card" key={String(name)}><div className="statlabel">{name}</div><div className="stat">{value}</div><div className="muted">{sub}</div></div>)}</div><section className="panel"><div className="panelhead"><h2>Recent orders</h2><button className="linkbutton" onClick={() => setSection("orders")}>View orders</button></div>{summary?.recentOrders.length ? <table><thead><tr><th>Order</th><th>Customer</th><th>Total</th><th>Status</th></tr></thead><tbody>{summary.recentOrders.map(o => <tr key={o.id}><td>{String(o.orderNumber ?? o.id.slice(0, 8))}</td><td>{String(o.customer ?? "-")}</td><td>BDT {Number(o.total ?? 0).toLocaleString()}</td><td><span className="badge orange">{String(o.status ?? "Pending")}</span></td></tr>)}</tbody></table> : <div className="empty">No orders recorded yet. Store inquiries will appear here.</div>}</section><section className="panel" style={{ marginTop: 18 }}><div className="panelhead"><h2>Recent enquiries</h2><button className="linkbutton" onClick={() => { setSection("enquiries"); setLeadFilter("all"); }}>View enquiries</button></div>{summary?.recentEnquiries.length ? <table><thead><tr><th>Enquiry</th><th>Customer</th><th>Type</th><th>Progress</th></tr></thead><tbody>{summary.recentEnquiries.map(item => <tr key={item.id}><td>{String(item.orderNumber ?? item.id.slice(0, 8))}</td><td>{String(item.customer ?? "-")}</td><td>{String(item.inquiryType ?? "Product")}</td><td>{titleCase(String(item.leadStatus ?? "New"))}</td></tr>)}</tbody></table> : <div className="empty">No enquiries received yet.</div>}</section><p className="muted" style={{ marginTop: 18 }}>Products, orders, and uploads are stored in MongoDB Atlas.</p></> : section === "landingPages" ? <LandingPagesManager /> : <section className="panel"><div className="toolbar"><input className="field" placeholder={`Search ${activeTitle.toLowerCase()}...`} value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} aria-label={`Search ${activeTitle}`} />{section === "enquiries" && <select className="field order-filter" aria-label="Filter enquiries by status" value={leadFilter} onChange={e => { setLeadFilter(e.target.value); setPage(1); }}><option value="all">All enquiry statuses</option><option value="due">Due follow-ups</option><option value="new">New</option><option value="contacted">Contacted</option><option value="quoted">Quoted</option><option value="confirmed">Confirmed</option><option value="closed">Closed</option></select>}{(section === "orders" || section === "enquiries") && canEdit(section) && <button className="button light" onClick={exportOrdersCsv}>Export {section === "enquiries" ? "enquiries" : "orders"} CSV</button>}<span className="muted" style={{ marginLeft: "auto", alignSelf: "center" }}>{filtered.length} records</span></div>{section === "media" && canEdit(section) && <div style={{ padding: 15 }}><label className="upload">Upload image (JPG, PNG, WebP or GIF, up to 5 MB)<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" style={{ display: "block", margin: "12px auto 0" }} onChange={e => void upload(e.target.files?.[0])} /></label></div>}{visible.length ? <table className="admin-record-table"><thead><tr>{visibleFields.map(([key]) => <th key={key}>{label(key)}</th>)}<th>Actions</th></tr></thead><tbody>{visible.map(item => <tr key={item.id}>{visibleFields.map(([key]) => <td key={key} data-label={label(key)}>{key === "image" || key === "url" || key === "coverImage" || key === "thumbnail" ? <>{typeof item[key] === "string" && String(item[key]).startsWith("/") ? <img src={String(item[key])} alt="" style={{ width: 38, height: 38, objectFit: "cover", borderRadius: 5, verticalAlign: "middle", marginRight: 8 }} /> : null}{String(item[key] ?? "-").slice(0, 45)}</> : key === "deletedAt" ? (item.deletedAt ? new Date(String(item.deletedAt)).toLocaleString() : "-") : key === "price" || key === "total" ? (item[key] === "" || item[key] == null ? "-" : `BDT ${Number(item[key]).toLocaleString()}`) : key === "status" && section === "orders" ? <select className="field order-status-select" aria-label={`Delivery status for ${String(item.orderNumber ?? "order")}`} value={String(item.status ?? "pending").toLowerCase()} onChange={event => void updateOrder(item, { status: event.target.value })}><option value="pending">Pending</option><option value="processing">Processing</option><option value="shipped">Shipped</option><option value="delivered">Delivered</option><option value="cancelled">Cancelled</option></select> : key === "leadStatus" && section === "enquiries" ? <select className="field order-status-select" aria-label={`Enquiry progress for ${String(item.orderNumber ?? "order")}`} value={String(item.leadStatus ?? "new").toLowerCase()} onChange={event => void updateOrder(item, { leadStatus: event.target.value })}><option value="new">New</option><option value="contacted">Contacted</option><option value="quoted">Quoted</option><option value="confirmed">Confirmed</option><option value="closed">Closed</option></select> : key === "followUpAt" && section === "enquiries" ? <button type="button" className="linkbutton follow-up-button" onClick={() => openFollowUp(item)}>{item[key] && Number.isFinite(Date.parse(String(item[key]))) ? new Date(String(item[key])).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "Set date"}</button> : key === "followUpAt" ? (item[key] ? new Date(String(item[key])).toLocaleString() : "-") : key === "status" || key === "leadStatus" ? <span className={`badge ${["published", "active", "confirmed", "closed", "delivered"].includes(String(item[key] ?? "").toLowerCase()) ? "green" : "orange"}`}>{titleCase(String(item[key] ?? (key === "leadStatus" ? "New" : "-")))}</span> : key === "shippingAddress" ? <span title={String(item[key] ?? "")}>{String(item[key] ?? "-").slice(0, 34)}</span> : String(item[key] ?? "-").slice(0, 60)}</td>)}<td data-label="Actions">{section === "enquiries" ? <select className="field order-action-select" defaultValue="" aria-label={`Actions for enquiry ${String(item.orderNumber ?? "")}`} onChange={event => { const action = event.target.value; event.target.value = ""; if (action) void handleOrderAction(item, action); }}><option value="" disabled>Enquiry actions...</option><option value="whatsapp">Contact on WhatsApp</option><option value="contacted">Mark contacted</option><option value="quoted">Mark quoted</option><option value="followup">Set follow-up</option><option value="note">Add internal note</option><option value="details">View details</option><option value="edit">Edit enquiry</option><option value="convert">Convert to order</option><option value="closed">Close enquiry</option><option value="delete">Delete enquiry</option></select> : section === "orders" ? <select className="field order-action-select" defaultValue="" aria-label={`Actions for order ${String(item.orderNumber ?? "")}`} onChange={event => { const action = event.target.value; event.target.value = ""; if (action) void handleOrderAction(item, action); }}><option value="" disabled>Order actions...</option><option value="delivery">Edit delivery cost</option><option value="courier">Record courier details</option><option value="details">View order details</option><option value="print">Print invoice</option><option value="pdf">Download PDF</option><option value="edit">Edit order</option><option value="cancel">Cancel order</option><option value="delete">Delete order</option></select> : section === "customers" ? <select className="field order-action-select" defaultValue="" aria-label={`Actions for customer ${String(item.name ?? item.email ?? "")}`} onChange={event => { const action = event.target.value; event.target.value = ""; if (action === "view") setCustomerDetailTarget(item); if (action === "whatsapp") window.open(`https://wa.me/${String(item.phone ?? "").replace(/\D/g, "")}`, "_blank", "noopener,noreferrer"); if (action === "delete") void removeCustomerAccount(item); }}><option value="" disabled>Customer actions...</option><option value="view">View full details</option>{String(item.phone ?? "").trim() && <option value="whatsapp">Contact on WhatsApp</option>}{role === "owner" && <option value="delete">Delete account</option>}</select> : <div className="rowactions">{section === "trash" ? <><button className="linkbutton" onClick={() => void restoreProduct(item)}>Restore</button><button className="linkbutton dangerlink" onClick={() => void permanentlyDeleteProduct(item)}>Delete permanently</button></> : canEdit(section) && <><button className="linkbutton" onClick={() => openEdit(item)}>Edit</button>{(section !== "admins" || role === "owner") && <button className="linkbutton" onClick={() => void remove(item)}>{section === "products" ? "Move to Trash" : "Delete"}</button>}</>}</div>}</td></tr>)}</tbody></table> : <div className="empty">{search ? "No matching records." : section === "trash" ? "Trash is empty. Deleted products appear here and can be restored or permanently removed." : "Nothing here yet. Add your first record to get started."}</div>}{filtered.length > pageSize && <div className="panelhead"><span className="muted">Page {page} of {Math.ceil(filtered.length / pageSize)}</span><div className="rowactions"><button className="button light" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</button><button className="button light" disabled={page >= Math.ceil(filtered.length / pageSize)} onClick={() => setPage(p => p + 1)}>Next</button></div></div>}</section>}
    </main></div>{customerDetailTarget && <div className="modalback" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setCustomerDetailTarget(null); }}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="customer-details-title"><div className="panelhead"><h2 id="customer-details-title">Customer details</h2><button className="linkbutton" onClick={() => setCustomerDetailTarget(null)} aria-label="Close">x</button></div><div className="gridform"><label><span>Name</span><p className="field">{String(customerDetailTarget.name ?? "-")}</p></label><label><span>Email</span><p className="field">{String(customerDetailTarget.email ?? "-")}</p></label><label><span>Phone / WhatsApp</span><p className="field">{String(customerDetailTarget.phone ?? "-")}</p></label><label><span>Division</span><p className="field">{String(customerDetailTarget.division ?? "-")}</p></label><label><span>District</span><p className="field">{String(customerDetailTarget.district ?? "-")}</p></label><label><span>Postal code</span><p className="field">{String(customerDetailTarget.postalCode ?? "-")}</p></label><label className="wide"><span>Full address</span><p className="field">{String(customerDetailTarget.address ?? "-")}</p></label></div><div className="modalfoot"><button className="button light" onClick={() => setCustomerDetailTarget(null)}>Close</button></div></section></div>}{modal && section !== "dashboard" && <div className="modalback" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget) setModal(null); }}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="form-title"><div className="panelhead"><h2 id="form-title">{modal === "new" ? `Add ${section === "team" ? "team member" : section === "enquiries" ? "enquiry" : section.slice(0, -1)}` : `Edit ${section === "team" ? "team member" : section === "enquiries" ? "enquiry" : section.slice(0, -1)}`}</h2><button className="linkbutton" onClick={() => setModal(null)} aria-label="Close">x</button></div><form onSubmit={save}><div className="gridform">{section === "products" || section === "media" || section === "team" ? <div className="wide upload">{section === "products" ? "Upload main product image" : "Upload image"}<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={e => void upload(e.target.files?.[0])} style={{ display: "block", marginTop: 9 }} /></div> : null}{currentFields.map(([key, name, type]) => {
  const required = isRequiredField(section, key, modal === "new");
  return <label key={key} className={type === "textarea" ? "wide" : ""}>
    <span>{name}{required && <span className="required-star" aria-label="required"> *</span>}</span>
    {type?.startsWith("select:") ? <select className="field" required={required} value={form[key] ?? ""} onChange={e => handleFieldChange(key, e.target.value)}><option value="">Select...</option>{type.slice(7).split(",").map(v => <option key={v} value={v.toLowerCase() === "published" || v.toLowerCase() === "active" || v.toLowerCase() === "new" || v.toLowerCase() === "contacted" || v.toLowerCase() === "quoted" || v.toLowerCase() === "confirmed" || v.toLowerCase() === "closed" || v.toLowerCase() === "pending" || v.toLowerCase() === "processing" || v.toLowerCase() === "shipped" || v.toLowerCase() === "delivered" || v.toLowerCase() === "cancelled" || v.toLowerCase() === "paid" || v.toLowerCase() === "refunded" || v.toLowerCase() === "inactive" ? v.toLowerCase() : v}>{v}</option>)}</select> : type === "textarea" ? <>{key === "galleryImages" && <input className="field" type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple disabled={busy} onChange={e => { void uploadGalleryImages(e.target.files); e.currentTarget.value = ""; }} />}<textarea className="field" maxLength={key === "seoDescription" ? 160 : key === "galleryImages" ? 20000 : undefined} value={form[key] ?? ""} onChange={e => handleFieldChange(key, e.target.value)} /></> : <input className="field" type={type ?? "text"} min={type === "number" ? "0" : undefined} step={type === "number" ? "any" : undefined} minLength={section === "admins" && key === "password" ? 12 : undefined} maxLength={key === "seoTitle" ? 60 : undefined} placeholder={key === "slug" ? "e.g. classic-denim-jacket" : key === "seoTitle" ? "e.g. Men's Cotton T-Shirt | Hide n Hype" : undefined} required={required} value={form[key] ?? ""} onChange={e => handleFieldChange(key, e.target.value)} />}
    {key === "slug" && <small className="fieldhint">Auto-filled from the name or title. You can edit it.</small>}{key === "sku" && <small className="fieldhint">A code to identify this product, e.g. HNH-TEE-001.</small>}
    {key === "colors" && <small className="fieldhint">Enter one or more colors separated by commas, e.g. Black, Navy, Off White.</small>}{key === "galleryImages" && <small className="fieldhint">Choose up to 5 extra images, or paste image URLs separated by commas.</small>}{key === "seoTitle" && <small className="fieldhint">Optional Google and browser title. Leave blank to use the product name.</small>}{key === "seoDescription" && <small className="fieldhint">A short search result summary, up to 160 characters.</small>}{section === "orders" && key === "status" && <small className="fieldhint">Delivery progress: Pending &gt; Processing &gt; Shipped &gt; Delivered. Choose Cancelled if it will not be fulfilled.</small>}{section === "enquiries" && key === "leadStatus" && <small className="fieldhint">Your enquiry workflow: New &gt; Contacted &gt; Quoted &gt; Confirmed or Closed. This is separate from delivery status.</small>}{section === "enquiries" && key === "followUpAt" && <small className="fieldhint">Optional reminder. When due, the enquiry appears in the Dashboard follow-up count.</small>}
  </label>;
})}</div>{error && <p className="error" style={{ margin: "0 20px 12px" }}>{error}</p>}<div className="modalfoot"><button type="button" className="button light" onClick={() => setModal(null)}>Cancel</button><button className="button" disabled={busy}>{busy ? "Saving..." : "Save changes"}</button></div></form></section></div>}{followUpTarget && <div className="modalback" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setFollowUpTarget(null); }}><section className="modal follow-up-modal" role="dialog" aria-modal="true" aria-labelledby="follow-up-title"><div className="panelhead"><div><h2 id="follow-up-title">Set follow-up</h2><small className="muted">{String(followUpTarget.customer ?? "Customer")} ? {String(followUpTarget.orderNumber ?? "")}</small></div><button className="linkbutton" onClick={() => setFollowUpTarget(null)} aria-label="Close">x</button></div><form onSubmit={saveFollowUp}><div className="gridform"><label className="wide"><span>Follow-up date and time</span><input className="field" type="datetime-local" required value={followUpValue} onChange={event => setFollowUpValue(event.target.value)} /><small className="fieldhint">When this time arrives, the enquiry will count as due on the Dashboard.</small></label></div><div className="modalfoot">{Boolean(followUpTarget.followUpAt) && <button type="button" className="button light dangerlink" onClick={() => void clearFollowUp()}>Remove reminder</button>}<button type="button" className="button light" onClick={() => setFollowUpTarget(null)}>Cancel</button><button type="submit" className="button">Save reminder</button></div></form></section></div>}</div>;
}
