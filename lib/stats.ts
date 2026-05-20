/**
 * Stats backend (server-only).
 *
 * Tracks:
 *   - Daily unique visitors (by visitor UUID stored in localStorage)
 *   - Total clicks per university (sorted set)
 *   - Total clicks per department (sorted set)
 *   - Cumulative totals
 *
 * Backend: Upstash Redis via REST API.
 *   - Supports both Upstash-native env vars and Vercel-Marketplace env vars.
 *   - When env vars are missing, all functions return null/0 silently — the
 *     UI hides itself gracefully so the app never breaks.
 */

import { Redis } from "@upstash/redis";

function getClient(): Redis | null {
  const url =
    process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

/** Korea Standard Time YYYY-MM-DD */
export function todayKey(): string {
  const now = new Date();
  const kstMs = now.getTime() + 9 * 60 * 60 * 1000; // shift to KST
  return new Date(kstMs).toISOString().slice(0, 10);
}

const VISITORS_KEY = (date: string) => `visitors:${date}`;
const CLICKS_UNIV = "clicks:univ";
const CLICKS_DEPT = "clicks:dept";
const TOTAL_VISITS = "total:visits";
const TOTAL_CLICKS = "total:clicks";

const TWO_DAYS = 60 * 60 * 24 * 2;

export type ClickPayload = {
  대학명?: string;
  학과?: string;
};

export async function trackVisit(visitorId: string): Promise<void> {
  const redis = getClient();
  if (!redis || !visitorId) return;
  const key = VISITORS_KEY(todayKey());
  const added = await redis.sadd(key, visitorId);
  if (added > 0) {
    await redis.expire(key, TWO_DAYS);
    await redis.incr(TOTAL_VISITS);
  }
}

export async function trackClick(payload: ClickPayload): Promise<void> {
  const redis = getClient();
  if (!redis) return;
  const tasks: Promise<unknown>[] = [];
  if (payload.대학명) {
    tasks.push(redis.zincrby(CLICKS_UNIV, 1, payload.대학명));
  }
  if (payload.학과) {
    tasks.push(redis.zincrby(CLICKS_DEPT, 1, payload.학과));
  }
  if (tasks.length === 0) return;
  tasks.push(redis.incr(TOTAL_CLICKS));
  await Promise.all(tasks);
}

export type Stats = {
  enabled: boolean;
  visitorsToday: number;
  totalVisits: number;
  totalClicks: number;
  topUniv: Array<{ name: string; count: number }>;
  topDept: Array<{ name: string; count: number }>;
};

export async function getStats(): Promise<Stats> {
  const redis = getClient();
  if (!redis) {
    return {
      enabled: false,
      visitorsToday: 0,
      totalVisits: 0,
      totalClicks: 0,
      topUniv: [],
      topDept: [],
    };
  }

  const visitorsKey = VISITORS_KEY(todayKey());

  const [visitorsToday, totalVisits, totalClicks, topUnivRaw, topDeptRaw] =
    await Promise.all([
      redis.scard(visitorsKey),
      redis.get<number>(TOTAL_VISITS),
      redis.get<number>(TOTAL_CLICKS),
      redis.zrange<string[]>(CLICKS_UNIV, 0, 4, {
        rev: true,
        withScores: true,
      }),
      redis.zrange<string[]>(CLICKS_DEPT, 0, 4, {
        rev: true,
        withScores: true,
      }),
    ]);

  // zrange with withScores returns flat [name1, score1, name2, score2, ...]
  const parseRanked = (
    raw: unknown
  ): Array<{ name: string; count: number }> => {
    if (!Array.isArray(raw)) return [];
    const out: Array<{ name: string; count: number }> = [];
    for (let i = 0; i < raw.length - 1; i += 2) {
      const name = String(raw[i]);
      const count = Number(raw[i + 1]);
      if (name && Number.isFinite(count)) out.push({ name, count });
    }
    return out;
  };

  return {
    enabled: true,
    visitorsToday: visitorsToday ?? 0,
    totalVisits: totalVisits ?? 0,
    totalClicks: totalClicks ?? 0,
    topUniv: parseRanked(topUnivRaw),
    topDept: parseRanked(topDeptRaw),
  };
}
