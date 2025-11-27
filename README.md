# CoinVue（幣景）

> **洞察幣圈前景的視野** - 專業的加密貨幣市場監控平台

**CoinVue** 是一個現代化的加密貨幣儀表板應用，結合 Vue 3 技術棧與即時市場數據，提供直觀流暢的用戶體驗。支援中英文雙語切換，打造專業的加密貨幣市場分析工具。

**前端版本：** v1.1.0 | **後端版本：** v1.0.0 | **命名日期：** 2024-11-27

---

## 功能特色

- **即時價格追蹤** - 雙 API 架構（CoinGecko + CoinCap 自動切換）
- **市場總覽** - 5000+ 幣種分頁瀏覽 + 進階篩選（價格/市值/交易量/漲跌幅）
- **幣種比較** - 同時比較最多 4 個幣種的價格走勢與數據指標
- **收藏清單** - 建立個人 Watchlist 追蹤喜愛的幣種
- **幣種詳情** - Canvas 手繪價格圖表 + 智能小數位數顯示
- **用戶認證** - 登入/註冊系統 + 權限分離（一般用戶/管理員）
- **管理後台** - 數據總覽、用戶管理、公告管理三大模塊
- **多語系支援** - 完整的中英文雙語即時切換（zh-TW / en-US）

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
- **Maven** - 專案管理工具

### API 數據源
- **CoinGecko API** - 主要數據來源（30 次/分鐘）
- **CoinCap API** - 備援數據來源（200 次/分鐘）

### 資料庫
- **MySQL 8** - 關聯式資料庫

---

## 快速開始

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

3. **設定環境變數**（暫時不需要）

   > ⚠️ **重要**: CoinGecko Demo API Key 不支援瀏覽器 CORS，目前已暫時停用。
   >
   > 前端 API 請求必須透過後端 proxy（Phase 1 開發中）

4. **設定資料庫**
   ```bash
   # 使用 v3.0 完整版 Schema（包含語系、活動記錄等新表）
   mysql -u root -p < database/schema_v3.sql

   # 或使用 v1.0 基礎版 Schema（僅 4 個核心表）
   # mysql -u root -p < database/schema.sql
   ```

5. **配置後端資料庫連線**

   編輯 `backend/src/main/resources/application.yml`，修改資料庫密碼：
   ```yaml
   spring:
     datasource:
       password: your_mysql_password
   ```

6. **啟動後端**（⚠️ 開發中）
   ```bash
   cd backend
   mvn spring-boot:run
   ```

   後端 API 位址：`http://localhost:8080/api`

   > **注意**: 目前後端 API Proxy 尚未完成，前端無法取得幣種資料

7. **啟動前端開發伺服器**
   ```bash
   cd frontend
   npm run dev
   ```

8. **開啟瀏覽器**
   ```
   http://localhost:5173
   ```

   > **目前狀態**: 前端頁面可正常瀏覽，但無法載入幣種資料（等待後端 API Proxy 完成）

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
│   ├── schema_v3.sql                 # MySQL v3.0 完整結構（推薦）
│   └── schema_zh.sql                 # v1.0 中文版（含完整註解）
├── docs/                             # 專案文檔
│   ├── 後端規劃.md                    # 後端架構設計
│   ├── 專案結構規劃.md                # 資料夾組織方案
│   ├── 功能對照表.md                  # 功能實作狀態（參考）
│   └── 功能需求分析_v2.md             # 需求分析報告（參考）
├── CLAUDE.md                         # 專案記憶與歷史決策
├── 新電腦設置指南.md                  # 開發環境完整設定
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

詳細結構請參考：
- `database/schema_v3.sql` - v3.0 完整結構（推薦）
- `database/schema_zh.sql` - v1.0 中文版（含完整註解）

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
