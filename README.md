# CoinVue（幣景）

> **洞察幣圈前景的視野** - 專業的加密貨幣市場監控平台

**CoinVue** 是一個現代化的加密貨幣儀表板應用，結合 Vue 3 技術棧與即時市場數據，提供直觀流暢的用戶體驗。支援中英文雙語切換，打造專業的加密貨幣市場分析工具。

**前端版本：** v1.2.0（100% 完成 🎉）| **後端版本：** v1.2.0（生產就緒）| **最後更新：** 2025-12-11

---

## 功能特色

### 核心功能
- **即時價格追蹤** - 雙 API 架構（CoinGecko + CoinCap 自動切換）
- **市場總覽** - 5000+ 幣種分頁瀏覽 + 進階篩選（價格/市值/交易量/漲跌幅）
- **幣種比較** - 同時比較最多 4 個幣種的價格走勢與數據指標
- **收藏清單** - 建立個人 Watchlist 追蹤喜愛的幣種
- **幣種詳情** - Canvas 手繪價格圖表 + 智能小數位數顯示
- **多語系支援** - 完整的中英文雙語即時切換（zh-TW / en-US）

### 用戶系統
- **認證授權** - JWT 登入/註冊 + 角色權限分離（一般用戶/管理員）
- **個人資料** - Gravatar 大頭貼整合

### 管理後台 ✨ (v1.2.0 新增)
- **數據總覽** - 總用戶數、活躍用戶數、總收藏數、最多收藏幣種排行
- **用戶管理** - 用戶列表（含收藏數統計）
- **公告管理** - 建立/編輯/刪除系統公告，支援三種類型（資訊/成功/警告）
- **公告系統** - 用戶端 Dashboard 即時顯示啟用的系統公告

### API 文檔與測試 ✨ (v1.2.0 後端新增)
- **Swagger UI** - 互動式 API 文檔，無需 Postman 即可測試所有 API
- **自動生成文檔** - 與程式碼同步，自動更新 API 說明
- **JWT 認證整合** - 支援 Bearer Token 認證測試
- **即時測試** - 直接在網頁上測試 API 請求和回應
- **訪問路徑**：http://localhost:8080/swagger-ui/index.html

---

## 技術棧

### 前端
- **Vue 3** - 漸進式 JavaScript 框架
- **Vite** - 下一代前端建構工具
- **Pinia** - Vue 狀態管理
- **Vue Router** - 官方路由管理

### 後端
- **Spring Boot 3.2** - Java 企業級框架
- **Spring Security** - JWT 認證授權
- **Spring Data JPA** - Hibernate ORM
- **SpringDoc OpenAPI** - Swagger API 文檔自動化
- **HikariCP** - 高效能資料庫連接池
- **Caffeine Cache** - 本地快取（CoinGecko API）
- **Maven** - 專案管理工具

### API 數據源
- **CoinGecko API** - 主要數據來源（30 次/分鐘）
- **CoinCap API** - 備援數據來源（200 次/分鐘）

### 資料庫
- **MySQL 8** - 關聯式資料庫

---

## 快速開始

### ⚠️ 環境配置說明

**重要提醒**：
- ✅ 本專案已從 Git 移除所有包含敏感資訊的配置檔
- ⚠️ Clone 後需自行建立配置檔（請參考 `application.yml.example`）
- 🔒 **切勿**將實際的配置檔（`application.yml`）提交到 Git

**首次設定需要**：
1. 複製 `backend/src/main/resources/application.yml.example` 為 `application.yml`
2. 填入你的 MySQL 密碼
3. 設定 JWT Secret（建議使用 `openssl rand -base64 64` 生成強密鑰）
4. 填入 CoinGecko API Key（可選，有預設值）

---

### 環境需求

- **前端**: Node.js 18+, npm 或 yarn
- **後端**: JDK 17+, Maven 3.8+
- **資料庫**: MySQL 8.0+

### 安裝步驟

1. **Clone 專案**
   ```bash
   git clone https://github.com/ShihChen0301/CryptoDashboard.git
   cd CryptoDashboard
   ```

2. **安裝前端依賴**
   ```bash
   cd frontend
   npm install
   ```

3. **設定環境變數**

   建立 `frontend/.env` 檔案：
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api
   VITE_COINGECKO_API_KEY=CG-vczvnvBTsqG7Z8EVB7KRb3ii
   ```

4. **設定資料庫**
   ```bash
   # 建立資料庫（使用 v3.0 完整版）
   mysql -u root -p < database/schema_v3.sql
   ```

5. **設定後端配置檔**

   複製範本並填入你的設定：
   ```bash
   cd backend/src/main/resources
   cp application.yml.example application.yml
   ```

   編輯 `application.yml`，修改以下設定：
   ```yaml
   spring:
     datasource:
       password: your_mysql_password  # 改成你的 MySQL 密碼

   jwt:
     secret: your_strong_jwt_secret   # 改成強密鑰（建議 64 字元以上）

   coingecko:
     api:
       key: your_api_key              # 填入你的 CoinGecko API Key
   ```

6. **啟動後端**
   ```bash
   cd backend

   # 方法 A: 使用 Maven（需先安裝 Maven）
   mvn spring-boot:run

   # 方法 B: 使用 Chocolatey 快速安裝 Maven
   choco install maven -y
   mvn spring-boot:run

   # 方法 C: 使用 Eclipse IDE
   # 右鍵 CryptoDashboardApplication.java → Run As → Java Application
   ```

   後端 API 位址：`http://localhost:8080/api`

