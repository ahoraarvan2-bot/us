"use client";

import { useRef, useState } from "react";
import { cx } from "@/lib/format";

/** Copies a value; falls back to selecting it where the clipboard is refused. */
export function CopyButton({ value, label, className }: { value: string; label: string; className?: string }) {
  const [state, setState] = useState<"idle" | "copied" | "select">("idle");
  const timer = useRef<number | undefined>(undefined);
  const copy = async () => {
    window.clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(value);
      setState("copied");
    } catch {
      setState("select");
    }
    timer.current = window.setTimeout(() => setState("idle"), 2400);
  };
  return (
    <span className="inline-flex items-center gap-2">
      {state === "select" ? (
        <input
          readOnly
          value={value}
          aria-label={label}
          onFocus={(e) => e.currentTarget.select()}
          autoFocus
          className="w-56 max-w-full border border-gunmetal bg-transparent px-2 py-1 text-xs text-platinum"
        />
      ) : null}
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy ${label}`}
        className={cx("min-h-8 border border-gunmetal px-2.5 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-silver transition-colors hover:border-steel hover:text-platinum", className)}
      >
        {state === "copied" ? "Copied" : "Copy"}
      </button>
      <span className="sr-only" aria-live="polite">
        {state === "copied" ? `${label} copied` : ""}
      </span>
    </span>
  );
}
