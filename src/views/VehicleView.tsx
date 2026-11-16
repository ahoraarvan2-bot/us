import Link from "next/link";
import { vehicles, type Vehicle } from "@/content/vehicles";
import { heroScenes } from "@/content/films";
import { bestUrl, getImage } from "@/lib/media";
import { fmtInt, fmtUsd, topSpeedPrefix } from "@/lib/format";
import { SectionNav } from "@/components/vehicle/SectionNav";
import { VehicleGallery } from "@/components/vehicle/VehicleGallery";
import { SpecTable } from "@/components/vehicle/SpecTable";
import { VehiclePerformance } from "@/components/vehicle/VehiclePerformance";
import { Configurator } from "@/components/vehicle/Configurator";
import { VehicleHeroMedia } from "@/components/vehicle/VehicleHeroMedia";
import { statusLabel } from "@/components/vehicle/VehicleCard";
import { LineReveal } from "@/components/ui/Motion";
import { SmartImage } from "@/components/media/SmartImage";
import type { PageMeta } from "./meta";

export function vehicleMeta(v: Vehicle): PageMeta {
  const img = getImage(v.media.hero);
  return {
    path: `/collection/${v.slug}`,
    title: v.name,
    description: `${v.name} (${v.year}): ${v.intro}`,
    image: bestUrl(img, 1600),
  };
}

const films: Record<string, (typeof heroScenes)[number] | undefined> = {
  "ferrari-458-spider": heroScenes.find((s) => s.id === "studio"),
};

/** JSON-LD for search engines: the car as a product with its published price. */
function vehicleJsonLd(v: Vehicle) {
  const s = v.specs;
  return {
    "@context": "https://schema.org",
    "@type": "Car",
    name: v.name,
    brand: { "@type": "Brand", name: v.make },
    model: v.model,
    vehicleModelDate: v.year,
    description: v.intro,
    vehicleEngine: { "@type": "EngineSpecification", name: v.engine, enginePower: { "@type": "QuantitativeValue", value: s.powerKw, unitCode: "KWT" }, torque: { "@type": "QuantitativeValue", value: s.torqueNm, unitCode: "NU" } },
    accelerationTime: { "@type": "QuantitativeValue", value: s.zeroTo100, unitCode: "SEC", description: "0-100 km/h" },
    speed: { "@type": "QuantitativeValue", maxValue: s.topSpeedKmh, unitCode: "KMH" },
    vehicleTransmission: s.transmission,
    driveWheelConfiguration: s.drive,
    ...(v.price.kind === "msrp"
      ? { offers: { "@type": "Offer", price: v.price.amount, priceCurrency: v.price.currency, description: v.price.label } }
      : {}),
  };
}

