"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { ensureGsap, prefersReducedMotion } from "@/lib/motion";
import { IS_PREVIEW } from "@/lib/env";

/** Inertial scrolling (desktop wheel/trackpad only; touch keeps native scrolling), synced with GSAP. */
export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const { gsap, ScrollTrigger } = ensureGsap();
    if (prefersReducedMotion()) return;
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // the preview routes on the hash, so in-page anchor handling stays off there
      anchors: IS_PREVIEW ? false : { offset: -80 },
    });
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      (window as unknown as { __lenis?: Lenis }).__lenis = undefined;
    };
  }, []);

  useEffect(() => {
    const { ScrollTrigger } = ensureGsap();
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
    // the preview router does its own scroll handling
    if (!IS_PREVIEW && !window.location.hash) lenis?.scrollTo(0, { immediate: true, force: true });
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return null;
}
