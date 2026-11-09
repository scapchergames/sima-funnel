import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN;

function sha256(value: string): string {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

export async function POST(req: NextRequest) {
  if (!PIXEL_ID || !ACCESS_TOKEN) {
    return NextResponse.json({ skipped: true });
  }

  const body = await req.json() as {
    eventName: string;
    sourceUrl: string;
    email?: string;
    phone?: string;
    fbp?: string;
    fbc?: string;
    value?: number;
    currency?: string;
  };

  const eventTime = Math.floor(Date.now() / 1000);

  const userData: Record<string, string> = {};
  if (body.email) userData["em"] = sha256(body.email);
  if (body.phone) userData["ph"] = sha256(body.phone);
  if (body.fbp) userData["fbp"] = body.fbp;
  if (body.fbc) userData["fbc"] = body.fbc;

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? req.headers.get("x-real-ip")
    ?? undefined;
  if (ip) userData["client_ip_address"] = ip;

  const ua = req.headers.get("user-agent");
  if (ua) userData["client_user_agent"] = ua;

  const payload = {
    data: [
      {
        event_name: body.eventName,
        event_time: eventTime,
        event_source_url: body.sourceUrl,
        action_source: "website",
        user_data: userData,
        ...(body.value !== undefined && {
          custom_data: { value: body.value, currency: body.currency ?? "TRY" },
        }),
      },
    ],
  };

  try {
    const res = await fetch(
      `https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    const result = await res.json();
    return NextResponse.json({ ok: res.ok, result });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
