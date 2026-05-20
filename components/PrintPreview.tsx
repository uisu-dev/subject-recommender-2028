"use client";

import { useEffect, useState } from "react";
import type { CartItem, File2Row, HeaderInfo } from "@/lib/types";
import BulletText from "./BulletText";

type Mode =
  | { kind: "single"; rows: File2Row[]; label: string }
  | { kind: "compare"; items: CartItem[] };

type Props = {
  mode: Mode;
  headerInfo: HeaderInfo;
  onUpdateHeader: (h: HeaderInfo) => void;
  onClose: () => void;
};

export default function PrintPreview({
  mode,
  headerInfo,
  onUpdateHeader,
  onClose,
}: Props) {
  const [draft, setDraft] = useState<HeaderInfo>(headerInfo);

  useEffect(() => {
    setDraft(headerInfo);
  }, [headerInfo]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "p") {
        e.preventDefault();
        triggerPrint();
      }
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const isLandscape = mode.kind === "compare";

  const triggerPrint = () => {
    onUpdateHeader(draft);
    // Toggle a class on body so print stylesheet picks orientation
    if (isLandscape) document.body.classList.add("print-landscape");
    else document.body.classList.remove("print-landscape");
    setTimeout(() => window.print(), 50);
  };

  const today = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const title =
    mode.kind === "single"
      ? mode.label
      : `학과 비교 (${mode.items.length}개)`;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="no-print absolute inset-0 bg-ink-900/60"
        onClick={onClose}
      />

      <div className="no-print absolute inset-x-0 top-0 z-10 border-b border-ink-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-500 sm:text-xs">
              PDF 미리보기 {isLandscape && "· 가로"}
            </p>
            <h2 className="truncate text-sm font-bold text-ink-900 sm:text-base">
              {title}
            </h2>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={triggerPrint}
              className="inline-flex items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-2 text-xs font-medium text-white hover:bg-indigo-700 sm:gap-2 sm:px-4 sm:text-sm"
            >
              <PrinterIcon />
              <span className="hidden sm:inline">인쇄 / PDF 저장</span>
              <span className="sm:hidden">인쇄</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-md border border-ink-200 bg-white px-3 py-2 text-xs text-ink-700 hover:bg-ink-100 sm:px-4 sm:text-sm"
            >
              닫기
            </button>
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-4 pb-3 sm:px-6">
          <div className="grid gap-2 sm:gap-3 md:grid-cols-3">
            <HeaderField
              label="학교명"
              placeholder="예: ○○고등학교"
              value={draft.schoolName}
              onChange={(v) => setDraft({ ...draft, schoolName: v })}
            />
            <HeaderField
              label="상담교사"
              placeholder="예: 홍길동"
              value={draft.counselor}
              onChange={(v) => setDraft({ ...draft, counselor: v })}
            />
            <HeaderField
              label="학생"
              placeholder="예: 김민수"
              value={draft.student}
              onChange={(v) => setDraft({ ...draft, student: v })}
            />
          </div>
          <label className="mt-2 block">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-500">
              상담 내용 기록
            </span>
            <textarea
              value={draft.notes}
              onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
              rows={3}
              placeholder="예: 학생의 관심 학과, 권장 방향, 추가 안내사항 등을 자유롭게 작성하세요. 줄바꿈도 그대로 출력됩니다."
              className="mt-0.5 w-full resize-y rounded-md border border-ink-200 bg-white px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-200"
            />
          </label>
        </div>
      </div>

      <div className="absolute inset-0 overflow-auto px-4 pb-12 pt-60 sm:pt-56">
        <div className={`print-area ${isLandscape ? "a4-landscape" : "a4-preview"}`}>
          <PrintHeader title={title} today={today} info={draft} />
          {draft.notes.trim() && <NotesSection notes={draft.notes} />}
          {mode.kind === "single" && <File2Print rows={mode.rows} />}
          {mode.kind === "compare" && <ComparePrint items={mode.items} />}
          <PrintFooter />
        </div>
      </div>
    </div>
  );
}

function NotesSection({ notes }: { notes: string }) {
  return (
    <section className="mb-6 rounded-md border border-indigo-200 bg-indigo-50/40 p-4">
      <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-indigo-700">
        상담 내용
      </h3>
      <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-ink-900">
        {notes}
      </p>
    </section>
  );
}

function HeaderField({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-500">
        {label}
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-0.5 w-full rounded-md border border-ink-200 bg-white px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-200"
      />
    </label>
  );
}

