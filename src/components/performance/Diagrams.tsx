/**
 * Engineering illustrations for the Performance page. They explain principles;
 * they are not drawings of any particular car.
 */

const stroke = "var(--color-silver)";
const faint = "var(--color-gunmetal)";
const accent = "var(--color-bronze-hi)";

/** Cylinder bank angles seen from the front of the engine. */
export function EngineLayouts() {
  const layouts = [
    { name: "Inline six", note: "BMW M4 Competition", banks: [0] },
    { name: "Flat six, 180°", note: "Porsche 911 Turbo S", banks: [-90, 90] },
    { name: "V6, 120°", note: "Ferrari 296 GTB", banks: [-60, 60] },
    { name: "V8, 90°", note: "458 Spider, AMG GT 63, DB12, M5 CS", banks: [-45, 45] },
    { name: "V12, 60°", note: "Lamborghini Revuelto", banks: [-30, 30] },
  ];
  return (
    <ul className="grid grid-cols-2 gap-px bg-gunmetal sm:grid-cols-3 lg:grid-cols-5">
      {layouts.map((l) => (
        <li key={l.name} className="bg-void p-4">
          <svg viewBox="0 0 120 92" className="w-full" aria-hidden="true">
            <circle cx="60" cy="70" r="11" fill="none" stroke={faint} strokeWidth="1.2" />
            <circle cx="60" cy="70" r="2.2" fill={stroke} />
            {l.banks.map((a) => (
              <g key={a} transform={`rotate(${a} 60 70)`}>
                <line x1="60" y1="70" x2="60" y2="40" stroke={faint} strokeWidth="1" strokeDasharray="2 2" />
                <rect x="51" y="14" width="18" height="30" fill="none" stroke={stroke} strokeWidth="1.2" />
                <rect x="53" y="30" width="14" height="8" fill={accent} opacity="0.9" />
              </g>
            ))}
            {l.banks.length === 2 ? (
              <path
                d={`M ${60 + 22 * Math.sin((l.banks[0] * Math.PI) / 180)} ${70 - 22 * Math.cos((l.banks[0] * Math.PI) / 180)} A 22 22 0 0 1 ${60 + 22 * Math.sin((l.banks[1] * Math.PI) / 180)} ${70 - 22 * Math.cos((l.banks[1] * Math.PI) / 180)}`}
                fill="none"
                stroke={accent}
                strokeWidth="0.8"
              />
            ) : null}
          </svg>
          <p className="wd-wide mt-2 text-xs font-semibold text-platinum">{l.name}</p>
          <p className="mt-0.5 text-[0.6875rem] leading-snug text-steel">{l.note}</p>
        </li>
      ))}
    </ul>
  );
}

/** Air over an abstract low body: drag behind it, downforce on both axles. */
export function AirflowDiagram() {
  const body = "M30 150 C 60 148, 90 140, 140 128 C 190 104, 250 92, 300 94 C 360 96, 410 112, 450 126 C 470 132, 490 138, 500 150 Z";
  const lines = [0, 1, 2, 3, 4].map((i) => {
    const y = 120 - i * 16;
    const lift = 26 - i * 4;
    return `M0 ${y + 18} C 90 ${y + 16}, 150 ${y + 6 - lift / 2}, 240 ${y - lift} S 420 ${y - lift / 3}, 540 ${y + 4}`;
  });
  return (
    <figure className="border border-gunmetal bg-void p-4 md:p-6">
      <svg viewBox="0 0 540 200" className="w-full" role="img" aria-label="Illustration: airflow over a car body, with drag acting backwards and downforce pressing on both axles">
        <defs>
          <marker id="arrow-a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" fill={accent} />
          </marker>
          <marker id="arrow-s" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" fill={stroke} />
          </marker>
        </defs>
        {lines.map((d, i) => (
          <path key={i} d={d} fill="none" stroke={stroke} strokeOpacity={0.35 + i * 0.08} strokeWidth="1" className="flow-line" style={{ animationDelay: `${-i * 0.35}s` }} />
        ))}
        <path d={body} fill="var(--color-carbon)" stroke={stroke} strokeWidth="1.2" />
        <circle cx="130" cy="152" r="20" fill="var(--color-void)" stroke={stroke} strokeWidth="1.2" />
        <circle cx="400" cy="152" r="20" fill="var(--color-void)" stroke={stroke} strokeWidth="1.2" />
        <line x1="0" y1="173" x2="540" y2="173" stroke={faint} strokeWidth="1" />
        {/* downforce */}
        <line x1="130" y1="70" x2="130" y2="112" stroke={accent} strokeWidth="1.6" markerEnd="url(#arrow-a)" />
        <line x1="400" y1="62" x2="400" y2="104" stroke={accent} strokeWidth="1.6" markerEnd="url(#arrow-a)" />
        <text x="138" y="80" fontSize="11" fill={accent}>Downforce</text>
        <text x="408" y="72" fontSize="11" fill={accent}>Downforce</text>
        {/* drag */}
        <line x1="512" y1="140" x2="530" y2="140" stroke={stroke} strokeWidth="1.4" markerStart="url(#arrow-s)" />
        <text x="532" y="192" fontSize="11" fill={stroke} textAnchor="end">Drag acts backwards</text>
        <text x="8" y="192" fontSize="11" fill="var(--color-steel)">Direction of travel ←</text>
      </svg>
      <figcaption className="mt-3 text-xs text-steel">Illustration. Active elements change the balance between the two with speed and drive mode.</figcaption>
      <style>{`@media (prefers-reduced-motion: no-preference){.flow-line{stroke-dasharray:6 10;animation:flow 1.6s linear infinite}}@keyframes flow{to{stroke-dashoffset:-32}}`}</style>
    </figure>
  );
}

