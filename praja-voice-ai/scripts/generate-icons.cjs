const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Minimal pure Node PNG generator for high-contrast app icon
function createPng(width, height, colorR, colorG, colorB) {
  // Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // 8 bits per channel
  ihdr[9] = 2; // Truecolor (RGB)
  ihdr[10] = 0; // Deflate
  ihdr[11] = 0; // Filter
  ihdr[12] = 0; // Interlace

  const ihdrChunk = createChunk('IHDR', ihdr);

  // Raw image data with scanlines
  const rowBytes = width * 3 + 1;
  const rawData = Buffer.alloc(height * rowBytes);

  const cx = width / 2;
  const cy = height / 2;
  const radius = width * 0.38;

  for (let y = 0; y < height; y++) {
    const rowStart = y * rowBytes;
    rawData[rowStart] = 0; // No filter

    for (let x = 0; x < width; x++) {
      const px = rowStart + 1 + x * 3;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Pulse line logic
      const isPulse = Math.abs(dy - Math.sin((x / width) * Math.PI * 4) * (height * 0.18)) < (width * 0.04) && dist < radius * 1.1;

      if (dist < radius) {
        if (isPulse) {
          rawData[px] = 56;
          rawData[px + 1] = 189;
          rawData[px + 2] = 248; // Cyan pulse
        } else {
          rawData[px] = colorR;
          rawData[px + 1] = colorG;
          rawData[px + 2] = colorB;
        }
      } else {
        // Background
        rawData[px] = 15;
        rawData[px + 1] = 23;
        rawData[px + 2] = 42; // Slate 900
      }
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = createChunk('IDAT', compressedData);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const length = data.length;
  const buf = Buffer.alloc(8 + length + 4);
  buf.writeUInt32BE(length, 0);
  buf.write(type, 4, 4, 'ascii');
  data.copy(buf, 8);

  const crcData = buf.subarray(4, 8 + length);
  const crc = crc32(crcData);
  buf.writeInt32BE(crc, 8 + length);
  return buf;
}

// CRC32 table
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) c = 0xedb88320 ^ (c >>> 1);
    else c = c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xff];
  }
  return crc ^ -1;
}

const publicDir = path.resolve(__dirname, '../public');
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), createPng(192, 192, 2, 132, 199));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), createPng(512, 512, 2, 132, 199));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), createPng(512, 512, 2, 132, 199));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), createPng(180, 180, 2, 132, 199));
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), createPng(32, 32, 2, 132, 199));

console.log('PWA icons created successfully in public/');
