"use client";

import { useEffect, useMemo, useState } from "react";
import {
  SUBJECTS,
  domainOf,
  evaluateMatch,
  type Domain,
} from "@/lib/subjects";
import type { File2Row } from "@/lib/types";
import {
  rowId,
  regionList,
  getAreasForRegion,
  tokenizeQuery,
  referencedSubjects,
  type File2RowWithParsed,
} from "@/lib/data";
import {
  CONTACT_EMAIL,
  SCHOOLS,
  SCHOOL_REGIONS,
  getSchoolsByRegion,
  getRegionOfSchool,
  loadActiveId,
  saveActiveId,
  loadTakenSubjects,
  saveTakenSubjects,
} from "@/lib/schools";
import FilterChips from "./FilterChips";
import SchoolSetup from "./SchoolSetup";
import HighlightedText from "./HighlightedText";

type Props = {
  rows: File2RowWithParsed[];
  region: string;
  area: string;
  setRegion: (v: string) => void;
  setArea: (v: string) => void;
  cartIds: Set<string>;
  onToggleCart: (row: File2Row, idx: number) => void;
  onPick: (rows: File2Row[], label: string) => void;
  adminMode: boolean;
};

const DOMAIN_ORDER: Domain[] = [
  "국어",
  "수학",
  "영어",
  "사회",
  "과학",
  "한국사",
  "기타",
];

