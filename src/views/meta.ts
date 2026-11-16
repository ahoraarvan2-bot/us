import type { Metadata } from "next";
import { site } from "@/content/site";

/** Page metadata shared by the Next.js routes and the preview build. */
export type PageMeta = {
  path: string;
  title: string;
  description: string;
  /** Use the title as written instead of "Title | ONYX Motor House". */
  absoluteTitle?: boolean;
  /** Open Graph image (a path in /public or an absolute URL). */
  image?: string;
  noindex?: boolean;
};

export function documentTitle(m: PageMeta) {
  return m.absoluteTitle ? m.title : `${m.title} | ${site.fullName}`;
}

export function toMetadata(m: PageMeta): Metadata {
  return {
    title: m.absoluteTitle ? { absolute: m.title } : m.title,
    description: m.description,
    alternates: { canonical: m.path },
    robots: m.noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      title: documentTitle(m),
      description: m.description,
      url: m.path,
      ...(m.image ? { images: [{ url: m.image }] } : {}),
    },
  };
}
