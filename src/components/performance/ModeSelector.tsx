"use client";

import Link from "next/link";
import { useState } from "react";
import { modeSets, type ModeSet } from "@/content/engineering";
import { getVehicle } from "@/content/vehicles";
import { cx } from "@/lib/format";

/** A steering-wheel rotary switch: pointer turns to the chosen position. */
function Dial({ count, index }: { count: number; index: number }) {
  const sweep = 120;
  const start = -sweep / 2;
  const step = count > 1 ? sweep / (count - 1) : 0;
  const angle = start + step * index;
  return (
    <svg viewBox="0 0 120 120" className="h-24 w-24 shrink-0" aria-hidden="true">
      <circle cx="60" cy="60" r="46" fill="var(--color-carbon)" stroke="var(--color-gunmetal)" strokeWidth="1.2" />
      <circle cx="60" cy="60" r="34" fill="none" stroke="var(--color-gunmetal)" strokeWidth="0.8" />
      {Array.from({ length: count }, (_, i) => (
        <line
          key={i}
          x1="60"
          y1="8"
          x2="60"
          y2="16"
          stroke={i === index ? "var(--color-bronze-hi)" : "var(--color-steel)"}
          strokeWidth={i === index ? 2 : 1.2}
          transform={`rotate(${start + step * i} 60 60)`}
        />
      ))}
      <g style={{ transform: `rotate(${angle}deg)`, transformOrigin: "60px 60px", transition: "transform .6s cubic-bezier(.16,1,.3,1)" }}>
        <line x1="60" y1="60" x2="60" y2="30" stroke="var(--color-platinum)" strokeWidth="2" strokeLinecap="round" />
      </g>
      <circle cx="60" cy="60" r="5" fill="var(--color-platinum)" />
    </svg>
  );
}

function ModeGroup({ group, carName }: { group: ModeSet["groups"][number]; carName: string }) {
  const [index, setIndex] = useState(0);
  const current = group.modes[index];
  const name = `${carName}-${group.label}`.replace(/\W+/g, "-");
  return (
    <div className="flex items-start gap-5">
      <Dial count={group.modes.length} index={index} />
      <div className="min-w-0 flex-1">
        <p className="text-[0.6875rem] uppercase tracking-[0.16em] text-steel">{group.label}</p>
        <div role="radiogroup" aria-label={`${carName}: ${group.label}`} className="mt-2 flex flex-wrap gap-1">
          {group.modes.map((m, i) => (
            <button
              key={m.name}
              type="button"
              role="radio"
              aria-checked={i === index}
              name={name}
              onClick={() => setIndex(i)}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                  e.preventDefault();
                  setIndex((i + 1) % group.modes.length);
                  (e.currentTarget.parentElement?.children[(i + 1) % group.modes.length] as HTMLElement)?.focus();
                } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                  e.preventDefault();
                  const n = (i - 1 + group.modes.length) % group.modes.length;
                  setIndex(n);
                  (e.currentTarget.parentElement?.children[n] as HTMLElement)?.focus();
                }
              }}
              tabIndex={i === index ? 0 : -1}
              className={cx(
                "min-h-9 border px-3 text-xs transition-colors",
                i === index ? "border-bronze bg-bronze/15 text-platinum" : "border-gunmetal text-silver hover:border-steel hover:text-platinum"
              )}
            >
              {m.name}
            </button>
          ))}
        </div>
        <p className="mt-3 text-sm text-silver" aria-live="polite">
          <span className="text-platinum">{current.name}:</span> {current.text}
        </p>
      </div>
    </div>
  );
}

/** The published drive-mode systems of two hybrids in the collection. */
export function ModeSelector() {
  return (
    <div className="grid gap-px bg-gunmetal lg:grid-cols-2">
      {modeSets.map((set) => {
        const v = getVehicle(set.slug)!;
        return (
          <div key={set.slug} className="bg-void p-5 md:p-8">
            <p className="text-xs text-steel">{v.make}</p>
            <Link href={`/collection/${v.slug}`} className="wd-expanded text-xl font-bold uppercase text-platinum hover:text-bronze-hi md:text-2xl">
              {v.model}
            </Link>
            <p className="mt-2 text-sm text-silver">{set.control}</p>
            <div className="mt-6 space-y-7">
              {set.groups.map((g) => (
                <ModeGroup key={g.label} group={g} carName={v.model} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
