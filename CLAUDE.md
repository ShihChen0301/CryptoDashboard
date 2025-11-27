# CoinVue（幣景）專案記憶

> 此檔案由 Claude Code 自動維護，用於保存專案上下文和歷史決策。

---

## 品牌資訊

- **網站名稱**：CoinVue（幣景）
- **命名理念**：Coin（加密貨幣）+ Vue（視野/框架），意指「洞察幣圈前景的視野」
- **中文名稱**：幣景
- **前端版本**：v1.1.0
- **後端版本**：v1.0.0
- **命名日期**：2024-11-27

---

## 專案概述

**CoinVue（幣景）** 是一個專業的加密貨幣市場監控平台，提供即時價格追蹤、市場數據分析、個人收藏管理、多幣種比較等功能。採用前後端分離架構（Vue 3 + Spring Boot），支援中英文雙語切換。

---

## 技術棧

### 前端
- **框架**：Vue 3.5.22 + Vite 7.1.11
- **狀態管理**：Pinia 3.0.3
- **路由**：Vue Router 4.6.3
- **國際化**：vue-i18n 9.14.5
- **樣式**：Scoped CSS + Tailwind CSS 4.1.17

### 後端
- **框架**：Spring Boot 3.2.0
- **Java 版本**：17
- **資料庫**：MySQL 8.0 + JPA/Hibernate
- **安全**：Spring Security + JWT (jjwt 0.11.5)
- **建置工具**：Maven

### API 數據源
- **主要**：CoinGecko API（有 API Key，30 次/分鐘）
- **備援**：CoinCap API（免費，200 次/分鐘）

---

## 專案現況（2024-11-27）

### ✅ 前端（已完成 90%）
- Vue 3 + Pinia 狀態管理完整架構
- i18n 多語系切換（中英文）
- Market 進階篩選功能
- Dashboard、Market、Compare、Watchlist、Admin 等頁面完整
- **尚未完成**：仍直接呼叫 CoinGecko/CoinCap API，未整合後端

### ⚠️ 後端（僅有骨架）
- Spring Boot 基礎架構完成
- Entity（4 個）、Exception（6 個）、Config（CORS）已建立
- **尚未實作**：Controller / Service / Repository / JWT / Security

### ⚠️ 資料庫（未啟動）
- Schema v1.0（schema.sql）：4 個基礎表
- Schema v3.0（schema_v3.sql）：新增 preferred_language、user_activities 等
- **尚未執行**：MySQL 資料庫未初始化

---

## 重要檔案結構

```
CryptoDashboard/
  frontend/                      # Vue 3 前端專案
    src/
      stores/                    # Pinia 狀態管理
        useCoinsStore.js         # 幣種資料快取
        useLocaleStore.js        # 語系管理
        useMarketFilterStore.js  # 市場篩選狀態
      utils/                     # 工具函數
        coingeckoApi.js          # CoinGecko API（主要）
        coincapApi.js            # CoinCap API（備援）
        mockAuth.js              # 模擬登入（待移除）
        format.js                # 格式化工具
        favorite.js              # 收藏管理（localStorage）
        api.js                   # HTTP 請求工具
      i18n/                      # 國際化設定
        index.js                 # vue-i18n 設定檔
      locales/                   # 多語系文案
        zh-TW.json               # 繁體中文
        en-US.json               # 英文
      views/                     # 頁面元件
        DashboardView.vue        # 儀表板
        MarketListView.vue       # 市場總覽（含進階篩選、分頁）
        CoinDetailView.vue       # 幣種詳情
        WatchlistView.vue        # 收藏清單
        CompareView.vue          # 多幣比較
        LoginView.vue            # 登入頁面
        RegisterView.vue         # 註冊頁面
        AdminView.vue            # 管理後台（數據總覽、用戶管理、公告管理）
        ProfileView.vue          # 個人資料
      components/                # 共用元件
        CoinCard.vue             # 幣種卡片
        CoinTable.vue            # 幣種表格
        Sidebar.vue              # 側邊欄（含語系切換）
        Navbar.vue               # 導航列
        PriceChart.vue           # 價格圖表（Canvas）
        FavoriteButton.vue       # 收藏按鈕
        MainLayout.vue           # 主要 Layout
    package.json               # 依賴管理（v1.1.0）
    vite.config.js             # Vite 設定
    .env                       # 環境變數（API Keys）

  backend/                     # Spring Boot 後端專案
    src/main/
      java/com/crypto/dashboard/
        config/
          CorsConfig.java      # CORS 跨域設定
        entity/                # JPA 實體（4 個）
          User.java            # 使用者
          AuthToken.java       # 登入憑證
          CoinFavorite.java    # 收藏幣種
          Announcement.java    # 系統公告
        exception/             # 例外處理（6 個）
          CryptoDashboardException.java
          GlobalExceptionHandler.java
          InvalidCredentialsException.java
          ResourceNotFoundException.java
          UnauthorizedException.java
          ValidationException.java
        dto/response/
          ApiResponse.java     # 統一回應格式
        CryptoDashboardApplication.java  # 主程式
      resources/
        application.yml        # 主要設定
        application-dev.yml    # 開發環境設定
        application-prod.yml   # 正式環境設定
    pom.xml                    # Maven 依賴（v1.0.0）
    README.md

  database/                    # 資料庫 Schema
    schema.sql                 # v1.0（4 個基礎表）
    schema_zh.sql              # v1.0（中文對照版）
    schema_v3.sql              # v3.0（新增 7 個表）

  docs/                        # 專案文檔
    README.md                  # 文檔索引
    功能對照表.md              # 功能實作狀態
    功能需求分析_v2.md         # 需求分析報告
    專案結構規劃.md            # 架構說明
    後端規劃.md                # 後端 API 設計
```


