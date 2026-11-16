import CollectionGrid from "@/components/vehicle/CollectionGrid";
import { PageHero } from "@/components/ui/PageHero";
import { preferShowable } from "@/lib/media";
import type { PageMeta } from "./meta";

export const meta: PageMeta = {
  path: "/collection",
  title: "The collection",
  description:
    "Porsche 911 Turbo S, Lamborghini Revuelto, Ferrari 296 GTB, Aston Martin DB12, Mercedes-AMG GT 63, BMW M5 CS, BMW M4 Competition and a heritage Ferrari 458 Spider, with sourced specifications and prices.",
};

export default function CollectionView() {
  return (
    <>
      <PageHero
        title="The collection"
        image={preferShowable("u-bmw-garage-kodier", "studio-rear")}
        imagePosition="50% 60%"
        intro={
          <p>
            Eight cars, each one chosen for how it drives. Specifications are the manufacturers&apos; own; prices are list prices where the maker publishes one, and on application where it doesn&apos;t.
          </p>
        }
      />
      <section className="bg-graphite pb-28 pt-12 md:pb-40">
        <div className="shell">
          <CollectionGrid />
        </div>
      </section>
    </>
  );
}
