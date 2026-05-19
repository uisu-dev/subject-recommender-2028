export type File2Row = {
  권역: string;
  지역: string;
  대학명: string;
  단과대_계열: string;
  학과: string;
  핵심과목: string;
  권장과목: string;
  비고: string;
};

export type File1Subject = { 영역: string; 과목: string };
export type File1Original = { 영역: string; 과목: string; 표기: string };
export type File1UnivEntry = {
  대학표기: string;
  과목: File1Subject[];
  원본: File1Original[];
};
export type File1Group = {
  계열: string;
  모집단위: string;
  대학별: File1UnivEntry[];
};

export type SearchHit =
  | { kind: "univ-dept"; row: File2Row; key: string }
  | { kind: "major-group"; group: File1Group; key: string };

export type HeaderInfo = {
  schoolName: string;
  counselor: string;
  student: string;
};

export type CartItem = {
  id: string;
  row: File2Row;
};