function PrintHeader({
  title,
  today,
  info,
}: {
  title: string;
  today: string;
  info: HeaderInfo;
}) {
  const hasInfo = info.schoolName || info.counselor || info.student;
  return (
    <header className="mb-6 border-b-2 border-indigo-600 pb-4">
      <div className="flex items-baseline justify-between">
        <p className="text-xs font-semibold tracking-wider text-indigo-700">
          {info.schoolName || "2028학년도 권장과목 안내"}
        </p>
        <p className="text-xs text-ink-500">{today}</p>
      </div>
      <h1 className="mt-1 text-2xl font-bold text-ink-900">{title}</h1>
      {hasInfo && (
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs text-ink-700">
          {info.student && (
            <span>
              <b className="font-semibold text-ink-500">학생</b> {info.student}
            </span>
          )}
          {info.counselor && (
            <span>
              <b className="font-semibold text-ink-500">상담교사</b>{" "}
              {info.counselor}
            </span>
          )}
        </div>
      )}
    </header>
  );
}

function PrintFooter() {
  return (
    <footer className="mt-8 border-t border-ink-200 pt-3 text-[10px] text-ink-500">
      <p>
        ※ 본 자료는 2028학년도 권역별 대학별 권장과목(반영과목) 및 계열별 대표
        모집단위별 반영과목(권장과목)을 바탕으로 작성되었습니다.
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
        <div key={idx} className="rounded-md border border-ink-200 p-4">
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
                  <td className="py-1.5 text-ink-900">
                    <BulletText text={r.핵심과목} />
                  </td>
                </tr>
              )}
              {r.권장과목 && (
                <tr className="align-top">
                  <th className="w-20 py-1.5 pr-3 text-left text-xs font-semibold text-cyan-700">
                    권장과목
                  </th>
                  <td className="py-1.5 text-ink-900">
                    <BulletText text={r.권장과목} />
                  </td>
                </tr>
              )}
              {r.비고 && (
                <tr className="align-top">
                  <th className="w-20 py-1.5 pr-3 text-left text-xs font-semibold text-ink-500">
                    비고
                  </th>
                  <td className="py-1.5 text-xs text-ink-700">
                    <BulletText text={r.비고} />
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

function ComparePrint({ items }: { items: CartItem[] }) {
  const cols = items.length;
  const widthPct = Math.floor(100 / (cols + 1));
  return (
    <section>
      <p className="mb-3 text-xs text-ink-500">
        선택한 학과 {cols}개의 권장과목을 한 페이지에 비교한 표입니다.
      </p>
      <table className="w-full border-collapse text-[11px]">
        <thead>
          <tr className="border-y-2 border-ink-700 bg-ink-50">
            <th
              className="w-24 px-2 py-2 text-left text-[10px] font-bold text-ink-900"
              style={{ width: `${widthPct}%` }}
            >
              항목
            </th>
            {items.map((it) => (
              <th
                key={it.id}
                className="border-l border-ink-100 px-2 py-2 text-left align-top text-[11px] font-bold text-ink-900"
                style={{ width: `${widthPct}%` }}
              >
                <div>{it.row.대학명}</div>
                <div className="text-[10px] font-normal text-ink-500">
                  {[it.row.단과대_계열, it.row.학과]
                    .filter(Boolean)
                    .join(" · ") || "—"}
                </div>
                <div className="text-[10px] font-normal text-ink-500">
                  {it.row.권역} · {it.row.지역}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <CompareRow
            label="핵심과목"
            labelColor="text-indigo-700"
            items={items}
            value={(r) => r.핵심과목}
          />
          <CompareRow
            label="권장과목"
            labelColor="text-cyan-700"
            items={items}
            value={(r) => r.권장과목}
          />
          <CompareRow
            label="비고"
            labelColor="text-ink-500"
            items={items}
            value={(r) => r.비고}
            small
          />
        </tbody>
      </table>
    </section>
  );
}

function CompareRow({
  label,
  labelColor,
  items,
  value,
  small,
}: {
  label: string;
  labelColor: string;
  items: CartItem[];
  value: (r: File2Row) => string;
  small?: boolean;
}) {
  const anyValue = items.some((it) => value(it.row));
  if (!anyValue) return null;
  return (
    <tr className="border-b border-ink-100 align-top">
      <th
        className={`px-2 py-2 text-left text-[10px] font-bold ${labelColor}`}
      >
        {label}
      </th>
      {items.map((it) => (
        <td
          key={it.id}
          className={`border-l border-ink-100 px-2 py-2 ${
            small ? "text-[10px] text-ink-700" : "text-[11px] text-ink-900"
          } whitespace-pre-wrap`}
        >
          {value(it.row) || "—"}
        </td>
      ))}
    </tr>
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
