export type CmsProduct = {
  id: string;
  name: string;
  slug: string;
  category?: string;
  collection?: string;
  price?: number | string;
  salePrice?: number | string;
  image?: string;
  galleryImages?: string;
  description?: string;
  seoTitle?: string;
  seoDescription?: string;
  sizes?: string;
  colors?: string;
  status: string;
};

export const cmsApiBase = (import.meta.env.VITE_CMS_API_URL || "http://localhost:3000").replace(/\/+$/, "");

export async function loadCmsProducts(signal?: AbortSignal): Promise<CmsProduct[]> {
  const response = await fetch(`${cmsApiBase}/api/public/products`, { signal, cache: "no-store" });
  if (!response.ok) throw new Error("Could not load products from the store.");
  return response.json() as Promise<CmsProduct[]>;
}

export function cmsProductImage(image?: string) {
  if (!image) return "";
  return image.startsWith("/") ? `${cmsApiBase}${image}` : image;
}

export function collectionKey(value?: string) {
  return String(value ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
