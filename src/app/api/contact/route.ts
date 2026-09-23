import { NextResponse } from "next/server";
import { Resend } from "resend";
import { budgetRanges, callTimes, formats, site } from "@/content/site";

export const runtime = "nodejs";

const SHOOT_LABELS: Record<string, string> = {
  realEstate: "Real estate",
  events: "Events",
  portraits: "Portraits",
  creative: "Creative",
  food: "Food",
  street: "Street",
  other: "Something else",
};

const BUDGET_LABELS: Record<string, string> = {
  under2k: "Under 2 000 PLN",
  "2to5k": "2 000 - 5 000 PLN",
  "5to10k": "5 000 - 10 000 PLN",
  over10k: "Over 10 000 PLN",
  unsure: "Not sure yet",
};

const LOCALES = ["en", "pl", "uk"];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

interface Request_ {
  locale: string;
  name: string;
  email: string;
  shoot: string;
  format: string;
  budget: string;
  day: string;
  time: string;
  message: string;
  company: string;
}

function str(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

/** Returns a clean request, or null when anything required is missing or malformed. */
function parse(body: unknown): Request_ | null {
  if (!body || typeof body !== "object") return null;
  const raw = body as Record<string, unknown>;
  const data: Request_ = {
    locale: LOCALES.includes(str(raw.locale, 5)) ? str(raw.locale, 5) : "en",
    name: str(raw.name, 120),
    email: str(raw.email, 254),
    shoot: str(raw.shoot, 40),
    format: str(raw.format, 20),
    budget: str(raw.budget, 20),
    day: str(raw.day, 10),
    time: str(raw.time, 20),
    message: str(raw.message, 2000),
    company: str(raw.company, 200),
  };

  const dayValid = /^\d{4}-\d{2}-\d{2}$/.test(data.day) && !Number.isNaN(Date.parse(data.day));
  const valid =
    data.name.length >= 2 &&
    EMAIL_PATTERN.test(data.email) &&
    data.shoot in SHOOT_LABELS &&
    (formats as readonly string[]).includes(data.format) &&
    (budgetRanges as readonly string[]).includes(data.budget) &&
    dayValid &&
    (callTimes as readonly string[]).includes(data.time);

  return valid ? data : null;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Best-effort limit: 5 requests per IP per 10 minutes. Resets when the server instance restarts. */
const hits = new Map<string, { count: number; reset: number }>();

function limited(ip: string): boolean {
  const now = Date.now();
  for (const [key, entry] of hits) if (entry.reset < now) hits.delete(key);
  const entry = hits.get(ip);
  if (!entry) {
    hits.set(ip, { count: 1, reset: now + 10 * 60_000 });
    return false;
  }
  entry.count += 1;
  return entry.count > 5;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const data = parse(body);
  if (!data) return NextResponse.json({ error: "invalid" }, { status: 400 });

  // Bots fill the hidden field. Pretend it worked and send nothing.
  if (data.company) return NextResponse.json({ ok: true });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (limited(ip)) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "not_configured" }, { status: 503 });

  const to = process.env.CONTACT_TO || site.email;
  const from = process.env.CONTACT_FROM || "neuaux.studio <onboarding@resend.dev>";

  const lines: [string, string][] = [
    ["Name", data.name],
    ["Email", data.email],
    ["Type of shoot", SHOOT_LABELS[data.shoot]],
    ["Format", data.format],
    ["Budget", BUDGET_LABELS[data.budget]],
    ["Preferred day", data.day],
    ["Best time of day (Warsaw time)", data.time],
    ["Site language", data.locale.toUpperCase()],
  ];

  const text = [...lines.map(([label, value]) => `${label}: ${value}`), "", data.message || "(no message)"].join("\n");
  const html = `<div style="font-family:system-ui,sans-serif;line-height:1.5">
<h2 style="margin:0 0 12px">New call request</h2>
<table cellpadding="6" style="border-collapse:collapse">${lines
    .map(
      ([label, value]) =>
        `<tr><td style="color:#666">${escapeHtml(label)}</td><td><strong>${escapeHtml(value)}</strong></td></tr>`,
    )
    .join("")}</table>
<p style="white-space:pre-wrap;margin-top:16px">${escapeHtml(data.message || "(no message)")}</p>
</div>`;

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: [to],
    replyTo: data.email,
    subject: `Call request from ${data.name.replace(/[\r\n]+/g, " ")}`,
    text,
    html,
  });

  if (error) {
    console.error("Resend error", error);
    return NextResponse.json({ error: "send_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
