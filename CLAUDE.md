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

### 2024-11-25（凌晨）
- ✅ **Dashboard 背景動畫實作**：
  - 實作三種背景動畫方案（藍色專業漸層、極簡灰階、粒子漂浮）
  - 採用提案 4：極簡灰階漸變（25 秒循環）
  - 顏色：`#f5f7fa` → `#c3cfe2` 緩慢流動
  - 使用 CSS keyframes 實作平滑動畫效果
- ✅ **背景填滿技術**：
  - 使用負 margin 技巧讓 Dashboard 背景填滿整個頁面
  - 保持其他頁面（Market Overview、CoinDetailView）不受影響
  - 公式：`margin: calc(-1 * var(--spacing-xl))` + `padding: calc(var(--spacing-xl) + 1rem)`
- ✅ **技術學習**：
  - 理解 CSS 變數（`var(--spacing-xl)`）在 Layout 系統中的應用
  - 學習使用負 margin 突破父容器限制
  - 掌握 @keyframes 動畫與 background-position 的配合
- ✅ **檔案修改**：
  - `DashboardView.vue`：新增背景動畫與獨立 padding 控制
  - `MainLayout.vue`：保持原有 padding 設定

### 2024-11-25（深夜）
- ✅ **UI 優化：統一框線樣式**：
  - 統一所有卡片/框框的邊框為 `2px solid #8e8f92`（灰色）
  - 修改檔案：DashboardView.vue, CoinDetailView.vue, CoinCard.vue
  - 影響區域：
    - Dashboard 首頁統計卡片（Total Market Cap 等）
    - Dashboard 首頁熱門幣種卡片（Hot Cryptocurrencies）
    - CoinDetailView 幣種資訊框（coin-header）
    - CoinDetailView 統計區塊框線（stats-section）
    - CoinDetailView 統計小卡片（stat-item）
- ✅ **內容優化**：
  - 刪除 CoinDetailView 的 About 區塊（每個幣種內容都一樣，無意義）
  - 精簡頁面結構，提升用戶體驗
- ✅ **Canvas 圖表技術學習**：
  - 理解 PriceChart.vue 使用 HTML5 Canvas API 手工繪製圖表
  - 了解 Canvas 繪圖流程：座標計算、漸層背景、折線繪製、互動式 Tooltip
  - 學習智能小數位數計算（適應穩定幣、極小價格幣）

### 2024-11-25（晚上）
- ✅ **Market Overview 分頁功能實作**：
  - 加入完整分頁導航（« First / ← Previous / Next → / Last »）
  - 實作頁碼輸入框（只允許阿拉伯數字，限制 1-100）
  - 加入「Go」按鈕與 Enter 鍵快捷跳轉
  - 實作頁碼驗證（無效頁碼會提示錯誤）
  - 切換頁面時自動滾動到頂部
  - 響應式設計（手機版適配）
  - 支援瀏覽 100 頁共 5,000 個加密貨幣
  - 搜尋時自動隱藏分頁按鈕
- ✅ **檔案位置**：`frontend/CryptoDashboard/src/views/MarketListView.vue`
- ✅ **前後端整合規劃文檔建立**：
  - 規劃分頁功能的前後端錯誤處理分工
  - 設計未來後端 API 規格（/api/coins）
  - 定義 Exception 階層（InvalidPageNumberException, PaginationException）
  - 規劃整合時程（Phase 1-4）

### 2024-11-25（下午）
- ✅ **功能需求分析與資料庫 Schema v2.0 設計**：
  - 分析 9 項新功能需求，評估現有資料庫支援度
  - 設計 3 個新表格：`coin_submissions`（幣種申請）、`coin_comparisons`（多幣比較）、`user_transactions`（交易記錄）
  - 建立完整的 Schema v2.0（英文版 + 中文版）
  - 產出詳細的功能需求分析報告（[docs/功能需求分析_v2.md](docs/功能需求分析_v2.md)）
  - 產出快速參考的功能對照表（[docs/功能對照表.md](docs/功能對照表.md)）
- ✅ **新功能清單**：
  1. 使用者自行新增幣種 + 管理員審核機制（高優先）
  2. 多幣比較功能（最多 4 個，中優先）
  3. 趨勢圖（買入最多的幣種，高優先）
  4. Price Chart 多時間區間（7天、30天、90天、180天、365天、全部）
  5. Market Overview 每欄可排序
  6. 幣種選項擴充（調整 API 參數）
