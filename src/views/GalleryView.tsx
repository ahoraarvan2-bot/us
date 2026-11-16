import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { PageHero } from "@/components/ui/PageHero";
import type { PageMeta } from "./meta";

export const meta: PageMeta = {
  path: "/gallery",
  title: "Gallery",
  description: "Studio renders and photography of the ONYX collection: exteriors, interiors, details, night and the road.",
};

export default function GalleryView() {
  return (
    <>
      <PageHero
        title="Gallery"
        compact
        intro={<p>Studio renders made for this site and licensed photography of the collection. Select any image to view it full screen; credits are shown in the viewer.</p>}
      />
      <section className="bg-graphite pb-28 pt-4 md:pb-40">
        <div className="shell">
          <GalleryGrid />
        </div>
      </section>
    </>
  );
}
