import { vehicles } from "@/content/vehicles";
import { fmtInt } from "@/lib/format";

const MAX_RPM = 9000;

type Band = { from: number; to?: number; open?: boolean };

/** Reads the manufacturer's torque rpm string: "2,300–6,000 rpm", "6,750 rpm" or "from 2,750 rpm". */
function parse(rpm?: string): Band | null {
  if (!rpm) return null;
  const nums = rpm.match(/\d[\d,]*/g)?.map((n) => Number(n.replace(/,/g, ""))) ?? [];
  if (!nums.length) return null;
  if (/^from/i.test(rpm.trim())) return { from: nums[0], open: true };
  if (nums.length >= 2) return { from: nums[0], to: nums[1] };
  return { from: nums[0] };
}

/** Where in the rev range each car makes its peak torque. */
export function TorqueBands() {
  const rows = vehicles
    .map((v) => ({ v, band: parse(v.specs.torqueRpm) }))
    .filter((r) => r.band)
    .sort((a, b) => a.band!.from - b.band!.from);
  const ticks = [0, 2000, 4000, 6000, 8000];

  return (
    <figure className="border border-gunmetal bg-void p-5 md:p-8">
      <figcaption>
        <p className="wd-wide text-sm font-semibold text-platinum">Where peak torque arrives</p>
        <p className="mt-1 text-xs text-steel">Bars are plateaus, dots are single peaks. Engine speed in rpm; figures in Nm.</p>
      </figcaption>
      <ul className="mt-6 space-y-3">
        {rows.map(({ v, band }) => {
          const b = band!;
          const left = (b.from / MAX_RPM) * 100;
          const width = b.to ? ((b.to - b.from) / MAX_RPM) * 100 : b.open ? 100 - left : 0;
          return (
            <li key={v.slug} className="grid grid-cols-[minmax(0,8.5rem)_1fr_4rem] items-center gap-3 text-xs sm:grid-cols-[11rem_1fr_4.5rem]">
              <span className="truncate text-silver">{v.name}</span>
              <span className="relative block h-5">
                <span className="absolute inset-x-0 top-1/2 h-px bg-gunmetal" />
                {width > 0 ? (
                  <span
                    className="absolute top-1/2 h-2 -translate-y-1/2"
                    style={{
                      left: `${left}%`,
                      width: `${width}%`,
                      background: b.open
                        ? "linear-gradient(90deg, var(--color-bronze), transparent)"
                        : "var(--color-bronze)",
                    }}
                    title={v.specs.torqueRpm}
                  />
                ) : (
                  <span
                    className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-bronze-hi bg-void"
                    style={{ left: `${left}%` }}
                    title={v.specs.torqueRpm}
                  />
                )}
              </span>
              <span className="tabular text-right text-platinum">
                {fmtInt(v.specs.torqueNm)} <span className="text-steel">Nm</span>
              </span>
            </li>
          );
        })}
      </ul>
      <div className="mt-2 grid grid-cols-[minmax(0,8.5rem)_1fr_4rem] gap-3 sm:grid-cols-[11rem_1fr_4.5rem]" aria-hidden="true">
        <span />
        <span className="relative h-4 text-[0.625rem] text-steel">
          {ticks.map((t) => (
            <span key={t} className="absolute -translate-x-1/2 first:translate-x-0" style={{ left: `${(t / MAX_RPM) * 100}%` }}>
              {fmtInt(t)}
            </span>
          ))}
        </span>
        <span className="text-right text-[0.625rem] text-steel">rpm</span>
      </div>
      <p className="mt-5 text-xs text-steel">
        The Revuelto&apos;s figure is for the V12 alone; its electric motors add torque that is not included here. The DB12&apos;s plateau is quoted from 2,750 rpm without an upper limit.
      </p>
    </figure>
  );
}
