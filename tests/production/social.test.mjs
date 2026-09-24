import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { content } from '../../src/content.ts'
import { pageIds, routes } from '../../src/navigation.ts'
import { pageMetadata, siteOrigin } from '../../src/seo.ts'
import { renderPageMetadata } from '../../scripts/metadata.ts'

const readOutput = path => readFileSync(new URL(`../../dist/${path}`, import.meta.url), 'utf8')
const decode = text => text.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
function headTags(html) {
  const head = html.match(/<head>([\s\S]*?)<\/head>/)[1]
  return [...head.matchAll(/<(meta|link)\b[^>]+>/g)].map(([tag]) => Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(([, key, value]) => [key, decode(value)])))
}
function one(tags, attribute, value) {
  const matches = tags.filter(tag => tag[attribute] === value)
  assert.equal(matches.length, 1, `Expected exactly one ${attribute}="${value}"`)
  return matches[0]
}

test('a crawler without JavaScript receives localized social metadata on all fourteen pages', () => {
  for (const language of ['fr', 'en']) {
    const titles = new Set()
    for (const page of pageIds) {
      const path = routes[language][page]
      const html = readOutput(`${path.slice(1)}/index.html`)
      const tags = headTags(html)
      const title = `${content[language].nav[page]} | ${content[language].brand}`
      const url = `${siteOrigin}${path}`
      assert.equal(decode(html.match(/<title>(.*?)<\/title>/)[1]), title)
      assert.ok(html.includes(`<html lang="${language}"`))
      assert.equal(one(tags, 'property', 'og:title').content, title)
      assert.equal(one(tags, 'property', 'og:url').content, url)
      assert.equal(one(tags, 'rel', 'canonical').href, url)
      assert.equal(one(tags, 'name', 'twitter:card').content, 'summary_large_image')
      assert.equal(one(tags, 'name', 'twitter:title').content, title)
      assert.equal(one(tags, 'property', 'og:description').content, one(tags, 'name', 'description').content)
      assert.ok(one(tags, 'name', 'description').content.length > 40)
      assert.equal(one(tags, 'property', 'og:locale').content, `${language}_CM`)
      assert.equal(one(tags, 'property', 'og:locale:alternate').content, language === 'fr' ? 'en_CM' : 'fr_CM')
      for (const alternative of ['fr', 'en']) {
        assert.equal(one(tags, 'hreflang', alternative).href, `${siteOrigin}${routes[alternative][page]}`)
      }
      const image = new URL(one(tags, 'property', 'og:image').content)
      assert.equal(image.origin, siteOrigin)
      assert.equal(image.pathname, `/social/og-${language}.png`)
      assert.equal(one(tags, 'name', 'twitter:image').content, image.href)
      assert.ok(one(tags, 'property', 'og:image:alt').content.length > 20)
      const png = readFileSync(new URL(`../../dist${image.pathname}`, import.meta.url))
      assert.equal(png.readUInt32BE(16), 1200)
      assert.equal(png.readUInt32BE(20), 630)
      assert.equal(one(tags, 'property', 'og:image:type').content, 'image/png')
      assert.ok(png.length < 5_000_000)
      const script = html.match(/<script[^>]*src="([^"]+)"/)[1]
      assert.ok(existsSync(new URL(`../../dist${script}`, import.meta.url)))
      titles.add(title)
    }
    assert.equal(titles.size, 7)
  }
})

test('root sharing defaults to the canonical French home page', () => {
  const tags = headTags(readOutput('index.html'))
  assert.equal(one(tags, 'property', 'og:url').content, `${siteOrigin}/fr`)
  assert.equal(one(tags, 'property', 'og:locale').content, 'fr_CM')
})

test('Vercel routes known pages to their HTML before the SPA fallback', () => {
  const config = JSON.parse(readFileSync(new URL('../../vercel.json', import.meta.url), 'utf8'))
  assert.equal(config.trailingSlash, false)
  for (const lang of ['fr', 'en']) for (const page of pageIds) {
    const path = routes[lang][page]
    const rewrite = config.rewrites.find(rule => {
      const pattern = rule.source.replace(/:page\(([^)]+)\)/, '($1)')
      return new RegExp(`^${pattern}$`).test(path)
    })
    assert.equal(rewrite.destination.replace(':page', path.split('/')[2]), `${path}/index.html`)
  }
})

test('metadata remains safe HTML and unknown routes clear stale sharing tags', () => {
  const original = content.fr.nav.services
  try {
    content.fr.nav.services = 'A & B "quote" <script>'
    const html = renderPageMetadata('<html lang="fr"><head><!-- site-metadata:start --><!-- site-metadata:end --></head></html>', 'fr', 'services')
    assert.doesNotMatch(html, /<script>/)
    assert.match(html, /&amp; B &quot;quote&quot; &lt;script&gt;/)
  } finally { content.fr.nav.services = original }
  for (const lang of ['fr', 'en']) {
    const fallback = readOutput(`not-found-${lang}.html`)
    const fallbackTags = headTags(fallback)
    assert.ok(fallback.includes(`<html lang="${lang}"`))
    assert.equal(one(fallbackTags, 'name', 'robots').content, 'noindex, follow')
    assert.doesNotMatch(fallback, /property="og:|rel="canonical"/)
    const metadata = pageMetadata(lang)
    assert.ok(metadata.tags.some(tag => tag.attributes.name === 'robots' && tag.attributes.content === 'noindex, follow'))
    assert.ok(!metadata.tags.some(tag => tag.attributes.property?.startsWith('og:') || tag.attributes.rel === 'canonical'))
  }
})
