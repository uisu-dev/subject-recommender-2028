"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  file2Parsed,
  normalize,
  regionList,
  regionAreaMap,
  getAreasForRegion,
  tokenizeQuery,
  rowId,
} from "@/lib/data";
import SearchBox from "@/components/SearchBox";
import UnivDeptResults from "@/components/UnivDeptResults";
import PrintPreview from "@/components/PrintPreview";
import FilterChips from "@/components/FilterChips";
import CartBar from "@/components/CartBar";
import SubjectSearch from "@/components/SubjectSearch";
import AdminLogin from "@/components/AdminLogin";
import ReferenceLinks from "@/components/ReferenceLinks";
import StatsBar from "@/components/StatsBar";
import { trackClick, trackVisit } from "@/lib/track-client";
import type { CartItem, File2Row, HeaderInfo } from "@/lib/types";

type Tab = "univ" | "subject" | "links";
type PrintMode =
  | { kind: "single"; rows: File2Row[]; label: string }
  | { kind: "compare"; items: CartItem[] };

const HEADER_KEY = "subject-recommender:header-info";

export default function Home() {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<Tab>("univ");
  const [region, setRegion] = useState<string>("");
  const [area, setArea] = useState<string>("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [printing, setPrinting] = useState<PrintMode | null>(null);

  const [headerInfo, setHeaderInfo] = useState<HeaderInfo>({
    schoolName: "",
    counselor: "",
    student: "",
    notes: "",
  });
  const [adminMode, setAdminMode] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  useEffect(() => {
    // Track this visit (deduplicated per visitor UUID per day)
    trackVisit();
    // Check admin session
    fetch("/api/admin/check", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setAdminMode(!!d.authenticated))
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => {});
    setAdminMode(false);
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem(HEADER_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setHeaderInfo({
          schoolName: parsed.schoolName || "",
          counselor: parsed.counselor || "",
          student: "",
          notes: "",
        });
      }
    } catch {
      // ignore
    }
  }, []);

  const updateHeader = (next: HeaderInfo) => {
    setHeaderInfo(next);
    try {
      localStorage.setItem(
        HEADER_KEY,
        JSON.stringify({
          schoolName: next.schoolName,
          counselor: next.counselor,
        })
      );
    } catch {
      // ignore
    }
  };

  const queryTokens = useMemo(() => tokenizeQuery(query), [query]);

  const file2Hits = useMemo(() => {
    let pool = file2Parsed;
    if (region) pool = pool.filter((r) => r.권역 === region);
    if (area) pool = pool.filter((r) => r.지역 === area);
    if (queryTokens.length === 0) return [];
    return pool.filter((r) => {
      const hay = normalize(
        `${r.대학명} ${r.단과대_계열} ${r.학과} ${r.권역} ${r.지역}`
      );
      // AND semantics: every token must appear somewhere in the haystack
      return queryTokens.every((tok) => hay.includes(tok));
    });
  }, [queryTokens, region, area]);

  /**
   * When the user picks a new 권역, drop the 지역 if it doesn't belong to that
   * 권역. Selecting "전체" 권역 (empty string) keeps any selected 지역 because
   * it remains valid across the full list.
   */
  const handleRegionChange = (next: string) => {
    setRegion(next);
    if (next && area) {
      const areas = regionAreaMap.get(next);
      if (!areas?.has(area)) setArea("");
    }
  };

  const availableAreas = useMemo(() => getAreasForRegion(region), [region]);

  const cartIds = useMemo(() => new Set(cart.map((c) => c.id)), [cart]);

  // Wraps setPrinting and emits a "click" event per row for stats.
  const openPrint = (mode: PrintMode) => {
    if (mode.kind === "single") {
      for (const r of mode.rows) {
        trackClick(r.대학명, r.학과 || r.단과대_계열 || undefined);
      }
    } else if (mode.kind === "compare") {
      for (const it of mode.items) {
        trackClick(it.row.대학명, it.row.학과 || it.row.단과대_계열 || undefined);
      }
    }
    setPrinting(mode);
  };

  const toggleCart = (row: File2Row, idx: number) => {
    const id = rowId(row, idx);
    setCart((prev) => {
      if (prev.some((c) => c.id === id)) {
        return prev.filter((c) => c.id !== id);
      }
      if (prev.length >= 4) {
        alert("비교는 최대 4개 학과까지 가능합니다.");
        return prev;
      }
      return [...prev, { id, row }];
    });
  };

  return (
    <main className="min-h-screen pb-32">
      <header className="no-print bg-white border-b border-ink-200">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 sm:px-6 sm:py-6 md:flex-row md:items-start md:justify-between md:gap-6">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <h1 className="flex items-center">
                <Image
                  src="/logo.png"
                  alt="대학가자.kr"
                  width={2172}
                  height={724}
                  priority
                  sizes="(max-width: 640px) 200px, 280px"
                  className="h-14 w-auto sm:h-16"
                />
                <span className="sr-only">대학가자.kr</span>
              </h1>
              <span className="text-xs text-ink-500 sm:text-sm">
                2028 권장과목 검색
              </span>
            </div>
            <p className="mt-1 text-sm text-ink-700">
              상담용 도구입니다. 학과를 검색하거나, 이수한 과목으로 갈 수 있는
              학과를 역검색할 수 있습니다.
            </p>
          </div>
          <aside className="rounded-lg border border-ink-200 bg-ink-50/60 px-4 py-2 text-[11px] leading-relaxed text-ink-700 md:shrink-0">
            <div className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
              <div>
                <p className="font-semibold text-ink-500">개발 및 문의</p>
                <p className="flex flex-wrap gap-x-1.5">
                  <span>배방고등학교 교사 김혜진</span>
                  <a
                    href="mailto:rmeosahf@naver.com"
                    className="text-indigo-700 hover:underline"
                  >
                    rmeosahf@naver.com
                  </a>
                </p>
                <p className="flex flex-wrap gap-x-1.5">
                  <span>천안중학교 교사 임의수</span>
                  <a
                    href="mailto:uisu@kakao.com"
                    className="text-indigo-700 hover:underline"
                  >
                    uisu@kakao.com
                  </a>
                </p>
                <p>강남규(2시 소프트)</p>
              </div>
              <div>
                <p className="font-semibold text-ink-500">검수</p>
                <p>이재훈 선생님(한민고)</p>
                <p>안석환 선생님(대일외고)</p>
                <p>이민호 선생님(김천고)</p>
              </div>
            </div>
          </aside>
        </div>
      </header>

      <StatsBar />

      <section className="no-print mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-6">
        <div className="inline-flex w-full rounded-lg border border-ink-200 bg-white p-1 shadow-sm sm:w-auto">
          <TabButton
            active={tab === "univ"}
            onClick={() => setTab("univ")}
            label="대학 / 학과별 검색"
            count={tab === "univ" && query ? file2Hits.length : null}
          />
          <TabButton
            active={tab === "subject"}
            onClick={() => setTab("subject")}
            label="과목 이수 기반 검색"
            count={null}
          />
          <TabButton
            active={tab === "links"}
            onClick={() => setTab("links")}
            label="진학 참고 사이트"
            count={null}
          />
        </div>

        {tab === "univ" && (
          <div className="mt-4 space-y-3">
            <SearchBox value={query} onChange={setQuery} />
            <div className="flex flex-wrap items-center gap-2">
              <FilterChips
                label="권역"
                options={regionList}
                value={region}
                onChange={handleRegionChange}
              />
              <FilterChips
                label="지역"
                options={availableAreas}
                value={area}
                onChange={setArea}
              />
              {query && (
                <span className="ml-auto text-sm text-ink-500">
                  {file2Hits.length}건
                </span>
              )}
            </div>
          </div>
        )}

        <div className="mt-6">
          {tab === "univ" && (
            <UnivDeptResults
              query={query}
              rows={file2Hits}
              cartIds={cartIds}
              onToggleCart={toggleCart}
              onPick={(rows, label) =>
                openPrint({ kind: "single", rows, label })
              }
            />
          )}
          {tab === "subject" && (
            <SubjectSearch
              rows={file2Parsed}
              region={region}
              area={area}
              setRegion={handleRegionChange}
              setArea={setArea}
              cartIds={cartIds}
              onToggleCart={toggleCart}
              onPick={(rows, label) =>
                openPrint({ kind: "single", rows, label })
              }
              adminMode={adminMode}
            />
          )}
          {tab === "links" && <ReferenceLinks />}
        </div>
      </section>

      <CartBar
        items={cart}
        onRemove={(id) =>
          setCart((prev) => prev.filter((c) => c.id !== id))
        }
        onClear={() => setCart([])}
        onCompare={() => openPrint({ kind: "compare", items: cart })}
      />

      {printing && (
        <PrintPreview
          mode={printing}
          headerInfo={headerInfo}
          onUpdateHeader={updateHeader}
          onClose={() => setPrinting(null)}
        />
      )}

      <footer className="no-print mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 pb-10 pt-6 text-xs text-ink-500 sm:px-6">
        <span>출처: 2028학년도 권역별 대학별 권장과목(반영과목)</span>
        {adminMode ? (
          <span className="flex items-center gap-2">
            <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700">
              관리자 모드
            </span>
            <button
              onClick={handleLogout}
              className="text-ink-500 hover:text-ink-900 hover:underline"
            >
              로그아웃
            </button>
          </span>
        ) : (
          <button
            onClick={() => setShowAdminLogin(true)}
            className="text-ink-500 hover:text-ink-900 hover:underline"
          >
            관리자 로그인
          </button>
        )}
      </footer>

      {showAdminLogin && (
        <AdminLogin
          onSuccess={() => {
            setAdminMode(true);
            setShowAdminLogin(false);
          }}
          onClose={() => setShowAdminLogin(false)}
        />
      )}
    </main>
  );
}

function TabButton({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number | null;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 whitespace-nowrap rounded-md px-3 py-2 text-xs font-medium transition sm:flex-none sm:px-4 sm:text-sm ${
        active ? "bg-indigo-600 text-white" : "text-ink-700 hover:bg-ink-100"
      }`}
    >
      {label}
      {count !== null && <span className="ml-1.5 opacity-80">({count})</span>}
    </button>
  );
}
