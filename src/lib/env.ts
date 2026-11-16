/**
 * Build target. The Next.js site is the real product; the "preview" build is the same
 * views compiled by Vite into a self-contained page with hash routing (see src/preview).
 */
export const IS_PREVIEW = process.env.NEXT_PUBLIC_PREVIEW === "1";
