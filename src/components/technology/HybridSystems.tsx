import Link from "next/link";
import { getVehicle } from "@/content/vehicles";
import { fmtInt } from "@/lib/format";

type Kind = "battery" | "engine" | "motor" | "gearbox" | "axle" | "boost";
type FlowNode = { id: string; label: string; sub?: string; col: number; row: number; kind: Kind };
type FlowEdge = { from: string; to: string; kind: "mech" | "elec" | "boost" };
type System = { slug: string; summary: string; nodes: FlowNode[]; edges: FlowEdge[]; rows: number; split?: { label: string; value: number }[]; source?: { label: string; url: string } };

/**
 * Power-flow diagrams for the three hybrids. They show how energy moves between
 * the parts, not where the parts sit in the car. Facts from src/content/vehicles.ts;
 * the Revuelto's battery capacity from the source cited.
 */
const systems: System[] = [
  {
    slug: "porsche-911-turbo-s",
    summary: "Two electric turbochargers and a motor inside the gearbox, fed by a small high-voltage battery.",
    rows: 3,
    nodes: [
      { id: "bat", label: "Battery", sub: "1.9 kWh, 400 V", col: 0, row: 0, kind: "battery" },
      { id: "turbo", label: "Electric turbos", sub: "A motor on each shaft", col: 1, row: 0, kind: "boost" },
      { id: "eng", label: "Flat-six", sub: "3.6 litres", col: 1, row: 1, kind: "engine" },
      { id: "box", label: "8-speed PDK", sub: "Integrated motor", col: 2, row: 1, kind: "gearbox" },
      { id: "rear", label: "Rear axle", col: 3, row: 1, kind: "axle" },
      { id: "front", label: "Front axle", col: 3, row: 2, kind: "axle" },
    ],
    edges: [
      { from: "bat", to: "turbo", kind: "elec" },
      { from: "bat", to: "box", kind: "elec" },
      { from: "turbo", to: "eng", kind: "boost" },
      { from: "eng", to: "box", kind: "mech" },
      { from: "box", to: "rear", kind: "mech" },
      { from: "box", to: "front", kind: "mech" },
    ],
  },
  {
    slug: "lamborghini-revuelto",
    summary: "A naturally aspirated V12 drives the rear wheels; three motors add electric drive to both axles.",
    rows: 3,
    nodes: [
      { id: "bat", label: "Battery", sub: "3.8 kWh, central tunnel", col: 0, row: 1, kind: "battery" },
      { id: "rm", label: "Electric motor", sub: "Above the gearbox", col: 1, row: 0, kind: "motor" },
      { id: "eng", label: "V12", sub: "6.5 litres", col: 1, row: 1, kind: "engine" },
      { id: "fm", label: "Two motors", sub: "Axial flux, front", col: 1, row: 2, kind: "motor" },
      { id: "box", label: "8-speed DCT", sub: "Transverse", col: 2, row: 1, kind: "gearbox" },
      { id: "rear", label: "Rear axle", col: 3, row: 1, kind: "axle" },
      { id: "front", label: "Front axle", sub: "Torque vectoring", col: 3, row: 2, kind: "axle" },
    ],
    edges: [
      { from: "bat", to: "rm", kind: "elec" },
      { from: "bat", to: "fm", kind: "elec" },
      { from: "rm", to: "box", kind: "mech" },
      { from: "eng", to: "box", kind: "mech" },
      { from: "box", to: "rear", kind: "mech" },
      { from: "fm", to: "front", kind: "mech" },
    ],
    source: { label: "Battery capacity: SlashGear", url: "https://www.slashgear.com/1260337/lamborghini-revuelto-best-features-2024-supercar-hybrid" },
  },
  {
    slug: "ferrari-296-gtb",
    summary: "One motor between the V6 and the gearbox, and a battery large enough for 25 km on electricity alone.",
    rows: 2,
    nodes: [
      { id: "bat", label: "Battery", sub: "7.45 kWh, plug-in", col: 0, row: 0, kind: "battery" },
      { id: "mot", label: "Electric motor", sub: "Between engine and gearbox", col: 1, row: 0, kind: "motor" },
      { id: "eng", label: "120° V6", sub: "Twin-turbo, 2,992 cc", col: 1, row: 1, kind: "engine" },
      { id: "box", label: "8-speed F1 DCT", col: 2, row: 1, kind: "gearbox" },
      { id: "rear", label: "Rear axle", col: 3, row: 1, kind: "axle" },
    ],
    edges: [
      { from: "bat", to: "mot", kind: "elec" },
      { from: "mot", to: "box", kind: "mech" },
      { from: "eng", to: "box", kind: "mech" },
      { from: "box", to: "rear", kind: "mech" },
    ],
    split: [
      { label: "V6", value: 663 },
      { label: "Electric motor", value: 167 },
    ],
  },
];

const BOX_W = 128;
const BOX_H = 46;
const COL_W = 168;
const ROW_H = 66;

