<script setup>
import { ref, computed, onMounted } from 'vue'
import { getCoinMarketChart, convertChartData } from '../utils/coingeckoApi'
import * as coincapApi from '../utils/coincapApi'
import { formatPrice, formatNumber } from '../utils/format'
import PriceChart from '../components/PriceChart.vue'
import { useCoinsStore } from '../stores/useCoinsStore'

const selectedCoins = ref([])
const allCoins = ref([])
const coinChartData = ref({})
const maxCoins = 4
const isLoading = ref(true)
const coinsStore = useCoinsStore()

const availableCoins = computed(() => {
  return allCoins.value.filter(coin => !selectedCoins.value.includes(coin.id))
})

const selectedCoinData = computed(() => {
  return selectedCoins.value.map(id => {
    const coin = allCoins.value.find(c => c.id === id)
    if (coin) {
      return {
        ...coin,
        chartData: coinChartData.value[id] || []
      }
    }
    return null
  }).filter(Boolean)
})

const loadChartData = async (coinId) => {
  try {
    const marketChart = await getCoinMarketChart(coinId, 'usd', 30)
    coinChartData.value[coinId] = convertChartData(marketChart)
  } catch (error) {
    console.error(`Failed to fetch chart for ${coinId}:`, error)
    try {
      const history = await coincapApi.getCoinHistory(coinId, 30)
      coinChartData.value[coinId] = coincapApi.convertChartData(history)
    } catch (fallbackError) {
      console.error(`CoinCap fallback for ${coinId} also failed:`, fallbackError)
      coinChartData.value[coinId] = []
    }
  }
}

const addCoin = async (coinId) => {
  if (selectedCoins.value.length < maxCoins && !selectedCoins.value.includes(coinId)) {
    selectedCoins.value.push(coinId)
    await loadChartData(coinId)
  }
}

const removeCoin = (coinId) => {
  selectedCoins.value = selectedCoins.value.filter(id => id !== coinId)
  delete coinChartData.value[coinId]
}

const getChangeColor = (change) => {
  return change >= 0 ? '#10b981' : '#ef4444'
}

