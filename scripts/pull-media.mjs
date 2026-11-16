#!/usr/bin/env node
/**
 * Self-hosts the photographs listed in src/content/media.json.
 *
 *   npm run media:pull    download every remote image, write responsive WebP copies to
 *                         public/media/<id>-<width>.webp, read exact Wikimedia Commons
 *                         credits, and record it all in src/content/media-local.json
 *   npm run media:check   only check that every remote image still loads; exits 1 if not
 *
 * The site prefers the self-hosted copies automatically once they exist.
 * Wikimedia asks automated clients to identify themselves: set MEDIA_CONTACT to an
 * email address or URL for your project before running (e.g. MEDIA_CONTACT=you@site.com).
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const root = new URL("..", import.meta.url).pathname;
const manifest = JSON.parse(readFileSync(join(root, "src/content/media.json"), "utf8"));
const outDir = join(root, "public/media");
const indexFile = join(root, "src/content/media-local.json");
const CHECK = process.argv.includes("--check");
const WIDTHS = [640, 1080, 1600, 2400];
const UA = `onyx-site-media/1.0 (${process.env.MEDIA_CONTACT || "set MEDIA_CONTACT"})`;

const remote = manifest.images.filter((i) => i.provider !== "local");

function sourceUrl(img, w) {
  if (img.provider === "unsplash") return `${img.src}?fm=jpg&q=85&fit=max&w=${w}`;
  if (img.provider === "pexels") return `${img.src}?auto=compress&cs=tinysrgb&w=${w}`;
  if (img.provider === "commons") return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(img.src)}?width=${Math.min(w, 1920)}`;
  throw new Error(`Unknown provider ${img.provider}`);
}

const strip = (html = "") => html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();

async function commonsCredit(file) {
  const api = `https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=extmetadata&titles=${encodeURIComponent(`File:${file}`)}`;
  const res = await fetch(api, { headers: { "user-agent": UA } });
  if (!res.ok) return undefined;
  const page = Object.values((await res.json()).query?.pages ?? {})[0];
  const m = page?.imageinfo?.[0]?.extmetadata;
  if (!m) return undefined;
  return { author: strip(m.Artist?.value) || undefined, license: strip(m.LicenseShortName?.value) || undefined };
}

async function fetchImage(url) {
  const res = await fetch(url, { headers: { "user-agent": UA }, redirect: "follow" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const type = res.headers.get("content-type") || "";
  if (!type.startsWith("image/")) throw new Error(`not an image (${type})`);
  return Buffer.from(await res.arrayBuffer());
}

async function pool(items, n, fn) {
  const results = [];
  let i = 0;
  await Promise.all(
    Array.from({ length: n }, async () => {
      while (i < items.length) {
        const k = i++;
        results[k] = await fn(items[k]).catch((e) => ({ error: e }));
      }
    })
  );
  return results;
}

if (CHECK) {
  const res = await pool(remote, 6, async (img) => {
    const r = await fetch(sourceUrl(img, 640), { headers: { "user-agent": UA }, redirect: "follow" });
    return { ok: r.ok && (r.headers.get("content-type") || "").startsWith("image/"), status: r.status };
  });
  let bad = 0;
  remote.forEach((img, k) => {
    const r = res[k];
    const ok = r && !r.error && r.ok;
    if (!ok) bad++;
    console.log(`${ok ? "ok  " : "FAIL"}  ${img.id.padEnd(32)} ${img.provider.padEnd(9)} ${r?.error ? r.error.message : r?.status}${img.unverified ? "  (marked unverified)" : ""}`);
  });
  console.log(`\n${remote.length - bad} of ${remote.length} remote images load.${bad ? " Replace or remove the failing entries in src/content/media.json." : ""}`);
  process.exit(bad ? 1 : 0);
}

mkdirSync(outDir, { recursive: true });
let index = {};
try {
  index = JSON.parse(readFileSync(indexFile, "utf8"));
} catch {}

const results = await pool(remote, 4, async (img) => {
  const buf = await fetchImage(sourceUrl(img, 2400));
  const meta = await sharp(buf).metadata();
  const widths = WIDTHS.filter((w) => w <= (meta.width ?? 0));
  if (!widths.length || widths[widths.length - 1] !== meta.width) widths.push(Math.min(meta.width ?? 640, 2400));
  const uniq = [...new Set(widths)].sort((a, b) => a - b);
  for (const w of uniq) {
    await sharp(buf).resize({ width: w, withoutEnlargement: true }).webp({ quality: 78, effort: 5 }).toFile(join(outDir, `${img.id}-${w}.webp`));
  }
  const credit = img.provider === "commons" ? await commonsCredit(img.src).catch(() => undefined) : undefined;
  return { widths: uniq, ext: "webp", w: meta.width, h: meta.height, ...(credit ? { credit } : {}) };
});

let ok = 0;
remote.forEach((img, k) => {
  const r = results[k];
  if (r && !r.error) {
    index[img.id] = r;
    ok++;
    console.log(`ok    ${img.id}`);
  } else {
    console.log(`FAIL  ${img.id}: ${r?.error?.message}`);
  }
});
writeFileSync(indexFile, JSON.stringify(index, null, 2) + "\n");
console.log(`\n${ok} of ${remote.length} images self-hosted in public/media. Rebuild the site to use them.`);
