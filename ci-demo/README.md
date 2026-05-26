# CI 失敗案例操作指南

以下三個場景可以分別觸發 pipeline 中不同 job 的失敗。
每次修改後 push 到 GitHub，觀察 Actions 頁面的失敗結果，截圖後再還原。

---

## 場景 1：TypeScript 型別錯誤

**操作方式**：在 `src/app.ts` 底部加入以下程式碼

```ts
// ❌ 故意的型別錯誤：將 string 指派給 number
const port: number = 'not-a-number';
```

**預期結果**：`typecheck` job 失敗，錯誤訊息為 `Type 'string' is not assignable to type 'number'`

**修正方式**：刪除該行或改為 `const port: number = 3000;`

---

## 場景 2：Prettier 格式錯誤

**操作方式**：在 `src/app.ts` 中，把某一行的結尾分號移除或改用雙引號

```ts
// 原本（正確）
import Fastify, { FastifyServerOptions } from 'fastify';

// 改成（錯誤）
import Fastify, { FastifyServerOptions } from 'fastify';
```

**預期結果**：`prettier` job 失敗，提示 `Code style issues found`

**修正方式**：執行 `npm run format` 自動修復

---

## 場景 3：測試失敗

**操作方式**：在 `test/app.test.ts` 中修改預期值

```ts
// 原本（正確）
expect(response.json()).toEqual({ status: 'ok' });

// 改成（錯誤）
expect(response.json()).toEqual({ status: 'error' });
```

**預期結果**：`test` job 失敗，dorny/test-reporter 在 Actions 頁面顯示紅色失敗項目

**修正方式**：將 `'error'` 改回 `'ok'`
