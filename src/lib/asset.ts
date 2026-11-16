/**
 * Resolves a file in /public. The Next.js site serves them from the domain root;
 * the self-contained preview build sets NEXT_PUBLIC_ASSET_BASE="." so every file
 * is loaded relative to the page instead.
 */
const BASE = process.env.NEXT_PUBLIC_ASSET_BASE ?? "";

export function asset(path: string): string {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  return `${BASE}${path}`;
}
