# CoinVue（幣景）專案記憶

> 此檔案由 Claude Code 自動維護，用於保存專案上下文和歷史決策。

---

## 品牌資訊

- **網站名稱**：CoinVue（幣景）
- **命名理念**：Coin（加密貨幣）+ Vue（視野/框架），意指「洞察幣圈前景的視野」
- **中文名稱**：幣景
- **版本**：v1.1.0（前端）+ v1.0.0（後端）
- **命名日期**：2025-11-27

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

## 現況（2025-12-25）

### ✅ 前端（v1.2.0，100% 完成）

- Vue 3 + Pinia + i18n 完整架構
- Sidebar 語系切換按鈕（zh-TW / en-US）
- Market 進階篩選功能（價格、市值、漲跌幅範圍）
- Dashboard、Market、Compare、Watchlist、Profile、Admin 全頁面完成
- **Admin Panel 完整功能** 🎉：
  - 數據總覽：總用戶數、活躍用戶數、總收藏數、最多收藏幣種排行
  - 用戶管理：用戶列表（用戶名、Email、角色、註冊時間、收藏數）
  - 公告管理：建立/切換/刪除公告
- **系統公告功能**：
  - 用戶端 Dashboard 顯示啟用的系統公告
  - 支援三種公告類型（資訊/成功/警告）視覺區分
  - 公告橫幅動畫效果
- **API 整合**：
  - 統一 API 工具（utils/api.js）：支援 Bearer Token 認證
  - 完整前後端整合：auth/favorite/coin/admin/announcement API
  - 移除模擬資料（mockAuth.js）
  - 所有頁面已串接真實 API 並測試通過
- **路由智能跳轉**：根據用戶角色自動跳轉（admin → /admin, user → /dashboard）

### ✅ 後端（v1.1.0，生產就緒）

- **配置層（Config）**：
  - AppConfig：RestTemplate Bean 配置（含超時設定：連線 5 秒 / 讀取 10 秒）
  - SecurityConfig：JWT 驗證 + BCrypt 密碼編碼 + CORS 設定 + JwtAuthenticationFilter
  - CorsConfig：CORS 跨域配置（支援 wildcard）
  - 路徑放行：/api/auth/\*, /api/coins/\*（其餘需 JWT 驗證）
- **安全層（Security）**：
  - JwtAuthenticationFilter：JWT Token 驗證過濾器（整合至 Spring Security 鏈）
  - 無狀態 Session 管理（SessionCreationPolicy.STATELESS）
- **控制器層（Controller）**：
  - AuthController：註冊、登入、登出（含 @Valid 自動驗證）
  - FavoriteController：收藏 CRUD
  - CoinController：CoinGecko API Proxy
  - AdminController：管理員統計數據、用戶列表 ✅
  - AnnouncementController：公告 CRUD、啟用/停用切換 ✅
- **服務層（Service）**：
  - AuthService：JWT 簽發、登出、返回淨化 User 物件（移除手動驗證邏輯）
  - FavoriteService：防重複收藏邏輯（使用資料庫載入的 User 實體）
  - CoinService：CoinGecko Proxy + Caffeine Cache（5 分鐘 TTL，最大 1000 項）
  - AdminService：統計數據、用戶列表（含收藏數）✅
  - AnnouncementService：公告 CRUD、自動設定建立者（從 SecurityContext）✅
- **資料層（Repository）**：
  - UserRepository, AuthTokenRepository, CoinFavoriteRepository, AnnouncementRepository
- **實體層（Entity）**：
  - User, AuthToken, CoinFavorite, Announcement（使用 @Getter/@Setter，避免循環參照）
- **DTO 物件**：
  - Request：LoginRequest, RegisterRequest, AnnouncementRequest（含 Jakarta Bean Validation）
  - Response：AuthResponse（token + user）, AdminStatsResponse, UserSummaryDTO, AnnouncementResponse
- **JWT 工具（JwtUtil）**：
  - 演算法：HS512
  - 配置化：secret、expiration（application.yml）
  - 方法：getUserIdFromToken, validateToken
