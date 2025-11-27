# CoinVue（幣景）專案記憶

> 此檔案由 Claude Code 自動維護，用於保存專案上下文和歷史決策。

---

## 品牌資訊

- **網站名稱**：CoinVue（幣景）
- **命名理念**：Coin（加密貨幣）+ Vue（視野/框架），意指「洞察幣圈前景的視野」
- **中文名稱**：幣景
- **版本**：v1.1.0（前端）+ v1.0.0（後端）
- **命名日期**：2024-11-27

---

## 專案概述

**CoinVue（幣景）** 是一個專業的加密貨幣市場監控平台，提供即時價格追蹤、市場數據分析、個人收藏管理、多幣種比較等功能。採用 Vue 3 技術棧，支援中英文雙語切換，打造直觀流暢的使用者體驗。

---

## 技術棧

### 前端
- **框架**：Vue 3.5.22 + Vite 7.1.11
- **狀態管理**：Pinia 3.0.3（useCoinsStore, useLocaleStore, useMarketFilterStore）
- **路由**：Vue Router 4.6.3
- **國際化**：vue-i18n 9.14.5（中英雙語）
- **樣式**：Scoped CSS + Tailwind CSS 4.1.17

### 後端
- **框架**：Spring Boot 3.2.0 + Spring Security + JWT
- **Java 版本**：17
- **資料庫**：MySQL 8.0 + JPA/Hibernate
- **建置工具**：Maven 3.8+

### API 數據源
- **主要**：CoinGecko API（有 API Key，30 次/分鐘）
- **備援**：CoinCap API（免費，200 次/分鐘）

### 資料庫
- **類型**：MySQL 8
- **Schema**：v3.0（9 個表，包含語系、活動記錄等）

---

## 現況（2024-11-27）

### ✅ 前端（v1.1.0，90% 完成）
- Vue 3 + Pinia + i18n 完整架構
- Sidebar 語系切換按鈕（zh-TW / en-US）
- Market 進階篩選功能（價格、市值、漲跌幅範圍）
- Dashboard、Market、Compare、Watchlist、Profile、Admin 全頁面完成
- **整合狀態**：已改用後端 API（api.js），移除 mockAuth.js

### ✅ 後端（v1.0.0，基礎功能完成）
- **Repository 層**：UserRepository, AuthTokenRepository, CoinFavoriteRepository, AnnouncementRepository
- **Service 層**：AuthService（註冊/登入/登出）、FavoriteService（收藏 CRUD）、CoinService（CoinGecko Proxy）
- **Controller 層**：AuthController, FavoriteController, CoinController
- **安全配置**：SecurityConfig（CORS + BCrypt 密碼加密）
- **JWT 工具**：JwtUtil（Token 生成與驗證）
- **例外處理**：GlobalExceptionHandler + 5 個自訂 Exception

### ✅ 資料庫（v3.0 已設計）
- **檔案**：`database/schema_v3.sql`（唯一正式版本）
- **表格**：9 個（users, auth_tokens, coin_favorites, announcements, user_activities, market_filter_presets, coin_price_alerts, coin_comparisons, system_settings）
- **狀態**：SQL 檔案已就緒，可執行建立資料庫

---

## 重要檔案結構

```
CryptoDashboard/
  frontend/                 # Vue 3 前端專案
    src/
      stores/
        useCoinsStore.js         # 幣種資料快取
        useLocaleStore.js        # 語系管理
        useMarketFilterStore.js  # 市場篩選狀態
      utils/
        coingeckoApi.js   # CoinGecko API（含 API Key）
        coincapApi.js     # CoinCap 備援 API
        api.js            # 統一 API 請求工具（後端整合）
        format.js         # 格式化工具
      i18n/               # vue-i18n 設定
      locales/            # zh-TW.json, en-US.json
      views/              # 8 個頁面（Dashboard, Market, CoinDetail, Watchlist, Compare, Login, Register, Admin）
      components/         # CoinCard, CoinTable, Navbar, Sidebar, PriceChart 等
    .env                  # 環境變數（API Keys）
  backend/                # Spring Boot 後端專案
    src/
      main/
        java/com/crypto/dashboard/
          config/          # SecurityConfig, AppConfig, CorsConfig
          controller/      # AuthController, FavoriteController, CoinController
          service/         # AuthService, FavoriteService, CoinService
          repository/      # UserRepository, AuthTokenRepository, CoinFavoriteRepository, AnnouncementRepository
          entity/          # User, AuthToken, CoinFavorite, Announcement（4 個 JPA 實體）
          exception/       # GlobalExceptionHandler + 6 個自訂 Exception
          dto/             # LoginRequest, RegisterRequest, AuthResponse 等
          util/            # JwtUtil
        resources/
          application.yml      # 主配置（JWT, CoinGecko, CORS）
          application-dev.yml  # 開發環境配置
    pom.xml
  database/
    schema_v3.sql         # MySQL v3.0 完整結構（唯一正式版）
  docs/
    README.md             # 文檔導覽
    專案結構規劃.md        # 資料夾組織方案
    功能對照表.md          # 功能實作狀態（參考用）
    功能需求分析_v2.md     # 需求分析報告（參考用）
```

