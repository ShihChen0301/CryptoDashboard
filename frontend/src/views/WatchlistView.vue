<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import CoinTable from '../components/CoinTable.vue'
import { favoriteApi, coinApi } from '@/utils/api'

const { t } = useI18n()
const favorites = ref([]) // coin detail list
const isLoading = ref(true)
const error = ref('')

const favoriteCoins = computed(() => favorites.value)

const loadFavorites = async () => {
  isLoading.value = true
  error.value = ''
  try {
    const response = await favoriteApi.getAll()
    const favoriteIds = response.data.map((f) => f.coinId)
    const coinDetails = await Promise.all(
      favoriteIds.map((id) => coinApi.getDetail(id))
    )
    favorites.value = coinDetails.map((r) => r.data)
  } catch (e) {
    console.error('Failed to load favorites:', e)
    error.value = e.message || 'Failed to load favorites'
    favorites.value = []
  } finally {
    isLoading.value = false
  }
}

const clearAll = () => {
  if (confirm(t('watchlist.confirmClear'))) {
    favorites.value = []
  }
}

onMounted(() => {
  loadFavorites()
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
