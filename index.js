// wareki — 西暦と和暦（令和・平成・昭和・大正・明治）を相互変換する依存ゼロのライブラリ。
// 元号の改元日は ICU/Intl（ja-JP-u-ca-japanese）と同じ境界を採用しています。

/** @typedef {{ name: string, en: string, initial: string, startYear: number, startMonth: number, startDay: number }} Era */

/** 対応する元号（新しい順）。 */
export const eras = /** @type {Era[]} */ ([
  { name: '令和', en: 'Reiwa', initial: 'R', startYear: 2019, startMonth: 5, startDay: 1 },
  { name: '平成', en: 'Heisei', initial: 'H', startYear: 1989, startMonth: 1, startDay: 8 },
  { name: '昭和', en: 'Showa', initial: 'S', startYear: 1926, startMonth: 12, startDay: 25 },
  { name: '大正', en: 'Taisho', initial: 'T', startYear: 1912, startMonth: 7, startDay: 30 },
  { name: '明治', en: 'Meiji', initial: 'M', startYear: 1868, startMonth: 9, startDay: 8 },
]);

const key = (y, m, d) => y * 10000 + m * 100 + d;

/** 入力（Date / ISO文字列 / {year,month,day}）を {y,m,d} に正規化。 */
function normalize(input) {
  if (input instanceof Date) {
    return { y: input.getFullYear(), m: input.getMonth() + 1, d: input.getDate() };
  }
  if (typeof input === 'object' && input !== null && 'year' in input) {
    return { y: Number(input.year), m: Number(input.month), d: Number(input.day) };
  }
  if (typeof input === 'string') {
    const mt = input.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
    if (mt) return { y: +mt[1], m: +mt[2], d: +mt[3] };
  }
  throw new TypeError('wareki: 日付は Date / "YYYY-MM-DD" / {year,month,day} で指定してください。');
}

/**
 * 西暦の日付を和暦に変換する。
 * @param {Date|string|{year:number,month:number,day:number}} input
 * @returns {{ eraName: string, eraEn: string, eraInitial: string, year: number, month: number, day: number }}
 */
export function toWareki(input) {
  const { y, m, d } = normalize(input);
  const k = key(y, m, d);
  const era = eras.find((e) => k >= key(e.startYear, e.startMonth, e.startDay));
  if (!era) throw new RangeError('wareki: 明治以前の日付には対応していません。');
  return {
    eraName: era.name,
    eraEn: era.en,
    eraInitial: era.initial,
    year: y - era.startYear + 1,
    month: m,
    day: d,
  };
}

/**
 * 西暦の日付を和暦の文字列に整形する。
 * @param {Date|string|{year:number,month:number,day:number}} input
 * @param {{ gannen?: boolean, initial?: boolean }} [opts]
 *   gannen: 1年目を「元年」と表記（既定 true）。 initial: "R6.6.2" 形式（既定 false）。
 * @returns {string}
 */
export function format(input, opts = {}) {
  const { gannen = true, initial = false } = opts;
  const w = toWareki(input);
  if (initial) return `${w.eraInitial}${w.year}.${w.month}.${w.day}`;
  const yearStr = w.year === 1 && gannen ? '元' : String(w.year);
  return `${w.eraName}${yearStr}年${w.month}月${w.day}日`;
}

/**
 * 和暦の文字列を西暦の Date に変換する。
 * 例: "令和6年6月2日" / "平成元年1月8日" / "R6.6.2" / "H31.4.30"
 * @param {string} str
 * @returns {Date}
 */
export function parse(str) {
  const s = String(str).trim();

  // 漢字表記: 令和6年6月2日 / 平成元年1月8日
  let m = s.match(/^(明治|大正|昭和|平成|令和)\s*(元|\d+)\s*年\s*(\d+)\s*月\s*(\d+)\s*日?$/);
  if (m) {
    const era = eras.find((e) => e.name === m[1]);
    const wy = m[2] === '元' ? 1 : +m[2];
    return new Date(era.startYear + wy - 1, +m[3] - 1, +m[4]);
  }

  // 略号表記: R6.6.2 / H31.4.30
  m = s.match(/^([MTSHRmtshr])\s*\.?\s*(\d+)\s*\.\s*(\d+)\s*\.\s*(\d+)$/);
  if (m) {
    const init = m[1].toUpperCase();
    const era = eras.find((e) => e.initial === init);
    if (era) return new Date(era.startYear + +m[2] - 1, +m[3] - 1, +m[4]);
  }

  throw new Error(`wareki: 和暦として解釈できません: "${str}"`);
}

/** 和暦の年から西暦の年を求める（例: warekiYear('令和', 6) === 2024）。 */
export function toGregorianYear(eraName, warekiYear) {
  const era = eras.find((e) => e.name === eraName || e.en.toLowerCase() === String(eraName).toLowerCase() || e.initial === eraName);
  if (!era) throw new Error(`wareki: 未知の元号: "${eraName}"`);
  return era.startYear + Number(warekiYear) - 1;
}

export default { eras, toWareki, format, parse, toGregorianYear };