---

## 環境變數

**frontend/.env**
```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_COINGECKO_API_KEY=CG-vczvnvBTsqG7Z8EVB7KRb3ii
```

**backend/application.yml**
```yaml
jwt:
  secret: coinvue-secret-key-minimum-32-characters-required-for-hs512
  expiration: 86400000

coingecko:
  api:
    key: CG-vczvnvBTsqG7Z8EVB7KRb3ii
```

---

## 測試帳號

| 角色 | Email | 密碼 |
|------|-------|------|
| 一般用戶 | demo@example.com | password |
| 管理員 | admin@example.com | admin123 |

---

## 開發歷史

### 2024-11-27（今日）
- ✅ **後端基礎架構完整實作**：
  - Repository 層（4 個）+ Service 層（3 個）+ Controller 層（3 個）
  - JWT 認證系統完整（JwtUtil + SecurityConfig）
  - 全域例外處理（GlobalExceptionHandler）
  - CoinGecko Proxy API（CoinService）
- ✅ **前後端整合**：
  - 新增 `frontend/src/utils/api.js`（統一 API 工具）
  - 刪除 `mockAuth.js`（移除模擬資料）
  - 修改 LoginView, RegisterView, WatchlistView 使用真實 API
  - 新增 `frontend/.env`（API Base URL 配置）
- ✅ **關鍵 Bug 修正**：
  - 修正 `application.yml` 的 `context-path: /api` 錯誤（避免 URL 重複）
  - Repository 刪除方法加入 `@Transactional` + `@Modifying` 註解
  - 修正方法名稱：`deleteByUserId` → `deleteByUser_Id`（符合 JPA 規範）
- ✅ **資料庫整合**：
  - 刪除 `schema_zh.sql`（中文對照版不再需要）
  - 統一使用 `schema_v3.sql` 作為唯一正式版本
- ✅ **UI 優化**：
  - 調整品牌顯示位置：Sidebar → Navbar
  - Navbar 顯示「CoinVue 幣景」（中英文並列）
  - 清理 Sidebar 未使用的 CSS 樣式

### 2024-11-26
- ✅ **前端 API 呼叫優化**：
  - 新增 CoinGecko API 逾時與重試機制
  - 超時時自動切換到 CoinCap 備援 API
- ✅ **實作 Pinia 幣種快取系統**：
  - 建立 `useCoinsStore` 全域狀態管理
  - Dashboard、Market、Compare 頁面共用快取
  - 減少重複 API 請求

### 2024-11-25
- ✅ **權限分離優化**：
  - 管理者專屬選單：移除 Dashboard、Market、Compare
  - 一般用戶保留完整功能選單
- ✅ **語系切換功能實作**：
  - Sidebar 底部新增語系切換按鈕（zh-TW / en-US）
  - 建立 `useLocaleStore` Pinia Store
  - 語系偏好儲存至 localStorage
- ✅ **Market Overview 進階篩選功能**：
  - 新增篩選面板（價格範圍、市值範圍、24h 交易量、漲跌幅）
  - 建立 `useMarketFilterStore` Pinia Store
  - 實作篩選預設儲存與載入功能

### 2024-11-24
- ✅ **專案結構重構**：
  - 移除多餘的巢狀資料夾層級
  - 清理 Eclipse 產生的垃圾檔案
  - 採用標準 Monorepo 結構
- ✅ **資料庫 Schema 修復與優化**：
  - 修復 `schema_zh.sql` 的外鍵約束 COMMENT 語法錯誤
  - 統一 `schema.sql` 和 `schema_zh.sql` 的欄位順序

