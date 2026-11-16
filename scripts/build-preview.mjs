#!/usr/bin/env node
/**
 * Builds the self-contained preview (see vite.preview.config.mts) and turns its
 * index.html into a page fragment for hosts that supply their own <html>,
 * <head> and <body> (such as a Claude artifact). The stylesheet is inlined;
 * scripts and media stay as files referenced by relative paths.
 */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, readdirSync, statSync, rmSync, existsSync } from "node:fs";
import { join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const out = join(root, "preview-dist");

execFileSync(process.execPath, [join(root, "node_modules/vite/bin/vite.js"), "build", "--config", "vite.preview.config.mts"], {
  cwd: root,
  stdio: "inherit",
});

// The preview host serves .json but not .glb: ship the model wrapped in JSON
execFileSync(process.execPath, [join(root, "scripts/model/glb-to-json.mjs"), join(out, "models/458-spider.glb"), join(out, "models/458-spider.glb.json")], {
  cwd: root,
  stdio: "inherit",
});

// Files the preview never requests
for (const p of ["media/.gitkeep", "draco/draco_decoder.wasm", "draco/draco_wasm_wrapper.js", "og.jpg", "models/458-spider.glb"]) {
  const f = join(out, p);
  if (existsSync(f)) rmSync(f);
}

let html = readFileSync(join(out, "index.html"), "utf8");

// Inline the stylesheet(s)
html = html.replace(/<link rel="stylesheet"[^>]*href="\.\/(assets\/[^"]+\.css)"[^>]*>/g, (_, href) => {
  const css = readFileSync(join(out, href), "utf8");
  rmSync(join(out, href));
  return `<style>${css}</style>`;
});

const head = html.match(/<head>([\s\S]*?)<\/head>/)?.[1] ?? "";
const body = html.match(/<body>([\s\S]*?)<\/body>/)?.[1] ?? "";
const keep = head
  .replace(/<meta charset[^>]*>/i, "")
  .replace(/<meta name="viewport"[^>]*>/i, "")
  .trim();

// <title> first, so hosts that read the name from the top of the file find it
const title = keep.match(/<title>[\s\S]*?<\/title>/)?.[0] ?? "";
const rest = keep.replace(title, "").trim();
writeFileSync(join(out, "index.html"), `${title}\n${rest}\n${body.trim()}\n`);

// Inventory
const files = [];
const walk = (d) => {
  for (const name of readdirSync(d)) {
    const p = join(d, name);
    const s = statSync(p);
    if (s.isDirectory()) walk(p);
    else files.push({ path: relative(out, p), size: s.size });
  }
};
walk(out);
const supporting = files.filter((f) => f.path !== "index.html" && f.path !== "files.json");
writeFileSync(join(out, "files.json"), JSON.stringify(Object.fromEntries(supporting.map((f) => [f.path, join(out, f.path)])), null, 2));
const total = files.reduce((a, f) => a + f.size, 0);
const page = files.find((f) => f.path === "index.html");
console.log(`\npreview-dist: ${files.length} files, ${(total / 1048576).toFixed(1)} MB; page ${(page.size / 1024).toFixed(0)} KB`);
const big = files.filter((f) => f.size > 2 * 1048576).map((f) => `${f.path} ${(f.size / 1048576).toFixed(1)} MB`);
if (big.length) console.log("largest:", big.join(", "));
