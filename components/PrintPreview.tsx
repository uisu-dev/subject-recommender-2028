"use client";

import { useEffect } from "react";
import type { File1Group, File2Row } from "@/lib/types";

type Props = {
  label: string;
  file2Rows: File2Row[];
  file1Group: File1Group | null;
  onClose: () => void;
};

export default function PrintPreview({
  label,
  file2Rows,
  file1Group,
  onClose,
}: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "p") {
        e.preventDefault();
        window.print();
      }
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const today = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay backdrop */}
      <div
        className="no-print absolute inset-0 bg-ink-900/60"
        onClick={onClose}
      />

      {/* Top toolbar */}
      <div className="no-print absolute inset-x-0 top-0 z-10 flex items-center justify-between border-b border-ink-200 bg-white px-6 py-3 shadow-sm">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">
            PDF 미리보기
          </p>
          <h2 className="text-base font-bold text-ink-900">{label}</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            <PrinterIcon />
            인쇄 / PDF 저장
          </button>
          <button
            onClick={onClose}
            className="rounded-md border border-ink-200 bg-white px-4 py-2 text-sm text-ink-700 hover:bg-ink-100"
          >
            닫기 (Esc)
          </button>
        </div>
      </div>

      {/* Scrollable preview area */}
      <div className="absolute inset-0 overflow-auto px-4 pt-24 pb-12">
        <div className="print-area a4-preview">
          <PrintHeader title={label} today={today} />
          {file1Group ? (
            <File1Print group={file1Group} />
          ) : (
            <File2Print rows={file2Rows} />
          )}
          <PrintFooter />
        </div>
      </div>
    </div>
  );
}

function PrintHeader({ title, today }: { title: string; today: string }) {
  return (
    <header className="mb-6 border-b-2 border-indigo-600 pb-4">
      <div className="flex items-baseline justify-between">
        <p className="text-xs font-semibold tracking-wider text-indigo-700">
          2028학년도 권장과목 안내
        </p>
        <p className="text-xs text-ink-500">{today}</p>
      </div>
      <h1 className="mt-1 text-2xl font-bold text-ink-900">{title}</h1>
    </header>
  );
}

function PrintFooter() {
  return (
    <footer className="mt-8 border-t border-ink-200 pt-3 text-[10px] text-ink-500">
      <p>
        ※ 본 자료는 2028학년도 권역별 대학별 권장과목(반영과목) 및 계열별 대표
        모집단위별 반영과목(권장과목) 자료를 바탕으로 작성되었습니다.
      </p>
      <p>※ 실제 입시 시점에는 각 대학의 최신 모집요강을 반드시 확인하세요.</p>
    </footer>
  );
}

function File2Print({ rows }: { rows: File2Row[] }) {
  if (rows.length === 0) return null;
  return (
    <section className="space-y-4">
      {rows.map((r, idx) => (
        <div
          key={idx}
          className="rounded-md border border-ink-200 p-4"
        >
          <div className="mb-2 flex items-baseline justify-between border-b border-ink-100 pb-2">
            <h3 className="text-sm font-bold text-ink-900">
              {r.대학명}
              {(r.단과대_계열 || r.학과) && (
                <span className="ml-2 font-normal text-ink-700">
                  · {[r.단과대_계열, r.학과].filter(Boolean).join(" · ")}
                </span>
              )}
            </h3>
            <span className="text-[10px] text-ink-500">
              {r.권역} · {r.지역}
            </span>
          </div>
          <table className="w-full text-sm">
            <tbody>
              {r.핵심과목 && (
                <tr className="align-top">
                  <th className="w-20 py-1.5 pr-3 text-left text-xs font-semibold text-indigo-700">
                    핵심과목
                  </th>
                  <td className="py-1.5 text-ink-900 whitespace-pre-wrap">
                    {r.핵심과목}
                  </td>
                </tr>
              )}
              {r.권장과목 && (
                <tr className="align-top">
                  <th className="w-20 py-1.5 pr-3 text-left text-xs font-semibold text-cyan-700">
                    권장과목
                  </th>
                  <td className="py-1.5 text-ink-900 whitespace-pre-wrap">
                    {r.권장과목}
                  </td>
                </tr>
              )}
              {r.비고 && (
                <tr className="align-top">
                  <th className="w-20 py-1.5 pr-3 text-left text-xs font-semibold text-ink-500">
                    비고
                  </th>
                  <td className="py-1.5 text-xs text-ink-700 whitespace-pre-wrap">
                    {r.비고}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ))}
    </section>
  );
}

const AREA_ORDER = ["국어", "수학", "영어", "사회", "과학", "기타"];

function File1Print({ group }: { group: File1Group }) {
  const pivot = new Map<string, Map<string, string[]>>();
  for (const u of group.대학별) {
    for (const s of u.과목) {
      if (!pivot.has(s.영역)) pivot.set(s.영역, new Map());
      const sub = pivot.get(s.영역)!;
      if (!sub.has(s.과목)) sub.set(s.과목, []);
      sub.get(s.과목)!.push(u.대학표기);
    }
  }
  const orderedAreas = AREA_ORDER.filter((a) => pivot.has(a)).concat(
    Array.from(pivot.keys()).filter((a) => !AREA_ORDER.includes(a))
  );

  return (
    <section>
      <p className="mb-3 text-xs text-ink-500">
        계열 대표 모집단위 기준으로 과목별 권장 대학을 정리한 표입니다.
      </p>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-y-2 border-ink-700">
            <th className="w-24 px-2 py-2 text-left text-xs font-bold text-ink-900">
              영역
            </th>
            <th className="w-28 px-2 py-2 text-left text-xs font-bold text-ink-900">
              과목
            </th>
            <th className="px-2 py-2 text-left text-xs font-bold text-ink-900">
              권장 대학
            </th>
          </tr>
        </thead>
        <tbody>
          {orderedAreas.map((area) => {
            const subjects = Array.from(pivot.get(area)!.entries());
            return subjects.map(([subj, univs], i) => (
              <tr
                key={`${area}-${subj}`}
                className="border-b border-ink-100 align-top"
              >
                {i === 0 && (
                  <td
                    rowSpan={subjects.length}
                    className="border-r border-ink-100 px-2 py-1.5 font-semibold text-indigo-700"
                  >
                    {area}
                  </td>
                )}
                <td className="px-2 py-1.5 text-ink-900">{subj}</td>
                <td className="px-2 py-1.5 text-ink-700">{univs.join(", ")}</td>
              </tr>
            ));
          })}
        </tbody>
      </table>
    </section>
  );
}

function PrinterIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 6 2 18 2 18 9" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect x="6" y="14" width="12" height="8" />
    </svg>
  );
}
