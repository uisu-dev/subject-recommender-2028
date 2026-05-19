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

export const CONTACT_EMAIL = "uisu@kakao.com";
