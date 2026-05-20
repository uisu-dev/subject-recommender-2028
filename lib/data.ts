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

/** Maps each 권역 to the set of 지역s it contains (built from file2 data). */
export const regionAreaMap: Map<string, Set<string>> = (() => {
  const m = new Map<string, Set<string>>();
  for (const r of file2) {
    if (r.권역 && r.지역) {
      if (!m.has(r.권역)) m.set(r.권역, new Set());
      m.get(r.권역)!.add(r.지역);
    }
  }
  return m;
})();

/** Returns the list of 지역 available for a given 권역. When region is empty, returns all areas. */
export function getAreasForRegion(region: string): string[] {
  if (!region) return areaList;
  const areas = regionAreaMap.get(region);
  return areas ? Array.from(areas).sort() : [];
}

/**
 * Tokenize a query string into normalized lowercase tokens (split on whitespace).
 * "경북대 독어독문학과" → ["경북대", "독어독문학과"]
 * Empty tokens (from leading/trailing whitespace) are filtered out.
 */
export function tokenizeQuery(query: string): string[] {
  return query
    .split(/\s+/)
    .map((s) => normalize(s))
    .filter(Boolean);
}
