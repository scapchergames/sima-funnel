import { NextRequest, NextResponse } from "next/server";
import type { FullAnalysis } from "@/lib/report/types";
import { analysisCache } from "@/lib/server/analysisCache";

export async function POST(req: NextRequest) {
  try {
    const { sessionId, analysis } = (await req.json()) as {
      sessionId?: string;
      analysis?: FullAnalysis;
    };

    if (!sessionId || !analysis) {
      return NextResponse.json({ error: "sessionId ve analysis gerekli" }, { status: 400 });
    }

    await analysisCache.set(sessionId, analysis);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Kayıt başarısız" }, { status: 500 });
  }
}
