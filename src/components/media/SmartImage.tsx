"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { candidatesFor, findImage, type MediaImage } from "@/lib/media";
import { cx } from "@/lib/format";
import { FallbackPlate } from "./FallbackPlate";

type Props = {
  /** Image id from src/content/media.json, or the record itself. */
  image?: string | MediaImage | null;
  sizes?: string;
  priority?: boolean;
  /** Fills the nearest positioned parent (default). */
  className?: string;
  imgClassName?: string;
  /** CSS object-position, e.g. "50% 70%". */
  position?: string;
  /** Text for the designed placeholder if the photo can't be shown. */
  fallbackLabel?: string;
  fallbackNote?: string;
  /** Override the manifest alt text, or "" for decorative use. */
  alt?: string;
  /** Applies the house grade so photos from different sources sit together. */
  grade?: boolean;
  draggable?: boolean;
  fit?: "cover" | "contain";
  /** Where text sits over the image: show only the plate's background if the photo can't load. */
  bare?: boolean;
};

/**
 * Loads an image from the best available source (self-hosted copy, then the provider's CDN),
 * fades it in once decoded, and swaps in a designed plate if every source fails.
 */
export function SmartImage({
  image,
  sizes = "100vw",
  priority = false,
  className,
  imgClassName,
  position,
  fallbackLabel,
  fallbackNote,
  alt,
  grade = true,
  draggable = false,
  fit = "cover",
  bare = false,
}: Props) {
  const img = typeof image === "string" ? findImage(image) : image ?? undefined;
  const candidates = useMemo(() => (img ? candidatesFor(img) : []), [img]);
  const [stage, setStage] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLImageElement>(null);
  const failed = !img || stage >= candidates.length;
  const current = failed ? undefined : candidates[stage];

  useEffect(() => {
    setStage(0);
    setLoaded(false);
  }, [img?.id]);

  // An image can finish (or fail) before React hydrates and attaches handlers.
  useEffect(() => {
    const el = ref.current;
    if (!el || !el.complete) return;
    if (el.naturalWidth > 0) setLoaded(true);
    else setStage((s) => s + 1);
  }, [current?.src]);

  return (
    <div className={cx("absolute inset-0 overflow-hidden bg-carbon", className)}>
      {current ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={ref}
          key={current.src}
          src={current.src}
          srcSet={current.srcSet}
          sizes={sizes}
          alt={alt ?? img?.alt ?? ""}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
          draggable={draggable}
          referrerPolicy="no-referrer"
          onLoad={() => setLoaded(true)}
          onError={() => {
            setLoaded(false);
            setStage((s) => s + 1);
          }}
          style={{ objectPosition: position }}
          className={cx(
            "absolute inset-0 h-full w-full transition-opacity duration-700 ease-out",
            fit === "contain" ? "object-contain" : "object-cover",
            grade && "[filter:contrast(1.04)_saturate(0.92)_brightness(0.94)]",
            loaded ? "opacity-100" : "opacity-0",
            imgClassName
          )}
        />
      ) : null}
      {failed ? <FallbackPlate label={fallbackLabel} note={fallbackNote} image={img} bare={bare} /> : null}
      {!loaded && !failed ? (
        <div aria-hidden="true" className="absolute inset-0 animate-pulse bg-gradient-to-br from-carbon via-graphite to-carbon" />
      ) : null}
    </div>
  );
}
