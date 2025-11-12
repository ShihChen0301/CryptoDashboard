# AGENTS.md

## 專案定位

Crypto Dashboard — 使用 Vue 3 製作的虛擬貨幣即時價格與收藏平台，具登入頁與主頁介面。

## 前端技術

- Vue 3 + Vite
- Element Plus (UI 元件庫)
- Axios (串接 API)
- Pinia (狀態管理)
- ECharts (價格圖表，可後續加入)

## 專案架構

- `src/`：主要程式碼（components、pages、store、services）
- `public/`：靜態資源
- `.env.example`：API 或環境設定示範

## 開發指令

- `npm run dev`：啟動開發伺服器
- `npm run build`：正式版建置
- `npm run preview`：預覽建置結果
- `npm run lint`：程式碼檢查與格式化

## 開發規範

- 分支命名：`feature/<名稱>`、`fix/<問題>`
- Commit 規範：Conventional Commits
- 前端 API 統一放在 `/src/services`
- 使用 ESLint + Prettier 維持格式一致
- 所有 Vue 元件採 PascalCase 命名

## 成員與任務

- Shih Chen：前端架構設計、UI、登入與主頁功能

## 安全注意

- 不上傳 `.env` 或金鑰
- Axios 請加上錯誤處理
- 外部 API 呼叫需驗證資料正確性
