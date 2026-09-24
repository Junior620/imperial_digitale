import { content } from './content.ts'
import { routes } from './navigation.ts'
import { ui } from './ui.ts'
import type { Language, PageId } from './types'

export const siteOrigin = 'https://imperialdigitale.vercel.app'
export const socialImageSize = { width: 1200, height: 630 }

export interface HeadTag {
  tag: 'meta' | 'link'
  attributes: Record<string, string>
}

export function pageMetadata(language: Language, page?: PageId) {
  const copy = content[language]
  const descriptions: Record<PageId, string> = {
    home: copy.meta,
    about: copy.about.intro[0],
    services: copy.servicesIntro.description,
    industries: copy.industriesIntro.description,
    approach: copy.approachIntro.description,
    projects: copy.projectsIntro.description,
    contact: copy.contactIntro.description,
  }
  const title = `${page ? copy.nav[page] : ui[language].errorEyebrow} | ${copy.brand}`
  const description = page ? descriptions[page] : ui[language].errorBody
  const tags: HeadTag[] = [{ tag: 'meta', attributes: { name: 'description', content: description } }]

  // Unknown routes must not retain the metadata of the previous page.
  if (!page) {
    tags.push({ tag: 'meta', attributes: { name: 'robots', content: 'noindex, follow' } })
    return { language, title, tags }
  }

  const canonical = `${siteOrigin}${routes[language][page]}`
  const image = `${siteOrigin}/social/og-${language}.png`
  const imageAlt = language === 'fr'
    ? 'Logo Impérial Digitale sur fond bleu profond. Conseil. Technologie. Impact.'
    : 'Imperial Digitale logo on a deep blue background. Consulting. Technology. Impact.'
  const locale = language === 'fr' ? 'fr_CM' : 'en_CM'
  const alternateLocale = language === 'fr' ? 'en_CM' : 'fr_CM'
  const openGraph: Record<string, string> = {
    'og:type': 'website',
    'og:site_name': copy.brand,
    'og:title': title,
    'og:description': description,
    'og:url': canonical,
    'og:locale': locale,
    'og:locale:alternate': alternateLocale,
    'og:image': image,
    'og:image:secure_url': image,
    'og:image:type': 'image/png',
    'og:image:width': String(socialImageSize.width),
    'og:image:height': String(socialImageSize.height),
    'og:image:alt': imageAlt,
  }
  const twitter: Record<string, string> = {
    'twitter:card': 'summary_large_image',
    'twitter:title': title,
    'twitter:description': description,
    'twitter:image': image,
    'twitter:image:alt': imageAlt,
  }
  tags.push(...Object.entries(openGraph).map(([property, value]): HeadTag => ({ tag: 'meta', attributes: { property, content: value } })))
  tags.push(...Object.entries(twitter).map(([name, value]): HeadTag => ({ tag: 'meta', attributes: { name, content: value } })))
  tags.push({ tag: 'link', attributes: { rel: 'canonical', href: canonical } })
  for (const lang of ['fr', 'en'] as const) {
    tags.push({ tag: 'link', attributes: { rel: 'alternate', hreflang: lang, href: `${siteOrigin}${routes[lang][page]}` } })
  }
  tags.push({ tag: 'link', attributes: { rel: 'alternate', hreflang: 'x-default', href: `${siteOrigin}${routes.fr[page]}` } })
  return { language, title, tags }
}

export function applyPageMetadata(language: Language, page?: PageId) {
  const metadata = pageMetadata(language, page)
  document.documentElement.lang = metadata.language
  document.title = metadata.title
  document.head.querySelectorAll('[data-site-meta]').forEach(element => element.remove())
  for (const { tag, attributes } of metadata.tags) {
    const element = document.createElement(tag)
    element.setAttribute('data-site-meta', '')
    for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, value)
    document.head.append(element)
  }
}
