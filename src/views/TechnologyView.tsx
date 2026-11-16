import Link from "next/link";
import CarStudio from "@/components/studio/CarStudio";
import { HybridSystems } from "@/components/technology/HybridSystems";
import { TechIndex } from "@/components/technology/TechIndex";
import { PageHero } from "@/components/ui/PageHero";
import { LineReveal } from "@/components/ui/Motion";
import type { PageMeta } from "./meta";

export const meta: PageMeta = {
  path: "/technology",
  title: "Technology",
  description:
    "Inspect the Ferrari 458 Spider in an interactive 3D studio, see how the hybrid 911 Turbo S, Revuelto and 296 GTB move their power, and find which cars use which technology.",
};

export default function TechnologyView() {
  return (
    <>
      <PageHero
        title="Technology"
        compact
        intro={
          <p>
            Turn a car over in 3D, follow the power through three very different hybrids, and see which engineering each car in the collection carries.
          </p>
        }
      >
        <nav aria-label="On this page" className="mt-10">
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {[
              { id: "studio", label: "3D studio" },
              { id: "hybrid", label: "Hybrid systems" },
              { id: "index", label: "Technology by car" },
            ].map((t) => (
              <li key={t.id}>
                <Link href={`/technology#${t.id}`} className="link-line text-sm text-silver hover:text-platinum">
                  {t.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </PageHero>

      <section id="studio" aria-label="3D studio" className="scroll-mt-0 bg-void">
        <CarStudio variant="full" />
        <div className="shell grid gap-6 py-10 text-sm text-steel md:grid-cols-3">
          <p>Drag to orbit, use the zoom buttons or a pinch, and select a point of interest to fly the camera to it.</p>
          <p>Paint and wheel colours are applied live to the model. Badges have been removed from the model, and the cabin is shown in tan leather.</p>
          <p>
            3D model of the Ferrari 458 by vicent091036, from the three.js examples.{" "}
            <Link href="/credits" className="link-line text-silver hover:text-platinum">
              Credits
            </Link>
          </p>
        </div>
      </section>

      <section id="hybrid" aria-labelledby="hybrid-title" className="scroll-mt-20 bg-graphite py-24 md:py-32">
        <div className="shell">
          <div className="mb-12 grid gap-6 lg:grid-cols-12">
            <LineReveal as="h2" id="hybrid-title" className="wd-expanded text-[clamp(2rem,5vw,4.5rem)] font-bold uppercase lg:col-span-7">
              Three ways to hybrid
            </LineReveal>
            <p className="text-silver lg:col-span-4 lg:col-start-9 lg:pt-3">
              Porsche uses electricity to remove turbo lag, Lamborghini to add all-wheel drive to a V12, and Ferrari to run on silent electric power for short distances.
            </p>
          </div>
          <HybridSystems />
        </div>
      </section>

      <section id="index" aria-labelledby="index-title" className="scroll-mt-20 bg-void py-24 md:py-32">
        <div className="shell">
          <div className="mb-12 grid gap-6 lg:grid-cols-12">
            <LineReveal as="h2" id="index-title" className="wd-expanded text-[clamp(2rem,5vw,4.5rem)] font-bold uppercase lg:col-span-7">
              Technology by car
            </LineReveal>
            <p className="text-silver lg:col-span-4 lg:col-start-9 lg:pt-3">
              Listed where the technology is part of the specification we publish for the car. Options are not included.
            </p>
          </div>
          <TechIndex />
          <div className="mt-14 flex flex-wrap gap-3">
            <Link href="/performance" className="btn btn-ghost">
              How the engineering works
            </Link>
            <Link href="/performance#compare" className="btn btn-bronze">
              Compare the cars
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
