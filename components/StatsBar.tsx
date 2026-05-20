"use client";

import { useEffect, useState } from "react";

type Stats = {
  enabled: boolean;
  visitorsToday: number;
  totalVisits: number;
  totalClicks: number;
  topUniv: Array<{ name: string; count: number }>;
  topDept: Array<{ name: string; count: number }>;
};

export default function StatsBar() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/stats", { cache: "no-store" })
      .then((r) => r.json())
      .then((d: Stats) => {
        if (alive) setStats(d);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  if (!stats || !stats.enabled) return null;

  const noData =
    stats.visitorsToday === 0 &&
    stats.topUniv.length === 0 &&
    stats.topDept.length === 0;

  return (
    <div className="no-print border-b border-ink-100 bg-gradient-to-r from-indigo-50/50 to-cyan-50/50">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-1.5 px-4 py-2.5 text-xs sm:px-6">
        {noData ? (
          <span className="text-ink-500">
            📊 통계 수집 중… 첫 방문자가 되어주세요.
          </span>
        ) : (
          <>
            <Block label="📊 오늘">
              <span className="font-bold text-indigo-700">
                {stats.visitorsToday.toLocaleString()}명
              </span>
              <span className="ml-1 text-ink-500">
                (누적 {stats.totalVisits.toLocaleString()})
              </span>
            </Block>
            {stats.topUniv.length > 0 && (
              <Block label="🏫 인기 대학">
                <RankedList items={stats.topUniv} accentClass="text-indigo-700" />
              </Block>
            )}
            {stats.topDept.length > 0 && (
              <Block label="📚 인기 학과">
                <RankedList items={stats.topDept} accentClass="text-cyan-700" />
              </Block>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function Block({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-baseline gap-1.5">
      <span className="font-semibold text-ink-500">{label}</span>
      <span className="text-ink-900">{children}</span>
    </div>
  );
}

function RankedList({
  items,
  accentClass,
}: {
  items: Array<{ name: string; count: number }>;
  accentClass: string;
}) {
  return (
    <span className="text-ink-900">
      {items.map((it, idx) => (
        <span key={`${it.name}-${idx}`}>
          {idx > 0 && <span className="mx-1 text-ink-300">·</span>}
          <span className={`font-medium ${accentClass}`}>{it.name}</span>
          <span className="ml-0.5 text-[10px] text-ink-500">
            ({it.count})
          </span>
        </span>
      ))}
    </span>
  );
}
