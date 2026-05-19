"use client";

import { useEffect, useMemo, useState } from "react";
import { SUBJECTS, type Domain } from "@/lib/subjects";
import {
  COMMON_OFFERED,
  newSchoolId,
  upsertSchool,
  deleteSchool,
  loadLocalSchools,
  isSupabaseEnabled,
  type HighSchool,
} from "@/lib/schools";

type Props = {
  schools: HighSchool[];
  activeId: string | null;
  onSetActive: (id: string | null) => void;
  onChange: () => Promise<void> | void;
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

export default function SchoolSetup({
  schools,
  activeId,
  onSetActive,
  onChange,
  onClose,
}: Props) {
  const [editingId, setEditingId] = useState<string | null>(
    activeId ?? schools[0]?.id ?? null
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  // Local draft mirror so typing doesn't await network roundtrips
  const [draftMap, setDraftMap] = useState<Map<string, HighSchool>>(new Map());

  useEffect(() => {
    // Sync drafts from props
    const next = new Map<string, HighSchool>();
    for (const s of schools) next.set(s.id, s);
    setDraftMap(next);
  }, [schools]);

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

  const editing = editingId ? draftMap.get(editingId) || null : null;

  const orderedSchools = useMemo(
    () =>
      Array.from(draftMap.values()).sort((a, b) =>
        a.name.localeCompare(b.name, "ko")
      ),
    [draftMap]
  );

  const updateDraft = (s: HighSchool) => {
    setDraftMap((prev) => {
      const next = new Map(prev);
      next.set(s.id, s);
      return next;
    });
  };

  const commit = async (s: HighSchool) => {
    setSaving(true);
    setError(null);
    try {
      await upsertSchool(s);
      await onChange();
    } catch (e: any) {
      setError(e?.message || "저장 실패");
    } finally {
      setSaving(false);
    }
  };

  const handleAdd = async () => {
    const newSchool: HighSchool = {
      id: newSchoolId(),
      name: `학교 ${schools.length + 1}`,
      offeredSubjects: [...COMMON_OFFERED],
    };
    updateDraft(newSchool);
    setEditingId(newSchool.id);
    await commit(newSchool);
    if (!activeId) onSetActive(newSchool.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("이 학교를 삭제하시겠습니까? 모든 사용자에게 즉시 적용됩니다.")) return;
    setSaving(true);
    setError(null);
    try {
      await deleteSchool(id);
      setDraftMap((prev) => {
        const next = new Map(prev);
        next.delete(id);
        return next;
      });
      if (activeId === id) onSetActive(null);
      if (editingId === id) {
        const others = Array.from(draftMap.keys()).filter((k) => k !== id);
        setEditingId(others[0] ?? null);
      }
      await onChange();
    } catch (e: any) {
      setError(e?.message || "삭제 실패");
    } finally {
      setSaving(false);
    }
  };

  const updateName = (name: string) => {
    if (!editing) return;
    const updated = { ...editing, name };
    updateDraft(updated);
  };

  const commitName = async () => {
    if (!editing) return;
    await commit(editing);
  };

  const toggleSubject = async (name: string) => {
    if (!editing) return;
    const has = editing.offeredSubjects.includes(name);
    const updated = {
      ...editing,
      offeredSubjects: has
        ? editing.offeredSubjects.filter((s) => s !== name)
        : [...editing.offeredSubjects, name],
    };
    updateDraft(updated);
    await commit(updated);
  };

  const toggleAllInDomain = async (domain: Domain, on: boolean) => {
    if (!editing) return;
    const inDomain = SUBJECTS.filter((s) => s.domain === domain).map(
      (s) => s.name
    );
    const set = new Set(editing.offeredSubjects);
    if (on) inDomain.forEach((n) => set.add(n));
    else inDomain.forEach((n) => set.delete(n));
    const updated = { ...editing, offeredSubjects: Array.from(set) };
    updateDraft(updated);
    await commit(updated);
  };

  const uploadLocalSchools = async () => {
    const local = loadLocalSchools();
    const cloudIds = new Set(schools.map((s) => s.id));
    const toUpload = local.filter((s) => !cloudIds.has(s.id));
    if (toUpload.length === 0) {
      setUploadStatus("로컬에 새로 올릴 학교가 없습니다.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      for (const s of toUpload) {
        await upsertSchool(s);
      }
      await onChange();
      setUploadStatus(`${toUpload.length}개 학교를 클라우드에 올렸습니다.`);
    } catch (e: any) {
      setError(e?.message || "업로드 실패");
    } finally {
      setSaving(false);
    }
  };

  const hasLocalUnsynced = useMemo(() => {
    if (!isSupabaseEnabled) return false;
    const local = loadLocalSchools();
    const cloudIds = new Set(schools.map((s) => s.id));
    return local.some((s) => !cloudIds.has(s.id));
  }, [schools]);

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-ink-900/60" onClick={onClose} />
      <div className="absolute inset-x-4 top-1/2 mx-auto max-w-5xl -translate-y-1/2 overflow-hidden rounded-xl bg-white shadow-2xl">
        <header className="flex items-start justify-between gap-3 border-b border-ink-200 bg-ink-50 px-5 py-3">
          <div className="min-w-0">
            <h2 className="flex items-center gap-2 text-base font-bold text-ink-900">
              고등학교 개설 과목 설정
              {isSupabaseEnabled ? (
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                  실시간 공유
                </span>
              ) : (
                <span className="rounded-full bg-ink-100 px-2 py-0.5 text-[10px] font-bold text-ink-500">
                  로컬 전용
                </span>
              )}
              {saving && (
                <span className="text-[10px] font-normal text-ink-500">
                  저장 중…
                </span>
              )}
            </h2>
            <p className="text-xs text-ink-500">
              {isSupabaseEnabled
                ? "변경사항은 자동 저장되며 모든 접속자에게 즉시 반영됩니다."
                : "변경사항은 이 브라우저에만 저장됩니다. (Supabase 미설정)"}
            </p>
            {error && (
              <p className="mt-1 rounded bg-rose-50 px-2 py-1 text-[11px] text-rose-700">
                ⚠ {error}
              </p>
            )}
            {uploadStatus && (
              <p className="mt-1 rounded bg-emerald-50 px-2 py-1 text-[11px] text-emerald-700">
                ✓ {uploadStatus}
              </p>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {hasLocalUnsynced && (
              <button
                onClick={uploadLocalSchools}
                disabled={saving}
                className="rounded-md border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-800 hover:bg-amber-100 disabled:opacity-50"
                title="이 브라우저에만 저장된 학교를 클라우드로 업로드"
              >
                로컬 학교 올리기
              </button>
            )}
            <button
              onClick={onClose}
              className="rounded-md border border-ink-200 bg-white px-3 py-1.5 text-sm text-ink-700 hover:bg-ink-100"
            >
              닫기 (Esc)
            </button>
          </div>
        </header>

        <div className="grid h-[600px] grid-cols-[260px,1fr]">
          <aside className="overflow-y-auto border-r border-ink-200 bg-ink-50/40 p-3">
            <button
              onClick={handleAdd}
              disabled={saving}
              className="mb-3 w-full rounded-md border border-dashed border-indigo-400 bg-white px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-50 disabled:opacity-50"
            >
              + 새 학교 추가
            </button>
            {orderedSchools.length === 0 ? (
              <p className="px-2 text-xs text-ink-500">
                등록된 학교가 없습니다.
                <br />
                위 버튼으로 추가하세요.
              </p>
            ) : (
              <ul className="space-y-1">
                {orderedSchools.map((s) => {
                  const active = s.id === activeId;
                  const isEditing = s.id === editingId;
                  return (
                    <li key={s.id}>
                      <div
                        className={`group flex items-center gap-1 rounded-md border px-2 py-1.5 ${
                          isEditing
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
                            onClick={() => onSetActive(s.id)}
                            className="opacity-0 group-hover:opacity-100 rounded p-1 text-[10px] text-indigo-600 hover:bg-indigo-50"
                            title="이 학교를 사용 (내 브라우저에만 적용)"
                          >
                            사용
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(s.id)}
                          disabled={saving}
                          className="opacity-0 group-hover:opacity-100 rounded p-1 text-rose-500 hover:bg-rose-50 disabled:opacity-30"
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

          <section className="overflow-y-auto p-5">
            {!editing ? (
              <div className="flex h-full items-center justify-center text-center">
                <p className="text-sm text-ink-500">
                  좌측에서 학교를 선택하거나 새 학교를 추가하세요.
                </p>
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
                      onChange={(e) => updateName(e.target.value)}
                      onBlur={commitName}
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
