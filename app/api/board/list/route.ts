import { NextResponse } from "next/server";
import { listPosts } from "@/lib/board";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const cursor = Number(url.searchParams.get("cursor") ?? "0");
  const limit = Number(url.searchParams.get("limit") ?? "20");
  try {
    const { posts, hasMore } = await listPosts(cursor, limit);
    return NextResponse.json({ posts, hasMore });
  } catch (e: any) {
    return NextResponse.json(
      { posts: [], hasMore: false, error: e?.message || "failed" },
      { status: 500 }
    );
  }
}
