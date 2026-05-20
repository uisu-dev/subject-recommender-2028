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
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [profileOpen, setProfileOpen] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [query, setQuery] = useState("");
  const [collapsedDomains, setCollapsedDomains] = useState<Set<Domain>>(
    () => new Set(DOMAIN_ORDER)
  );

  // Sync with localStorage on mount + on changes
  useEffect(() => {
    setActiveId(loadActiveId());
    setSelected(loadTakenSubjects());
  }, []);

  useEffect(() => {
    saveTakenSubjects(selected);
  }, [selected]);

  const handleActiveChange = (id: string | null) => {
    setActiveId(id);
    saveActiveId(id);
    // Reset selected when school changes
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

  const profileSummary = useMemo(() => {
    const schoolLabel = activeSchool?.name || "학교 미선택";
    const count = selected.size;
    return { schoolLabel, count };
  }, [activeSchool, selected]);

  return (
    <div className="space-y-4">
      {/* 학생 프로필 카드 */}
      <section className="rounded-xl border border-indigo-200 bg-indigo-50/40 shadow-sm">
        <div className="flex items-start justify-between gap-3 p-4">
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-bold text-indigo-900">학생 프로필</h3>
            <p className="mt-0.5 text-xs text-ink-700">
              학교: <b className="text-ink-900">{profileSummary.schoolLabel}</b>
              <span className="mx-2 text-ink-300">·</span>
              이수 과목: <b className="text-ink-900">{profileSummary.count}개</b>
            </p>
            {selected.size > 0 && !profileOpen && (
              <p className="mt-1.5 line-clamp-2 text-[11px] text-ink-500">
                {Array.from(selected).join(" · ")}
              </p>
            )}
          </div>
          <button
            onClick={() => setProfileOpen((p) => !p)}
            className="shrink-0 rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700"
          >
            {profileOpen ? "접기" : "편집"}
          </button>
        </div>

        {profileOpen && (
          <div className="border-t border-indigo-200 p-4">
            {/* 학교 선택 */}
            <div className="mb-4">
              <label className="block">
                <span className="text-[10px] font-bold uppercase tracking-wider text-ink-500">
                  고등학교 선택
                </span>
                <div className="mt-1 flex gap-2">
                  <select
                    value={activeId ?? ""}
                    onChange={(e) => handleActiveChange(e.target.value || null)}
                    className="flex-1 rounded-md border border-ink-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="">학교 선택 안 함 (전체 과목)</option>
                    {SCHOOLS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => setShowSetup(true)}
                    className="shrink-0 rounded-md border border-ink-200 bg-white px-3 py-2 text-xs text-ink-700 hover:bg-ink-100"
                  >
                    {adminMode ? "관리" : "목록 보기"}
                  </button>
                </div>
                <p className="mt-1.5 text-[10px] leading-relaxed text-ink-500">
                  내 학교가 없다면{" "}
                  <a
                    href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("[2028 권장과목] 학교 추가 요청")}`}
                    className="text-indigo-700 hover:underline"
                  >
                    {CONTACT_EMAIL}
                  </a>
                  로 개설 과목을 보내주세요.
                </p>
              </label>
            </div>

            {/* 이수 과목 체크 */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-ink-500">
                  이수한 과목 (체크한 과목이 결과에서 하이라이트됩니다)
                </span>
                <div className="flex gap-2 text-[10px]">
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
                  <span className="text-ink-300">·</span>
                  <button
                    onClick={clearSubjects}
                    className="text-ink-500 hover:text-rose-700 hover:underline"
                  >
                    전체 해제
                  </button>
                </div>
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
                        className="mb-1 flex w-full items-center justify-between rounded px-1 py-0.5 hover:bg-white/60"
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
            </div>
          </div>
        )}
      </section>

      {/* 검색 + 필터 */}
      <div className="space-y-3">
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

      {/* 결과 */}
      {queryTokens.length === 0 ? (
        <div className="rounded-xl border border-dashed border-ink-200 bg-white p-10 text-center text-ink-500">
          대학명·학과명을 검색하면 결과가 표시됩니다.
          {selected.size === 0 && (
            <p className="mt-2 text-xs">
              상단 '편집'으로 학교와 이수 과목을 먼저 설정하면, 결과에서 본인이
              이수한 과목이 <mark className="rounded bg-emerald-100 px-1 text-emerald-800 font-semibold">초록색</mark>으로 강조됩니다.
            </p>
          )}
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
        <p className="text-center text-xs text-ink-500">
          상위 100개만 표시됨 · 권역·지역·검색어로 좁혀보세요.
        </p>
      )}

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
