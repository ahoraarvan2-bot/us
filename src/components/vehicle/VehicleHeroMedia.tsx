"use client";

import { useEffect, useRef, useState } from "react";
import { SmartImage } from "@/components/media/SmartImage";
import { prefersReducedMotion } from "@/lib/motion";
import type { FilmScene } from "@/content/films";

/** Full-bleed hero media for a vehicle: the photograph, or a looping film where we have one. */
export function VehicleHeroMedia({ image, film, label }: { image: string; film?: FilmScene; label: string }) {
  const [useFilm, setUseFilm] = useState(false);
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
    if (film && !prefersReducedMotion() && !saveData) setUseFilm(true);
  }, [film]);

  return (
    <div className="absolute inset-0">
      <SmartImage image={image} priority sizes="100vw" fallbackLabel={label} bare />
      {film && useFilm ? (
        <video
          ref={video}
          className="absolute inset-0 h-full w-full object-cover"
          poster={film.poster}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
          onError={() => setUseFilm(false)}
        >
          <source src={film.mp4.sd} type="video/mp4" media="(max-width: 767px)" />
          <source src={film.mp4.hd} type="video/mp4" />
        </video>
      ) : null}
    </div>
  );
}
