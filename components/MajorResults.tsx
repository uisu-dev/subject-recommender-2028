"use client";

import { useMemo } from "react";
import type { File1Group } from "@/lib/types";

type Props = {
  query: string;
  groups: File1Group[];
  onPick: (group: File1Group) => void;
};

const AREA_ORDER = ["국어", "수학", "영어", "사회", "과학", "기타"];

export default function MajorResults({ query, groups, onPick }: Props) {
  if (!query) {
    return (
      <div className="rounded-xl border border-dashed border-ink-200 bg-white p-10 text-center text-ink-500">
        검색어를 입력하면 계열·모집단위 결과가 표시됩니다.
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-ink-200 bg-white p-10 text-center text-ink-500">
        검색 결과가 없습니다. (계열별 시트는 16개 대표 모집단위만 다룹니다)
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {groups.map((g) => (
        <MajorCard key={`${g.계열}-${g.모집단위}`} group={g} onPick={onPick} />
      ))}
    </div>
  );
}

function MajorCard({
  group,
  onPick,
}: {
  group: File1Group;
  onPick: (g: File1Group) => void;
}) {
  // Pivot: subject area -> { subject -> list of universities }
  const pivot = useMemo(() => {
    const map = new Map<string, Map<string, string[]>>();
    for (const u of group.대학별) {
      for (const s of u.과목) {
        if (!map.has(s.영역)) map.set(s.영역, new Map());
        const sub = map.get(s.영역)!;
        if (!sub.has(s.과목)) sub.set(s.과목, []);
        sub.get(s.과목)!.push(u.대학표기);
      }
    }
    return map;
  }, [group]);

  const orderedAreas = AREA_ORDER.filter((a) => pivot.has(a)).concat(
    Array.from(pivot.keys()).filter((a) => !AREA_ORDER.includes(a))
  );

  return (
    <article className="rounded-xl border border-ink-200 bg-white shadow-sm">
      <header className="flex items-center justify-between border-b border-ink-100 px-5 py-3">
        <div>
          <h3 className="font-semibold text-ink-900">
            {group.계열} · {group.모집단위}
          </h3>
          <p className="text-xs text-ink-500">
            {group.대학별.length}개 대학 권장과목 분포
          </p>
        </div>
        <button
          onClick={() => onPick(group)}
          className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700"
        >
          상담용 출력
        </button>
      </header>
      <div className="grid gap-4 p-5 md:grid-cols-2">
        {orderedAreas.map((area) => {
          const subjects = pivot.get(area)!;
          return (
            <div key={area} className="rounded-lg border border-ink-100 p-3">
              <h4 className="mb-2 text-sm font-semibold text-ink-900">{area}</h4>
              <ul className="space-y-1.5">
                {Array.from(subjects.entries()).map(([subj, univs]) => (
                  <li key={subj} className="text-sm">
                    <span className="font-medium text-indigo-700">{subj}</span>
                    <span className="ml-2 text-ink-700">
                      {univs.join(", ")}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </article>
  );
}
