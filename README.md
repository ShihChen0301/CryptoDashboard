# CoinVue（幣景）

> **洞察幣圈前景的視野** - 專業的加密貨幣市場監控平台

**CoinVue** 是一個現代化的加密貨幣儀表板應用，結合 Vue 3 技術棧與即時市場數據，提供直觀流暢的用戶體驗。支援中英文雙語切換，打造專業的加密貨幣市場分析工具。

**前端版本：** v1.3.0（100% 完成 🎉）| **後端版本：** v1.3.0（生產就緒）| **最後更新：** 2026-04-23

---

## 功能特色

### 核心功能
- **即時價格追蹤** - 雙 API 架構（CoinGecko + CoinCap 自動切換備援）
- **市場總覽** - 5000+ 幣種分頁瀏覽 + 進階篩選（價格/市值/交易量/漲跌幅）
- **幣種比較** - 同時比較最多 4 個幣種的價格走勢與數據指標
- **收藏清單** - 建立個人 Watchlist 追蹤喜愛的幣種
- **幣種詳情** - 高性能價格圖表 + 智能小數位數顯示
- **多語系支援** - 完整的中英文雙語即時切換（zh-TW / en-US）

### 用戶系統
- **認證授權** - JWT 登入/註冊 + 角色權限分離（一般用戶/管理員）
- **個人資料** - Gravatar 大頭貼整合與用戶偏好設定

### 管理後台 ✨
- **數據總覽** - 總用戶數、活躍用戶數、總收藏數、最多收藏幣種排行
- **用戶管理** - 用戶列表（含詳細資訊與收藏數統計）
- **公告管理** - 建立/編輯/刪除系統公告，支援三種類型（資訊/成功/警告）
- **公告系統** - 用戶端 Dashboard 即時顯示啟用的系統公告

### API 文檔與測試 ✨
- **Swagger UI** - 互動式 API 文檔，可直接測試所有 API 端點
- **自動生成文檔** - 與程式碼同步，確保 API 說明始終最新
- **JWT 認證整合** - 支援在 Swagger UI 中使用 Bearer Token 測試受保護的 API
- **訪問路徑**：`http://localhost:8080/swagger-ui/index.html`

---

## 技術棧

### 前端
- **Vue 3** - 漸進式 JavaScript 框架
- **Vite** - 下一代前端建構工具
- **Pinia** - Vue 狀態管理
- **Vue Router** - 官方路由管理
- **Vue I18n** - 國際化方案
- **Tailwind CSS** - 現代化 CSS 框架（輔助樣式）
- **Chart.js** - 圖表繪製

### 後端
- **Spring Boot 3.2** - Java 企業級框架
- **Spring Security** - JWT 認證授權與安全性管理
- **Spring Data JPA** - Hibernate ORM 數據持久化
- **SpringDoc OpenAPI** - Swagger API 文檔自動化
- **MySQL 8.0** - 高性能關聯式資料庫
- **HikariCP** - 數據庫連接池優化
- **Caffeine Cache** - 本地二級快取優化 API 調用

### API 數據源
- **CoinGecko API** - 主要數據來源（高性能、數據詳盡）
- **CoinCap API** - 備援數據來源（確保服務高可用性）

---

## 專案結構

```
CryptoDashboard/
├── frontend/                         # 前端 Vue 3 應用
│   ├── src/
│   │   ├── components/               # 共用 UI 元件
│   │   ├── views/                    # 頁面級元件
│   │   ├── utils/                    # API 封裝、格式化工具、備援邏輯
│   │   ├── stores/                   # Pinia 狀態模組
│   │   ├── i18n/                     # 多國語言配置
│   │   └── styles/                   # 全域樣式與變數
│   ├── .env                          # 前端環境變數
│   └── package.json
├── backend/                          # 後端 Spring Boot 應用
│   ├── src/main/java/com/crypto/dashboard/
│   │   ├── controller/               # API 控制層
│   │   ├── service/                  # 業務邏輯層
│   │   ├── repository/               # 數據訪問層
│   │   ├── entity/                   # 資料庫實體類
│   │   ├── dto/                      # 資料傳輸對象
│   │   ├── config/                   # 系統配置（Security, Swagger, Cache）
│   │   ├── filter/                   # JWT 安全過濾器
│   │   └── exception/                # 全域例外處理
│   ├── src/main/resources/
│   │   └── application.yml           # Spring Boot 主要配置
│   └── pom.xml                       # Maven 依賴管理
├── database/
│   └── schema_v3.sql                 # MySQL v3.0 資料庫結構
├── docs/                             # 完整的技術文件與開發文檔
└── README.md
```

---

## 資料庫結構

專案使用 MySQL 8.0，核心資料表包括：
- `users` - 用戶帳號、角色、權限、偏好設定
- `auth_tokens` - JWT 認證憑證管理
- `coin_favorites` - 用戶自定義收藏清單
- `announcements` - 管理員發布的系統公告

詳細結構與索引優化請參考：`database/schema_v3.sql`

---

## 📚 API 文檔

- **[Swagger UI](http://localhost:8080/swagger-ui/index.html)** - 互動式 API 文檔與測試介面

---

## 頁面說明

| 路由 | 頁面 | 說明 |
|------|------|------|
| `/` | Dashboard | 首頁儀表板，顯示市場趨勢與系統公告 |
| `/market` | Market | 市場總覽，支援搜尋與進階篩選 |
| `/coin/:id` | Coin Detail | 幣種詳情，包含歷史價格走勢圖 |
| `/compare` | Compare | 幣種比較，可選 2-4 個幣種對比數據 |
| `/watchlist` | Watchlist | 個人收藏清單（需登入） |
| `/profile` | Profile | 個人資料管理與偏好設定 |
| `/admin` | Admin | 管理後台，數據統計與公告管理（管理員限定） |

---

## 聯絡方式

- GitHub: [@ShihChen0301](https://github.com/ShihChen0301)
