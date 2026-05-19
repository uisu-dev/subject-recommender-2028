"use client";

import { useMemo } from "react";
import type { File2Row } from "@/lib/types";
import { rowId } from "@/lib/data";

type Props = {
  query: string;
  rows: File2Row[];
  cartIds: Set<string>;
  onToggleCart: (row: File2Row, idx: number) => void;
  onPick: (rows: File2Row[], label: string) => void;
};

type Grouped = {
  대학명: string;
  지역: string;
  권역: string;
  rows: Array<{ row: File2Row; idx: number }>;
};

export default function UnivDeptResults({
  query,
  rows,
  cartIds,
  onToggleCart,
  onPick,
}: Props) {
  const grouped: Grouped[] = useMemo(() => {
    const map = new Map<string, Grouped>();
    rows.forEach((r, idx) => {
      const k = r.대학명;
      const g = map.get(k);
      if (g) g.rows.push({ row: r, idx });
      else
        map.set(k, {
          대학명: r.대학명,
          지역: r.지역,
          권역: r.권역,
          rows: [{ row: r, idx }],
        });
    });
    return Array.from(map.values()).sort((a, b) =>
      a.대학명.localeCompare(b.대학명, "ko")
    );
  }, [rows]);

  if (!query) {
    return (
      <div className="rounded-xl border border-dashed border-ink-200 bg-white p-10 text-center text-ink-500">
        검색어를 입력하면 대학·학과 결과가 표시됩니다.
      </div>
    );
  }

  if (grouped.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-ink-200 bg-white p-10 text-center text-ink-500">
        검색 결과가 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {grouped.map((g) => (
        <article
          key={g.대학명}
          className="rounded-xl border border-ink-200 bg-white shadow-sm"
        >
          <header className="flex items-center justify-between border-b border-ink-100 px-5 py-3">
            <div>
              <h3 className="font-semibold text-ink-900">{g.대학명}</h3>
              <p className="text-xs text-ink-500">
                {g.권역} · {g.지역} · {g.rows.length}개 모집단위
              </p>
            </div>
            <button
              onClick={() =>
                onPick(
                  g.rows.map((x) => x.row),
                  g.대학명
                )
              }
              className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700"
            >
              전체 출력
            </button>
          </header>
          <div className="divide-y divide-ink-100">
            {g.rows.map(({ row, idx }) => {
              const id = rowId(row, idx);
              const inCart = cartIds.has(id);
              return (
                <RowItem
                  key={id}
                  row={row}
                  inCart={inCart}
                  onToggleCart={() => onToggleCart(row, idx)}
                  onPrint={() =>
                    onPick(
                      [row],
                      `${g.대학명} · ${row.학과 || row.단과대_계열}`
                    )
                  }
                />
              );
            })}
          </div>
        </article>
      ))}
    </div>
  );
}

function RowItem({
  row,
  inCart,
  onToggleCart,
  onPrint,
}: {
  row: File2Row;
  inCart: boolean;
  onToggleCart: () => void;
  onPrint: () => void;
}) {
  const deptLabel = [row.단과대_계열, row.학과].filter(Boolean).join(" · ");
  return (
    <div className="grid grid-cols-12 gap-3 px-5 py-3 hover:bg-ink-50/50">
      <div className="col-span-1 flex items-start pt-0.5">
        <label className="inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            checked={inCart}
            onChange={onToggleCart}
            className="h-4 w-4 cursor-pointer rounded border-ink-300 text-indigo-600 focus:ring-indigo-500"
            aria-label="비교 카트에 추가"
          />
        </label>
      </div>
      <div className="col-span-3 text-sm font-medium text-ink-900">
        {deptLabel || "—"}
      </div>
      <div className="col-span-7 space-y-1.5 text-sm">
        {row.핵심과목 && (
          <div className="flex gap-2">
            <span className="shrink-0 rounded bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
              핵심
            </span>
            <span className="text-ink-700 whitespace-pre-wrap">
              {row.핵심과목}
            </span>
          </div>
        )}
        {row.권장과목 && (
          <div className="flex gap-2">
            <span className="shrink-0 rounded bg-cyan-50 px-2 py-0.5 text-xs font-medium text-cyan-700">
              권장
            </span>
            <span className="text-ink-700 whitespace-pre-wrap">
              {row.권장과목}
            </span>
          </div>
        )}
        {!row.핵심과목 && !row.권장과목 && (
          <span className="text-ink-500">권장과목 정보 없음</span>
        )}
        {row.비고 && (
          <p className="pt-1 text-xs text-ink-500 whitespace-pre-wrap">
            ※ {row.비고}
          </p>
        )}
      </div>
      <div className="col-span-1 text-right">
        <button
          onClick={onPrint}
          className="text-xs text-indigo-600 hover:underline"
        >
          출력
        </button>
      </div>
    </div>
  );
}
