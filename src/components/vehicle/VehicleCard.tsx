import Link from "next/link";
import type { Vehicle } from "@/content/vehicles";
import { SmartImage } from "@/components/media/SmartImage";
import { fmtInt, priceShort, topSpeedPrefix } from "@/lib/format";

export const statusLabel: Record<Vehicle["status"], string> = {
  current: "Current model",
  limited: "Limited series",
  heritage: "Heritage",
};

export function VehicleCard({ v, priority = false }: { v: Vehicle; priority?: boolean }) {
  const s = v.specs;
  const href = `/collection/${v.slug}`;
  return (
    <article className="group relative flex flex-col">
      <Link href={href} className="relative block aspect-[16/10] overflow-hidden" aria-label={`${v.name}, view details`}>
        <SmartImage
          image={v.media.hero}
          priority={priority}
          sizes="(min-width: 1280px) 46vw, (min-width: 768px) 50vw, 100vw"
          fallbackLabel={v.name}
          imgClassName="transition-transform duration-[1.6s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.04]"
        />
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-0 transition-none group-hover:translate-x-[400%] group-hover:opacity-100 group-hover:transition-[transform,opacity] group-hover:duration-[1.2s]"
        />
      </Link>

      <div className="flex items-baseline justify-between gap-4 pt-6">
        <p className="text-sm text-silver">
          {v.make}
          <span className="mx-2 text-gunmetal" aria-hidden="true">/</span>
          <span className="text-steel">{statusLabel[v.status]}</span>
        </p>
        <p className="tabular text-sm text-steel">{v.year}</p>
      </div>
      <h3 className="mt-2">
        <Link href={href} className="wd-expanded text-[clamp(1.5rem,2.6vw,2.25rem)] font-bold uppercase leading-none text-platinum">
          {v.model}
        </Link>
      </h3>
      <p className="mt-3 text-sm text-silver">{v.engine}</p>

      <dl className="mt-6 grid grid-cols-2 border-t border-gunmetal sm:grid-cols-3">
        <Spec label="Power" value={`${fmtInt(s.powerPs)}`} unit="PS" />
        <Spec label="0–100 km/h" value={s.zeroTo100.toFixed(1)} unit="s" />
        <Spec label="Top speed" value={`${topSpeedPrefix(v)}${fmtInt(s.topSpeedKmh)}`} unit="km/h" />
        <Spec label="Torque" value={fmtInt(s.torqueNm)} unit="Nm" />
        <Spec label="Gearbox" text={s.transmission.replace(/ with .*/, "")} wide />
        <Spec label="Price" text={priceShort(v.price)} />
      </dl>

      <div className="mt-6">
        <Link href={href} className="btn btn-ghost btn-sm">
          Explore vehicle
        </Link>
      </div>
    </article>
  );
}

function Spec({ label, value, unit, text, wide }: { label: string; value?: string; unit?: string; text?: string; wide?: boolean }) {
  return (
    <div className={`border-b border-gunmetal py-3 pr-3 ${wide ? "col-span-2 sm:col-span-1" : ""}`}>
      <dt className="text-[0.6875rem] text-steel">{label}</dt>
      <dd className="mt-1 text-platinum">
        {text ? (
          <span className="text-sm leading-snug">{text}</span>
        ) : (
          <>
            <span className="tabular wd-condensed text-2xl font-medium">{value}</span>
            <span className="ml-1 text-xs text-silver">{unit}</span>
          </>
        )}
      </dd>
    </div>
  );
}