function Flow({ s }: { s: System }) {
  const W = COL_W * 3 + BOX_W + 8;
  const H = ROW_H * (s.rows - 1) + BOX_H + 8;
  const pos = (n: FlowNode) => ({ x: 4 + n.col * COL_W, y: 4 + n.row * ROW_H });
  const byId = Object.fromEntries(s.nodes.map((n) => [n.id, n]));
  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="min-w-[34rem] w-full" role="img" aria-label="Power-flow diagram">
        {s.edges.map((e) => {
          const a = pos(byId[e.from]);
          const b = pos(byId[e.to]);
          const x1 = a.x + BOX_W;
          const y1 = a.y + BOX_H / 2;
          const x2 = b.x;
          const y2 = b.y + BOX_H / 2;
          const same = byId[e.from].col === byId[e.to].col;
          const d = same
            ? `M${a.x + BOX_W / 2} ${a.y + (b.y > a.y ? BOX_H : 0)} L${b.x + BOX_W / 2} ${b.y + (b.y > a.y ? 0 : BOX_H)}`
            : `M${x1} ${y1} C ${x1 + 22} ${y1}, ${x2 - 22} ${y2}, ${x2} ${y2}`;
          return (
            <path
              key={e.from + e.to}
              d={d}
              fill="none"
              stroke={e.kind === "mech" ? "var(--color-silver)" : "var(--color-bronze-hi)"}
              strokeOpacity={e.kind === "mech" ? 0.6 : 0.9}
              strokeWidth={e.kind === "mech" ? 1.6 : 1.2}
              strokeDasharray={e.kind === "mech" ? undefined : e.kind === "boost" ? "2 4" : "5 5"}
              className={e.kind === "mech" ? undefined : "flow-elec"}
            />
          );
        })}
        {s.nodes.map((n) => {
          const p = pos(n);
          const isElec = n.kind === "battery" || n.kind === "motor" || n.kind === "boost";
          return (
            <g key={n.id} transform={`translate(${p.x} ${p.y})`}>
              <rect width={BOX_W} height={BOX_H} fill="var(--color-carbon)" stroke={isElec ? "var(--color-bronze)" : "var(--color-gunmetal)"} strokeWidth="1" />
              <text x="10" y={n.sub ? 19 : 28} fontSize="12" fontWeight="600" fill="var(--color-platinum)">
                {n.label}
              </text>
              {n.sub ? (
                <text x="10" y="35" fontSize="9.5" fill="var(--color-steel)">
                  {n.sub}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>
      <style>{`@media (prefers-reduced-motion: no-preference){.flow-elec{animation:flowe 1.2s linear infinite}}@keyframes flowe{to{stroke-dashoffset:-20}}`}</style>
    </div>
  );
}

export function HybridSystems() {
  return (
    <div className="space-y-px bg-gunmetal">
      {systems.map((s) => {
        const v = getVehicle(s.slug)!;
        const total = s.split?.reduce((a, b) => a + b.value, 0);
        return (
          <article key={s.slug} className="grid gap-8 bg-void p-5 md:p-8 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="text-xs text-steel">{v.make}</p>
              <h3>
                <Link href={`/collection/${v.slug}`} className="wd-expanded text-2xl font-bold uppercase text-platinum hover:text-bronze-hi">
                  {v.model}
                </Link>
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-silver">{s.summary}</p>
              <p className="mt-5 text-sm text-platinum">
                <span className="wd-condensed tabular text-4xl font-light">{fmtInt(v.specs.powerPs)}</span>
                <span className="ml-1 text-silver">{v.make === "Ferrari" || v.make === "Lamborghini" ? "cv" : "PS"} combined</span>
              </p>
              {s.split && total ? (
                <div className="mt-5">
                  <div className="flex h-2 w-full overflow-hidden" role="img" aria-label={s.split.map((x) => `${x.label} ${x.value} cv`).join(", ")}>
                    {s.split.map((x, i) => (
                      <span key={x.label} className={i ? "bg-bronze" : "bg-silver/60"} style={{ width: `${(x.value / total) * 100}%` }} />
                    ))}
                  </div>
                  <div className="mt-2 flex justify-between text-[0.6875rem] text-steel">
                    {s.split.map((x) => (
                      <span key={x.label}>
                        {x.label} <span className="tabular text-silver">{x.value} cv</span>
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
              {s.source ? (
                <a href={s.source.url} target="_blank" rel="noopener noreferrer" className="link-line mt-5 inline-block text-[0.6875rem] text-steel hover:text-silver">
                  {s.source.label}
                </a>
              ) : null}
            </div>
            <div className="min-w-0 lg:col-span-8">
              <Flow s={s} />
              <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[0.6875rem] text-steel">
                <span><span className="mr-2 inline-block h-px w-5 align-middle bg-silver/60" />Mechanical drive</span>
                <span><span className="mr-2 inline-block w-5 align-middle border-t border-dashed border-bronze-hi" />Electrical energy</span>
                <span>Shows how power flows, not where parts sit.</span>
              </p>
            </div>
          </article>
        );
      })}
    </div>
  );
}
