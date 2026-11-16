/**
 * Hash router for the self-contained preview build.
 *
 * The page is hosted as one document whose address can only carry a plain
 * `#name`, so every site path is encoded as an ASCII name:
 *   /                          -> #home
 *   /collection/bmw-m5-cs      -> #collection-bmw-m5-cs
 *   /test-drive?vehicle=x      -> #test-drive-x
 *   /performance#compare       -> #performance--compare
 * Any other query string is kept in memory for the current visit.
 */
import { vehicles } from "@/content/vehicles";

export type Loc = { path: string; search: string; section: string | null };

const slugs = new Set(vehicles.map((v) => v.slug));
export const PAGES = ["/", "/collection", "/performance", "/technology", "/gallery", "/about", "/contact", "/test-drive", "/privacy", "/terms", "/credits"];

function nameFor(path: string, search: string) {
  if (path === "/" || path === "") return "home";
  const m = path.match(/^\/collection\/([a-z0-9-]+)$/);
  if (m) return `collection-${m[1]}`;
  if (path === "/test-drive") {
    const p = new URLSearchParams(search);
    const v = p.get("vehicle");
    if (v && slugs.has(v) && [...p.keys()].length === 1) return `test-drive-${v}`;
  }
  return path.replace(/^\//, "").replace(/\//g, "-");
}

export function toHash(href: string): string {
  const u = new URL(href, "https://preview.invalid/");
  const name = nameFor(u.pathname, u.search);
  const section = u.hash.replace(/^#/, "");
  return `#${name}${section ? `--${section}` : ""}`;
}

function parse(hash: string): Loc {
  const raw = decodeURIComponent(hash.replace(/^#/, ""));
  const [name, section = null] = raw.split("--");
  if (!name || name === "home") return { path: "/", search: "", section };
  if (name.startsWith("collection-") && slugs.has(name.slice(11))) return { path: `/collection/${name.slice(11)}`, search: "", section };
  if (name.startsWith("test-drive-") && slugs.has(name.slice(11))) return { path: "/test-drive", search: `?vehicle=${name.slice(11)}`, section };
  return { path: `/${name}`, search: "", section };
}

let current: Loc = typeof window === "undefined" ? { path: "/", search: "", section: null } : parse(window.location.hash);
let pendingSearch: { path: string; search: string } | null = null;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function getLocation() {
  return current;
}

if (typeof window !== "undefined") {
  window.addEventListener("hashchange", () => {
    const next = parse(window.location.hash);
    if (pendingSearch && pendingSearch.path === next.path) next.search = pendingSearch.search || next.search;
    pendingSearch = null;
    current = next;
    emit();
  });
}

export function navigate(href: string, opts: { replace?: boolean } = {}) {
  const u = new URL(href, "https://preview.invalid/");
  const hash = toHash(href);
  const next: Loc = { path: u.pathname, search: u.search, section: u.hash ? u.hash.slice(1) : null };
  if (hash === window.location.hash || (hash === "#home" && !window.location.hash)) {
    // same address: only the in-memory query or the section changed
    current = next;
    emit();
    return;
  }
  pendingSearch = { path: next.path, search: next.search };
  if (opts.replace) {
    window.history.replaceState(window.history.state, "", hash);
    current = next;
    pendingSearch = null;
    emit();
  } else {
    window.location.hash = hash;
  }
}

export function isKnownPath(path: string) {
  return PAGES.includes(path) || /^\/collection\/[a-z0-9-]+$/.test(path) && slugs.has(path.split("/")[2]);
}
