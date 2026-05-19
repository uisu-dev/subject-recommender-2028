import { NextResponse } from "next/server";
import { getSessionFromRequest, verifySession } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const token = getSessionFromRequest(request);
  const authenticated = verifySession(token);
  return NextResponse.json({ authenticated });
}