- **例外處理**：
  - GlobalExceptionHandler（使用 SLF4J Logger，移除 printStackTrace）
  - 4 個自訂 Exception（ResourceNotFoundException, ValidationException, InvalidCredentialsException, ExternalApiException）
- **快取機制**：
  - Caffeine Cache（coinsList, coinDetail）
  - TTL：5 分鐘自動過期
  - 容量：最大 1000 項

### ✅ 資料庫（v3.0）

- **檔案**：`database/schema_v3.sql`（唯一正式版本）
- **表格**：9 個
  - **核心表**（已實作 Entity）：users, auth_tokens, coin_favorites, announcements
  - **擴充表**（v3.0 新增）：user_activities, market_filter_presets, coin_price_alerts, coin_comparisons, system_settings
- **配置檔**：application.yml/application-dev.yml
  - Cache：Caffeine（5 分鐘 TTL，最大 1000 項）
  - CoinGecko API Key：已配置
  - JWT：secret/expiration 已設定
  - CORS：允許 localhost:5173
  - RestTemplate：連線超時 5 秒，讀取超時 10 秒

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
    README.md                  # 文檔導覽
    後端架構說明.md            # 後端三層架構、JPA、連接池詳細說明
    功能對照表.md              # v2.0 功能規劃（未來參考）
    功能需求分析_v2.md         # v2.0 需求分析（未來參考）
    archive/
      後端代碼檢查報告.md      # 後端代碼檢查報告（已完成修復）
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

### 目前已建立的測試帳號

- **用戶名**：shihChenAdmin
- **Email**：shichen@example.com
- **角色**：admin
- **密碼**：（註冊時設定的密碼）

### 建立新帳號

#### 方式 1：註冊新帳號（推薦）

1. 前端註冊頁面：http://localhost:5173/register
2. 填寫用戶名、Email、密碼
3. 註冊後會自動獲得 `user` 角色

#### 方式 2：升級為 Admin

註冊後，可使用以下兩種方式升級為 admin：

**A. 使用 MySQL Workbench（圖形界面）**

1. 連接到 `crypto_dashboard` 資料庫
2. 在 `users` 表中找到你的帳號
3. 將 `role` 欄位從 `user` 改成 `admin`
4. 按 Apply 儲存

**B. 使用 SQL 指令**

