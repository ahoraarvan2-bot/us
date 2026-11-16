import Link from "next/link";
import { vehicles } from "@/content/vehicles";
import { topics } from "@/content/engineering";
import { creditFor, images, providerLabel, type Provider } from "@/lib/media";
import { PageHero } from "@/components/ui/PageHero";
import type { PageMeta } from "./meta";

export const meta: PageMeta = {
  path: "/credits",
  title: "Credits and sources",
  description: "Photographers, licences, the 3D model, typefaces, software and the specification sources behind this site.",
};

const software = [
  { name: "Next.js", license: "MIT", url: "https://nextjs.org" },
  { name: "React", license: "MIT", url: "https://react.dev" },
  { name: "three.js", license: "MIT", url: "https://threejs.org" },
  { name: "React Three Fiber and drei", license: "MIT", url: "https://docs.pmnd.rs" },
  { name: "GSAP", license: "GSAP Standard License", url: "https://gsap.com/standard-license" },
  { name: "Motion", license: "MIT", url: "https://motion.dev" },
  { name: "Lenis", license: "MIT", url: "https://lenis.darkroom.engineering" },
  { name: "Tailwind CSS", license: "MIT", url: "https://tailwindcss.com" },
  { name: "Zod", license: "MIT", url: "https://zod.dev" },
];

export default function CreditsView() {
  const order: Provider[] = ["local", "unsplash", "pexels", "commons"];
  const groups = order.map((p) => ({ p, items: images.filter((i) => i.provider === p) })).filter((g) => g.items.length);
  const sources = topics.flatMap((t) => t.sources ?? []).filter((s, i, a) => a.findIndex((x) => x.url === s.url) === i);

  return (
    <>
      <PageHero title="Credits" compact intro={<p>The people and projects whose work this site uses, and where every specification comes from.</p>} />
      <section className="bg-graphite pb-28 pt-6 md:pb-40">
        <div className="shell grid gap-20 lg:grid-cols-12">
          <div className="space-y-16 lg:col-span-7">
            <div>
              <h2 className="wd-expanded text-2xl font-bold uppercase">3D model and renders</h2>
              <p className="mt-4 leading-relaxed text-silver">
                The interactive studio, the hero films and every studio render use a 3D model of the Ferrari 458 by{" "}
                <a href="https://sketchfab.com/models/57bf6cc56931426e87494f554df1dab6" target="_blank" rel="noopener noreferrer" className="link-line text-platinum">
                  vicent091036
                </a>
                , distributed with the{" "}
                <a href="https://github.com/mrdoob/three.js/blob/dev/examples/webgl_materials_car.html" target="_blank" rel="noopener noreferrer" className="link-line text-platinum">
                  three.js car materials example
                </a>
                . Manufacturer badges were removed from the model for this site, and its paint, wheel and cabin materials were changed. Check the model&apos;s licence on its source page before any commercial use.
              </p>
            </div>

            {groups.map((g) => (
              <div key={g.p}>
                <h2 className="wd-expanded text-2xl font-bold uppercase">{g.p === "local" ? "Studio renders" : providerLabel[g.p]}</h2>
                <ul className="spec-rows mt-5 border-y border-gunmetal">
                  {g.items.map((img) => {
                    const cr = creditFor(img);
                    return (
                      <li key={img.id} className="grid gap-1 py-3 text-sm sm:grid-cols-[1fr_auto] sm:gap-6">
                        <span className="text-silver">{img.alt}</span>
                        <span className="text-steel sm:text-right">
                          {cr.author}
                          {cr.license ? `, ${cr.license}` : ""}
                          {cr.page.startsWith("http") ? (
                            <>
                              {" · "}
                              <a href={cr.page} target="_blank" rel="noopener noreferrer" className="link-line text-silver hover:text-platinum">
                                Source
                              </a>
                            </>
                          ) : null}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          <div className="space-y-16 lg:col-span-4 lg:col-start-9">
            <div>
              <h2 className="wd-expanded text-2xl font-bold uppercase">Specifications</h2>
              <p className="mt-4 text-sm text-silver">Checked November 2026. Each car&apos;s page lists its own sources.</p>
              <ul className="mt-5 space-y-5">
                {vehicles.map((v) => (
                  <li key={v.slug}>
                    <Link href={`/collection/${v.slug}`} className="wd-wide text-sm font-semibold text-platinum hover:text-bronze-hi">
                      {v.name}
                    </Link>
                    <ul className="mt-1 space-y-1">
                      {v.sources.map((s) => (
                        <li key={s.url}>
                          <a href={s.url} target="_blank" rel="noopener noreferrer" className="link-line text-xs text-steel hover:text-silver">
                            {s.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
                <li>
                  <p className="wd-wide text-sm font-semibold text-platinum">Engineering and drive modes</p>
                  <ul className="mt-1 space-y-1">
                    {sources.map((s) => (
                      <li key={s.url}>
                        <a href={s.url} target="_blank" rel="noopener noreferrer" className="link-line text-xs text-steel hover:text-silver">
                          {s.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="wd-expanded text-2xl font-bold uppercase">Typeface</h2>
              <p className="mt-4 text-sm text-silver">
                Archivo by Omnibus-Type, SIL Open Font License 1.1, self-hosted with its full width axis.
              </p>
            </div>
            <div>
              <h2 className="wd-expanded text-2xl font-bold uppercase">Software</h2>
              <ul className="mt-4 space-y-1.5 text-sm">
                {software.map((s) => (
                  <li key={s.name} className="flex justify-between gap-4">
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="link-line text-silver hover:text-platinum">
                      {s.name}
                    </a>
                    <span className="text-steel">{s.license}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