### 2024-11-23
- ✅ **資料庫 Schema 優化**：
  - 完全移除 `coin_submissions` 表（功能已廢棄）
  - 建立 `schema_zh.sql` 詳細中文版
  - 後端 Spring Boot 專案成功匯入 Eclipse

### 2024-11-20
- ✅ 修復 `formatPrice` 函數處理極小價格（如 SHIB 0.0000095）
- ✅ 統一格式化函數至 `format.js`
- ✅ 建立 CoinCap API 作為備援數據源
- ✅ 移除 Dashboard 的 Trending Buys 假數據功能
- ✅ 加入 CoinGecko API Key 支援
- ✅ 建立 MySQL 資料庫 Schema
- ✅ **重構 Admin Panel**：
  - 移除用戶端「提交新幣種」功能
  - 新增數據總覽、用戶管理、公告管理

---

## 接下來要做的事

### 🔥 立即執行（下一步）

#### 1. 安裝 Maven（如果尚未安裝）
```powershell
# 以系統管理員身分執行 PowerShell
choco install maven -y

# 重新開啟 PowerShell，確認安裝
mvn -version
```

#### 2. 初始化資料庫
```bash
# 確認 MySQL 已啟動
mysql -u root -p -e "SHOW DATABASES LIKE 'crypto_dashboard';"

# 如果資料庫不存在，執行以下指令建立
mysql -u root -p < database/schema_v3.sql

# 確認建立成功（應該顯示 9 個表）
mysql -u root -p -e "USE crypto_dashboard; SHOW TABLES;"
```

#### 3. 啟動後端並測試
```bash
# 方法 A: 使用 Maven
cd backend
mvn spring-boot:run

# 方法 B: 使用 Eclipse
# 右鍵 CryptoDashboardApplication.java → Run As → Java Application
```

**預期結果**：
- Console 顯示 `Started CryptoDashboardApplication in X.XXX seconds`
- 無紅色 ERROR 訊息
- 後端運行在 `http://localhost:8080/api`

#### 4. 啟動前端並測試整合
```bash
cd frontend
npm run dev
```

**開啟瀏覽器測試**：`http://localhost:5173`
- [ ] 測試註冊功能（POST /api/auth/register）
- [ ] 測試登入功能（POST /api/auth/login）
- [ ] 登入後查看 Dashboard（GET /api/coins）
- [ ] 測試收藏功能（POST /api/favorites, DELETE /api/favorites/{id}）
- [ ] 查看 Watchlist 頁面（GET /api/favorites）
- [ ] 測試登出功能（POST /api/auth/logout）

---

### 📋 待辦事項（按優先順序）

#### 高優先（本週完成）
- [ ] **完成前後端整合測試**（見上方測試清單）
- [ ] **修復整合測試中發現的 Bug**
- [ ] **Admin Panel 後端 API 實作**：
  - [ ] `GET /api/admin/stats` - 統計資料（總用戶數、活躍用戶、收藏排行）
  - [ ] `GET /api/admin/users` - 用戶列表
  - [ ] `POST /api/announcements` - 建立公告
  - [ ] `PUT /api/announcements/{id}` - 更新公告
  - [ ] `DELETE /api/announcements/{id}` - 刪除公告
  - [ ] `GET /api/announcements` - 取得啟用公告（一般用戶）

#### 中優先（下週完成）
- [ ] **語系完整化**：
  - [ ] 檢查 `frontend/src/locales/zh-TW.json` 完整性
  - [ ] 檢查 `frontend/src/locales/en-US.json` 完整性
  - [ ] 補齊所有頁面缺少的翻譯文案
  - [ ] 測試語系切換功能
- [ ] **Market 進階篩選強化**：
  - [ ] 新增領域/分類篩選（DeFi, NFT, Meme 等）
  - [ ] 實作「儲存篩選預設」功能（使用 market_filter_presets 表）
  - [ ] 實作「載入已儲存的篩選」功能
- [ ] **資料庫 v3.0 新表格整合**：
  - [ ] user_activities 表 - 實作用戶活動記錄 API
  - [ ] coin_price_alerts 表 - 實作價格提醒功能
  - [ ] coin_comparisons 表 - 實作幣種比較歷史記錄

