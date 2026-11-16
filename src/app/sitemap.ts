import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { vehicles } from "@/content/vehicles";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url.replace(/\/$/, "");
  const pages = ["", "/collection", "/performance", "/technology", "/gallery", "/about", "/contact", "/test-drive", "/privacy", "/terms", "/credits"];
  return [
    ...pages.map((p) => ({ url: `${base}${p}`, changeFrequency: "monthly" as const, priority: p === "" ? 1 : 0.7 })),
    ...vehicles.map((v) => ({ url: `${base}/collection/${v.slug}`, changeFrequency: "monthly" as const, priority: 0.9 })),
  ];
}
