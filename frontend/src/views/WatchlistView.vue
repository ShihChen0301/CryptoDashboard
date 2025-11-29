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
    // 1. 獲取收藏列表
    const response = await favoriteApi.getAll()
    const favoriteIds = response.data.map((f) => f.coinId)

    if (favoriteIds.length === 0) {
      favorites.value = []
      return
    }

    // 2. 獲取每個幣種的詳細資料
    const coinDetails = await Promise.all(
      favoriteIds.map((id) => coinApi.getDetail(id))
    )

    // 3. 轉換 CoinGecko API 數據為應用格式
    favorites.value = coinDetails.map((details) => ({
      id: details.id,
      symbol: details.symbol?.toUpperCase() || '',
      name: details.name || '',
      price: details.market_data?.current_price?.usd || 0,
      change24h: details.market_data?.price_change_percentage_24h || 0,
      marketCap: details.market_data?.market_cap?.usd || 0,
      volume24h: details.market_data?.total_volume?.usd || 0,
      image: details.image?.large || details.image?.small || '',
      high24h: details.market_data?.high_24h?.usd || 0,
      low24h: details.market_data?.low_24h?.usd || 0
    }))
  } catch (e) {
    console.error('Failed to load favorites:', e)
    error.value = e.message || 'Failed to load favorites'
    favorites.value = []
  } finally {
    isLoading.value = false
  }
}

const clearAll = async () => {
  if (confirm(t('watchlist.confirmClear'))) {
    try {
      // 獲取所有收藏的 coinId 並逐一刪除
      const coinIds = favorites.value.map(coin => coin.id)
      await Promise.all(
        coinIds.map(coinId => favoriteApi.remove(coinId))
      )

      // 重新載入收藏列表
      await loadFavorites()
    } catch (e) {
      console.error('Failed to clear favorites:', e)
      error.value = e.message || 'Failed to clear favorites'
    }
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

    <!-- 載入中 -->
    <div v-if="isLoading" class="loading-state">
      <p>{{ t('watchlist.loading') || 'Loading favorites...' }}</p>
    </div>

    <!-- 錯誤訊息 -->
    <div v-else-if="error" class="error-message">
      <p>{{ error }}</p>
      <button @click="loadFavorites" class="btn-retry">
        {{ t('watchlist.retry') || 'Retry' }}
      </button>
    </div>

    <!-- 收藏列表 -->
    <div v-else-if="favoriteCoins.length > 0">
      <CoinTable :coins="favoriteCoins" />
    </div>

    <!-- 空狀態 -->
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

.loading-state {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
}

.loading-state p {
  color: #6b7280;
  font-size: 1.125rem;
}

.error-message {
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.5rem;
  padding: 2rem;
  text-align: center;
}

.error-message p {
  color: #dc2626;
  margin: 0 0 1rem 0;
  font-size: 1.125rem;
}

.btn-retry {
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

.btn-retry:hover {
  background: #dc2626;
}
</style>
