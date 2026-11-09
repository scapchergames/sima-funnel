import { NextRequest, NextResponse } from "next/server";
import { patchSession } from "@/lib/server/sessions";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.EMAIL_FROM ?? "Simaloji <noreply@simafzm.com>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://simafzm.com";

async function sendWelcomeEmail(to: string, locale: string): Promise<void> {
  if (!RESEND_API_KEY) return;

  const isTr = locale === "tr";
  const subject = isTr
    ? "Simaloji analizin hazır! ✨"
    : "Your Simaloji analysis is ready! ✨";

  const html = isTr
    ? `
      <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;background:#0D0D12;color:#F0EFFF;padding:32px 24px;border-radius:16px;">
        <h1 style="font-size:22px;font-weight:800;margin-bottom:12px;">Raporun hazırlandı 🔮</h1>
        <p style="color:rgba(240,239,255,0.65);line-height:1.65;margin-bottom:24px;">
          Yüz analizin tamamlandı. Tam raporunu görmek için aşağıdaki butona tıkla.
        </p>
        <a href="${APP_URL}/${locale}/result" style="display:inline-block;padding:14px 28px;background:linear-gradient(135deg,#7C5CFC,#5B3FD4);color:white;text-decoration:none;border-radius:12px;font-weight:700;font-size:15px;">
          Raporumu Görüntüle →
        </a>
        <p style="margin-top:24px;font-size:11px;color:rgba(240,239,255,0.3);">
          Simaloji · simafzm.com · Bu e-postayı beklemediniz mi? Görmezden gelebilirsiniz.
        </p>
      </div>
    `
    : `
      <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;background:#0D0D12;color:#F0EFFF;padding:32px 24px;border-radius:16px;">
        <h1 style="font-size:22px;font-weight:800;margin-bottom:12px;">Your report is ready 🔮</h1>
        <p style="color:rgba(240,239,255,0.65);line-height:1.65;margin-bottom:24px;">
          Your face analysis is complete. Click below to view your full report.
        </p>
        <a href="${APP_URL}/${locale}/result" style="display:inline-block;padding:14px 28px;background:linear-gradient(135deg,#7C5CFC,#5B3FD4);color:white;text-decoration:none;border-radius:12px;font-weight:700;font-size:15px;">
          View My Report →
        </a>
        <p style="margin-top:24px;font-size:11px;color:rgba(240,239,255,0.3);">
          Simaloji · simafzm.com · Didn't expect this? You can safely ignore it.
        </p>
      </div>
    `;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({ from: FROM_EMAIL, to: [to], subject, html }),
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, sessionId, marketingOptIn } = body as {
    email: string;
    sessionId: string;
    marketingOptIn: boolean;
  };

  if (!email || !sessionId) {
    return NextResponse.json({ error: "email ve sessionId gerekli" }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: "Geçersiz e-posta" }, { status: 400 });
  }

  await patchSession(sessionId, { email, marketingOptIn });

  const locale = req.headers.get("accept-language")?.startsWith("en") ? "en" : "tr";
  sendWelcomeEmail(email, locale).catch(() => null);

  return NextResponse.json({ ok: true });
}
