import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const projectRoot = process.cwd();
const distDir = path.join(projectRoot, "dist");
const serverEntry = pathToFileURL(path.join(projectRoot, "dist-ssr", "entry-server.js")).href;
const { renderPage } = await import(serverEntry);

const htmlFiles = [
  path.join(distDir, "index.html"),
  ...(await readdir(path.join(distDir, "seo-pages"))).map((file) =>
    path.join(distDir, "seo-pages", file),
  ),
];

for (const htmlPath of htmlFiles) {
  const html = await readFile(htmlPath, "utf8");
  const canonical = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i)?.[1];
  if (!canonical) throw new Error(`Missing canonical URL in ${htmlPath}`);

  const markup = renderPage(new URL(canonical).pathname);
  if (!markup) throw new Error(`No rendered page content for ${canonical}`);

  const renderedHtml = html.replace('<div id="root"></div>', `<div id="root">${markup}</div>`);
  if (renderedHtml === html) throw new Error(`Could not find root mount point in ${htmlPath}`);
  await writeFile(htmlPath, renderedHtml);
}

console.log(`Prerendered page content for ${htmlFiles.length} public routes.`);
