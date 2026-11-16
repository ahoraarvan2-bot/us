import localFont from "next/font/local";

/**
 * Archivo (SIL Open Font License) with its full width axis, 62%–125%.
 * The width axis carries meaning on this site: expanded for the brand voice,
 * normal for reading, condensed for measured data.
 */
export const archivo = localFont({
  src: "../fonts/archivo-latin-standard-normal.woff2",
  variable: "--font-archivo",
  weight: "100 900",
  style: "normal",
  display: "swap",
  preload: true,
  declarations: [{ prop: "font-stretch", value: "62% 125%" }],
  fallback: ["Helvetica Neue", "Arial", "sans-serif"],
  adjustFontFallback: "Arial",
});
