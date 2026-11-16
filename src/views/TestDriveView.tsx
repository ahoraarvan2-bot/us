import { TestDriveForm } from "@/components/forms/TestDriveForm";
import { PageHero } from "@/components/ui/PageHero";
import type { PageMeta } from "./meta";

export const meta: PageMeta = {
  path: "/test-drive",
  title: "Book a test drive",
  description: "Request a test drive of any car in the ONYX collection, at the Mayfair showroom or delivered to you.",
};

export default function TestDriveView() {
  return (
    <>
      <PageHero
        title="Book a test drive"
        compact
        intro={<p>Choose a car, a date and a time of day. We confirm every drive by email, and a specialist comes with you.</p>}
      />
      <section className="bg-graphite pb-28 pt-6 md:pb-40">
        <div className="shell">
          <TestDriveForm />
        </div>
      </section>
    </>
  );
}