export default function VehicleView({ v }: { v: Vehicle }) {
  const idx = vehicles.findIndex((x) => x.slug === v.slug);
  const next = vehicles[(idx + 1) % vehicles.length];
  const s = v.specs;
  const exterior = [v.media.hero, ...v.media.exterior.filter((id) => id !== v.media.hero), ...v.media.detail];
  const sections = [
    { id: "overview", label: "Overview" },
    { id: "design", label: "Design" },
    { id: "interior", label: "Interior" },
    { id: "performance-figures", label: "Performance" },
    { id: "specification", label: "Specification" },
    { id: "configure", label: "Configure" },
    { id: "pricing", label: "Pricing" },
  ];
  const has3d = v.slug === "ferrari-458-spider";

  return (
    <>
      {/* Hero */}
      <section className="grain relative isolate h-[100svh] min-h-[640px] overflow-hidden bg-void">
        <VehicleHeroMedia image={v.media.hero} film={films[v.slug]} label={v.name} />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
        <div className="shell relative z-10 flex h-full flex-col justify-end pb-14 pt-32 md:pb-20">
          <p className="text-sm text-silver">
            {v.make}
            <span className="mx-2 text-steel" aria-hidden="true">/</span>
            {statusLabel[v.status]}, {v.year}
          </p>
          <LineReveal as="h1" immediate className="wd-expanded mt-3 max-w-6xl text-[clamp(2.6rem,8.4vw,8.75rem)] font-extrabold uppercase leading-[0.88]">
            {v.model}
          </LineReveal>
          <p className="mt-6 max-w-xl text-lg text-silver">{v.tagline}</p>
          <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <dl className="tabular grid grid-cols-3 gap-6 sm:gap-12">
              <div>
                <dt className="text-xs text-steel">Power</dt>
                <dd className="wd-condensed mt-1 text-3xl font-light md:text-4xl">
                  {fmtInt(s.powerPs)} <span className="text-sm text-silver">PS</span>
                </dd>
              </div>
              <div>
                <dt className="text-xs text-steel">0–100 km/h</dt>
                <dd className="wd-condensed mt-1 text-3xl font-light md:text-4xl">
                  {s.zeroTo100.toFixed(1)} <span className="text-sm text-silver">s</span>
                </dd>
              </div>
              <div>
                <dt className="text-xs text-steel">Top speed</dt>
                <dd className="wd-condensed mt-1 text-3xl font-light md:text-4xl">
                  {topSpeedPrefix(v)}
                  {fmtInt(s.topSpeedKmh)} <span className="text-sm text-silver">km/h</span>
                </dd>
              </div>
            </dl>
            <div className="flex flex-wrap gap-3">
              <Link href={`/test-drive?vehicle=${v.slug}`} className="btn btn-primary">
                Request a test drive
              </Link>
              <Link href={`/contact?vehicle=${v.slug}&topic=purchase`} className="btn btn-ghost">
                Make an enquiry
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SectionNav sections={sections} slug={v.slug} />

      {/* Overview */}
      <section id="overview" className="scroll-mt-16 bg-graphite py-24 md:py-36">
        <div className="shell grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <LineReveal as="h2" className="wd-wide text-[clamp(1.6rem,2.8vw,2.5rem)] font-semibold leading-[1.15] text-platinum">
              {v.intro}
            </LineReveal>
            <p className="mt-6 text-sm text-steel">{v.variant}</p>
            {has3d ? (
              <Link href="/technology#studio" className="btn btn-bronze btn-sm mt-8">
                Inspect it in 3D
              </Link>
            ) : null}
          </div>
          <div className="space-y-5 text-lg leading-relaxed text-silver lg:col-span-6 lg:col-start-7">
            {v.description.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
        </div>
        <div className="shell mt-20">
          <ul className="grid gap-px border-y border-gunmetal bg-gunmetal md:grid-cols-3">
            {v.highlights.map((h) => (
              <li key={h.title} className="bg-graphite py-8 md:px-8 md:first:pl-0">
                <h3 className="wd-wide text-base font-semibold text-platinum">{h.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-silver">{h.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Design */}
      <section id="design" className="scroll-mt-16 bg-void py-24 md:py-32">
        <div className="shell">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <LineReveal as="h2" className="wd-expanded text-[clamp(1.9rem,4vw,3.5rem)] font-bold uppercase">
              Exterior design
            </LineReveal>
            <p className="max-w-md text-sm text-steel">Select an image to view it full screen. Credits are shown in the viewer.</p>
          </div>
          <VehicleGallery ids={exterior} label={v.name} />
        </div>
      </section>

      {/* Interior */}
      <section id="interior" className="scroll-mt-16 bg-graphite py-24 md:py-32">
        <div className="shell grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <LineReveal as="h2" className="wd-expanded text-[clamp(1.9rem,4vw,3.5rem)] font-bold uppercase">
              Interior
            </LineReveal>
            <p className="mt-6 text-silver">
              Trim choices for the {v.model} are below. We photograph every car we offer in full, inside and out, and send the set on request.
            </p>
            <ul className="mt-8 space-y-3">
              {v.config.interiors.map((o) => (
                <li key={o.name} className="flex items-center gap-3 text-sm text-silver">
                  <span className="h-4 w-4 shrink-0 rounded-full border border-white/20" style={{ background: o.swatch }} aria-hidden="true" />
                  {o.name}
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            {v.media.interior.length ? (
              <VehicleGallery ids={v.media.interior} label={`${v.name} interior`} />
            ) : (
              <div className="relative aspect-[16/10] overflow-hidden">
                <SmartImage image={null} fallbackLabel={`${v.model} cabin`} fallbackNote="Interior photography sent on request" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Performance */}
      <section id="performance-figures" className="scroll-mt-16 bg-graphite pb-24 md:pb-36">
        <div className="shell border-t border-gunmetal pt-24 md:pt-32">
          <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <LineReveal as="h2" className="wd-expanded text-[clamp(1.9rem,4vw,3.5rem)] font-bold uppercase">
              Performance
            </LineReveal>
            <Link href={`/performance?compare=${v.slug}#compare`} className="link-line text-xs font-semibold uppercase tracking-[0.18em] text-bronze-hi">
              Compare with other cars
            </Link>
          </div>
          <VehiclePerformance v={v} />
        </div>
      </section>

      {/* Specification */}
      <section id="specification" className="scroll-mt-16 bg-void py-24 md:py-32">
        <div className="shell">
          <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <LineReveal as="h2" className="wd-expanded text-[clamp(1.9rem,4vw,3.5rem)] font-bold uppercase">
              Technical specification
            </LineReveal>
            <p className="max-w-md text-sm text-steel">Manufacturer figures. Sources are listed at the foot of this page.</p>
          </div>
          <SpecTable v={v} />
        </div>
      </section>

      {/* Configure */}
      <section id="configure" className="scroll-mt-16 bg-graphite py-24 md:py-32">
        <div className="shell">
          <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <LineReveal as="h2" className="wd-expanded text-[clamp(1.9rem,4vw,3.5rem)] font-bold uppercase">
              Specify yours
            </LineReveal>
            {has3d ? (
              <Link href="/technology#studio" className="link-line text-xs font-semibold uppercase tracking-[0.18em] text-bronze-hi">
                Try colours on the 3D model
              </Link>
            ) : null}
          </div>
          <Configurator v={v} />
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="scroll-mt-16 bg-void py-24 md:py-32">
        <div className="shell grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <LineReveal as="h2" className="wd-expanded text-[clamp(1.9rem,4vw,3.5rem)] font-bold uppercase">
              Pricing
            </LineReveal>
            <p className="mt-8 text-sm text-steel">{v.price.label}</p>
            <p className="wd-condensed tabular mt-2 text-[clamp(3rem,8vw,6rem)] font-light leading-none text-platinum">
              {v.price.kind === "msrp" ? (
                <>
                  <span className="mr-3 align-middle text-lg text-silver">from</span>
                  {fmtUsd(v.price.amount)}
                </>
              ) : (
                "On application"
              )}
            </p>
            {v.price.note ? <p className="mt-6 max-w-lg text-sm leading-relaxed text-silver">{v.price.note}</p> : null}
            <p className="mt-4 max-w-lg text-xs leading-relaxed text-steel">
              Manufacturer prices change and differ by market. We confirm the price of a specific car, including delivery and taxes, in writing before you commit.
            </p>
          </div>
          <div className="flex flex-col justify-end gap-3 lg:col-span-4 lg:col-start-9">
            <Link href={`/test-drive?vehicle=${v.slug}`} className="btn btn-primary w-full">
              Request a test drive
            </Link>
            <Link href={`/contact?vehicle=${v.slug}&topic=purchase`} className="btn btn-ghost w-full">
              Make an enquiry
            </Link>
          </div>
        </div>

        <div className="shell mt-20 border-t border-gunmetal pt-8">
          <p className="text-xs text-steel">Specification sources, checked November 2026:</p>
          <ul className="mt-3 space-y-1.5">
            {v.sources.map((src) => (
              <li key={src.url}>
                <a href={src.url} target="_blank" rel="noopener noreferrer" className="link-line text-xs text-silver hover:text-platinum">
                  {src.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Next */}
      <Link href={`/collection/${next.slug}`} className="group relative block h-[56svh] min-h-[380px] overflow-hidden bg-void" aria-label={`Next in the collection: ${next.name}`}>
        <SmartImage
          image={next.media.hero}
          sizes="100vw"
          fallbackLabel={next.name}
          bare
          imgClassName="opacity-60 transition-[transform,opacity] duration-[1.6s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.03] group-hover:opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="shell relative flex h-full flex-col justify-end pb-14">
          <p className="text-sm text-silver">Next in the collection</p>
          <p className="wd-expanded mt-2 text-[clamp(2rem,6vw,5.5rem)] font-extrabold uppercase leading-none text-platinum">{next.model}</p>
          <p className="mt-2 text-sm text-steel">{next.make}</p>
        </div>
      </Link>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(vehicleJsonLd(v)) }} />
    </>
  );
}
