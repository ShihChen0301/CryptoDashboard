# CryptoDashboard

一個現代化的加密貨幣儀表板應用，提供即時價格追蹤、市場數據分析、收藏管理等功能。

---

## 功能特色

- **即時價格追蹤** - 從 CoinGecko API 獲取最新加密貨幣價格
- **市場總覽** - 查看市值、交易量、漲跌幅等市場數據
- **幣種比較** - 同時比較多個幣種的價格走勢
- **收藏清單** - 建立個人的 Watchlist 追蹤喜愛的幣種
- **幣種詳情** - 查看單一幣種的詳細資訊與歷史圖表
- **用戶認證** - 登入/註冊系統（支援一般用戶與管理員）
- **管理後台** - 管理員專用的審核功能

---

## 技術棧

### 前端
- **Vue 3** - 漸進式 JavaScript 框架
- **Vite** - 下一代前端建構工具
- **Pinia** - Vue 狀態管理
- **Vue Router** - 官方路由管理

### API 數據源
- **CoinGecko API** - 主要數據來源（30 次/分鐘）
- **CoinCap API** - 備援數據來源（200 次/分鐘）

### 資料庫
- **MySQL 8** - 關聯式資料庫

---

## 快速開始

### 環境需求

- Node.js 18+
- npm 或 yarn
- MySQL 8.0+

### 安裝步驟

1. **Clone 專案**
   ```bash
   git clone https://github.com/ShihChen0301/CryptoDashboard.git
   cd CryptoDashboard
   ```

2. **安裝前端依賴**
   ```bash
   cd 前端/CryptoDashboard
   npm install
   ```

3. **設定環境變數**

   建立 `.env` 檔案：
   ```env
   VITE_COINGECKO_API_KEY=your_api_key_here
   ```

   > 可在 [CoinGecko API](https://www.coingecko.com/en/api) 免費申請 API Key

4. **設定資料庫**
   ```bash
   mysql -u root -p < database/schema.sql
   ```

5. **啟動開發伺服器**
   ```bash
   npm run dev
   ```

6. **開啟瀏覽器**
   ```
   http://localhost:5173
   ```

---

## 專案結構

```
CryptoDashboard/
├── 前端/CryptoDashboard/
│   ├── src/
│   │   ├── components/      # 共用元件
│   │   ├── views/           # 頁面元件
│   │   ├── utils/           # 工具函數與 API
│   │   ├── router/          # 路由設定
│   │   ├── stores/          # Pinia 狀態管理
│   │   └── assets/          # 靜態資源
│   ├── .env                 # 環境變數
│   └── package.json
├── database/
│   └── schema.sql           # MySQL 資料庫結構
└── README.md
```

---

## 資料庫結構

| 表格 | 說明 |
|------|------|
| `users` | 使用者帳號 |
| `auth_tokens` | 登入 token |
| `coin_favorites` | 收藏幣種 |
| `coin_submissions` | 提交新幣種 |

詳細結構請參考 `database/schema.sql`

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

## 貢獻指南

1. Fork 此專案
2. 建立功能分支 (`git checkout -b feature/AmazingFeature`)
3. Commit 變更 (`git commit -m '新增某功能'`)
4. Push 到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

---

## 聯絡方式

- GitHub: [@ShihChen0301](https://github.com/ShihChen0301)
