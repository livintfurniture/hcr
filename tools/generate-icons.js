/**
 * Generates the site's favicon / PWA icon PNGs and a multi-size .ico from
 * the real brand logo (images/logo-hcr.png) using sharp.
 *
 * Run with: npm run icons
 */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const logoPath = path.join(__dirname, "..", "images", "logo-hcr.png");
const outDir = path.join(__dirname, "..", "favicon");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// Square crop of the "HCR" badge area from the wide logo lockup, used as
// the master image every icon size is resized from.
const BADGE_CROP = { left: 0, top: 0, width: 736, height: 736 };

const sizes = {
  "favicon-16x16.png": 16,
  "favicon-32x32.png": 32,
  "android-chrome-192x192.png": 192,
  "android-chrome-512x512.png": 512,
  "apple-touch-icon.png": 180,
  "mstile-150x150.png": 150
};

function encodeICO(pngBuffers, sizes) {
  const headerSize = 6;
  const dirEntrySize = 16;
  let offset = headerSize + dirEntrySize * pngBuffers.length;
  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngBuffers.length, 4);

  const dirEntries = [];
  pngBuffers.forEach((buf, i) => {
    const size = sizes[i];
    const entry = Buffer.alloc(dirEntrySize);
    entry[0] = size >= 256 ? 0 : size;
    entry[1] = size >= 256 ? 0 : size;
    entry[2] = 0;
    entry[3] = 0;
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(buf.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += buf.length;
    dirEntries.push(entry);
  });

  return Buffer.concat([header, ...dirEntries, ...pngBuffers]);
}

async function main() {
  const badge = sharp(logoPath).extract(BADGE_CROP);

  for (const [name, size] of Object.entries(sizes)) {
    await badge.clone().resize(size, size).png().toFile(path.join(outDir, name));
    console.log(`Generated favicon/${name} (${size}x${size})`);
  }

  const icoSizes = [16, 32];
  const icoBuffers = await Promise.all(
    icoSizes.map((size) => badge.clone().resize(size, size).png().toBuffer())
  );
  fs.writeFileSync(path.join(outDir, "favicon.ico"), encodeICO(icoBuffers, icoSizes));
  console.log("Generated favicon/favicon.ico");
}

main();
