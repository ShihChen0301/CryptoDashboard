# 專案文檔

CoinVue（幣景）完整開發文檔

## 目錄

### 核心文檔
- [專案記憶 (CLAUDE.md)](../CLAUDE.md) - 完整的專案歷史與決策記錄（主要文檔）
- [專案 README](../README.md) - 專案簡介、快速開始、技術棧

### 參考文檔（v2.0 未來功能規劃）
- [功能對照表](./功能對照表.md) - v2.0 功能需求清單（未來功能參考）
- [功能需求分析_v2](./功能需求分析_v2.md) - v2.0 需求分析報告（未來功能參考）

### 快速連結

- **前端專案**: `../frontend/`
- **後端專案**: `../backend/`
- **資料庫腳本**: `../database/`
- **專案記憶**: `../CLAUDE.md`（開發歷史與決策記錄）

## 技術棧總覽

### 前端
- Vue 3.5.22 + Vite 7.1.11
- Pinia 3.0.3 (狀態管理)
- Vue Router 4.6.3
- vue-i18n 9.14.5 (國際化)
- CoinGecko API + CoinCap API (雙 API 架構)

### 後端
- Spring Boot 3.2.0
- Spring Security + JWT (jjwt 0.11.5)
- Spring Data JPA
- MySQL 8.0

### 資料庫
- MySQL 8.0
- **v3.0**：9 個表（users, auth_tokens, coin_favorites, announcements, user_activities, market_filter_presets, coin_price_alerts, coin_comparisons, system_settings）
- 詳見：`../database/schema_v3.sql`

## 開發指南

### 前端開發

```bash
cd ../frontend
npm install
npm run dev
```

訪問：http://localhost:5173

> **注意**: CoinGecko API 目前需要透過後端 proxy 才能使用（避免 CORS 問題）

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

## 開發進度

### Phase 1: 後端基礎建設（✅ 已完成）
- [x] 建立 Spring Boot 專案結構
- [x] 建立所有 Entity 類別
- [x] 配置資料庫連接（MySQL 初始化）
- [x] 建立 Repository 層（4 個）
- [x] 實作 JWT Token Provider（JwtUtil）
- [x] 實作 Spring Security 配置
- [x] 實作登入/註冊 API（AuthController + AuthService）

### Phase 2: 前後端整合（✅ 100% 完成）
- [x] 實作 CoinGecko API Proxy (`/api/coins/*`)
- [x] 後端快取機制（Spring Cache + @Cacheable）
- [x] 實作收藏 CRUD API（FavoriteController + FavoriteService）
- [x] 前端整合（新增 api.js，移除 mockAuth.js）
- [x] 前端環境變數配置（.env）
- [x] 後端配置檔完善（application.yml, application-dev.yml）
- [x] LoginView、RegisterView、WatchlistView 改用真實 API
- [x] 實際前後端整合測試（已完成）
- [x] Watchlist 顯示問題修復
- [x] 收藏按鈕閃爍問題修復

### Phase 3: 進階功能（⏳ 待開始）
- [ ] 實作公告 CRUD API（AnnouncementController + Service）
- [ ] 實作用戶活動記錄（user_activities 表整合）
- [ ] 實作價格提醒功能（coin_price_alerts 表整合）
- [ ] Admin Panel 統計 API（GET /api/admin/stats）
- [ ] 幣種比較歷史（coin_comparisons 表整合）
- [ ] 市場篩選預設（market_filter_presets 表整合）

### Phase 4: 優化與測試（⏳ 待開始）
- [ ] 單元測試撰寫
- [ ] API 效能優化
- [ ] 安全性檢查
- [ ] 部署設定

## API 文檔

完整 API 規格請參考：[後端 README](../backend/README.md)

### 認證相關（已實作）
- `POST /api/auth/register` - 用戶註冊
- `POST /api/auth/login` - 用戶登入
- `POST /api/auth/logout` - 用戶登出

### 收藏相關（已實作）
- `GET /api/favorites` - 取得收藏列表
- `POST /api/favorites?coinId={id}` - 新增收藏
- `DELETE /api/favorites/{coinId}` - 移除收藏

### 幣種相關（已實作）
- `GET /api/coins?page={page}&perPage={perPage}&orderBy={orderBy}` - 取得幣種列表
- `GET /api/coins/{id}` - 取得幣種詳情

### 公告相關（待實作）
- `GET /api/announcements` - 取得啟用的公告

### 管理員相關（待實作）
- `GET /api/admin/stats` - 取得統計資訊
- `GET /api/admin/users` - 取得所有用戶

## 測試帳號

**目前沒有預設帳號**，請透過以下方式建立：

1. **註冊新帳號**（推薦）
   - 訪問 http://localhost:5173/register
   - 填寫用戶名、Email、密碼
   - 註冊後會自動獲得 `user` 角色

2. **升級為 Admin**
   - 註冊後，在資料庫中執行：
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
   ```

**安全考量**：為了安全，註冊 API 不允許直接建立 admin 帳號。

## 專案規範

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

**前端 (JavaScript/Vue)**:
- 資料夾: `kebab-case`
- Vue 檔案: `PascalCase.vue`
- JS 檔案: `camelCase.js`

**後端 (Java)**:
- Package: `lowercase`
- Class: `PascalCase`
- Method: `camelCase`

## 常見問題

### Q: 前端如何連接後端 API？
A: 修改 `../frontend/.env` 中的 `VITE_API_BASE_URL`

### Q: 為什麼前端無法直接呼叫 CoinGecko API？
A: CoinGecko Demo API Key 不支援瀏覽器 CORS，必須透過後端 proxy。免費 API 速率限制也很嚴格（10-30 次/分鐘）。

### Q: 如何修改資料庫密碼？
A: 編輯 `../backend/src/main/resources/application.yml`

### Q: JWT Secret 如何設定？
A: 生產環境請使用環境變數，參考 `application-prod.yml`

### Q: 專案記憶檔案在哪裡？
A: 參考 `../CLAUDE.md`，包含所有開發歷史與決策記錄

## 貢獻指南

1. Fork 專案
2. 建立功能分支 (`git checkout -b feature/AmazingFeature`)
3. Commit 變更 (`git commit -m 'feat: 新增某功能'`)
4. Push 到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

---

**專案名稱**: CoinVue（幣景）
**前端版本**: v1.1.1（98% 完成）
**後端版本**: v1.0.0（核心功能完成）
**最後更新**: 2024-11-30
**專案狀態**: Phase 1-2 完成，收藏功能已完整測試，待安全性優化與 Phase 3-4 開發

**⚠️ 重要提醒**：本專案配置文件包含敏感資訊已提交到 Git，不適合直接用於生產環境。
詳見：[後端代碼審查報告](./後端代碼審查報告_2024-11-30.md) 和 [安全性建議](./安全性建議.md)
