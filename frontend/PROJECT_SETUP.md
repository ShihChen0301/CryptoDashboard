# CryptoDashboard - 專案說明

## 專案概述
這是一個使用 Vue 3 + Vite 建立的加密貨幣儀表板應用程式（TradingView 簡化版）。

## 技術棧
- **前端框架**: Vue 3 (Composition API with `<script setup>`)
- **建置工具**: Vite
- **路由**: Vue Router
- **狀態管理**: localStorage (用於收藏功能和使用者認證)
- **樣式**: CSS Scoped Styles

## 專案結構

```
CryptoDashboard/
├── src/
│   ├── assets/             # 靜態資源
│   │   └── main.css        # 全域樣式
│   ├── components/         # 共用元件
│   │   ├── CoinCard.vue    # 幣種卡片元件
│   │   ├── CoinTable.vue   # 幣種表格元件
│   │   ├── FavoriteButton.vue # 收藏按鈕元件
│   │   ├── MainLayout.vue  # 主要佈局元件
│   │   ├── Navbar.vue      # 導航列元件
│   │   ├── PriceChart.vue  # 價格圖表元件（使用 Canvas）
│   │   └── Sidebar.vue     # 側邊欄元件
│   ├── router/             # 路由設定
│   │   └── index.js        # 路由配置（含路由守衛）
│   ├── utils/              # 工具函式
│   │   └── fakeData.js     # 假資料和輔助函式
│   ├── views/              # 頁面元件
│   │   ├── LoginView.vue   # 登入頁
│   │   ├── RegisterView.vue # 註冊頁
│   │   ├── DashboardView.vue # 儀表板頁
│   │   ├── MarketListView.vue # 市場列表頁
│   │   ├── CoinDetailView.vue # 幣種詳細頁
│   │   ├── WatchlistView.vue # 收藏清單頁
│   │   └── ProfileView.vue # 個人資料頁
│   ├── App.vue             # 根元件
│   └── main.js             # 應用程式入口
├── package.json
└── vite.config.js
```

## 功能特色

### 1. 使用者認證
- **登入頁** (`/login`)
  - Email/密碼登入
  - 表單驗證
  - Demo 帳號: `demo@example.com` / `password`
- **註冊頁** (`/register`)
  - 完整註冊表單
  - 密碼確認驗證

### 2. 主要功能頁面

#### Dashboard (`/dashboard`)
- 市場統計概覽卡片
- 熱門加密貨幣展示
- 快速收藏功能

#### Market (`/market`)
- 完整幣種列表表格
- 即時搜尋功能
- 點擊查看詳細資訊

#### Coin Detail (`/coin/:id`)
- 幣種詳細資訊
- 30天價格走勢圖（Canvas 繪製）
- 市場統計數據
- 收藏功能

#### Watchlist (`/watchlist`)
- 已收藏的幣種列表
- localStorage 持久化儲存
- 一鍵清空功能

#### Profile (`/profile`)
- 使用者基本資訊
- 資料編輯功能
- 帳戶資訊顯示

### 3. 共用元件

- **MainLayout**: 包含 Sidebar + Navbar 的主佈局
- **Sidebar**: 左側導航選單，支援路由高亮
- **Navbar**: 頂部導航列，含使用者資訊和登出
- **CoinCard**: 幣種資訊卡片
- **CoinTable**: 幣種列表表格
- **FavoriteButton**: 收藏按鈕（星星圖示）
- **PriceChart**: Canvas 繪製的價格折線圖

## 資料管理

### 假資料 (fakeData.js)
- `cryptoCoins`: 8 個加密貨幣的假資料
- `mockUser`: 模擬使用者資訊
- `mockLogin()`: 假登入驗證
- `mockRegister()`: 假註冊功能
- `generateChartData()`: 產生圖表假資料
- `getCoinById()`: 根據 ID 取得幣種
- `formatPrice()`: 格式化價格顯示
- `formatNumber()`: 格式化大數字（K/M/B）

### LocalStorage 使用
- `authToken`: 使用者認證 token
- `user`: 使用者資訊 JSON
- `favorites`: 收藏的幣種 ID 陣列

## 路由設定

```javascript
/login          # 登入頁（requiresGuest）
/register       # 註冊頁（requiresGuest）
/               # 主佈局（requiresAuth）
  ├─ /dashboard    # 儀表板
  ├─ /market       # 市場列表
  ├─ /coin/:id     # 幣種詳細
  ├─ /watchlist    # 收藏清單
  └─ /profile      # 個人資料
```

### 路由守衛
- 未登入使用者會被導向 `/login`
- 已登入使用者訪問 login/register 會導向 `/dashboard`

## 啟動專案

### 安裝依賴
```bash
npm install
```

### 開發模式
```bash
npm run dev
```

### 建置生產版本
```bash
npm run build
```

### 預覽生產版本
```bash
npm run preview
```

## Demo 帳號
- **Email**: `demo@example.com`
- **Password**: `password`

## 支援的加密貨幣
1. Bitcoin (BTC)
2. Ethereum (ETH)
3. Solana (SOL)
4. Cardano (ADA)
5. Ripple (XRP)
6. Polkadot (DOT)
7. Dogecoin (DOGE)
8. Avalanche (AVAX)

## 待擴充功能建議
- 整合真實的加密貨幣 API（如 CoinGecko）
- 即時價格更新（WebSocket）
- 更多圖表類型（K線圖、成交量圖）
- 價格提醒功能
- 投資組合追蹤
- 多語系支援
- 深色模式

## 注意事項
1. 目前所有資料都是假資料，用於展示 UI
2. 登入認證使用 localStorage，重新整理頁面後仍保持登入狀態
3. 收藏功能也使用 localStorage 儲存
4. 圖表使用 Canvas API 繪製，不依賴第三方圖表庫
5. 專案使用 Vue 3 Composition API 的 `<script setup>` 語法

## 檔案路徑範例
- 登入邏輯: `src/views/LoginView.vue:14-28`
- 路由設定: `src/router/index.js:6-54`
- 假資料: `src/utils/fakeData.js`
- 主佈局: `src/components/MainLayout.vue`
