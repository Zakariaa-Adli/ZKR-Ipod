import sharp from 'sharp';
import fs from 'fs';

const SOURCE = 'public/logo/zkr-pure-white-on-dark.png';

async function updateAllStaleIcons() {
  // app_icon.png (192x192)
  await sharp(SOURCE)
    .resize(192, 192, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 1 } })
    .png()
    .toFile('public/app_icon.png');
  console.log('Updated public/app_icon.png');

  // mstile-70x70.png
  await sharp(SOURCE)
    .resize(70, 70, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 1 } })
    .png()
    .toFile('public/mstile-70x70.png');
  console.log('Updated public/mstile-70x70.png');

  // mstile-310x150.png
  await sharp(SOURCE)
    .resize(310, 150, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 1 } })
    .png()
    .toFile('public/mstile-310x150.png');
  console.log('Updated public/mstile-310x150.png');

  // mstile-310x310.png
  await sharp(SOURCE)
    .resize(310, 310, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 1 } })
    .png()
    .toFile('public/mstile-310x310.png');
  console.log('Updated public/mstile-310x310.png');

  // Also ensure favicon.png is 32x32
  await sharp(SOURCE)
    .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 1 } })
    .png()
    .toFile('public/favicon.png');
  console.log('Updated public/favicon.png');
}

updateAllStaleIcons().catch(console.error);
