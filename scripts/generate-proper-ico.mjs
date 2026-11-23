import sharp from 'sharp';
import fs from 'fs';

async function createIcoBuffer(sourcePath, sizes = [16, 32, 48]) {
  const images = [];

  for (const size of sizes) {
    const { data } = await sharp(sourcePath)
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 1 } })
      .raw()
      .toBuffer({ resolveWithObject: true });

    const andRowBytes = Math.ceil(size / 32) * 4;
    const andMaskSize = andRowBytes * size;
    const xorSize = size * size * 4;
    const imageSize = 40 + xorSize + andMaskSize;

    const imgBuf = Buffer.alloc(imageSize);

    // BITMAPINFOHEADER
    imgBuf.writeUInt32LE(40, 0);          // biSize
    imgBuf.writeInt32LE(size, 4);         // biWidth
    imgBuf.writeInt32LE(size * 2, 8);     // biHeight (doubled for ICO XOR + AND)
    imgBuf.writeUInt16LE(1, 12);          // biPlanes
    imgBuf.writeUInt16LE(32, 14);         // biBitCount
    imgBuf.writeUInt32LE(0, 16);          // biCompression = BI_RGB
    imgBuf.writeUInt32LE(xorSize + andMaskSize, 20); // biSizeImage
    imgBuf.writeInt32LE(0, 24);          // biXPelsPerMeter
    imgBuf.writeInt32LE(0, 28);          // biYPelsPerMeter
    imgBuf.writeUInt32LE(0, 32);         // biClrUsed
    imgBuf.writeUInt32LE(0, 36);         // biClrImportant

    // Write XOR mask (BGRA, bottom-up)
    let offset = 40;
    for (let y = size - 1; y >= 0; y--) {
      for (let x = 0; x < size; x++) {
        const srcIdx = (y * size + x) * 4;
        const r = data[srcIdx];
        const g = data[srcIdx + 1];
        const b = data[srcIdx + 2];
        const a = data[srcIdx + 3];

        imgBuf[offset++] = b;
        imgBuf[offset++] = g;
        imgBuf[offset++] = r;
        imgBuf[offset++] = a;
      }
    }

    // Write AND mask (all zeros for 32-bit alpha)
    imgBuf.fill(0, offset, offset + andMaskSize);

    images.push({ size, buffer: imgBuf });
  }

  // Build ICONDIR and ICONDIRENTRY
  const headerSize = 6;
  const entrySize = 16;
  const numImages = images.length;
  let currentOffset = headerSize + entrySize * numImages;

  const totalSize = currentOffset + images.reduce((acc, img) => acc + img.buffer.length, 0);
  const out = Buffer.alloc(totalSize);

  // ICONDIR
  out.writeUInt16LE(0, 0);
  out.writeUInt16LE(1, 2);
  out.writeUInt16LE(numImages, 4);

  // ICONDIRENTRY array
  let entryOffset = headerSize;
  for (const img of images) {
    out.writeUInt8(img.size >= 256 ? 0 : img.size, entryOffset);     // width
    out.writeUInt8(img.size >= 256 ? 0 : img.size, entryOffset + 1); // height
    out.writeUInt8(0, entryOffset + 2);                              // color count
    out.writeUInt8(0, entryOffset + 3);                              // reserved
    out.writeUInt16LE(1, entryOffset + 4);                           // planes
    out.writeUInt16LE(32, entryOffset + 6);                          // bitCount
    out.writeUInt32LE(img.buffer.length, entryOffset + 8);           // bytesInRes
    out.writeUInt32LE(currentOffset, entryOffset + 12);              // offset

    img.buffer.copy(out, currentOffset);
    currentOffset += img.buffer.length;
    entryOffset += entrySize;
  }

  return out;
}

async function run() {
  const icoBuf = await createIcoBuffer('public/logo/zkr-pure-white-on-dark.png', [16, 32, 48]);
  fs.writeFileSync('public/favicon.ico', icoBuf);
  console.log('Successfully wrote proper Windows DIB favicon.ico, size:', icoBuf.length, 'bytes');

  // Also write to app/favicon.ico for Next.js App Router convention
  fs.writeFileSync('app/favicon.ico', icoBuf);
  console.log('Successfully wrote app/favicon.ico');
}

run().catch(console.error);
