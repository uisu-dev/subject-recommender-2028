// Subject vocabulary covering every distinct subject that appears in
// the source Excel files (file2 free-text + file1 column headers).
//
// Used to:
//   (1) extract structured subject requirements from 핵심과목/권장과목 cells,
//   (2) power the "이수 과목 → 갈 수 있는 학과" reverse search,
//   (3) populate the per-school "개설 과목" checklist.

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
  // ===== 국어 =====
  { name: "국어", aliases: ["국어"], domain: "국어" },
  { name: "화법과 언어", aliases: ["화법과 언어", "화법과언어"], domain: "국어" },
  { name: "독서와 작문", aliases: ["독서와 작문", "독서와작문"], domain: "국어" },
  { name: "문학", aliases: ["문학"], domain: "국어" },
  { name: "주제 탐구 독서", aliases: ["주제 탐구 독서", "주제탐구독서"], domain: "국어" },
  { name: "문학과 영상", aliases: ["문학과 영상", "문학과영상"], domain: "국어" },
  { name: "직무 의사소통", aliases: ["직무 의사소통", "직무의사소통"], domain: "국어" },
  { name: "독서 토론과 글쓰기", aliases: ["독서 토론과 글쓰기", "독서토론과 글쓰기"], domain: "국어" },
  { name: "매체 의사소통", aliases: ["매체 의사소통", "매체의사소통"], domain: "국어" },

  // ===== 수학 =====
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
  { name: "직무 수학", aliases: ["직무 수학", "직무수학"], domain: "수학" },
  { name: "실용 통계", aliases: ["실용 통계", "실용통계"], domain: "수학" },
  { name: "수학과제 탐구", aliases: ["수학과제 탐구", "수학과제탐구"], domain: "수학" },
  { name: "수학과 문화", aliases: ["수학과 문화", "수학과문화"], domain: "수학" },
  { name: "실용 수학", aliases: ["실용 수학", "실용수학"], domain: "수학" },

  // ===== 영어 =====
  { name: "영어", aliases: ["영어"], domain: "영어" },
  { name: "영어Ⅰ", aliases: ["영어Ⅰ", "영어 Ⅰ", "영어I", "영어 I"], domain: "영어" },
  { name: "영어Ⅱ", aliases: ["영어Ⅱ", "영어 Ⅱ", "영어II", "영어 II"], domain: "영어" },
  {
    name: "영어 독해와 작문",
    aliases: ["영어 독해와 작문", "영어독해와 작문"],
    domain: "영어",
  },
  {
    name: "영어 발표와 토론",
    aliases: ["영어 발표와 토론", "영어발표와 토론"],
    domain: "영어",
  },
  { name: "심화 영어", aliases: ["심화 영어", "심화영어"], domain: "영어" },
  {
    name: "심화 영어 독해와 작문",
    aliases: ["심화 영어 독해와 작문", "심화영어 독해와 작문"],
    domain: "영어",
  },
  {
    name: "영미 문학 읽기",
    aliases: ["영미 문학 읽기", "영미문학 읽기"],
    domain: "영어",
  },
  {
    name: "실생활 영어 회화",
    aliases: ["실생활 영어 회화", "실생활영어 회화"],
    domain: "영어",
  },
  { name: "미디어 영어", aliases: ["미디어 영어", "미디어영어"], domain: "영어" },
  {
    name: "세계 문화와 영어",
    aliases: ["세계 문화와 영어", "세계문화와 영어"],
    domain: "영어",
  },

  // ===== 사회 — 일반사회/정치/경제/법 =====
  { name: "일반사회", aliases: ["일반사회", "일반 사회"], domain: "사회" },
  {
    name: "사회와 문화",
    aliases: ["사회와 문화", "사회와문화"],
    domain: "사회",
  },
  { name: "정치", aliases: ["정치"], domain: "사회" },
  { name: "법과 사회", aliases: ["법과 사회", "법과사회"], domain: "사회" },
  { name: "경제", aliases: ["경제"], domain: "사회" },
  {
    name: "사회문제 탐구",
    aliases: ["사회문제 탐구", "사회문제탐구"],
    domain: "사회",
  },
  {
    name: "국제 관계의 이해",
    aliases: ["국제 관계의 이해", "국제관계의 이해"],
    domain: "사회",
  },
  {
    name: "금융과 경제생활",
    aliases: ["금융과 경제생활", "금융과경제생활"],
    domain: "사회",
  },
  {
    name: "기후변화와 지속가능한 세계",
    aliases: ["기후변화와 지속가능한 세계", "기후변화와지속가능한 세계"],
    domain: "사회",
  },

  // ===== 사회 — 역사 =====
  { name: "역사", aliases: ["역사"], domain: "사회" },
  { name: "세계사", aliases: ["세계사"], domain: "사회" },
  {
    name: "동아시아 역사 기행",
    aliases: ["동아시아 역사 기행", "동아시아역사 기행"],
    domain: "사회",
  },
  {
    name: "역사로 탐구하는 현대 세계",
    aliases: ["역사로 탐구하는 현대 세계", "역사로탐구하는 현대 세계"],
    domain: "사회",
  },

  // ===== 사회 — 지리 =====
  { name: "지리", aliases: ["지리"], domain: "사회" },
  { name: "한국지리", aliases: ["한국지리"], domain: "사회" },
  {
    name: "한국지리 탐구",
    aliases: ["한국지리 탐구", "한국지리탐구"],
    domain: "사회",
  },
  { name: "세계지리", aliases: ["세계지리"], domain: "사회" },
  {
    name: "도시의 미래 탐구",
    aliases: ["도시의 미래 탐구", "도시의미래 탐구"],
    domain: "사회",
  },
  { name: "여행지리", aliases: ["여행지리"], domain: "사회" },
  {
    name: "세계시민과 지리",
    aliases: ["세계시민과 지리", "세계시민과지리"],
    domain: "사회",
  },

  // ===== 사회 — 윤리/도덕 =====
  { name: "윤리", aliases: ["윤리"], domain: "사회" },
  {
    name: "윤리와 사상",
    aliases: ["윤리와 사상", "윤리와사상"],
    domain: "사회",
  },
  {
    name: "인문학과 윤리",
    aliases: ["인문학과 윤리", "인문학과윤리"],
    domain: "사회",
  },
  {
    name: "현대사회와 윤리",
    aliases: ["현대사회와 윤리", "현대사회와윤리"],
    domain: "사회",
  },
  { name: "도덕", aliases: ["도덕"], domain: "사회" },
  {
    name: "윤리문제 탐구",
    aliases: ["윤리문제 탐구", "윤리문제탐구"],
    domain: "사회",
  },

  // ===== 과학 — 물리 =====
  { name: "물리학", aliases: ["물리학", "물리"], domain: "과학" },
  {
    name: "역학과 에너지",
    aliases: ["역학과 에너지", "역학과에너지"],
    domain: "과학",
  },
  {
    name: "전자기와 양자",
    aliases: ["전자기와 양자", "전자기와양자"],
    domain: "과학",
  },

  // ===== 과학 — 화학 =====
  { name: "화학", aliases: ["화학"], domain: "과학" },
  {
    name: "물질과 에너지",
    aliases: ["물질과 에너지", "물질과에너지"],
    domain: "과학",
  },
  {
    name: "화학 반응의 세계",
    aliases: ["화학 반응의 세계", "화학반응의 세계", "화학반응의세계"],
    domain: "과학",
  },

  // ===== 과학 — 생명 =====
  { name: "생명과학", aliases: ["생명과학", "생명 과학"], domain: "과학" },
  {
    name: "세포와 물질대사",
    aliases: ["세포와 물질대사", "세포와물질대사"],
    domain: "과학",
  },
  {
    name: "생물의 유전",
    aliases: ["생물의 유전", "생물의유전"],
    domain: "과학",
  },

  // ===== 과학 — 지구 =====
  { name: "지구과학", aliases: ["지구과학", "지구 과학"], domain: "과학" },
  {
    name: "지구시스템과학",
    aliases: ["지구시스템과학", "지구시스템 과학"],
    domain: "과학",
  },
  {
    name: "행성우주과학",
    aliases: ["행성우주과학", "행성 우주 과학"],
    domain: "과학",
  },

  // ===== 과학 — 융합 =====
  {
    name: "융합과학 탐구",
    aliases: ["융합과학 탐구", "융합과학탐구"],
    domain: "과학",
  },
  {
    name: "과학의 역사와 문화",
    aliases: ["과학의 역사와 문화", "과학의역사와 문화"],
    domain: "과학",
  },
  {
    name: "기후변화와 환경생태",
    aliases: ["기후변화와 환경생태", "기후변화와환경생태"],
    domain: "과학",
  },

  // ===== 한국사 (별도 영역) =====
  { name: "한국사", aliases: ["한국사"], domain: "한국사" },

  // ===== 기타 — 제2외국어 =====
  {
    name: "제2외국어",
    aliases: ["제2외국어", "제2 외국어"],
    domain: "기타",
  },
  { name: "독일어", aliases: ["독일어"], domain: "기타" },
  { name: "프랑스어", aliases: ["프랑스어"], domain: "기타" },
  { name: "스페인어", aliases: ["스페인어"], domain: "기타" },
  { name: "중국어", aliases: ["중국어"], domain: "기타" },
  { name: "일본어", aliases: ["일본어"], domain: "기타" },
  { name: "러시아어", aliases: ["러시아어"], domain: "기타" },
  { name: "아랍어", aliases: ["아랍어"], domain: "기타" },
  { name: "베트남어", aliases: ["베트남어"], domain: "기타" },

  // ===== 기타 — 한문/예체능/실용 =====
  { name: "한문", aliases: ["한문"], domain: "기타" },
  {
    name: "한문 고전 읽기",
    aliases: ["한문 고전 읽기", "한문고전 읽기"],
    domain: "기타",
  },
  { name: "체육", aliases: ["체육"], domain: "기타" },
  { name: "음악", aliases: ["음악"], domain: "기타" },
  { name: "미술", aliases: ["미술"], domain: "기타" },
  {
    name: "기술·가정",
    aliases: ["기술·가정", "기술가정", "기술 가정"],
    domain: "기타",
  },
  { name: "정보", aliases: ["정보"], domain: "기타" },
  { name: "교양", aliases: ["교양"], domain: "기타" },

  // ===== 기타 — 체육 진로·융합선택 =====
  { name: "스포츠 과학", aliases: ["스포츠 과학", "스포츠과학"], domain: "기타" },
  { name: "스포츠 문화", aliases: ["스포츠 문화", "스포츠문화"], domain: "기타" },
  { name: "스포츠 생활", aliases: ["스포츠 생활", "스포츠생활", "스포츠 생활1", "스포츠 생활2"], domain: "기타" },
  { name: "운동과 건강", aliases: ["운동과 건강", "운동과건강"], domain: "기타" },

  // ===== 기타 — 예술 진로·융합선택 =====
  {
    name: "음악 연주와 창작",
    aliases: ["음악 연주와 창작", "음악연주와 창작"],
    domain: "기타",
  },
  { name: "미술 창작", aliases: ["미술 창작", "미술창작"], domain: "기타" },
  {
    name: "미술 감상과 비평",
    aliases: ["미술 감상과 비평", "미술감상과 비평"],
    domain: "기타",
  },

  // ===== 기타 — 기술·가정 진로·융합선택 =====
  {
    name: "로봇과 공학세계",
    aliases: ["로봇과 공학세계", "로봇과공학세계"],
    domain: "기타",
  },
  {
    name: "생활과학 탐구",
    aliases: ["생활과학 탐구", "생활과학탐구"],
    domain: "기타",
  },
  {
    name: "창의 공학 설계",
    aliases: ["창의 공학 설계", "창의공학 설계"],
    domain: "기타",
  },
  {
    name: "아동발달과 부모",
    aliases: ["아동발달과 부모", "아동발달과부모"],
    domain: "기타",
  },

  // ===== 기타 — 정보 진로·융합선택 =====
  { name: "데이터 과학", aliases: ["데이터 과학", "데이터과학"], domain: "기타" },
  { name: "정보과학", aliases: ["정보과학", "정보 과학"], domain: "기타" },
  {
    name: "인공지능 기초",
    aliases: ["인공지능 기초", "인공지능기초"],
    domain: "기타",
  },
  { name: "프로그래밍", aliases: ["프로그래밍"], domain: "기타" },
  {
    name: "소프트웨어와 생활",
    aliases: ["소프트웨어와 생활", "소프트웨어와생활"],
    domain: "기타",
  },

  // ===== 기타 — 외국어/한문 진로·융합선택 =====
  { name: "중국어 회화", aliases: ["중국어 회화", "중국어회화"], domain: "기타" },
  { name: "중국 문화", aliases: ["중국 문화", "중국문화"], domain: "기타" },
  {
    name: "언어생활과 한자",
    aliases: ["언어생활과 한자", "언어생활과한자"],
    domain: "기타",
  },
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
  specific: string[];
  umbrellaDomains: Domain[];
  isOpen: boolean;
  isEmpty: boolean;
};

export function parseRequirement(raw: string): ParsedRequirement {
  const text = (raw || "").trim();
  if (!text || text === "-" || text === "–") {
    return { specific: [], umbrellaDomains: [], isOpen: false, isEmpty: true };
  }

  const isOpen = OPEN_MARKERS.some((m) => text.includes(m));

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
