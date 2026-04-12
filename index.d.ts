export interface Era {
  /** 元号（漢字）例: "令和" */
  name: string;
  /** ローマ字 例: "Reiwa" */
  en: string;
  /** 頭文字 例: "R" */
  initial: string;
  startYear: number;
  startMonth: number;
  startDay: number;
}

export interface WarekiDate {
  eraName: string;
  eraEn: string;
  eraInitial: string;
  year: number;
  month: number;
  day: number;
}

export type DateInput = Date | string | { year: number; month: number; day: number };

/** 対応する元号（新しい順）。 */
export const eras: Era[];

/** 西暦の日付を和暦に変換する。 */
export function toWareki(input: DateInput): WarekiDate;

/** 西暦の日付を和暦の文字列に整形する。 */
export function format(input: DateInput, opts?: { gannen?: boolean; initial?: boolean }): string;

/** 和暦の文字列（"令和6年6月2日" / "R6.6.2" 等）を西暦の Date に変換する。 */
export function parse(str: string): Date;

/** 和暦の年から西暦の年を求める。 */
export function toGregorianYear(eraName: string, warekiYear: number): number;

declare const _default: {
  eras: Era[];
  toWareki: typeof toWareki;
  format: typeof format;
  parse: typeof parse;
  toGregorianYear: typeof toGregorianYear;
};
export default _default;