- ✅ **檔案清單**：
  - `database/schema_v2.sql` - 升級版資料庫結構（英文版，實際部署用）
  - `database/schema_v2_zh.sql` - 升級版資料庫結構（中文版，學習對照用）
  - `docs/功能需求分析_v2.md` - 完整的功能需求分析報告
  - `docs/功能對照表.md` - 快速參考清單（含實作順序建議）

### 2024-11-24（晚上）
- ✅ **專案結構清理**：
  - 刪除廢棄的「前端/」資料夾（只剩 1 個 index.html）
  - 確認 frontend/CryptoDashboard/ 完整（5,198 個檔案）
  - 清理 untracked 檔案，working tree 保持乾淨
- ✅ **資料庫 Schema 修復與優化**：
  - 修復 schema_zh.sql 的外鍵約束 COMMENT 語法錯誤（MySQL 不支援外鍵 COMMENT）
  - 統一 schema.sql 和 schema_zh.sql 的欄位順序（status 欄位位置調整）
  - 移除 3 個非法的外鍵 COMMENT，改為註解形式
- ✅ **完全中文化 schema_zh.sql**：
  - 資料庫名稱分離：crypto_dashboard（英文版）vs crypto_dashboard_zh（中文版）
  - 表名稱中文化：users→使用者, auth_tokens→登入憑證, coin_favorites→收藏幣種, announcements→系統公告
  - 欄位名稱中文化：id→編號, username→使用者名稱, email→電子信箱, password_hash→密碼加密值 等
  - 索引/約束名稱中文化：uk_username→唯一鍵_使用者名稱, fk_xxx→外鍵_xxx 等
  - 技術詞彙口語化：token→憑證, hash→加密值, url→網址
  - ENUM 值保持英文：'user', 'admin', 'active' 等（避免程式碼問題）
  - 新增完整對照說明區塊，方便查閱英文/中文對照
- ✅ **用途說明**：
  - schema.sql（英文版）→ 實際部署使用，程式碼維護容易
  - schema_zh.sql（中文版）→ 學習對照參考，完全中文化便於理解

### 2024-11-24（凌晨）
- ✅ **全面專案檢查與優化**：
  - 檢查所有後端 Java 程式碼（13 個檔案）- Entity、Exception、Config 全部正常
  - 檢查所有前端 Vue/JS 程式碼（25 個檔案）- Views、Components、Utils 全部正常
  - 檢查資料庫 Schema 完整性（schema.sql 107 行、schema_zh.sql 209 行）
  - 檢查專案結構與文檔完整性（7 個 Markdown 檔案）
- ✅ **文檔更新與清理**：
  - 更新 README.md（根目錄）：修正前端路徑、更新資料庫表格清單（4 個表）
  - 更新 docs/README.md：修正所有路徑、新增 CLAUDE.md 參考
  - 清理 .gitignore：移除舊的「前端/CryptoDashboard/」路徑，保留新的「frontend/CryptoDashboard/」
- ✅ **品質確認**：
  - 確認 .env 檔案未被 Git 追蹤（安全性檢查）
  - 確認 Eclipse 專案檔案未被追蹤（.classpath, .project）
  - 確認所有文檔與實際專案結構完全一致
  - Working tree clean，所有修改已推送到 GitHub

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

## 前後端整合規劃（分頁功能）

### 1. 前端與後端的錯誤處理分工

#### **前端 UI 驗證**（已實作）
位置：`frontend/CryptoDashboard/src/views/MarketListView.vue:58-75`

```javascript
// 只允許輸入數字
const handlePageInput = (event) => {
  const value = event.target.value.replace(/[^0-9]/g, '')
  pageInput.value = value
}

// 頁碼驗證（1-100）
const goToPage = () => {
  const pageNum = parseInt(pageInput.value)

  if (isNaN(pageNum) || pageNum < 1 || pageNum > totalPages.value) {
    alert(`Please enter a valid page number between 1 and ${totalPages.value}`)
    return
  }

  currentPage.value = pageNum
}
```

**職責**：
- 防止使用者輸入非數字字元
- 驗證頁碼範圍（1-100）
- 提供即時 UI 反饋
- **不會傳送無效請求到後端**

---

#### **後端 DAO Exception**（待實作）

**新增 Exception 類別**：

```java
// InvalidPageNumberException.java
public class InvalidPageNumberException extends ValidationException {
    public InvalidPageNumberException(int page, int maxPage) {
        super(String.format("Invalid page number: %d. Must be between 1 and %d", page, maxPage));
    }
}

// PaginationException.java
public class PaginationException extends CryptoDashboardException {
    public PaginationException(String message) {
        super(message);
    }
}
```

