"use client";

import { useEffect, useMemo, useState } from "react";
import { SUBJECTS, type Domain } from "@/lib/subjects";
import { CONTACT_EMAIL, SCHOOLS, type HighSchool } from "@/lib/schools";

type Props = {
  activeId: string | null;
  onSetActive: (id: string | null) => void;
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

export default function SchoolSetup({ activeId, onSetActive, onClose }: Props) {
  const [viewingId, setViewingId] = useState<string | null>(
    activeId ?? SCHOOLS[0]?.id ?? null
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

  const viewing: HighSchool | null = useMemo(
    () => SCHOOLS.find((s) => s.id === viewingId) || null,
    [viewingId]
  );

  const emailSubject = encodeURIComponent("[2028 권장과목] 학교 추가 요청");
  const emailBody = encodeURIComponent(
    [
      "학교명: ",
      "",
      "개설 과목 (학교에서 실제로 개설된 과목명을 영역별로 적어주세요):",
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
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-ink-900/60" onClick={onClose} />
      <div className="absolute inset-x-4 top-1/2 mx-auto max-w-5xl -translate-y-1/2 overflow-hidden rounded-xl bg-white shadow-2xl">
        <header className="flex items-start justify-between gap-3 border-b border-ink-200 bg-ink-50 px-5 py-3">
          <div className="min-w-0">
            <h2 className="text-base font-bold text-ink-900">등록된 고등학교</h2>
            <p className="text-xs text-ink-500">
              학교를 선택하면 메인 화면에서 그 학교의 개설 과목만 표시됩니다.
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
            {SCHOOLS.length === 0 ? (
              <p className="px-2 text-xs text-ink-500">
                아직 등록된 학교가 없습니다.
              </p>
            ) : (
              <ul className="space-y-1">
                {SCHOOLS.map((s) => {
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
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}

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
          </aside>

          {/* Detail panel */}
          <section className="overflow-y-auto p-5">
            {!viewing ? (
              <div className="flex h-full items-center justify-center text-center">
                <p className="text-sm text-ink-500">
                  좌측에서 학교를 선택하세요.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-4 flex items-baseline justify-between border-b border-ink-100 pb-2">
                  <div>
                    <h3 className="text-lg font-bold text-ink-900">
                      {viewing.name}
                    </h3>
                    <p className="text-xs text-ink-500">
                      개설 과목 {viewing.offeredSubjects.length}개
                    </p>
                  </div>
                  {viewing.id !== activeId && (
                    <button
                      onClick={() => onSetActive(viewing.id)}
                      className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-700"
                    >
                      이 학교 사용
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  {DOMAIN_ORDER.map((domain) => {
                    const subs = SUBJECTS.filter((s) => s.domain === domain);
                    const offered = new Set(viewing.offeredSubjects);
                    const inDomain = subs.filter((s) => offered.has(s.name));
                    if (inDomain.length === 0) return null;
                    return (
                      <div
                        key={domain}
                        className="rounded-md border border-ink-200 bg-white p-3"
                      >
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
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
