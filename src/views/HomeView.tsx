import Link from "next/link";
import HeroFilm from "@/components/home/HeroFilm";
import CollectionRail from "@/components/home/CollectionRail";
import PerformanceBand from "@/components/home/PerformanceBand";
import CarStudio from "@/components/studio/CarStudio";
import { LineReveal, Parallax, Shutter } from "@/components/ui/Motion";
import { SmartImage } from "@/components/media/SmartImage";
import { vehicles, getVehicle } from "@/content/vehicles";
import { getImage, preferShowable } from "@/lib/media";
import type { PageMeta } from "./meta";

export const meta: PageMeta = {
  path: "/",
  title: "ONYX Motor House | Beyond the drive",
  absoluteTitle: true,
  description:
    "ONYX Motor House sources, prepares and delivers the world's most exacting performance cars, from the Porsche 911 Turbo S to the Lamborghini Revuelto. Private viewings, test drives and delivery by appointment.",
};

const hybrids = vehicles.filter((v) => v.powertrain === "Hybrid").length;

function nameFor(id: string) {
  const img = getImage(id);
  return img.vehicle ? getVehicle(img.vehicle)?.name ?? img.alt : img.alt;
}

export default function HomeView() {
  const statementA = preferShowable("p-revuelto-red-lokhande", "studio-rearlow");
  const statementB = "studio-side";
  const statementCaption =
    nameFor(statementA) === nameFor(statementB)
      ? `${nameFor(statementB)}, rendered in our studio.`
      : `${nameFor(statementA)}, and the ${nameFor(statementB)} in our studio.`;
  const after = {
    a: preferShowable("u-night-city-lichtblau", "studio-rearlow"),
    b: preferShowable("u-red-headlights-roldan", "studio-headlight"),
    c: preferShowable("u-black-yellow-lights-antony", "studio-face"),
    d: preferShowable("u-porsche-mountain-saremi", "studio-intake"),
    e: preferShowable("p-turbo-s-gauge-aerts", "studio-cockpit"),
    f: "studio-wheel",
  };
  const invitation = preferShowable("u-black-front-lights-antony", "studio-front");

  return (
    <>
      <HeroFilm />

      {/* Statement */}
      <section id="statement" aria-labelledby="statement-title" className="relative scroll-mt-20 bg-graphite py-24 md:py-40">
        <div className="shell grid gap-12 lg:grid-cols-12">
          <LineReveal as="h2" id="statement-title" className="wd-expanded text-[clamp(2.1rem,5.4vw,5.25rem)] font-bold uppercase lg:col-span-8">
            Eight machines. One standard.
          </LineReveal>
          <div className="space-y-6 text-lg leading-relaxed text-silver lg:col-span-4 lg:col-start-9 lg:pt-3">
            <p>
              From a naturally aspirated V12 to a 711 PS hybrid flat-six, every car in the ONYX collection is chosen for how it drives. We keep the collection small on purpose, so each car is one we know in detail.
            </p>
            <p className="text-base text-steel">
              {hybrids} of the eight are electrified. One is a limited series no longer built, and one is a heritage Ferrari with a 9,000 rpm V8.
            </p>
            <Link href="/about" className="link-line inline-block text-xs font-semibold uppercase tracking-[0.18em] text-bronze-hi">
              How the house works
            </Link>
          </div>
        </div>

        <div className="shell mt-20 grid gap-4 md:mt-28 md:grid-cols-12 md:gap-6">
          <Shutter className="aspect-[4/3] md:col-span-7 md:aspect-[16/11]">
            <SmartImage image={statementA} sizes="(min-width: 768px) 58vw, 100vw" fallbackLabel={nameFor(statementA)} />
          </Shutter>
          <div className="flex flex-col gap-4 md:col-span-5 md:gap-6">
            <Shutter className="aspect-[4/3] md:aspect-[16/12]">
              <SmartImage image={statementB} sizes="(min-width: 768px) 40vw, 100vw" />
            </Shutter>
            <p className="max-w-sm text-sm text-steel">{statementCaption}</p>
          </div>
        </div>
      </section>

      <CollectionRail />

      {/* 3D */}
      <section aria-labelledby="studio-title" className="relative bg-void">
        <div className="shell grid gap-8 py-20 md:py-28 lg:grid-cols-12">
          <LineReveal as="h2" id="studio-title" className="wd-expanded text-[clamp(2rem,5vw,4.5rem)] font-bold uppercase lg:col-span-7">
            Walk around it
          </LineReveal>
          <div className="text-silver lg:col-span-4 lg:col-start-9 lg:pt-3">
            <p>
              Orbit the Ferrari 458 Spider, try it in six colours and three wheel finishes, and look closer at the engineering that makes it collectable.
            </p>
            <Link href="/technology#studio" className="link-line mt-5 inline-block text-xs font-semibold uppercase tracking-[0.18em] text-bronze-hi">
              Open the full-screen studio
            </Link>
          </div>
        </div>
        <CarStudio />
      </section>

      <PerformanceBand />

      {/* Gallery preview */}
      <section aria-labelledby="gallery-title" className="bg-graphite py-24 md:py-36">
        <div className="shell">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <LineReveal as="h2" id="gallery-title" className="wd-expanded text-[clamp(2rem,5vw,4.5rem)] font-bold uppercase">
              After dark
            </LineReveal>
            <Link href="/gallery" className="btn btn-ghost self-start">
              Open the gallery
            </Link>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-3 md:mt-16 md:grid-cols-12 md:gap-5">
            <Shutter className="col-span-2 aspect-[16/10] md:col-span-8 md:row-span-2 md:aspect-auto">
              <SmartImage image={after.a} sizes="(min-width: 768px) 66vw, 100vw" />
            </Shutter>
            <Shutter className="aspect-square md:col-span-4 md:aspect-[4/3]">
              <SmartImage image={after.b} sizes="(min-width: 768px) 33vw, 50vw" />
            </Shutter>
            <Shutter className="aspect-square md:col-span-4 md:aspect-[4/3]">
              <SmartImage image={after.c} sizes="(min-width: 768px) 33vw, 50vw" />
            </Shutter>
            <Shutter className="col-span-2 aspect-[16/9] md:col-span-5 md:aspect-[16/10]">
              <SmartImage image={after.d} sizes="(min-width: 768px) 42vw, 100vw" />
            </Shutter>
            <Shutter className="aspect-[4/5] md:col-span-3 md:aspect-auto">
              <SmartImage image={after.e} sizes="(min-width: 768px) 25vw, 50vw" />
            </Shutter>
            <Shutter className="aspect-[4/5] md:col-span-4 md:aspect-auto">
              <SmartImage image={after.f} sizes="(min-width: 768px) 33vw, 50vw" />
            </Shutter>
          </div>
        </div>
      </section>

      {/* Invitation */}
      <section aria-labelledby="drive-title" className="relative isolate overflow-hidden bg-void">
        <Parallax className="absolute inset-0" amount={14}>
          <SmartImage image={invitation} sizes="100vw" bare />
        </Parallax>
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/20" />
        <div className="shell relative py-32 md:py-48">
          <LineReveal as="h2" id="drive-title" className="wd-expanded max-w-3xl text-[clamp(2.1rem,5.4vw,5rem)] font-bold uppercase">
            Your road, your hour
          </LineReveal>
          <p className="mt-6 max-w-lg text-lg text-silver">
            Drive any car in the collection from our Mayfair showroom, or have it brought to you. Weekdays, weekends, and early mornings when the roads are empty.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/test-drive" className="btn btn-primary">
              Book a test drive
            </Link>
            <Link href="/contact" className="btn btn-ghost">
              Speak to a specialist
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