---

## 環境變數

```env
VITE_COINGECKO_API_KEY=CG-vczvnvBTsqG7Z8EVB7KRb3ii
```

---

## 測試帳號

| 角色 | Email | 密碼 |
|------|-------|------|
| 一般用戶 | demo@example.com | password |
| 管理員 | admin@example.com | admin123 |

---

## 資料庫設計狀態

### Schema v1.0（已完成 SQL 檔）
**檔案**：`database/schema.sql`、`database/schema_zh.sql`（中文對照版）

**4 個基礎表**：
- `users` - 使用者表
- `auth_tokens` - 登入憑證表
- `coin_favorites` - 收藏幣種表
- `announcements` - 系統公告表

### Schema v3.0（已完成 SQL 檔）
**檔案**：`database/schema_v3.sql`

**新增功能**：
- `users` 表新增 `preferred_language` 欄位（語系偏好）
- `user_activities` 表（用戶活動記錄）
- `market_filter_presets` 表（市場篩選預設）
- `coin_price_alerts` 表（價格提醒）
- `coin_comparisons` 表（幣種比較歷史）

**狀態**：✅ SQL 檔已建立，⚠️ 尚未在 MySQL 執行

---

## 開發歷史（近期重點）

### 2024-11-27
- ✅ **品牌更新**：CryptoDashboard → CoinVue（幣景）
- ✅ **完整 i18n 實作**：vue-i18n 全頁面多語系支援（中英文）
- ✅ **權限分離優化**：管理者/一般用戶選單分離
- ✅ **進階篩選功能**：Market 篩選面板 + Pinia Store 管理
- ✅ **資料庫 Schema v3.0**：新增語系、活動記錄、篩選預設、價格提醒等表

### 2024-11-26
- ✅ **API 呼叫優化**：逾時重試 + 自動切換備援 API
- ✅ **Pinia 快取系統**：`useCoinsStore` 減少重複請求

### 2024-11-25
- ✅ **專案結構重構**：移除巢狀資料夾，採用標準 Monorepo 結構
- ✅ **分頁功能**：Market Overview 完整分頁導航（100 頁 / 5,000 幣種）
- ✅ **UI 優化**：Dashboard 背景動畫、統一框線樣式
- ✅ **Canvas 圖表**：PriceChart 智能小數位數計算

### 2024-11-24
- ✅ **資料庫 Schema v1.0**：建立 4 個基礎表 + 完整中文化版本
- ✅ **文檔整理**：更新所有 README、清理 .gitignore

### 2024-11-23
- ✅ **程式碼清理**：刪除 17 個冗餘檔案、精簡 152 行程式碼
- ✅ **錯誤處理規範**：建立前後端 Exception 對照表

