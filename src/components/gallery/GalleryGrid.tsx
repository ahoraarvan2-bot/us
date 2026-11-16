"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SmartImage } from "@/components/media/SmartImage";
import { Lightbox } from "@/components/gallery/Lightbox";
import { canShow, galleryCategories, images, providerLabel, type MediaImage } from "@/lib/media";
import { getVehicle } from "@/content/vehicles";
import { IS_PREVIEW } from "@/lib/env";
import { cx } from "@/lib/format";

type Cat = (typeof galleryCategories)[number]["id"];

/** Taller frames for interiors and details, wide frames for whole cars. */
function frameFor(img: MediaImage, i: number) {
  if (img.w && img.h) return { aspectRatio: `${img.w} / ${img.h}` };
  if (img.tags.includes("interior") || img.tags.includes("detail")) return { aspectRatio: i % 2 ? "4 / 5" : "1 / 1" };
  return { aspectRatio: i % 3 === 1 ? "4 / 3" : "3 / 2" };
}

export function GalleryGrid() {
  const pool = useMemo(() => images.filter(canShow), []);
  const hidden = images.length - pool.length;
  const [cat, setCat] = useState<Cat>("all");
  const [open, setOpen] = useState<number | null>(null);
  const list = useMemo(() => (cat === "all" ? pool : pool.filter((i) => i.tags.includes(cat))), [cat, pool]);
  const counts = useMemo(
    () => Object.fromEntries(galleryCategories.map((c) => [c.id, c.id === "all" ? pool.length : pool.filter((i) => i.tags.includes(c.id)).length])),
    [pool]
  );

  return (
    <>
      <div className="flex flex-col gap-4 border-y border-gunmetal py-5 lg:flex-row lg:items-center lg:justify-between">
        <div role="group" aria-label="Filter the gallery" className="-mx-1 flex flex-wrap gap-1">
          {galleryCategories
            .filter((c) => counts[c.id] > 0)
            .map((c) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={cat === c.id}
                onClick={() => setCat(c.id)}
                className={cx("px-3 py-2 text-sm transition-colors", cat === c.id ? "bg-platinum text-black" : "text-silver hover:text-platinum")}
              >
                {c.label}
                <span className={cx("tabular ml-1.5 text-xs", cat === c.id ? "text-black/60" : "text-steel")}>{counts[c.id]}</span>
              </button>
            ))}
        </div>
        <p className="text-sm text-steel" aria-live="polite">
          {list.length} {list.length === 1 ? "image" : "images"}
        </p>
      </div>

      {IS_PREVIEW && hidden > 0 ? (
        <p className="mt-6 max-w-3xl text-sm text-steel">
          This preview shows the studio renders that ship with the site. The full site adds {hidden} licensed photographs of the collection, each credited in the viewer.
        </p>
      ) : null}

      <motion.ul layout className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>li]:mb-4">
        <AnimatePresence mode="popLayout">
          {list.map((img, i) => {
            const v = img.vehicle ? getVehicle(img.vehicle) : undefined;
            return (
              <motion.li
                key={img.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="break-inside-avoid"
              >
                <button type="button" onClick={() => setOpen(i)} className="group relative block w-full overflow-hidden text-left" style={frameFor(img, i)} aria-label={`Open image: ${img.alt}`}>
                  <SmartImage
                    image={img}
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    fallbackLabel={v?.name}
                    imgClassName="transition-transform duration-[1.4s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.04]"
                  />
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100">
                    <span className="block text-xs text-platinum">{v?.name ?? img.alt}</span>
                    <span className="block text-[0.6875rem] text-steel">
                      {img.credit.author}, {providerLabel[img.provider]}
                    </span>
                  </span>
                </button>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </motion.ul>

      <Lightbox items={list} index={open} onClose={() => setOpen(null)} onIndex={setOpen} />
    </>
  );
}
