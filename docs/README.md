# 專案文檔

CryptoDashboard 完整開發文檔

## 目錄

### 核心文檔
- [後端規劃](./後端規劃.md) - Java Spring Boot 架構設計與 API 規格
- [專案結構規劃](./專案結構規劃.md) - 資料夾組織方案與命名規範

### 快速連結

- **前端專案**: `../前端/CryptoDashboard/` （待重新命名為 `frontend`）
- **後端專案**: `../backend/`
- **資料庫腳本**: `../database/`

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

## 開發指南

### 前端開發

```bash
cd ../前端/CryptoDashboard
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
mysql -u root -p < ../database/schema.sql
```

## 開發流程建議

### Phase 1: 基礎建設 ✅
- [x] 建立 Spring Boot 專案
- [x] 配置資料庫連接
- [x] 建立所有 Entity 類別
- [ ] 測試資料庫連接

### Phase 2: 認證系統
- [ ] 實作 JWT Token Provider
- [ ] 實作 Spring Security 配置
- [ ] 實作登入/註冊 API
- [ ] 前端整合測試

### Phase 3: 核心功能
- [ ] 實作收藏 CRUD API
- [ ] 實作用戶資訊 API
- [ ] 實作公告 CRUD API

### Phase 4: 管理員功能
- [ ] 實作用戶管理 API
- [ ] 實作統計資訊 API

### Phase 5: 優化與測試
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
A: 修改 `frontend/CryptoDashboard/.env` 中的 `VITE_API_BASE_URL`

### Q: 如何修改資料庫密碼？
A: 編輯 `backend/src/main/resources/application.yml`

### Q: JWT Secret 如何設定？
A: 生產環境請使用環境變數，參考 `application-prod.yml`

## 貢獻指南

1. Fork 專案
2. 建立功能分支 (`git checkout -b feature/AmazingFeature`)
3. Commit 變更 (`git commit -m 'feat: 新增某功能'`)
4. Push 到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

---

**版本**: 1.0.0
**最後更新**: 2024-11-23
**維護者**: CryptoDashboard Team
