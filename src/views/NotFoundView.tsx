import Link from "next/link";
import { vehicles } from "@/content/vehicles";
import type { PageMeta } from "./meta";

export const meta: PageMeta = {
  path: "/404",
  title: "Page not found",
  description: "This page does not exist.",
  noindex: true,
};

export default function NotFoundView() {
  return (
    <section className="grain relative isolate flex min-h-[100svh] items-end overflow-hidden bg-void">
      <div aria-hidden="true" className="absolute inset-x-[-10%] top-[46%] h-px rotate-[-3deg] bg-gradient-to-r from-transparent via-silver/30 to-transparent" />
      <div className="shell relative z-10 pb-20 pt-40">
        <p className="tabular text-sm text-bronze-hi">404</p>
        <h1 className="wd-expanded mt-4 max-w-4xl text-[clamp(2.4rem,7vw,6.5rem)] font-extrabold uppercase leading-[0.9]">This road ends here</h1>
        <p className="mt-6 max-w-lg text-lg text-silver">The page you asked for does not exist, or has moved. These do:</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/" className="btn btn-primary">
            Home
          </Link>
          <Link href="/collection" className="btn btn-ghost">
            The collection
          </Link>
          <Link href="/contact" className="btn btn-ghost">
            Contact
          </Link>
        </div>
        <ul className="mt-14 flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {vehicles.map((v) => (
            <li key={v.slug}>
              <Link href={`/collection/${v.slug}`} className="link-line text-steel hover:text-platinum">
                {v.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
