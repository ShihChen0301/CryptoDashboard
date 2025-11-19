<script setup>
import { ref, computed, onMounted } from 'vue'
import { getCoinsList, convertToAppFormat } from '../utils/coingeckoApi'
import * as coincapApi from '../utils/coincapApi'
import CoinTable from '../components/CoinTable.vue'

const searchQuery = ref('')
const allCoins = ref([])
const sortBy = ref('')
const sortOrder = ref('asc')
const isLoading = ref(true)
const error = ref(null)

// 載入真實數據
onMounted(async () => {
  try {
    isLoading.value = true
    const coins = await getCoinsList('usd', 50, 1)
    allCoins.value = coins.map(convertToAppFormat)
  } catch (err) {
    console.error('Failed to fetch from CoinGecko:', err)
    // 使用 CoinCap API 作為備援
    try {
      console.log('Trying CoinCap API as fallback...')
      const coinsFallback = await coincapApi.getCoinsList(50)
      allCoins.value = coinsFallback.map(coincapApi.convertToAppFormat)
      error.value = 'Using backup data source.'
    } catch (fallbackErr) {
      console.error('CoinCap fallback also failed:', fallbackErr)
      error.value = 'Failed to load data from all sources.'
      allCoins.value = []
    }
  } finally {
    isLoading.value = false
  }
})

const filteredCoins = computed(() => {
  let result = allCoins.value

  // 搜尋過濾
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      coin =>
        coin.name.toLowerCase().includes(query) ||
        coin.symbol.toLowerCase().includes(query)
    )
  }

  // 排序
  if (sortBy.value) {
    result = [...result].sort((a, b) => {
      let aVal = a[sortBy.value]
      let bVal = b[sortBy.value]

      // 處理字串排序
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase()
        bVal = bVal.toLowerCase()
      }

      if (sortOrder.value === 'asc') {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })
  }

  return result
})

const handleSort = (field) => {
  if (sortBy.value === field) {
    // 切換排序順序
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    // 新的排序欄位
    sortBy.value = field
    sortOrder.value = 'asc'
  }
}
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

    <!-- 載入中 -->
    <div v-if="isLoading" class="loading-state">
      <p>Loading market data...</p>
    </div>

    <!-- 錯誤訊息 -->
    <div v-if="error" class="error-message">
      <p>{{ error }}</p>
    </div>

    <!-- 數據表格 -->
    <CoinTable
      v-if="!isLoading"
      :coins="filteredCoins"
      :sortBy="sortBy"
      :sortOrder="sortOrder"
      @sort="handleSort"
    />

    <div v-if="!isLoading && filteredCoins.length === 0" class="no-results">
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
  padding: 1rem;
  margin-bottom: 1rem;
}

.error-message p {
  color: #dc2626;
  margin: 0;
}
</style>
