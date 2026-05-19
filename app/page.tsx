"use client";

import { useEffect, useMemo, useState } from "react";
import {
  file1,
  file2Parsed,
  normalize,
  regionList,
  areaList,
  rowId,
} from "@/lib/data";
import SearchBox from "@/components/SearchBox";
import UnivDeptResults from "@/components/UnivDeptResults";
import MajorResults from "@/components/MajorResults";
import PrintPreview from "@/components/PrintPreview";
import FilterChips from "@/components/FilterChips";
import CartBar from "@/components/CartBar";
import SubjectSearch from "@/components/SubjectSearch";
import type {
  CartItem,
  File1Group,
  File2Row,
  HeaderInfo,
} from "@/lib/types";

type Tab = "univ" | "major" | "subject";
type PrintMode =
  | { kind: "single-file2"; rows: File2Row[]; label: string }
  | { kind: "single-file1"; group: File1Group; label: string }
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
  });

  // Load persisted header info from localStorage (school/counselor only, not student)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(HEADER_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setHeaderInfo({
          schoolName: parsed.schoolName || "",
          counselor: parsed.counselor || "",
          student: "",
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

  const nq = normalize(query);

  const file2Hits = useMemo(() => {
    let pool = file2Parsed;
    if (region) pool = pool.filter((r) => r.권역 === region);
    if (area) pool = pool.filter((r) => r.지역 === area);
    if (!nq) return [];
    return pool.filter((r) => {
      const hay = normalize(
        `${r.대학명} ${r.단과대_계열} ${r.학과} ${r.권역} ${r.지역}`
      );
      return hay.includes(nq);
    });
  }, [nq, region, area]);

  const file1Hits: File1Group[] = useMemo(() => {
    if (!nq) return [];
    return file1.filter((g) => {
      const hay = normalize(
        `${g.계열} ${g.모집단위} ${g.대학별.map((u) => u.대학표기).join(" ")}`
      );
      return hay.includes(nq);
    });
  }, [nq]);

  const cartIds = useMemo(() => new Set(cart.map((c) => c.id)), [cart]);

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
        <div className="mx-auto max-w-6xl px-6 py-6">
          <div className="flex items-baseline gap-3">
            <h1 className="text-2xl font-bold text-ink-900">
              2028 권장과목 검색
            </h1>
            <span className="text-sm text-ink-500">
              대학 · 학과별 반영과목 안내
            </span>
          </div>
          <p className="mt-1 text-sm text-ink-700">
            상담용 도구입니다. 학과를 검색하거나, 이수한 과목으로 갈 수 있는
            학과를 역검색할 수 있습니다.
          </p>
        </div>
      </header>

      <section className="no-print mx-auto max-w-6xl px-6 py-6">
        <div className="inline-flex rounded-lg border border-ink-200 bg-white p-1 shadow-sm">
          <TabButton
            active={tab === "univ"}
            onClick={() => setTab("univ")}
            label={`대학별 검색`}
            count={tab !== "subject" && query ? file2Hits.length : null}
          />
          <TabButton
            active={tab === "major"}
            onClick={() => setTab("major")}
            label={`계열·모집단위별`}
            count={tab !== "subject" && query ? file1Hits.length : null}
          />
          <TabButton
            active={tab === "subject"}
            onClick={() => setTab("subject")}
            label={`과목 이수 기반`}
            count={null}
          />
        </div>

        {tab !== "subject" && (
          <div className="mt-4 space-y-3">
            <SearchBox value={query} onChange={setQuery} />
            <div className="flex flex-wrap items-center gap-2">
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
              {query && (
                <span className="ml-auto text-sm text-ink-500">
                  대학별 {file2Hits.length}건 · 계열별 {file1Hits.length}건
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
                setPrinting({ kind: "single-file2", rows, label })
              }
            />
          )}
          {tab === "major" && (
            <MajorResults
              query={query}
              groups={file1Hits}
              onPick={(group) =>
                setPrinting({
                  kind: "single-file1",
                  group,
                  label: `${group.계열} · ${group.모집단위}`,
                })
              }
            />
          )}
          {tab === "subject" && (
            <SubjectSearch
              rows={file2Parsed}
              region={region}
              area={area}
              setRegion={setRegion}
              setArea={setArea}
              cartIds={cartIds}
              onToggleCart={toggleCart}
              onPick={(rows, label) =>
                setPrinting({ kind: "single-file2", rows, label })
              }
            />
          )}
        </div>
      </section>

      <CartBar
        items={cart}
        onRemove={(id) =>
          setCart((prev) => prev.filter((c) => c.id !== id))
        }
        onClear={() => setCart([])}
        onCompare={() =>
          setPrinting({ kind: "compare", items: cart })
        }
      />

      {printing && (
        <PrintPreview
          mode={printing}
          headerInfo={headerInfo}
          onUpdateHeader={updateHeader}
          onClose={() => setPrinting(null)}
        />
      )}

      <footer className="no-print mx-auto max-w-6xl px-6 pb-10 pt-6 text-xs text-ink-500">
        출처: 2028학년도 권역별 대학별 권장과목(반영과목) · 2028학년도 계열별
        대표 모집단위별 반영과목(권장과목)
      </footer>
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
      className={`px-4 py-2 text-sm font-medium rounded-md transition ${
        active
          ? "bg-indigo-600 text-white"
          : "text-ink-700 hover:bg-ink-100"
      }`}
    >
      {label}
      {count !== null && <span className="ml-1.5 opacity-80">({count})</span>}
    </button>
  );
}
