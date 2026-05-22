import { NextResponse } from "next/server";
import { deleteComment } from "@/lib/board";
import { getSessionFromRequest, verifySession } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; commentId: string } }
) {
  const token = getSessionFromRequest(request);
  if (!verifySession(token)) {
    return NextResponse.json({ error: "관리자 인증 필요" }, { status: 401 });
  }
  const ok = await deleteComment(params.id, params.commentId);
  return NextResponse.json({ success: ok });
}
