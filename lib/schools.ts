/**
 * School configuration store.
 *
 * Backend selection:
 *   - If Supabase env vars are configured → cloud-backed, real-time across users.
 *   - Otherwise → localStorage only (per-browser, no sharing).
 *
 * The "active school" (which school THIS user is currently viewing) is always
 * kept in localStorage since it's a per-user UI preference.
 */

import { supabase, isSupabaseEnabled } from "./supabase";

export type HighSchool = {
  id: string;
  name: string;
  /** Canonical subject names (from SUBJECTS in lib/subjects.ts) offered by this school. */
  offeredSubjects: string[];
};

const SCHOOLS_KEY = "subject-recommender:schools";
const ACTIVE_KEY = "subject-recommender:active-school";

// --- Active school id (always local) ---

export function loadActiveId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(ACTIVE_KEY);
  } catch {
    return null;
  }
}

export function saveActiveId(id: string | null): void {
  try {
    if (id) localStorage.setItem(ACTIVE_KEY, id);
    else localStorage.removeItem(ACTIVE_KEY);
  } catch {
    // ignore
  }
}

// --- Schools list ---

/**
 * Read schools from localStorage. Used as cache and fallback.
 * Also reads from the legacy combined SchoolStore key for backward compat.
 */
export function loadLocalSchools(): HighSchool[] {
  if (typeof window === "undefined") return [];
  try {
    // Try new key first
    const raw = localStorage.getItem(SCHOOLS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.map(normalize);
    }
    // Legacy: old combined { schools, activeId } shape
    const legacy = localStorage.getItem("subject-recommender:schools");
    if (legacy) {
      const parsed = JSON.parse(legacy);
      if (parsed && Array.isArray(parsed.schools)) {
        return parsed.schools.map(normalize);
      }
    }
  } catch {
    // ignore
  }
  return [];
}

function normalize(s: HighSchool): HighSchool {
  return {
    id: s.id,
    name: s.name || "이름 없는 학교",
    offeredSubjects: Array.isArray(s.offeredSubjects) ? s.offeredSubjects : [],
  };
}

function saveLocalSchools(schools: HighSchool[]): void {
  try {
    localStorage.setItem(SCHOOLS_KEY, JSON.stringify(schools));
  } catch {
    // ignore
  }
}

export function newSchoolId(): string {
  return `school-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// --- Backend operations ---

export async function fetchSchools(): Promise<HighSchool[]> {
  if (!supabase) return loadLocalSchools();
  const { data, error } = await supabase
    .from("schools")
    .select("id, name, offered_subjects")
    .order("name", { ascending: true });
  if (error) {
    console.error("Supabase fetchSchools failed, using cache:", error);
    return loadLocalSchools();
  }
  const schools: HighSchool[] = (data || []).map((r: any) => ({
    id: r.id,
    name: r.name,
    offeredSubjects: Array.isArray(r.offered_subjects) ? r.offered_subjects : [],
  }));
  saveLocalSchools(schools); // refresh cache
  return schools;
}

export async function upsertSchool(school: HighSchool): Promise<void> {
  if (!supabase) {
    const list = loadLocalSchools();
    const idx = list.findIndex((s) => s.id === school.id);
    if (idx >= 0) list[idx] = school;
    else list.push(school);
    saveLocalSchools(list);
    return;
  }
  const { error } = await supabase.from("schools").upsert(
    {
      id: school.id,
      name: school.name,
      offered_subjects: school.offeredSubjects,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  );
  if (error) throw error;
}

export async function deleteSchool(id: string): Promise<void> {
  if (!supabase) {
    saveLocalSchools(loadLocalSchools().filter((s) => s.id !== id));
    return;
  }
  const { error } = await supabase.from("schools").delete().eq("id", id);
  if (error) throw error;
}

/**
 * Subscribe to real-time school changes.
 * Returns an unsubscribe function. No-op when Supabase isn't configured.
 */
export function subscribeSchools(
  onChange: (schools: HighSchool[]) => void
): () => void {
  const client = supabase;
  if (!client) return () => {};
  const channel = client
    .channel("schools-realtime")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "schools" },
      async () => {
        const next = await fetchSchools();
        onChange(next);
      }
    )
    .subscribe();
  return () => {
    client.removeChannel(channel);
  };
}

export { isSupabaseEnabled };

/**
 * Sensible defaults: subjects offered by most Korean general high schools.
 */
export const COMMON_OFFERED: string[] = [
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
