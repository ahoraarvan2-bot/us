"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { vehicles, type Vehicle } from "@/content/vehicles";
import { SmartImage } from "@/components/media/SmartImage";
import { LaunchRace } from "./LaunchRace";
import { IS_PREVIEW } from "@/lib/env";
import { cx, fmtInt, priceShort, topSpeedPrefix } from "@/lib/format";

const MAX = 3;
const DEFAULT = ["porsche-911-turbo-s", "lamborghini-revuelto", "ferrari-296-gtb"];
const slugs = new Set(vehicles.map((v) => v.slug));

type Metric = {
  id: string;
  label: string;
  unit: string;
  get: (v: Vehicle) => number;
  show: (v: Vehicle) => string;
  better: "high" | "low";
  max: number;
  note?: (v: Vehicle) => string | undefined;
};

const metrics: Metric[] = [
  {
    id: "power",
    label: "Power",
    unit: "PS",
    get: (v) => v.specs.powerPs,
    show: (v) => fmtInt(v.specs.powerPs),
    better: "high",
    max: 1100,
    note: (v) => `${fmtInt(v.specs.powerKw)} kW${v.powertrain === "Hybrid" ? ", combined" : ""}`,
  },
  {
    id: "torque",
    label: "Torque",
    unit: "Nm",
    get: (v) => v.specs.torqueNm,
    show: (v) => fmtInt(v.specs.torqueNm),
    better: "high",
    max: 1000,
    note: (v) => v.specs.torqueNote,
  },
  {
    id: "accel",
    label: "0–100 km/h",
    unit: "s",
    get: (v) => v.specs.zeroTo100,
    show: (v) => v.specs.zeroTo100.toFixed(1),
    better: "low",
    max: 4,
  },
  {
    id: "vmax",
    label: "Top speed",
    unit: "km/h",
    get: (v) => v.specs.topSpeedKmh,
    show: (v) => `${topSpeedPrefix(v)}${fmtInt(v.specs.topSpeedKmh)}`,
    better: "high",
    max: 380,
    note: (v) => (v.specs.topSpeedNote === "limited" ? "Electronically limited" : v.specs.topSpeedNote === "over" ? "Manufacturer quotes “over”" : undefined),
  },
];

const facts: { label: string; get: (v: Vehicle) => string; note?: (v: Vehicle) => string | undefined }[] = [
  { label: "Engine", get: (v) => v.engine },
  { label: "Gearbox", get: (v) => v.specs.transmission },
  { label: "Drive", get: (v) => v.specs.drive },
  { label: "Layout", get: (v) => `${v.layout}, ${v.powertrain === "Hybrid" ? "hybrid" : "combustion"}` },
  {
    label: "Weight",
    get: (v) => (v.specs.weightKg ? `${fmtInt(v.specs.weightKg)} kg` : "Not published here"),
    note: (v) => (v.specs.weightKg ? v.specs.weightNote : undefined),
  },
  { label: "Price", get: (v) => priceShort(v.price), note: (v) => (v.price.kind === "msrp" ? v.price.label : undefined) },
];

