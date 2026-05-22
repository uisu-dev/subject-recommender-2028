import { NextResponse } from "next/server";
import { deletePost } from "@/lib/board";
import { getSessionFromRequest, verifySession } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Admin only — relies on the existing admin session cookie
  const token = getSessionFromRequest(request);
  if (!verifySession(token)) {
    return NextResponse.json({ error: "관리자 인증 필요" }, { status: 401 });
  }

  const ok = await deletePost(params.id);
  return NextResponse.json({ success: ok });
}
