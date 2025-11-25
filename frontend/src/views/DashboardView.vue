<script setup>
import { ref, onMounted } from 'vue'
import { getGlobalData } from '../utils/coingeckoApi'
import * as coincapApi from '../utils/coincapApi'
import { useCoinsStore } from '../stores/useCoinsStore'
import CoinCard from '../components/CoinCard.vue'

const globalData = ref({
  totalMarketCap: 0,
  totalVolume: 0,
  btcDominance: 0,
  activeCryptos: 0,
  marketCapChange: 0,
})

const hotCoins = ref([])
const isLoading = ref(true)
const coinsStore = useCoinsStore()

onMounted(async () => {
  try {
    // 並行載入數據（幣種走快取，減少重複請求）
    const [global, coins] = await Promise.all([
      getGlobalData(),
      coinsStore.fetchCoins({ currency: 'usd', perPage: 6, page: 1 })
    ])

    // 設定全球市場數據
    globalData.value = {
      totalMarketCap: global.data.total_market_cap.usd,
      totalVolume: global.data.total_volume.usd,
      btcDominance: global.data.market_cap_percentage.btc,
      activeCryptos: global.data.active_cryptocurrencies,
      marketCapChange: global.data.market_cap_change_percentage_24h_usd,
    }

    // 設定熱門幣種（已轉換格式）
    hotCoins.value = coins
  } catch (error) {
    console.error('Failed to fetch from CoinGecko:', error)
    // 使用 CoinCap API 作為備援
    try {
      console.log('Trying CoinCap API as fallback...')
      const [globalFallback, coinsFallback] = await Promise.all([
        coincapApi.getGlobalData(),
        coincapApi.getCoinsList(6),
      ])

      globalData.value = {
        totalMarketCap: globalFallback.totalMarketCap,
        totalVolume: globalFallback.totalVolume,
        btcDominance: globalFallback.btcDominance,
        activeCryptos: 0, // CoinCap 沒有此數據
        marketCapChange: 0, // CoinCap 沒有此數據
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
        marketCapChange: 0,
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
          {{ globalData.marketCapChange >= 0 ? '+' : ''
          }}{{ globalData.marketCapChange.toFixed(2) }}%
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
/* ==================== 背景動畫選項 ==================== */
/* 取消註解你想要的背景效果（只能選一個） */

/* 提案 2：藍色專業漸層 */
/*
@keyframes professionalGradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.dashboard {
  position: relative;
  background: linear-gradient(
    135deg,
    #667eea 0%,
    #764ba2 25%,
    #f093fb 50%,
    #4facfe 75%,
    #00f2fe 100%
  );
  background-size: 400% 400%;
  animation: professionalGradient 20s ease infinite;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 1rem;
  min-height: 100vh;
}
*/

/* 提案 4：極簡灰階漸變 */
@keyframes subtleGray {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.dashboard {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  background-size: 400% 400%;
  animation: subtleGray 25s ease infinite;
  min-height: calc(100vh - 64px);
  padding: 2rem;
  /* 使用負 margin 抵消 MainLayout 的 padding，讓背景填滿整個頁面 */
  margin: calc(-1 * var(--spacing-xl));
  padding: calc(var(--spacing-xl) + 1rem);
}

/* 提案 5：粒子漂浮效果 */
/*
@keyframes floatParticles {
  0%,
  100% {
    transform: translateY(0px);
    opacity: 0.3;
  }
  50% {
    transform: translateY(-20px);
    opacity: 0.7;
  }
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.dashboard {
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-size: 400% 400%;
  animation: gradientShift 30s ease infinite;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 1rem;
  min-height: 100vh;
}

.dashboard::before {
  content: '';
  position: absolute;
  top: 0;
  left: -50%;
  right: -50%;
  bottom: 0;
  background-image:
    radial-gradient(circle, rgba(255, 255, 255, 0.15) 2px, transparent 2px),
    radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
  background-size:
    80px 80px,
    40px 40px;
  background-position:
    0 0,
    20px 20px;
  animation: floatParticles 10s ease-in-out infinite;
  pointer-events: none;
  z-index: 0;
}

.dashboard > * {
  position: relative;
  z-index: 1;
}
*/

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
  border: 2px solid #8e8f92;
  border-radius: 1rem;
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
