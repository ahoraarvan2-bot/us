import type { Vehicle } from "@/content/vehicles";
import { fmtInt, hpFromKw, topSpeed } from "@/lib/format";

type Row = { label: string; value?: string; note?: string };

export function SpecTable({ v }: { v: Vehicle }) {
  const s = v.specs;
  const mm = (n?: number) => (n ? `${fmtInt(n)} mm` : undefined);
  const groups: { title: string; rows: Row[] }[] = [
    {
      title: "Engine and performance",
      rows: [
        { label: "Engine", value: v.engine },
        {
          label: "Power",
          value: `${fmtInt(s.powerKw)} kW / ${fmtInt(s.powerPs)} PS / ${fmtInt(hpFromKw(s.powerKw))} hp`,
          note: [s.powerRpm ? `at ${s.powerRpm}` : "", s.powerNote ?? ""].filter(Boolean).join(". "),
        },
        {
          label: "Torque",
          value: `${fmtInt(s.torqueNm)} Nm`,
          note: [s.torqueRpm ? `at ${s.torqueRpm}` : "", s.torqueNote ?? ""].filter(Boolean).join(". "),
        },
        { label: "0–100 km/h", value: `${s.zeroTo100.toFixed(1)} s` },
        { label: "0–200 km/h", value: s.zeroTo200 },
        { label: "Top speed", value: topSpeed(v), note: s.topSpeedExtra },
      ],
    },
    {
      title: "Drivetrain and chassis",
      rows: [
        { label: "Transmission", value: s.transmission },
        { label: "Drive", value: s.drive },
        { label: "Layout", value: v.layout },
        { label: "Brakes", value: s.brakes },
        { label: "Tyres", value: s.tyres },
      ],
    },
    {
      title: "Dimensions and weight",
      rows: [
        { label: "Length", value: mm(s.lengthMm) },
        { label: "Width", value: mm(s.widthMm) },
        { label: "Height", value: mm(s.heightMm) },
        { label: "Wheelbase", value: mm(s.wheelbaseMm) },
        { label: "Weight", value: s.weightKg ? `${fmtInt(s.weightKg)} kg` : s.weightNote, note: s.weightKg ? s.weightNote : undefined },
      ],
    },
    {
      title: "Further detail",
      rows: [{ label: "Battery", value: s.battery }, ...(s.other ?? []).map((o) => ({ label: o.label, value: o.value }))],
    },
  ];

  return (
    <div className="grid gap-x-16 gap-y-12 lg:grid-cols-2">
      {groups.map((g) => {
        const rows = g.rows.filter((r) => r.value);
        if (!rows.length) return null;
        return (
          <div key={g.title}>
            <h3 className="wd-wide mb-3 text-sm font-semibold text-platinum">{g.title}</h3>
            <table className="w-full text-left text-sm">
              <caption className="sr-only">
                {v.name}: {g.title}
              </caption>
              <tbody className="border-t border-gunmetal">
                {rows.map((r) => (
                  <tr key={r.label} className="border-b border-gunmetal align-top">
                    <th scope="row" className="w-2/5 py-3.5 pr-4 font-normal text-steel">
                      {r.label}
                    </th>
                    <td className="py-3.5 text-platinum">
                      <span className="tabular">{r.value}</span>
                      {r.note ? <span className="mt-0.5 block text-xs text-steel">{r.note}</span> : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}
