import { NextRequest, NextResponse } from "next/server";
import type { SessionPatch } from "@/lib/session/types";
import { createSession, getSession, patchSession } from "@/lib/server/sessions";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const session = await getSession(id);
  if (!session) return NextResponse.json({ error: "not found" }, { status: 404 });

  return NextResponse.json(session);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const session = await createSession(body);
  return NextResponse.json(session, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const body = (await req.json()) as { id: string } & SessionPatch;
  const { id, ...patch } = body;

  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const updated = await patchSession(id, patch);
  if (!updated) return NextResponse.json({ error: "not found" }, { status: 404 });

  return NextResponse.json(updated);
}
