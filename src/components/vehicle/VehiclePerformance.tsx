"use client";

import { useEffect, useRef } from "react";
import { vehicles, type Vehicle } from "@/content/vehicles";
import { Counter } from "@/components/ui/Motion";
import { ensureGsap, prefersReducedMotion } from "@/lib/motion";
import { cx, fmtInt } from "@/lib/format";

function Ranking({
  current,
  title,
  unit,
  get,
  max,
  ticks,
  lowerIsBetter = false,
  decimals = 0,
}: {
  current: Vehicle;
  title: string;
  unit: string;
  get: (v: Vehicle) => number;
  max: number;
  ticks: number[];
  lowerIsBetter?: boolean;
  decimals?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rows = [...vehicles].sort((a, b) => (lowerIsBetter ? get(a) - get(b) : get(b) - get(a)));

  useEffect(() => {
    if (!ref.current || prefersReducedMotion()) return;
    const { gsap } = ensureGsap();
    const ctx = gsap.context(() => {
      gsap.from("[data-bar]", {
        scaleX: 0,
        duration: 1.4,
        ease: "expo.out",
        stagger: 0.05,
        scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref}>
      <h3 className="wd-wide text-sm font-semibold text-platinum">{title}</h3>
      <p className="mt-1 text-xs text-steel">{lowerIsBetter ? "Shorter is quicker." : "Across the eight cars in the collection."}</p>
      <figure className="mt-5">
        <ul className="space-y-2">
          {rows.map((v) => {
            const val = get(v);
            const isMe = v.slug === current.slug;
            return (
              <li key={v.slug} className="grid grid-cols-[minmax(0,9.5rem)_1fr_3.75rem] items-center gap-3 text-xs sm:grid-cols-[11rem_1fr_4rem]">
                <span className={cx("truncate", isMe ? "font-semibold text-platinum" : "text-steel")}>{v.name}</span>
                <span className="relative h-2 bg-white/[0.04]">
                  <span
                    data-bar
                    className={cx("absolute inset-y-0 left-0 origin-left", isMe ? "bg-bronze" : "bg-gunmetal")}
                    style={{ width: `${(val / max) * 100}%` }}
                  />
                </span>
                <span className={cx("tabular text-right", isMe ? "text-platinum" : "text-steel")}>
                  {decimals ? val.toFixed(decimals) : fmtInt(val)}
                </span>
              </li>
            );
          })}
        </ul>
        <div className="mt-2 grid grid-cols-[minmax(0,9.5rem)_1fr_3.75rem] gap-3 sm:grid-cols-[11rem_1fr_4rem]" aria-hidden="true">
          <span />
          <span className="relative h-4 text-[0.625rem] text-steel">
            {ticks.map((t) => (
              <span key={t} className="absolute -translate-x-1/2" style={{ left: `${(t / max) * 100}%` }}>
                {decimals ? t.toFixed(0) : fmtInt(t)}
              </span>
            ))}
          </span>
          <span className="text-right text-[0.625rem] text-steel">{unit}</span>
        </div>
        <figcaption className="sr-only">
          {title}: {current.name} {decimals ? get(current).toFixed(decimals) : fmtInt(get(current))} {unit}
        </figcaption>
      </figure>
    </div>
  );
}

export function VehiclePerformance({ v }: { v: Vehicle }) {
  const s = v.specs;
  const figures = [
    { label: "Power", value: s.powerPs, unit: "PS", decimals: 0, note: s.powerNote ?? (s.powerRpm ? `at ${s.powerRpm}` : "") },
    { label: "Torque", value: s.torqueNm, unit: "Nm", decimals: 0, note: s.torqueNote ?? (s.torqueRpm ? `at ${s.torqueRpm}` : "") },
    { label: "0–100 km/h", value: s.zeroTo100, unit: "s", decimals: 1, note: s.zeroTo200 ? `0–200 km/h in ${s.zeroTo200}` : "" },
    {
      label: "Top speed",
      value: s.topSpeedKmh,
      unit: "km/h",
      decimals: 0,
      prefix: s.topSpeedNote === "over" ? "over" : "",
      note: s.topSpeedNote === "limited" ? "Electronically limited" : s.topSpeedExtra ?? "",
    },
  ];
  return (
    <div>
      <dl className="grid grid-cols-2 gap-px bg-gunmetal lg:grid-cols-4">
        {figures.map((f) => (
          <div key={f.label} className="bg-graphite py-8 pr-4 sm:pr-8">
            <dt className="text-sm text-steel">{f.label}</dt>
            <dd className="mt-3">
              {f.prefix ? <span className="mr-2 text-sm text-silver">{f.prefix}</span> : null}
              <span className="wd-condensed text-[clamp(3rem,7vw,5.5rem)] font-light leading-none text-platinum">
                <Counter value={f.value} decimals={f.decimals} />
              </span>
              <span className="ml-2 text-base text-silver">{f.unit}</span>
              {f.note ? <span className="mt-2 block text-xs text-steel">{f.note}</span> : null}
            </dd>
          </div>
        ))}
      </dl>
      <div className="mt-16 grid gap-14 lg:grid-cols-2">
        <Ranking current={v} title="Power output" unit="PS" get={(x) => x.specs.powerPs} max={1100} ticks={[0, 250, 500, 750, 1000]} />
        <Ranking
          current={v}
          title="0–100 km/h"
          unit="s"
          get={(x) => x.specs.zeroTo100}
          max={4}
          ticks={[0, 1, 2, 3, 4]}
          lowerIsBetter
          decimals={1}
        />
      </div>
    </div>
  );
}
