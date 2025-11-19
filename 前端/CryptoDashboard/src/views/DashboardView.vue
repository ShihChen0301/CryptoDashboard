<script setup>
import { ref, onMounted } from 'vue'
import { getGlobalData, getCoinsList, convertToAppFormat } from '../utils/coingeckoApi'
import * as coincapApi from '../utils/coincapApi'
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
    console.error('Failed to fetch from CoinGecko:', error)
    // 使用 CoinCap API 作為備援
    try {
      console.log('Trying CoinCap API as fallback...')
      const [globalFallback, coinsFallback] = await Promise.all([
        coincapApi.getGlobalData(),
        coincapApi.getCoinsList(6)
      ])

      globalData.value = {
        totalMarketCap: globalFallback.totalMarketCap,
        totalVolume: globalFallback.totalVolume,
        btcDominance: globalFallback.btcDominance,
        activeCryptos: 0, // CoinCap 沒有此數據
        marketCapChange: 0 // CoinCap 沒有此數據
      }

      hotCoins.value = coinsFallback.map(coincapApi.convertToAppFormat)
    } catch (fallbackError) {
      console.error('CoinCap fallback also failed:', fallbackError)
      // 如果兩個 API 都失敗，顯示錯誤狀態
      globalData.value = {
        totalMarketCap: 0,
        totalVolume: 0,
        btcDominance: 0,
        activeCryptos: 0,
        marketCapChange: 0
      }
      hotCoins.value = []
    }
  } finally {
    isLoading.value = false
  }
})

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
</style>
