<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getCoinDetails, getCoinMarketChart, convertChartData } from '../utils/coingeckoApi'
import { getCoinById, generateChartData, formatPrice, formatNumber } from '../utils/fakeData'
import PriceChart from '../components/PriceChart.vue'
import FavoriteButton from '../components/FavoriteButton.vue'

const route = useRoute()

const coin = ref(null)
const chartData = ref([])
const selectedDays = ref(30)
const isLoading = ref(true)
const chartLoading = ref(false)

const timeRanges = [
  { label: '7D', days: 7 },
  { label: '30D', days: 30 },
  { label: '90D', days: 90 },
  { label: '1Y', days: 365 }
]

const updateChartData = async () => {
  if (!coin.value) return

  try {
    chartLoading.value = true
    const marketChart = await getCoinMarketChart(coin.value.id, 'usd', selectedDays.value)
    chartData.value = convertChartData(marketChart)
  } catch (error) {
    console.error('Failed to fetch chart data:', error)
    // 使用假數據作為備用
    chartData.value = generateChartData(coin.value.price, selectedDays.value)
  } finally {
    chartLoading.value = false
  }
}

onMounted(async () => {
  const coinId = route.params.id

  try {
    isLoading.value = true
    const details = await getCoinDetails(coinId)

    coin.value = {
      id: details.id,
      symbol: details.symbol.toUpperCase(),
      name: details.name,
      price: details.market_data.current_price.usd,
      change24h: details.market_data.price_change_percentage_24h || 0,
      marketCap: details.market_data.market_cap.usd,
      volume24h: details.market_data.total_volume.usd,
      image: details.image.large,
      high24h: details.market_data.high_24h.usd,
      low24h: details.market_data.low_24h.usd
    }

    await updateChartData()
  } catch (error) {
    console.error('Failed to fetch coin details:', error)
    // 使用假數據作為備用
    coin.value = getCoinById(coinId)
    if (coin.value) {
      chartData.value = generateChartData(coin.value.price, selectedDays.value)
    }
  } finally {
    isLoading.value = false
  }
})

watch(selectedDays, () => {
  updateChartData()
})

const isPositive = computed(() => coin.value?.change24h >= 0)
const changeColor = computed(() => isPositive.value ? '#10b981' : '#ef4444')

const chartTitle = computed(() => {
  const range = timeRanges.find(r => r.days === selectedDays.value)
  return `Price Chart (${range ? range.label : '30D'})`
})
</script>

<template>
  <div class="coin-detail">
    <!-- 載入中 -->
    <div v-if="isLoading" class="loading-state">
      <p>Loading coin details...</p>
    </div>

    <div v-else-if="coin" class="detail-container">
      <div class="coin-header">
        <div class="coin-info">
          <h1>{{ coin.name }} ({{ coin.symbol }})</h1>
          <div class="price-info">
            <div class="price">{{ formatPrice(coin.price) }}</div>
            <div class="change" :style="{ color: changeColor }">
              {{ isPositive ? '+' : '' }}{{ coin.change24h.toFixed(2) }}%
            </div>
          </div>
        </div>
        <FavoriteButton :coinId="coin.id" />
      </div>

      <div class="chart-section">
        <div class="chart-header">
          <h2>{{ chartTitle }}</h2>
          <div class="time-range-selector">
            <button
              v-for="range in timeRanges"
              :key="range.days"
              :class="['range-btn', { active: selectedDays === range.days }]"
              @click="selectedDays = range.days"
            >
              {{ range.label }}
            </button>
          </div>
        </div>
        <PriceChart :data="chartData" :height="300" />
      </div>

      <div class="stats-section">
        <h2>Statistics</h2>
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-label">Market Cap</div>
            <div class="stat-value">{{ formatNumber(coin.marketCap) }}</div>
          </div>

          <div class="stat-item">
            <div class="stat-label">24h Trading Volume</div>
            <div class="stat-value">{{ formatNumber(coin.volume24h) }}</div>
          </div>

          <div class="stat-item">
            <div class="stat-label">24h High</div>
            <div class="stat-value">{{ formatPrice(coin.high24h || coin.price * 1.05) }}</div>
          </div>

          <div class="stat-item">
            <div class="stat-label">24h Low</div>
            <div class="stat-value">{{ formatPrice(coin.low24h || coin.price * 0.95) }}</div>
          </div>
        </div>
      </div>

      <div class="info-section">
        <h2>About {{ coin.name }}</h2>
        <p>
          {{ coin.name }} ({{ coin.symbol }}) is a decentralized digital currency
          that operates on a peer-to-peer network. It is one of the most popular
          cryptocurrencies in the market with a strong community backing.
        </p>
      </div>
    </div>

    <div v-else class="not-found">
      <h2>Cryptocurrency not found</h2>
      <p>The requested cryptocurrency could not be found.</p>
    </div>
  </div>
</template>

<style scoped>
.coin-detail {
  max-width: 1200px;
  margin: 0 auto;
}

.detail-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.coin-header {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.coin-info h1 {
  margin: 0 0 1rem 0;
  font-size: 2rem;
  color: #111827;
}

.price-info {
  display: flex;
  align-items: baseline;
  gap: 1rem;
}

.price {
  font-size: 2.5rem;
  font-weight: bold;
  color: #111827;
}

.change {
  font-size: 1.5rem;
  font-weight: 600;
}

.chart-section {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 2rem;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.chart-section h2 {
  margin: 0;
  font-size: 1.25rem;
  color: #111827;
}

.time-range-selector {
  display: flex;
  gap: 0.5rem;
}

.range-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.range-btn:hover {
  border-color: #4F46E5;
  color: #4F46E5;
}

.range-btn.active {
  background: #4F46E5;
  border-color: #4F46E5;
  color: white;
}

.stats-section {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 2rem;
}

.stats-section h2 {
  margin: 0 0 1.5rem 0;
  font-size: 1.25rem;
  color: #111827;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.stat-item {
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.375rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
}

.info-section {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 2rem;
}

.info-section h2 {
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
  color: #111827;
}

.info-section p {
  line-height: 1.6;
  color: #4b5563;
}

.not-found {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 0.5rem;
}

.not-found h2 {
  color: #111827;
  margin-bottom: 0.5rem;
}

.not-found p {
  color: #6b7280;
}

.loading-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
}

.loading-state p {
  color: #6b7280;
  font-size: 1.125rem;
  margin: 0;
}
</style>
