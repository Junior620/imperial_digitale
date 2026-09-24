import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { Resvg } from '@resvg/resvg-js'

// All artwork is composed as native SVG. The official PNG logo remains unchanged.
// Inter is bundled under the SIL Open Font License; no system fonts are required.
const output = new URL('../public/social/', import.meta.url)
const logo = await readFile(new URL('../public/brand/logo.png', import.meta.url))
const font = fileURLToPath(new URL('../assets/fonts/Inter-Variable.ttf', import.meta.url))
await mkdir(output, { recursive: true })

const languages = {
  fr: {
    name: 'Impérial',
    label: 'CABINET DE CONSEIL',
    tagline: 'Conseil. Technologie. Impact.',
    location: 'Yaoundé, Cameroun',
  },
  en: {
    name: 'Imperial',
    label: 'DIGITAL CONSULTANCY',
    tagline: 'Consulting. Technology. Impact.',
    location: 'Yaoundé, Cameroon',
  },
}

for (const [language, text] of Object.entries(languages)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <title>${text.name} Digitale — ${text.tagline}</title>
  <rect width="1200" height="630" fill="#08121b"/>
  <path d="M786 0H1200V630H786Z" fill="#0c1a26"/>
  <g fill="none" stroke="#b9a98d" stroke-opacity="0.12">
    <circle cx="1158" cy="44" r="210"/>
    <circle cx="1158" cy="44" r="250"/>
    <circle cx="1158" cy="44" r="290"/>
    <path d="M786 0V630"/>
  </g>
  <rect x="72" y="72" width="28" height="2" rx="1" fill="#b9a98d"/>
  <g font-family="Inter" fill="#f4f2ed">
    <text x="114" y="79" font-size="15" letter-spacing="2.2" fill="#b9a98d">${text.label}</text>
    <text x="66" y="265" font-size="100" font-weight="600" letter-spacing="-4">${text.name}</text>
    <text x="66" y="371" font-size="100" font-weight="600" letter-spacing="-4">Digitale</text>
    <text x="72" y="435" font-size="29" letter-spacing="-0.6" fill="#d4d6d5">${text.tagline}</text>
    <text x="72" y="568" font-size="18" letter-spacing="0.2">imperialdigitale.vercel.app</text>
    <text x="1128" y="568" text-anchor="end" font-size="16" fill="#b9a98d">${text.location}</text>
  </g>
  <path d="M72 519H1128" stroke="#f4f2ed" stroke-opacity="0.16"/>
  <svg x="838" y="175" width="280" height="266" viewBox="104 113 293 278">
    <image href="data:image/png;base64,${logo.toString('base64')}" width="500" height="500"/>
  </svg>
</svg>`

  const renderer = new Resvg(svg, {
    font: { fontFiles: [font], loadSystemFonts: false, defaultFontFamily: 'Inter' },
  })
  const png = renderer.render()
  if (png.width !== 1200 || png.height !== 630) throw new Error('Unexpected social-card dimensions')
  await writeFile(new URL(`og-${language}.svg`, output), `${svg}\n`)
  await writeFile(new URL(`og-${language}.png`, output), png.asPng())
  console.log(`Created ${language.toUpperCase()} social card (1200 × 630).`)
}
