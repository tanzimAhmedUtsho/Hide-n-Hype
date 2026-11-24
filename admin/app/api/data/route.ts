import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { collections, deleteItem, findAdminById, getSummary, listItems, upsertItem, type Collection } from "@/lib/store";

export const runtime = "nodejs";
const landingWebsitePages = ["home", "new-arrivals", "sale", "collection", "collection/men", "collection/women", "collection/kids", "collection/accessories", "collection/leather", "collection/denim", "lookbook", "sourcing-manufacturing", "our-business", "about", "contact"];
function selected(value: string | null): value is Collection { return !!value && collections.includes(value as Collection); }
function clean(input: unknown): Record<string, unknown> | null {
  if (!input || typeof input !== "object" || Array.isArray(input)) return null;
  const output: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(input as Record<string, unknown>).slice(0, 40)) {
    if (["__proto__", "constructor", "prototype", "id", "createdAt", "updatedAt"].includes(key)) continue;
    if (typeof value === "string") output[key.slice(0, 60)] = (key === "password" ? value : value.trim()).slice(0, key === "description" || key === "content" || key === "bio" || key === "galleryImages" ? 20000 : 2000);
    else if (typeof value === "number" && Number.isFinite(value)) output[key.slice(0, 60)] = value;
    else if (typeof value === "boolean") output[key.slice(0, 60)] = value;
  }
  return output;
}
function hasTooManyGalleryImages(body: Record<string, unknown>) {
  return typeof body.galleryImages === "string" && body.galleryImages.split(",").map(image => image.trim()).filter(Boolean).length > 5;
}
async function authorized(collection?: Collection, write = false) {
  const user = await isAdmin();
  if (!user) return null;
  if (!collection || !write || user.role === "owner") return user;
  if (user.role === "editor" && !["orders", "admins"].includes(collection)) return user;
  if (user.role === "orders_manager" && collection === "orders") return user;
  return null;
}
export async function GET(request: NextRequest) {
  const user = await authorized();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (request.nextUrl.searchParams.get("summary") === "1") {
    const summary = await getSummary();
    return NextResponse.json(user.role === "editor" ? { ...summary, orders: 0, enquiries: 0, pending: 0, followUpsDue: 0, sales: 0, recentOrders: [], recentEnquiries: [] } : summary);
  }
  const collection = request.nextUrl.searchParams.get("collection");
  if (!selected(collection)) return NextResponse.json({ error: "Unknown collection" }, { status: 400 });
  if (user.role === "orders_manager" && collection !== "orders") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (user.role === "editor" && ["orders", "admins"].includes(collection)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  return NextResponse.json(await listItems(collection));
}
export async function POST(request: NextRequest) {
  const collection = request.nextUrl.searchParams.get("collection");
  if (!selected(collection)) return NextResponse.json({ error: "Unknown collection" }, { status: 400 });
  const user = await authorized(collection, true);
  if (!user) return NextResponse.json({ error: "Unauthorized or insufficient role" }, { status: 403 });
  const body = clean(await request.json().catch(() => null));
  if (!body) return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  if (collection === "products" && hasTooManyGalleryImages(body)) return NextResponse.json({ error: "You can add up to 5 additional product images." }, { status: 422 });
  if (collection === "products" && !["New Arrivals", "Men", "Women", "Kids", "Accessories", "Leather", "Denim", "Riding Gear", "Sale"].includes(String(body.collection ?? ""))) return NextResponse.json({ error: "Choose the website collection where this product should appear." }, { status: 422 });
  if (collection === "admins" && (typeof body.password !== "string" || body.password.length < 12)) return NextResponse.json({ error: "A temporary password of at least 12 characters is required." }, { status: 422 });
  if (collection === "products" && (!body.name || !body.slug || !body.sku)) return NextResponse.json({ error: "Product name, URL slug, and product code are required." }, { status: 422 });
  if (collection === "products" && ["buyingPrice", "price", "salePrice"].some(key => body[key] !== undefined && body[key] !== "" && (!Number.isFinite(Number(body[key])) || Number(body[key]) < 0))) return NextResponse.json({ error: "Enter valid non-negative buying, regular, and discount prices." }, { status: 422 });
  if (collection === "categories" && !body.name) return NextResponse.json({ error: "Category name is required." }, { status: 422 });
  if (collection === "team" && (!body.name || !body.designation)) return NextResponse.json({ error: "Team member name and designation are required." }, { status: 422 });
  if (collection === "team" && body.status !== undefined && !["active", "inactive"].includes(String(body.status).toLowerCase())) return NextResponse.json({ error: "Choose Active or Inactive status." }, { status: 422 });
  if (collection === "orders" && body.assignedTo !== undefined) {
    if (!body.assignedTo) { body.assignedTo = ""; body.assignedToName = ""; }
    else {
      const assignee = await findAdminById(String(body.assignedTo));
      if (!assignee) return NextResponse.json({ error: "Choose an active admin team member." }, { status: 422 });
      body.assignedToName = String(assignee.name ?? "Store admin");
    }
  }
  if (collection === "orders" && body.leadStatus !== undefined && !["new", "contacted", "quoted", "confirmed", "closed"].includes(String(body.leadStatus).toLowerCase())) return NextResponse.json({ error: "Choose a valid enquiry progress status." }, { status: 422 });
  if (collection === "orders" && body.leadStatus !== undefined && ["contacted", "quoted", "confirmed"].includes(String(body.leadStatus).toLowerCase())) body.firstRespondedBy = user.name;
  if (collection === "landingPages" && (!body.title || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(body.slug ?? "")) || !body.heroTitle || !body.description)) return NextResponse.json({ error: "Add a page title, simple English URL, headline and description." }, { status: 422 });
  if (collection === "landingPages" && !["product", "campaign", "website"].includes(String(body.pageType))) return NextResponse.json({ error: "Choose Product, Campaign, or Website page type." }, { status: 422 });
  if (collection === "landingPages" && body.pageType === "product" && !body.productId) return NextResponse.json({ error: "Choose a product for this landing page." }, { status: 422 });
  if (collection === "landingPages" && body.pageType === "website" && !landingWebsitePages.includes(String(body.sourcePage))) return NextResponse.json({ error: "Choose an existing website page." }, { status: 422 });
  if (collection === "landingPages" && !["product-enquiry", "collection-campaign", "wholesale", "minimal"].includes(String(body.template))) return NextResponse.json({ error: "Choose a landing page template." }, { status: 422 });
  try {
    const result = await upsertItem(collection, body);
    return result ? NextResponse.json(result, { status: 201 }) : NextResponse.json({ error: "A record with that slug, code, or email already exists." }, { status: 409 });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Could not save record." }, { status: 422 }); }
}
export async function PATCH(request: NextRequest) {
  const collection = request.nextUrl.searchParams.get("collection"); const id = request.nextUrl.searchParams.get("id");
  if (!selected(collection) || !id) return NextResponse.json({ error: "Collection and item id are required." }, { status: 400 });
  const user = await authorized(collection, true);
  if (!user) return NextResponse.json({ error: "Unauthorized or insufficient role" }, { status: 403 });
  const body = clean(await request.json().catch(() => null));
  if (!body) return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  if (collection === "products" && hasTooManyGalleryImages(body)) return NextResponse.json({ error: "You can add up to 5 additional product images." }, { status: 422 });
  if (collection === "products" && body.collection !== undefined && !["New Arrivals", "Men", "Women", "Kids", "Accessories", "Leather", "Denim", "Riding Gear", "Sale"].includes(String(body.collection))) return NextResponse.json({ error: "Choose a valid website collection for this product." }, { status: 422 });
  if (collection === "products" && body.sku !== undefined && !body.sku) return NextResponse.json({ error: "Product code (SKU) is required." }, { status: 422 });
  if (collection === "products" && ["buyingPrice", "price", "salePrice"].some(key => body[key] !== undefined && body[key] !== "" && (!Number.isFinite(Number(body[key])) || Number(body[key]) < 0))) return NextResponse.json({ error: "Enter valid non-negative buying, regular, and discount prices." }, { status: 422 });
  if (collection === "team" && (body.name !== undefined && !body.name || body.designation !== undefined && !body.designation)) return NextResponse.json({ error: "Team member name and designation are required." }, { status: 422 });
  if (collection === "team" && body.status !== undefined && !["active", "inactive"].includes(String(body.status).toLowerCase())) return NextResponse.json({ error: "Choose Active or Inactive status." }, { status: 422 });
  if (collection === "orders" && body.assignedTo !== undefined) {
    if (!body.assignedTo) { body.assignedTo = ""; body.assignedToName = ""; }
    else {
      const assignee = await findAdminById(String(body.assignedTo));
      if (!assignee) return NextResponse.json({ error: "Choose an active admin team member." }, { status: 422 });
      body.assignedToName = String(assignee.name ?? "Store admin");
    }
  }
  if (collection === "orders" && body.leadStatus !== undefined && !["new", "contacted", "quoted", "confirmed", "closed"].includes(String(body.leadStatus).toLowerCase())) return NextResponse.json({ error: "Choose a valid enquiry progress status." }, { status: 422 });
  if (collection === "orders" && body.leadStatus !== undefined && ["contacted", "quoted", "confirmed"].includes(String(body.leadStatus).toLowerCase())) body.firstRespondedBy = user.name;
  if (collection === "landingPages" && body.slug !== undefined && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(body.slug))) return NextResponse.json({ error: "Use a simple English URL made of lowercase letters, numbers and hyphens." }, { status: 422 });
  if (collection === "landingPages" && (body.title !== undefined && !body.title || body.heroTitle !== undefined && !body.heroTitle || body.description !== undefined && !body.description)) return NextResponse.json({ error: "Page title, headline and description are required." }, { status: 422 });
  if (collection === "landingPages" && body.pageType === "product" && !body.productId) return NextResponse.json({ error: "Choose a product for this landing page." }, { status: 422 });
  if (collection === "landingPages" && body.pageType === "website" && !landingWebsitePages.includes(String(body.sourcePage))) return NextResponse.json({ error: "Choose an existing website page." }, { status: 422 });
  if (collection === "admins" && id === user.id && (body.role && String(body.role).toLowerCase() !== "owner" || body.status && String(body.status).toLowerCase() !== "active")) return NextResponse.json({ error: "You cannot remove your own owner access." }, { status: 422 });
  try {
    const result = await upsertItem(collection, body, id);
    return result ? NextResponse.json(result) : NextResponse.json({ error: "Record not found or duplicate value." }, { status: 404 });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Could not save record." }, { status: 422 }); }
}
export async function DELETE(request: NextRequest) {
  const collection = request.nextUrl.searchParams.get("collection"); const id = request.nextUrl.searchParams.get("id");
  if (!selected(collection) || !id) return NextResponse.json({ error: "Collection and item id are required." }, { status: 400 });
  const user = await authorized(collection, true);
  if (!user || collection === "admins" && user.role !== "owner") return NextResponse.json({ error: "Unauthorized or insufficient role" }, { status: 403 });
  if (collection === "admins" && id === user.id) return NextResponse.json({ error: "You cannot delete your own account." }, { status: 422 });
  try { return await deleteItem(collection, id) ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "Not found" }, { status: 404 }); }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Could not delete record." }, { status: 422 }); }
}
