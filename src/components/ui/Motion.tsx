"use client";

import { createElement, useEffect, useRef, type ReactNode } from "react";
import { ensureGsap, prefersReducedMotion } from "@/lib/motion";
import { cx } from "@/lib/format";

type Tag = "h1" | "h2" | "h3" | "p" | "div" | "span";

/**
 * Headline lines rise out of a mask as they enter the viewport.
 * Text is fully rendered on the server; the effect is only added in the browser.
 */
export function LineReveal({
  as = "h2",
  children,
  className,
  delay = 0,
  immediate = false,
  id,
}: {
  as?: Tag;
  children: ReactNode;
  className?: string;
  delay?: number;
  immediate?: boolean;
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const { gsap, SplitText } = ensureGsap();
    let tween: gsap.core.Tween | undefined;
    const split = SplitText.create(el, {
      type: "lines",
      mask: "lines",
      autoSplit: true,
      linesClass: "reveal-line",
      onSplit(self: { lines: Element[] }) {
        tween = gsap.from(self.lines, {
          yPercent: 115,
          duration: 1.15,
          ease: "expo.out",
          stagger: 0.09,
          delay,
          scrollTrigger: immediate ? undefined : { trigger: el, start: "top 88%", once: true },
        });
        return tween;
      },
    });
    return () => {
      tween?.scrollTrigger?.kill();
      tween?.kill();
      split.revert();
    };
  }, [delay, immediate]);
  return createElement(as, { ref, className, id }, children);
}

/** Image unveiled like a rising garage door, with a slight settle in scale. */
export function Shutter({ children, className, from = "bottom" }: { children: ReactNode; className?: string; from?: "bottom" | "left" }) {
  const ref = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !inner.current || prefersReducedMotion()) return;
    const { gsap } = ensureGsap();
    const ctx = gsap.context(() => {
      gsap
        .timeline({ scrollTrigger: { trigger: el, start: "top 85%", once: true } })
        .fromTo(
          el,
          { clipPath: from === "bottom" ? "inset(100% 0% 0% 0%)" : "inset(0% 100% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "expo.inOut" }
        )
        .fromTo(inner.current, { scale: 1.18 }, { scale: 1, duration: 1.8, ease: "expo.out" }, 0.1);
    }, el);
    return () => ctx.revert();
  }, [from]);
  return (
    <div ref={ref} className={cx(/\babsolute\b|\bfixed\b/.test(className ?? "") ? "" : "relative", "overflow-hidden", className)}>
      <div ref={inner} className="absolute inset-0 will-change-transform">
        {children}
      </div>
    </div>
  );
}

/** Moves its content against the scroll, for depth on large imagery. */
export function Parallax({ children, className, amount = 12 }: { children: ReactNode; className?: string; amount?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current || !inner.current || prefersReducedMotion()) return;
    const { gsap } = ensureGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        inner.current,
        { yPercent: -amount / 2 },
        { yPercent: amount / 2, ease: "none", scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true } }
      );
    }, ref);
    return () => ctx.revert();
  }, [amount]);
  return (
    <div ref={ref} className={cx(/\babsolute\b|\bfixed\b/.test(className ?? "") ? "" : "relative", "overflow-hidden", className)}>
      <div ref={inner} className="absolute inset-x-0 -inset-y-[8%] will-change-transform">
        {children}
      </div>
    </div>
  );
}

/** Counts up to a measured value when it scrolls into view. */
export function Counter({
  value,
  decimals = 0,
  className,
  duration = 1.8,
}: {
  value: number;
  decimals?: number;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const fmt = (n: number) =>
    new Intl.NumberFormat("en-GB", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(n);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const { gsap } = ensureGsap();
    const state = { n: 0 };
    el.textContent = fmt(0);
    const tween = gsap.to(state, {
      n: value,
      duration,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 92%", once: true },
      onUpdate: () => {
        el.textContent = fmt(state.n);
      },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      el.textContent = fmt(value);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, decimals, duration]);
  return (
    <span ref={ref} className={cx("tabular", className)}>
      {fmt(value)}
    </span>
  );
}

/** Generic fade-and-rise for small groups; used sparingly. */
export function Rise({ children, className, delay = 0, y = 28 }: { children: ReactNode; className?: string; delay?: number; y?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const { gsap } = ensureGsap();
    const ctx = gsap.context(() => {
      gsap.from(el.children, {
        y,
        opacity: 0,
        duration: 1,
        ease: "expo.out",
        stagger: 0.08,
        delay,
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
    }, el);
    return () => ctx.revert();
  }, [delay, y]);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
