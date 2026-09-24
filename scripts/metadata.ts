import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import type { Plugin, ResolvedConfig } from 'vite'
import { pageIds, routes } from '../src/navigation.ts'
import { pageMetadata } from '../src/seo.ts'
import type { Language, PageId } from '../src/types'

const metadataBlock = /<!-- site-metadata:start -->[\s\S]*?<!-- site-metadata:end -->/
const escape = (text: string) => text.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]!)

export function renderPageMetadata(html: string, language: Language, page?: PageId) {
  if (!metadataBlock.test(html)) throw new Error('The HTML template is missing its metadata block')
  const metadata = pageMetadata(language, page)
  const elements = metadata.tags.map(({ tag, attributes }) => {
    const values = Object.entries(attributes).map(([key, value]) => `${key}="${escape(value)}"`).join(' ')
    return `<${tag} data-site-meta ${values} />`
  })
  return html.replace(/<html lang="[^"]+"/, `<html lang="${language}"`)
    .replace(metadataBlock, () => `<!-- site-metadata:start -->\n    <title>${escape(metadata.title)}</title>\n    ${elements.join('\n    ')}\n    <!-- site-metadata:end -->`)
}

function metadataForPath(html: string, path: string) {
  const pathname = path.split('?')[0].replace(/\/$/, '')
  if (!pathname || pathname === '/index.html') return renderPageMetadata(html, 'fr', 'home')
  for (const language of ['fr', 'en'] as const) {
    for (const page of pageIds) {
      if (routes[language][page] === pathname) return renderPageMetadata(html, language, page)
    }
  }
  return renderPageMetadata(html, pathname.startsWith('/en/') ? 'en' : 'fr')
}

// Each public route gets a complete HTML head before React runs. Social crawlers
// receive the same metadata as browsers, without a server or bot-specific logic.
export function metadataPlugin(): Plugin {
  let config: ResolvedConfig
  return {
    name: 'imperial-page-metadata',
    configResolved(resolved) { config = resolved },
    transformIndexHtml(html, context) { return metadataForPath(html, context.originalUrl ?? context.path) },
    configurePreviewServer(server) {
      // Vite's SPA fallback otherwise serves the root HTML even when a route has
      // its own document. Match the route rewrites used by the production host.
      server.middlewares.use((request, _response, next) => {
        const url = new URL(request.url ?? '/', 'http://preview.local')
        const path = url.pathname.replace(/\/$/, '')
        const known = Object.values(routes).some(pages => Object.values(pages).includes(path))
        if (known) request.url = `${path}/index.html${url.search}`
        next()
      })
    },
    async closeBundle() {
      if (config.command !== 'build') return
      const output = resolve(config.root, config.build.outDir)
      const template = await readFile(resolve(output, 'index.html'), 'utf8')
      for (const language of ['fr', 'en'] as const) {
        for (const page of pageIds) {
          const file = resolve(output, routes[language][page].slice(1), 'index.html')
          await mkdir(dirname(file), { recursive: true })
          await writeFile(file, renderPageMetadata(template, language, page))
        }
        await writeFile(resolve(output, `not-found-${language}.html`), renderPageMetadata(template, language))
      }
    },
  }
}