export default function PersonalizedGuide({
  rows,
  region,
  area,
  setRegion,
  setArea,
  cartIds,
  onToggleCart,
  onPick,
  adminMode,
}: Props) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [schoolRegion, setSchoolRegion] = useState<string>("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showSetup, setShowSetup] = useState(false);
  const [query, setQuery] = useState("");
  const [collapsedDomains, setCollapsedDomains] = useState<Set<Domain>>(
    () => new Set(DOMAIN_ORDER)
  );

  useEffect(() => {
    const id = loadActiveId();
    setActiveId(id);
    setSchoolRegion(getRegionOfSchool(id));
    setSelected(loadTakenSubjects());
  }, []);

  const schoolsInRegion = useMemo(
    () => getSchoolsByRegion(schoolRegion),
    [schoolRegion]
  );

  const handleSchoolRegionChange = (next: string) => {
    setSchoolRegion(next);
    // Clear school if current school doesn't belong to the new region
    if (next && activeId) {
      const stillValid = SCHOOLS.some(
        (s) => s.id === activeId && s.region === next
      );
      if (!stillValid) handleActiveChange(null);
    }
  };

  useEffect(() => {
    saveTakenSubjects(selected);
  }, [selected]);

  const handleActiveChange = (id: string | null) => {
    setActiveId(id);
    saveActiveId(id);
    // Keep schoolRegion in sync when picking a real school (not on clear)
    if (id) {
      const r = getRegionOfSchool(id);
      if (r) setSchoolRegion(r);
    }
    setSelected(new Set());
    saveTakenSubjects(new Set());
  };

  const activeSchool = useMemo(
    () => SCHOOLS.find((s) => s.id === activeId) || null,
    [activeId]
  );
  const offeredSet = useMemo(
    () => (activeSchool ? new Set(activeSchool.offeredSubjects) : null),
    [activeSchool]
  );

  const toggleSubject = (name: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const clearSubjects = () => setSelected(new Set());

  const toggleDomain = (d: Domain) => {
    setCollapsedDomains((prev) => {
      const next = new Set(prev);
      if (next.has(d)) next.delete(d);
      else next.add(d);
      return next;
    });
  };
  const expandAll = () => setCollapsedDomains(new Set());
  const collapseAll = () => setCollapsedDomains(new Set(DOMAIN_ORDER));

  const queryTokens = useMemo(() => tokenizeQuery(query), [query]);
  const availableAreas = useMemo(() => getAreasForRegion(region), [region]);

  const studentDomains = useMemo(() => {
    const ds = new Set<Domain>();
    for (const s of selected) {
      const d = domainOf(s);
      if (d) ds.add(d);
    }
    return ds;
  }, [selected]);

  const results = useMemo(() => {
    let pool = rows;
    if (region) pool = pool.filter((r) => r.권역 === region);
    if (area) pool = pool.filter((r) => r.지역 === area);
    if (queryTokens.length === 0) return [];
    pool = pool.filter((r) => {
      const hay = `${r.대학명}${r.단과대_계열}${r.학과}${r.권역}${r.지역}`
        .toLowerCase()
        .replace(/\s+/g, "");
      return queryTokens.every((tok) => hay.includes(tok));
    });
    return pool.map((r) => ({
      r,
      origIdx: rows.indexOf(r),
      result: evaluateMatch(selected, studentDomains, r.parsedCore, r.parsedRec),
    }));
  }, [rows, queryTokens, region, area, selected, studentDomains]);

  return (
    <div className="grid gap-4 sm:gap-6 lg:grid-cols-[320px,1fr]">
      {/* ─────────────── 좌측: 학생 프로필 ─────────────── */}
      <aside className="space-y-3 lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:self-start lg:overflow-y-auto lg:pb-2 lg:pr-1">
        {/* 학교 선택 */}
        <div className="rounded-xl border border-indigo-200 bg-indigo-50/40 p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-bold text-indigo-900">학생 프로필</h3>
            <button
              onClick={() => setShowSetup(true)}
              className="rounded border border-ink-200 bg-white px-2 py-0.5 text-[11px] text-ink-700 hover:bg-ink-100"
            >
              {adminMode ? "관리" : "목록 보기"}
            </button>
          </div>
          <div className="space-y-2">
            <label className="block">
              <span className="text-[10px] font-bold uppercase tracking-wider text-ink-500">
                지역
              </span>
              <select
                value={schoolRegion}
                onChange={(e) => handleSchoolRegionChange(e.target.value)}
                className="mt-1 w-full rounded-md border border-ink-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              >
                <option value="">전체 지역</option>
                {SCHOOL_REGIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-[10px] font-bold uppercase tracking-wider text-ink-500">
                고등학교
              </span>
              <select
                value={activeId ?? ""}
                onChange={(e) => handleActiveChange(e.target.value || null)}
                className="mt-1 w-full rounded-md border border-ink-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              >
                <option value="">
                  {schoolRegion
                    ? `${schoolRegion} 학교 선택…`
                    : "학교 선택 안 함"}
                </option>
                {schoolsInRegion.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {activeSchool && (
            <p className="mt-2 text-[10px] text-ink-500">
              개설 {activeSchool.offeredSubjects.length}과목
            </p>
          )}
          <p className="mt-2 text-[10px] leading-relaxed text-ink-500">
            내 학교가 없다면{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("[2028 권장과목] 학교 추가 요청")}`}
              className="text-indigo-700 hover:underline"
            >
              {CONTACT_EMAIL}
            </a>
          </p>
        </div>

        {/* 이수 과목 체크 */}
        <div className="rounded-xl border border-ink-200 bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-bold text-ink-900">
              이수한 과목{" "}
              <span className="text-[10px] font-normal text-ink-500">
                ({selected.size}개 선택)
              </span>
            </h3>
            <button
              onClick={clearSubjects}
              className="rounded border border-ink-200 px-2 py-0.5 text-[10px] text-ink-700 hover:bg-rose-50 hover:text-rose-700"
            >
              전체 해제
            </button>
          </div>
          <p className="mb-2 text-[11px] leading-relaxed text-ink-500">
            체크한 과목이 우측 검색 결과의 핵심·권장과목 텍스트에서{" "}
            <mark className="rounded bg-emerald-100 px-1 text-emerald-800 font-semibold">
              초록색
            </mark>
            으로 표시됩니다.
          </p>
          <div className="mb-2 flex justify-end gap-2 text-[10px]">
            <button
              onClick={expandAll}
              className="text-ink-500 hover:text-ink-900 hover:underline"
            >
              전체 펼치기
            </button>
            <span className="text-ink-300">·</span>
            <button
              onClick={collapseAll}
              className="text-ink-500 hover:text-ink-900 hover:underline"
            >
              전체 접기
            </button>
          </div>
          <div className="space-y-2">
            {DOMAIN_ORDER.map((d) => {
              const subs = SUBJECTS.filter((s) => s.domain === d).filter(
                (s) => {
                  if (offeredSet) return offeredSet.has(s.name);
                  return referencedSubjects.has(s.name);
                }
              );
              if (subs.length === 0) return null;
              const isCollapsed = collapsedDomains.has(d);
              const checkedCount = subs.filter((s) => selected.has(s.name))
                .length;
              return (
                <div key={d}>
                  <button
                    onClick={() => toggleDomain(d)}
                    className="mb-1 flex w-full items-center justify-between rounded px-1 py-0.5 hover:bg-ink-50"
                    aria-expanded={!isCollapsed}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider text-ink-500">
                      {d}
                      <span className="ml-1 normal-case text-ink-400">
                        ({checkedCount > 0 ? `${checkedCount}/` : ""}
                        {subs.length})
                      </span>
                    </span>
                    <span className="text-[10px] text-ink-400">
                      {isCollapsed ? "▶" : "▼"}
                    </span>
                  </button>
                  {!isCollapsed && (
                    <div className="flex flex-wrap gap-1.5">
                      {subs.map((s) => {
                        const on = selected.has(s.name);
                        return (
                          <button
                            key={s.name}
                            onClick={() => toggleSubject(s.name)}
                            className={`rounded-full border px-2.5 py-1 text-[11px] transition ${
                              on
                                ? "border-emerald-600 bg-emerald-600 text-white"
                                : "border-ink-200 bg-white text-ink-700 hover:bg-ink-50"
                            }`}
                          >
                            {s.name}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {offeredSet && offeredSet.size === 0 && (
            <p className="mt-3 rounded bg-amber-50 p-2 text-[11px] text-amber-700">
              이 학교에 개설된 과목이 없습니다.
            </p>
          )}
        </div>
      </aside>

      {/* ─────────────── 우측: 대학/학과 검색 + 결과 ─────────────── */}
      <div>
        <div className="mb-3 space-y-3">
          <input
            type="search"
            placeholder="대학명·학과명을 입력하세요 (예: 서울대 컴퓨터, 경북대 독어독문)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-xl border border-ink-200 bg-white px-5 py-3 text-base placeholder:text-ink-500 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            autoComplete="off"
          />
          <div className="flex flex-wrap items-center gap-2">
            <FilterChips
              label="권역"
              options={regionList}
              value={region}
              onChange={setRegion}
            />
            <FilterChips
              label="지역"
              options={availableAreas}
              value={area}
              onChange={setArea}
            />
            {query && (
              <span className="ml-auto text-sm text-ink-500">
                {results.length}건
              </span>
            )}
          </div>
        </div>

        {queryTokens.length === 0 ? (
          <div className="rounded-xl border border-dashed border-ink-200 bg-white p-10 text-center text-ink-500">
            <p>좌측에서 학교·이수 과목을 설정한 뒤 대학·학과를 검색해보세요.</p>
            <p className="mt-2 text-xs">
              체크한 과목은 결과의 핵심·권장과목 텍스트에서{" "}
              <mark className="rounded bg-emerald-100 px-1 text-emerald-800 font-semibold">
                초록색
              </mark>
              으로 강조됩니다.
            </p>
          </div>
        ) : results.length === 0 ? (
          <div className="rounded-xl border border-dashed border-ink-200 bg-white p-10 text-center text-ink-500">
            검색 결과가 없습니다.
          </div>
        ) : (
          <ul className="space-y-2">
            {results.slice(0, 100).map(({ r, origIdx, result }) => {
              const id = rowId(r, origIdx);
              const inCart = cartIds.has(id);
              const dept =
                [r.단과대_계열, r.학과].filter(Boolean).join(" · ") || "—";
              return (
                <li
                  key={id}
                  className="rounded-lg border border-ink-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start gap-2.5">
                    <input
                      type="checkbox"
                      checked={inCart}
                      onChange={() => onToggleCart(r, origIdx)}
                      className="mt-1 h-4 w-4 shrink-0 cursor-pointer rounded border-ink-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <h4 className="min-w-0 text-sm leading-snug text-ink-900">
                          <span className="font-bold">{r.대학명}</span>
                          {dept !== "—" && (
                            <span className="ml-1 font-normal text-ink-700">
                              · {dept}
                            </span>
                          )}
                        </h4>
                        <button
                          onClick={() =>
                            onPick(
                              [r],
                              `${r.대학명} · ${r.학과 || r.단과대_계열}`
                            )
                          }
                          className="shrink-0 text-xs text-indigo-600 hover:underline"
                        >
                          출력
                        </button>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-ink-500">
                        <MatchBadge status={result.status} />
                        <span>
                          {r.권역} · {r.지역}
                        </span>
                        {selected.size > 0 && result.status === "ok" && (
                          <span className="text-emerald-700">
                            ✓ 핵심 충족 ({result.coreMet}/{result.coreTotal})
                            {result.recTotal > 0 &&
                              ` · 권장 ${result.recMet}/${result.recTotal}`}
                          </span>
                        )}
                        {selected.size > 0 && result.status === "partial" && (
                          <span className="text-amber-700">
                            핵심 {result.coreMet}/{result.coreTotal} · 부족:{" "}
                            {result.missingCore.join(", ")}
                          </span>
                        )}
                        {selected.size > 0 && result.status === "unmet" && (
                          <span className="text-rose-700">
                            부족: {result.missingCore.join(", ")}
                          </span>
                        )}
                      </div>
                      <div className="mt-2 space-y-2 text-sm">
                        {r.핵심과목 && (
                          <div>
                            <b className="text-indigo-700 text-xs">핵심</b>{" "}
                            <HighlightedText
                              text={r.핵심과목}
                              highlights={selected}
                            />
                          </div>
                        )}
                        {r.권장과목 && (
                          <div>
                            <b className="text-cyan-700 text-xs">권장</b>{" "}
                            <HighlightedText
                              text={r.권장과목}
                              highlights={selected}
                            />
                          </div>
                        )}
                        {r.비고 && (
                          <p className="text-[11px] text-ink-500 whitespace-pre-wrap break-words">
                            ※ {r.비고}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        {results.length > 100 && (
          <p className="mt-3 text-center text-xs text-ink-500">
            상위 100개만 표시됨 · 권역·지역·검색어로 좁혀보세요.
          </p>
        )}
      </div>

      {showSetup && (
        <SchoolSetup
          activeId={activeId}
          onSetActive={handleActiveChange}
          onClose={() => setShowSetup(false)}
          adminMode={adminMode}
        />
      )}
    </div>
  );
}

function MatchBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    ok: { label: "충족", cls: "bg-emerald-100 text-emerald-700" },
    open: { label: "자율", cls: "bg-sky-100 text-sky-700" },
    partial: { label: "일부", cls: "bg-amber-100 text-amber-700" },
    unmet: { label: "부족", cls: "bg-rose-100 text-rose-700" },
    "no-data": { label: "정보없음", cls: "bg-ink-100 text-ink-500" },
  };
  const m = map[status];
  if (!m) return null;
  return (
    <span
      className={`shrink-0 whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-bold ${m.cls}`}
    >
      {m.label}
    </span>
  );
}
