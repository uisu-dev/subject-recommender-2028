"use client";

import { useEffect, useMemo, useState } from "react";
import { SUBJECTS, type Domain } from "@/lib/subjects";
import {
  COMMON_OFFERED,
  newSchoolId,
  type HighSchool,
  type SchoolStore,
} from "@/lib/schools";

type Props = {
  store: SchoolStore;
  onChange: (next: SchoolStore) => void;
  onClose: () => void;
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

export default function SchoolSetup({ store, onChange, onClose }: Props) {
  const [editingId, setEditingId] = useState<string | null>(
    store.activeId ?? store.schools[0]?.id ?? null
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const editing = useMemo(
    () => store.schools.find((s) => s.id === editingId) || null,
    [store.schools, editingId]
  );

  const addSchool = () => {
    const newSchool: HighSchool = {
      id: newSchoolId(),
      name: `학교 ${store.schools.length + 1}`,
      offeredSubjects: [...COMMON_OFFERED],
    };
    onChange({
      schools: [...store.schools, newSchool],
      activeId: store.activeId ?? newSchool.id,
    });
    setEditingId(newSchool.id);
  };

  const deleteSchool = (id: string) => {
    if (!confirm("이 학교를 삭제하시겠습니까?")) return;
    const remaining = store.schools.filter((s) => s.id !== id);
    const nextActive =
      store.activeId === id ? remaining[0]?.id ?? null : store.activeId;
    onChange({ schools: remaining, activeId: nextActive });
    if (editingId === id) setEditingId(remaining[0]?.id ?? null);
  };

  const updateEditing = (patch: Partial<HighSchool>) => {
    if (!editing) return;
    onChange({
      ...store,
      schools: store.schools.map((s) =>
        s.id === editing.id ? { ...s, ...patch } : s
      ),
    });
  };

  const toggleSubject = (name: string) => {
    if (!editing) return;
    const has = editing.offeredSubjects.includes(name);
    updateEditing({
      offeredSubjects: has
        ? editing.offeredSubjects.filter((s) => s !== name)
        : [...editing.offeredSubjects, name],
    });
  };

  const toggleAllInDomain = (domain: Domain, on: boolean) => {
    if (!editing) return;
    const inDomain = SUBJECTS.filter((s) => s.domain === domain).map((s) => s.name);
    const set = new Set(editing.offeredSubjects);
    if (on) inDomain.forEach((n) => set.add(n));
    else inDomain.forEach((n) => set.delete(n));
    updateEditing({ offeredSubjects: Array.from(set) });
  };

  const setActive = (id: string) => {
    onChange({ ...store, activeId: id });
  };

  return (
    <div className="fixed inset-0 z-[60]">
      <div
        className="absolute inset-0 bg-ink-900/60"
        onClick={onClose}
      />
      <div className="absolute inset-x-4 top-1/2 mx-auto max-w-5xl -translate-y-1/2 overflow-hidden rounded-xl bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-ink-200 bg-ink-50 px-5 py-3">
          <div>
            <h2 className="text-base font-bold text-ink-900">
              고등학교 개설 과목 설정
            </h2>
            <p className="text-xs text-ink-500">
              학교별로 개설된 과목을 체크하면 검색 화면에서 그 과목만 보입니다.
              변경사항은 자동 저장됩니다.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-md border border-ink-200 bg-white px-3 py-1.5 text-sm text-ink-700 hover:bg-ink-100"
          >
            닫기 (Esc)
          </button>
        </header>

        <div className="grid h-[600px] grid-cols-[260px,1fr]">
          {/* School list */}
          <aside className="overflow-y-auto border-r border-ink-200 bg-ink-50/40 p-3">
            <button
              onClick={addSchool}
              className="mb-3 w-full rounded-md border border-dashed border-indigo-400 bg-white px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-50"
            >
              + 새 학교 추가
            </button>
            {store.schools.length === 0 ? (
              <p className="px-2 text-xs text-ink-500">
                등록된 학교가 없습니다.
                <br />
                위 버튼으로 추가하세요.
              </p>
            ) : (
              <ul className="space-y-1">
                {store.schools.map((s) => {
                  const active = s.id === store.activeId;
                  const editing = s.id === editingId;
                  return (
                    <li key={s.id}>
                      <div
                        className={`group flex items-center gap-1 rounded-md border px-2 py-1.5 ${
                          editing
                            ? "border-indigo-500 bg-white shadow-sm"
                            : "border-transparent bg-white/60 hover:bg-white"
                        }`}
                      >
                        <button
                          onClick={() => setEditingId(s.id)}
                          className="min-w-0 flex-1 truncate text-left text-sm font-medium text-ink-900"
                        >
                          {s.name}
                          {active && (
                            <span className="ml-1.5 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700">
                              사용중
                            </span>
                          )}
                          <div className="text-[10px] text-ink-500">
                            개설 {s.offeredSubjects.length}과목
                          </div>
                        </button>
                        {!active && (
                          <button
                            onClick={() => setActive(s.id)}
                            className="opacity-0 group-hover:opacity-100 rounded p-1 text-[10px] text-indigo-600 hover:bg-indigo-50"
                            title="이 학교를 사용"
                          >
                            사용
                          </button>
                        )}
                        <button
                          onClick={() => deleteSchool(s.id)}
                          className="opacity-0 group-hover:opacity-100 rounded p-1 text-rose-500 hover:bg-rose-50"
                          title="삭제"
                        >
                          ✕
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </aside>

          {/* Editing panel */}
          <section className="overflow-y-auto p-5">
            {!editing ? (
              <div className="flex h-full items-center justify-center text-center">
                <div>
                  <p className="text-sm text-ink-500">
                    좌측에서 학교를 선택하거나 새 학교를 추가하세요.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <label className="block">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-ink-500">
                      학교명
                    </span>
                    <input
                      type="text"
                      value={editing.name}
                      onChange={(e) =>
                        updateEditing({ name: e.target.value })
                      }
                      className="mt-0.5 w-full rounded-md border border-ink-200 bg-white px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-200"
                      placeholder="예: 배방고등학교"
                    />
                  </label>
                </div>

                <div className="space-y-4">
                  {DOMAIN_ORDER.map((domain) => {
                    const subs = SUBJECTS.filter((s) => s.domain === domain);
                    if (subs.length === 0) return null;
                    const offered = new Set(editing.offeredSubjects);
                    const offeredCount = subs.filter((s) =>
                      offered.has(s.name)
                    ).length;
                    const allOn = offeredCount === subs.length;
                    return (
                      <div
                        key={domain}
                        className="rounded-md border border-ink-200 bg-white p-3"
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <h4 className="text-sm font-bold text-ink-900">
                            {domain}{" "}
                            <span className="text-xs font-normal text-ink-500">
                              ({offeredCount}/{subs.length})
                            </span>
                          </h4>
                          <button
                            onClick={() => toggleAllInDomain(domain, !allOn)}
                            className="text-xs text-indigo-600 hover:underline"
                          >
                            {allOn ? "전체 해제" : "전체 선택"}
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {subs.map((s) => {
                            const on = offered.has(s.name);
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
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
