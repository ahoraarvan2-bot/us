#!/usr/bin/env node
/**
 * Makes responsive WebP copies of the studio renders in public/studio:
 * name.jpg -> name-640.webp, name-1080.webp, name-1600.webp, name-2400.webp.
 * Skips copies that are newer than their source. Run after adding or replacing a render.
 */
import { readdirSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const dir = new URL("../public/studio/", import.meta.url).pathname;
const WIDTHS = [640, 1080, 1600, 2400];

let made = 0;
for (const file of readdirSync(dir).filter((f) => /\.(jpe?g|png)$/i.test(f))) {
  const src = join(dir, file);
  const base = file.replace(/\.(jpe?g|png)$/i, "");
  const srcTime = statSync(src).mtimeMs;
  const meta = await sharp(src).metadata();
  for (const w of WIDTHS) {
    const dest = join(dir, `${base}-${w}.webp`);
    if (existsSync(dest) && statSync(dest).mtimeMs > srcTime) continue;
    await sharp(src)
      .resize({ width: Math.min(w, meta.width ?? w), withoutEnlargement: true })
      .webp({ quality: w >= 1600 ? 80 : 76, effort: 5 })
      .toFile(dest);
    made++;
  }
}
console.log(`optimize-local-media: ${made} file(s) written`);
