"use client";

import Link from "next/link";
import { useEffect, useId, useRef } from "react";
import { vehicles } from "@/content/vehicles";
import { Counter, LineReveal } from "@/components/ui/Motion";
import { ensureGsap, prefersReducedMotion } from "@/lib/motion";

type Readout = { value: number; decimals?: number; prefix?: string; unit: string; label: string; who: string; fill: number; scale: [string, string] };

function buildReadouts(): Readout[] {
  const byPower = [...vehicles].sort((a, b) => b.specs.powerPs - a.specs.powerPs)[0];
  const quickest = Math.min(...vehicles.map((v) => v.specs.zeroTo100));
  const quickestCars = vehicles.filter((v) => v.specs.zeroTo100 === quickest).map((v) => v.name);
  const fastest = [...vehicles].sort((a, b) => b.specs.topSpeedKmh - a.specs.topSpeedKmh)[0];
  const maxTorque = Math.max(...vehicles.map((v) => v.specs.torqueNm));
  const torqueCars = vehicles.filter((v) => v.specs.torqueNm === maxTorque).map((v) => v.model);
  return [
    { value: byPower.specs.powerPs, unit: "CV", label: "Most power", who: `${byPower.name}, combined output`, fill: byPower.specs.powerPs / 1200, scale: ["0", "1,200"] },
    { value: quickest, decimals: 1, unit: "s", label: "Quickest to 100 km/h", who: quickestCars.join(" and "), fill: (6 - quickest) / 4, scale: ["6 s", "2 s"] },
    {
      value: fastest.specs.topSpeedKmh,
      prefix: fastest.specs.topSpeedNote === "over" ? "Over " : "",
      unit: "km/h",
      label: "Highest top speed",
      who: fastest.name,
      fill: fastest.specs.topSpeedKmh / 400,
      scale: ["0", "400"],
    },
    { value: maxTorque, unit: "Nm", label: "Most torque", who: torqueCars.join(", "), fill: maxTorque / 1000, scale: ["0", "1,000"] },
  ];
}

/** A tachometer arc: 240° sweep, with the needle stopping at the reading. */
function Gauge({ fill, scale }: { fill: number; scale: [string, string] }) {
  const ref = useRef<SVGPathElement>(null);
  const gid = `gauge-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const R = 92;
  const start = (150 * Math.PI) / 180;
  const sweep = (240 * Math.PI) / 180;
  const arc = (a0: number, a1: number) => {
    const x0 = 100 + R * Math.cos(a0);
    const y0 = 100 + R * Math.sin(a0);
    const x1 = 100 + R * Math.cos(a1);
    const y1 = 100 + R * Math.sin(a1);
    return `M${x0.toFixed(2)} ${y0.toFixed(2)} A${R} ${R} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
  };
  const full = arc(start, start + sweep);
  const ticks = Array.from({ length: 25 }, (_, i) => {
    const a = start + (sweep * i) / 24;
    const r0 = i % 4 === 0 ? 78 : 83;
    return { x0: 100 + r0 * Math.cos(a), y0: 100 + r0 * Math.sin(a), x1: 100 + 88 * Math.cos(a), y1: 100 + 88 * Math.sin(a), major: i % 4 === 0 };
  });
  const length = R * sweep;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.style.strokeDashoffset = String(length * (1 - fill));
      return;
    }
    const { gsap } = ensureGsap();
    const tween = gsap.fromTo(
      el,
      { strokeDashoffset: length },
      { strokeDashoffset: length * (1 - fill), duration: 2, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 92%", once: true } }
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [fill, length]);

  return (
    <svg viewBox="0 0 200 200" aria-hidden="true" className="absolute inset-0 h-full w-full">
      <path d={full} fill="none" stroke="var(--color-gunmetal)" strokeWidth="1.2" />
      {ticks.map((t, i) => (
        <line key={i} x1={t.x0} y1={t.y0} x2={t.x1} y2={t.y1} stroke={t.major ? "var(--color-steel)" : "var(--color-gunmetal)"} strokeWidth={t.major ? 1.2 : 0.8} />
      ))}
      <path
        ref={ref}
        d={full}
        fill="none"
        stroke={`url(#${gid})`}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeDasharray={length}
        strokeDashoffset={length * (1 - fill)}
      />
      <text x={100 + R * Math.cos(start)} y={100 + R * Math.sin(start) + 16} textAnchor="middle" fontSize="9" fill="var(--color-steel)">
        {scale[0]}
      </text>
      <text x={100 + R * Math.cos(start + sweep)} y={100 + R * Math.sin(start + sweep) + 16} textAnchor="middle" fontSize="9" fill="var(--color-steel)">
        {scale[1]}
      </text>
      <defs>
        <linearGradient id={gid} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#7c838d" />
          <stop offset="0.7" stopColor="#e2c18c" />
          <stop offset="1" stopColor="#c39a63" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function PerformanceBand() {
  const readouts = buildReadouts();
  return (
    <section aria-labelledby="perf-title" className="relative bg-void py-24 md:py-36">
      <div className="shell">
        <div className="grid gap-8 lg:grid-cols-12">
          <LineReveal as="h2" id="perf-title" className="wd-expanded text-[clamp(2rem,5vw,4.5rem)] font-bold uppercase lg:col-span-7">
            Measured, not claimed
          </LineReveal>
          <div className="lg:col-span-4 lg:col-start-9">
            <p className="text-silver">
              Every figure on this site comes from the manufacturer or a published source, and every source is listed. These are the extremes of the collection.
            </p>
            <Link href="/performance#compare" className="btn btn-bronze mt-6">
              Compare the cars
            </Link>
          </div>
        </div>

        <ul className="mt-16 grid gap-px bg-gunmetal sm:grid-cols-2 lg:grid-cols-4 md:mt-24">
          {readouts.map((r) => (
            <li key={r.label} className="relative bg-void px-2 py-10 sm:px-6">
              <div className="relative mx-auto aspect-square w-full max-w-[17rem]">
                <Gauge fill={r.fill} scale={r.scale} />
                <div className="absolute inset-0 flex flex-col items-center justify-center pt-4 text-center">
                  <p className="text-[0.6875rem] text-steel">{r.prefix ? r.prefix.trim() : " "}</p>
                  <p className="wd-condensed text-[clamp(3.25rem,6vw,4.75rem)] font-light leading-none text-platinum">
                    <Counter value={r.value} decimals={r.decimals ?? 0} />
                  </p>
                  <p className="mt-1 text-sm text-silver">{r.unit}</p>
                </div>
              </div>
              <div className="mt-2 text-center">
                <p className="wd-wide text-sm font-semibold text-platinum">{r.label}</p>
                <p className="mt-1 text-xs text-steel">{r.who}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
