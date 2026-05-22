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

  // ============================================
  // 추가된 진로·융합·전문 과목 (아산 지역 10개 고교 편제표 기반)
  // ============================================

  // ----- 국어 -----
  { name: "소설 창작", aliases: ["소설 창작", "소설창작"], domain: "국어" },
  { name: "언어생활 탐구", aliases: ["언어생활 탐구", "언어생활탐구"], domain: "국어" },

  // ----- 수학 -----
  { name: "AP미적분학Ⅰ", aliases: ["AP미적분학Ⅰ"], domain: "수학" },
  { name: "IB 수학 분석과 접근 SL Ⅰ", aliases: ["IB 수학 분석과 접근 SL Ⅰ", "IB수학분석과접근SLⅠ"], domain: "수학" },
  { name: "IB 수학 분석과 접근 SL Ⅱ", aliases: ["IB 수학 분석과 접근 SL Ⅱ", "IB수학분석과접근SLⅡ"], domain: "수학" },
  { name: "IB 수학 분석과 접근 SL Ⅲ", aliases: ["IB 수학 분석과 접근 SL Ⅲ", "IB수학분석과접근SLⅢ"], domain: "수학" },
  { name: "IB 수학 분석과 접근 SL Ⅳ", aliases: ["IB 수학 분석과 접근 SL Ⅳ", "IB수학분석과접근SLⅣ"], domain: "수학" },
  { name: "IB 수학 응용과 해석 HL Ⅰ", aliases: ["IB 수학 응용과 해석 HL Ⅰ", "IB수학응용과해석HLⅠ"], domain: "수학" },
  { name: "IB 수학 응용과 해석 HL Ⅱ", aliases: ["IB 수학 응용과 해석 HL Ⅱ", "IB수학응용과해석HLⅡ"], domain: "수학" },
  { name: "IB 수학 응용과 해석 HL Ⅲ", aliases: ["IB 수학 응용과 해석 HL Ⅲ", "IB수학응용과해석HLⅢ"], domain: "수학" },
  { name: "IB 수학 응용과 해석 HL Ⅳ", aliases: ["IB 수학 응용과 해석 HL Ⅳ", "IB수학응용과해석HLⅣ"], domain: "수학" },
  { name: "고급 대수", aliases: ["고급 대수", "고급대수"], domain: "수학" },
  { name: "고급 미적분", aliases: ["고급 미적분", "고급미적분"], domain: "수학" },
  { name: "선형대수학", aliases: ["선형대수학"], domain: "수학" },
  { name: "이산 수학", aliases: ["이산 수학", "이산수학"], domain: "수학" },
  { name: "전문 수학", aliases: ["전문 수학", "전문수학"], domain: "수학" },
  { name: "통계와 사회", aliases: ["통계와 사회", "통계와사회"], domain: "수학" },

  // ----- 영어 -----
  { name: "IB 언어와 문학 HL Ⅰ", aliases: ["IB 언어와 문학 HL Ⅰ", "IB언어와문학HLⅠ"], domain: "영어" },
  { name: "IB 언어와 문학 HL Ⅱ", aliases: ["IB 언어와 문학 HL Ⅱ", "IB언어와문학HLⅡ"], domain: "영어" },
  { name: "IB 언어와 문학 HL Ⅲ", aliases: ["IB 언어와 문학 HL Ⅲ", "IB언어와문학HLⅢ"], domain: "영어" },
  { name: "IB 언어와 문학 HL Ⅳ", aliases: ["IB 언어와 문학 HL Ⅳ", "IB언어와문학HLⅣ"], domain: "영어" },
  { name: "IB 언어와 문학 SL Ⅰ", aliases: ["IB 언어와 문학 SL Ⅰ", "IB언어와문학SLⅠ"], domain: "영어" },
  { name: "IB 언어와 문학 SL Ⅱ", aliases: ["IB 언어와 문학 SL Ⅱ", "IB언어와문학SLⅡ"], domain: "영어" },
  { name: "IB 언어와 문학 SL Ⅲ", aliases: ["IB 언어와 문학 SL Ⅲ", "IB언어와문학SLⅢ"], domain: "영어" },
  { name: "IB 언어와 문학 SL Ⅳ", aliases: ["IB 언어와 문학 SL Ⅳ", "IB언어와문학SLⅣ"], domain: "영어" },
  { name: "IB 영어 HL Ⅰ", aliases: ["IB 영어 HL Ⅰ", "IB영어HLⅠ"], domain: "영어" },
  { name: "IB 영어 HL Ⅱ", aliases: ["IB 영어 HL Ⅱ", "IB영어HLⅡ"], domain: "영어" },
  { name: "IB 영어 HL Ⅲ", aliases: ["IB 영어 HL Ⅲ", "IB영어HLⅢ"], domain: "영어" },
  { name: "IB 영어 HL Ⅳ", aliases: ["IB 영어 HL Ⅳ", "IB영어HLⅣ"], domain: "영어" },
  { name: "IB 영어 SL Ⅰ", aliases: ["IB 영어 SL Ⅰ", "IB영어SLⅠ"], domain: "영어" },
  { name: "IB 영어 SL Ⅱ", aliases: ["IB 영어 SL Ⅱ", "IB영어SLⅡ"], domain: "영어" },
  { name: "IB 영어 SL Ⅲ", aliases: ["IB 영어 SL Ⅲ", "IB영어SLⅢ"], domain: "영어" },
  { name: "IB 영어 SL Ⅳ", aliases: ["IB 영어 SL Ⅳ", "IB영어SLⅣ"], domain: "영어" },
  { name: "IB 영어 연극이론과 창작 SL Ⅰ", aliases: ["IB 영어 연극이론과 창작 SL Ⅰ", "IB영어연극이론과창작SLⅠ"], domain: "영어" },
  { name: "IB 영어 연극이론과 창작 SL Ⅱ", aliases: ["IB 영어 연극이론과 창작 SL Ⅱ", "IB영어연극이론과창작SLⅡ"], domain: "영어" },
  { name: "IB 영어 연극이론과 창작 SL Ⅲ", aliases: ["IB 영어 연극이론과 창작 SL Ⅲ", "IB영어연극이론과창작SLⅢ"], domain: "영어" },
  { name: "IB 영어 연극이론과 창작 SL Ⅳ", aliases: ["IB 영어 연극이론과 창작 SL Ⅳ", "IB영어연극이론과창작SLⅣ"], domain: "영어" },
  { name: "비판적 사고와 영어 작문", aliases: ["비판적 사고와 영어 작문", "비판적사고와영어작문"], domain: "영어" },
  { name: "비판적 사고와 영어 토론", aliases: ["비판적 사고와 영어 토론", "비판적사고와영어토론"], domain: "영어" },
  { name: "심화 영어 독해Ⅰ", aliases: ["심화 영어 독해Ⅰ", "심화영어독해Ⅰ"], domain: "영어" },
  { name: "심화 영어 독해Ⅱ", aliases: ["심화 영어 독해Ⅱ", "심화영어독해Ⅱ"], domain: "영어" },
  { name: "심화 영어 작문Ⅰ", aliases: ["심화 영어 작문Ⅰ", "심화영어작문Ⅰ"], domain: "영어" },
  { name: "심화 영어 작문Ⅱ", aliases: ["심화 영어 작문Ⅱ", "심화영어작문Ⅱ"], domain: "영어" },
  { name: "심화 영어 회화Ⅰ", aliases: ["심화 영어 회화Ⅰ", "심화영어회화Ⅰ"], domain: "영어" },
  { name: "심화 영어 회화Ⅱ", aliases: ["심화 영어 회화Ⅱ", "심화영어회화Ⅱ"], domain: "영어" },
  { name: "심화 영어Ⅰ", aliases: ["심화 영어Ⅰ", "심화영어Ⅰ"], domain: "영어" },
  { name: "심화 영어Ⅱ", aliases: ["심화 영어Ⅱ", "심화영어Ⅱ"], domain: "영어" },
  { name: "직무 영어", aliases: ["직무 영어", "직무영어"], domain: "영어" },

  // ----- 사회 -----
  { name: "IB 경제 SL Ⅰ", aliases: ["IB 경제 SL Ⅰ", "IB경제SLⅠ"], domain: "사회" },
  { name: "IB 경제 SL Ⅱ", aliases: ["IB 경제 SL Ⅱ", "IB경제SLⅡ"], domain: "사회" },
  { name: "IB 경제 SL Ⅲ", aliases: ["IB 경제 SL Ⅲ", "IB경제SLⅢ"], domain: "사회" },
  { name: "IB 경제 SL Ⅳ", aliases: ["IB 경제 SL Ⅳ", "IB경제SLⅣ"], domain: "사회" },
  { name: "IB 역사 HL Ⅰ", aliases: ["IB 역사 HL Ⅰ", "IB역사HLⅠ"], domain: "사회" },
  { name: "IB 역사 HL Ⅱ", aliases: ["IB 역사 HL Ⅱ", "IB역사HLⅡ"], domain: "사회" },
  { name: "IB 역사 HL Ⅲ", aliases: ["IB 역사 HL Ⅲ", "IB역사HLⅢ"], domain: "사회" },
  { name: "IB 역사 HL Ⅳ", aliases: ["IB 역사 HL Ⅳ", "IB역사HLⅣ"], domain: "사회" },
  { name: "IB 역사 SL Ⅰ", aliases: ["IB 역사 SL Ⅰ", "IB역사SLⅠ"], domain: "사회" },
  { name: "IB 역사 SL Ⅱ", aliases: ["IB 역사 SL Ⅱ", "IB역사SLⅡ"], domain: "사회" },
  { name: "IB 역사 SL Ⅲ", aliases: ["IB 역사 SL Ⅲ", "IB역사SLⅢ"], domain: "사회" },
  { name: "IB 역사 SL Ⅳ", aliases: ["IB 역사 SL Ⅳ", "IB역사SLⅣ"], domain: "사회" },
  { name: "IB 역사 Ⅱ", aliases: ["IB 역사 Ⅱ", "IB역사Ⅱ"], domain: "사회" },
  { name: "IB 역사 Ⅲ", aliases: ["IB 역사 Ⅲ", "IB역사Ⅲ"], domain: "사회" },
  { name: "IB 지식이론 Ⅰ", aliases: ["IB 지식이론 Ⅰ", "IB지식이론Ⅰ"], domain: "사회" },
  { name: "IB 지식이론 Ⅱ", aliases: ["IB 지식이론 Ⅱ", "IB지식이론Ⅱ"], domain: "사회" },
  { name: "IB 지식이론 Ⅲ", aliases: ["IB 지식이론 Ⅲ", "IB지식이론Ⅲ"], domain: "사회" },
  { name: "IB 지식이론 Ⅳ", aliases: ["IB 지식이론 Ⅳ", "IB지식이론Ⅳ"], domain: "사회" },
  { name: "IB 창의융합과제연구 Ⅰ", aliases: ["IB 창의융합과제연구 Ⅰ", "IB창의융합과제연구Ⅰ"], domain: "사회" },
  { name: "IB 창의융합과제연구 Ⅱ", aliases: ["IB 창의융합과제연구 Ⅱ", "IB창의융합과제연구Ⅱ"], domain: "사회" },
  { name: "국제 경제", aliases: ["국제 경제", "국제경제"], domain: "사회" },
  { name: "국제 관계와 국제기구", aliases: ["국제 관계와 국제기구", "국제관계와국제기구"], domain: "사회" },
  { name: "국제 정치", aliases: ["국제 정치", "국제정치"], domain: "사회" },
  { name: "국제법", aliases: ["국제법"], domain: "사회" },
  { name: "기업과 경영", aliases: ["기업과 경영", "기업과경영"], domain: "사회" },
  { name: "논리와 사고", aliases: ["논리와 사고", "논리와사고"], domain: "사회" },
  { name: "논술", aliases: ["논술"], domain: "사회" },
  { name: "마케팅과 광고", aliases: ["마케팅과 광고", "마케팅과광고"], domain: "사회" },
  { name: "미디어와 사회", aliases: ["미디어와 사회", "미디어와사회"], domain: "사회" },
  { name: "미래 사회학", aliases: ["미래 사회학", "미래사회학"], domain: "사회" },
  { name: "비교 문화", aliases: ["비교 문화", "비교문화"], domain: "사회" },
  { name: "사회 문제와 윤리", aliases: ["사회 문제와 윤리", "사회문제와윤리"], domain: "사회" },
  { name: "삶과 종교", aliases: ["삶과 종교", "삶과종교"], domain: "사회" },
  { name: "세계 문제와 미래 사회", aliases: ["세계 문제와 미래 사회", "세계문제와미래사회"], domain: "사회" },
  { name: "세계 역사와 문화", aliases: ["세계 역사와 문화", "세계역사와문화"], domain: "사회" },
  { name: "세계시민교육", aliases: ["세계시민교육"], domain: "사회" },
  { name: "융합지성사", aliases: ["융합지성사"], domain: "사회" },
  { name: "인간 발달", aliases: ["인간 발달", "인간발달"], domain: "사회" },
  { name: "인간과 경제활동", aliases: ["인간과 경제활동", "인간과경제활동"], domain: "사회" },
  { name: "인간과 심리", aliases: ["인간과 심리", "인간과심리"], domain: "사회" },
  { name: "인간과 철학", aliases: ["인간과 철학", "인간과철학"], domain: "사회" },
  { name: "진로와 직업", aliases: ["진로와 직업", "진로와직업"], domain: "사회" },
  { name: "창의융합과제연구", aliases: ["창의융합과제연구"], domain: "사회" },
  { name: "현대 경제 탐구", aliases: ["현대 경제 탐구", "현대경제탐구"], domain: "사회" },
  { name: "현대 세계의 변화", aliases: ["현대 세계의 변화", "현대세계의변화"], domain: "사회" },

  // ----- 과학 -----
  { name: "IB 물리학 HL Ⅰ", aliases: ["IB 물리학 HL Ⅰ", "IB물리학HLⅠ"], domain: "과학" },
  { name: "IB 물리학 HL Ⅱ", aliases: ["IB 물리학 HL Ⅱ", "IB물리학HLⅡ"], domain: "과학" },
  { name: "IB 물리학 HL Ⅲ", aliases: ["IB 물리학 HL Ⅲ", "IB물리학HLⅢ"], domain: "과학" },
  { name: "IB 물리학 HL Ⅳ", aliases: ["IB 물리학 HL Ⅳ", "IB물리학HLⅣ"], domain: "과학" },
  { name: "IB 생명과학 HL Ⅰ", aliases: ["IB 생명과학 HL Ⅰ", "IB생명과학HLⅠ"], domain: "과학" },
  { name: "IB 생명과학 HL Ⅱ", aliases: ["IB 생명과학 HL Ⅱ", "IB생명과학HLⅡ"], domain: "과학" },
  { name: "IB 생명과학 HL Ⅲ", aliases: ["IB 생명과학 HL Ⅲ", "IB생명과학HLⅢ"], domain: "과학" },
  { name: "IB 생명과학 HL Ⅳ", aliases: ["IB 생명과학 HL Ⅳ", "IB생명과학HLⅣ"], domain: "과학" },
  { name: "IB 생명과학 SL Ⅰ", aliases: ["IB 생명과학 SL Ⅰ", "IB생명과학SLⅠ"], domain: "과학" },
  { name: "IB 생명과학 SL Ⅱ", aliases: ["IB 생명과학 SL Ⅱ", "IB생명과학SLⅡ"], domain: "과학" },
  { name: "IB 생명과학 SL Ⅲ", aliases: ["IB 생명과학 SL Ⅲ", "IB생명과학SLⅢ"], domain: "과학" },
  { name: "IB 화학 HL Ⅰ", aliases: ["IB 화학 HL Ⅰ", "IB화학HLⅠ"], domain: "과학" },
  { name: "IB 화학 HL Ⅱ", aliases: ["IB 화학 HL Ⅱ", "IB화학HLⅡ"], domain: "과학" },
  { name: "IB 화학 HL Ⅲ", aliases: ["IB 화학 HL Ⅲ", "IB화학HLⅢ"], domain: "과학" },
  { name: "IB 화학 HL Ⅳ", aliases: ["IB 화학 HL Ⅳ", "IB화학HLⅣ"], domain: "과학" },
  { name: "IB 화학 SL Ⅰ", aliases: ["IB 화학 SL Ⅰ", "IB화학SLⅠ"], domain: "과학" },
  { name: "IB 화학 SL Ⅱ", aliases: ["IB 화학 SL Ⅱ", "IB화학SLⅡ"], domain: "과학" },
  { name: "IB 화학 SL Ⅲ", aliases: ["IB 화학 SL Ⅲ", "IB화학SLⅢ"], domain: "과학" },
  { name: "IB 화학 SL Ⅳ", aliases: ["IB 화학 SL Ⅳ", "IB화학SLⅣ"], domain: "과학" },
  { name: "고급 물리학", aliases: ["고급 물리학", "고급물리학"], domain: "과학" },
  { name: "고급 생명과학", aliases: ["고급 생명과학", "고급생명과학"], domain: "과학" },
  { name: "고급 화학", aliases: ["고급 화학", "고급화학"], domain: "과학" },
  { name: "물리학 실험", aliases: ["물리학 실험", "물리학실험"], domain: "과학" },
  { name: "바이오 기초 화학", aliases: ["바이오 기초 화학", "바이오기초화학"], domain: "과학" },
  { name: "생명 공학 기술", aliases: ["생명 공학 기술", "생명공학기술"], domain: "과학" },
  { name: "생명과학 실험", aliases: ["생명과학 실험", "생명과학실험"], domain: "과학" },
  { name: "생태와 환경", aliases: ["생태와 환경", "생태와환경"], domain: "과학" },
  { name: "에너지와 탄소 중립", aliases: ["에너지와 탄소 중립", "에너지와탄소중립"], domain: "과학" },
  { name: "지구과학 실험", aliases: ["지구과학 실험", "지구과학실험"], domain: "과학" },
  { name: "프런티어 사이언스", aliases: ["프런티어 사이언스", "프런티어사이언스"], domain: "과학" },
  { name: "화학 분석", aliases: ["화학 분석", "화학분석"], domain: "과학" },
  { name: "화학 실험", aliases: ["화학 실험", "화학실험"], domain: "과학" },

  // ----- 기타 -----
  { name: "VR·AR 콘텐츠 제작", aliases: ["VR·AR 콘텐츠 제작", "VR·AR콘텐츠제작"], domain: "기타" },
  { name: "고급 체육 전공 실기", aliases: ["고급 체육 전공 실기", "고급체육전공실기"], domain: "기타" },
  { name: "교육의 이해", aliases: ["교육의 이해", "교육의이해"], domain: "기타" },
  { name: "기초 조리", aliases: ["기초 조리", "기초조리"], domain: "기타" },
  { name: "기초 체육 전공 실기", aliases: ["기초 체육 전공 실기", "기초체육전공실기"], domain: "기타" },
  { name: "농업 기초 기술", aliases: ["농업 기초 기술", "농업기초기술"], domain: "기타" },
  { name: "도자기 공예", aliases: ["도자기 공예", "도자기공예"], domain: "기타" },
  { name: "드로잉", aliases: ["드로잉"], domain: "기타" },
  { name: "디지털 논리 회로", aliases: ["디지털 논리 회로", "디지털논리회로"], domain: "기타" },
  { name: "무대 미술과 기술", aliases: ["무대 미술과 기술", "무대미술과기술"], domain: "기타" },
  { name: "미디어 콘텐츠 일반", aliases: ["미디어 콘텐츠 일반", "미디어콘텐츠일반"], domain: "기타" },
  { name: "미술 매체 탐구", aliases: ["미술 매체 탐구", "미술매체탐구"], domain: "기타" },
  { name: "미술 이론", aliases: ["미술 이론", "미술이론"], domain: "기타" },
  { name: "미술 전공 실기", aliases: ["미술 전공 실기", "미술전공실기"], domain: "기타" },
  { name: "미술과 매체", aliases: ["미술과 매체", "미술과매체"], domain: "기타" },
  { name: "발명과 디자인", aliases: ["발명과 디자인", "발명과디자인"], domain: "기타" },
  { name: "베트남어 독해와 작문Ⅰ", aliases: ["베트남어 독해와 작문Ⅰ", "베트남어독해와작문Ⅰ"], domain: "기타" },
  { name: "베트남어 독해와 작문Ⅱ", aliases: ["베트남어 독해와 작문Ⅱ", "베트남어독해와작문Ⅱ"], domain: "기타" },
  { name: "베트남어 회화Ⅰ", aliases: ["베트남어 회화Ⅰ", "베트남어회화Ⅰ"], domain: "기타" },
  { name: "베트남어 회화Ⅱ", aliases: ["베트남어 회화Ⅱ", "베트남어회화Ⅱ"], domain: "기타" },
  { name: "보건", aliases: ["보건"], domain: "기타" },
  { name: "색채 디자인", aliases: ["색채 디자인", "색채디자인"], domain: "기타" },
  { name: "스포츠 개론", aliases: ["스포츠 개론", "스포츠개론"], domain: "기타" },
  { name: "스포츠 경기 기술", aliases: ["스포츠 경기 기술", "스포츠경기기술"], domain: "기타" },
  { name: "스포츠 경기 분석", aliases: ["스포츠 경기 분석", "스포츠경기분석"], domain: "기타" },
  { name: "스포츠 경기 체력", aliases: ["스포츠 경기 체력", "스포츠경기체력"], domain: "기타" },
  { name: "스포츠 교육", aliases: ["스포츠 교육", "스포츠교육"], domain: "기타" },
  { name: "스포츠 생리의학", aliases: ["스포츠 생리의학", "스포츠생리의학"], domain: "기타" },
  { name: "스포츠 행정 및 경영", aliases: ["스포츠 행정 및 경영", "스포츠행정및경영"], domain: "기타" },
  { name: "시각 디자인", aliases: ["시각 디자인", "시각디자인"], domain: "기타" },
  { name: "시창·청음", aliases: ["시창·청음"], domain: "기타" },
  { name: "식품과 영양", aliases: ["식품과 영양", "식품과영양"], domain: "기타" },
  { name: "심화 베트남어", aliases: ["심화 베트남어", "심화베트남어"], domain: "기타" },
  { name: "심화 육상 단거리 전공 실기", aliases: ["심화 육상 단거리 전공 실기", "심화육상단거리전공실기"], domain: "기타" },
  { name: "심화 일본어", aliases: ["심화 일본어", "심화일본어"], domain: "기타" },
  { name: "심화 중국어", aliases: ["심화 중국어", "심화중국어"], domain: "기타" },
  { name: "심화 체육 전공 실기", aliases: ["심화 체육 전공 실기", "심화체육전공실기"], domain: "기타" },
  { name: "심화 체조 전공 실기", aliases: ["심화 체조 전공 실기", "심화체조전공실기"], domain: "기타" },
  { name: "영화 감상과 비평", aliases: ["영화 감상과 비평", "영화감상과비평"], domain: "기타" },
  { name: "영화 제작 실습", aliases: ["영화 제작 실습", "영화제작실습"], domain: "기타" },
  { name: "육상", aliases: ["육상"], domain: "기타" },
  { name: "음악 감상과 비평", aliases: ["음악 감상과 비평", "음악감상과비평"], domain: "기타" },
  { name: "음악 이론", aliases: ["음악 이론", "음악이론"], domain: "기타" },
  { name: "음악 전공 실기", aliases: ["음악 전공 실기", "음악전공실기"], domain: "기타" },
  { name: "음악과 미디어", aliases: ["음악과 미디어", "음악과미디어"], domain: "기타" },
  { name: "음악사", aliases: ["음악사"], domain: "기타" },
  { name: "일본 문화", aliases: ["일본 문화", "일본문화"], domain: "기타" },
  { name: "일본어 독해와 작문Ⅰ", aliases: ["일본어 독해와 작문Ⅰ", "일본어독해와작문Ⅰ"], domain: "기타" },
  { name: "일본어 독해와 작문Ⅱ", aliases: ["일본어 독해와 작문Ⅱ", "일본어독해와작문Ⅱ"], domain: "기타" },
  { name: "일본어 회화", aliases: ["일본어 회화", "일본어회화"], domain: "기타" },
  { name: "일본어 회화Ⅰ", aliases: ["일본어 회화Ⅰ", "일본어회화Ⅰ"], domain: "기타" },
  { name: "일본어 회화Ⅱ", aliases: ["일본어 회화Ⅱ", "일본어회화Ⅱ"], domain: "기타" },
  { name: "자료 구조", aliases: ["자료 구조", "자료구조"], domain: "기타" },
  { name: "전공 기초 베트남어", aliases: ["전공 기초 베트남어", "전공기초베트남어"], domain: "기타" },
  { name: "전공 기초 일본어", aliases: ["전공 기초 일본어", "전공기초일본어"], domain: "기타" },
  { name: "전공 기초 중국어", aliases: ["전공 기초 중국어", "전공기초중국어"], domain: "기타" },
  { name: "정보 과제 연구", aliases: ["정보 과제 연구", "정보과제연구"], domain: "기타" },
  { name: "정보 통신", aliases: ["정보 통신", "정보통신"], domain: "기타" },
  { name: "제품 디자인", aliases: ["제품 디자인", "제품디자인"], domain: "기타" },
  { name: "조형 탐구", aliases: ["조형 탐구", "조형탐구"], domain: "기타" },
  { name: "중국어 독해와 작문Ⅰ", aliases: ["중국어 독해와 작문Ⅰ", "중국어독해와작문Ⅰ"], domain: "기타" },
  { name: "중국어 독해와 작문Ⅱ", aliases: ["중국어 독해와 작문Ⅱ", "중국어독해와작문Ⅱ"], domain: "기타" },
  { name: "중국어 회화Ⅰ", aliases: ["중국어 회화Ⅰ", "중국어회화Ⅰ"], domain: "기타" },
  { name: "중국어 회화Ⅱ", aliases: ["중국어 회화Ⅱ", "중국어회화Ⅱ"], domain: "기타" },
  { name: "지식 재산 일반", aliases: ["지식 재산 일반", "지식재산일반"], domain: "기타" },
  { name: "지역 이해", aliases: ["지역 이해", "지역이해"], domain: "기타" },
  { name: "체조", aliases: ["체조"], domain: "기타" },
  { name: "컴퓨터 구조", aliases: ["컴퓨터 구조", "컴퓨터구조"], domain: "기타" },
  { name: "컴퓨터 네트워크", aliases: ["컴퓨터 네트워크", "컴퓨터네트워크"], domain: "기타" },
  { name: "합창·합주", aliases: ["합창·합주"], domain: "기타" },

  // ============================================
  // 추가된 진로·융합·전문 과목 (천안 지역 16개 고교 편제표 기반)
  // ============================================

  // ----- 수학 -----
  { name: "고급 기하", aliases: ["고급 기하", "고급기하"], domain: "수학" },

  // ----- 영어 -----
  { name: "고급 영어 토론과 작문", aliases: ["고급 영어 토론과 작문", "고급영어토론과작문"], domain: "영어" },
  { name: "영어 연구 및 세미나1", aliases: ["영어 연구 및 세미나1", "영어연구및세미나1"], domain: "영어" },

  // ----- 사회 -----
  { name: "한국 사회의 이해", aliases: ["한국 사회의 이해", "한국사회의이해"], domain: "사회" },

  // ----- 과학 -----
  { name: "고급 지구과학", aliases: ["고급 지구과학", "고급지구과학"], domain: "과학" },
  { name: "과학과제 연구", aliases: ["과학과제 연구", "과학과제연구"], domain: "과학" },

  // ----- 기타 -----
  { name: "기초발레Ⅰ-1", aliases: ["기초발레Ⅰ-1"], domain: "기타" },
  { name: "기초발레Ⅰ-2", aliases: ["기초발레Ⅰ-2"], domain: "기타" },
  { name: "기초발레Ⅱ-1", aliases: ["기초발레Ⅱ-1"], domain: "기타" },
  { name: "기초발레Ⅱ-2", aliases: ["기초발레Ⅱ-2"], domain: "기타" },
  { name: "기초발레Ⅲ-1", aliases: ["기초발레Ⅲ-1"], domain: "기타" },
  { name: "기초발레Ⅲ-2", aliases: ["기초발레Ⅲ-2"], domain: "기타" },
  { name: "기초한국무용Ⅰ-1", aliases: ["기초한국무용Ⅰ-1"], domain: "기타" },
  { name: "기초한국무용Ⅰ-2", aliases: ["기초한국무용Ⅰ-2"], domain: "기타" },
  { name: "기초한국무용Ⅱ-1", aliases: ["기초한국무용Ⅱ-1"], domain: "기타" },
  { name: "기초한국무용Ⅱ-2", aliases: ["기초한국무용Ⅱ-2"], domain: "기타" },
  { name: "기초한국무용Ⅲ-1", aliases: ["기초한국무용Ⅲ-1"], domain: "기타" },
  { name: "기초한국무용Ⅲ-2", aliases: ["기초한국무용Ⅲ-2"], domain: "기타" },
  { name: "기초현대무용Ⅰ-1", aliases: ["기초현대무용Ⅰ-1"], domain: "기타" },
  { name: "기초현대무용Ⅰ-2", aliases: ["기초현대무용Ⅰ-2"], domain: "기타" },
  { name: "기초현대무용Ⅱ-1", aliases: ["기초현대무용Ⅱ-1"], domain: "기타" },
  { name: "기초현대무용Ⅱ-2", aliases: ["기초현대무용Ⅱ-2"], domain: "기타" },
  { name: "기초현대무용Ⅲ-1", aliases: ["기초현대무용Ⅲ-1"], domain: "기타" },
  { name: "기초현대무용Ⅲ-2", aliases: ["기초현대무용Ⅲ-2"], domain: "기타" },
  { name: "무용 감상과 비평", aliases: ["무용 감상과 비평", "무용감상과비평"], domain: "기타" },
  { name: "무용 음악 실습", aliases: ["무용 음악 실습", "무용음악실습"], domain: "기타" },
  { name: "무용 제작 실습", aliases: ["무용 제작 실습", "무용제작실습"], domain: "기타" },
  { name: "무용과 매체", aliases: ["무용과 매체", "무용과매체"], domain: "기타" },
  { name: "무용과 몸", aliases: ["무용과 몸", "무용과몸"], domain: "기타" },
  { name: "무용의 이해", aliases: ["무용의 이해", "무용의이해"], domain: "기타" },
  { name: "발레Ⅰ-1", aliases: ["발레Ⅰ-1"], domain: "기타" },
  { name: "발레Ⅰ-2", aliases: ["발레Ⅰ-2"], domain: "기타" },
  { name: "발레Ⅱ-1", aliases: ["발레Ⅱ-1"], domain: "기타" },
  { name: "발레Ⅱ-2", aliases: ["발레Ⅱ-2"], domain: "기타" },
  { name: "발레Ⅲ-1", aliases: ["발레Ⅲ-1"], domain: "기타" },
  { name: "발레Ⅲ-2", aliases: ["발레Ⅲ-2"], domain: "기타" },
  { name: "빅 데이터 분석", aliases: ["빅 데이터 분석", "빅데이터분석"], domain: "기타" },
  { name: "사물 인터넷과 센서 제어", aliases: ["사물 인터넷과 센서 제어", "사물인터넷과센서제어"], domain: "기타" },
  { name: "생애 설계와 자립", aliases: ["생애 설계와 자립", "생애설계와자립"], domain: "기타" },
  { name: "생활과 창의성", aliases: ["생활과 창의성", "생활과창의성"], domain: "기타" },
  { name: "안무", aliases: ["안무"], domain: "기타" },
  { name: "연극", aliases: ["연극"], domain: "기타" },
  { name: "연극 감상과 비평", aliases: ["연극 감상과 비평", "연극감상과비평"], domain: "기타" },
  { name: "응용 프로그래밍 개발", aliases: ["응용 프로그래밍 개발", "응용프로그래밍개발"], domain: "기타" },
  { name: "전기·전자 일반", aliases: ["전기·전자 일반", "전기·전자일반"], domain: "기타" },
  { name: "한국무용Ⅰ-1", aliases: ["한국무용Ⅰ-1"], domain: "기타" },
  { name: "한국무용Ⅰ-2", aliases: ["한국무용Ⅰ-2"], domain: "기타" },
  { name: "한국무용Ⅱ-1", aliases: ["한국무용Ⅱ-1"], domain: "기타" },
  { name: "한국무용Ⅱ-2", aliases: ["한국무용Ⅱ-2"], domain: "기타" },
  { name: "한국무용Ⅲ-1", aliases: ["한국무용Ⅲ-1"], domain: "기타" },
  { name: "한국무용Ⅲ-2", aliases: ["한국무용Ⅲ-2"], domain: "기타" },
  { name: "현대무용Ⅰ-1", aliases: ["현대무용Ⅰ-1"], domain: "기타" },
  { name: "현대무용Ⅰ-2", aliases: ["현대무용Ⅰ-2"], domain: "기타" },
  { name: "현대무용Ⅱ-1", aliases: ["현대무용Ⅱ-1"], domain: "기타" },
  { name: "현대무용Ⅱ-2", aliases: ["현대무용Ⅱ-2"], domain: "기타" },
  { name: "현대무용Ⅲ-1", aliases: ["현대무용Ⅲ-1"], domain: "기타" },
  { name: "현대무용Ⅲ-2", aliases: ["현대무용Ⅲ-2"], domain: "기타" },

  // ============================================
  // 추가: 공주 지역 7개 고교 편제표 기반 (AP/IB·과제연구·외국어 등)
  // ============================================

  // ----- 수학 -----
  { name: "AP미적분학 Ⅰ", aliases: ["AP미적분학 Ⅰ", "AP미적분학Ⅰ"], domain: "수학" },
  { name: "AP미적분학Ⅱ", aliases: ["AP미적분학Ⅱ"], domain: "수학" },
  { name: "AP선형대수학", aliases: ["AP선형대수학"], domain: "수학" },
  { name: "IB 수학 분석과 접근 HL Ⅰ", aliases: ["IB 수학 분석과 접근 HL Ⅰ", "IB수학분석과접근HLⅠ"], domain: "수학" },
  { name: "IB 수학 분석과 접근 HL Ⅱ", aliases: ["IB 수학 분석과 접근 HL Ⅱ", "IB수학분석과접근HLⅡ"], domain: "수학" },
  { name: "IB 수학 분석과 접근 HL Ⅲ", aliases: ["IB 수학 분석과 접근 HL Ⅲ", "IB수학분석과접근HLⅢ"], domain: "수학" },
  { name: "IB 수학 분석과 접근 HL Ⅳ", aliases: ["IB 수학 분석과 접근 HL Ⅳ", "IB수학분석과접근HLⅣ"], domain: "수학" },
  { name: "기하학 과제연구", aliases: ["기하학 과제연구", "기하학과제연구"], domain: "수학" },
  { name: "수치해석 과제연구", aliases: ["수치해석 과제연구", "수치해석과제연구"], domain: "수학" },
  { name: "정수론 과제연구", aliases: ["정수론 과제연구", "정수론과제연구"], domain: "수학" },
  { name: "통계이론 과제연구", aliases: ["통계이론 과제연구", "통계이론과제연구"], domain: "수학" },
  { name: "함수론 과제연구", aliases: ["함수론 과제연구", "함수론과제연구"], domain: "수학" },

  // ----- 사회 -----
  { name: "IB 창의융합과제연구 Ⅲ", aliases: ["IB 창의융합과제연구 Ⅲ", "IB창의융합과제연구Ⅲ"], domain: "사회" },
  { name: "IB 창의융합과제연구 Ⅳ", aliases: ["IB 창의융합과제연구 Ⅳ", "IB창의융합과제연구Ⅳ"], domain: "사회" },
  { name: "사회과제 연구", aliases: ["사회과제 연구", "사회과제연구"], domain: "사회" },
  { name: "세계시민과 문화 간 교류", aliases: ["세계시민과 문화 간 교류", "세계시민과문화간교류"], domain: "사회" },

  // ----- 과학 -----
  { name: "AP일반물리학Ⅱ", aliases: ["AP일반물리학Ⅱ"], domain: "과학" },
  { name: "AP일반생물학", aliases: ["AP일반생물학"], domain: "과학" },
  { name: "AP일반화학Ⅱ", aliases: ["AP일반화학Ⅱ"], domain: "과학" },
  { name: "IB 생명과학 SL Ⅳ", aliases: ["IB 생명과학 SL Ⅳ", "IB생명과학SLⅣ"], domain: "과학" },
  { name: "생명공학 연구", aliases: ["생명공학 연구", "생명공학연구"], domain: "과학" },
  { name: "생명과학 과제연구", aliases: ["생명과학 과제연구", "생명과학과제연구"], domain: "과학" },
  { name: "생명과학 융합연구", aliases: ["생명과학 융합연구", "생명과학융합연구"], domain: "과학" },
  { name: "융합과학 과제연구", aliases: ["융합과학 과제연구", "융합과학과제연구"], domain: "과학" },
  { name: "인체 구조와 기능", aliases: ["인체 구조와 기능", "인체구조와기능"], domain: "과학" },
  { name: "지구과학개론", aliases: ["지구과학개론"], domain: "과학" },
  { name: "화학 과제연구", aliases: ["화학 과제연구", "화학과제연구"], domain: "과학" },
  { name: "화학공학 연구", aliases: ["화학공학 연구", "화학공학연구"], domain: "과학" },
  { name: "화학세미나", aliases: ["화학세미나"], domain: "과학" },

  // ----- 기타 -----
  { name: "AP프로그래밍과 문제해결", aliases: ["AP프로그래밍과 문제해결", "AP프로그래밍과문제해결"], domain: "기타" },
  { name: "관광 일본어", aliases: ["관광 일본어", "관광일본어"], domain: "기타" },
  { name: "관광 중국어", aliases: ["관광 중국어", "관광중국어"], domain: "기타" },
  { name: "광공학 과제연구", aliases: ["광공학 과제연구", "광공학과제연구"], domain: "기타" },
  { name: "기계공학 과제연구", aliases: ["기계공학 과제연구", "기계공학과제연구"], domain: "기타" },
  { name: "문제해결기법 탐구", aliases: ["문제해결기법 탐구", "문제해결기법탐구"], domain: "기타" },
  { name: "음악 공연 실습", aliases: ["음악 공연 실습", "음악공연실습"], domain: "기타" },
  { name: "음악과 문화", aliases: ["음악과 문화", "음악과문화"], domain: "기타" },
  { name: "전기공학 과제연구", aliases: ["전기공학 과제연구", "전기공학과제연구"], domain: "기타" },
  { name: "정보과학 과제연구", aliases: ["정보과학 과제연구", "정보과학과제연구"], domain: "기타" },
  { name: "정보과학 융합탐구", aliases: ["정보과학 융합탐구", "정보과학융합탐구"], domain: "기타" },
  { name: "프랑스어 회화", aliases: ["프랑스어 회화", "프랑스어회화"], domain: "기타" },
  { name: "프랑스어권 문화", aliases: ["프랑스어권 문화", "프랑스어권문화"], domain: "기타" },

  // ----- 추가: 서산 지역 -----
  { name: "미래형 항공기체", aliases: ["미래형 항공기체", "미래형항공기체"], domain: "기타" },
  { name: "심화 프랑스어", aliases: ["심화 프랑스어", "심화프랑스어"], domain: "기타" },

  // ----- 추가: 논산·계룡 지역 -----
  { name: "문학 감상과 비평", aliases: ["문학 감상과 비평", "문학감상과 비평"], domain: "국어" },
  { name: "간호의 기초", aliases: ["간호의 기초", "간호의기초"], domain: "기타" },
  { name: "공중 보건", aliases: ["공중 보건", "공중보건"], domain: "기타" },
  { name: "복지 서비스의 기초", aliases: ["복지 서비스의 기초", "복지서비스의 기초"], domain: "기타" },
  { name: "인공지능 일반", aliases: ["인공지능 일반", "인공지능일반"], domain: "기타" },

  // ----- 추가: 당진 지역 -----
  { name: "인간과 환경", aliases: ["인간과 환경", "인간과환경"], domain: "사회" },
  { name: "영상 제작의 이해", aliases: ["영상 제작의 이해", "영상제작의 이해"], domain: "기타" },
  { name: "정보 처리와 관리", aliases: ["정보 처리와 관리", "정보처리와 관리"], domain: "기타" },
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
