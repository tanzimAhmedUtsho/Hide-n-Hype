import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const projectRoot = process.cwd();
const distDir = path.join(projectRoot, "dist");
const serverEntry = pathToFileURL(path.join(projectRoot, "dist-ssr", "entry-server.js")).href;
const { renderPage } = await import(serverEntry);

async function findHtmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => {
    const entryPath = path.join(directory, entry.name);
    return entry.isDirectory() ? findHtmlFiles(entryPath) : entry.name.endsWith(".html") ? [entryPath] : [];
  }));
  return nested.flat();
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
}
function setMeta(html, key, value, attribute = "name") {
  const tag = new RegExp(`<meta\\s+${attribute}=["']${key}["'][^>]*>`, "i");
  const replacement = `<meta ${attribute}="${key}" content="${escapeHtml(value)}" />`;
  return tag.test(html) ? html.replace(tag, replacement) : html.replace("</head>", `  ${replacement}\n</head>`);
}

let cmsProducts = [];
try {
  const cmsApiBase = (process.env.VITE_CMS_API_URL || "http://localhost:3000").replace(/\/+$/, "");
  const response = await fetch(`${cmsApiBase}/api/public/products`, { signal: AbortSignal.timeout(3000), cache: "no-store" });
  if (response.ok) cmsProducts = await response.json();
  else console.warn("CMS product endpoint unavailable during build; dynamic products were not added to SEO output.");
} catch {
  console.warn("CMS unavailable during build; dynamic products were not added to SEO output.");
}

const baseHtml = await readFile(path.join(distDir, "index.html"), "utf8");
const baseCanonical = baseHtml.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i)?.[1] || "https://www.hidenhype.com/";
const siteOrigin = new URL(baseCanonical).origin;
const productPages = [];
for (const product of cmsProducts) {
  const slug = String(product.slug ?? "");
  if (String(product.status).toLowerCase() !== "published" || !/^[a-z0-9-]+$/.test(slug)) continue;
  const canonical = `${siteOrigin}/products/${encodeURIComponent(slug)}`;
  const title = String(product.seoTitle || `${product.name} | Hide n Hype`).slice(0, 60);
  const fallbackDescription = `Explore ${product.name} by Hide n Hype. Contact our team for wholesale, sourcing, and product enquiries.`;
  const description = String(product.seoDescription || product.description || fallbackDescription).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 160);
  let html = baseHtml.replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtml(title)}</title>`);
  html = html.replace(/<link\s+rel="canonical"\s+href="[^"]+"\s*\/?\s*>/i, `<link rel="canonical" href="${escapeHtml(canonical)}" />`);
  html = setMeta(html, "description", description);
  html = setMeta(html, "robots", "index, follow");
  html = setMeta(html, "og:title", title, "property");
  html = setMeta(html, "og:description", description, "property");
  html = setMeta(html, "og:url", canonical, "property");
  html = setMeta(html, "og:type", "product", "property");
  if (product.image) html = setMeta(html, "og:image", String(product.image).startsWith("/") ? `${process.env.VITE_CMS_API_URL || "http://localhost:3000"}${product.image}` : product.image, "property");
  const pagePath = path.join(distDir, "seo-pages", "products", `${slug}.html`);
  await mkdir(path.dirname(pagePath), { recursive: true });
  await writeFile(pagePath, html);
  productPages.push({ slug, canonical });
}

const htmlFiles = [path.join(distDir, "index.html"), ...(await findHtmlFiles(path.join(distDir, "seo-pages")))];
const canonicalUrls = [];
for (const htmlPath of htmlFiles) {
  const html = await readFile(htmlPath, "utf8");
  const canonical = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i)?.[1];
  if (!canonical) throw new Error(`Missing canonical URL in ${htmlPath}`);
  canonicalUrls.push(canonical);

  const markup = renderPage(new URL(canonical).pathname);
  if (!markup) throw new Error(`No rendered page content for ${canonical}`);

  const renderedHtml = html.replace('<div id="root"></div>', `<div id="root">${markup}</div>`);
  if (renderedHtml === html) throw new Error(`Could not find root mount point in ${htmlPath}`);
  await writeFile(htmlPath, renderedHtml);
}

const sitemapEntries = [...new Set([...canonicalUrls, ...productPages.map(page => page.canonical)])].sort();
const sitemapXml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...sitemapEntries.map(url => `  <url><loc>${escapeHtml(url)}</loc></url>`),
  '</urlset>',
  '',
].join("\n");
await writeFile(path.join(distDir, "sitemap.xml"), sitemapXml);

console.log(`Prerendered page content for ${htmlFiles.length} public routes, including ${productPages.length} CMS products.`);
