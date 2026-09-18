// Regenerates assets/*.png from assets/source/*.svg.
// Run with: node scripts/generate-icons.js
// Edit the SVGs in assets/source/ to change the icon design, then re-run.

const path = require('path');
const sharp = require('sharp');

const SOURCE = path.join(__dirname, '..', 'assets', 'source');
const OUT = path.join(__dirname, '..', 'assets');

async function run() {
  // Main app icon: 1024x1024, solid dark background + flame
  await sharp(path.join(SOURCE, 'flame.svg'))
    .resize(1024, 1024)
    .png()
    .toFile(path.join(OUT, 'icon.png'));

  // Splash icon: 1024x1024, transparent (Expo composites over splash.backgroundColor)
  await sharp(path.join(SOURCE, 'flame-transparent.svg'))
    .resize(1024, 1024)
    .png()
    .toFile(path.join(OUT, 'splash-icon.png'));

  // Android adaptive icon foreground: 512x512 transparent, flame within the ~66% safe zone
  await sharp(path.join(SOURCE, 'flame-transparent.svg'))
    .resize(340, 340)
    .extend({ top: 86, bottom: 86, left: 86, right: 86, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(OUT, 'android-icon-foreground.png'));

  // Android adaptive icon background: solid dark, 512x512
  await sharp({ create: { width: 512, height: 512, channels: 4, background: '#0C0B0D' } })
    .png()
    .toFile(path.join(OUT, 'android-icon-background.png'));

  // Android monochrome (themed icon): 432x432 transparent, white flame within safe zone
  await sharp(path.join(SOURCE, 'flame-monochrome.svg'))
    .resize(290, 290)
    .extend({ top: 71, bottom: 71, left: 71, right: 71, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(OUT, 'android-icon-monochrome.png'));

  // Favicon: 48x48, solid dark background + flame
  await sharp(path.join(SOURCE, 'flame.svg'))
    .resize(48, 48)
    .png()
    .toFile(path.join(OUT, 'favicon.png'));

  console.log('Regenerated all icon/splash assets from assets/source/*.svg');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
