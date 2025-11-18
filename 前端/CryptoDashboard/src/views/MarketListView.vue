<script setup>
import { ref, computed } from 'vue'
import { cryptoCoins } from '../utils/fakeData'
import CoinTable from '../components/CoinTable.vue'

const searchQuery = ref('')
const allCoins = ref(cryptoCoins)

const filteredCoins = computed(() => {
  if (!searchQuery.value) {
    return allCoins.value
  }

  const query = searchQuery.value.toLowerCase()
  return allCoins.value.filter(
    coin =>
      coin.name.toLowerCase().includes(query) ||
      coin.symbol.toLowerCase().includes(query)
  )
})
</script>

<template>
  <div class="market-list">
    <div class="market-header">
      <div>
        <h1>Market Overview</h1>
        <p>All cryptocurrencies ranked by market cap</p>
      </div>

      <div class="search-box">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search coins..."
          class="search-input"
        />
      </div>
    </div>

    <CoinTable :coins="filteredCoins" />

    <div v-if="filteredCoins.length === 0" class="no-results">
      <p>No cryptocurrencies found matching "{{ searchQuery }}"</p>
    </div>
  </div>
</template>

<style scoped>
.market-list {
  max-width: 1400px;
  margin: 0 auto;
}

.market-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 2rem;
  flex-wrap: wrap;
}

.market-header h1 {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  color: #111827;
}

.market-header p {
  margin: 0;
  color: #6b7280;
}

.search-box {
  flex-shrink: 0;
}

.search-input {
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  width: 300px;
  transition: border-color 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #4F46E5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.no-results {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 0.5rem;
  margin-top: 1rem;
}

.no-results p {
  color: #6b7280;
  font-size: 1.125rem;
}
</style>
