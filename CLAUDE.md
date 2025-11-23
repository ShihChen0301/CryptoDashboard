# CryptoDashboard 專案記憶

> 此檔案由 Claude Code 自動維護，用於保存專案上下文和歷史決策。

---

## 專案概述

加密貨幣儀表板應用，提供即時價格、市場數據、收藏功能等。

---

## 技術棧

### 前端
- **框架**：Vue 3 + Vite
- **狀態管理**：Pinia
- **路由**：Vue Router
- **樣式**：Scoped CSS

### API 數據源
- **主要**：CoinGecko API（有 API Key，30 次/分鐘）
- **備援**：CoinCap API（免費，200 次/分鐘）

### 資料庫
- **類型**：MySQL 8
- **狀態**：Schema 已設計，待連接後端

---

## 重要檔案結構

```
前端/CryptoDashboard/
├── src/
│   ├── utils/
│   │   ├── coingeckoApi.js   # 主要 API（含 API Key）
│   │   ├── coincapApi.js     # 備援 API
│   │   ├── mockAuth.js       # 模擬認證（待換成真實 API）
│   │   └── format.js         # 格式化工具（價格、數字）
│   ├── views/
│   │   ├── DashboardView.vue
│   │   ├── MarketListView.vue
│   │   ├── CoinDetailView.vue
│   │   ├── WatchlistView.vue
│   │   ├── CompareView.vue
│   │   ├── LoginView.vue
│   │   ├── RegisterView.vue
│   │   └── AdminView.vue
│   └── components/
│       ├── CoinCard.vue
│       ├── CoinTable.vue
│       └── Sidebar.vue
├── .env                      # 環境變數（API Keys）
└── database/
    └── schema.sql            # MySQL 資料庫結構
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

## 資料庫表格

1. **users** - 使用者帳號
2. **auth_tokens** - 登入 token
3. **coin_favorites** - 收藏幣種（Watchlist）
4. **announcements** - 系統公告（Admin Panel 使用）

詳見：
- `database/schema.sql` - 標準資料庫結構
- `database/schema_zh.sql` - 詳細中文版（含完整註解與說明）

---

## 開發歷史

### 2024-11-23（下午）
- ✅ **資料庫 Schema 優化**：
  - 完全移除 `coin_submissions` 表（功能已廢棄，保持資料庫精簡）
  - 建立 `schema_zh.sql` 詳細中文版（包含完整註解、使用說明、維護範例）
  - 確認前後端資料庫結構完全一致（4 個核心表）
  - 後端 Spring Boot 專案已成功匯入 Eclipse

### 2024-11-23（上午）
- ✅ **大規模程式碼清理與精簡**：
  - 刪除 17 個冗餘檔案（Vue 預設範例、未使用組件等）
  - 刪除 3 個空資料夾
  - 精簡程式碼約 152 行（移除未使用函數、測試函數等）
  - 修復 WatchlistView localStorage key 不一致問題
- ✅ **修復 Watchlist 即時更新 Bug**：
  - 新增 `favoritesChanged` 事件監聽
  - 確保新增收藏後 Watchlist 即時顯示
- ✅ **建立錯誤處理規範**：
  - 整理所有前端錯誤訊息（26 個）
  - 設計 Java 後端 Exception 階層結構
  - 建立前後端錯誤訊息對照表
  - 記錄所有錯誤處理位置（認證、驗證、API、Storage）

### 2024-11-20
- ✅ 修復 `formatPrice` 函數處理極小價格（如 SHIB 0.0000095）
- ✅ 統一格式化函數至 `format.js`
- ✅ 建立 CoinCap API 作為備援數據源
- ✅ 移除 `fakeData.js` 和 `finnhubApi.js`
- ✅ 建立 `mockAuth.js` 保留模擬登入
- ✅ 移除 Dashboard 的 Trending Buys 假數據功能
- ✅ 加入 CoinGecko API Key 支援
- ✅ 建立 MySQL 資料庫 Schema
- ✅ 修復 PriceChart 穩定幣顯示問題（動態計算小數位數）
- ✅ 新增 Navbar 點擊回到主頁功能
- ✅ 新增網站 Logo（favicon.jpg）
- ✅ **重構 Admin Panel**：
  - 移除用戶端「提交新幣種」功能（提高平台可信度）
  - 新增數據總覽（總用戶數、活躍用戶、收藏排行）
  - 新增用戶管理（查看用戶列表、活動記錄）
  - 新增公告管理（發布/編輯/刪除系統公告）

---

## 待辦事項

### 高優先
- [x] 建立後端 API（已採用 Spring Boot + Java）
- [ ] 連接 MySQL 資料庫
- [ ] 實作真實登入/註冊 API
- [ ] 將 `mockAuth.js` 替換為真實 API 呼叫
- [ ] 實作後端 Repository、Service、Controller 層

### 中優先
- [ ] 實作 Watchlist API（取代 localStorage）
- [ ] 加入 JWT token 驗證
- [ ] 實作公告系統 API（取代 localStorage）

### 低優先
- [ ] 密碼重設功能
- [ ] Email 驗證
- [ ] 用戶頭像上傳

### Future Work（規劃中但尚未實作）
- [ ] 用戶提交新幣種功能 - 允許用戶申請新幣種上架，經管理員審核後加入平台（目前為提高平台可信度暫不開放）

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
cd 前端/CryptoDashboard && npm run dev

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
- **安全**：Spring Security + JWT
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
├── exception/                       # 例外處理（5 個）
│   ├── CryptoDashboardException.java
│   ├── GlobalExceptionHandler.java
│   ├── InvalidCredentialsException.java
│   ├── ResourceNotFoundException.java
│   ├── UnauthorizedException.java
│   └── ValidationException.java
└── dto/
    └── response/
        └── ApiResponse.java         # 統一回應格式
```

### 資料庫配置
- **連線**：`localhost:3306/crypto_dashboard`
- **字元編碼**：UTF-8
- **時區**：Asia/Taipei
- **Hibernate DDL**：validate（不自動修改表結構，使用 schema.sql）

### 待實作
- [ ] Repository 層（Spring Data JPA）
- [ ] Service 層（業務邏輯）
- [ ] Controller 層（REST API）
- [ ] JWT Token 工具類
- [ ] Spring Security 配置

---

*最後更新：2024-11-23*
