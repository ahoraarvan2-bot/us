import Link from "next/link";
import { site } from "@/content/site";
import { vehicles } from "@/content/vehicles";
import { Logo } from "@/components/ui/Logo";

const houseLinks = [
  { label: "The collection", href: "/collection" },
  { label: "Performance", href: "/performance" },
  { label: "Compare cars", href: "/performance#compare" },
  { label: "Technology", href: "/technology" },
  { label: "Gallery", href: "/gallery" },
  { label: "About the house", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Book a test drive", href: "/test-drive" },
];

export default function SiteFooter() {
  const year = new Date().getFullYear();
  const c = site.contact;
  return (
    <footer className="relative border-t border-gunmetal bg-void text-silver">
      <div className="shell pb-10 pt-20 md:pt-28">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo full />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-steel">
              An independent motor house in London. We source, prepare and hand over performance cars to drivers who know exactly what they want, and to some who are still deciding.
            </p>
            <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2" aria-label="Social media">
              {site.social.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="link-line text-xs font-semibold uppercase tracking-[0.16em] text-silver hover:text-platinum">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Collection" className="lg:col-span-3">
            <p className="label mb-5">Collection</p>
            <ul className="space-y-2.5">
              {vehicles.map((v) => (
                <li key={v.slug}>
                  <Link href={`/collection/${v.slug}`} className="text-sm hover:text-platinum">
                    {v.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="House" className="lg:col-span-2">
            <p className="label mb-5">House</p>
            <ul className="space-y-2.5">
              {houseLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm hover:text-platinum">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <p className="label mb-5">Showroom</p>
            <address className="text-sm not-italic leading-relaxed">
              {c.showroom}
              <br />
              {c.street}
              <br />
              {c.city} {c.postcode}, {c.country}
            </address>
            <p className="mt-4 text-sm">
              <a href={c.phoneHref} className="tabular hover:text-platinum">
                {c.phone}
              </a>
              <br />
              <a href={`mailto:${c.email}`} className="break-all hover:text-platinum">
                {c.email}
              </a>
            </p>
            <dl className="mt-4 space-y-1 text-sm text-steel">
              {c.hours.map((h) => (
                <div key={h.days} className="flex justify-between gap-4">
                  <dt>{h.days}</dt>
                  <dd className="tabular">{h.time}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="mt-20 border-t border-gunmetal pt-8">
          <p className="max-w-4xl text-xs leading-relaxed text-steel">{site.legal.trademarkNotice}</p>
          {site.concept ? (
            <p className="mt-3 max-w-4xl text-xs leading-relaxed text-steel">
              Concept website: ONYX Motor House is a fictional brand. The cars, specifications and prices are real and sourced; the business details are placeholders.
            </p>
          ) : null}
          <div className="mt-6 flex flex-col gap-4 text-xs text-steel md:flex-row md:items-center md:justify-between">
            <p>
              © {year} {site.legal.company}. All rights reserved.
            </p>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              <li>
                <Link href="/privacy" className="hover:text-platinum">
                  Privacy policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-platinum">
                  Terms and conditions
                </Link>
              </li>
              <li>
                <Link href="/credits" className="hover:text-platinum">
                  Credits and sources
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
