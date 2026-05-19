// Subject vocabulary derived from inspection of file2 free-text fields.
// Used to:
//   (1) extract structured subject requirements from 핵심과목/권장과목 cells,
//   (2) power the "이수 과목 → 갈 수 있는 학과" reverse search.

export type Domain =
  | "국어"
  | "수학"
  | "영어"
  | "사회"
  | "과학"
  | "한국사"
  | "기타";

export type SubjectDef = {
  /** Canonical name shown in UI */
  name: string;
  /** Strings to scan for in raw text. First entry must be the canonical name. */
  aliases: string[];
  domain: Domain;
};

export const SUBJECTS: SubjectDef[] = [
  // 국어
  { name: "국어", aliases: ["국어"], domain: "국어" },
  { name: "화법과 언어", aliases: ["화법과 언어", "화법과언어"], domain: "국어" },
  { name: "독서와 작문", aliases: ["독서와 작문", "독서와작문"], domain: "국어" },
  { name: "문학", aliases: ["문학"], domain: "국어" },

  // 수학 (specific subjects)
  { name: "대수", aliases: ["대수"], domain: "수학" },
  {
    name: "확률과 통계",
    aliases: ["확률과 통계", "확률과통계", "확률·통계", "확률통계"],
    domain: "수학",
  },
  {
    name: "미적분Ⅰ",
    aliases: ["미적분Ⅰ", "미적분 Ⅰ", "미적분I", "미적분 I", "미적분1", "미적분 1"],
    domain: "수학",
  },
  {
    name: "미적분Ⅱ",
    aliases: ["미적분Ⅱ", "미적분 Ⅱ", "미적분II", "미적분 II", "미적분2", "미적분 2"],
    domain: "수학",
  },
  { name: "기하", aliases: ["기하"], domain: "수학" },
  { name: "인공지능 수학", aliases: ["인공지능 수학", "인공지능수학"], domain: "수학" },
  { name: "경제 수학", aliases: ["경제 수학", "경제수학"], domain: "수학" },
  {
    name: "실용 통계",
    aliases: ["실용 통계", "실용통계"],
    domain: "수학",
  },
  {
    name: "수학과제 탐구",
    aliases: ["수학과제 탐구", "수학과제탐구"],
    domain: "수학",
  },

  // 영어
  { name: "영어", aliases: ["영어"], domain: "영어" },
  {
    name: "심화 영어",
    aliases: ["심화 영어", "심화영어"],
    domain: "영어",
  },

  // 사회
  { name: "일반사회", aliases: ["일반사회", "일반 사회"], domain: "사회" },
  { name: "역사", aliases: ["세계사", "역사"], domain: "사회" },
  { name: "지리", aliases: ["한국지리", "세계지리", "지리"], domain: "사회" },
  { name: "윤리", aliases: ["윤리와 사상", "현대사회와 윤리", "윤리"], domain: "사회" },
  { name: "정치", aliases: ["정치"], domain: "사회" },
  { name: "경제", aliases: ["경제"], domain: "사회" },
  { name: "법과 사회", aliases: ["법과 사회", "법과사회"], domain: "사회" },

  // 과학
  { name: "물리학", aliases: ["물리학", "물리"], domain: "과학" },
  { name: "화학", aliases: ["화학"], domain: "과학" },
  { name: "생명과학", aliases: ["생명과학", "생명 과학"], domain: "과학" },
  { name: "지구과학", aliases: ["지구과학", "지구 과학"], domain: "과학" },

  // 한국사 (별도 영역)
  { name: "한국사", aliases: ["한국사"], domain: "한국사" },

  // 기타
  {
    name: "제2외국어",
    aliases: ["제2외국어", "제2 외국어", "일본어", "중국어", "독일어", "프랑스어", "스페인어", "러시아어", "아랍어"],
    domain: "기타",
  },
  { name: "한문", aliases: ["한문 고전 읽기", "한문"], domain: "기타" },
];

// Umbrella terms — present in text when no specific subject is named.
const UMBRELLA: Record<string, Domain> = {
  수학: "수학",
  사회: "사회",
  과학: "과학",
  국어: "국어",
  영어: "영어",
  한국사: "한국사",
};

/** Phrases that indicate "open / no specific requirement" */
const OPEN_MARKERS = [
  "계열 구분 없이",
  "진로와 적성",
  "진로 및 적성",
  "자신의 진로",
  "적성에 따라",
  "적성을 고려",
  "적성에 맞게",
  "자유롭게",
];

export type ParsedRequirement = {
  /** Subject names that are explicitly listed. */
  specific: string[];
  /** Domains where only umbrella term is used (no specific subjects listed within). */
  umbrellaDomains: Domain[];
  /** True if text is free-form guidance without specific requirements. */
  isOpen: boolean;
  /** True if the cell had no meaningful content. */
  isEmpty: boolean;
};

