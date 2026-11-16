import type { CSSProperties } from "react";
import { cx } from "@/lib/format";
import { LogoMark } from "@/components/ui/Logo";
import { IS_PREVIEW } from "@/lib/env";
import { getVehicle } from "@/content/vehicles";
import { providerLabel, type MediaImage } from "@/lib/media";

/** Small deterministic PRNG so each plate gets its own, stable composition. */
function seeded(key: string) {
  let h = 2166136261;
  for (let i = 0; i < key.length; i++) h = Math.imul(h ^ key.charCodeAt(i), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

function hexToRgb(hex: string) {
  const n = parseInt(hex.replace("#", ""), 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
}

type Trail = { top: number; left: number; width: number; tilt: number; thick: number; alpha: number; warm: boolean; delay: number };

function trailsFor(key: string): Trail[] {
  const rnd = seeded(key);
  const count = 4 + Math.floor(rnd() * 3);
  const horizon = 50 + rnd() * 10;
  const tilt = -2 - rnd() * 4;
  return Array.from({ length: count }, (_, i) => ({
    top: horizon - 9 + i * (14 / count) + rnd() * 3,
    left: -20 + rnd() * 35,
    width: 55 + rnd() * 70,
    tilt: tilt + (rnd() - 0.5) * 1.6,
    thick: i === 1 ? 2.5 : 1 + rnd() * 1.2,
    alpha: i === 1 ? 1 : 0.35 + rnd() * 0.45,
    warm: rnd() > 0.72,
    delay: rnd() * -12,
  }));
}

/**
 * Shown where a photograph cannot be loaded (the self-contained preview cannot reach
 * third-party image hosts) or has not been supplied yet. Instead of an empty box it is a
 * long-exposure plate: light trails in the car's own accent colour over a wet floor,
 * so the page still reads as night photography. It names the photograph that belongs
 * here so it can be checked or replaced.
 */
export function FallbackPlate({
  label,
  note,
  image,
  className,
  bare = false,
}: {
  label?: string;
  note?: string;
  image?: MediaImage;
  className?: string;
  bare?: boolean;
}) {
  const vehicle = image?.vehicle ? getVehicle(image.vehicle) : undefined;
  const accent = hexToRgb(vehicle?.accent ?? "#c39a63");
  const trails = trailsFor(image?.id ?? label ?? "onyx");
  const credit = image && image.provider !== "local" ? `${image.credit.author}, ${providerLabel[image.provider]}` : undefined;
  const line = note ?? (credit ? (IS_PREVIEW ? `Photograph: ${credit}. Shown on the full site.` : `Photograph: ${credit}`) : "Photography on request");
  const floor = Math.max(...trails.map((t) => t.top)) + 6;

  return (
    <div
      role="img"
      aria-label={label ? `${label}, photograph not shown here` : "Photograph not shown here"}
      className={cx("plate absolute inset-0 overflow-hidden bg-void", className)}
      style={{ "--plate-rgb": accent } as CSSProperties}
    >
      {/* sky and floor */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: `radial-gradient(70% 38% at 55% ${floor}%, rgba(${accent}, 0.20), transparent 70%), radial-gradient(90% 60% at 20% -10%, rgba(181,186,193,0.08), transparent 60%), linear-gradient(180deg, #0b0c0f 0%, #050506 ${floor}%, #020203 100%)`,
        }}
      />
      {/* the trails, then their reflection on the wet floor */}
      {[false, true].map((reflection) => (
        <div
          key={String(reflection)}
          aria-hidden="true"
          className={cx("absolute inset-0", reflection && "opacity-35 blur-[3px]")}
          style={reflection ? { transform: `translateY(${floor * 2}%) scaleY(-1)`, transformOrigin: "50% 0" } : undefined}
        >
          {trails.map((t, i) => (
            <span
              key={i}
              className="plate-trail absolute block rounded-full"
              style={{
                top: `${t.top}%`,
                left: `${t.left}%`,
                width: `${t.width}%`,
                height: `${t.thick}px`,
                opacity: t.alpha,
                transform: `rotate(${t.tilt}deg)`,
                animationDelay: `${t.delay}s`,
                background: t.warm
                  ? "linear-gradient(90deg, transparent, rgba(226,120,60,0.9) 40%, rgba(255,214,170,1) 70%, transparent)"
                  : `linear-gradient(90deg, transparent, rgba(${accent}, 0.95) 35%, rgba(255,255,255,0.95) 72%, transparent)`,
                boxShadow: t.warm ? "0 0 14px 1px rgba(226,120,60,0.55)" : `0 0 16px 1px rgba(${accent}, 0.55)`,
              }}
            />
          ))}
        </div>
      ))}
      {/* floor line and a soft vignette */}
      <div aria-hidden="true" className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" style={{ top: `${floor}%` }} />
      <div aria-hidden="true" className="absolute inset-0 [background:radial-gradient(120%_90%_at_50%_45%,transparent_55%,rgba(0,0,0,0.7))]" />

      {bare ? null : (
        <div className="relative flex h-full flex-col justify-between p-5 md:p-7">
          <LogoMark className="h-6 w-6 text-silver/35" />
          <div className="max-w-[90%]">
            {label ? <p className="wd-wide text-lg font-semibold text-platinum/90 md:text-xl">{label}</p> : null}
            <p className="mt-1 text-xs leading-snug text-steel">{line}</p>
          </div>
        </div>
      )}
    </div>
  );
}
