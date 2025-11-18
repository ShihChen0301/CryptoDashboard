<script setup>
import { ref, computed, onMounted } from 'vue'
import { getGlobalData, getCoinsList, convertToAppFormat } from '../utils/coingeckoApi'
import { cryptoCoins, getTrendingBuys, formatNumber } from '../utils/fakeData'
import CoinCard from '../components/CoinCard.vue'

// 全球市場數據
const globalData = ref({
  totalMarketCap: 0,
  totalVolume: 0,
  btcDominance: 0,
  activeCryptos: 0,
  marketCapChange: 0
})

// 取得熱門幣種（前 6 個）
const hotCoins = ref([])

// 取得購買趨勢數據
const trendingBuys = ref(getTrendingBuys())

// 載入狀態
const isLoading = ref(true)

onMounted(async () => {
  try {
    // 並行載入數據
    const [global, coins] = await Promise.all([
      getGlobalData(),
      getCoinsList('usd', 6, 1)
    ])

    // 設定全球市場數據
    globalData.value = {
      totalMarketCap: global.data.total_market_cap.usd,
      totalVolume: global.data.total_volume.usd,
      btcDominance: global.data.market_cap_percentage.btc,
      activeCryptos: global.data.active_cryptocurrencies,
      marketCapChange: global.data.market_cap_change_percentage_24h_usd
    }

    // 設定熱門幣種
    hotCoins.value = coins.map(convertToAppFormat)
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error)
    // 使用假數據作為備用
    hotCoins.value = cryptoCoins.slice(0, 6)
    globalData.value = {
      totalMarketCap: 1200000000000,
      totalVolume: 85400000000,
      btcDominance: 48.3,
      activeCryptos: 12845,
      marketCapChange: 2.5
    }
  } finally {
    isLoading.value = false
  }
})

// 計算最大購買數用於進度條寬度
const maxBuys = computed(() => {
  return Math.max(...trendingBuys.value.map(item => item.buys))
})

const getBarWidth = (buys) => {
  return (buys / maxBuys.value) * 100
}

// 格式化大數字
const formatLargeNumber = (num) => {
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`
  if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`
  return `$${(num / 1e6).toFixed(0)}M`
}
</script>

<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h1>Dashboard</h1>
      <p>Welcome back! Here are your favorite cryptocurrencies</p>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">Total Market Cap</div>
        <div class="stat-value">{{ formatLargeNumber(globalData.totalMarketCap) }}</div>
        <div class="stat-change" :class="globalData.marketCapChange >= 0 ? 'positive' : 'negative'">
          {{ globalData.marketCapChange >= 0 ? '+' : '' }}{{ globalData.marketCapChange.toFixed(2) }}%
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-label">24h Trading Volume</div>
        <div class="stat-value">{{ formatLargeNumber(globalData.totalVolume) }}</div>
      </div>

      <div class="stat-card">
        <div class="stat-label">Bitcoin Dominance</div>
        <div class="stat-value">{{ globalData.btcDominance.toFixed(1) }}%</div>
      </div>

      <div class="stat-card">
        <div class="stat-label">Active Cryptocurrencies</div>
        <div class="stat-value">{{ globalData.activeCryptos.toLocaleString() }}</div>
      </div>
    </div>

    <div class="section-header">
      <h2>Hot Cryptocurrencies</h2>
    </div>

    <div class="coins-grid">
      <CoinCard v-for="coin in hotCoins" :key="coin.id" :coin="coin" />
    </div>

    <!-- 購買趨勢排行 -->
    <div class="section-header">
      <h2>Trending Buys</h2>
      <p class="section-subtitle">Most purchased cryptocurrencies</p>
    </div>

    <div class="trending-section">
      <div v-for="(item, index) in trendingBuys" :key="item.coinId" class="trending-item">
        <div class="trending-rank">{{ index + 1 }}</div>
        <div class="trending-info">
          <div class="trending-name">
            <span class="symbol">{{ item.symbol }}</span>
            <span class="name">{{ item.name }}</span>
          </div>
          <div class="trending-bar-container">
            <div
              class="trending-bar"
              :style="{ width: getBarWidth(item.buys) + '%' }"
            ></div>
          </div>
        </div>
        <div class="trending-buys">{{ formatNumber(item.buys) }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard-header {
  margin-bottom: 2rem;
}

.dashboard-header h1 {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  color: #111827;
}

.dashboard-header p {
  margin: 0;
  color: #6b7280;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1.5rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.875rem;
  font-weight: bold;
  color: #111827;
  margin-bottom: 0.5rem;
}

.stat-change {
  font-size: 0.875rem;
  font-weight: 600;
}

.stat-change.positive {
  color: #10b981;
}

.stat-change.negative {
  color: #ef4444;
}

.section-header {
  margin: 2rem 0 1.5rem 0;
}

.section-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #111827;
}

.coins-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.section-subtitle {
  margin: 0.5rem 0 0 0;
  color: #6b7280;
  font-size: 0.875rem;
}

.trending-section {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1.5rem;
}

.trending-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f3f4f6;
}

.trending-item:last-child {
  border-bottom: none;
}

.trending-rank {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
  color: #6b7280;
  flex-shrink: 0;
}

.trending-item:nth-child(1) .trending-rank {
  background: #fef3c7;
  color: #d97706;
}

.trending-item:nth-child(2) .trending-rank {
  background: #e5e7eb;
  color: #6b7280;
}

.trending-item:nth-child(3) .trending-rank {
  background: #fed7aa;
  color: #c2410c;
}

.trending-info {
  flex: 1;
  min-width: 0;
}

.trending-name {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.trending-name .symbol {
  font-weight: 600;
  color: #111827;
}

.trending-name .name {
  color: #6b7280;
  font-size: 0.875rem;
}

.trending-bar-container {
  height: 8px;
  background: #f3f4f6;
  border-radius: 4px;
  overflow: hidden;
}

.trending-bar {
  height: 100%;
  background: linear-gradient(90deg, #4F46E5, #818cf8);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.trending-buys {
  font-weight: 600;
  color: #111827;
  font-size: 0.875rem;
  min-width: 60px;
  text-align: right;
}
</style>