**更新 Exception 階層結構**：

```java
CryptoDashboardException
├── ValidationException
│   ├── RequiredFieldException
│   ├── PasswordMismatchException
│   ├── PasswordTooShortException
│   └── InvalidPageNumberException        // 新增：無效頁碼
├── DataException
│   ├── DataFetchException
│   ├── DataUnavailableException
│   ├── DataParseException
│   ├── ChartDataException
│   └── PaginationException               // 新增：分頁錯誤
└── ApiException
    ├── CoinGeckoApiException
    └── DatabaseException
```

---

### 2. 未來後端 API 設計

#### **API Endpoint**
```
GET /api/coins?page={page}&perPage={perPage}&orderBy={orderBy}
```

#### **請求參數**
| 參數 | 類型 | 必填 | 說明 | 預設值 |
|------|------|------|------|--------|
| page | int | 否 | 頁碼（1-100） | 1 |
| perPage | int | 否 | 每頁數量（10-100） | 50 |
| orderBy | string | 否 | 排序方式 | market_cap_desc |

#### **回應格式**
```json
{
  "success": true,
  "data": {
    "coins": [...],
    "pagination": {
      "currentPage": 1,
      "perPage": 50,
      "totalPages": 100,
      "totalCoins": 5000
    }
  }
}
```

#### **錯誤回應**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_PAGE_NUMBER",
    "message": "Invalid page number: 150. Must be between 1 and 100",
    "timestamp": "2024-11-25T20:30:00Z"
  }
}
```

---

### 3. 後端實作架構（待開發）

#### **Controller 層**
```java
@RestController
@RequestMapping("/api/coins")
public class CoinController {

    @GetMapping
    public ResponseEntity<ApiResponse> getCoins(
        @RequestParam(defaultValue = "1") int page,
        @RequestParam(defaultValue = "50") int perPage,
        @RequestParam(defaultValue = "market_cap_desc") String orderBy
    ) {
        // 驗證 + 呼叫 Service
    }
}
```

#### **Service 層**
```java
@Service
public class CoinService {

    public PaginatedCoinsResponse getCoins(int page, int perPage, String orderBy) {
        // 1. 驗證頁碼
        if (page < 1 || page > 100) {
            throw new InvalidPageNumberException(page, 100);
        }

        // 2. 呼叫 DAO 或外部 API
        // 3. 處理資料
        // 4. 返回結果
    }
}
```

#### **DAO 層**
```java
public interface CoinDAO {
    List<Coin> getCoinsByPage(int page, int perPage, String orderBy)
        throws DataFetchException;

    int getTotalCoinsCount()
        throws DatabaseException;
}
```

---

### 4. 前後端整合時的修改點

**前端修改**（`MarketListView.vue:20-42`）：

```javascript
// 現在：直接呼叫 CoinGecko API
const coins = await getCoinsList('usd', perPage.value, page)

// 之後：改呼叫後端 API
const response = await fetch(`/api/coins?page=${page}&perPage=${perPage.value}`)
const data = await response.json()

if (!data.success) {
  throw new Error(data.error.message)
}

allCoins.value = data.data.coins
```

**錯誤處理對應**：

| 後端 Exception | HTTP Status | 前端顯示訊息 |
|---------------|-------------|-------------|
| InvalidPageNumberException | 400 | "Invalid page number" |
| DataFetchException | 500 | "Failed to load coin data" |
| CoinGeckoApiException | 503 | "External API unavailable" |
| DatabaseException | 500 | "Database connection error" |

---

### 5. 整合時程規劃

1. **Phase 1**：實作後端 Exception 類別
   - 建立 `InvalidPageNumberException`
   - 建立 `PaginationException`
   - 更新 `GlobalExceptionHandler`

2. **Phase 2**：實作後端 API
   - Controller: `/api/coins` endpoint
   - Service: 分頁邏輯 + 驗證
   - DAO: 資料庫查詢或外部 API 呼叫

3. **Phase 3**：前端整合
   - 修改 `MarketListView.vue` 的 `loadCoins` 函數
   - 調整錯誤處理邏輯
   - 測試前後端整合

4. **Phase 4**：測試與優化
   - 單元測試（後端）
   - 整合測試（前後端）
   - 效能優化（快取、分頁查詢優化）

---

*最後更新：2024-11-25*
