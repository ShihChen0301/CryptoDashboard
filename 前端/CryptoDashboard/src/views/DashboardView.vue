<script setup>
import { ref } from 'vue'
import { cryptoCoins } from '../utils/fakeData'
import CoinCard from '../components/CoinCard.vue'

// 取得熱門幣種（前 6 個）
const hotCoins = ref(cryptoCoins.slice(0, 6))
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
        <div class="stat-value">$1.2T</div>
        <div class="stat-change positive">+2.5%</div>
      </div>

      <div class="stat-card">
        <div class="stat-label">24h Trading Volume</div>
        <div class="stat-value">$85.4B</div>
        <div class="stat-change negative">-1.2%</div>
      </div>

      <div class="stat-card">
        <div class="stat-label">Bitcoin Dominance</div>
        <div class="stat-value">48.3%</div>
        <div class="stat-change positive">+0.3%</div>
      </div>

      <div class="stat-card">
        <div class="stat-label">Active Cryptocurrencies</div>
        <div class="stat-value">12,845</div>
        <div class="stat-change positive">+15</div>
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
