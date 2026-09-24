import { readFile, writeFile } from 'node:fs/promises'

// The supplied 500 × 500 PNG is preserved byte-for-byte. SVG viewports only
// remove its transparent margins, or frame the symbol for the favicon.
const source = await readFile(new URL('../public/brand/logo.png', import.meta.url))
const image = `data:image/png;base64,${source.toString('base64')}`
const wrap = (viewBox, width, height) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="${width}" height="${height}"><title>Impérial Digitale</title><image href="${image}" x="0" y="0" width="500" height="500"/></svg>\n`

await writeFile(new URL('../public/brand/logo.svg', import.meta.url), wrap('104 113 293 278', 293, 278))
await writeFile(new URL('../public/favicon.svg', import.meta.url), wrap('165 113 170 170', 170, 170))
console.log('Logo and favicon prepared from the original PNG.')
