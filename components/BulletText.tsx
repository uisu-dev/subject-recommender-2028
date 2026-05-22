"use client";

import HighlightedText from "./HighlightedText";

/**
 * Renders free-text content that contains "-" bullet markers as a clean
 * unordered list. Optionally wraps subject names from `highlights` in a
 * colored <mark> via HighlightedText.
 */

type Parsed = {
  intro: string;
  items: string[];
};

function parseBullets(raw: string): Parsed {
  const text = (raw || "").trim();
  if (!text) return { intro: "", items: [] };

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
      items[items.length - 1] += " " + t;
    }
  }
  return { intro, items };
}

type Props = {
  text: string;
  className?: string;
  marker?: "disc" | "none";
  /**
   * When provided, subject names from this set are highlighted in the text
   * via the HighlightedText component (canonical names + their aliases).
   */
  highlights?: Set<string>;
};

function renderInline(text: string, highlights?: Set<string>) {
  if (highlights && highlights.size > 0) {
    return <HighlightedText text={text} highlights={highlights} />;
  }
  return (
    <span className="whitespace-pre-wrap break-words">{text}</span>
  );
}

export default function BulletText({
  text,
  className = "",
  marker = "disc",
  highlights,
}: Props) {
  const { intro, items } = parseBullets(text);

  if (items.length === 0) {
    if (highlights && highlights.size > 0) {
      return (
        <span className={className}>
          <HighlightedText text={text} highlights={highlights} />
        </span>
      );
    }
    return (
      <span className={`whitespace-pre-wrap break-words ${className}`}>
        {text}
      </span>
    );
  }

  return (
    <div className={className}>
      {intro && (
        <p className="whitespace-pre-wrap break-words">
          {renderInline(intro, highlights)}
        </p>
      )}
      <ul
        className={`mt-1 space-y-0.5 ${
          marker === "disc"
            ? "list-disc pl-4 marker:text-ink-300"
            : "list-none pl-0"
        }`}
      >
        {items.map((item, i) => (
          <li key={i} className="whitespace-pre-wrap break-words">
            {renderInline(item, highlights)}
          </li>
        ))}
      </ul>
    </div>
  );
}
