# wareki

西暦と和暦（令和・平成・昭和・大正・明治）を相互変換する、**依存ゼロ**の小さなライブラリです。
改元日は ICU/Intl（`ja-JP-u-ca-japanese`）と同じ境界を採用しているため、改元の前後でも正確に変換できます。

- 依存ゼロ・型定義つき（TypeScript）・ビルド不要（ESM をそのまま import）
- Node / Deno / Bun / ブラウザで動作

## インストール
```bash
npm install @suzukihayate/wareki
```

## 使い方
```js
import { toWareki, format, parse, toGregorianYear } from '@suzukihayate/wareki';

format(new Date(2024, 5, 2));          // "令和6年6月2日"
format('2019-05-01');                  // "令和元年5月1日"
format('2024-06-02', { initial: true }); // "R6.6.2"

toWareki('1989-01-07'); // { eraName: '昭和', year: 64, ... }
toWareki('1989-01-08'); // { eraName: '平成', year: 1,  ... }

parse('令和6年6月2日'); // → Date(2024-06-02)
parse('H31.4.30');      // → Date(2019-04-30)

toGregorianYear('令和', 6); // 2024
```

## API
- `toWareki(input)` — `Date` / `"YYYY-MM-DD"` / `{year,month,day}` を和暦オブジェクトに変換
- `format(input, { gannen?, initial? })` — 和暦文字列に整形（`gannen` は1年目を「元年」表記、既定 true）
- `parse(str)` — `"令和6年6月2日"` / `"R6.6.2"` などを `Date` に変換
- `toGregorianYear(eraName, warekiYear)` — 和暦年 → 西暦年
- `eras` — 対応元号の一覧（改元日つき）

## なぜ作ったか
和暦変換は日本の業務アプリで頻出ですが、改元日（特に昭和→平成、平成→令和の“同じ年内での切り替わり”）を正しく扱う軽量ライブラリは意外と少なめです。本ライブラリは改元境界を ICU と揃え、依存ゼロ・型つきで“そのまま import するだけ”を目指しました。

## テスト
```bash
node --test
```

## License
MIT © 2026 Hayate Suzuki
