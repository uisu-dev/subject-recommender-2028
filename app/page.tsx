"use client";

import { useMemo, useState } from "react";
import { file1, file2, normalize, regionList, areaList } from "@/lib/data";
import SearchBox from "@/components/SearchBox";
import UnivDeptResults from "@/components/UnivDeptResults";
import MajorResults from "@/components/MajorResults";
import PrintPreview from "@/components/PrintPreview";
import FilterChips from "@/components/FilterChips";
import type { File1Group, File2Row } from "@/lib/types";

type Tab = "univ" | "major";

export default function Home() {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<Tab>("univ");
  const [region, setRegion] = useState<string>("");
  const [area, setArea] = useState<string>("");
  const [selected, setSelected] = useState<{
    file2Rows: File2Row[];
    file1Group: File1Group | null;
    label: string;
  } | null>(null);

  const nq = normalize(query);

  const file2Hits: File2Row[] = useMemo(() => {
    let pool = file2;
    if (region) pool = pool.filter((r) => r.권역 === region);
    if (area) pool = pool.filter((r) => r.지역 === area);
    if (!nq) return pool.slice(0, 0);
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
        `${g.계열} ${g.모집단위} ${g.대학별
          .map((u) => u.대학표기)
          .join(" ")}`
      );
      return hay.includes(nq);
    });
  }, [nq]);

  const totalHits = file2Hits.length + file1Hits.length;

  return (
    <main className="min-h-screen">
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
            대학명 또는 학과명을 입력하면 권장과목을 확인할 수 있습니다. 상담
            결과는 PDF 미리보기 후 인쇄·저장하세요.
          </p>
        </div>
      </header>

      <section className="no-print mx-auto max-w-6xl px-6 py-6">
        <SearchBox value={query} onChange={setQuery} />
        <div className="mt-4 flex flex-wrap items-center gap-2">
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
              {totalHits.toLocaleString()}건
            </span>
          )}
        </div>

        <div className="mt-6 inline-flex rounded-lg border border-ink-200 bg-white p-1">
          <button
            onClick={() => setTab("univ")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition ${
              tab === "univ"
                ? "bg-indigo-600 text-white"
                : "text-ink-700 hover:bg-ink-100"
            }`}
          >
            대학별 ({file2Hits.length})
          </button>
          <button
            onClick={() => setTab("major")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition ${
              tab === "major"
                ? "bg-indigo-600 text-white"
                : "text-ink-700 hover:bg-ink-100"
            }`}
          >
            계열·모집단위별 ({file1Hits.length})
          </button>
        </div>

        <div className="mt-6">
          {tab === "univ" && (
            <UnivDeptResults
              query={query}
              rows={file2Hits}
              onPick={(rows, label) =>
                setSelected({ file2Rows: rows, file1Group: null, label })
              }
            />
          )}
          {tab === "major" && (
            <MajorResults
              query={query}
              groups={file1Hits}
              onPick={(group) =>
                setSelected({
                  file2Rows: [],
                  file1Group: group,
                  label: `${group.계열} · ${group.모집단위}`,
                })
              }
            />
          )}
        </div>
      </section>

      {selected && (
        <PrintPreview
          label={selected.label}
          file2Rows={selected.file2Rows}
          file1Group={selected.file1Group}
          onClose={() => setSelected(null)}
        />
      )}

      <footer className="no-print mx-auto max-w-6xl px-6 pb-10 pt-6 text-xs text-ink-500">
        출처: 2028학년도 권역별 대학별 권장과목(반영과목) · 2028학년도 계열별
        대표 모집단위별 반영과목(권장과목)
      </footer>
    </main>
  );
}
