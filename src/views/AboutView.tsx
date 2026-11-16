import Link from "next/link";
import { site } from "@/content/site";
import { PageHero } from "@/components/ui/PageHero";
import { LineReveal, Shutter } from "@/components/ui/Motion";
import { SmartImage } from "@/components/media/SmartImage";
import type { PageMeta } from "./meta";

export const meta: PageMeta = {
  path: "/about",
  title: "About the house",
  description: "How ONYX Motor House sources, prepares, hands over and looks after performance cars, and the principles behind the collection.",
};

const steps = [
  { title: "Source", text: "New allocations through manufacturer networks, or a specific used or limited example, checked against its build data and history." },
  { title: "Prepare", text: "Every car is inspected, serviced where due and detailed before it is offered. We photograph it in full and send the set on request." },
  { title: "Hand over", text: "Collect from the showroom or have the car delivered, with a walk-through of its controls, modes and settings." },
  { title: "Look after", text: "Servicing, storage and, when the time comes, resale, arranged through the house." },
];

const principles = [
  { title: "Figures you can check", text: "Every specification on this site comes from the manufacturer or a published source, and each car's page links to it." },
  { title: "A small collection", text: "Eight cars at a time, so each one is a car we know in detail rather than a line in a stock list." },
  { title: "No pressure", text: "Test drives happen on your schedule, at the showroom or delivered to you, and nobody chases you afterwards." },
];

export default function AboutView() {
  const c = site.contact;
  return (
    <>
      <PageHero
        title="The house"
        image="studio-side"
        imagePosition="50% 50%"
        intro={<p>An independent motor house in Mayfair, for drivers who know exactly what they want, and for some who are still deciding.</p>}
      />

      <section aria-labelledby="work-title" className="bg-graphite py-24 md:py-32">
        <div className="shell">
          <LineReveal as="h2" id="work-title" className="wd-expanded max-w-4xl text-[clamp(2rem,5vw,4.5rem)] font-bold uppercase">
            From allocation to aftercare
          </LineReveal>
          <ol className="mt-16 grid gap-px bg-gunmetal md:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.title} className="bg-graphite py-8 md:px-8 lg:first:pl-0">
                <p className="tabular text-sm text-bronze-hi">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="wd-expanded mt-4 text-xl font-bold uppercase">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-silver">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="principles-title" className="bg-void py-24 md:py-32">
        <div className="shell grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <LineReveal as="h2" id="principles-title" className="wd-expanded text-[clamp(2rem,5vw,4rem)] font-bold uppercase">
              How we work
            </LineReveal>
            <Shutter className="mt-12 aspect-[4/3]">
              <SmartImage image="studio-cockpit" sizes="(min-width: 1024px) 40vw, 100vw" />
            </Shutter>
          </div>
          <ul className="spec-rows self-end border-y border-gunmetal lg:col-span-6 lg:col-start-7">
            {principles.map((p) => (
              <li key={p.title} className="py-8">
                <h3 className="wd-wide text-lg font-semibold text-platinum">{p.title}</h3>
                <p className="mt-2 leading-relaxed text-silver">{p.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="visit-title" className="border-t border-gunmetal bg-graphite py-24 md:py-32">
        <div className="shell grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <LineReveal as="h2" id="visit-title" className="wd-expanded text-[clamp(2rem,5vw,4rem)] font-bold uppercase">
              Visit
            </LineReveal>
            <address className="mt-8 text-lg not-italic leading-relaxed text-silver">
              {c.showroom}
              <br />
              {c.street}
              <br />
              {c.city} {c.postcode}
            </address>
            <dl className="mt-6 max-w-sm space-y-1 text-sm text-steel">
              {c.hours.map((h) => (
                <div key={h.days} className="flex justify-between gap-4">
                  <dt>{h.days}</dt>
                  <dd className="tabular text-silver">{h.time}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="flex flex-col justify-end gap-3 lg:col-span-4 lg:col-start-9">
            <Link href="/test-drive" className="btn btn-primary">
              Book a test drive
            </Link>
            <Link href="/contact" className="btn btn-ghost">
              Contact and directions
            </Link>
          </div>
        </div>
        {site.concept ? (
          <div className="shell mt-16">
            <p className="max-w-3xl border-l border-bronze pl-4 text-sm leading-relaxed text-steel">
              ONYX Motor House is a concept brand created for this website. The cars, their specifications and prices are real and sourced; the business, its address and its contact details are placeholders.
            </p>
          </div>
        ) : null}
      </section>
    </>
  );
}
