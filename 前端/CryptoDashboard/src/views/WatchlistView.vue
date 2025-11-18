<script setup>
import { ref, computed, onMounted } from 'vue'
import { cryptoCoins } from '../utils/fakeData'
import CoinTable from '../components/CoinTable.vue'

const favorites = ref([])

const loadFavorites = () => {
  const stored = JSON.parse(localStorage.getItem('favorites') || '[]')
  favorites.value = stored
}

const favoriteCoins = computed(() => {
  return cryptoCoins.filter(coin => favorites.value.includes(coin.id))
})

const clearAll = () => {
  if (confirm('Are you sure you want to clear all favorites?')) {
    localStorage.setItem('favorites', JSON.stringify([]))
    favorites.value = []
  }
}

onMounted(() => {
  loadFavorites()

  // 監聽 localStorage 變化
  window.addEventListener('storage', loadFavorites)
})
</script>

<template>
  <div class="watchlist">
    <div class="watchlist-header">
      <div>
        <h1>My Watchlist</h1>
        <p>Your favorite cryptocurrencies</p>
      </div>

      <button
        v-if="favoriteCoins.length > 0"
        @click="clearAll"
        class="btn-clear"
      >
        Clear All
      </button>
    </div>

    <div v-if="favoriteCoins.length > 0">
      <CoinTable :coins="favoriteCoins" />
    </div>

    <div v-else class="empty-state">
      <div class="empty-icon">⭐</div>
      <h2>No favorites yet</h2>
      <p>Start adding cryptocurrencies to your watchlist by clicking the star icon</p>
      <router-link to="/market" class="btn-browse">
        Browse Market
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.watchlist {
  max-width: 1400px;
  margin: 0 auto;
}

.watchlist-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 2rem;
  flex-wrap: wrap;
}

.watchlist-header h1 {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  color: #111827;
}

.watchlist-header p {
  margin: 0;
  color: #6b7280;
}

.btn-clear {
  background: #ef4444;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-clear:hover {
  background: #dc2626;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  color: #111827;
}

.empty-state p {
  margin: 0 0 2rem 0;
  color: #6b7280;
}

.btn-browse {
  display: inline-block;
  background: #4F46E5;
  color: white;
  text-decoration: none;
  padding: 0.875rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: background 0.2s;
}

.btn-browse:hover {
  background: #4338ca;
}
</style>
