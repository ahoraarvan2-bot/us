"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { heroScenes } from "@/content/films";
import { ensureGsap, prefersReducedMotion, scrollToTarget } from "@/lib/motion";
import { cx } from "@/lib/format";

type Conn = { saveData?: boolean };

export default function HeroFilm() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [stillOnly, setStillOnly] = useState(false);
  const [failed, setFailed] = useState<Record<number, boolean>>({});
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const bars = useRef<(HTMLSpanElement | null)[]>([]);
  const root = useRef<HTMLElement>(null);
  const title = useRef<HTMLHeadingElement>(null);

  // Decide once whether to play film at all.
  useEffect(() => {
    const saveData = (navigator as Navigator & { connection?: Conn }).connection?.saveData === true;
    if (prefersReducedMotion() || saveData) {
      setStillOnly(true);
      setPlaying(false);
    }
  }, []);

  const nextIndex = useCallback(
    (from: number) => {
      for (let step = 1; step <= heroScenes.length; step++) {
        const i = (from + step) % heroScenes.length;
        if (!failed[i]) return i;
      }
      return from;
    },
    [failed]
  );

  // A new scene starts from the beginning; the others rest.
  useEffect(() => {
    videos.current.forEach((v, i) => {
      if (!v) return;
      if (i === active) {
        v.currentTime = 0;
        if (playing && !stillOnly) {
          if (v.preload !== "auto") v.preload = "auto";
          v.play().catch(() => {
            /* autoplay refused: the poster stays */
          });
        }
      } else v.pause();
    });
    const n = videos.current[nextIndex(active)];
    if (n && n.preload === "none") n.preload = "auto";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  // Pause and resume keep the position.
  useEffect(() => {
    const v = videos.current[active];
    if (!v) return;
    if (playing && !stillOnly) {
      if (v.preload !== "auto") v.preload = "auto";
      v.play().catch(() => {});
    } else v.pause();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, stillOnly]);

  // Scene progress bars
  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const v = videos.current[active];
      bars.current.forEach((b, i) => {
        if (!b) return;
        const p = i === active ? (v && v.duration ? v.currentTime / v.duration : 0) : i < active ? 1 : 0;
        b.style.transform = `scaleX(${p})`;
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [active]);

  // Opening sequence: the title "launches" from condensed to expanded width.
  useEffect(() => {
    if (prefersReducedMotion() || !root.current) return;
    const { gsap } = ensureGsap();
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.fromTo("[data-hero-stage]", { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: 2.4 }, 0)
        .fromTo(
          title.current,
          { "--wdth": 62, letterSpacing: "-0.04em", opacity: 0, filter: "blur(10px)" },
          { "--wdth": 125, letterSpacing: "0.005em", opacity: 1, filter: "blur(0px)", duration: 1.9 },
          0.35
        )
        .from("[data-hero-sub] > *", { y: 24, opacity: 0, duration: 1.2, stagger: 0.08 }, 1.05)
        .from("[data-hero-meta]", { opacity: 0, duration: 1.2 }, 1.5);
      // drift the film up a little as the page scrolls
      gsap.to("[data-hero-stage]", {
        yPercent: 12,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const scene = heroScenes[active];

  return (
    <section ref={root} aria-label="Introduction" className="grain relative isolate h-[100svh] min-h-[640px] overflow-hidden bg-void">
      <div data-hero-stage className="absolute inset-0 will-change-transform">
        {heroScenes.map((s, i) => (
          <video
            key={s.id}
            ref={(el) => {
              videos.current[i] = el;
            }}
            className={cx(
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-[1400ms] ease-out",
              i === active ? "opacity-100" : "opacity-0"
            )}
            poster={s.poster}
            muted
            playsInline
            preload={i === 0 ? "auto" : "none"}
            aria-hidden="true"
            tabIndex={-1}
            onEnded={() => {
              const n = nextIndex(i);
              if (n === i) {
                const v = videos.current[i];
                if (v) {
                  v.currentTime = 0;
                  v.play().catch(() => {});
                }
              } else setActive(n);
            }}
            onError={() => {
              setFailed((f) => ({ ...f, [i]: true }));
              if (i === active) setActive((a) => nextIndex(a));
            }}
          >
            <source src={s.mp4.sd} type="video/mp4" media="(max-width: 767px)" />
            <source src={s.mp4.hd} type="video/mp4" />
          </video>
        ))}
        {/* readability: darken the left and the bottom where the type sits */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/25 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/50 to-transparent" />
      </div>

      <div className="shell relative z-10 flex h-full flex-col justify-end pb-[max(5.5rem,env(safe-area-inset-bottom))] pt-28 md:pb-24">
        <h1
          ref={title}
          className="max-w-[16ch] text-[clamp(2.35rem,8.6vw,9.75rem)] font-extrabold uppercase leading-[0.86] text-platinum"
          style={{ fontStretch: "calc(var(--wdth, 125) * 1%)" } as React.CSSProperties}
        >
          <span className="block">Beyond</span>
          <span className="block">the drive.</span>
        </h1>
        <div data-hero-sub className="mt-7 flex flex-col gap-8 md:mt-9 md:flex-row md:items-end md:justify-between">
          <p className="max-w-md text-base text-silver md:text-lg">Engineering emotion. Defining performance.</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/collection" className="btn btn-primary">
              Explore collection
            </Link>
            <button type="button" onClick={() => scrollToTarget("#statement")} className="btn btn-ghost">
              Discover more
            </button>
          </div>
        </div>
      </div>

      {/* scene readout and controls */}
      <div data-hero-meta className="absolute inset-x-0 bottom-0 z-10">
        <div className="shell flex items-center justify-between gap-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          <div className="hidden items-center gap-3 text-[0.6875rem] uppercase tracking-[0.2em] text-steel md:flex" aria-hidden="true">
            <span className="relative block h-8 w-px overflow-hidden bg-white/15">
              <span className="absolute inset-x-0 top-0 h-3 animate-[scrollcue_2.2s_ease-in-out_infinite] bg-platinum" />
            </span>
            Scroll
          </div>
          <div className="ml-auto flex items-center gap-5">
            <div className="hidden text-right sm:block" aria-live="polite">
              <p className="text-xs font-semibold text-platinum wd-wide">{scene.title}</p>
              <p className="text-[0.6875rem] text-steel">{scene.caption}</p>
            </div>
            <div className="flex gap-1.5" aria-hidden="true">
              {heroScenes.map((s, i) => (
                <span key={s.id} className={cx("relative block h-px w-8 overflow-hidden bg-white/20 md:w-12", failed[i] && "hidden")}>
                  <span
                    ref={(el) => {
                      bars.current[i] = el;
                    }}
                    className="absolute inset-0 origin-left bg-platinum"
                    style={{ transform: "scaleX(0)" }}
                  />
                </span>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                if (stillOnly) {
                  setStillOnly(false);
                  setPlaying(true);
                } else setPlaying((p) => !p);
              }}
              aria-label={playing && !stillOnly ? "Pause background film" : "Play background film"}
              className="grid h-10 w-10 place-items-center border border-white/25 text-platinum transition-colors hover:border-platinum"
            >
              {playing && !stillOnly ? (
                <svg width="10" height="12" viewBox="0 0 10 12" aria-hidden="true">
                  <path d="M1.5 1v10M8.5 1v10" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              ) : (
                <svg width="10" height="12" viewBox="0 0 10 12" aria-hidden="true">
                  <path d="M1.5 1l7.5 5-7.5 5z" fill="currentColor" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      <style>{`@keyframes scrollcue{0%{transform:translateY(-100%)}60%{transform:translateY(260%)}100%{transform:translateY(260%)}}`}</style>
    </section>
  );
}
