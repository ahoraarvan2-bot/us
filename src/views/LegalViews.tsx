import Link from "next/link";
import type { ReactNode } from "react";
import { site } from "@/content/site";
import { PageHero } from "@/components/ui/PageHero";
import type { PageMeta } from "./meta";

type Section = { id: string; title: string; body: ReactNode };

function LegalPage({ path, title, updated, intro, sections }: { path: string; title: string; updated: string; intro: ReactNode; sections: Section[] }) {
  return (
    <>
      <PageHero title={title} compact intro={intro}>
        <p className="mt-6 text-xs text-steel">Last updated {updated}</p>
      </PageHero>
      <section className="bg-graphite pb-28 pt-6 md:pb-40">
        <div className="shell grid gap-12 lg:grid-cols-12">
          <nav aria-label="Sections" className="lg:col-span-3">
            <ol className="space-y-2 text-sm lg:sticky lg:top-28">
              {sections.map((s, i) => (
                <li key={s.id}>
                  <Link href={`${path}#${s.id}`} className="text-steel hover:text-platinum">
                    <span className="tabular mr-2 text-gunmetal">{i + 1}</span>
                    {s.title}
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
          <div className="max-w-[68ch] space-y-12 lg:col-span-8 lg:col-start-5">
            {site.concept ? (
              <p className="border-l border-bronze pl-4 text-sm leading-relaxed text-steel">
                Template text for a concept site. Have it reviewed by a qualified adviser and replace the placeholder business details before launch.
              </p>
            ) : null}
            {sections.map((s, i) => (
              <article key={s.id} id={s.id} className="scroll-mt-28">
                <h2 className="wd-wide text-xl font-semibold text-platinum">
                  <span className="tabular mr-3 text-bronze-hi">{i + 1}</span>
                  {s.title}
                </h2>
                <div className="mt-4 space-y-4 leading-relaxed text-silver [&_a]:text-platinum [&_a]:underline [&_a]:decoration-gunmetal [&_a]:underline-offset-4 [&_li]:ml-5 [&_li]:list-disc [&_ul]:space-y-2">
                  {s.body}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

const c = site.contact;

export const privacyMeta: PageMeta = {
  path: "/privacy",
  title: "Privacy policy",
  description: "What ONYX Motor House collects through this website, why, how long it is kept and how to exercise your rights.",
};

export function PrivacyView() {
  return (
    <LegalPage
      path="/privacy"
      title="Privacy policy"
      updated="9 November 2026"
      intro={<p>What we collect when you use this site, why we collect it, and what you can ask us to do with it.</p>}
      sections={[
        {
          id: "who",
          title: "Who we are",
          body: (
            <p>
              {site.legal.company} ({c.showroom}, {c.street}, {c.city} {c.postcode}) is responsible for the personal data described here. Contact us about privacy at{" "}
              <span className="text-platinum">{c.email}</span>.
            </p>
          ),
        },
        {
          id: "collect",
          title: "What we collect",
          body: (
            <>
              <p>Only what you type into a form:</p>
              <ul>
                <li>Test-drive requests: your name, email address, phone number, the car, your preferred date, time of day and location, any specification you chose, and your message.</li>
                <li>Contact messages: your name, email address, optional phone number, the topic, an optional car and your message.</li>
              </ul>
              <p>
                To limit abuse, the server briefly holds the network address a request came from in memory to count requests; it is not stored with your request.
              </p>
            </>
          ),
        },
        {
          id: "use",
          title: "How we use it",
          body: (
            <>
              <p>To answer your message and arrange the drive or viewing you asked for, and to keep a record of that conversation. We do not use your details for marketing unless you ask us to, and we do not sell them.</p>
              <p>The legal basis is your consent, given in the form, and the steps you ask us to take before any purchase.</p>
            </>
          ),
        },
        {
          id: "share",
          title: "Who else sees it",
          body: (
            <p>
              Our hosting provider, and any customer-management or messaging service we use to receive requests, process your details on our behalf and under contract. We share nothing with manufacturers unless that is needed to answer your request and you agree.
            </p>
          ),
        },
        {
          id: "keep",
          title: "How long we keep it",
          body: <p>Up to two years after our last contact with you. If you buy a car, we keep the records the law requires for as long as it requires.</p>,
        },
        {
          id: "rights",
          title: "Your rights",
          body: (
            <>
              <p>You can ask us for a copy of your data, to correct it, to delete it, or to stop using it. Write to {c.email}; we answer within one month.</p>
              <p>
                If you are unhappy with our answer you can complain to the Information Commissioner&apos;s Office at{" "}
                <a href="https://ico.org.uk/make-a-complaint/" target="_blank" rel="noopener noreferrer">
                  ico.org.uk
                </a>
                .
              </p>
            </>
          ),
        },
        {
          id: "cookies",
          title: "Cookies and third parties",
          body: (
            <>
              <p>This site sets no cookies and uses no analytics or advertising trackers. Fonts, films and the 3D model are served from our own server.</p>
              <p>
                Some photographs load from Unsplash, Pexels and Wikimedia Commons. Their servers receive your network address and browser details when an image loads; we ask browsers not to send the address of the page you were on.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}

export const termsMeta: PageMeta = {
  path: "/terms",
  title: "Terms and conditions",
  description: "Terms for using the ONYX Motor House website, the vehicle information on it and test drives.",
};

export function TermsView() {
  return (
    <LegalPage
      path="/terms"
      title="Terms and conditions"
      updated="9 November 2026"
      intro={<p>The terms that apply when you use this website and request a test drive.</p>}
      sections={[
        {
          id: "about",
          title: "About these terms",
          body: <p>This website is run by {site.legal.company}. By using it you accept these terms. If you do not accept them, please do not use the site.</p>,
        },
        {
          id: "vehicles",
          title: "Vehicle information and prices",
          body: (
            <>
              <p>
                Specifications are the manufacturers&apos; published figures or come from the sources listed on each car&apos;s page. Manufacturers change specifications, equipment and prices, and figures differ by market.
              </p>
              <p>
                Prices are list prices where the manufacturer publishes one and exclude options, delivery and local taxes. Nothing on this site is an offer to sell. We confirm the specification and price of a specific car in writing before you commit.
              </p>
              <p>Paint, wheel and trim options shown as indicative are a selection from the manufacturer&apos;s range and may not be available for every car or market.</p>
            </>
          ),
        },
        {
          id: "drives",
          title: "Test drives",
          body: (
            <>
              <p>A request is not a booking until we confirm it by email. On the day you will need a full, valid driving licence, and we may ask for further identification.</p>
              <p>We can decline or reschedule a drive, for example because of the weather, insurance requirements or the condition of the car.</p>
            </>
          ),
        },
        {
          id: "marks",
          title: "Trademarks and images",
          body: (
            <>
              <p>{site.legal.trademarkNotice}</p>
              <p>
                Photographs are used under the licences credited in the gallery viewer and on the{" "}
                <Link href="/credits">credits page</Link>. Studio renders are made from a third-party 3D model with its badges removed.
              </p>
            </>
          ),
        },
        {
          id: "use",
          title: "Using the site",
          body: <p>Do not misuse the site, its forms or its content, or try to gain unauthorised access to it. You may share links to any page.</p>,
        },
        {
          id: "liability",
          title: "Our liability",
          body: (
            <p>
              We take care to keep information accurate but do not guarantee that it is complete or current. We are not liable for losses that arise from relying on the site, except where the law does not allow us to limit liability.
            </p>
          ),
        },
        {
          id: "law",
          title: "Governing law",
          body: <p>These terms are governed by the law of England and Wales, and its courts have jurisdiction.</p>,
        },
      ]}
    />
  );
}
