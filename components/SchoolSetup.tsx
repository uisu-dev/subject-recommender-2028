"use client";

import { useEffect, useMemo, useState } from "react";
import { SUBJECTS, type Domain } from "@/lib/subjects";
import { CONTACT_EMAIL, SCHOOLS, type HighSchool } from "@/lib/schools";

type Props = {
  activeId: string | null;
  onSetActive: (id: string | null) => void;
  onClose: () => void;
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

const COMMON_OFFERED_DEFAULT: string[] = [
  "국어",
  "화법과 언어",
  "독서와 작문",
  "문학",
  "대수",
  "확률과 통계",
  "미적분Ⅰ",
  "미적분Ⅱ",
  "기하",
  "영어",
  "영어 독해와 작문",
  "일반사회",
  "사회와 문화",
  "한국지리",
  "세계사",
  "윤리와 사상",
  "현대사회와 윤리",
  "물리학",
  "화학",
  "생명과학",
  "지구과학",
  "한국사",
  "한문",
  "정보",
];

function slugify(name: string): string {
  // Generate a stable, URL-safe id from school name
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  // Append short random suffix to avoid collisions
  const suffix = Math.random().toString(36).slice(2, 6);
  return base ? `${base}-${suffix}` : `school-${suffix}`;
}

export default function SchoolSetup({
  activeId,
  onSetActive,
  onClose,
  adminMode,
}: Props) {
  const [viewingId, setViewingId] = useState<string | null>(
    activeId ?? SCHOOLS[0]?.id ?? null
  );

  // Admin draft state: only used when adminMode is true
  const [drafts, setDrafts] = useState<HighSchool[]>(SCHOOLS);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const dirty = useMemo(
    () => JSON.stringify(drafts) !== JSON.stringify(SCHOOLS),
    [drafts]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (dirty && adminMode) {
          if (!confirm("저장하지 않은 변경사항이 있습니다. 닫으시겠습니까?")) return;
        }
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, dirty, adminMode]);

  // Always sort by Korean name (가나다) when displaying — guards against
  // drafts being appended out of order in admin mode.
  const list = useMemo(
    () =>
      (adminMode ? drafts : SCHOOLS)
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name, "ko")),
    [adminMode, drafts]
  );
  const viewing = list.find((s) => s.id === viewingId) || null;

  // Admin operations
  const updateDraft = (s: HighSchool) => {
    setDrafts((prev) => prev.map((d) => (d.id === s.id ? s : d)));
  };

  const handleAdd = () => {
    const name = `새 학교 ${drafts.length + 1}`;
    const newSchool: HighSchool = {
      id: slugify(name),
      name,
      offeredSubjects: [...COMMON_OFFERED_DEFAULT],
    };
    setDrafts((prev) => [...prev, newSchool]);
    setViewingId(newSchool.id);
  };

  const handleDelete = (id: string) => {
    if (!confirm("이 학교를 삭제하시겠습니까? 저장하면 모든 사용자에게 적용됩니다.")) return;
    setDrafts((prev) => prev.filter((s) => s.id !== id));
    if (viewingId === id) {
      const remaining = drafts.filter((s) => s.id !== id);
      setViewingId(remaining[0]?.id ?? null);
    }
  };

  const updateName = (name: string) => {
    if (!viewing) return;
    updateDraft({ ...viewing, name });
  };

  const toggleSubject = (name: string) => {
    if (!viewing) return;
    const has = viewing.offeredSubjects.includes(name);
    updateDraft({
      ...viewing,
      offeredSubjects: has
        ? viewing.offeredSubjects.filter((s) => s !== name)
        : [...viewing.offeredSubjects, name],
    });
  };

  const toggleAllInDomain = (domain: Domain, on: boolean) => {
    if (!viewing) return;
    const inDomain = SUBJECTS.filter((s) => s.domain === domain).map((s) => s.name);
    const set = new Set(viewing.offeredSubjects);
    if (on) inDomain.forEach((n) => set.add(n));
    else inDomain.forEach((n) => set.delete(n));
    updateDraft({ ...viewing, offeredSubjects: Array.from(set) });
  };

  const saveAndDeploy = async () => {
    setSaving(true);
    setSaveError(null);
    setSaveMessage(null);
    try {
      const res = await fetch("/api/admin/schools", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schools: drafts }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSaveError(data.error || `저장 실패 (${res.status})`);
      } else {
        setSaveMessage(data.message || "저장 완료");
      }
    } catch (e: any) {
      setSaveError(e?.message || "네트워크 오류");
    } finally {
      setSaving(false);
    }
  };

  const emailSubject = encodeURIComponent("[2028 권장과목] 학교 추가 요청");
  const emailBody = encodeURIComponent(
    [
      "학교명: ",
      "",
      "개설 과목 (영역별로 적어주세요):",
      "- 국어:",
      "- 수학:",
      "- 영어:",
      "- 사회:",
      "- 과학:",
      "- 한국사:",
      "- 기타:",
      "",
      "요청자 (선생님 성함):",
    ].join("\n")
  );

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-ink-900/60 p-2 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[calc(100vh-1rem)] w-full max-w-5xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl sm:max-h-[calc(100vh-2rem)]"
      >
        <header className="flex items-start justify-between gap-3 border-b border-ink-200 bg-ink-50 px-5 py-3">
          <div className="min-w-0">
            <h2 className="flex items-center gap-2 text-base font-bold text-ink-900">
              {adminMode ? "고등학교 관리 (관리자 모드)" : "등록된 고등학교"}
              {adminMode && dirty && (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                  미저장 변경
                </span>
              )}
            </h2>
            <p className="text-xs text-ink-500">
              {adminMode
                ? "변경 후 '저장 & 배포'를 눌러야 GitHub에 커밋됩니다."
                : "학교를 선택하면 메인 화면에서 그 학교의 개설 과목만 표시됩니다."}
            </p>
            {saveMessage && (
              <p className="mt-1 rounded bg-emerald-50 px-2 py-1 text-[11px] text-emerald-700">
                ✓ {saveMessage}
              </p>
            )}
            {saveError && (
              <p className="mt-1 rounded bg-rose-50 px-2 py-1 text-[11px] text-rose-700">
                ⚠ {saveError}
              </p>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {adminMode && (
              <button
                onClick={saveAndDeploy}
                disabled={saving || !dirty}
                className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-700 disabled:opacity-40"
              >
                {saving ? "저장 중…" : "저장 & 배포"}
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

        <div className="grid min-h-0 flex-1 grid-rows-[auto,1fr] sm:grid-cols-[260px,1fr] sm:grid-rows-1">
          <aside className="overflow-y-auto border-b border-ink-200 bg-ink-50/40 p-3 sm:border-b-0 sm:border-r sm:max-h-none max-h-48">
            {adminMode && (
              <button
                onClick={handleAdd}
                className="mb-3 w-full rounded-md border border-dashed border-indigo-400 bg-white px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-50"
              >
                + 새 학교 추가
              </button>
            )}
            {list.length === 0 ? (
              <p className="px-2 text-xs text-ink-500">
                {adminMode ? "위 버튼으로 학교를 추가하세요." : "아직 등록된 학교가 없습니다."}
              </p>
            ) : (
              <ul className="space-y-1">
                {list.map((s) => {
                  const active = s.id === activeId;
                  const isViewing = s.id === viewingId;
                  return (
                    <li key={s.id}>
                      <div
                        className={`group flex items-center gap-1 rounded-md border px-2 py-1.5 ${
                          isViewing
                            ? "border-indigo-500 bg-white shadow-sm"
                            : "border-transparent bg-white/60 hover:bg-white"
                        }`}
                      >
                        <button
                          onClick={() => setViewingId(s.id)}
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
                            className="rounded p-1 text-[10px] text-indigo-600 hover:bg-indigo-50"
                            title="이 학교를 사용"
                          >
                            사용
                          </button>
                        )}
                        {adminMode && (
                          <button
                            onClick={() => handleDelete(s.id)}
                            className="opacity-0 group-hover:opacity-100 rounded p-1 text-rose-500 hover:bg-rose-50"
                            title="삭제"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}

            {!adminMode && (
              <div className="mt-4 rounded-md border border-dashed border-indigo-300 bg-indigo-50/40 p-3">
                <h4 className="text-xs font-bold text-indigo-900">
                  내 학교가 없나요?
                </h4>
                <p className="mt-1 text-[11px] leading-relaxed text-ink-700">
                  개설 과목을 정리해 아래 이메일로 보내주시면 영업일 기준 며칠
                  안에 추가해드립니다.
                </p>
                <a
                  href={`mailto:${CONTACT_EMAIL}?subject=${emailSubject}&body=${emailBody}`}
                  className="mt-2 inline-block text-[11px] font-medium text-indigo-700 hover:underline"
                >
                  ✉ {CONTACT_EMAIL}
                </a>
              </div>
            )}
          </aside>

          <section className="overflow-y-auto p-4 sm:p-5">
            {!viewing ? (
              <div className="flex h-full items-center justify-center text-center">
                <p className="text-sm text-ink-500">
                  {adminMode ? "좌측에서 학교를 선택하거나 추가하세요." : "좌측에서 학교를 선택하세요."}
                </p>
              </div>
            ) : adminMode ? (
              <AdminEditPanel
                school={viewing}
                onNameChange={updateName}
                onToggleSubject={toggleSubject}
                onToggleAllInDomain={toggleAllInDomain}
              />
            ) : (
              <ReadOnlyPanel school={viewing} activeId={activeId} onSetActive={onSetActive} />
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function AdminEditPanel({
  school,
  onNameChange,
  onToggleSubject,
  onToggleAllInDomain,
}: {
  school: HighSchool;
  onNameChange: (name: string) => void;
  onToggleSubject: (name: string) => void;
  onToggleAllInDomain: (domain: Domain, on: boolean) => void;
}) {
  return (
    <>
      <div className="mb-4">
        <label className="block">
          <span className="text-[10px] font-bold uppercase tracking-wider text-ink-500">
            학교명
          </span>
          <input
            type="text"
            value={school.name}
            onChange={(e) => onNameChange(e.target.value)}
            className="mt-0.5 w-full rounded-md border border-ink-200 bg-white px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-200"
            placeholder="예: 배방고등학교"
          />
        </label>
      </div>

      <div className="space-y-4">
        {DOMAIN_ORDER.map((domain) => {
          const subs = SUBJECTS.filter((s) => s.domain === domain);
          if (subs.length === 0) return null;
          const offered = new Set(school.offeredSubjects);
          const offeredCount = subs.filter((s) => offered.has(s.name)).length;
          const allOn = offeredCount === subs.length;
          return (
            <div key={domain} className="rounded-md border border-ink-200 bg-white p-3">
              <div className="mb-2 flex items-center justify-between">
                <h4 className="text-sm font-bold text-ink-900">
                  {domain}{" "}
                  <span className="text-xs font-normal text-ink-500">
                    ({offeredCount}/{subs.length})
                  </span>
                </h4>
                <button
                  onClick={() => onToggleAllInDomain(domain, !allOn)}
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
                      onClick={() => onToggleSubject(s.name)}
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
  );
}

function ReadOnlyPanel({
  school,
  activeId,
  onSetActive,
}: {
  school: HighSchool;
  activeId: string | null;
  onSetActive: (id: string | null) => void;
}) {
  return (
    <>
      <div className="mb-4 flex items-baseline justify-between border-b border-ink-100 pb-2">
        <div>
          <h3 className="text-lg font-bold text-ink-900">{school.name}</h3>
          <p className="text-xs text-ink-500">
            개설 과목 {school.offeredSubjects.length}개
          </p>
        </div>
        {school.id !== activeId && (
          <button
            onClick={() => onSetActive(school.id)}
            className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-700"
          >
            이 학교 사용
          </button>
        )}
      </div>

      <div className="space-y-3">
        {DOMAIN_ORDER.map((domain) => {
          const subs = SUBJECTS.filter((s) => s.domain === domain);
          const offered = new Set(school.offeredSubjects);
          const inDomain = subs.filter((s) => offered.has(s.name));
          if (inDomain.length === 0) return null;
          return (
            <div key={domain} className="rounded-md border border-ink-200 bg-white p-3">
              <h4 className="mb-2 text-sm font-bold text-ink-900">
                {domain}{" "}
                <span className="text-xs font-normal text-ink-500">
                  ({inDomain.length}과목)
                </span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {inDomain.map((s) => (
                  <span
                    key={s.name}
                    className="rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-[11px] font-medium text-indigo-700"
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-4 rounded-md bg-ink-50 p-3 text-[11px] leading-relaxed text-ink-700">
        ※ 개설 과목이 실제와 다르거나 변경이 필요하면{" "}
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="font-medium text-indigo-700 hover:underline"
        >
          {CONTACT_EMAIL}
        </a>
        로 알려주세요.
      </p>
    </>
  );
}
