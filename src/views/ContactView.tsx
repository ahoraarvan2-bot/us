import { ContactForm } from "@/components/forms/ContactForm";
import { ShowroomDetails } from "@/components/contact/ShowroomDetails";
import { PageHero } from "@/components/ui/PageHero";
import type { PageMeta } from "./meta";

export const meta: PageMeta = {
  path: "/contact",
  title: "Contact",
  description: "Visit the ONYX showroom in Mayfair, call or email a specialist, or send a message about buying, sourcing or viewing a car.",
};

export default function ContactView() {
  return (
    <>
      <PageHero title="Contact" compact intro={<p>Ask about a car, a specification or a viewing. A specialist replies within one working day.</p>} />
      <section className="bg-graphite pb-28 pt-6 md:pb-40">
        <div className="shell grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <ShowroomDetails />
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <h2 className="wd-expanded mb-10 text-[clamp(1.6rem,3vw,2.5rem)] font-bold uppercase">Send a message</h2>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
