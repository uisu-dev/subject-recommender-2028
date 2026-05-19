import file1Raw from "@/data/file1.json";
import file2Raw from "@/data/file2.json";
import type { File1Group, File2Row } from "./types";

export const file2: File2Row[] = file2Raw as File2Row[];
export const file1: File1Group[] = file1Raw as File1Group[];

// Normalize for fuzzy-ish matching: remove spaces, lowercase, drop punctuation
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

export const majorList: string[] = Array.from(
  new Set(file1.map((g) => g.모집단위))
).sort();

export const regionList: string[] = Array.from(
  new Set(file2.map((r) => r.권역).filter(Boolean))
).sort();

export const areaList: string[] = Array.from(
  new Set(file2.map((r) => r.지역).filter(Boolean))
).sort();
