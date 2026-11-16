"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { vehicles, getVehicle } from "@/content/vehicles";
import { contactSchema, issuesToErrors, topicLabels, type FieldErrors } from "@/lib/inquiry";
import { submitInquiry, type SubmitResult } from "@/lib/submit";
import { DirectContact, Field, SuccessPanel, describe } from "./Field";

type Topic = "purchase" | "sourcing" | "viewing" | "service" | "other";
type Values = { topic: Topic | ""; vehicle: string; name: string; email: string; phone: string; message: string; consent: boolean; company: string };
const ORDER = ["topic", "vehicle", "name", "email", "phone", "message", "consent"];
const topics = Object.keys(topicLabels) as Topic[];

function ContactInner({ initial }: { initial: Pick<Values, "topic" | "vehicle" | "message"> }) {
  const empty: Values = { ...initial, name: "", email: "", phone: "", consent: false, company: "" };
  const [values, setValues] = useState<Values>(empty);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<"idle" | "sending">("idle");
  const [result, setResult] = useState<SubmitResult | null>(null);
  const startedAt = useRef(0);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const payload = () => ({ kind: "contact" as const, ...values, startedAt: startedAt.current });
  const validate = () => {
    const parsed = contactSchema.safeParse(payload());
    return parsed.success ? {} : issuesToErrors(parsed.error.issues);
  };
  const set = <K extends keyof Values>(k: K, v: Values[K]) => {
    setValues((s) => ({ ...s, [k]: v }));
    if (errors[k as string]) setErrors((e) => ({ ...e, [k]: "" }));
  };
  const blur = (k: string) => {
    setTouched((t) => ({ ...t, [k]: true }));
    const all = validate();
    setErrors((e) => ({ ...e, [k]: all[k] ?? "" }));
  };
  const err = (k: string) => (touched[k] ? errors[k] || undefined : undefined);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const all = validate();
    setTouched(Object.fromEntries(ORDER.map((k) => [k, true])));
    setErrors(all);
    const first = ORDER.find((k) => all[k]);
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setStatus("sending");
    const r = await submitInquiry(payload());
    setStatus("idle");
    setResult(r);
    if (!r.ok && r.fields) setErrors(r.fields);
  };

  if (result?.ok) {
    const v = getVehicle(values.vehicle);
    return (
      <SuccessPanel
        title="Message sent"
        reference={result.reference}
        channel={result.channel}
        lines={[`Topic: ${topicLabels[values.topic] ?? ""}`, ...(v ? [`Car: ${v.name}`] : []), `We will reply to ${values.email}.`]}
        onReset={() => {
          setResult(null);
          setValues({ ...empty, topic: values.topic, vehicle: values.vehicle, message: "" });
          setTouched({});
          setErrors({});
          startedAt.current = Date.now();
        }}
      />
    );
  }

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} className="space-y-8">
      <div className="grid gap-8 sm:grid-cols-2">
        <Field id="topic" label="What is it about?" error={err("topic")}>
          <select {...describe("topic", err("topic"))} value={values.topic} onChange={(e) => set("topic", e.target.value as Topic)} onBlur={() => blur("topic")} className="field-input">
            <option value="">Choose a topic</option>
            {topics.map((t) => (
              <option key={t} value={t}>
                {topicLabels[t]}
              </option>
            ))}
          </select>
        </Field>
        <Field id="vehicle" label="Car" optional error={err("vehicle")}>
          <select {...describe("vehicle", err("vehicle"))} value={values.vehicle} onChange={(e) => set("vehicle", e.target.value)} className="field-input">
            <option value="">No particular car</option>
            {vehicles.map((x) => (
              <option key={x.slug} value={x.slug}>
                {x.name}
              </option>
            ))}
          </select>
        </Field>
        <Field id="name" label="Full name" error={err("name")} className="sm:col-span-2">
          <input type="text" autoComplete="name" {...describe("name", err("name"))} value={values.name} onChange={(e) => set("name", e.target.value)} onBlur={() => blur("name")} className="field-input" />
        </Field>
        <Field id="email" label="Email" error={err("email")}>
          <input type="email" inputMode="email" autoComplete="email" {...describe("email", err("email"))} value={values.email} onChange={(e) => set("email", e.target.value)} onBlur={() => blur("email")} className="field-input" />
        </Field>
        <Field id="phone" label="Phone" optional hint="Include the country code" error={err("phone")}>
          <input type="tel" inputMode="tel" autoComplete="tel" {...describe("phone", err("phone"), "Include the country code")} value={values.phone} onChange={(e) => set("phone", e.target.value)} onBlur={() => blur("phone")} className="field-input" />
        </Field>
      </div>
      <Field id="message" label="Message" error={err("message")}>
        <textarea {...describe("message", err("message"))} rows={6} value={values.message} onChange={(e) => set("message", e.target.value)} onBlur={() => blur("message")} className="field-input resize-y" />
      </Field>

      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="contact-company">Company</label>
        <input id="contact-company" name="company" tabIndex={-1} autoComplete="off" value={values.company} onChange={(e) => set("company", e.target.value)} />
      </div>

      <div>
        <label className="flex items-start gap-3 text-sm text-silver">
          <input
            type="checkbox"
            name="consent"
            checked={values.consent}
            onChange={(e) => {
              set("consent", e.target.checked);
              setTouched((t) => ({ ...t, consent: true }));
            }}
            aria-invalid={err("consent") ? true : undefined}
            aria-describedby={err("consent") ? "consent-error" : undefined}
            className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--color-bronze)]"
          />
          <span>
            You may contact me about this message, as set out in the{" "}
            <Link href="/privacy" className="link-line text-platinum">
              privacy policy
            </Link>
            .
          </span>
        </label>
        {err("consent") ? (
          <p id="consent-error" className="mt-1.5 text-xs text-alert">
            {err("consent")}
          </p>
        ) : null}
      </div>

      {result && !result.ok ? <DirectContact message={result.error} /> : null}

      <button type="submit" className="btn btn-primary" disabled={status === "sending"} aria-disabled={status === "sending"}>
        {status === "sending" ? "Sending" : "Send message"}
      </button>
    </form>
  );
}

function FromQuery() {
  const p = useSearchParams();
  const vehicle = vehicles.some((v) => v.slug === p.get("vehicle")) ? (p.get("vehicle") as string) : "";
  const t = p.get("topic") as Topic | null;
  const topic: Values["topic"] = t && topics.includes(t) ? t : "";
  const message = (p.get("message") ?? "").slice(0, 2000);
  return <ContactInner key={vehicle + topic + message} initial={{ vehicle, topic, message }} />;
}

/** General enquiry form. `?vehicle=slug&topic=purchase&message=…` prefills it. */
export function ContactForm() {
  return (
    <Suspense fallback={<ContactInner initial={{ vehicle: "", topic: "", message: "" }} />}>
      <FromQuery />
    </Suspense>
  );
}
