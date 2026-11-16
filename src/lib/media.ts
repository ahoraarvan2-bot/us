import manifest from "@/content/media.json";
import localIndex from "@/content/media-local.json";
import { asset } from "@/lib/asset";
import { IS_PREVIEW } from "@/lib/env";

export type Provider = "local" | "unsplash" | "pexels" | "commons";
export type Credit = { author: string; license: string; page: string };
export type MediaImage = {
  id: string;
  provider: Provider;
  src: string;
  w?: number;
  h?: number;
  alt: string;
  credit: Credit;
  tags: string[];
  vehicle?: string;
  /** The file page could not be checked when the manifest was written. */
  unverified?: boolean;
};

/** Written by `npm run media:pull` for every image it downloaded and optimised. */
type PulledEntry = { widths: number[]; ext: string; w?: number; h?: number; credit?: Partial<Credit> };

export const images = manifest.images as MediaImage[];
const byId = new Map(images.map((i) => [i.id, i]));
const pulled = localIndex as Record<string, PulledEntry>;

/** Widths generated for local files (scripts/optimize-local-media.mjs) and requested from Unsplash and Pexels. */
export const SRC_WIDTHS = [640, 1080, 1600, 2400] as const;
/** Wikimedia serves a fixed set of thumbnail widths; others are throttled. */
const COMMONS_WIDTHS = [500, 960, 1280, 1920] as const;

export const providerLabel: Record<Provider, string> = {
  local: "ONYX studio",
  unsplash: "Unsplash",
  pexels: "Pexels",
  commons: "Wikimedia Commons",
};

export function getImage(id: string): MediaImage {
  const img = byId.get(id);
  if (!img) throw new Error(`Unknown image id "${id}". Add it to src/content/media.json.`);
  return img;
}

export function findImage(id?: string | null): MediaImage | undefined {
  return id ? byId.get(id) : undefined;
}

export function creditFor(img: MediaImage): Credit {
  const extra = pulled[img.id]?.credit;
  return { ...img.credit, ...(extra ?? {}) } as Credit;
}

export function isPulled(img: MediaImage) {
  return Boolean(pulled[img.id]);
}

/**
 * Whether this build can show the image at all. The self-contained preview cannot
 * reach third-party image hosts, so only files that ship with the project count there.
 */
export function canShow(img: MediaImage) {
  return !IS_PREVIEW || img.provider === "local" || isPulled(img);
}

function remoteUrl(img: MediaImage, w: number): string {
  switch (img.provider) {
    case "unsplash":
      return `${img.src}?auto=format&fit=max&w=${w}&q=72`;
    case "pexels":
      return `${img.src}?auto=compress&cs=tinysrgb&w=${w}`;
    case "commons":
      return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(img.src)}?width=${w}`;
    default:
      return img.src;
  }
}

function remoteWidths(img: MediaImage): readonly number[] {
  return img.provider === "commons" ? COMMONS_WIDTHS : SRC_WIDTHS;
}

export type ImageCandidate = { src: string; srcSet: string; origin: "local" | "pulled" | "remote" };

/**
 * Ordered list of ways to load an image. The <SmartImage> component tries each
 * in turn and falls back to a designed placeholder if every one fails.
 */
export function candidatesFor(img: MediaImage): ImageCandidate[] {
  const out: ImageCandidate[] = [];
  if (img.provider === "local") {
    const base = img.src.replace(/\.(jpe?g|png)$/i, "");
    out.push({
      src: asset(img.src),
      srcSet: SRC_WIDTHS.map((w) => `${asset(`${base}-${w}.webp`)} ${w}w`).join(", "),
      origin: "local",
    });
    return out;
  }
  const p = pulled[img.id];
  if (p) {
    out.push({
      src: asset(`/media/${img.id}-${p.widths[p.widths.length - 1]}.${p.ext}`),
      srcSet: p.widths.map((w) => `${asset(`/media/${img.id}-${w}.${p.ext}`)} ${w}w`).join(", "),
      origin: "pulled",
    });
  }
  if (!IS_PREVIEW) {
    const widths = remoteWidths(img);
    out.push({
      src: remoteUrl(img, widths[widths.length - 2]),
      srcSet: widths.map((w) => `${remoteUrl(img, w)} ${w}w`).join(", "),
      origin: "remote",
    });
  }
  return out;
}

/** A single URL, for places that need one (Open Graph, preloading neighbours). */
export function bestUrl(img: MediaImage, w = 1600): string {
  if (img.provider === "local") {
    const base = img.src.replace(/\.(jpe?g|png)$/i, "");
    const pick = SRC_WIDTHS.find((x) => x >= w) ?? SRC_WIDTHS[SRC_WIDTHS.length - 1];
    return asset(`${base}-${pick}.webp`);
  }
  const p = pulled[img.id];
  if (p) {
    const pick = p.widths.find((x) => x >= w) ?? p.widths[p.widths.length - 1];
    return asset(`/media/${img.id}-${pick}.${p.ext}`);
  }
  const widths = remoteWidths(img);
  return remoteUrl(img, widths.find((x) => x >= w) ?? widths[widths.length - 1]);
}

/** Absolute URL of the original JPEG of a local image (for Open Graph cards). */
export function localOriginal(img: MediaImage): string | undefined {
  return img.provider === "local" ? img.src : undefined;
}

export const galleryCategories = [
  { id: "all", label: "All" },
  { id: "studio", label: "Studio renders" },
  { id: "exterior", label: "Exterior" },
  { id: "interior", label: "Interior" },
  { id: "detail", label: "Details" },
  { id: "engine", label: "Engines" },
  { id: "night", label: "Night" },
  { id: "showroom", label: "Showroom" },
  { id: "roads", label: "Roads" },
] as const;

/**
 * The first image in the list that this build can show. Lets a layout name a
 * photograph and a studio render to use in its place where the photograph
 * cannot be loaded (the self-contained preview).
 */
export function preferShowable(...ids: string[]): string {
  for (const id of ids) {
    const img = byId.get(id);
    if (img && canShow(img)) return id;
  }
  return ids[0];
}
