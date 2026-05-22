import { NextResponse } from "next/server";
import { createPost } from "@/lib/board";
import { checkProfanity } from "@/lib/profanity-ko";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  title?: unknown;
  body?: unknown;
};

export async function POST(request: Request) {
  let payload: Body;
  try {
    payload = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "잘못된 요청" }, { status: 400 });
  }

  const title = typeof payload.title === "string" ? payload.title : "";
  const body = typeof payload.body === "string" ? payload.body : "";

  // Profanity check on title + body (server-side authoritative)
  const titleCheck = checkProfanity(title);
  if (!titleCheck.ok) {
    return NextResponse.json(
      {
        error: `제목에 사용할 수 없는 단어가 포함되어 있습니다 (감지: "${titleCheck.matched}"). 다른 표현으로 작성해주세요.`,
      },
      { status: 400 }
    );
  }
  const bodyCheck = checkProfanity(body);
  if (!bodyCheck.ok) {
    return NextResponse.json(
      {
        error: `본문에 사용할 수 없는 단어가 포함되어 있습니다 (감지: "${bodyCheck.matched}"). 다른 표현으로 작성해주세요.`,
      },
      { status: 400 }
    );
  }

  const result = await createPost({ title, body });
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ post: result });
}
