"use client";

import { useState } from "react";
import { vehicles } from "@/content/vehicles";
import { cx, fmtInt, hpFromKw } from "@/lib/format";

const units = [
  { id: "ps", label: "PS", get: (kw: number, ps: number) => ps, max: 1100, ticks: [0, 250, 500, 750, 1000] },
  { id: "kw", label: "kW", get: (kw: number) => kw, max: 800, ticks: [0, 200, 400, 600, 800] },
  { id: "hp", label: "hp", get: (kw: number) => hpFromKw(kw), max: 1100, ticks: [0, 250, 500, 750, 1000] },
] as const;

/** Peak output of every car, in the unit the reader prefers. */
export function PowerChart() {
  const [unit, setUnit] = useState<(typeof units)[number]["id"]>("ps");
  const u = units.find((x) => x.id === unit)!;
  const rows = [...vehicles].sort((a, b) => b.specs.powerKw - a.specs.powerKw);

  return (
    <figure className="border border-gunmetal bg-void p-5 md:p-8">
      <figcaption className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="wd-wide text-sm font-semibold text-platinum">Peak power</p>
          <p className="mt-1 text-xs text-steel">{unit === "hp" ? "Calculated from the manufacturer's kW figure." : "Manufacturer figures. Hybrids show combined output."}</p>
        </div>
        <div role="group" aria-label="Unit" className="flex border border-gunmetal">
          {units.map((x) => (
            <button
              key={x.id}
              type="button"
              aria-pressed={unit === x.id}
              onClick={() => setUnit(x.id)}
              className={cx("min-h-10 px-4 text-xs font-semibold tracking-[0.12em] transition-colors", unit === x.id ? "bg-platinum text-black" : "text-silver hover:text-platinum")}
            >
              {x.label}
            </button>
          ))}
        </div>
      </figcaption>
      <ul className="mt-6 space-y-2.5">
        {rows.map((v, i) => {
          const val = u.get(v.specs.powerKw, v.specs.powerPs);
          return (
            <li key={v.slug} className="grid grid-cols-[minmax(0,8.5rem)_1fr_3.75rem] items-center gap-3 text-xs sm:grid-cols-[11rem_1fr_4.5rem]">
              <span className="truncate text-silver">{v.name}</span>
              <span className="relative h-2 bg-white/[0.04]">
                <span
                  className={cx("absolute inset-y-0 left-0 transition-[width] duration-700 ease-[cubic-bezier(.16,1,.3,1)]", i === 0 ? "bg-bronze" : "bg-silver/40")}
                  style={{ width: `${(val / u.max) * 100}%` }}
                />
              </span>
              <span className="tabular text-right text-platinum">
                {fmtInt(val)} <span className="text-steel">{u.label}</span>
              </span>
            </li>
          );
        })}
      </ul>
      <div className="mt-2 grid grid-cols-[minmax(0,8.5rem)_1fr_3.75rem] gap-3 sm:grid-cols-[11rem_1fr_4.5rem]" aria-hidden="true">
        <span />
        <span className="relative h-4 text-[0.625rem] text-steel">
          {u.ticks.map((t) => (
            <span key={t} className="absolute -translate-x-1/2 first:translate-x-0" style={{ left: `${(t / u.max) * 100}%` }}>
              {fmtInt(t)}
            </span>
          ))}
        </span>
        <span />
      </div>
    </figure>
  );
}
