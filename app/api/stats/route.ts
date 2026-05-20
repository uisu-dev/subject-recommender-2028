import { NextResponse } from "next/server";
import { getStats } from "@/lib/stats";

export const runtime = "nodejs";
// Cache results for 60 seconds at the edge to limit Redis reads under load.
export const revalidate = 60;

export async function GET() {
  try {
    const stats = await getStats();
    return NextResponse.json(stats, {
      headers: {
        "Cache-Control": "s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (e) {
    console.error("getStats failed:", e);
    return NextResponse.json({
      enabled: false,
      visitorsToday: 0,
      totalVisits: 0,
      totalClicks: 0,
      topUniv: [],
      topDept: [],
    });
  }
}
