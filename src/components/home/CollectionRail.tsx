"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { vehicles } from "@/content/vehicles";
import { SmartImage } from "@/components/media/SmartImage";
import { LineReveal } from "@/components/ui/Motion";
import { ensureGsap, prefersReducedMotion } from "@/lib/motion";
import { fmtInt, topSpeedPrefix } from "@/lib/format";

/**
 * Desktop: the section pins and the cars travel past horizontally as you scroll.
 * Touch and small screens: a native swipeable row with snap points.
 */
export default function CollectionRail() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !section.current || !track.current) return;
    const { gsap, ScrollTrigger } = ensureGsap();
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (hover: hover)", () => {
      const t = track.current!;
      const distance = () => Math.max(0, t.scrollWidth - window.innerWidth);
      const tween = gsap.to(t, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });
      return () => tween.scrollTrigger?.kill();
    });
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    return () => {
      window.removeEventListener("load", refresh);
      mm.revert();
    };
  }, []);

  return (
    <section ref={section} aria-labelledby="collection-title" className="relative overflow-hidden bg-void lg:h-[100svh]">
      <div className="flex h-full flex-col justify-center py-20 lg:py-0">
        <div className="shell mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between lg:mb-12">
          <div>
            <LineReveal as="h2" id="collection-title" className="wd-expanded text-[clamp(2rem,5vw,4.5rem)] font-bold uppercase">
              The collection
            </LineReveal>
            <p className="mt-4 max-w-xl text-silver">
              Eight cars, chosen for how they drive. Current models, a limited-series M5 and one heritage Ferrari.
            </p>
          </div>
          <Link href="/collection" className="btn btn-ghost shrink-0 self-start md:self-auto">
            View all eight
          </Link>
        </div>

        <div
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-[max(1.25rem,env(safe-area-inset-left))] pb-4 [scrollbar-width:none] md:px-10 lg:snap-none lg:overflow-visible lg:px-16 lg:pb-0 [&::-webkit-scrollbar]:hidden"
          data-lenis-prevent-touch
        >
          <div ref={track} className="flex gap-4 md:gap-6 lg:will-change-transform">
            {vehicles.map((v, i) => (
              <Link
                key={v.slug}
                href={`/collection/${v.slug}`}
                className="group relative block aspect-[4/5] w-[82vw] shrink-0 snap-start overflow-hidden sm:aspect-[16/11] sm:w-[68vw] lg:aspect-[16/10] lg:w-[min(56vw,980px)]"
              >
                <SmartImage
                  image={v.media.hero}
                  priority={i < 2}
                  sizes="(min-width: 1024px) 56vw, 82vw"
                  fallbackLabel={v.name}
                  bare
                  imgClassName="transition-transform duration-[1.6s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/10" />
                <div className="absolute inset-x-0 bottom-0 flex flex-col gap-5 p-5 md:p-8">
                  <div>
                    <p className="text-sm text-silver">
                      {v.make} <span className="text-steel">{v.year}</span>
                    </p>
                    <p className="wd-expanded mt-1 text-[clamp(1.6rem,3.4vw,3.25rem)] font-bold uppercase leading-[0.95] text-platinum">
                      {v.model}
                    </p>
                  </div>
                  <dl className="tabular grid max-w-lg grid-cols-3 gap-4 border-t border-white/15 pt-4 text-platinum">
                    <div>
                      <dt className="text-[0.6875rem] text-silver">Power</dt>
                      <dd className="wd-condensed text-xl font-medium md:text-2xl">
                        {fmtInt(v.specs.powerPs)} <span className="text-xs text-silver">PS</span>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[0.6875rem] text-silver">0–100 km/h</dt>
                      <dd className="wd-condensed text-xl font-medium md:text-2xl">
                        {v.specs.zeroTo100.toFixed(1)} <span className="text-xs text-silver">s</span>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[0.6875rem] text-silver">Top speed</dt>
                      <dd className="wd-condensed text-xl font-medium md:text-2xl">
                        {topSpeedPrefix(v)}
                        {fmtInt(v.specs.topSpeedKmh)} <span className="text-xs text-silver">km/h</span>
                      </dd>
                    </div>
                  </dl>
                </div>
              </Link>
            ))}
            <Link
              href="/collection"
              className="group relative hidden aspect-[16/10] w-[28vw] shrink-0 flex-col justify-end border border-gunmetal p-8 lg:flex"
            >
              <span className="wd-expanded text-2xl font-bold uppercase text-platinum">The full collection</span>
              <span className="mt-3 text-sm text-silver">Specifications, prices and configurations for every car.</span>
              <span className="link-line mt-6 self-start text-xs font-semibold uppercase tracking-[0.18em] text-bronze-hi">Open the collection</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
