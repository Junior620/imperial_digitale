import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { content } from '../src/content.ts'
import { ui } from '../src/ui.ts'
import { pageIds, routes, contactHref, storedLanguage, rememberLanguage } from '../src/navigation.ts'

function shape(value) {
  if (Array.isArray(value)) return value.map(shape)
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, shape(child)]))
  assert.equal(typeof value, 'string')
  assert.ok(value.trim().length > 0, 'Localized text must not be empty')
  return 'string'
}

test('all fourteen localized routes are unique and preserve page identity', () => {
  assert.equal(pageIds.length, 7)
  const paths = ['fr', 'en'].flatMap(lang => pageIds.map(page => {
    const path = routes[lang][page]
    assert.ok(path.startsWith(`/${lang}`))
    assert.ok(content[lang].nav[page])
    return path
  }))
  assert.equal(new Set(paths).size, 14)
  assert.equal(routes.fr.about, '/fr/a-propos')
  assert.equal(routes.en.about, '/en/about')
  assert.equal(routes.fr.approach, '/fr/notre-approche')
  assert.equal(routes.en.approach, '/en/our-approach')
})

test('French and English content and interface have the same complete structure', () => {
  assert.deepEqual(shape(content.fr), shape(content.en))
  assert.deepEqual(shape(ui.fr), shape(ui.en))
})

test('services, sectors, approach, projects, and cross-links are complete', () => {
  for (const lang of ['fr', 'en']) {
    const copy = content[lang]
    assert.equal(copy.services.length, 5)
    assert.deepEqual(copy.services.map(service => service.items.length), [6, 6, 11, 6, 6])
    assert.equal(copy.industries.length, 7)
    assert.equal(copy.steps.length, 6)
    assert.equal(copy.projects.length, 6)
    assert.equal(copy.hero.slides.length, 3)
    const serviceIds = new Set(copy.services.map(service => service.id))
    for (const sector of copy.industries) {
      assert.ok(sector.serviceIds.length > 0)
      for (const id of sector.serviceIds) assert.ok(serviceIds.has(id), `${lang}: unknown expertise ${id}`)
    }
    for (const project of copy.projects) {
      assert.ok(project.deliverables.length > 0)
      assert.ok(existsSync(new URL(`../public${project.image}`, import.meta.url)), `${project.id} image missing`)
    }
    assert.equal(copy.about.founderName, 'Lara Loe')
  }
  assert.deepEqual(content.fr.services.map(item => item.id), content.en.services.map(item => item.id))
  assert.deepEqual(content.fr.projects.map(item => item.id), content.en.projects.map(item => item.id))
})

test('contact links encode localized intent and accented context without sending data', () => {
  for (const lang of ['fr', 'en']) {
    for (const intent of ['consultation', 'proposal', 'project', 'general']) {
      const href = contactHref(lang, intent, 'Sécurité & gouvernance')
      const parsed = new URL(href)
      assert.equal(parsed.protocol, 'mailto:')
      assert.equal(parsed.pathname, 'contact@imperialdigitale.com')
      assert.ok(parsed.searchParams.get('subject').includes('Sécurité & gouvernance'))
      assert.ok(parsed.searchParams.get('body').includes('\n'))
      assert.equal([...parsed.searchParams.keys()].length, 2)
      assert.ok(!href.includes('\n'))
    }
  }
  assert.match(new URL(contactHref('fr', 'consultation')).searchParams.get('subject'), /consultation/)
  assert.match(new URL(contactHref('en', 'proposal')).searchParams.get('subject'), /Proposal/)
})

test('language preference persists and gracefully handles unavailable storage', () => {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'localStorage')
  const memory = new Map()
  try {
    Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: { getItem: key => memory.get(key), setItem: (key, value) => memory.set(key, value) } })
    assert.equal(storedLanguage(), 'fr')
    rememberLanguage('en')
    assert.equal(storedLanguage(), 'en')
    rememberLanguage('fr')
    assert.equal(storedLanguage(), 'fr')
    Object.defineProperty(globalThis, 'localStorage', { configurable: true, get() { throw new Error('Storage unavailable') } })
    assert.equal(storedLanguage(), 'fr')
    assert.doesNotThrow(() => rememberLanguage('en'))
  } finally {
    if (descriptor) Object.defineProperty(globalThis, 'localStorage', descriptor)
    else delete globalThis.localStorage
  }
})

test('every credited stock photograph exists and has source and license references', () => {
  const credits = JSON.parse(readFileSync(new URL('../public/image-credits.json', import.meta.url), 'utf8'))
  assert.ok(credits.images.length >= 6)
  for (const image of credits.images) {
    const path = new URL(`../public${image.file}`, import.meta.url)
    assert.ok(existsSync(path), fileURLToPath(path))
    assert.match(image.sourceUrl, /^https:\/\//)
    assert.match(image.licenseUrl, /^https:\/\//)
    assert.ok(image.photographer.length > 0)
  }
})

test('published copy contains no movie demo or placeholder telephone', () => {
  const copy = JSON.stringify({ content, ui })
  assert.doesNotMatch(copy, /CINEMATIC|IMDB|132 min|Watch Now|XXX XX XX XX/i)
  assert.match(ui.fr.mission, /illustrative/i)
  assert.match(ui.en.mission, /illustrative/i)
})
