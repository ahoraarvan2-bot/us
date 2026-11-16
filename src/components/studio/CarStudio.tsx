"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { hotspots, studioPaints, studioViews, studioWheels } from "@/content/studio";
import { SmartImage } from "@/components/media/SmartImage";
import { useMediaQuery } from "@/lib/motion";
import { cx } from "@/lib/format";
import type { StudioCommand, StudioCommandInput } from "./StudioCanvas";
import { StudioErrorBoundary } from "./StudioErrorBoundary";

const StudioCanvas = dynamic(() => import("./StudioCanvas"), { ssr: false });

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export default function CarStudio({ variant = "section" }: { variant?: "section" | "full" }) {
  const stage = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [crashed, setCrashed] = useState(false);
  const [paint, setPaint] = useState(studioPaints[0]);
  const [wheel, setWheel] = useState(studioWheels[0]);
  const [active, setActive] = useState<string | null>(null);
  const [command, setCommand] = useState<StudioCommand | null>(null);
  const [touchActive, setTouchActive] = useState(false);
  const touch = useMediaQuery("(hover: none) and (pointer: coarse)");
  const interactive = !touch || touchActive;
  const n = useRef(0);

  useEffect(() => {
    setWebgl(hasWebGL());
    const el = stage.current;
    if (!el) return;
    const nearObs = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: "800px 0px" });
    const visObs = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.05 });
    nearObs.observe(el);
    visObs.observe(el);
    return () => {
      nearObs.disconnect();
      visObs.disconnect();
    };
  }, []);

  const send = (c: StudioCommandInput) => setCommand({ ...c, n: ++n.current } as StudioCommand);
  const current = hotspots.find((h) => h.id === active);

  return (
    <div
      ref={stage}
      className={cx(
        "grain relative w-full overflow-hidden bg-void",
        variant === "full" ? "h-[100svh] min-h-[620px]" : "h-[82svh] min-h-[560px] max-h-[960px]"
      )}
      data-lenis-prevent={touchActive ? "" : undefined}
    >
      {/* poster until the model is ready, and the fallback without WebGL */}
      <div className={cx("absolute inset-0 transition-opacity duration-1000", ready ? "pointer-events-none opacity-0" : "opacity-100")}>
        <SmartImage image="studio-front" sizes="100vw" grade={false} alt="" />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {near && webgl && !crashed ? (
        <div className={cx("absolute inset-0 transition-opacity duration-1000", ready ? "opacity-100" : "opacity-0")}>
          <StudioErrorBoundary onError={() => setCrashed(true)}>
          <StudioCanvas
            paint={paint}
            wheel={wheel.color}
            active={active}
            onSelect={setActive}
            command={command}
            interactive={interactive}
            running={visible}
            onReady={() => setReady(true)}
          />
          </StudioErrorBoundary>
        </div>
      ) : null}

      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_45%,transparent_55%,rgba(0,0,0,.75))]" />

      {/* status */}
      {!ready ? (
        <div className="absolute inset-0 grid place-items-center">
          {webgl === false || crashed ? (
            <p className="max-w-sm bg-black/70 p-5 text-center text-sm text-silver">
              {crashed
                ? "The 3D view could not start on this device, so you're seeing a studio render instead."
                : "Your browser can't display 3D here, so you're seeing a studio render. The 3D study needs WebGL."}
            </p>
          ) : (
            <p className="flex items-center gap-3 bg-black/60 px-4 py-3 text-xs text-silver" role="status">
              <span className="h-3 w-3 animate-spin rounded-full border border-silver border-t-transparent" />
              Loading the 3D model
            </p>
          )}
        </div>
      ) : null}

      {/* top: title and hint */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-black/70 to-transparent">
        <div className={cx("shell flex items-start justify-between gap-6 pb-14", variant === "full" ? "pt-28" : "pt-6")}>
          <div>
            <p className="text-sm text-silver">Interactive 3D study</p>
            <p className="wd-expanded mt-1 text-xl font-bold uppercase text-platinum md:text-2xl">Ferrari 458 Spider</p>
          </div>
          <p className="hidden text-right text-xs text-steel md:block">
            Drag to orbit. Select a point to look closer.
            <br />
            <Link href="/collection/ferrari-458-spider" className="pointer-events-auto link-line text-silver hover:text-platinum">
              Specification
            </Link>
          </p>
        </div>
      </div>

      {/* hotspot list (keyboard and screen-reader route to the same content) */}
      <div className="absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 pr-[max(1rem,env(safe-area-inset-right))] lg:block lg:pr-10">
        <ul className="w-64 space-y-px" aria-label="Points of interest">
          {hotspots.map((h) => (
            <li key={h.id}>
              <button
                type="button"
                aria-pressed={active === h.id}
                onClick={() => setActive(active === h.id ? null : h.id)}
                className={cx(
                  "flex w-full items-center justify-between gap-3 border-l px-4 py-2.5 text-left text-sm transition-colors",
                  active === h.id ? "border-bronze bg-white/[0.06] text-platinum" : "border-white/15 text-silver hover:border-white/50 hover:text-platinum"
                )}
              >
                {h.title}
                <span className={cx("h-1.5 w-1.5 rounded-full", active === h.id ? "bg-bronze-hi" : "bg-white/30")} />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* detail card for the selected point */}
      <AnimatePresence>
        {current ? (
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-0 top-28 z-20 w-full px-[max(1.25rem,env(safe-area-inset-left))] md:left-10 md:top-auto md:bottom-36 md:w-[24rem] md:px-0"
            role="region"
            aria-live="polite"
            aria-label={current.title}
          >
            <div className="border border-white/10 bg-black/80 p-5 backdrop-blur-md md:p-6">
              <p className="text-xs text-bronze-hi">{current.spec}</p>
              <p className="wd-wide mt-1 text-lg font-semibold text-platinum">{current.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-silver">{current.text}</p>
              <button
                type="button"
                onClick={() => {
                  setActive(null);
                  send({ type: "view", name: "front" });
                }}
                className="link-line mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-platinum"
              >
                Back to full view
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* touch: opt in before the canvas captures gestures */}
      {touch && !touchActive && ready ? (
        <div className="absolute inset-x-0 top-1/2 z-10 flex -translate-y-1/2 justify-center">
          <button type="button" onClick={() => setTouchActive(true)} className="btn btn-ghost">
            Explore in 3D
          </button>
        </div>
      ) : null}

      {/* bottom controls */}
      <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/85 via-black/40 to-transparent pt-16">
        <div className="shell flex flex-col gap-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] md:flex-row md:items-end md:justify-between md:pb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:gap-10">
            <fieldset>
              <legend className="mb-2 text-[0.6875rem] text-steel">
                Paint <span className="text-silver">{paint.name}</span>
              </legend>
              <div className="flex gap-2">
                {studioPaints.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    aria-pressed={paint.name === p.name}
                    aria-label={p.name}
                    title={p.name}
                    onClick={() => setPaint(p)}
                    className={cx(
                      "h-8 w-8 rounded-full border transition-transform hover:scale-110",
                      paint.name === p.name ? "border-bronze-hi ring-1 ring-bronze-hi ring-offset-2 ring-offset-black" : "border-white/25"
                    )}
                    style={{ background: `radial-gradient(circle at 32% 28%, rgba(255,255,255,.55), ${p.color} 45%, #000 120%)` }}
                  />
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="mb-2 text-[0.6875rem] text-steel">
                Wheels <span className="text-silver">{wheel.name}</span>
              </legend>
              <div className="flex gap-2">
                {studioWheels.map((w) => (
                  <button
                    key={w.name}
                    type="button"
                    aria-pressed={wheel.name === w.name}
                    aria-label={`${w.name} wheels`}
                    title={`${w.name} wheels`}
                    onClick={() => setWheel(w)}
                    className={cx(
                      "h-8 w-8 rounded-full border transition-transform hover:scale-110",
                      wheel.name === w.name ? "border-bronze-hi ring-1 ring-bronze-hi ring-offset-2 ring-offset-black" : "border-white/25"
                    )}
                    style={{ background: `conic-gradient(from 20deg, ${w.color}, #fff6 15%, ${w.color} 30%, #0006 50%, ${w.color} 70%, #fff4 85%, ${w.color})` }}
                  />
                ))}
              </div>
            </fieldset>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {Object.entries(studioViews).map(([key, v]) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setActive(null);
                  send({ type: "view", name: key });
                }}
                className="btn btn-ghost btn-sm"
              >
                {v.label}
              </button>
            ))}
            <span className="mx-1 hidden h-6 w-px bg-white/15 sm:block" aria-hidden="true" />
            <button type="button" aria-label="Zoom in" onClick={() => send({ type: "zoom", dir: 1 })} className="btn btn-ghost btn-sm !px-3">
              +
            </button>
            <button type="button" aria-label="Zoom out" onClick={() => send({ type: "zoom", dir: -1 })} className="btn btn-ghost btn-sm !px-3">
              −
            </button>
            {touch && touchActive ? (
              <button type="button" onClick={() => setTouchActive(false)} className="btn btn-bronze btn-sm">
                Done
              </button>
            ) : null}
          </div>
        </div>
        {/* compact hotspot chooser on small screens */}
        <div className="shell pb-4 lg:hidden">
          <label className="sr-only" htmlFor={`hotspot-select-${variant}`}>
            Look closer at
          </label>
          <select
            id={`hotspot-select-${variant}`}
            value={active ?? ""}
            onChange={(e) => setActive(e.target.value || null)}
            className="field-input !min-h-10 !py-2 text-sm"
          >
            <option value="">Look closer at…</option>
            {hotspots.map((h) => (
              <option key={h.id} value={h.id}>
                {h.title}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