/**
 * Parse a free-text subject requirement cell.
 * Strategy:
 *   1. If empty/dash → isEmpty.
 *   2. If text matches open-marker phrases → isOpen.
 *   3. Scan for specific subject aliases (longest first so "미적분Ⅱ" beats "미적분").
 *   4. Detect umbrella mentions for domains that have NO specific subject listed inside.
 */
export function parseRequirement(raw: string): ParsedRequirement {
  const text = (raw || "").trim();
  if (!text || text === "-" || text === "–") {
    return { specific: [], umbrellaDomains: [], isOpen: false, isEmpty: true };
  }

  const isOpen = OPEN_MARKERS.some((m) => text.includes(m));

  // Sort aliases by length desc for greedy matching, then mask matched ranges
  const flat: Array<{ canonical: string; alias: string; domain: Domain }> = [];
  for (const s of SUBJECTS) {
    for (const a of s.aliases) flat.push({ canonical: s.name, alias: a, domain: s.domain });
  }
  flat.sort((a, b) => b.alias.length - a.alias.length);

  let masked = text;
  const foundCanonical = new Set<string>();
  const domainsWithSpecific = new Set<Domain>();
  for (const f of flat) {
    if (!masked.includes(f.alias)) continue;
    foundCanonical.add(f.canonical);
    domainsWithSpecific.add(f.domain);
    masked = masked.split(f.alias).join(" ".repeat(f.alias.length));
  }

  // Umbrella detection: search masked text for raw "수학"/"과학"/etc.
  const umbrellaDomains: Domain[] = [];
  for (const [word, domain] of Object.entries(UMBRELLA)) {
    if (masked.includes(word) && !domainsWithSpecific.has(domain)) {
      umbrellaDomains.push(domain);
    }
  }

  return {
    specific: Array.from(foundCanonical),
    umbrellaDomains,
    isOpen,
    isEmpty: false,
  };
}

/** Returns the canonical Domain a subject belongs to. */
export function domainOf(subject: string): Domain | null {
  const def = SUBJECTS.find((s) => s.name === subject);
  return def ? def.domain : null;
}

export type MatchResult = {
  status: "open" | "no-data" | "ok" | "partial" | "unmet";
  coreMet: number;
  coreTotal: number;
  recMet: number;
  recTotal: number;
  missingCore: string[];
  reason?: string;
};

/**
 * Given the student's selected subjects and parsed requirements,
 * decide if the student "covers" the requirements.
 *
 * Rules:
 * - If core is empty/open → status open
 * - If a domain is umbrella-only ("수학" without specifics), require ≥1 subject from that domain
 * - Otherwise every specific subject in core must be in studentSubjects
 */
export function evaluateMatch(
  student: Set<string>,
  studentDomains: Set<Domain>,
  core: ParsedRequirement,
  rec: ParsedRequirement
): MatchResult {
  if (core.isEmpty && rec.isEmpty) {
    return {
      status: "no-data",
      coreMet: 0,
      coreTotal: 0,
      recMet: 0,
      recTotal: 0,
      missingCore: [],
      reason: "권장과목 데이터 없음",
    };
  }
  if (core.isOpen || (core.isEmpty && !rec.isEmpty)) {
    // Open guidance: count rec subjects for ranking but always eligible
    const recTotal = rec.specific.length;
    const recMet = rec.specific.filter((s) => student.has(s)).length;
    return {
      status: "open",
      coreMet: 0,
      coreTotal: 0,
      recMet,
      recTotal,
      missingCore: [],
      reason: "특정 과목 요구 없음 (진로·적성 기반 자율 이수)",
    };
  }

  const missingCore = core.specific.filter((s) => !student.has(s));
  // Umbrella domains in core: need at least one subject from that domain
  const missingUmbrella: Domain[] = [];
  for (const d of core.umbrellaDomains) {
    if (!studentDomains.has(d)) missingUmbrella.push(d);
  }

  const coreTotal = core.specific.length + core.umbrellaDomains.length;
  const coreMet =
    core.specific.length -
    missingCore.length +
    (core.umbrellaDomains.length - missingUmbrella.length);

  const recTotal = rec.specific.length;
  const recMet = rec.specific.filter((s) => student.has(s)).length;

  const allMissing = [
    ...missingCore,
    ...missingUmbrella.map((d) => `${d} 영역`),
  ];

  let status: MatchResult["status"];
  if (allMissing.length === 0) status = "ok";
  else if (coreMet > 0) status = "partial";
  else status = "unmet";

  return { status, coreMet, coreTotal, recMet, recTotal, missingCore: allMissing };
}
