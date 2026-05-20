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

export type HeaderInfo = {
  schoolName: string;
  counselor: string;
  student: string;
  /** Multi-line counseling notes shown on the printed PDF. Not persisted. */
  notes: string;
};

export type CartItem = {
  id: string;
  row: File2Row;
};