onMounted(async () => {
  try {
    const coins = await coinsStore.fetchCoins({ currency: 'usd', perPage: 100, page: 1 })
    allCoins.value = coins
  } catch (error) {
    console.error('Failed to fetch from CoinGecko:', error)
    try {
      const coinsFallback = await coincapApi.getCoinsList(100)
      allCoins.value = coinsFallback.map(coincapApi.convertToAppFormat)
    } catch (fallbackError) {
      console.error('CoinCap fallback also failed:', fallbackError)
      allCoins.value = []
    }
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="compare-page">
    <div class="compare-header">
      <div>
        <h1>Compare Cryptocurrencies</h1>
        <p>Select up to {{ maxCoins }} cryptocurrencies to compare</p>
      </div>
    </div>

    <!-- 幣種選擇器 -->
    <div class="coin-selector">
      <label>Add Cryptocurrency:</label>
      <select
        @change="(e) => { addCoin(e.target.value); e.target.value = '' }"
        :disabled="selectedCoins.length >= maxCoins"
      >
        <option value="">Select a coin...</option>
        <option v-for="coin in availableCoins" :key="coin.id" :value="coin.id">
          {{ coin.name }} ({{ coin.symbol }})
        </option>
      </select>
      <span class="coin-count">{{ selectedCoins.length }}/{{ maxCoins }} selected</span>
    </div>

    <!-- 已選擇的幣種標籤 -->
    <div v-if="selectedCoins.length > 0" class="selected-tags">
      <div v-for="coin in selectedCoinData" :key="coin.id" class="coin-tag">
        <span>{{ coin.symbol }}</span>
        <button @click="removeCoin(coin.id)" class="remove-btn">&times;</button>
      </div>
    </div>

    <!-- 比較內容 -->
    <div v-if="selectedCoinData.length > 0" class="compare-content">
      <!-- 圖表比較 -->
      <div class="charts-section">
        <h2>Price Charts (30 Days)</h2>
        <div class="charts-grid" :class="`cols-${Math.min(selectedCoinData.length, 2)}`">
          <div v-for="coin in selectedCoinData" :key="coin.id" class="chart-card">
            <div class="chart-card-header">
              <h3>{{ coin.name }} ({{ coin.symbol }})</h3>
              <div class="current-price">{{ formatPrice(coin.price) }}</div>
            </div>
            <PriceChart :data="coin.chartData" :height="200" />
          </div>
        </div>
      </div>

      <!-- 數據比較表格 -->
      <div class="comparison-table-section">
        <h2>Comparison Table</h2>
        <div class="table-container">
          <table class="comparison-table">
            <thead>
              <tr>
                <th>Metric</th>
                <th v-for="coin in selectedCoinData" :key="coin.id">
                  {{ coin.symbol }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Current Price</td>
                <td v-for="coin in selectedCoinData" :key="coin.id">
                  {{ formatPrice(coin.price) }}
                </td>
              </tr>
              <tr>
                <td>24h Change</td>
                <td
                  v-for="coin in selectedCoinData"
                  :key="coin.id"
                  :style="{ color: getChangeColor(coin.change24h) }"
                >
                  {{ coin.change24h >= 0 ? '+' : '' }}{{ coin.change24h.toFixed(2) }}%
                </td>
              </tr>
              <tr>
                <td>Market Cap</td>
                <td v-for="coin in selectedCoinData" :key="coin.id">
                  ${{ formatNumber(coin.marketCap) }}
                </td>
              </tr>
              <tr>
                <td>24h Volume</td>
                <td v-for="coin in selectedCoinData" :key="coin.id">
                  ${{ formatNumber(coin.volume24h) }}
                </td>
              </tr>
              <tr>
                <td>Volume/Market Cap</td>
                <td v-for="coin in selectedCoinData" :key="coin.id">
                  {{ ((coin.volume24h / coin.marketCap) * 100).toFixed(2) }}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 空狀態 -->
    <div v-else class="empty-state">
      <p>Select cryptocurrencies to start comparing</p>
    </div>
  </div>
</template>

<style scoped>
.compare-page {
  max-width: 1400px;
  margin: 0 auto;
}

.compare-header {
  margin-bottom: 2rem;
}

.compare-header h1 {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  color: #111827;
}

.compare-header p {
  margin: 0;
  color: #6b7280;
}

.coin-selector {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.coin-selector label {
  font-weight: 600;
  color: #374151;
}

.coin-selector select {
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  min-width: 250px;
  cursor: pointer;
}

.coin-selector select:focus {
  outline: none;
  border-color: #4F46E5;
}

.coin-selector select:disabled {
  background: #f3f4f6;
  cursor: not-allowed;
}

.coin-count {
  color: #6b7280;
  font-size: 0.875rem;
}

.selected-tags {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.coin-tag {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #4F46E5;
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.remove-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  opacity: 0.8;
}

.remove-btn:hover {
  opacity: 1;
}

.compare-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.charts-section {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1.5rem;
}

.charts-section h2 {
  margin: 0 0 1.5rem 0;
  font-size: 1.25rem;
  color: #111827;
}

.charts-grid {
  display: grid;
  gap: 1.5rem;
}

.charts-grid.cols-1 {
  grid-template-columns: 1fr;
}

.charts-grid.cols-2 {
  grid-template-columns: repeat(2, 1fr);
}

@media (max-width: 768px) {
  .charts-grid.cols-2 {
    grid-template-columns: 1fr;
  }
}

.chart-card {
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  padding: 1rem;
}

.chart-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.chart-card-header h3 {
  margin: 0;
  font-size: 1rem;
  color: #111827;
}

.current-price {
  font-weight: 600;
  color: #4F46E5;
}

.comparison-table-section {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1.5rem;
}

.comparison-table-section h2 {
  margin: 0 0 1.5rem 0;
  font-size: 1.25rem;
  color: #111827;
}

.table-container {
  overflow-x: auto;
}

.comparison-table {
  width: 100%;
  border-collapse: collapse;
}

.comparison-table th,
.comparison-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.comparison-table th {
  background: #f9fafb;
  font-weight: 600;
  color: #374151;
}

.comparison-table td:first-child {
  font-weight: 500;
  color: #6b7280;
}

.comparison-table tbody tr:hover {
  background: #f9fafb;
}

.empty-state {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 4rem 2rem;
  text-align: center;
}

.empty-state p {
  color: #6b7280;
  font-size: 1.125rem;
  margin: 0;
}
</style>