function TopCar({ rear, label, note }: { rear: number; label: string; note: string }) {
  const front = 14;
  return (
    <div>
      <svg viewBox="0 0 160 220" className="mx-auto w-full max-w-[12rem]" aria-hidden="true">
        <rect x="45" y="20" width="70" height="180" rx="26" fill="var(--color-carbon)" stroke={stroke} strokeWidth="1.2" />
        <rect x="56" y="70" width="48" height="56" rx="10" fill="none" stroke={faint} strokeWidth="1" />
        {[
          { x: 40, y: 52, a: front },
          { x: 120, y: 52, a: front },
          { x: 40, y: 166, a: rear },
          { x: 120, y: 166, a: rear },
        ].map((w, i) => (
          <rect key={i} x={w.x - 6} y={w.y - 16} width="12" height="32" rx="2" fill={i > 1 ? accent : stroke} transform={`rotate(${-w.a} ${w.x} ${w.y})`} />
        ))}
        <path d={rear < 0 ? "M80 10 C 30 40, 20 120, 60 210" : "M80 10 C 110 60, 120 140, 150 210"} fill="none" stroke={faint} strokeWidth="1" strokeDasharray="4 4" />
      </svg>
      <p className="wd-wide mt-3 text-center text-xs font-semibold text-platinum">{label}</p>
      <p className="mt-1 text-center text-[0.6875rem] text-steel">{note}</p>
    </div>
  );
}

/** Rear-axle steering: opposite phase at low speed, same phase at high speed. */
export function RearSteerDiagram() {
  return (
    <figure className="border border-gunmetal bg-void p-5 md:p-6">
      <div className="grid grid-cols-2 gap-6">
        <TopCar rear={-10} label="Low speed" note="Rear wheels turn against the fronts: a tighter turn" />
        <TopCar rear={8} label="High speed" note="Rear wheels turn with the fronts: a steadier lane change" />
      </div>
      <figcaption className="mt-4 text-xs text-steel">Illustration, seen from above. Steering angles exaggerated.</figcaption>
    </figure>
  );
}

/** A ventilated disc and caliper, with the heat a hard stop puts into it. */
export function BrakeDiagram() {
  const vents = Array.from({ length: 36 }, (_, i) => i * 10);
  return (
    <figure className="border border-gunmetal bg-void p-5 md:p-6">
      <svg viewBox="0 0 240 200" className="mx-auto w-full max-w-sm" role="img" aria-label="Illustration: a ventilated brake disc glowing with heat under a caliper">
        <defs>
          <radialGradient id="heat" cx="50%" cy="50%" r="50%">
            <stop offset="0.55" stopColor="#000" stopOpacity="0" />
            <stop offset="0.8" stopColor="#e2814a" stopOpacity="0.55" />
            <stop offset="1" stopColor="#ffcf8a" stopOpacity="0.15" />
          </radialGradient>
        </defs>
        <circle cx="120" cy="104" r="86" fill="var(--color-carbon)" stroke={stroke} strokeWidth="1.2" />
        <circle cx="120" cy="104" r="86" fill="url(#heat)" />
        {vents.map((a) => (
          <line key={a} x1="120" y1="34" x2="120" y2="22" stroke={faint} strokeWidth="1.4" transform={`rotate(${a} 120 104)`} />
        ))}
        <circle cx="120" cy="104" r="44" fill="var(--color-void)" stroke={stroke} strokeWidth="1.2" />
        {[0, 72, 144, 216, 288].map((a) => (
          <circle key={a} cx="120" cy="80" r="4" fill="none" stroke={stroke} strokeWidth="1" transform={`rotate(${a} 120 104)`} />
        ))}
        <path d="M60 30 Q 120 -2 180 30 L 170 46 Q 120 20 70 46 Z" fill={accent} opacity="0.92" />
        <text x="190" y="20" fontSize="10" fill={accent}>Caliper</text>
        <text x="4" y="196" fontSize="10" fill="var(--color-steel)">Disc temperature rises with every hard stop</text>
      </svg>
      <figcaption className="mt-3 text-xs text-steel">Illustration.</figcaption>
    </figure>
  );
}
