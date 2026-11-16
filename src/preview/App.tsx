import { useEffect, useLayoutEffect, useRef, useSyncExternalStore, type ReactNode } from "react";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import SmoothScroll from "@/components/layout/SmoothScroll";
import PageTransition from "@/components/layout/PageTransition";
import { getVehicle } from "@/content/vehicles";
import { ensureGsap, scrollToTarget } from "@/lib/motion";
import { documentTitle, type PageMeta } from "@/views/meta";
import HomeView, { meta as homeMeta } from "@/views/HomeView";
import CollectionView, { meta as collectionMeta } from "@/views/CollectionView";
import VehicleView, { vehicleMeta } from "@/views/VehicleView";
import PerformanceView, { meta as performanceMeta } from "@/views/PerformanceView";
import TechnologyView, { meta as technologyMeta } from "@/views/TechnologyView";
import GalleryView, { meta as galleryMeta } from "@/views/GalleryView";
import AboutView, { meta as aboutMeta } from "@/views/AboutView";
import ContactView, { meta as contactMeta } from "@/views/ContactView";
import TestDriveView, { meta as testDriveMeta } from "@/views/TestDriveView";
import CreditsView, { meta as creditsMeta } from "@/views/CreditsView";
import NotFoundView, { meta as notFoundMeta } from "@/views/NotFoundView";
import { PrivacyView, TermsView, privacyMeta, termsMeta } from "@/views/LegalViews";
import { getLocation, subscribe, type Loc } from "./router";

const pages: Record<string, { view: () => ReactNode; meta: PageMeta }> = {
  "/": { view: () => <HomeView />, meta: homeMeta },
  "/collection": { view: () => <CollectionView />, meta: collectionMeta },
  "/performance": { view: () => <PerformanceView />, meta: performanceMeta },
  "/technology": { view: () => <TechnologyView />, meta: technologyMeta },
  "/gallery": { view: () => <GalleryView />, meta: galleryMeta },
  "/about": { view: () => <AboutView />, meta: aboutMeta },
  "/contact": { view: () => <ContactView />, meta: contactMeta },
  "/test-drive": { view: () => <TestDriveView />, meta: testDriveMeta },
  "/privacy": { view: () => <PrivacyView />, meta: privacyMeta },
  "/terms": { view: () => <TermsView />, meta: termsMeta },
  "/credits": { view: () => <CreditsView />, meta: creditsMeta },
};

function resolve(path: string): { view: ReactNode; meta: PageMeta } {
  const page = pages[path];
  if (page) return { view: page.view(), meta: page.meta };
  const m = path.match(/^\/collection\/([a-z0-9-]+)$/);
  const v = m ? getVehicle(m[1]) : undefined;
  if (v) return { view: <VehicleView v={v} />, meta: vehicleMeta(v) };
  return { view: <NotFoundView />, meta: notFoundMeta };
}

function lenis() {
  return (window as unknown as { __lenis?: { scrollTo: (t: number, o?: object) => void } }).__lenis;
}

export default function App() {
  const loc = useSyncExternalStore(subscribe, getLocation, getLocation);
  const prev = useRef<Loc | null>(null);
  const { view, meta } = resolve(loc.path);

  // New page: start at the top, then go to the requested section once laid out.
  useLayoutEffect(() => {
    const p = prev.current;
    prev.current = loc;
    const sectionTarget = loc.section ? document.getElementById(loc.section) : null;
    if (!p || p.path !== loc.path || p.search !== loc.search) {
      const l = lenis();
      if (l) l.scrollTo(0, { immediate: true, force: true });
      else window.scrollTo(0, 0);
      if (loc.section) window.setTimeout(() => document.getElementById(loc.section!) && scrollToTarget(document.getElementById(loc.section!)!), 420);
    } else if (sectionTarget && loc.section !== p.section) {
      scrollToTarget(sectionTarget);
    }
    const id = window.setTimeout(() => ensureGsap().ScrollTrigger.refresh(), 160);
    return () => window.clearTimeout(id);
  }, [loc]);

  useEffect(() => {
    document.documentElement.lang = "en-GB";
  }, []);

  return (
    <>
      <title>{documentTitle(meta)}</title>
      <meta name="description" content={meta.description} />
      <button
        type="button"
        className="skip-link"
        onClick={() => {
          const main = document.getElementById("main");
          main?.focus();
          main?.scrollIntoView();
        }}
      >
        Skip to content
      </button>
      <SmoothScroll />
      <SiteHeader />
      <main id="main" tabIndex={-1} className="outline-none" key={loc.path + loc.search}>
        {view}
      </main>
      <SiteFooter />
      <PageTransition />
    </>
  );
}
