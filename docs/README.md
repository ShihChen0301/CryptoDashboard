# 專案文檔

CryptoDashboard 完整開發文檔

## 目錄

### 核心文檔
- [後端規劃](./後端規劃.md) - Java Spring Boot 架構設計與 API 規格
- [專案結構規劃](./專案結構規劃.md) - 資料夾組織方案與命名規範

### 快速連結

- **前端專案**: `../frontend/`
- **後端專案**: `../backend/`
- **資料庫腳本**: `../database/`
- **專案記憶**: `../CLAUDE.md`（開發歷史與決策記錄）

## 技術棧總覽

### 前端
- Vue 3 + Vite
- Pinia (狀態管理)
- Vue Router
- CoinGecko API + CoinCap API

### 後端
- Spring Boot 3.2.0
- Spring Security + JWT
- Spring Data JPA
- MySQL 8.0

### 資料庫
- MySQL 8.0
- 4 個核心表格：users, auth_tokens, coin_favorites, announcements
- 詳見：`../database/schema.sql` 或 `../database/schema_zh.sql`（中文詳細版）

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
mysql -u root -p < ../database/schema.sql
```

## 開發流程建議

### Phase 1: CoinGecko API Proxy（進行中）🔥
- [ ] 實作 `/api/coins/markets` - 幣種列表
- [ ] 實作 `/api/coins/{id}` - 幣種詳情
- [ ] 實作 `/api/global` - 全球市場數據
- [ ] 後端快取機制（減少 API 請求）
- [ ] 解決 CORS 問題

### Phase 2: 認證系統
- [x] 建立 Spring Boot 專案結構
- [x] 建立所有 Entity 類別
- [ ] 配置資料庫連接
- [ ] 實作 JWT Token Provider
- [ ] 實作 Spring Security 配置
- [ ] 實作登入/註冊 API
- [ ] 前端整合（替換 mockAuth.js）

### Phase 3: 核心功能
- [ ] 實作收藏 CRUD API
- [ ] 實作用戶資訊 API
- [ ] 實作公告 CRUD API
- [ ] 前端整合（替換 localStorage）

### Phase 4: 管理員功能
- [ ] 實作用戶管理 API
- [ ] 實作統計資訊 API
- [ ] 管理者專屬頁面（與一般使用者分離）

### Phase 5: 新功能開發
- [ ] Market Overview 篩選功能增強
- [ ] 語系切換功能（i18n）
- [ ] 使用者最常關注的幣種統計

### Phase 6: 優化與測試
- [ ] 單元測試撰寫
- [ ] API 效能優化
- [ ] 安全性檢查

## API 文檔

完整 API 規格請參考：[後端規劃.md - 第三章](./後端規劃.md#三api-端點設計)

### 認證相關
- `POST /api/auth/register` - 用戶註冊
- `POST /api/auth/login` - 用戶登入

### 收藏相關
- `GET /api/favorites` - 取得收藏列表
- `POST /api/favorites` - 新增收藏
- `DELETE /api/favorites/:coinId` - 移除收藏

### 公告相關
- `GET /api/announcements` - 取得啟用的公告

### 管理員相關
- `GET /api/admin/stats` - 取得統計資訊
- `GET /api/admin/users` - 取得所有用戶

## 測試帳號

| 角色 | Email | 密碼 |
|------|-------|------|
| 一般用戶 | demo@example.com | password |
| 管理員 | admin@example.com | admin123 |

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

**版本**: 1.0.0
**最後更新**: 2024-11-25
**維護者**: Shih Chen
**專案狀態**: 開發中（Phase 1: API Proxy 實作中）
