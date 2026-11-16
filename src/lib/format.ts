import type { Price, Vehicle } from "@/content/vehicles";

const intFmt = new Intl.NumberFormat("en-GB");
const usdFmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export const fmtInt = (n: number) => intFmt.format(n);
export const fmtUsd = (n: number) => usdFmt.format(n);
export const fmtSec = (n: number) => n.toFixed(1);

export function priceShort(p: Price): string {
  return p.kind === "msrp" ? `From ${fmtUsd(p.amount)}` : p.label;
}

export function topSpeed(v: Vehicle): string {
  const s = v.specs;
  const base = `${fmtInt(s.topSpeedKmh)} km/h`;
  if (s.topSpeedNote === "over") return `Over ${base}`;
  if (s.topSpeedNote === "limited") return `${base} (limited)`;
  return base;
}

export function topSpeedPrefix(v: Vehicle): string {
  return v.specs.topSpeedNote === "over" ? ">" : "";
}

export function hpFromKw(kw: number) {
  return Math.round(kw * 1.341);
}

export function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}