```sql
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

**安全考量**：為了安全，註冊 API 不允許直接建立 admin 帳號，只能先註冊為普通用戶，再由資料庫手動升級。

---

## 開發歷史

### 2025-12-25（今日）
- ✅ **代碼清理與優化** 🧹：
  - **後端清理**：
    - 刪除 UnauthorizedException.java（未使用的例外類別）
    - 移除 User.avatarUrl 欄位（改用 Gravatar 動態生成）
    - 移除 User.TradingExperience 枚舉（保留 UI，待未來實作）
    - 清理 GlobalExceptionHandler 中的 UnauthorizedException 處理器
  - **前端清理**：
    - 移除 AdminView.vue 的「最後登入」欄位
    - 刪除 useLocaleStore.js 的過時 TODO 註解
  - **後端調整**：
    - 修改 UserRepository 查詢移除 lastLoginAt
    - 修改 UserSummaryDTO 移除 lastLogin 欄位
    - 修改 AdminService 調整欄位映射
  - **文檔更新**：
    - 更新 CLAUDE.md 反映最新架構
    - 更新 docs/後端架構說明.md Exception 列表
    - 更新 docs/學習路徑指南_v1.2.0.md
  - **編譯測試**：
    - ✅ 後端編譯成功（BUILD SUCCESS）
    - ✅ 前端無錯誤
    - ✅ 39 個 Java 檔案全部正常使用

### 2025-12-04
- ✅ **Admin Panel 完整測試與修復** 🎉：
  - **路由優化**：修復 admin 登入後首頁跳轉邏輯，根據角色智能跳轉（admin → /admin, user → /dashboard）
  - **用戶列表修復**：修正 AdminService 的 Enum 轉換問題（role 和 status 從 Enum 正確轉換為 String）
  - **公告建立功能完整實作**：
    - 修復 AnnouncementService.createAnnouncement()，加入從 SecurityContext 取得當前用戶並設定 createdBy 欄位
    - 修復 AnnouncementResponse，加入 createdBy 欄位（顯示建立者用戶名）
    - 統一前後端公告類型使用小寫（info, success, warning）
  - **用戶端公告顯示功能實作**：
    - 在 DashboardView.vue 加入系統公告顯示區域
    - 支援三種公告類型的視覺區分（資訊/成功/警告）
    - 公告橫幅動畫效果（slideIn）
    - 公告顯示在 Dashboard 最上方
- ✅ **Admin Panel 三大功能全面測試通過**：
  - 數據總覽 Tab：總用戶數、活躍用戶數、總收藏數、最多收藏幣種排行 ✅
  - 用戶管理 Tab：用戶列表顯示（含收藏數統計）✅
  - 公告管理 Tab：建立/切換/刪除公告 ✅
- ✅ **專案清理**：
  - 刪除 TODO_TOMORROW.md（所有待辦事項已完成）
  - 更新 CLAUDE.md 完整記錄

### 2025-12-03

- ✅ **Admin Panel 後端 API 完整實作**：
  - 建立 4 個 DTO 類別（AdminStatsResponse, UserSummaryDTO, AnnouncementRequest, AnnouncementResponse）
  - 建立 AdminService 和 AnnouncementService
  - 建立 AdminController 和 AnnouncementController
  - 新增 Repository 查詢方法（統計數據、用戶列表、收藏排行、公告管理）
  - 修正 CoinFavoriteRepository 的 JPQL LIMIT 語法（改用 nativeQuery）
- ✅ **前端 API 完整整合**：
  - 新增 adminApi 和 announcementApi 到 api.js
  - 改造 AdminView.vue，移除所有 localStorage 假資料
  - 連接真實後端 API（統計、用戶列表、公告管理）
  - 修正資料欄位對應（joinDate, lastLoginAt）
  - 修正公告類型（INFO/WARNING/SUCCESS 大寫）
- ✅ **JWT 權限系統完整修復**：
  - 修改 AuthService.issueToken()，在 JWT 中加入 role 資訊
  - 新增 JwtUtil.getRoleFromToken() 方法
  - 修改 JwtAuthenticationFilter，解析角色並設定 authorities（ROLE_ADMIN）
  - 解決 403 Forbidden 權限問題
- ✅ **登入流程優化**：
  - 修改 LoginView.vue，根據角色跳轉（admin → /admin, user → /dashboard）
- ⏳ **部分功能測試**：
  - ✅ 數據總覽 API 測試通過
  - ⏳ 用戶列表 API（修正 JPQL 查詢，待重啟測試）
  - ⏳ 公告管理 API（待測試）
- ✅ **前後端整合測試完成**：
  - 後端成功啟動在 http://localhost:8080/api
  - 前端成功連接後端 API
  - 完成註冊、登入、收藏、Watchlist 等功能測試
- ✅ **測試帳號建立**：
  - 建立 admin 測試帳號（shihChenAdmin / shichen@example.com）
  - 驗證角色權限系統正常運作
- ✅ **文檔整理與優化**：
  - 重新組織高優先待辦事項
  - 更新專案現況為最新狀態
  - 新增測試帳號說明
  - 清理過時內容

### 2025-11-30

- ✅ **收藏功能完整修復**：
  - **Watchlist 顯示問題修復**：
    - 正確轉換 CoinGecko API 數據格式為應用格式
    - 添加載入中和錯誤狀態顯示（含重試按鈕）
    - 優化 clearAll 函數邏輯
  - **收藏按鈕閃爍問題修復**：
    - 改用直接更新快取而非清除快取（避免所有星星閃爍）
    - 優化 addFavorite/removeFavorite/clearFavorites 函數
    - 添加登入狀態檢查，避免未登入時發送請求
  - **FavoriteButton 組件優化**：
    - 改善快取載入邏輯，避免無限循環
- ✅ **後端代碼與數據庫全面審查**：
  - **發現 16 項待優化問題**：
    - 高優先（安全性）：3 項
      - 敏感資訊外洩（DB 密碼、JWT Secret、API Key 已提交到 Git）
      - JWT Secret 強度不足
      - 缺少 Token 黑名單機制
    - 中優先（性能與代碼質量）：8 項
      - N+1 查詢問題
      - AuthService 登入刪除所有舊 Token
      - toSafeUser 使用手動複製
      - 缺少 Rate Limiting
      - JwtAuthenticationFilter 日誌級別不當
    - 數據庫設計：5 項
      - 缺少數據庫索引優化
      - auth_tokens 表缺少清理機制
      - users 表缺少軟刪除機制
      - coin_price_alerts 表缺少通知狀態
  - **建議優化方案**：
    - 立即執行：移除敏感資訊到環境變數、更新 JWT Secret、添加 Token 數據庫檢查
    - 短期優化：添加 Rate Limiting、實作過期 Token 清理、優化數據庫索引
    - 長期優化：添加單元測試、整合 API 文檔、實作軟刪除
- ✅ **文檔全面整理**：
  - 更新 CLAUDE.md 記錄最新進展
  - 更新 README.md（移除假測試帳號、加入安全性警告）
  - 整理 docs/ 資料夾文檔
  - 標註 v2.0 功能規劃文檔為未來功能
  - 新增後端代碼審查報告與安全性建議文檔

### 2025-11-28

- ✅ **後端完整架構實作**：
  - **Config 層**：AppConfig（RestTemplate Bean）、SecurityConfig（JWT + BCrypt + CORS）
  - **Controller 層**：AuthController、FavoriteController、CoinController
  - **Service 層**：
    - AuthService：登入/註冊/登出 + JWT 簽發 + User 物件淨化
    - FavoriteService：收藏 CRUD + 防重複收藏邏輯
    - CoinService：CoinGecko Proxy + @Cacheable 快取
  - **Repository 層**：UserRepository、AuthTokenRepository、CoinFavoriteRepository、AnnouncementRepository
  - **DTO 層**：LoginRequest、RegisterRequest、AuthResponse（token + user）
  - **JWT 工具**：JwtUtil（HS512 + 配置化 secret/expiration + validateToken）
  - **例外處理**：GlobalExceptionHandler + 6 個自訂 Exception
- ✅ **前端 API 整合**：
  - 重寫 `utils/api.js`：統一 API_BASE_URL + Bearer Token 認證
  - 實作 authApi、favoriteApi、coinApi 三大模組
  - 移除 `mockAuth.js`（清除所有模擬資料）
  - LoginView、RegisterView、WatchlistView 改用真實 API
  - 新增 `frontend/.env`（配置 VITE_API_BASE_URL）
- ✅ **資料庫配置**：
  - Schema v3.0 新增 `system_settings` 表
  - application.yml 加入 Spring Cache Simple 配置
  - application.yml 加入 CoinGecko API Key
  - application-dev.yml 補齊 JWT 欄位
- ✅ **文檔更新**：
  - 更新 CLAUDE.md、README.md、docs/README.md 反映最新實作狀態
  - 刪除過時文檔：docs/專案結構規劃.md（已完成重構）
- ✅ **後端代碼全面修復與優化**（下午）：
  - **重大修復（2 項）**：
    - 新增 `JwtAuthenticationFilter`：實作完整 JWT 認證流程，整合到 Spring Security 過濾鏈
    - 修正 `FavoriteService`：改用資料庫載入的 User 實體（解決 JPA unmanaged entity 問題）
  - **中等優先修復（6 項）**：
    - Entity 層改用 `@Getter/@Setter` 取代 `@Data`（避免 JPA 循環參照）
    - `AppConfig`：RestTemplate 加入連線超時（5 秒）和讀取超時（10 秒）
    - `CorsConfig`：修正 allowedHeaders wildcard 處理的型別錯誤
    - `GlobalExceptionHandler`：移除 printStackTrace，改用 SLF4J Logger
    - `pom.xml`：新增 Caffeine Cache 依賴
    - `application.yml`：配置 Caffeine Cache TTL（5 分鐘過期，最大 1000 項）
  - **次要優化（5 項）**：
    - DTO 層加入 Jakarta Bean Validation 註解
    - `AuthController`：使用 `@Valid` 啟用自動驗證
    - `AuthService`：移除手動驗證邏輯
    - 修正所有 Entity 的 Lombok import
    - 編譯與啟動測試通過
  - **測試結果**：
    - ✅ Maven 編譯成功
    - ✅ Spring Boot 成功啟動（http://localhost:8080/api）
    - ✅ JWT Filter 正確載入
    - ✅ 4 個 JPA Repository 掃描成功
    - ✅ MySQL 資料庫連線成功
    - ✅ Caffeine Cache 配置生效
  - **文檔整理**：
    - 生成「後端代碼檢查報告.md」（詳細記錄所有問題與修復方案）
    - 將報告移至 `docs/archive/`（問題已全部修復）

### 2025-11-27

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

### 2025-11-26

- ✅ **前端 API 呼叫優化**：
  - 新增 CoinGecko API 逾時與重試機制
  - 超時時自動切換到 CoinCap 備援 API
- ✅ **實作 Pinia 幣種快取系統**：
  - 建立 `useCoinsStore` 全域狀態管理
  - Dashboard、Market、Compare 頁面共用快取
  - 減少重複 API 請求

### 2025-11-25

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

### 2025-11-24

- ✅ **專案結構重構**：
  - 移除多餘的巢狀資料夾層級
  - 清理 Eclipse 產生的垃圾檔案
  - 採用標準 Monorepo 結構
- ✅ **資料庫 Schema 修復與優化**：
  - 修復 `schema_zh.sql` 的外鍵約束 COMMENT 語法錯誤
  - 統一 `schema.sql` 和 `schema_zh.sql` 的欄位順序

### 2025-11-23

- ✅ **資料庫 Schema 優化**：
  - 完全移除 `coin_submissions` 表（功能已廢棄）
  - 建立 `schema_zh.sql` 詳細中文版
  - 後端 Spring Boot 專案成功匯入 Eclipse

### 2025-11-20

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

### 🔥 高優先（本週完成）

#### 1. Admin Panel 後端 API 實作

**目標**：讓 Admin Panel 前端頁面可以顯示真實資料

需要實作的 API：

**A. 統計數據 API**

- `GET /api/admin/stats` - 管理員統計資料
  - 總用戶數
  - 活躍用戶數（7 天內登入）
  - 總收藏數
  - 最多收藏的幣種排行（Top 10）

**B. 用戶管理 API**

- `GET /api/admin/users` - 用戶列表
  - 返回所有用戶資訊（id, username, email, role, status, join_date, last_login）
  - 包含每個用戶的收藏數量

**C. 公告管理 API**

- `POST /api/admin/announcements` - 建立公告
  - 參數：title, content, type (info/success/warning), is_active
- `PUT /api/admin/announcements/{id}` - 更新公告
- `DELETE /api/admin/announcements/{id}` - 刪除公告
- `GET /api/announcements` - 取得啟用的公告（所有用戶可見）

**實作內容**：

- [ ] 建立 `AdminController`
- [ ] 建立 `AdminService`
- [ ] 建立 `AnnouncementController`
- [ ] 建立 `AnnouncementService`
- [ ] 新增對應的 DTO 類別
- [ ] 測試所有 API 端點

---

#### 2. 安全性優化 ⚠️

**A. 移除敏感資訊到環境變數**

- [ ] 將 `application.yml` 和 `application-dev.yml` 的敏感資訊移至環境變數
  - MySQL 密碼
  - JWT Secret
  - CoinGecko API Key
- [ ] 創建 `.env.example` 範本文件
- [ ] 更新 `.gitignore` 確保 `.env` 不被提交
- [ ] 更新文檔說明環境變數配置方式

**B. 強化 JWT 安全性**

- [ ] 使用 `openssl rand -base64 64` 生成強密鑰（512 位）
- [ ] 更新 `application.yml` 使用環境變數
- [ ] 修改 `JwtAuthenticationFilter` 驗證 Token 是否存在於 `auth_tokens` 表
- [ ] 實現真正的 Token 撤銷機制（檢查資料庫）

---

#### 3. 性能優化

- [ ] 添加 Rate Limiting（防暴力破解）
  - 登入 API：5 次/分鐘
  - 註冊 API：3 次/分鐘
- [ ] 實作過期 Token 自動清理機制
  - 建立定時任務清理過期的 `auth_tokens`
- [ ] 優化數據庫索引
  - `auth_tokens` 表：token, user_id, expires_at
  - `coin_favorites` 表：user_id, coin_id

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

1. **Admin Panel 資料**：

   - Admin Panel 前端頁面已完成，但顯示的是模擬資料
   - 需要實作後端 API（統計、用戶管理、公告管理）才能顯示真實資料

2. **資料庫欄位對應**：

   - Entity 類別目前只對應 v1.0 的 4 個核心表（users, auth_tokens, coin_favorites, announcements）
   - v3.0 新增的 5 個擴充表尚未建立對應的 Entity（user_activities, market_filter_presets, coin_price_alerts, coin_comparisons, system_settings）

3. **安全性問題**：
   - ⚠️ 敏感資訊（DB 密碼、JWT Secret、API Key）已提交到 Git
   - ⚠️ JWT Secret 強度不足（需要 512 位強密鑰）
   - ⚠️ Token 撤銷機制未完全實現（JwtAuthenticationFilter 未檢查資料庫）

---

### 📊 開發進度追蹤

**Phase 1: 後端基礎建設** ✅ 100% 完成

- [x] Spring Boot 專案結構
- [x] Config 層（AppConfig, SecurityConfig）
- [x] Entity 層（4 個實體類）
- [x] Repository 層（4 個 Repository）
- [x] Service 層（AuthService, FavoriteService, CoinService）
- [x] Controller 層（AuthController, FavoriteController, CoinController）
- [x] DTO 層（Request/Response）
- [x] JWT 認證系統（JwtUtil + HS512）
- [x] 全域例外處理（GlobalExceptionHandler + 6 個自訂 Exception）

**Phase 2: 前後端整合** ✅ 100% 完成

- [x] 前端 API 工具類（api.js，含 Bearer Token）
- [x] 移除模擬資料（mockAuth.js）
- [x] CoinGecko API Proxy（含 @Cacheable）
- [x] 登入/註冊頁面整合
- [x] Watchlist 頁面整合
- [x] 前端環境變數配置（.env）
- [x] 後端配置檔完善（application.yml, application-dev.yml）
- [x] 實際前後端整合測試（已完成）
- [x] 建立測試帳號（shihChenAdmin）

**Phase 3: 進階功能** ⏳ 0% 完成

- [ ] Admin Panel API（統計、用戶管理、公告管理）
- [ ] 用戶活動記錄（user_activities 表整合）
- [ ] 價格提醒功能（coin_price_alerts 表整合）
- [ ] 幣種比較歷史（coin_comparisons 表整合）
- [ ] 市場篩選預設（market_filter_presets 表整合）

**Phase 4: 優化與測試** ⏳ 0% 完成

- [ ] 單元測試（JUnit + MockMvc）
- [ ] 整合測試
- [ ] API 效能優化
- [ ] 安全性檢查
- [ ] 部署設定（Docker, CI/CD）

---

## Admin Panel 功能

### 數據總覽 (Overview)

- 總用戶數、活躍用戶數（7 天內）、總收藏數統計
- 最多收藏的幣種排行榜（Top 10）

### 用戶管理 (Users)
- 查看所有用戶列表（用戶名、Email、角色、註冊時間、收藏數）
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

_最後更新：2025-12-03（前後端整合測試完成、建立測試帳號、高優先待辦事項重新組織）_
