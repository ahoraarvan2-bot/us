import { z } from "zod";
import { vehicles } from "@/content/vehicles";

const slugs = vehicles.map((v) => v.slug) as [string, ...string[]];
const DAY = 24 * 60 * 60 * 1000;

/** YYYY-MM-DD in UTC, so the check is the same on the server and in any browser. */
export function isoDay(d: Date) {
  return d.toISOString().slice(0, 10);
}

export function dateWindow() {
  const now = Date.now();
  // one day of slack either side covers every timezone
  return { min: isoDay(new Date(now - DAY)), max: isoDay(new Date(now + 180 * DAY)) };
}

const base = {
  name: z.string().trim().min(2, "Enter your full name.").max(120, "Use 120 characters or fewer."),
  email: z.string().trim().max(200).pipe(z.email("Enter an email address like name@domain.com.")),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[\d\s().-]{7,24}$/, "Enter a phone number, including the country code."),
  message: z.string().trim().max(2000, "Keep the message under 2,000 characters.").optional().default(""),
  consent: z.literal(true, "Confirm that we may contact you about this request."),
  // spam traps: a hidden field people never fill, and the time the form was opened
  company: z.string().max(0).optional().default(""),
  startedAt: z.number().int().optional(),
};

export const testDriveSchema = z
  .object({
    kind: z.literal("test-drive"),
    ...base,
    vehicle: z.enum(slugs, "Choose the car you would like to drive."),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a preferred date."),
    slot: z.enum(["morning", "afternoon", "evening"], "Choose a time of day."),
    location: z.enum(["showroom", "delivered"], "Choose where you would like to meet."),
    spec: z.string().trim().max(300).optional().default(""),
  })
  .superRefine((d, ctx) => {
    const { min, max } = dateWindow();
    if (d.date < min) ctx.addIssue({ code: "custom", path: ["date"], message: "Choose a date from today onwards." });
    if (d.date > max) ctx.addIssue({ code: "custom", path: ["date"], message: "We schedule drives up to six months ahead." });
  });

export const contactSchema = z.object({
  kind: z.literal("contact"),
  ...base,
  phone: base.phone.optional().or(z.literal("")),
  topic: z.enum(["purchase", "sourcing", "viewing", "service", "other"], "Choose what your message is about."),
  vehicle: z.enum(slugs).optional().or(z.literal("")),
  message: z.string().trim().min(10, "Tell us a little more, at least 10 characters.").max(2000, "Keep the message under 2,000 characters."),
});

export const inquirySchema = z.discriminatedUnion("kind", [testDriveSchema, contactSchema]);

export type TestDriveInput = z.input<typeof testDriveSchema>;
export type ContactInput = z.input<typeof contactSchema>;
export type Inquiry = z.output<typeof inquirySchema>;

export type FieldErrors = Record<string, string>;

export function issuesToErrors(issues: readonly { path: PropertyKey[]; message: string }[]): FieldErrors {
  const out: FieldErrors = {};
  for (const i of issues) {
    const key = String(i.path[0] ?? "form");
    if (!out[key]) out[key] = i.message;
  }
  return out;
}

export const slotLabels: Record<string, string> = {
  morning: "Morning, 09:00–12:00",
  afternoon: "Afternoon, 12:00–16:00",
  evening: "Evening, 16:00–19:00",
};

export const topicLabels: Record<string, string> = {
  purchase: "Buying a car from the collection",
  sourcing: "Sourcing a specific car",
  viewing: "Arranging a private viewing",
  service: "Aftercare and servicing",
  other: "Something else",
};
