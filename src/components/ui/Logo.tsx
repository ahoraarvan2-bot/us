import { cx } from "@/lib/format";

/** A brilliant-cut stone seen from above: the "X" of ONYX drawn as facets. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={cx("shrink-0", className)} fill="none" stroke="currentColor">
      <path d="M16 1.5 30.5 16 16 30.5 1.5 16Z" strokeWidth="1.4" />
      <path d="M16 8.75 23.25 16 16 23.25 8.75 16Z" strokeWidth="1" />
      <path d="M16 1.5v7.25M30.5 16h-7.25M16 30.5v-7.25M1.5 16h7.25" strokeWidth="0.8" opacity="0.7" />
    </svg>
  );
}

export function Logo({ className, full = false }: { className?: string; full?: boolean }) {
  return (
    <span className={cx("inline-flex items-center gap-3 text-platinum", className)}>
      <LogoMark className="h-7 w-7" />
      <span className="flex flex-col leading-none">
        <span className="wd-expanded text-[1.05rem] font-bold tracking-[0.28em]">ONYX</span>
        {full ? <span className="mt-1.5 text-[0.56rem] font-medium tracking-[0.42em] text-silver">MOTOR HOUSE</span> : null}
      </span>
    </span>
  );
}