7. **啟動前端開發伺服器**
   ```bash
   cd frontend
   npm run dev
   ```

8. **開啟瀏覽器並註冊新帳號**
   ```
   http://localhost:5173
   ```

   **註冊新帳號**：
   - 訪問 http://localhost:5173/register 註冊新帳號
   - 註冊後會自動獲得 `user` 角色
   - 如需 `admin` 權限，請在資料庫執行：
     ```sql
     UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
     ```

---

## 專案結構

```
CryptoDashboard/
├── frontend/                         # 前端 Vue 3 應用
│   ├── src/
│   │   ├── components/               # 共用元件
│   │   ├── views/                    # 頁面元件
│   │   ├── utils/                    # 工具函數與 API
│   │   ├── router/                   # 路由設定
│   │   ├── stores/                   # Pinia 狀態管理
│   │   └── assets/                   # 靜態資源
│   ├── .env                          # 環境變數
│   └── package.json
├── backend/                          # 後端 Spring Boot 應用
│   ├── src/main/java/com/crypto/dashboard/
│   │   ├── entity/                   # 實體類（User, AuthToken, CoinFavorite, Announcement）
│   │   ├── repository/               # 資料存取層
│   │   ├── service/                  # 業務邏輯層
│   │   ├── controller/               # API 控制器
│   │   ├── config/                   # 配置類
│   │   ├── exception/                # 例外處理
│   │   └── dto/                      # 資料傳輸物件
│   ├── src/main/resources/
│   │   └── application.yml           # Spring Boot 配置
│   └── pom.xml                       # Maven 配置
├── database/
│   └── schema_v3.sql                 # MySQL v3.0 完整結構
├── docs/                             # 專案文檔
│   ├── README.md                     # 文檔導覽
│   ├── 後端架構說明.md                # 三層架構、JPA、連接池詳解
│   ├── 功能對照表.md                  # v2.0 功能規劃（未來參考）
│   └── 功能需求分析_v2.md             # v2.0 需求分析（未來參考）
├── CLAUDE.md                         # 專案記憶與歷史決策
└── README.md
```

---

## 資料庫結構

### v1.0 基礎版（4 個表）

| 表格 | 說明 |
|------|------|
| `users` | 使用者帳號（包含角色、權限、個人資料） |
| `auth_tokens` | 登入憑證（JWT Token 管理） |
| `coin_favorites` | 收藏幣種（Watchlist 功能） |
| `announcements` | 系統公告（管理員發布） |

### v3.0 完整版（新增 5 個表）

- `users.preferred_language` - 使用者語系偏好
- `user_activities` - 用戶活動記錄
- `market_filter_presets` - 市場篩選預設
- `coin_price_alerts` - 價格提醒
- `coin_comparisons` - 幣種比較歷史

詳細結構請參考：`database/schema_v3.sql`

---

## API 架構

### 主要 API（CoinGecko）
- 幣種列表
- 幣種詳情
- 歷史價格圖表
- 全球市場數據

### 備援 API（CoinCap）
當 CoinGecko API 達到速率限制時，自動切換至 CoinCap API。

---

## 📚 詳細文檔

想深入了解專案架構和技術細節？請參考：

- **[後端架構說明](docs/後端架構說明.md)** - 深入解析三層架構、JPA、HikariCP 連接池、Swagger 整合
- **[專案記憶 (CLAUDE.md)](CLAUDE.md)** - 完整的開發歷史、技術決策、版本演進記錄
- **[功能規劃](docs/功能對照表.md)** - v2.0 未來功能規劃參考
- **[API 測試 (Swagger UI)](http://localhost:8080/swagger-ui/index.html)** - 互動式 API 文檔（需先啟動後端）

---

## 頁面說明

| 路由 | 頁面 | 說明 |
|------|------|------|
| `/` | Dashboard | 首頁儀表板 |
| `/market` | Market | 市場總覽 |
| `/coin/:id` | Coin Detail | 幣種詳情 |
| `/compare` | Compare | 幣種比較 |
| `/watchlist` | Watchlist | 收藏清單 |
| `/profile` | Profile | 個人資料 |
| `/admin` | Admin | 管理後台（需管理員權限） |

---

## 開發指令

```bash
# 啟動開發伺服器
npm run dev

# 建構生產版本
npm run build

# 預覽生產版本
npm run preview

# 程式碼檢查
npm run lint
```

---

## 聯絡方式

- GitHub: [@ShihChen0301](https://github.com/ShihChen0301)
