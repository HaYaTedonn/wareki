import { test } from 'node:test';
import assert from 'node:assert/strict';
import { toWareki, format, parse, toGregorianYear } from '../index.js';

test('toWareki: 令和', () => {
  const w = toWareki(new Date(2024, 5, 2));
  assert.equal(w.eraName, '令和');
  assert.equal(w.year, 6);
  assert.equal(w.month, 6);
  assert.equal(w.day, 2);
});

test('改元境界: 昭和64 → 平成元年', () => {
  assert.equal(toWareki('1989-01-07').eraName, '昭和');
  assert.equal(toWareki('1989-01-07').year, 64);
  assert.equal(toWareki('1989-01-08').eraName, '平成');
  assert.equal(toWareki('1989-01-08').year, 1);
});

test('改元境界: 平成31 → 令和元年', () => {
  assert.equal(format('2019-04-30'), '平成31年4月30日');
  assert.equal(format('2019-05-01'), '令和元年5月1日');
});

test('format: 通常 / 元年 / 略号', () => {
  assert.equal(format({ year: 2024, month: 6, day: 2 }), '令和6年6月2日');
  assert.equal(format('2019-05-01', { gannen: false }), '令和1年5月1日');
  assert.equal(format('2024-06-02', { initial: true }), 'R6.6.2');
});

test('parse: 漢字 / 元年 / 略号', () => {
  assert.deepEqual(parse('令和6年6月2日'), new Date(2024, 5, 2));
  assert.deepEqual(parse('平成元年1月8日'), new Date(1989, 0, 8));
  assert.deepEqual(parse('R6.6.2'), new Date(2024, 5, 2));
  assert.deepEqual(parse('H31.4.30'), new Date(2019, 3, 30));
});

test('ラウンドトリップ', () => {
  const d = new Date(1995, 7, 15);
  assert.deepEqual(parse(format(d)), d);
});

test('toGregorianYear', () => {
  assert.equal(toGregorianYear('令和', 6), 2024);
  assert.equal(toGregorianYear('平成', 1), 1989);
  assert.equal(toGregorianYear('S', 64), 1989);
});

test('明治以前はエラー', () => {
  assert.throws(() => toWareki('1850-01-01'), RangeError);
});
