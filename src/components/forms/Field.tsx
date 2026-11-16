"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { site } from "@/content/site";
import { CopyButton } from "@/components/ui/CopyButton";
import { cx } from "@/lib/format";

export function Field({
  id,
  label,
  hint,
  error,
  optional,
  children,
  className,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cx("flex flex-col", className)}>
      <label htmlFor={id} className="text-xs text-steel">
        {label}
        {optional ? <span className="ml-1 text-steel/70">(optional)</span> : null}
      </label>
      {children}
      {hint && !error ? (
        <p id={`${id}-hint`} className="mt-1.5 text-[0.6875rem] text-steel">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** aria wiring for an input inside <Field>. */
export function describe(id: string, error?: string, hint?: string) {
  return {
    id,
    name: id,
    "aria-invalid": error ? (true as const) : undefined,
    "aria-describedby": error ? `${id}-error` : hint ? `${id}-hint` : undefined,
  };
}

export function ChoiceGroup<T extends string>({
  name,
  legend,
  options,
  value,
  onChange,
  error,
}: {
  name: string;
  legend: string;
  options: { value: T; label: string; note?: string }[];
  value: T | "";
  onChange: (v: T) => void;
  error?: string;
}) {
  return (
    <fieldset aria-describedby={error ? `${name}-error` : undefined}>
      <legend className="text-xs text-steel">{legend}</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((o) => {
          const id = `${name}-${o.value}`;
          const on = value === o.value;
          return (
            <label
              key={o.value}
              htmlFor={id}
              className={cx(
                "relative flex min-h-11 cursor-pointer flex-col justify-center border px-4 py-2 text-sm transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-bronze",
                on ? "border-bronze bg-bronze/10 text-platinum" : "border-gunmetal text-silver hover:border-steel hover:text-platinum"
              )}
            >
              <input id={id} type="radio" name={name} value={o.value} checked={on} onChange={() => onChange(o.value)} className="sr-only" />
              {o.label}
              {o.note ? <span className="text-[0.6875rem] text-steel">{o.note}</span> : null}
            </label>
          );
        })}
      </div>
      {error ? (
        <p id={`${name}-error`} className="mt-1.5 text-xs text-alert">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}

/** Shown when a request could not be sent: the direct ways to reach the showroom. */
export function DirectContact({ message }: { message: string }) {
  const c = site.contact;
  return (
    <div role="alert" className="border border-alert/50 bg-alert/[0.06] p-5">
      <p className="text-sm text-platinum">{message}</p>
      <p className="mt-2 text-sm text-silver">Your details are still in the form. You can also reach the showroom directly:</p>
      <dl className="mt-4 space-y-3 text-sm">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <dt className="w-14 text-steel">Phone</dt>
          <dd className="tabular text-platinum">{c.phone}</dd>
          <CopyButton value={c.phone} label="phone number" />
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <dt className="w-14 text-steel">Email</dt>
          <dd className="break-all text-platinum">{c.email}</dd>
          <CopyButton value={c.email} label="email address" />
        </div>
      </dl>
    </div>
  );
}

export function SuccessPanel({
  title,
  reference,
  lines,
  channel,
  onReset,
}: {
  title: string;
  reference: string;
  lines: string[];
  channel: "server" | "preview";
  onReset: () => void;
}) {
  return (
    <div role="status" className="border border-gunmetal bg-void p-6 md:p-10">
      <p className="text-xs uppercase tracking-[0.18em] text-ok">Received</p>
      <p className="wd-expanded mt-3 text-[clamp(1.6rem,3.4vw,2.6rem)] font-bold uppercase leading-none">{title}</p>
      <p className="mt-6 text-sm text-silver">
        Your reference is <span className="tabular font-semibold text-platinum">{reference}</span>. Keep it for any follow-up.
      </p>
      <ul className="mt-6 space-y-2 border-t border-gunmetal pt-6 text-sm text-silver">
        {lines.map((l) => (
          <li key={l}>{l}</li>
        ))}
      </ul>
      <p className="mt-6 text-xs leading-relaxed text-steel">
        {channel === "preview"
          ? "This preview saved the request to its own database, where the preview's owner can read it."
          : site.concept
            ? "This is a concept site: your request was recorded, but ONYX Motor House is a fictional brand and nobody will call."
            : "A specialist will reply by email or phone within one working day."}
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/collection" className="btn btn-primary btn-sm">
          Back to the collection
        </Link>
        <button type="button" onClick={onReset} className="btn btn-ghost btn-sm">
          Make another request
        </button>
      </div>
    </div>
  );
}
