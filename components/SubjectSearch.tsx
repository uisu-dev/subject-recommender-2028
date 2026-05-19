"use client";

import { useEffect, useMemo, useState } from "react";
import { SUBJECTS, domainOf, evaluateMatch, type Domain } from "@/lib/subjects";
import type { File2Row } from "@/lib/types";
import type { File2RowWithParsed } from "@/lib/data";
import { rowId } from "@/lib/data";
import FilterChips from "./FilterChips";
import { regionList, areaList } from "@/lib/data";
import { CONTACT_EMAIL, SCHOOLS, loadActiveId, saveActiveId } from "@/lib/schools";
import SchoolSetup from "./SchoolSetup";

type Props = {
  rows: File2RowWithParsed[];
  region: string;
  area: string;
  setRegion: (v: string) => void;
  setArea: (v: string) => void;
  cartIds: Set<string>;
  onToggleCart: (row: File2Row, idx: number) => void;
  onPick: (rows: File2Row[], label: string) => void;
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

const DEFAULT_TAKEN = new Set([
  "국어",
  "영어",
  "한국사",
  "대수",
  "확률과 통계",
  "미적분Ⅰ",
]);

export default function SubjectSearch({
  rows,
  region,
  area,
  setRegion,
  setArea,
  cartIds,
  onToggleCart,
  onPick,
}: Props) {
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(DEFAULT_TAKEN)
  );
  const [statusFilter, setStatusFilter] = useState<
    "all" | "match-only" | "match-and-open"
  >("match-and-open");
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showSetup, setShowSetup] = useState(false);

  useEffect(() => {
    setActiveId(loadActiveId());
  }, []);

  const handleActiveChange = (id: string | null) => {
    setActiveId(id);
    saveActiveId(id);
  };

  const activeSchool = useMemo(
    () => SCHOOLS.find((s) => s.id === activeId) || null,
    [activeId]
  );

  const offeredSet = useMemo(
    () => (activeSchool ? new Set(activeSchool.offeredSubjects) : null),
    [activeSchool]
  );

  useEffect(() => {
    if (!offeredSet) return;
    setSelected((prev) => {
      const next = new Set<string>();
      for (const s of prev) if (offeredSet.has(s)) next.add(s);
      return next;
    });
  }, [activeSchool?.id]);

  const studentDomains = useMemo(() => {
    const ds = new Set<Domain>();
    for (const s of selected) {
      const d = domainOf(s);
      if (d) ds.add(d);
    }
    return ds;
  }, [selected]);

  const evaluated = useMemo(() => {
    let pool = rows;
    if (region) pool = pool.filter((r) => r.권역 === region);
    if (area) pool = pool.filter((r) => r.지역 === area);
    if (query.trim()) {
      const q = query.trim().toLowerCase().replace(/\s+/g, "");
      pool = pool.filter((r) => {
        const hay = `${r.대학명}${r.단과대_계열}${r.학과}`
          .toLowerCase()
          .replace(/\s+/g, "");
        return hay.includes(q);
      });
    }
    const out = pool.map((r) => ({
      r,
      origIdx: rows.indexOf(r),
      result: evaluateMatch(selected, studentDomains, r.parsedCore, r.parsedRec),
    }));
    out.sort((a, b) => {
      const order = { ok: 0, open: 1, partial: 2, unmet: 3, "no-data": 4 };
      const o = order[a.result.status] - order[b.result.status];
      if (o !== 0) return o;
      const recDiff = b.result.recMet - a.result.recMet;
      if (recDiff !== 0) return recDiff;
      return a.r.대학명.localeCompare(b.r.대학명, "ko");
    });
    return out;
  }, [rows, selected, studentDomains, region, area, query]);

  const filtered = useMemo(() => {
    if (statusFilter === "all") return evaluated;
    if (statusFilter === "match-only")
      return evaluated.filter((e) => e.result.status === "ok");
    return evaluated.filter(
      (e) => e.result.status === "ok" || e.result.status === "open"
    );
  }, [evaluated, statusFilter]);

  const counts = useMemo(() => {
    const c = { ok: 0, open: 0, partial: 0, unmet: 0, "no-data": 0 };
    for (const e of evaluated) c[e.result.status]++;
    return c;
  }, [evaluated]);

  const toggleSubject = (name: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const resetSubjects = () => {
    if (offeredSet) {
      const next = new Set<string>();
      for (const s of DEFAULT_TAKEN) if (offeredSet.has(s)) next.add(s);
      setSelected(next);
    } else {
      setSelected(new Set(DEFAULT_TAKEN));
    }
  };
  const clearSubjects = () => setSelected(new Set());

  return (
    <div className="grid gap-6 lg:grid-cols-[320px,1fr]">
      <aside className="lg:sticky lg:top-4 lg:self-start space-y-3">
        <div className="rounded-xl border border-ink-200 bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-bold text-ink-900">고등학교</h3>
            <button
              onClick={() => setShowSetup(true)}
              className="rounded border border-ink-200 bg-white px-2 py-0.5 text-[11px] text-ink-700 hover:bg-ink-100"
            >
              목록 보기
            </button>
          </div>
          {SCHOOLS.length === 0 ? (
            <p className="text-[11px] leading-relaxed text-ink-500">
              아직 등록된 학교가 없습니다. 학교 등록 요청은{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-medium text-indigo-700 hover:underline"
              >
                {CONTACT_EMAIL}
              </a>
            </p>
          ) : (
            <select
              value={activeId ?? ""}
              onChange={(e) => handleActiveChange(e.target.value || null)}
              className="w-full rounded-md border border-ink-200 bg-white px-2 py-1.5 text-sm focus:border-indigo-500 focus:outline-none"
            >
              <option value="">전체 과목 표시 (학교 미선택)</option>
              {SCHOOLS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          )}
          {activeSchool && (
            <p className="mt-2 text-[10px] text-ink-500">
              개설 {activeSchool.offeredSubjects.length}과목만 표시
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
            로 개설 과목을 보내주세요.
          </p>
        </div>

        <div className="rounded-xl border border-ink-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-ink-900">이수한 과목</h3>
            <div className="flex gap-1.5">
              <button
                onClick={resetSubjects}
                className="rounded border border-ink-200 px-2 py-0.5 text-[10px] text-ink-700 hover:bg-ink-50"
              >
                기본값
              </button>
              <button
                onClick={clearSubjects}
                className="rounded border border-ink-200 px-2 py-0.5 text-[10px] text-ink-700 hover:bg-ink-50"
              >
                전체 해제
              </button>
            </div>
          </div>
          <p className="mb-3 text-[11px] leading-relaxed text-ink-500">
            학생이 이수했거나 이수할 과목을 체크하면, 핵심과목 요건이 충족되는
            학과가 우선 노출됩니다.
          </p>
          <div className="space-y-3">
            {DOMAIN_ORDER.map((d) => {
              const subs = SUBJECTS.filter((s) => s.domain === d).filter(
                (s) => !offeredSet || offeredSet.has(s.name)
              );
              if (subs.length === 0) return null;
              return (
                <div key={d}>
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-ink-500">
                    {d}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {subs.map((s) => {
                      const on = selected.has(s.name);
                      return (
                        <button
                          key={s.name}
                          onClick={() => toggleSubject(s.name)}
                          className={`rounded-full border px-2.5 py-1 text-[11px] transition ${
                            on
                              ? "border-indigo-600 bg-indigo-600 text-white"
                              : "border-ink-200 bg-white text-ink-700 hover:bg-ink-50"
                          }`}
                        >
                          {s.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          {offeredSet && offeredSet.size === 0 && (
            <p className="mt-3 rounded bg-amber-50 p-2 text-[11px] text-amber-700">
              이 학교에 개설된 과목이 없습니다. 설정에서 과목을 선택해주세요.
            </p>
          )}
        </div>
      </aside>

      <div>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <FilterChips
            label="권역"
            options={regionList}
            value={region}
            onChange={setRegion}
          />
          <FilterChips
            label="지역"
            options={areaList}
            value={area}
            onChange={setArea}
          />
          <input
            type="search"
            placeholder="대학·학과명으로 추가 필터"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="rounded-full border border-ink-200 bg-white px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <StatusChip
            active={statusFilter === "match-and-open"}
            onClick={() => setStatusFilter("match-and-open")}
            label={`충족 + 자율 (${counts.ok + counts.open})`}
            color="bg-emerald-50 text-emerald-700 border-emerald-200"
            activeColor="bg-emerald-600 text-white border-emerald-600"
          />
          <StatusChip
            active={statusFilter === "match-only"}
            onClick={() => setStatusFilter("match-only")}
            label={`충족만 (${counts.ok})`}
            color="bg-emerald-50 text-emerald-700 border-emerald-200"
            activeColor="bg-emerald-600 text-white border-emerald-600"
          />
          <StatusChip
            active={statusFilter === "all"}
            onClick={() => setStatusFilter("all")}
            label={`전체 (${evaluated.length})`}
            color="bg-ink-50 text-ink-700 border-ink-200"
            activeColor="bg-ink-700 text-white border-ink-700"
          />
          <span className="ml-auto text-xs text-ink-500">
            일부 충족 {counts.partial} · 미충족 {counts.unmet} · 정보없음{" "}
            {counts["no-data"]}
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-ink-200 bg-white p-10 text-center text-ink-500">
            조건에 맞는 학과가 없습니다.
          </div>
        ) : (
          <ul className="space-y-2">
            {filtered.slice(0, 100).map(({ r, origIdx, result }) => {
              const id = rowId(r, origIdx);
              const inCart = cartIds.has(id);
              const dept =
                [r.단과대_계열, r.학과].filter(Boolean).join(" · ") || "—";
              return (
                <li
                  key={id}
                  className="flex items-start gap-3 rounded-lg border border-ink-200 bg-white p-3 shadow-sm"
                >
                  <input
                    type="checkbox"
                    checked={inCart}
                    onChange={() => onToggleCart(r, origIdx)}
                    className="mt-1 h-4 w-4 cursor-pointer rounded border-ink-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                      <h4 className="text-sm font-bold text-ink-900">
                        {r.대학명}
                      </h4>
                      <span className="text-xs text-ink-700">· {dept}</span>
                      <StatusBadge status={result.status} />
                      <span className="ml-auto text-[10px] text-ink-500">
                        {r.권역} · {r.지역}
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-ink-700">
                      {result.status === "ok" && (
                        <span className="text-emerald-700">
                          핵심과목 요건 충족 ({result.coreMet}/{result.coreTotal}
                          ){result.recTotal > 0 &&
                            ` · 권장 ${result.recMet}/${result.recTotal}`}
                        </span>
                      )}
                      {result.status === "open" && (
                        <span className="text-emerald-600">
                          {result.reason}
                          {result.recTotal > 0 &&
                            ` · 권장 ${result.recMet}/${result.recTotal}`}
                        </span>
                      )}
                      {result.status === "partial" && (
                        <span className="text-amber-700">
                          핵심 {result.coreMet}/{result.coreTotal} · 부족:{" "}
                          {result.missingCore.join(", ")}
                        </span>
                      )}
                      {result.status === "unmet" && (
                        <span className="text-rose-700">
                          핵심과목 부족: {result.missingCore.join(", ")}
                        </span>
                      )}
                      {result.status === "no-data" && (
                        <span className="text-ink-500">{result.reason}</span>
                      )}
                    </div>
                    {(r.핵심과목 || r.권장과목) && (
                      <details className="mt-1 text-xs text-ink-700">
                        <summary className="cursor-pointer select-none text-[11px] text-ink-500 hover:text-ink-900">
                          상세 보기
                        </summary>
                        <div className="mt-1 space-y-1">
                          {r.핵심과목 && (
                            <p>
                              <b className="text-indigo-700">핵심</b>{" "}
                              <span className="whitespace-pre-wrap">
                                {r.핵심과목}
                              </span>
                            </p>
                          )}
                          {r.권장과목 && (
                            <p>
                              <b className="text-cyan-700">권장</b>{" "}
                              <span className="whitespace-pre-wrap">
                                {r.권장과목}
                              </span>
                            </p>
                          )}
                          {r.비고 && (
                            <p className="text-[11px] text-ink-500">
                              ※ {r.비고}
                            </p>
                          )}
                        </div>
                      </details>
                    )}
                  </div>
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
                </li>
              );
            })}
          </ul>
        )}
        {filtered.length > 100 && (
          <p className="mt-3 text-center text-xs text-ink-500">
            상위 100개만 표시됨 · 권역·지역·검색어로 좁혀보세요.
          </p>
        )}
      </div>

      {showSetup && (
        <SchoolSetup
          activeId={activeId}
          onSetActive={(id) => {
            handleActiveChange(id);
            setShowSetup(false);
          }}
          onClose={() => setShowSetup(false)}
        />
      )}
    </div>
  );
}

function StatusChip({
  active,
  onClick,
  label,
  color,
  activeColor,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  color: string;
  activeColor: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs font-medium ${
        active ? activeColor : color
      }`}
    >
      {label}
    </button>
  );
}

function StatusBadge({ status }: { status: string }) {
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
      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${m.cls}`}
    >
      {m.label}
    </span>
  );
}
