"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { vehicles, getVehicle } from "@/content/vehicles";
import { testDriveSchema, issuesToErrors, slotLabels, type FieldErrors } from "@/lib/inquiry";
import { submitInquiry, type SubmitResult } from "@/lib/submit";
import { SmartImage } from "@/components/media/SmartImage";
import { ChoiceGroup, DirectContact, Field, SuccessPanel, describe } from "./Field";
import { fmtInt } from "@/lib/format";
import Link from "next/link";

type Values = {
  vehicle: string;
  date: string;
  slot: "" | "morning" | "afternoon" | "evening";
  location: "" | "showroom" | "delivered";
  name: string;
  email: string;
  phone: string;
  message: string;
  spec: string;
  consent: boolean;
  company: string;
};

const ORDER = ["vehicle", "date", "slot", "location", "name", "email", "phone", "message", "consent"];

function localDay(offsetDays = 0) {
  const d = new Date(Date.now() + offsetDays * 86400000);
  return d.toLocaleDateString("en-CA"); // YYYY-MM-DD in the visitor's time zone
}

function TestDriveInner({ initialVehicle, initialSpec }: { initialVehicle: string; initialSpec: string }) {
  const empty: Values = {
    vehicle: initialVehicle,
    date: "",
    slot: "",
    location: "",
    name: "",
    email: "",
    phone: "",
    message: "",
    spec: initialSpec,
    consent: false,
    company: "",
  };
  const [values, setValues] = useState<Values>(empty);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<"idle" | "sending">("idle");
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [window_, setWindow] = useState<{ min?: string; max?: string }>({});
  const startedAt = useRef(0);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
    setWindow({ min: localDay(0), max: localDay(180) });
  }, []);

  const payload = () => ({ kind: "test-drive" as const, ...values, startedAt: startedAt.current });

  const validate = () => {
    const parsed = testDriveSchema.safeParse(payload());
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

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const all = validate();
    setTouched(Object.fromEntries(ORDER.map((k) => [k, true])));
    setErrors(all);
    const first = ORDER.find((k) => all[k]);
    if (first) {
      const el = formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`);
      el?.focus();
      return;
    }
    setStatus("sending");
    const r = await submitInquiry(payload());
    setStatus("idle");
    setResult(r);
    if (!r.ok && r.fields) setErrors(r.fields);
  };

  const v = getVehicle(values.vehicle);
  const err = (k: string) => (touched[k] ? errors[k] || undefined : undefined);

  if (result?.ok) {
    return (
      <SuccessPanel
        title="Test drive requested"
        reference={result.reference}
        channel={result.channel}
        lines={[
          `Car: ${v?.name ?? values.vehicle}`,
          `Preferred date: ${new Date(values.date + "T12:00:00").toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}, ${slotLabels[values.slot] ?? ""}`,
          values.location === "showroom" ? "Where: at the showroom" : "Where: brought to you",
          `We will confirm by email to ${values.email}.`,
        ]}
        onReset={() => {
          setResult(null);
          setValues({ ...empty, vehicle: values.vehicle });
          setTouched({});
          setErrors({});
          startedAt.current = Date.now();
        }}
      />
    );
  }

  return (
    <div className="grid gap-12 lg:grid-cols-12">
      <form ref={formRef} noValidate onSubmit={onSubmit} className="space-y-8 lg:col-span-7" aria-describedby="td-note">
        <Field id="vehicle" label="Car" error={err("vehicle")}>
          <select {...describe("vehicle", err("vehicle"))} value={values.vehicle} onChange={(e) => set("vehicle", e.target.value)} onBlur={() => blur("vehicle")} className="field-input">
            <option value="">Choose a car</option>
            {vehicles.map((x) => (
              <option key={x.slug} value={x.slug}>
                {x.name}
              </option>
            ))}
          </select>
        </Field>

        <div className="grid gap-8 sm:grid-cols-2">
          <Field id="date" label="Preferred date" hint="Up to six months ahead" error={err("date")}>
            <input
              type="date"
              {...describe("date", err("date"), "Up to six months ahead")}
              min={window_.min}
              max={window_.max}
              value={values.date}
              onChange={(e) => set("date", e.target.value)}
              onBlur={() => blur("date")}
              className="field-input"
            />
          </Field>
          <ChoiceGroup
            name="slot"
            legend="Time of day"
            value={values.slot}
            onChange={(x) => {
              set("slot", x);
              setTouched((t) => ({ ...t, slot: true }));
            }}
            error={err("slot")}
            options={[
              { value: "morning", label: "Morning", note: "09:00–12:00" },
              { value: "afternoon", label: "Afternoon", note: "12:00–16:00" },
              { value: "evening", label: "Evening", note: "16:00–19:00" },
            ]}
          />
        </div>

        <ChoiceGroup
          name="location"
          legend="Where"
          value={values.location}
          onChange={(x) => {
            set("location", x);
            setTouched((t) => ({ ...t, location: true }));
          }}
          error={err("location")}
          options={[
            { value: "showroom", label: "At the showroom", note: "Mayfair, London" },
            { value: "delivered", label: "Bring the car to me", note: "Within the UK mainland" },
          ]}
        />

        <div className="grid gap-8 sm:grid-cols-2">
          <Field id="name" label="Full name" error={err("name")} className="sm:col-span-2">
            <input type="text" autoComplete="name" {...describe("name", err("name"))} value={values.name} onChange={(e) => set("name", e.target.value)} onBlur={() => blur("name")} className="field-input" />
          </Field>
          <Field id="email" label="Email" error={err("email")}>
            <input type="email" autoComplete="email" inputMode="email" {...describe("email", err("email"))} value={values.email} onChange={(e) => set("email", e.target.value)} onBlur={() => blur("email")} className="field-input" />
          </Field>
          <Field id="phone" label="Phone" hint="Include the country code" error={err("phone")}>
            <input type="tel" autoComplete="tel" inputMode="tel" {...describe("phone", err("phone"), "Include the country code")} value={values.phone} onChange={(e) => set("phone", e.target.value)} onBlur={() => blur("phone")} className="field-input" />
          </Field>
        </div>

        {values.spec ? (
          <Field id="spec" label="Specification you chose" optional>
            <input type="text" {...describe("spec")} value={values.spec} onChange={(e) => set("spec", e.target.value)} className="field-input" />
          </Field>
        ) : null}

        <Field id="message" label="Anything we should know" optional error={err("message")}>
          <textarea {...describe("message", err("message"))} rows={4} value={values.message} onChange={(e) => set("message", e.target.value)} onBlur={() => blur("message")} className="field-input resize-y" />
        </Field>

        {/* spam trap: people never see or fill this */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor="company">Company</label>
          <input id="company" name="company" tabIndex={-1} autoComplete="off" value={values.company} onChange={(e) => set("company", e.target.value)} />
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
              You may contact me about this request. We use your details only to arrange the drive, as set out in our{" "}
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

        <div className="flex flex-wrap items-center gap-4">
          <button type="submit" className="btn btn-primary" disabled={status === "sending"} aria-disabled={status === "sending"}>
            {status === "sending" ? "Sending request" : "Request test drive"}
          </button>
          <p id="td-note" className="text-xs text-steel">
            We confirm every drive by email before the day.
          </p>
        </div>
      </form>

      <aside className="lg:col-span-4 lg:col-start-9" aria-label="Selected car">
        <div className="lg:sticky lg:top-28">
          {v ? (
            <div>
              <div className="relative aspect-[16/10] overflow-hidden">
                <SmartImage image={v.media.hero} sizes="(min-width: 1024px) 30vw, 100vw" fallbackLabel={v.name} />
              </div>
              <p className="mt-5 text-xs text-steel">{v.make}</p>
              <p className="wd-expanded text-2xl font-bold uppercase leading-none">{v.model}</p>
              <dl className="tabular mt-5 grid grid-cols-3 gap-3 border-t border-gunmetal pt-4">
                <div>
                  <dt className="text-[0.6875rem] text-steel">Power</dt>
                  <dd className="wd-condensed text-xl">{fmtInt(v.specs.powerPs)} PS</dd>
                </div>
                <div>
                  <dt className="text-[0.6875rem] text-steel">0–100</dt>
                  <dd className="wd-condensed text-xl">{v.specs.zeroTo100.toFixed(1)} s</dd>
                </div>
                <div>
                  <dt className="text-[0.6875rem] text-steel">Gearbox</dt>
                  <dd className="text-xs leading-snug">{v.specs.transmission.replace(/ with .*/, "")}</dd>
                </div>
              </dl>
              <Link href={`/collection/${v.slug}`} className="link-line mt-5 inline-block text-xs font-semibold uppercase tracking-[0.16em] text-bronze-hi">
                Full specification
              </Link>
            </div>
          ) : (
            <div className="border border-gunmetal p-6">
              <p className="wd-wide text-sm font-semibold">Choose a car</p>
              <p className="mt-2 text-sm text-silver">Its details appear here. Not sure yet? Choose the closest and tell us in the message.</p>
            </div>
          )}
          <ol className="mt-10 space-y-4 border-t border-gunmetal pt-6 text-sm text-silver">
            <li>
              <span className="tabular mr-3 text-bronze-hi">1</span>We confirm the date by email.
            </li>
            <li>
              <span className="tabular mr-3 text-bronze-hi">2</span>Bring your driving licence on the day.
            </li>
            <li>
              <span className="tabular mr-3 text-bronze-hi">3</span>A specialist rides with you for around an hour.
            </li>
          </ol>
        </div>
      </aside>
    </div>
  );
}

function FromQuery() {
  const p = useSearchParams();
  const asked = p.get("vehicle") ?? "";
  const vehicle = vehicles.some((v) => v.slug === asked) ? asked : "";
  const spec = (p.get("spec") ?? "").slice(0, 300);
  return <TestDriveInner key={vehicle + spec} initialVehicle={vehicle} initialSpec={spec} />;
}

/** Test-drive request form. `?vehicle=slug&spec=…` preselects the car and carries a configuration. */
export function TestDriveForm() {
  return (
    <Suspense fallback={<TestDriveInner initialVehicle="" initialSpec="" />}>
      <FromQuery />
    </Suspense>
  );
}
