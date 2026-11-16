"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Option, Vehicle } from "@/content/vehicles";
import { cx } from "@/lib/format";

function PaintChip({ color }: { color: string }) {
  return (
    <div
      className="aspect-square w-full rounded-full shadow-[0_40px_80px_-20px_rgba(0,0,0,.9)]"
      style={{
        background: `radial-gradient(circle at 34% 26%, rgba(255,255,255,.75) 0%, rgba(255,255,255,.12) 16%, transparent 32%),
          radial-gradient(circle at 70% 82%, rgba(255,255,255,.18), transparent 38%),
          radial-gradient(circle at 50% 50%, ${color} 0%, ${color} 46%, color-mix(in srgb, ${color} 55%, #000) 72%, #000 100%)`,
      }}
    />
  );
}

function WheelChip({ color }: { color: string }) {
  const spokes = Array.from({ length: 10 }, (_, i) => i * 36);
  return (
    <svg viewBox="0 0 100 100" className="w-full" aria-hidden="true">
      <circle cx="50" cy="50" r="48" fill="#0b0b0c" />
      <circle cx="50" cy="50" r="38" fill={color} />
      {spokes.map((a) => (
        <path key={a} d="M50 50 L47.5 14 L52.5 14 Z" fill="#050505" opacity="0.85" transform={`rotate(${a + 18} 50 50)`} />
      ))}
      <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(255,255,255,.35)" strokeWidth="0.8" />
      <circle cx="50" cy="50" r="8" fill={color} stroke="rgba(0,0,0,.6)" />
      <circle cx="50" cy="50" r="48" fill="none" stroke="#1d1d1f" strokeWidth="4" />
    </svg>
  );
}

function LeatherChip({ color }: { color: string }) {
  return (
    <div
      className="relative aspect-[4/3] w-full overflow-hidden rounded-sm"
      style={{
        background: `radial-gradient(120% 90% at 30% 20%, color-mix(in srgb, ${color} 85%, #fff) 0%, ${color} 45%, color-mix(in srgb, ${color} 60%, #000) 100%)`,
      }}
    >
      <div className="absolute inset-0 opacity-25 mix-blend-overlay [background-image:repeating-radial-gradient(circle_at_20%_30%,#000_0_1px,transparent_1px_3px)]" />
      <div className="absolute inset-x-[10%] top-1/2 h-px -translate-y-1/2 border-t border-dashed border-white/50" />
      <div className="absolute inset-y-[12%] left-1/2 w-px -translate-x-1/2 border-l border-dashed border-white/30" />
    </div>
  );
}

function OptionList({ title, options, value, onChange }: { title: string; options: Option[]; value: number; onChange: (i: number) => void }) {
  return (
    <fieldset>
      <legend className="wd-wide mb-3 text-sm font-semibold text-platinum">{title}</legend>
      <ul className="spec-rows border-y border-gunmetal">
        {options.map((o, i) => (
          <li key={o.name}>
            <button
              type="button"
              aria-pressed={value === i}
              onClick={() => onChange(i)}
              className={cx("flex w-full items-center gap-4 py-3 text-left transition-colors", value === i ? "text-platinum" : "text-silver hover:text-platinum")}
            >
              <span
                aria-hidden="true"
                className={cx("h-5 w-5 shrink-0 rounded-full border", value === i ? "border-bronze-hi ring-1 ring-bronze-hi ring-offset-2 ring-offset-graphite" : "border-white/20")}
                style={{ background: o.swatch }}
              />
              <span className="flex-1 text-sm">
                {o.name}
                {o.note ? <span className="block text-xs text-steel">{o.note}</span> : null}
              </span>
              {value === i ? <span className="text-xs text-bronze-hi">Selected</span> : null}
            </button>
          </li>
        ))}
      </ul>
    </fieldset>
  );
}

export function Configurator({ v }: { v: Vehicle }) {
  const [paint, setPaint] = useState(0);
  const [wheel, setWheel] = useState(0);
  const [interior, setInterior] = useState(0);
  const c = v.config;
  const summary = [c.paints[paint]?.name, c.wheels[wheel]?.name, c.interiors[interior]?.name].filter(Boolean).join("; ");
  const testDriveHref = `/test-drive?vehicle=${v.slug}&spec=${encodeURIComponent(summary)}`;
  const contactHref = `/contact?vehicle=${v.slug}&topic=purchase&message=${encodeURIComponent(`I'm interested in a ${v.name} specified as: ${summary}.`)}`;

  return (
    <div className="grid gap-12 lg:grid-cols-12">
      <div className="lg:col-span-6">
        <div className="relative grid grid-cols-5 items-end gap-6 border border-gunmetal bg-void p-6 md:gap-10 md:p-10">
          <div className="col-span-3">
            <AnimatePresence mode="wait">
              <motion.div key={paint} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.45 }}>
                <PaintChip color={c.paints[paint].swatch} />
              </motion.div>
            </AnimatePresence>
            <p className="mt-5 text-xs text-steel">Paint</p>
            <p className="wd-wide text-sm font-semibold text-platinum">{c.paints[paint].name}</p>
          </div>
          <div className="col-span-2 space-y-8">
            <div>
              <AnimatePresence mode="wait">
                <motion.div key={wheel} initial={{ opacity: 0, rotate: -40 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
                  <WheelChip color={c.wheels[wheel].swatch} />
                </motion.div>
              </AnimatePresence>
              <p className="mt-3 text-xs text-steel">Wheels</p>
              <p className="text-sm text-platinum">{c.wheels[wheel].name}</p>
            </div>
            <div>
              <AnimatePresence mode="wait">
                <motion.div key={interior} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                  <LeatherChip color={c.interiors[interior].swatch} />
                </motion.div>
              </AnimatePresence>
              <p className="mt-3 text-xs text-steel">Interior</p>
              <p className="text-sm text-platinum">{c.interiors[interior].name}</p>
            </div>
          </div>
        </div>
        <p className="mt-4 text-xs leading-relaxed text-steel">
          {c.verified ? "Verified: " : "Indicative: "}
          {c.note}
        </p>
      </div>

      <div className="space-y-10 lg:col-span-5 lg:col-start-8">
        <OptionList title="Paint" options={c.paints} value={paint} onChange={setPaint} />
        <OptionList title="Wheels" options={c.wheels} value={wheel} onChange={setWheel} />
        <OptionList title="Interior" options={c.interiors} value={interior} onChange={setInterior} />
        <div className="border border-gunmetal p-5">
          <p className="text-xs text-steel">Your specification</p>
          <p className="mt-1 text-sm text-platinum">{summary}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href={testDriveHref} className="btn btn-primary btn-sm">
              Request a test drive
            </Link>
            <Link href={contactHref} className="btn btn-ghost btn-sm">
              Ask about this specification
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
