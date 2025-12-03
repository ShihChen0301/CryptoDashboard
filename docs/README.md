# CoinVue（幣景）專案文檔

> **洞察幣圈前景的視野** - 完整開發文檔導覽

---

## 📚 核心文檔

### 主要文檔
- **[專案記憶 (CLAUDE.md)](../CLAUDE.md)** - 完整的專案歷史與決策記錄（最重要）
  - 開發歷史（2024-11-20 ~ 2025-12-04）
  - 技術棧詳細說明
  - 所有功能實作記錄
  - 已知問題與解決方案

- **[專案 README](../README.md)** - 專案簡介、快速開始、安裝指南
  - 功能特色
  - 技術棧總覽
  - 快速安裝步驟
  - 環境需求

### 學習文檔
- **[學習路徑指南 v1.2.0](./學習路徑指南_v1.2.0.md)** ⭐ 新增
  - 完整的引導式學習路徑（15 週）
  - 6 個階段的詳細學習提示詞
  - 適合給 AI 學習工具（Gemini）使用
  - 基於最新專案狀態（v1.2.0）

### 未來功能規劃（v2.0）
- **[功能對照表](./功能對照表.md)** - v2.0 功能需求清單
  - 未來功能列表
  - 優先級標註
  - 取消功能說明

- **[功能需求分析 v2.0](./功能需求分析_v2.md)** - v2.0 需求分析報告
  - 詳細功能規格
  - 資料庫設計
  - API 規劃

### 安全性文檔
- **[安全性建議](./安全性建議.md)** - 生產環境部署前必讀
  - 環境變數配置
  - JWT 安全強化
  - Rate Limiting 實作建議
  - HTTPS 配置指南

---

## 🚀 快速連結

### 專案結構
- **前端專案**: `../frontend/`
- **後端專案**: `../backend/`
- **資料庫腳本**: `../database/schema_v3.sql`

### API 文檔
- **後端 API 說明**: `../backend/README.md`

---

## 💻 技術棧總覽

### 前端（v1.2.0）
- Vue 3.5.22 + Vite 7.1.11
- Pinia 3.0.3（狀態管理）
- Vue Router 4.6.3
- vue-i18n 9.14.5（國際化）
- CoinGecko API + CoinCap API（雙 API 架構）

### 後端（v1.1.0）
- Spring Boot 3.2.0
- Spring Security + JWT（jjwt 0.11.5）
- Spring Data JPA + Hibernate
- MySQL 8.0
- Maven 3.8+

### 資料庫（v3.0）
- MySQL 8.0
- 9 個表：
  - **核心表**（已實作）：users, auth_tokens, coin_favorites, announcements
  - **擴充表**（v3.0 結構已建立）：user_activities, market_filter_presets, coin_price_alerts, coin_comparisons, system_settings
- 詳見：`../database/schema_v3.sql`

---

## 🎯 開發進度

### ✅ Phase 1: 後端基礎建設（100% 完成）
- [x] Spring Boot 專案結構
- [x] Entity 層（4 個實體類）
- [x] Repository 層（4 個）
- [x] JWT 認證系統（JwtUtil + JwtAuthenticationFilter）
- [x] Spring Security 配置
- [x] 登入/註冊 API

### ✅ Phase 2: 前後端整合（100% 完成）
- [x] CoinGecko API Proxy (`/api/coins/*`)
- [x] 收藏 CRUD API
- [x] 前端 API 整合（api.js）
- [x] 移除模擬資料（mockAuth.js）
- [x] Watchlist 完整測試
- [x] 收藏按鈕優化

### ✅ Phase 3: 進階功能（100% 完成）🎉
- [x] Admin Panel 三大功能：
  - [x] 數據總覽（統計數據 + 收藏排行）
  - [x] 用戶管理（用戶列表 + 收藏數統計）
  - [x] 公告管理（建立/編輯/刪除/切換啟用）
- [x] 系統公告功能（用戶端 Dashboard 顯示）
- [x] 角色權限路由（admin 智能跳轉）
- [x] 多語系切換（中英文）
- [x] Market 進階篩選功能

### ⏳ Phase 4: 優化與部署（待開始）
- [ ] 環境變數配置（移除敏感資訊）
- [ ] JWT Secret 強化（512 位密鑰）
- [ ] Rate Limiting（防暴力破解）
- [ ] 過期 Token 自動清理
- [ ] 數據庫索引優化
- [ ] 單元測試撰寫
- [ ] Docker 容器化
- [ ] CI/CD 配置

