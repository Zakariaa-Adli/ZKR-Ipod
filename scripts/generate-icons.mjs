import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const SOURCE = 'public/logo/zkr-pure-white-on-dark.png';
const LOGO_DIR = 'public/logo';
const PUBLIC_DIR = 'public';

const sizes = [16, 32, 48, 72, 96, 180, 192, 512];

async function main() {
  console.log('Generating icon assets from', SOURCE);

  for (const size of sizes) {
    const outPath = join(LOGO_DIR, `zkr-icon-${size}.png`);
    await sharp(SOURCE)
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 1 } })
      .png()
      .toFile(outPath);
    console.log(`  Created ${outPath} (${size}x${size})`);
  }

  // Generate favicon.ico (use 32x32 PNG as ico — browsers accept PNG favicons)
  await sharp(SOURCE)
    .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 1 } })
    .png()
    .toFile(join(PUBLIC_DIR, 'favicon.png'));
  console.log('  Created public/favicon.png (32x32)');

  // Also create a proper ICO file with both 16x16 and 32x32
  // ICO format: header + entries + image data
  const img16 = await sharp(SOURCE)
    .resize(16, 16, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 1 } })
    .png()
    .toBuffer();

  const img32 = await sharp(SOURCE)
    .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 1 } })
    .png()
    .toBuffer();

  // ICO file format
  const headerSize = 6;
  const entrySize = 16;
  const numImages = 2;
  const dataOffset1 = headerSize + entrySize * numImages;
  const dataOffset2 = dataOffset1 + img16.length;

  const ico = Buffer.alloc(headerSize + entrySize * numImages + img16.length + img32.length);
  
  // ICONDIR header
  ico.writeUInt16LE(0, 0);     // reserved
  ico.writeUInt16LE(1, 2);     // type (1 = ICO)
  ico.writeUInt16LE(numImages, 4); // count

  // Entry 1: 16x16
  ico.writeUInt8(16, 6);       // width
  ico.writeUInt8(16, 7);       // height
  ico.writeUInt8(0, 8);        // color palette
  ico.writeUInt8(0, 9);        // reserved
  ico.writeUInt16LE(1, 10);    // color planes
  ico.writeUInt16LE(32, 12);   // bits per pixel
  ico.writeUInt32LE(img16.length, 14); // size
  ico.writeUInt32LE(dataOffset1, 18);  // offset

  // Entry 2: 32x32
  ico.writeUInt8(32, 22);      // width
  ico.writeUInt8(32, 23);      // height
  ico.writeUInt8(0, 24);       // color palette
  ico.writeUInt8(0, 25);       // reserved
  ico.writeUInt16LE(1, 26);    // color planes
  ico.writeUInt16LE(32, 28);   // bits per pixel
  ico.writeUInt32LE(img32.length, 30); // size
  ico.writeUInt32LE(dataOffset2, 34);  // offset

  // Image data
  img16.copy(ico, dataOffset1);
  img32.copy(ico, dataOffset2);

  writeFileSync(join(PUBLIC_DIR, 'favicon.ico'), ico);
  console.log('  Created public/favicon.ico (16x16 + 32x32 ICO)');

  console.log('\nDone! All icons generated.');
}

main().catch(err => { console.error(err); process.exit(1); });
