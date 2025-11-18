<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getCoinById, generateChartData, formatPrice, formatNumber } from '../utils/fakeData'
import PriceChart from '../components/PriceChart.vue'
import FavoriteButton from '../components/FavoriteButton.vue'

const route = useRoute()

const coin = ref(null)
const chartData = ref([])

onMounted(() => {
  const coinId = route.params.id
  coin.value = getCoinById(coinId)

  if (coin.value) {
    chartData.value = generateChartData(coin.value.price, 30)
  }
})

const isPositive = computed(() => coin.value?.change24h >= 0)
const changeColor = computed(() => isPositive.value ? '#10b981' : '#ef4444')
</script>

<template>
  <div class="coin-detail">
    <div v-if="coin" class="detail-container">
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
        <h2>Price Chart (30 Days)</h2>
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
            <div class="stat-value">{{ formatPrice(coin.price * 1.05) }}</div>
          </div>

          <div class="stat-item">
            <div class="stat-label">24h Low</div>
            <div class="stat-value">{{ formatPrice(coin.price * 0.95) }}</div>
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

.chart-section h2 {
  margin: 0 0 1.5rem 0;
  font-size: 1.25rem;
  color: #111827;
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
</style>
