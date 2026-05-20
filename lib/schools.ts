/**
 * School configuration.
 *
 * Schools are curated centrally in data/schools.json and shipped with the build.
 * To add or modify a school, edit that JSON and push a new commit — Vercel
 * auto-deploys and every user sees the change.
 *
 * The "active school" (which school THIS user is currently viewing) is kept
 * in localStorage since it's a per-browser UI preference.
 */

import schoolsData from "@/data/schools.json";

export type HighSchool = {
  id: string;
  name: string;
  /** Canonical subject names (from SUBJECTS in lib/subjects.ts) offered by this school. */
  offeredSubjects: string[];
};

export const SCHOOLS: HighSchool[] = (schoolsData as HighSchool[])
  .slice()
  .sort((a, b) => a.name.localeCompare(b.name, "ko"));

const ACTIVE_KEY = "subject-recommender:active-school";

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

// Taken subjects shared across "과목 이수 기반 검색" and "맞춤형 진학지도" tabs

const TAKEN_KEY = "subject-recommender:taken-subjects";

export function loadTakenSubjects(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(TAKEN_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? new Set(arr.filter((x) => typeof x === "string")) : new Set();
  } catch {
    return new Set();
  }
}

export function saveTakenSubjects(s: Set<string>): void {
  try {
    localStorage.setItem(TAKEN_KEY, JSON.stringify(Array.from(s)));
  } catch {
    // ignore
  }
}

export const CONTACT_EMAIL = "uisu@kakao.com";