---

## 📡 API 文檔（v1.1.0）

### 認證相關（已實作）
- `POST /api/auth/register` - 用戶註冊
- `POST /api/auth/login` - 用戶登入
- `POST /api/auth/logout` - 用戶登出

### 收藏相關（已實作）
- `GET /api/favorites` - 取得收藏列表
- `POST /api/favorites?coinId={id}` - 新增收藏
- `DELETE /api/favorites/{coinId}` - 移除收藏
- `DELETE /api/favorites/all` - 清空收藏

### 幣種相關（已實作）
- `GET /api/coins?page={page}&perPage={perPage}` - 取得幣種列表
- `GET /api/coins/{id}` - 取得幣種詳情

### 公告相關（已實作）✨
- `GET /api/announcements` - 取得啟用的公告（所有用戶可見）

### 管理員相關（已實作）✨
- `GET /api/admin/stats` - 取得統計數據
- `GET /api/admin/users` - 取得所有用戶
- `GET /api/admin/announcements` - 取得所有公告
- `POST /api/admin/announcements` - 建立公告
- `PUT /api/admin/announcements/{id}` - 更新公告
- `DELETE /api/admin/announcements/{id}` - 刪除公告

---

## 👤 測試帳號

### 建立測試帳號

#### 方式 1：註冊新帳號（推薦）
1. 訪問 http://localhost:5173/register
2. 填寫用戶名、Email、密碼
3. 註冊後會自動獲得 `user` 角色

#### 方式 2：升級為 Admin
註冊後，在資料庫中執行：
```sql
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

**安全考量**：為了安全，註冊 API 不允許直接建立 admin 帳號。

---

## 🛠️ 開發指南

### 前端開發
```bash
cd ../frontend
npm install
npm run dev
```
訪問：http://localhost:5173

### 後端開發
```bash
cd ../backend
mvn spring-boot:run
```
訪問：http://localhost:8080/api

### 資料庫初始化
```bash
mysql -u root -p < ../database/schema_v3.sql
```

---

## 📋 專案規範

### Git Commit 訊息格式
```
<type>: <subject>

類型：
- feat: 新功能
- fix: Bug 修復
- docs: 文檔更新
- refactor: 重構
- test: 測試相關
- chore: 建置工具、依賴更新
```

### 命名規範

**前端（JavaScript/Vue）**:
- 資料夾: `kebab-case`
- Vue 檔案: `PascalCase.vue`
- JS 檔案: `camelCase.js`

**後端（Java）**:
- Package: `lowercase`
- Class: `PascalCase`
- Method: `camelCase`

---

## ❓ 常見問題

### Q: 如何連接後端 API？
**A**: 修改 `../frontend/.env` 中的 `VITE_API_BASE_URL`

### Q: 為什麼前端無法直接呼叫 CoinGecko API？
**A**: CoinGecko Demo API Key 不支援瀏覽器 CORS，必須透過後端 proxy。

### Q: 如何修改資料庫密碼？
**A**: 編輯 `../backend/src/main/resources/application.yml`

### Q: JWT Secret 如何設定？
**A**: 生產環境請使用環境變數，參考 [安全性建議](./安全性建議.md)

### Q: 專案記憶檔案在哪裡？
**A**: 參考 `../CLAUDE.md`，包含所有開發歷史與決策記錄

### Q: 如何學習重新實作這個專案？
**A**: 參考 [學習路徑指南 v1.2.0](./學習路徑指南_v1.2.0.md)

---

## 🤝 貢獻指南

1. Fork 專案
2. 建立功能分支 (`git checkout -b feature/AmazingFeature`)
3. Commit 變更 (`git commit -m 'feat: 新增某功能'`)
4. Push 到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

---

## 📊 專案狀態

**專案名稱**: CoinVue（幣景）
**前端版本**: v1.2.0（100% 完成 🎉）
**後端版本**: v1.1.0（生產就緒）
**最後更新**: 2025-12-04
**專案狀態**: Phase 1-3 完成，待優化與部署

### ⚠️ 重要提醒
本專案配置文件包含敏感資訊已提交到 Git，不適合直接用於生產環境。
詳見：[安全性建議](./安全性建議.md)

---

**文檔版本**: 2.0
**維護者**: CoinVue 開發團隊
