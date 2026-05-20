import { NextResponse } from "next/server";
import { trackClick, trackVisit } from "@/lib/stats";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  type?: "visit" | "click";
  visitorId?: string;
  대학명?: string;
  학과?: string;
};

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // Fire-and-forget pattern: we still await but errors are swallowed so the
  // client gets a fast 200 either way. Tracking failures must not break UX.
  try {
    if (body.type === "visit" && typeof body.visitorId === "string") {
      await trackVisit(body.visitorId.slice(0, 64));
    } else if (body.type === "click") {
      await trackClick({
        대학명: typeof body.대학명 === "string" ? body.대학명.slice(0, 80) : undefined,
        학과: typeof body.학과 === "string" ? body.학과.slice(0, 80) : undefined,
      });
    }
  } catch (e) {
    // Log but don't fail
    console.error("trackEvent failed:", e);
  }

  return NextResponse.json({ ok: true });
}
