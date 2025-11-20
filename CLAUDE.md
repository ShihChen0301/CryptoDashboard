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
4. **coin_submissions** - 提交新幣種

詳見：`database/schema.sql`

---

## 開發歷史

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
- [ ] 建立後端 API（Node.js + Express 建議）
- [ ] 連接 MySQL 資料庫
- [ ] 實作真實登入/註冊 API
- [ ] 將 `mockAuth.js` 替換為真實 API 呼叫

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

## 專案特色

1. **雙 API 架構**：CoinGecko（主）+ CoinCap（備援），確保服務穩定性
2. **智能價格顯示**：自動識別幣種特性調整小數位數（穩定幣、極小價格幣、高價幣）
3. **完整管理後台**：數據總覽、用戶管理、公告系統三大模塊
4. **響應式設計**：桌面、平板、手機全適配
5. **模擬認證系統**：完整的前端登入流程，待接入後端 API

---

*最後更新：2024-11-20*
