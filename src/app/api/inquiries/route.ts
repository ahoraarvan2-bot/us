import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { inquirySchema, issuesToErrors, slotLabels, topicLabels } from "@/lib/inquiry";
import { getVehicle } from "@/content/vehicles";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// --- simple per-IP rate limit (in memory; fine for a single server instance)
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 6;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) hits.clear();
  return list.length > MAX_PER_WINDOW;
}

function reference(kind: string) {
  return `${kind === "test-drive" ? "TD" : "CT"}-${randomBytes(3).toString("hex").toUpperCase()}`;
}

async function store(record: object) {
  const file = process.env.INQUIRY_STORE_PATH || path.join(process.cwd(), "data", "inquiries.jsonl");
  await mkdir(path.dirname(file), { recursive: true });
  await appendFile(file, JSON.stringify(record) + "\n", "utf8");
}

async function forwardWebhook(record: object) {
  const url = process.env.INQUIRY_WEBHOOK_URL;
  if (!url) return false;
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(record),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`Webhook answered ${res.status}`);
  return true;
}

async function forwardTelegram(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chat) return false;
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ chat_id: chat, text, disable_web_page_preview: true }),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`Telegram answered ${res.status}`);
  return true;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "local";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many requests from this connection. Wait a few minutes and try again, or call us." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "The request could not be read." }, { status: 400 });
  }

  const parsed = inquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Some details need attention.", fields: issuesToErrors(parsed.error.issues) },
      { status: 422 }
    );
  }
  const data = parsed.data;

  // Spam traps: silently accept, store nothing.
  const tooFast = typeof data.startedAt === "number" && Date.now() - data.startedAt < 2500;
  if (data.company || tooFast) {
    return NextResponse.json({ ok: true, reference: reference(data.kind), filtered: true }, { status: 201 });
  }

  const ref = reference(data.kind);
  const { company: _c, startedAt: _s, consent: _consent, ...fields } = data;
  void _c;
  void _s;
  void _consent;
  const record = { reference: ref, receivedAt: new Date().toISOString(), ...fields };

  const vehicleName = data.vehicle ? getVehicle(data.vehicle)?.name ?? data.vehicle : "Not specified";
  const lines =
    data.kind === "test-drive"
      ? [
          `New test-drive request ${ref}`,
          `${data.name} · ${data.email} · ${data.phone}`,
          `Car: ${vehicleName}`,
          `When: ${data.date}, ${slotLabels[data.slot]}`,
          `Where: ${data.location === "showroom" ? "At the showroom" : "Delivered to the customer"}`,
          data.spec ? `Specification: ${data.spec}` : "",
          data.message ? `Message: ${data.message}` : "",
        ]
      : [
          `New enquiry ${ref}`,
          `${data.name} · ${data.email}${data.phone ? ` · ${data.phone}` : ""}`,
          `Topic: ${topicLabels[data.topic]}`,
          data.vehicle ? `Car: ${vehicleName}` : "",
          `Message: ${data.message}`,
        ];
  const text = lines.filter(Boolean).join("\n");

  const outcomes = await Promise.allSettled([store(record), forwardWebhook(record), forwardTelegram(text)]);
  const delivered = outcomes.some((o) => o.status === "fulfilled" && o.value !== false);
  outcomes.forEach((o, i) => {
    if (o.status === "rejected") console.error(`[inquiries] channel ${["store", "webhook", "telegram"][i]} failed:`, o.reason);
  });

  if (!delivered) {
    return NextResponse.json(
      { ok: false, error: "We could not record your request just now. Please call or email us and we will arrange it directly." },
      { status: 503 }
    );
  }

  return NextResponse.json({ ok: true, reference: ref }, { status: 201 });
}

export function GET() {
  return NextResponse.json({ ok: false, error: "Use POST to send a request." }, { status: 405, headers: { Allow: "POST" } });
}
