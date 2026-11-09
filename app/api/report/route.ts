import { NextRequest, NextResponse } from "next/server";
import { analysisCache } from "@/lib/server/analysisCache";
import { getSession } from "@/lib/server/sessions";

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("sessionId");

  if (!sessionId) {
    return NextResponse.json({ error: "sessionId required" }, { status: 400 });
  }

  const session = await getSession(sessionId);
  if (!session) {
    return NextResponse.json({ error: "session not found" }, { status: 404 });
  }

  if (!session.paid) {
    return NextResponse.json({ error: "payment required" }, { status: 402 });
  }

  const analysis = await analysisCache.get(sessionId);
  if (!analysis) {
    return NextResponse.json({ error: "analysis not found" }, { status: 404 });
  }

  return NextResponse.json({ analysis });
}
