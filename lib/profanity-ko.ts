/**
 * Korean profanity filter for the anonymous board.
 *
 * Approach (intentionally conservative — false positives are worse than
 * misses for a counseling tool used by students/parents):
 *   1) Normalize: strip whitespace, punctuation, lowercase Latin.
 *   2) Substring-check against a curated banlist of clear curse words.
 *
 * Aggressive obfuscation (ㅅㅂ, 시1발, ㅆㅂ etc.) is not exhaustively handled.
 * Counter-cases that slip through can be added to the list over time.
 */

const BANLIST: string[] = [
  // 시발/씨발 계열
  "시발",
  "씨발",
  "시팔",
  "씨팔",
  "쒸발",
  "씨바",
  "시바",
  "씨봘",
  "ㅅㅂ",
  "ㅆㅂ",
  // 좆/좃 계열
  "좆",
  "좃",
  "좇",
  "졷",
  "존나",
  "졸라",
  "ㅈㄴ",
  // 새끼 (clear curse compounds only)
  "개새끼",
  "개새기",
  "개색기",
  "미친새끼",
  "병신새끼",
  "나쁜새끼",
  "썅새끼",
  // 병신/등신
  "병신",
  "븅신",
  "븅쉰",
  "등신",
  // 미친 (인신공격)
  "미친놈",
  "미친년",
  "돌은새끼",
  "또라이",
  // 개X (욕설용)
  "개년",
  "개놈",
  "개잡놈",
  "개잡년",
  "개돼지",
  // 엠창/엠병
  "엠창",
  "엠병",
  "옘병",
  // 호로/싸가지
  "호로새끼",
  "호로자식",
  "쌍놈",
  "쌍년",
  // 성적 부적절
  "자위",
  "야동",
  "야설",
  "보지년",
  "자지놈",
  // 영문 욕설
  "fuck",
  "shit",
  "bitch",
  "asshole",
  "dick",
  "cunt",
];

/** Aliases/leet-style substitutions normalized away before matching. */
const REPLACEMENTS: Array<[RegExp, string]> = [
  // Common letter→digit substitutions (very loose)
  [/[lI１]/g, "1"],
  [/[oO０]/g, "0"],
  // Strip leading 시1발 / 시!발 etc.
  [/[\d]/g, ""],
];

/**
 * Normalize text for filter matching. Lowercase, strip whitespace and
 * common punctuation, drop digits inserted to bypass filters.
 */
function normalize(input: string): string {
  let s = String(input || "").toLowerCase();
  // Strip whitespace
  s = s.replace(/\s+/g, "");
  // Strip common punctuation (Latin + Korean middots, dots, dashes, etc.)
  s = s.replace(/[!@#$%^&*()_+\-=\[\]{}|;:'",.<>?\/\\`~ㆍ·…―—–]/g, "");
  // Apply replacement passes
  for (const [re, sub] of REPLACEMENTS) {
    s = s.replace(re, sub);
  }
  return s;
}

export type ProfanityCheckResult =
  | { ok: true }
  | { ok: false; matched: string };

/** Returns { ok: true } if clean, else the matched banword. */
export function checkProfanity(text: string): ProfanityCheckResult {
  if (!text) return { ok: true };
  const n = normalize(text);
  for (const word of BANLIST) {
    const nw = normalize(word);
    if (!nw) continue;
    if (n.includes(nw)) return { ok: false, matched: word };
  }
  return { ok: true };
}