function CompareInner({ initial }: { initial: string[] }) {
  const [sel, setSel] = useState<string[]>(initial);
  const cars = sel.map((s) => vehicles.find((v) => v.slug === s)!).filter(Boolean);
  const cols = Math.max(cars.length, 1);

  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (IS_PREVIEW) return;
    const url = new URL(window.location.href);
    url.searchParams.set("compare", sel.join(","));
    window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
  }, [sel]);

  const toggle = (slug: string) =>
    setSel((s) => (s.includes(slug) ? s.filter((x) => x !== slug) : s.length >= MAX ? s : [...s, slug]));

  const grid = { gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` };

  return (
    <div>
      <div className="flex flex-col gap-4 border-y border-gunmetal py-5 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-silver">
          Choose up to three cars <span className="tabular text-steel">({sel.length} of {MAX})</span>
        </p>
        <div role="group" aria-label="Cars to compare" className="flex flex-wrap gap-1.5">
          {vehicles.map((v) => {
            const on = sel.includes(v.slug);
            const blocked = !on && sel.length >= MAX;
            return (
              <button
                key={v.slug}
                type="button"
                aria-pressed={on}
                aria-disabled={blocked}
                title={blocked ? "Remove a car to add another" : undefined}
                onClick={() => !blocked && toggle(v.slug)}
                className={cx(
                  "min-h-9 border px-3 text-xs transition-colors",
                  on ? "border-platinum bg-platinum text-black" : blocked ? "cursor-not-allowed border-gunmetal text-steel/60" : "border-gunmetal text-silver hover:border-steel hover:text-platinum"
                )}
              >
                {v.make === "Mercedes-AMG" ? "AMG" : v.make} {v.model.replace(" 4MATIC+ Coupé", "")}
              </button>
            );
          })}
        </div>
      </div>

      {cars.length === 0 ? (
        <p className="py-16 text-center text-silver">Choose a car above to start comparing.</p>
      ) : (
        <>
          {/* car headers */}
          <div className="mt-10 grid gap-3 md:gap-6" style={grid}>
            {cars.map((v) => (
              <div key={v.slug} className="min-w-0">
                <Link href={`/collection/${v.slug}`} className="group relative block aspect-[16/10] overflow-hidden">
                  <SmartImage
                    image={v.media.hero}
                    sizes="(min-width: 1024px) 30vw, 33vw"
                    bare
                    imgClassName="transition-transform duration-[1.4s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.04]"
                  />
                </Link>
                <p className="mt-3 truncate text-[0.6875rem] text-steel">{v.make}</p>
                <p className="wd-wide truncate text-sm font-semibold text-platinum md:text-base">{v.model}</p>
                <button type="button" onClick={() => toggle(v.slug)} className="link-line mt-1 text-[0.6875rem] text-steel hover:text-platinum">
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* measured figures */}
          <dl className="mt-10 space-y-8">
            {metrics.map((m) => {
              const vals = cars.map(m.get);
              const best = m.better === "high" ? Math.max(...vals) : Math.min(...vals);
              return (
                <div key={m.id} className="border-t border-gunmetal pt-4">
                  <dt className="flex items-baseline justify-between text-xs text-steel">
                    <span className="wd-wide font-semibold text-silver">{m.label}</span>
                    <span>{m.better === "low" ? "Lower is quicker" : m.unit}</span>
                  </dt>
                  <dd className="mt-3 grid gap-3 md:gap-6" style={grid}>
                    {cars.map((v) => {
                      const val = m.get(v);
                      const lead = cars.length > 1 && val === best;
                      return (
                        <div key={v.slug} className="min-w-0">
                          <p className={cx("wd-condensed tabular text-[clamp(1.6rem,4vw,2.75rem)] font-light leading-none", lead ? "text-bronze-hi" : "text-platinum")}>
                            {m.show(v)}
                            <span className="ml-1 text-xs text-silver">{m.unit}</span>
                          </p>
                          <span className="relative mt-3 block h-1.5 bg-white/[0.05]">
                            <span
                              className={cx("absolute inset-y-0 left-0 transition-[width] duration-700 ease-[cubic-bezier(.16,1,.3,1)]", lead ? "bg-bronze" : "bg-silver/40")}
                              style={{ width: `${Math.min(100, (val / m.max) * 100)}%` }}
                            />
                          </span>
                          {m.note?.(v) ? <p className="mt-2 text-[0.6875rem] leading-snug text-steel">{m.note(v)}</p> : null}
                        </div>
                      );
                    })}
                  </dd>
                </div>
              );
            })}

            {facts.map((f) => (
              <div key={f.label} className="border-t border-gunmetal pt-4">
                <dt className="wd-wide text-xs font-semibold text-silver">{f.label}</dt>
                <dd className="mt-2 grid gap-3 md:gap-6" style={grid}>
                  {cars.map((v) => (
                    <div key={v.slug} className="min-w-0 text-sm leading-snug text-platinum">
                      {f.get(v)}
                      {f.note?.(v) ? <span className="mt-1 block text-[0.6875rem] text-steel">{f.note(v)}</span> : null}
                    </div>
                  ))}
                </dd>
              </div>
            ))}
          </dl>

          <p className="mt-6 text-xs leading-relaxed text-steel">
            Weights are quoted on different bases (dry, kerb or US curb) and are not directly comparable. Prices are manufacturer list prices where published.
          </p>

          <div className="mt-12">
            <LaunchRace slugs={sel} label={cars.length === 1 ? "From a standing start" : `The same ${cars.length === 2 ? "two" : "three"}, from a standing start`} />
          </div>
        </>
      )}
    </div>
  );
}

function CompareFromQuery() {
  const params = useSearchParams();
  const asked = (params.get("compare") ?? "").split(",").filter((s) => slugs.has(s));
  const initial = [...new Set([...asked, ...DEFAULT])].slice(0, MAX);
  return <CompareInner key={initial.join(",")} initial={initial} />;
}

/** Side-by-side comparison of up to three cars. `?compare=a,b,c` preselects them. */
export function CompareTool() {
  return (
    <Suspense fallback={<CompareInner initial={DEFAULT} />}>
      <CompareFromQuery />
    </Suspense>
  );
}
