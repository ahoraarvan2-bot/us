import Link from "next/link";
import type { ReactNode } from "react";
import { topics } from "@/content/engineering";
import { getVehicle } from "@/content/vehicles";
import { PageHero } from "@/components/ui/PageHero";
import { LineReveal } from "@/components/ui/Motion";
import { PowerChart } from "@/components/performance/PowerChart";
import { TorqueBands } from "@/components/performance/TorqueBands";
import { LaunchRace } from "@/components/performance/LaunchRace";
import { ModeSelector } from "@/components/performance/ModeSelector";
import { CompareTool } from "@/components/performance/CompareTool";
import { AirflowDiagram, BrakeDiagram, EngineLayouts, RearSteerDiagram } from "@/components/performance/Diagrams";
import { cx } from "@/lib/format";
import type { PageMeta } from "./meta";

export const meta: PageMeta = {
  path: "/performance",
  title: "Performance and engineering",
  description:
    "Engines, power, torque, acceleration, aerodynamics, suspension, braking and drive modes, explained with the cars in the ONYX collection, plus a side-by-side comparison tool.",
};

const visuals: Record<string, { node: ReactNode; wide?: boolean }> = {
  engines: { node: <EngineLayouts />, wide: true },
  power: { node: <PowerChart /> },
  torque: { node: <TorqueBands /> },
  acceleration: { node: <LaunchRace label="All eight, from a standing start" /> },
  aerodynamics: { node: <AirflowDiagram /> },
  suspension: { node: <RearSteerDiagram /> },
  braking: { node: <BrakeDiagram /> },
  modes: { node: <ModeSelector />, wide: true },
};

export default function PerformanceView() {
  return (
    <>
      <PageHero
        title="Performance"
        image="studio-exhaust"
        imagePosition="50% 55%"
        intro={
          <p>
            Power, torque, traction and stopping, explained with the cars in the collection. Every figure on this page is the manufacturer&apos;s own.
          </p>
        }
      >
        <nav aria-label="On this page" className="mt-10">
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {[...topics.map((t) => ({ id: t.id, label: t.title })), { id: "compare", label: "Compare the cars" }].map((t) => (
              <li key={t.id}>
                <Link href={`/performance#${t.id}`} className="link-line text-sm text-silver hover:text-platinum">
                  {t.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </PageHero>

      {topics.map((t, i) => {
        const vis = visuals[t.id];
        return (
          <section key={t.id} id={t.id} aria-labelledby={`${t.id}-title`} className={cx("scroll-mt-20 py-20 md:py-28", i % 2 ? "bg-void" : "bg-graphite")}>
            <div className={cx("shell grid gap-12", vis?.wide ? "" : "lg:grid-cols-12 lg:items-start")}>
              <div className={vis?.wide ? "grid gap-10 lg:grid-cols-12" : "lg:col-span-5"}>
                <div className={vis?.wide ? "lg:col-span-5" : ""}>
                  <LineReveal as="h2" id={`${t.id}-title`} className="wd-expanded text-[clamp(1.75rem,3vw,2.75rem)] font-bold uppercase">
                    {t.title}
                  </LineReveal>
                  <p className="wd-wide mt-6 text-lg leading-snug text-platinum">{t.lead}</p>
                </div>
                <div className={vis?.wide ? "space-y-4 text-silver lg:col-span-6 lg:col-start-7" : "mt-6 space-y-4 text-silver"}>
                  {t.body.map((p) => (
                    <p key={p.slice(0, 20)} className="leading-relaxed">
                      {p}
                    </p>
                  ))}
                  {t.facts.length ? (
                    <ul className="spec-rows mt-8 border-y border-gunmetal">
                      {t.facts.map((f) => {
                        const v = getVehicle(f.slug)!;
                        return (
                          <li key={f.slug + f.text.slice(0, 10)} className="py-3">
                            <Link href={`/collection/${v.slug}`} className="wd-wide text-sm font-semibold text-platinum hover:text-bronze-hi">
                              {v.name}
                            </Link>
                            <p className="mt-1 text-sm text-silver">{f.text}</p>
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}
                  {t.sources?.length ? (
                    <p className="text-xs text-steel">
                      Sources:{" "}
                      {t.sources.map((s, k) => (
                        <span key={s.url}>
                          {k ? "; " : ""}
                          <a href={s.url} target="_blank" rel="noopener noreferrer" className="link-line text-silver hover:text-platinum">
                            {s.label}
                          </a>
                        </span>
                      ))}
                    </p>
                  ) : null}
                </div>
              </div>
              {vis ? <div className={vis.wide ? "" : "lg:col-span-6 lg:col-start-7"}>{vis.node}</div> : null}
            </div>
          </section>
        );
      })}

      <section id="compare" aria-labelledby="compare-title" className="scroll-mt-20 bg-graphite py-24 md:py-32">
        <div className="shell">
          <div className="mb-10 grid gap-6 lg:grid-cols-12">
            <LineReveal as="h2" id="compare-title" className="wd-expanded text-[clamp(2rem,5vw,4.5rem)] font-bold uppercase lg:col-span-7">
              Compare the cars
            </LineReveal>
            <p className="text-silver lg:col-span-4 lg:col-start-9 lg:pt-3">
              Put up to three cars side by side. The leader in each measured figure is marked in bronze.
            </p>
          </div>
          <CompareTool />
        </div>
      </section>

      <section className="border-t border-gunmetal bg-void py-20 md:py-28">
        <div className="shell flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="wd-expanded text-[clamp(1.8rem,4vw,3.25rem)] font-bold uppercase leading-none">Numbers are a start</p>
            <p className="mt-4 max-w-xl text-silver">The way a car delivers them is something you have to drive. Choose a car and a morning.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/test-drive" className="btn btn-primary">
              Book a test drive
            </Link>
            <Link href="/collection" className="btn btn-ghost">
              View the collection
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
