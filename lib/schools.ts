/**
 * Per-browser configuration of high schools and the subjects each one offers.
 * Stored in localStorage so a counselor's saved school list survives reloads.
 */

export type HighSchool = {
  id: string;
  name: string;
  /** Canonical subject names (from SUBJECTS in lib/subjects.ts) offered by this school. */
  offeredSubjects: string[];
};

export type SchoolStore = {
  schools: HighSchool[];
  activeId: string | null;
};

const STORAGE_KEY = "subject-recommender:schools";

export const EMPTY_STORE: SchoolStore = { schools: [], activeId: null };

export function loadSchoolStore(): SchoolStore {
  if (typeof window === "undefined") return EMPTY_STORE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_STORE;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.schools)) return EMPTY_STORE;
    return {
      schools: parsed.schools.map((s: HighSchool) => ({
        id: s.id,
        name: s.name || "이름 없는 학교",
        offeredSubjects: Array.isArray(s.offeredSubjects) ? s.offeredSubjects : [],
      })),
      activeId: parsed.activeId ?? null,
    };
  } catch {
    return EMPTY_STORE;
  }
}

export function saveSchoolStore(store: SchoolStore): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // localStorage full or disabled — silently ignore
  }
}

export function newSchoolId(): string {
  return `school-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * Sensible defaults: subjects offered by most Korean general high schools.
 * Users edit from here (add/remove based on their school's actual curriculum).
 */
export const COMMON_OFFERED: string[] = [
  // 국어
  "국어",
  "화법과 언어",
  "독서와 작문",
  "문학",
  // 수학
  "대수",
  "확률과 통계",
  "미적분Ⅰ",
  "미적분Ⅱ",
  "기하",
  // 영어
  "영어",
  "영어 독해와 작문",
  // 사회 (일반사회/역사/지리/윤리 핵심)
  "일반사회",
  "사회와 문화",
  "한국지리",
  "세계사",
  "윤리와 사상",
  "현대사회와 윤리",
  // 과학
  "물리학",
  "화학",
  "생명과학",
  "지구과학",
  // 한국사
  "한국사",
  // 기타
  "한문",
  "정보",
];
