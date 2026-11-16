import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { pageMetadata, siteUrl, socialImageUrl } from './src/app/seoMetadata'

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character]!)
}

function setMeta(html: string, attribute: 'name' | 'property', key: string, value: string) {
  const tagPattern = /<meta\b[^>]*>/gi
  let found = false
  const updated = html.replace(tagPattern, (tag) => {
    if (!new RegExp(`${attribute}=["']${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`, 'i').test(tag)) return tag
    found = true
    const content = `content="${escapeHtml(value)}"`
    return /\bcontent=["'][^"']*["']/i.test(tag)
      ? tag.replace(/\bcontent=["'][^"']*["']/i, content)
      : tag.replace(/\s*\/?>$/, ` ${content} />`)
  })
  if (found) return updated
  return updated.replace('</head>', `  <meta ${attribute}="${key}" content="${escapeHtml(value)}" />\n</head>`)
}

function routeMetadataHtml() {
  return {
    name: 'route-metadata-html',
    async writeBundle(options) {
      const outDir = options.dir ?? path.resolve(__dirname, 'dist')
      const indexPath = path.join(outDir, 'index.html')
      const baseHtml = await import('node:fs/promises').then(({ readFile }) => readFile(indexPath, 'utf8'))
      const { writeFile, mkdir } = await import('node:fs/promises')

      for (const [route, metadata] of Object.entries(pageMetadata)) {
        if (route === '/') continue
        const canonical = `${siteUrl}${route}`
        let html = baseHtml.replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtml(metadata.title)}</title>`)
        html = html.replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?\s*>/i, `<link rel="canonical" href="${canonical}" />`)
        html = setMeta(html, 'name', 'description', metadata.description)
        html = setMeta(html, 'name', 'robots', 'index, follow')
        html = setMeta(html, 'property', 'og:title', metadata.title)
        html = setMeta(html, 'property', 'og:description', metadata.description)
        html = setMeta(html, 'property', 'og:url', canonical)
        html = setMeta(html, 'property', 'og:type', 'website')
        html = setMeta(html, 'property', 'og:site_name', 'Hide n Hype')
        html = setMeta(html, 'property', 'og:image', socialImageUrl)
        html = setMeta(html, 'name', 'twitter:card', 'summary_large_image')
        html = setMeta(html, 'name', 'twitter:title', metadata.title)
        html = setMeta(html, 'name', 'twitter:description', metadata.description)
        html = setMeta(html, 'name', 'twitter:image', socialImageUrl)

        const routeId = route.slice(1).replaceAll('/', '--')
        const pagePath = path.join(outDir, 'seo-pages', `${routeId}.html`)
        await mkdir(path.dirname(pagePath), { recursive: true })
        await writeFile(pagePath, html)
      }
    },
  }
}


function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

export default defineConfig({
  plugins: [
    figmaAssetResolver(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
    routeMetadataHtml(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
