/**
 * Builds the self-contained preview: the same views and components as the
 * Next.js site, compiled into one page with hash routing and relative asset
 * paths, so it runs from any static host or sandboxed frame.
 *
 *   npm run build:preview   ->  preview-dist/
 */
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  root: r("./src/preview"),
  publicDir: r("./public"),
  base: "./",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [
      { find: /^next\/link$/, replacement: r("./src/preview/shims/next-link.tsx") },
      { find: /^next\/navigation$/, replacement: r("./src/preview/shims/next-navigation.ts") },
      { find: /^next\/dynamic$/, replacement: r("./src/preview/shims/next-dynamic.tsx") },
      { find: /^@\//, replacement: r("./src/") + "/" },
    ],
  },
  define: {
    "process.env.NEXT_PUBLIC_PREVIEW": JSON.stringify("1"),
    "process.env.NEXT_PUBLIC_ASSET_BASE": JSON.stringify("."),
    "process.env.NEXT_PUBLIC_DRACO_DECODER": JSON.stringify("js"),
    "process.env.NEXT_PUBLIC_MODEL_FILE": JSON.stringify("/models/458-spider.glb.json"),
    "process.env.NEXT_PUBLIC_SITE_URL": JSON.stringify("https://onyx-motorhouse.example"),
  },
  build: {
    outDir: r("./preview-dist"),
    emptyOutDir: true,
    target: "es2022",
    sourcemap: false,
    // fonts travel inside the stylesheet; everything else stays a file
    assetsInlineLimit: (file) => file.endsWith(".woff2"),
    chunkSizeWarningLimit: 1500,
  },
});
