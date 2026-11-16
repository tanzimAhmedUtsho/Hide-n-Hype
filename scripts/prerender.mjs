import { readdir, readFile, writeFile } from "node:fs/promises";
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

const htmlFiles = [
  path.join(distDir, "index.html"),
  ...(await findHtmlFiles(path.join(distDir, "seo-pages"))),
];

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

const sitemapUrls = [...new Set(canonicalUrls)].sort();
const sitemapXml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...sitemapUrls.map((url) => `  <url><loc>${url}</loc></url>`),
  '</urlset>',
  '',
].join('\n');
await writeFile(path.join(distDir, "sitemap.xml"), sitemapXml);

console.log(`Prerendered page content for ${htmlFiles.length} public routes.`);