### 2024-11-20
- ✅ **專案初始化**：建立 Vue 3 前端 + Spring Boot 後端架構
- ✅ **雙 API 架構**：CoinGecko（主）+ CoinCap（備援）
- ✅ **Admin Panel**：數據總覽、用戶管理、公告管理三大模塊

---

## 待辦事項（開發路線圖）

### Phase 1: 後端基礎建設（高優先）
- [ ] **MySQL 資料庫初始化**
  - 執行 `schema.sql` 或 `schema_v3.sql`
  - 確認資料庫連線正常
  - 測試 Spring Boot 啟動

- [ ] **Repository 層**
  - UserRepository（Spring Data JPA）
  - AuthTokenRepository
  - CoinFavoriteRepository
  - AnnouncementRepository

- [ ] **JWT 認證系統**
  - JwtTokenProvider 工具類
  - SecurityConfig（Spring Security）
  - AuthService（註冊/登入/登出邏輯）
  - AuthController（`/api/auth/*`）

### Phase 2: 前後端整合（高優先）
- [ ] **API Proxy 實作**
  - CoinGecko Proxy（`/api/coins/*`）
  - 快取機制（減少外部 API 請求）
  - 錯誤處理與重試邏輯
  - 前端改呼叫自家後端 API

- [ ] **收藏功能 API**
  - FavoriteService + Controller
  - 取代前端 localStorage
  - 移除 `favorite.js` 工具

- [ ] **認證整合**
  - 前端移除 `mockAuth.js`
  - 整合真實 JWT 登入/註冊
  - Protected Routes 實作

### Phase 3: 進階功能（中優先）
- [ ] **公告系統 API**
  - AnnouncementService + Controller
  - Admin Panel 整合

- [ ] **用戶活動記錄**
  - UserActivityService
  - 統計分析 API

- [ ] **價格提醒功能**
  - PriceAlertService
  - WebSocket 推播（選用）

### Phase 4: 優化與部署（低優先）
- [ ] 密碼重設/忘記密碼流程
- [ ] 效能優化（前後端快取、CDN）
- [ ] 部署設定（Docker、CI/CD）
- [ ] 監控與日誌系統

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
6. **提交新幣種**：已從用戶端移除，規劃於 Future Work 中重新評估

---

## 常用指令

```bash
# 啟動開發伺服器
cd frontend && npm run dev

# 建立資料庫
mysql -u root -p < database/schema.sql
```

---

---

## 錯誤處理規範（Java 後端 Exception 設計參考）

### Exception 階層結構

```java
CryptoDashboardException (基礎 Exception)
├── AuthenticationException
│   ├── InvalidCredentialsException
│   └── UnauthorizedException
├── ValidationException
│   ├── RequiredFieldException
│   ├── PasswordMismatchException
│   └── PasswordTooShortException
├── ApiException
│   ├── HttpException
│   ├── RateLimitException (429)
│   ├── NotFoundException (404)
│   ├── UnauthorizedException (401)
│   └── ExternalApiException
│       ├── CoinGeckoApiException
│       └── CoinCapApiException
├── DataException
│   ├── DataFetchException
│   ├── DataUnavailableException
│   ├── DataParseException
│   └── ChartDataException
└── StorageException
    ├── LocalStorageReadException
    └── LocalStorageWriteException
```

### 前端錯誤訊息對照表

| 前端錯誤訊息 | 建議 Java Exception | 位置 |
|------------|-------------------|------|
| `"Invalid email or password"` | `InvalidCredentialsException` | `mockAuth.js:54` |
| `"Please fill in all fields"` | `RequiredFieldException` | `LoginView.vue:17`, `RegisterView.vue:19` |
| `"Passwords do not match"` | `PasswordMismatchException` | `RegisterView.vue:24` |
| `"Password must be at least 6 characters"` | `PasswordTooShortException` | `RegisterView.vue:29` |
| `"Rate limit exceeded..."` | `RateLimitException` | `coingeckoApi.js:33` |
| `"HTTP error! status: ${status}"` | `HttpException` | `api.js:35` |
| `"Failed to load data from all sources"` | `DataUnavailableException` | `MarketListView.vue:30` |
| `"CoinGecko API error: ${status}"` | `CoinGeckoApiException` | `coingeckoApi.js:37` |
| `"CoinCap API error: ${status}"` | `CoinCapApiException` | `coincapApi.js:23` |

