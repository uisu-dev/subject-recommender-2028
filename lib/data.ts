import file2Raw from "@/data/file2.json";
import type { File2Row } from "./types";
import { parseRequirement, type ParsedRequirement } from "./subjects";

export const file2: File2Row[] = file2Raw as File2Row[];

export type File2RowWithParsed = File2Row & {
  parsedCore: ParsedRequirement;
  parsedRec: ParsedRequirement;
};

export const file2Parsed: File2RowWithParsed[] = file2.map((r) => ({
  ...r,
  parsedCore: parseRequirement(r.핵심과목),
  parsedRec: parseRequirement(r.권장과목),
}));

export function rowId(r: File2Row, idx: number): string {
  return `${r.대학명}::${r.단과대_계열}::${r.학과}::${idx}`;
}

export function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[()·,⁎*·\-_./]/g, "");
}

export const universityList: string[] = Array.from(
  new Set(file2.map((r) => r.대학명).filter(Boolean))
).sort();

export const departmentList: string[] = Array.from(
  new Set(
    file2
      .flatMap((r) => [r.학과, r.단과대_계열])
      .filter((s) => s && s.length > 0)
  )
).sort();

export const regionList: string[] = Array.from(
  new Set(file2.map((r) => r.권역).filter(Boolean))
).sort();

export const areaList: string[] = Array.from(
  new Set(file2.map((r) => r.지역).filter(Boolean))
).sort();
