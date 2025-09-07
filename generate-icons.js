import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create PWA icons directory
const publicDir = path.join(__dirname, 'public');

// Create a simple SVG icon
const svgIcon = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <circle cx="256" cy="256" r="240" fill="url(#grad1)" stroke="#ffffff" stroke-width="32"/>
  <circle cx="256" cy="200" r="40" fill="#ffffff"/>
  <path d="M200 320 Q256 280 312 320" stroke="#ffffff" stroke-width="8" fill="none" stroke-linecap="round"/>
  <text x="256" y="400" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-size="48" font-weight="bold">📍</text>
</svg>
`;

// Write SVG file
fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgIcon);

// Generate PNG icons
async function generateIcons() {
  const svgBuffer = Buffer.from(svgIcon);

  // Generate 192x192 icon
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));

  // Generate 512x512 icon
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));

  console.log('✅ PWA icons generated successfully!');
}

generateIcons().catch(console.error);