### 錯誤處理位置清單

**認證相關 (2 個)**
- `src/views/LoginView.vue:17` - 登入欄位驗證
- `src/utils/mockAuth.js:54` - 登入憑證錯誤

**表單驗證 (4 個)**
- `src/views/RegisterView.vue:19` - 必填欄位檢查
- `src/views/RegisterView.vue:24` - 密碼匹配檢查
- `src/views/RegisterView.vue:29` - 密碼長度檢查
- `src/views/LoginView.vue:17` - 登入欄位檢查

**API 錯誤 (4 個)**
- `src/utils/api.js:35` - HTTP 通用錯誤
- `src/utils/coingeckoApi.js:33` - 速率限制
- `src/utils/coingeckoApi.js:37` - CoinGecko API 錯誤
- `src/utils/coincapApi.js:23` - CoinCap API 錯誤

**Storage 錯誤 (4 個)**
- `src/utils/favorite.js:16` - 讀取收藏錯誤
- `src/utils/favorite.js:50` - 新增收藏錯誤
- `src/utils/favorite.js:77` - 移除收藏錯誤
- `src/utils/favorite.js:107` - 清空收藏錯誤

### 重要配置位置

- **版本號**：`src/components/Sidebar.vue:70` - `"1.0.0"`
- **登入錯誤訊息**：`src/utils/mockAuth.js:54` - `"Invalid email or password"`

---

## 專案特色

1. **雙 API 架構**：CoinGecko（主）+ CoinCap（備援），確保服務穩定性
2. **智能價格顯示**：自動識別幣種特性調整小數位數（穩定幣、極小價格幣、高價幣）
3. **完整管理後台**：數據總覽、用戶管理、公告系統三大模塊
4. **響應式設計**：桌面、平板、手機全適配
5. **模擬認證系統**：完整的前端登入流程，待接入後端 API

---

## 後端架構（Spring Boot）

### 技術棧
- **框架**：Spring Boot 3.2.0
- **Java 版本**：17
- **資料庫**：MySQL 8.0 + JPA/Hibernate
- **安全**：Spring Security + JWT (jjwt 0.11.5)
- **建置工具**：Maven

### 專案結構
```
backend/src/main/java/com/crypto/dashboard/
├── CryptoDashboardApplication.java  # 主程式入口
├── config/
│   └── CorsConfig.java              # CORS 跨域設定
├── entity/                          # 資料庫實體類別（4 個）
│   ├── User.java
│   ├── AuthToken.java
│   ├── CoinFavorite.java
│   └── Announcement.java
├── exception/                       # 例外處理（6 個）
│   ├── CryptoDashboardException.java
│   ├── GlobalExceptionHandler.java
│   ├── InvalidCredentialsException.java
│   ├── ResourceNotFoundException.java
│   ├── UnauthorizedException.java
│   └── ValidationException.java
└── dto/response/
    └── ApiResponse.java             # 統一回應格式
```

### 資料庫配置
- **連線**：`localhost:3306/crypto_dashboard`
- **字元編碼**：UTF-8
- **時區**：Asia/Taipei
- **Hibernate DDL**：validate（不自動修改表結構，使用 schema.sql）

### 待實作（詳見「待辦事項」）
- Repository 層（Spring Data JPA）
- Service 層（業務邏輯）
- Controller 層（REST API）
- JWT Token 工具類
- Spring Security 配置

---

## 前後端整合規劃

### API 設計概要
- **Coin API**：`GET /api/coins?page={page}&perPage={perPage}`
- **Auth API**：`POST /api/auth/register`, `POST /api/auth/login`
- **Favorite API**：`GET/POST/DELETE /api/favorites`
- **Announcement API**：`GET/POST/PUT/DELETE /api/announcements`

### 錯誤處理分工
- **前端驗證**：UI 輸入驗證（已完成）
- **後端驗證**：業務邏輯驗證（待實作）
- **Exception 層級**：已設計完整階層結構

詳細規劃請參考：`docs/後端規劃.md`

---

*最後更新：2024-11-27*