<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCoinsStore } from '../stores/useCoinsStore'
import CoinTable from '../components/CoinTable.vue'

const { t } = useI18n()
const coinsStore = useCoinsStore()
const favorites = ref([])
const allCoins = ref([])
const isLoading = ref(true)

const loadFavorites = () => {
  const stored = JSON.parse(localStorage.getItem('crypto_favorites') || '[]')
  favorites.value = stored
}

const favoriteCoins = computed(() => {
  return allCoins.value.filter(coin => favorites.value.includes(coin.id))
})

const clearAll = () => {
  if (confirm(t('watchlist.confirmClear'))) {
    localStorage.setItem('crypto_favorites', JSON.stringify([]))
    favorites.value = []
    window.dispatchEvent(new CustomEvent('favoritesChanged', {
      detail: { favorites: [] }
    }))
  }
}

onMounted(async () => {
  loadFavorites()

  // 監聽收藏變化事件
  window.addEventListener('favoritesChanged', loadFavorites)
  window.addEventListener('storage', loadFavorites)

  // 載入幣種數據（使用 Store 快取，perPage: 50 與 Dashboard 一致）
  try {
    const coins = await coinsStore.fetchCoins({
      currency: 'usd',
      perPage: 50,
      page: 1
    })
    allCoins.value = coins
  } catch (error) {
    console.error('Failed to load coins from store:', error)
    allCoins.value = []
  } finally {
    isLoading.value = false
  }
})

onUnmounted(() => {
  window.removeEventListener('favoritesChanged', loadFavorites)
  window.removeEventListener('storage', loadFavorites)
})
</script>

<template>
  <div class="watchlist">
    <div class="watchlist-header">
      <div>
        <h1>{{ t('watchlist.title') }}</h1>
        <p>{{ t('watchlist.subtitle') }}</p>
      </div>

      <button
        v-if="favoriteCoins.length > 0"
        @click="clearAll"
        class="btn-clear"
      >
        {{ t('watchlist.clearAll') }}
      </button>
    </div>

    <div v-if="favoriteCoins.length > 0">
      <CoinTable :coins="favoriteCoins" />
    </div>

    <div v-else class="empty-state">
      <div class="empty-icon">⭐</div>
      <h2>{{ t('watchlist.empty.title') }}</h2>
      <p>{{ t('watchlist.empty.subtitle') }}</p>
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
