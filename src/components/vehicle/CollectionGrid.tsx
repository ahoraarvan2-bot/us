"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { vehicles, type Vehicle } from "@/content/vehicles";
import { VehicleCard } from "./VehicleCard";
import { cx } from "@/lib/format";

const filters = [
  { id: "all", label: "All cars", test: () => true },
  { id: "hybrid", label: "Hybrid", test: (v: Vehicle) => v.powertrain === "Hybrid" },
  { id: "combustion", label: "Combustion only", test: (v: Vehicle) => v.powertrain === "Combustion" },
  { id: "mid", label: "Mid-engined", test: (v: Vehicle) => v.layout === "Mid-engine" },
  { id: "rare", label: "Limited and heritage", test: (v: Vehicle) => v.status !== "current" },
] as const;

const sorts = [
  { id: "featured", label: "Featured", fn: () => 0 },
  { id: "power", label: "Most powerful", fn: (a: Vehicle, b: Vehicle) => b.specs.powerPs - a.specs.powerPs },
  { id: "quickest", label: "Quickest to 100 km/h", fn: (a: Vehicle, b: Vehicle) => a.specs.zeroTo100 - b.specs.zeroTo100 },
  { id: "speed", label: "Highest top speed", fn: (a: Vehicle, b: Vehicle) => b.specs.topSpeedKmh - a.specs.topSpeedKmh },
] as const;

export default function CollectionGrid() {
  const [filter, setFilter] = useState<(typeof filters)[number]["id"]>("all");
  const [sort, setSort] = useState<(typeof sorts)[number]["id"]>("featured");

  const list = useMemo(() => {
    const f = filters.find((x) => x.id === filter)!;
    const s = sorts.find((x) => x.id === sort)!;
    return vehicles.filter(f.test).sort(s.fn);
  }, [filter, sort]);

  return (
    <>
      <div className="flex flex-col gap-6 border-y border-gunmetal py-5 lg:flex-row lg:items-center lg:justify-between">
        <div role="group" aria-label="Filter the collection" className="-mx-1 flex flex-wrap gap-1">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={cx(
                "px-3 py-2 text-sm transition-colors",
                filter === f.id ? "bg-platinum text-black" : "text-silver hover:text-platinum"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <label htmlFor="sort" className="shrink-0 text-sm text-steel">
            Sort by
          </label>
          <select id="sort" value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className="field-input !min-h-10 !w-56 !py-2 text-sm">
            {sorts.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <p className="mt-4 text-sm text-steel" aria-live="polite">
        Showing {list.length} of {vehicles.length} cars
      </p>
      <motion.ul layout className="mt-10 grid gap-x-8 gap-y-20 md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {list.map((v, i) => (
            <motion.li
              key={v.slug}
              layout
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <VehicleCard v={v} priority={i < 2} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </>
  );
}
