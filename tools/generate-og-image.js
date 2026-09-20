/**
 * Generates images/og-cover.png — a branded gradient graphic used for
 * Open Graph / Twitter Card previews. Background/texture is drawn with pure
 * Node (zlib); the real logo is composited on top via sharp.
 *
 * Run with: node tools/generate-og-image.js
 */
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");
const sharp = require("sharp");

const W = 1200;
const H = 630;

// Brand colors
const BLUE_DARK = [23, 37, 84]; // primary-950
const BLUE = [30, 58, 138]; // primary-900
const GREEN = [34, 197, 94]; // secondary-400/DEFAULT

function crc32(buf) {
  let c;
  const table = crc32.table || (crc32.table = (() => {
    const t = [];
    for (let n = 0; n < 256; n++) {
      c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      t[n] = c;
    }
    return t;
  })());
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type, "ascii");
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function drawDot(pixels, w, h, px, py, radius, color, alpha) {
  const r2 = radius * radius;
  const minX = Math.max(0, Math.floor(px - radius));
  const maxX = Math.min(w - 1, Math.ceil(px + radius));
  const minY = Math.max(0, Math.floor(py - radius));
  const maxY = Math.min(h - 1, Math.ceil(py + radius));
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const ddx = x + 0.5 - px, ddy = y + 0.5 - py;
      if (ddx * ddx + ddy * ddy <= r2) {
        const idx = (y * w + x) * 4;
        pixels[idx] = lerp(pixels[idx], color[0], alpha);
        pixels[idx + 1] = lerp(pixels[idx + 1], color[1], alpha);
        pixels[idx + 2] = lerp(pixels[idx + 2], color[2], alpha);
        pixels[idx + 3] = 255;
      }
    }
  }
}

function drawThickPolyline(pixels, w, h, points, strokeWidth, color, alpha) {
  const steps = 80;
  for (let i = 0; i < points.length - 1; i++) {
    const [x1, y1] = points[i];
    const [x2, y2] = points[i + 1];
    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      drawDot(pixels, w, h, x1 + (x2 - x1) * t, y1 + (y2 - y1) * t, strokeWidth / 2, color, alpha);
    }
  }
}

const pixels = Buffer.alloc(W * H * 4);

// Diagonal gradient background (dark blue -> blue -> green)
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const t = (x / W) * 0.6 + (y / H) * 0.4;
    let r, g, b;
    if (t < 0.6) {
      const lt = t / 0.6;
      r = lerp(BLUE_DARK[0], BLUE[0], lt);
      g = lerp(BLUE_DARK[1], BLUE[1], lt);
      b = lerp(BLUE_DARK[2], BLUE[2], lt);
    } else {
      const lt = (t - 0.6) / 0.4;
      r = lerp(BLUE[0], GREEN[0], lt * 0.5);
      g = lerp(BLUE[1], GREEN[1], lt * 0.5);
      b = lerp(BLUE[2], GREEN[2], lt * 0.5);
    }
    const idx = (y * W + x) * 4;
    pixels[idx] = r;
    pixels[idx + 1] = g;
    pixels[idx + 2] = b;
    pixels[idx + 3] = 255;
  }
}

// Faint dot grid texture (top-right quadrant)
for (let gy = 40; gy < 260; gy += 34) {
  for (let gx = 820; gx < 1160; gx += 34) {
    drawDot(pixels, W, H, gx, gy, 2.4, [255, 255, 255], 0.18);
  }
}

// Decorative orbit rings (right side)
function drawRingOutline(cx, cy, r, color, alpha, strokeW) {
  const steps = 360;
  for (let i = 0; i < steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    drawDot(pixels, W, H, cx + Math.cos(a) * r, cy + Math.sin(a) * r, strokeW, color, alpha);
  }
}
drawRingOutline(960, 320, 220, [34, 197, 94], 0.25, 2);
drawRingOutline(960, 320, 160, [255, 255, 255], 0.15, 2);

// Route line + pins motif (bottom area, echoing hero illustration)
const route = [
  [420, 560], [520, 500], [620, 520], [720, 440], [860, 400]
];
for (let i = 0; i < route.length - 1; i++) {
  const [x1, y1] = route[i];
  const [x2, y2] = route[i + 1];
  const dashCount = 14;
  for (let d = 0; d < dashCount; d++) {
    if (d % 2 === 0) continue;
    const t0 = d / dashCount, t1 = (d + 1) / dashCount;
    drawThickPolyline(pixels, W, H, [
      [lerp(x1, x2, t0), lerp(y1, y2, t0)],
      [lerp(x1, x2, t1), lerp(y1, y2, t1)]
    ], 3, [34, 197, 94], 0.8);
  }
}
route.forEach(([x, y], i) => {
  drawDot(pixels, W, H, x, y, i === route.length - 1 ? 10 : 6, i === route.length - 1 ? [34, 197, 94] : [255, 255, 255], 0.9);
});

function encodePNG(pixels, width, height) {
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0;
    pixels.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  }
  const idat = zlib.deflateSync(raw, { level: 9 });
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8;
  ihdrData[9] = 6;
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  return Buffer.concat([signature, chunk("IHDR", ihdrData), chunk("IDAT", idat), chunk("IEND", Buffer.alloc(0))]);
}

const outPath = path.join(__dirname, "..", "images", "og-cover.png");
const logoPath = path.join(__dirname, "..", "images", "logo-hcr.png");

async function main() {
  const background = encodePNG(pixels, W, H);
  const logo = await sharp(logoPath)
    .resize({ width: 520, fit: "inside" })
    .toBuffer();
  const logoMeta = await sharp(logo).metadata();
  const logoX = 90;
  const logoY = Math.round((H - logoMeta.height) / 2) - 20;

  await sharp(background)
    .composite([{ input: logo, left: logoX, top: logoY }])
    .png()
    .toFile(outPath);
  console.log(`Generated ${outPath} (${W}x${H})`);
}
main();
