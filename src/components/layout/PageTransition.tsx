"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ensureGsap, prefersReducedMotion } from "@/lib/motion";
import { LogoMark } from "@/components/ui/Logo";

/**
 * A shutter that closes over the page when an internal link is followed and lifts
 * once the next route has rendered. Modified clicks, new tabs, hashes on the same
 * page and reduced-motion users get ordinary navigation.
 */
export default function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const panel = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const covering = useRef(false);
  const safety = useRef<number | undefined>(undefined);
  const currentPath = useRef(pathname);
  currentPath.current = pathname;

  useEffect(() => {
    const { gsap } = ensureGsap();

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download") || a.dataset.noTransition !== undefined) return;
      let dest: string;
      if (a.dataset.route) {
        // preview build: links carry the site path they stand for
        const url = new URL(a.dataset.route, "https://preview.invalid/");
        if (url.pathname === currentPath.current) return;
        dest = a.dataset.route;
      } else {
        const raw = a.getAttribute("href");
        if (!raw || raw.startsWith("#") || /^(mailto|tel|sms):/.test(raw)) return;
        const url = new URL(a.href, window.location.href);
        if (url.origin !== window.location.origin || url.pathname.startsWith("/api/")) return;
        if (url.pathname === window.location.pathname) return;
        dest = url.pathname + url.search + url.hash;
      }
      if (prefersReducedMotion() || !panel.current) return;

      e.preventDefault();
      covering.current = true;
      gsap.killTweensOf([panel.current, bar.current]);
      gsap.set(panel.current, { yPercent: 100, visibility: "visible" });
      gsap.set(bar.current, { scaleX: 0 });
      gsap
        .timeline()
        .to(panel.current, { yPercent: 0, duration: 0.55, ease: "power3.inOut" })
        .to(bar.current, { scaleX: 0.7, duration: 1.6, ease: "power2.out" }, 0.3)
        .add(() => router.push(dest), 0.5);
      window.clearTimeout(safety.current);
      safety.current = window.setTimeout(() => reveal(), 6000);
    };

    const reveal = () => {
      if (!covering.current || !panel.current) return;
      covering.current = false;
      window.clearTimeout(safety.current);
      gsap.killTweensOf(bar.current);
      gsap
        .timeline()
        .to(bar.current, { scaleX: 1, duration: 0.25, ease: "power2.out" })
        .to(panel.current, { yPercent: -100, duration: 0.75, ease: "power3.inOut" }, 0.15)
        .set(panel.current, { visibility: "hidden" });
    };

    (window as unknown as { __revealPage?: () => void }).__revealPage = reveal;
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => (window as unknown as { __revealPage?: () => void }).__revealPage?.());
    return () => window.cancelAnimationFrame(id);
  }, [pathname]);

  return (
    <div
      ref={panel}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[90] flex items-center justify-center bg-void"
      style={{ visibility: "hidden" }}
    >
      <div className="flex flex-col items-center gap-6 text-platinum">
        <LogoMark className="h-10 w-10" />
        <div className="h-px w-40 overflow-hidden bg-gunmetal">
          <div ref={bar} className="h-full w-full origin-left bg-bronze" />
        </div>
      </div>
    </div>
  );
}
