import type { ReactNode } from "react";
import { SmartImage } from "@/components/media/SmartImage";
import { LineReveal } from "./Motion";
import { cx } from "@/lib/format";

/** Opening band for inner pages: a title on the black stage, optionally over an image. */
export function PageHero({
  title,
  intro,
  image,
  imagePosition,
  children,
  compact = false,
}: {
  title: string;
  intro?: ReactNode;
  image?: string;
  imagePosition?: string;
  children?: ReactNode;
  compact?: boolean;
}) {
  return (
    <section className={cx("grain relative isolate overflow-hidden bg-void", image ? "min-h-[72svh]" : "")}>
      {image ? (
        <>
          <SmartImage image={image} priority sizes="100vw" position={imagePosition} bare />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
        </>
      ) : null}
      <div className={cx("shell relative z-10 flex flex-col justify-end", image ? "min-h-[72svh] pb-16 pt-36 md:pb-24" : compact ? "pb-12 pt-36 md:pt-44" : "pb-16 pt-40 md:pb-24 md:pt-52")}>
        <LineReveal as="h1" immediate className="wd-expanded max-w-5xl text-[clamp(2.4rem,7vw,7rem)] font-extrabold uppercase leading-[0.9]">
          {title}
        </LineReveal>
        {intro ? <div className="mt-8 max-w-2xl text-lg leading-relaxed text-silver">{intro}</div> : null}
        {children}
      </div>
    </section>
  );
}
