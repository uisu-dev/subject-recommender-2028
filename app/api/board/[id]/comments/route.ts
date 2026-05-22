import { NextResponse } from "next/server";
import { createComment, listComments } from "@/lib/board";
import { checkProfanity } from "@/lib/profanity-ko";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const comments = await listComments(params.id);
    return NextResponse.json({ comments });
  } catch (e: any) {
    return NextResponse.json(
      { comments: [], error: e?.message || "failed" },
      { status: 500 }
    );
  }
}

type Body = { body?: unknown };

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  let payload: Body;
  try {
    payload = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "잘못된 요청" }, { status: 400 });
  }

  const body = typeof payload.body === "string" ? payload.body : "";

  const check = checkProfanity(body);
  if (!check.ok) {
    return NextResponse.json(
      {
        error: `댓글에 사용할 수 없는 단어가 포함되어 있습니다 (감지: "${check.matched}"). 다른 표현으로 작성해주세요.`,
      },
      { status: 400 }
    );
  }

  const result = await createComment(params.id, body);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ comment: result });
}
