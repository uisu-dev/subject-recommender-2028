"use client";

import React from "react";
import { SUBJECTS } from "@/lib/subjects";

/**
 * Renders free-text where any occurrence of a "highlighted" subject name
 * (including its registered aliases) is wrapped in a colored span.
 *
 * Used by the 맞춤형 진학지도 tab to mark subjects the student has taken
 * inside the 핵심과목 / 권장과목 text of each result row.
 *
 * Matching strategy:
 *   - Iterate aliases longest-first so "미적분Ⅰ" wins over "미적분".
 *   - Skip a position if a previously-found match already covers it.
 *   - Sort matches by start index, then emit React fragments.
 */

type Props = {
  text: string;
  /** Canonical subject names the student has taken. */
  highlights: Set<string>;
  /** Tailwind classes for the highlighted span. */
  highlightClass?: string;
};

export default function HighlightedText({
  text,
  highlights,
  highlightClass = "rounded bg-emerald-100 px-1 py-0.5 text-emerald-800 font-semibold",
}: Props) {
  if (!text || highlights.size === 0) {
    return <span className="whitespace-pre-wrap break-words">{text}</span>;
  }

  // Build alias→canonical pairs only for selected subjects
  const aliasPairs: Array<{ alias: string; canonical: string }> = [];
  for (const subj of SUBJECTS) {
    if (highlights.has(subj.name)) {
      for (const a of subj.aliases) {
        aliasPairs.push({ alias: a, canonical: subj.name });
      }
    }
  }
  // Longest first for greedy matching
  aliasPairs.sort((a, b) => b.alias.length - a.alias.length);

  type Match = { start: number; end: number };
  const matches: Match[] = [];

  for (const { alias } of aliasPairs) {
    let pos = 0;
    while (true) {
      const idx = text.indexOf(alias, pos);
      if (idx === -1) break;
      const end = idx + alias.length;
      // Skip if overlapping an already-found longer match
      const overlap = matches.some((m) => m.start < end && m.end > idx);
      if (!overlap) matches.push({ start: idx, end });
      pos = end;
    }
  }

  matches.sort((a, b) => a.start - b.start);

  const segments: React.ReactNode[] = [];
  let cursor = 0;
  for (let i = 0; i < matches.length; i++) {
    const m = matches[i];
    if (cursor < m.start) {
      segments.push(text.slice(cursor, m.start));
    }
    segments.push(
      <mark key={i} className={highlightClass}>
        {text.slice(m.start, m.end)}
      </mark>
    );
    cursor = m.end;
  }
  if (cursor < text.length) {
    segments.push(text.slice(cursor));
  }

  return <span className="whitespace-pre-wrap break-words">{segments}</span>;
}
