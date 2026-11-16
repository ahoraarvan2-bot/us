"use client";

import { useState } from "react";
import { SmartImage } from "@/components/media/SmartImage";
import { Lightbox } from "@/components/gallery/Lightbox";
import { Shutter } from "@/components/ui/Motion";
import { getImage } from "@/lib/media";
import { cx } from "@/lib/format";

/** Editorial grid that adapts to however many photographs a car has; opens a full-screen viewer. */
export function VehicleGallery({ ids, label }: { ids: string[]; label: string }) {
  const items = ids.map(getImage);
  const [open, setOpen] = useState<number | null>(null);
  if (!items.length) return null;

  const layout = (i: number, n: number) => {
    if (n === 1) return "md:col-span-12 aspect-[16/9]";
    if (n === 2) return i === 0 ? "md:col-span-7 aspect-[4/3] md:aspect-[16/11]" : "md:col-span-5 aspect-[4/3] md:aspect-auto";
    if (i === 0) return "md:col-span-8 md:row-span-2 aspect-[16/10] md:aspect-auto";
    return "md:col-span-4 aspect-[16/10]";
  };

  return (
    <>
      <ul className="grid gap-3 md:grid-cols-12 md:gap-5">
        {items.map((img, i) => (
          <li key={img.id} className={cx("relative", layout(i, items.length))}>
            <button
              type="button"
              onClick={() => setOpen(i)}
              className="group absolute inset-0 block overflow-hidden"
              aria-label={`Open image: ${img.alt}`}
            >
              <Shutter className="h-full w-full">
                <SmartImage
                  image={img}
                  sizes="(min-width: 768px) 60vw, 100vw"
                  fallbackLabel={label}
                  imgClassName="transition-transform duration-[1.4s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.03]"
                />
              </Shutter>
              <span className="pointer-events-none absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-left text-xs text-silver opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100">
                {img.alt}
              </span>
            </button>
          </li>
        ))}
      </ul>
      <Lightbox items={items} index={open} onClose={() => setOpen(null)} onIndex={setOpen} />
    </>
  );
}
