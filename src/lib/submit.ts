"use client";

import { IS_PREVIEW } from "@/lib/env";
import type { FieldErrors } from "@/lib/inquiry";

export type SubmitResult =
  | { ok: true; reference: string; channel: "server" | "preview" }
  | { ok: false; error: string; fields?: FieldErrors; offline?: boolean };

const STRIP = new Set(["company", "startedAt", "consent"]);

function reference(kind: string) {
  const bytes = new Uint8Array(3);
  crypto.getRandomValues(bytes);
  return `${kind === "test-drive" ? "TD" : "CT"}-${Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("").toUpperCase()}`;
}

/**
 * Sends a test-drive or contact request.
 * - Next.js site: POST /api/inquiries (validated again on the server, stored, optionally forwarded).
 * - Preview build: saved to the preview's own database through the artifact `db` capability.
 * Never reports success unless the request was actually recorded.
 */
export async function submitInquiry(data: Record<string, unknown>): Promise<SubmitResult> {
  if (IS_PREVIEW) return submitToPreviewStore(data);
  try {
    const res = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = (await res.json().catch(() => null)) as { ok?: boolean; reference?: string; error?: string; fields?: FieldErrors } | null;
    if (res.ok && json?.ok && json.reference) return { ok: true, reference: json.reference, channel: "server" };
    if (json?.fields) return { ok: false, error: json.error ?? "Some details need attention.", fields: json.fields };
    if (res.status === 404 || res.status === 405) {
      return { ok: false, offline: true, error: "Online requests are not connected on this copy of the site." };
    }
    return { ok: false, error: json?.error ?? "We could not record your request just now." };
  } catch {
    return { ok: false, offline: true, error: "Your request could not reach us. Check your connection and try again." };
  }
}

type DbDoc = { get(): Promise<{ exists: boolean; data(): Record<string, unknown> | undefined }>; set(d: Record<string, unknown>): Promise<void> };
type Db = { doc(path: string): DbDoc };
type User = { id(): Promise<string | null> };
type ClaudeRuntime = { use(name: string): Promise<unknown> };

async function submitToPreviewStore(data: Record<string, unknown>): Promise<SubmitResult> {
  const runtime = (window as unknown as { claude?: ClaudeRuntime }).claude;
  if (!runtime?.use) {
    return { ok: false, offline: true, error: "This copy of the preview is not connected to a database, so the request was not sent." };
  }
  const [db, user] = (await Promise.all([runtime.use("db"), runtime.use("user")])) as [Db | null, User | null];
  const uid = user ? await user.id() : null;
  if (!db || !uid) {
    return { ok: false, offline: true, error: "Sign in to claude.ai to send a request from this preview." };
  }
  const ref = reference(String(data.kind));
  const record: Record<string, unknown> = { reference: ref, receivedAt: new Date().toISOString() };
  for (const [k, v] of Object.entries(data)) if (!STRIP.has(k)) record[k] = v;
  try {
    // one document per sender (only they and the owner can read it), holding their requests
    const doc = db.doc(`inquiries/${uid}`);
    const snap = await doc.get();
    const items = (snap.exists && Array.isArray(snap.data()?.items) ? (snap.data()!.items as unknown[]) : []).slice(-49);
    await doc.set({ items: [...items, record], updatedAt: record.receivedAt });
    return { ok: true, reference: ref, channel: "preview" };
  } catch (e) {
    const code = (e as { code?: string })?.code;
    if (code === "invalid_argument" || code === "not_granted" || code === "revoked") {
      return { ok: false, offline: true, error: "Your access to this preview is view-only, so the request was not sent." };
    }
    if (code === "quota_exceeded") {
      return { ok: false, offline: true, error: "This preview's request store is full, so the request was not sent." };
    }
    return { ok: false, error: "The request could not be saved just now. Try again in a moment." };
  }
}