#### 低優先（未來功能）
- [ ] 密碼重設/忘記密碼流程
- [ ] Email 驗證功能
- [ ] 使用者個人資料編輯 API
- [ ] 單元測試撰寫（JUnit + MockMvc）
- [ ] API 效能優化（查詢優化、索引優化）
- [ ] 部署準備（Docker, CI/CD）

---

### ⚠️ 已知問題與注意事項

1. **前端 API 呼叫**：
   - 目前前端 `api.js` 已整合，但尚未實際測試
   - 需要確認 CORS 設定正確（application.yml 中已設定）
   - 需要確認 JWT Token 在前端正確儲存與傳送

2. **資料庫欄位對應**：
   - Entity 類別目前只對應 v1.0 的 4 個表
   - v3.0 新增的 5 個表尚未建立對應的 Entity

3. **測試帳號**：
   - 資料庫初始化後，需要手動建立測試帳號
   - 或在 AuthService 中先用模擬帳號測試

---

### 📊 開發進度追蹤

**Phase 1: 後端基礎建設** ✅ 100% 完成
- [x] Spring Boot 專案結構
- [x] Entity 層（4 個）
- [x] Repository 層（4 個）
- [x] Service 層（3 個）
- [x] Controller 層（3 個）
- [x] JWT 認證系統
- [x] 全域例外處理

**Phase 2: 前後端整合** ✅ 80% 完成
- [x] 前端 API 工具類（api.js）
- [x] 移除模擬資料（mockAuth.js）
- [x] CoinGecko API Proxy
- [x] 登入/註冊頁面整合
- [x] Watchlist 頁面整合
- [ ] ⏳ 實際測試整合（待完成）
- [ ] ⏳ Bug 修正（待完成）

**Phase 3: 進階功能** ⏳ 0% 完成
- [ ] Admin Panel API
- [ ] 用戶活動記錄
- [ ] 價格提醒功能
- [ ] 幣種比較歷史

**Phase 4: 優化與測試** ⏳ 0% 完成
- [ ] 單元測試
- [ ] 效能優化
- [ ] 安全性檢查
- [ ] 部署設定

---

## Admin Panel 功能

### 數據總覽 (Overview)
- 總用戶數、活躍用戶數（7天內）、總收藏數統計
- 最多收藏的幣種排行榜（Top 10）

### 用戶管理 (Users)
- 查看所有用戶列表（用戶名、Email、角色、註冊時間、最後登入、收藏數）
- 角色標籤區分（管理員/用戶）

### 公告管理 (Announcements)
- 新增系統公告（標題、內容、類型：資訊/成功/警告）
- 啟用/停用公告
- 刪除公告

---

## 注意事項

1. **API 速率限制**：CoinGecko 30 次/分鐘，超過會自動切換到 CoinCap
2. **價格格式化**：極小價格（< 0.0001）會動態計算小數位
3. **圖表顯示**：穩定幣（如 USDT）圖表會自動調整小數位數以顯示微小價格變動
4. **權限控制**：Admin Panel 只有 `role: 'admin'` 可以訪問
5. **Git 規範**：Commit 訊息使用中文
6. **環境變數**：`.env` 檔案包含 API Key，不應提交到 Git（已加入 .gitignore）

---

## 常用指令

### 前端
```bash
cd frontend
npm run dev          # 啟動開發伺服器
npm run build        # 建構生產版本
npm run preview      # 預覽生產版本
```

### 後端
```bash
cd backend
mvn spring-boot:run  # 啟動後端（需先安裝 Maven）
# 或使用 Eclipse: 右鍵 CryptoDashboardApplication.java → Run As → Java Application
```

### 資料庫
```bash
# 建立資料庫
mysql -u root -p < database/schema_v3.sql

# 確認資料庫建立
mysql -u root -p -e "SHOW DATABASES LIKE 'crypto_dashboard';"
```

---

## 專案特色

1. **雙 API 架構**：CoinGecko（主）+ CoinCap（備援），確保服務穩定性
2. **智能價格顯示**：自動識別幣種特性調整小數位數（穩定幣、極小價格幣、高價幣）
3. **完整管理後台**：數據總覽、用戶管理、公告系統三大模塊
4. **響應式設計**：桌面、平板、手機全適配
5. **JWT 認證系統**：完整的前後端認證流程，安全可靠
6. **前後端分離**：Vue 3 + Spring Boot 標準架構

---

*最後更新：2024-11-27（後端基礎架構完成、前後端整合）*
