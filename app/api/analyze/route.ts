import { NextRequest, NextResponse } from "next/server";
import type { FullAnalysis } from "@/lib/report/types";
import { toTeaser } from "@/lib/report/types";
import { analysisCache } from "@/lib/server/analysisCache";

const ANALYSIS_BACKEND = process.env.ANALYSIS_BACKEND_URL ?? "https://fal-proxy-nine.vercel.app/api/fizyonomi";
const TIMEOUT_MS = 30_000;

export async function POST(req: NextRequest) {
  const contentType = req.headers.get("content-type") ?? "";

  if (!contentType.includes("multipart/form-data")) {
    return NextResponse.json({ error: "multipart/form-data gerekli" }, { status: 400 });
  }

  const form = await req.formData();
  const imageFile = form.get("image") as File | null;
  const sessionId = form.get("sessionId") as string | null;
  const locale = (form.get("locale") as string) ?? "tr";

  if (!imageFile) {
    return NextResponse.json({ error: "image gerekli" }, { status: 400 });
  }

  if (!sessionId) {
    return NextResponse.json({ error: "sessionId gerekli" }, { status: 400 });
  }

  const cached = await analysisCache.get(sessionId);
  if (cached) {
    return NextResponse.json({ teaser: toTeaser(cached) });
  }

  const arrayBuffer = await imageFile.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary);

  const body = {
    feature: "single",
    image: base64,
    mime: "image/jpeg",
    tone: "samimi",
    lang: locale === "tr" ? "tr" : "en",
  };

  let analysis: FullAnalysis;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const backendRes = await fetch(ANALYSIS_BACKEND, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (!backendRes.ok) {
      const errorData = await backendRes.json().catch(() => ({}));
      return NextResponse.json(
        { error: (errorData as { message?: string }).message ?? "Analiz başarısız" },
        { status: 502 }
      );
    }

    analysis = (await backendRes.json()) as FullAnalysis;
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      return NextResponse.json({ error: "Analiz zaman aşımına uğradı. Tekrar deneyin." }, { status: 504 });
    }
    return NextResponse.json({ error: "Sunucuya bağlanılamadı" }, { status: 502 });
  }

  if (analysis.status !== "ok") {
    return NextResponse.json(
      { error: analysis.message ?? "Fotoğraf geçersiz" },
      { status: 422, headers: { "X-Analysis-Status": analysis.status } }
    );
  }

  await analysisCache.set(sessionId, analysis);

  return NextResponse.json({ teaser: toTeaser(analysis) });
}
