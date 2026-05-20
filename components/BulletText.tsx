"use client";

/**
 * Renders free-text content that contains "-" bullet markers as a clean
 * unordered list.
 *
 * Example input:
 *   "전공기초 학업 역량 -수학 일반선택 과목: 대수 -수학 진로선택 과목: 미적분Ⅱ"
 * → Renders:
 *   전공기초 학업 역량
 *   • 수학 일반선택 과목: 대수
 *   • 수학 진로선택 과목: 미적분Ⅱ
 *
 * Detection rule:
 *   A bullet starts at "<whitespace>-<Korean letter>" or at the very start
 *   of the string if it begins with "-<Korean>". This avoids false matches
 *   on regular hyphens like "한양대-에리카" or "1-2".
 *
 * If no bullet pattern is detected, the text renders as plain inline content.
 */

type Parsed = {
  intro: string;
  items: string[];
};

function parseBullets(raw: string): Parsed {
  const text = (raw || "").trim();
  if (!text) return { intro: "", items: [] };

  // Normalize bullet markers: " -Korean" or "<TAB>-Korean" → newline-dash
  const normalized = text.replace(/\s+-(?=[가-힣])/g, "\n-");

  const lines = normalized.split(/\n+/);
  let intro = "";
  const items: string[] = [];
  for (const line of lines) {
    const t = line.trim();
    if (!t) continue;
    if (t.startsWith("-")) {
      items.push(t.slice(1).trim());
    } else if (items.length === 0) {
      intro = intro ? intro + " " + t : t;
    } else {
      // Continuation of a bullet line (rare; defensive)
      items[items.length - 1] += " " + t;
    }
  }
  return { intro, items };
}

type Props = {
  text: string;
  /** Optional className applied to the wrapping element when items exist. */
  className?: string;
  /** Bullet style — defaults to "disc" (small dot). Use "none" for chips/inline. */
  marker?: "disc" | "none";
};

export default function BulletText({ text, className = "", marker = "disc" }: Props) {
  const { intro, items } = parseBullets(text);

  // No bullet markers detected → render inline as before
  if (items.length === 0) {
    return (
      <span className={`whitespace-pre-wrap break-words ${className}`}>
        {text}
      </span>
    );
  }

  return (
    <div className={className}>
      {intro && (
        <p className="whitespace-pre-wrap break-words">{intro}</p>
      )}
      <ul
        className={`mt-1 space-y-0.5 ${
          marker === "disc" ? "list-disc pl-4 marker:text-ink-300" : "list-none pl-0"
        }`}
      >
        {items.map((item, i) => (
          <li key={i} className="whitespace-pre-wrap break-words">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
