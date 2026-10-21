// Generates the app icons in public/ from the paw in the mockups.
// Run with `npm run icons` after changing anything here.
import { writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const GREEN = '#013E37'
const BUTTER = '#FFEFB3'
const PAW = `
  <circle cx="6" cy="10.5" r="2.1"/>
  <circle cx="9.8" cy="6" r="2.1"/>
  <circle cx="14.2" cy="6" r="2.1"/>
  <circle cx="18" cy="10.5" r="2.1"/>
  <path d="M12 12c-2.8 0-5.5 3.4-5.5 5.7 0 1.6 1.3 2.4 2.8 2.4 1.1 0 1.8-.6 2.7-.6s1.6.6 2.7.6c1.5 0 2.8-.8 2.8-2.4 0-2.3-2.7-5.7-5.5-5.7z"/>`

// The paw spans 16.2 units of its 24-unit box, centred on (12, 12).
const PAW_SIZE = 16.2

/** A square icon with the paw filling `pawShare` of the width. */
function iconSvg({ size = 1024, pawShare, radius = 0 }) {
  const scale = (size * pawShare) / PAW_SIZE
  const centre = size / 2
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${radius}" fill="${GREEN}"/>
  <g fill="${BUTTER}" transform="translate(${centre} ${centre}) scale(${scale}) translate(-12 -12)">${PAW}
  </g>
</svg>
`
}

const out = (name) => fileURLToPath(new URL(`../public/${name}`, import.meta.url))

// iOS rounds the corners itself, so the touch icon is a full square.
const full = iconSvg({ pawShare: 0.58 })
// Maskable icons can be cropped to a circle; keep the paw inside the 80% safe zone.
const maskable = iconSvg({ pawShare: 0.46 })

await writeFile(out('favicon.svg'), iconSvg({ size: 64, pawShare: 0.62, radius: 16 }))
await sharp(Buffer.from(full)).resize(180).png().toFile(out('apple-touch-icon.png'))
await sharp(Buffer.from(full)).resize(192).png().toFile(out('pwa-192.png'))
await sharp(Buffer.from(full)).resize(512).png().toFile(out('pwa-512.png'))
await sharp(Buffer.from(maskable)).resize(512).png().toFile(out('pwa-maskable-512.png'))

console.log('Icons written to public/')
