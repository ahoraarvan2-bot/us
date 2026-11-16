"use client";

import { useEffect, useRef, useState } from "react";
import { vehicles, type Vehicle } from "@/content/vehicles";
import { prefersReducedMotion } from "@/lib/motion";
import { cx } from "@/lib/format";

/**
 * Runs cars from 0 to 100 km/h in real time. Each car crosses the line at its
 * manufacturer 0–100 km/h figure; the shape of the curve in between is illustrative
 * (acceleration falls away as speed rises).
 */
export function LaunchRace({ slugs, label = "0–100 km/h, in real time" }: { slugs?: string[]; label?: string }) {
  const cars: Vehicle[] = (slugs ? slugs.map((s) => vehicles.find((v) => v.slug === s)) : vehicles).filter(Boolean) as Vehicle[];
  const [state, setState] = useState<"idle" | "running" | "done">("idle");
  const markers = useRef<(HTMLSpanElement | null)[]>([]);
  const fills = useRef<(HTMLSpanElement | null)[]>([]);
  const clock = useRef<HTMLSpanElement>(null);
  const raf = useRef(0);
  const [finished, setFinished] = useState<Record<string, boolean>>({});
  const best = Math.min(...cars.map((c) => c.specs.zeroTo100));
  const slowest = Math.max(...cars.map((c) => c.specs.zeroTo100));
  const key = cars.map((c) => c.slug).join(",");

  // reset when the line-up changes
  useEffect(() => {
    cancelAnimationFrame(raf.current);
    setState("idle");
    setFinished({});
    markers.current.forEach((m) => m && (m.style.left = "0%"));
    fills.current.forEach((f) => f && (f.style.transform = "scaleX(0)"));
    if (clock.current) clock.current.textContent = "0.00";
  }, [key]);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const place = (i: number, p: number) => {
    const m = markers.current[i];
    const f = fills.current[i];
    if (m) m.style.left = `${p * 100}%`;
    if (f) f.style.transform = `scaleX(${p})`;
  };

  const launch = () => {
    cancelAnimationFrame(raf.current);
    setFinished({});
    if (prefersReducedMotion()) {
      cars.forEach((_, i) => place(i, 1));
      setFinished(Object.fromEntries(cars.map((c) => [c.slug, true])));
      if (clock.current) clock.current.textContent = slowest.toFixed(2);
      setState("done");
      return;
    }
    setState("running");
    const start = performance.now();
    const done = new Set<string>();
    const tick = (now: number) => {
      const t = (now - start) / 1000;
      if (clock.current) clock.current.textContent = Math.min(t, slowest).toFixed(2);
      cars.forEach((c, i) => {
        const u = Math.min(1, t / c.specs.zeroTo100);
        // speed rises quickly at first, then more slowly
        place(i, 1 - Math.pow(1 - u, 1.6));
        if (u >= 1 && !done.has(c.slug)) {
          done.add(c.slug);
          setFinished((f) => ({ ...f, [c.slug]: true }));
        }
      });
      if (t < slowest) raf.current = requestAnimationFrame(tick);
      else setState("done");
    };
    raf.current = requestAnimationFrame(tick);
  };

  return (
    <figure className="border border-gunmetal bg-void p-5 md:p-8">
      <figcaption className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="wd-wide text-sm font-semibold text-platinum">{label}</p>
          <p className="mt-1 text-xs text-steel">Finish times are manufacturer figures. The curve between start and finish is illustrative.</p>
        </div>
        <div className="flex items-center gap-4">
          <p className="tabular wd-condensed text-3xl font-light text-platinum" aria-hidden="true">
            <span ref={clock}>0.00</span>
            <span className="ml-1 text-sm text-silver">s</span>
          </p>
          <button type="button" onClick={launch} disabled={state === "running"} className="btn btn-bronze btn-sm">
            {state === "idle" ? "Launch" : state === "running" ? "Running" : "Run again"}
          </button>
        </div>
      </figcaption>

      <ul className="mt-6 space-y-3">
        {cars.map((c, i) => {
          const isBest = c.specs.zeroTo100 === best;
          const over = finished[c.slug];
          return (
            <li key={c.slug} className="grid grid-cols-[minmax(0,8.5rem)_1fr_3.5rem] items-center gap-3 sm:grid-cols-[11rem_1fr_4rem]">
              <span className={cx("truncate text-xs", over && isBest ? "text-bronze-hi" : "text-silver")}>{c.name}</span>
              <span className="relative block h-6">
                <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gunmetal" />
                <span
                  ref={(el) => {
                    fills.current[i] = el;
                  }}
                  className={cx("absolute inset-x-0 top-1/2 h-[2px] origin-left -translate-y-1/2", isBest ? "bg-bronze" : "bg-silver/50")}
                  style={{ transform: "scaleX(0)" }}
                />
                <span
                  ref={(el) => {
                    markers.current[i] = el;
                  }}
                  className={cx("absolute top-1/2 h-4 w-[3px] -translate-x-1/2 -translate-y-1/2", isBest ? "bg-bronze-hi" : "bg-platinum")}
                  style={{ left: "0%" }}
                />
                <span className="absolute right-0 top-0 h-full w-px bg-white/25" aria-hidden="true" />
              </span>
              <span className={cx("tabular text-right text-xs transition-opacity", over ? "opacity-100" : "opacity-0", isBest ? "text-bronze-hi" : "text-platinum")}>
                {c.specs.zeroTo100.toFixed(1)} s
              </span>
            </li>
          );
        })}
      </ul>
      <div className="mt-2 grid grid-cols-[minmax(0,8.5rem)_1fr_3.5rem] gap-3 text-[0.625rem] text-steel sm:grid-cols-[11rem_1fr_4rem]" aria-hidden="true">
        <span />
        <span className="flex justify-between">
          <span>0 km/h</span>
          <span>100 km/h</span>
        </span>
        <span />
      </div>
      <p className="sr-only" aria-live="polite">
        {state === "done" ? `Finished. Quickest: ${cars.filter((c) => c.specs.zeroTo100 === best).map((c) => c.name).join(" and ")} at ${best.toFixed(1)} seconds.` : ""}
      </p>
    </figure>
  );
}
