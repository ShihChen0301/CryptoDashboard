<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useCoinsStore } from '../stores/useCoinsStore'
import { useMarketFilterStore } from '../stores/useMarketFilterStore'
import CoinTable from '../components/CoinTable.vue'

const allCoins = ref([])
const isLoading = ref(true)
const error = ref(null)
const showFilters = ref(false)

// 分頁狀態
const currentPage = ref(1)
const perPage = ref(50)
const totalPages = ref(100) // CoinGecko 支援最多 100 頁

const coinsStore = useCoinsStore()
const filterStore = useMarketFilterStore()

// 載入數據函數
const loadCoins = async (page = 1) => {
  try {
    isLoading.value = true
    error.value = null
    const coins = await coinsStore.fetchCoins({
      currency: 'usd',
      perPage: perPage.value,
      page
    })
    allCoins.value = coins
    if (coinsStore.error) {
      error.value = coinsStore.error
    }
  } catch (err) {
    console.error('Failed to load market data:', err)
    error.value = 'CoinGecko / CoinCap 皆無法取得資料'
    allCoins.value = []
  } finally {
    isLoading.value = false
  }
}

// 初始載入
onMounted(() => {
  loadCoins(currentPage.value)
})

// 監聽頁碼變化
watch(currentPage, (newPage) => {
  loadCoins(newPage)
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

// 頁碼輸入
const pageInput = ref('')

const handlePageInput = (event) => {
  // 只允許輸入數字
  const value = event.target.value.replace(/[^0-9]/g, '')
  pageInput.value = value
}

const goToPage = () => {
  const pageNum = parseInt(pageInput.value)

  if (isNaN(pageNum) || pageNum < 1 || pageNum > totalPages.value) {
    alert(`Please enter a valid page number between 1 and ${totalPages.value}`)
    pageInput.value = ''
    return
  }

  currentPage.value = pageNum
  pageInput.value = ''
}

// 使用 filterStore 來篩選和排序
const filteredCoins = computed(() => {
  return filterStore.applyFilters(allCoins.value)
})

const handleSort = (field) => {
  if (filterStore.sortBy === field) {
    // 切換排序順序
    const newOrder = filterStore.sortOrder === 'asc' ? 'desc' : 'asc'
    filterStore.setSort(field, newOrder)
  } else {
    // 新的排序欄位
    filterStore.setSort(field, 'asc')
  }
}

const clearAllFilters = () => {
  filterStore.clearFilters()
}

const toggleFilterPanel = () => {
  showFilters.value = !showFilters.value
}
</script>

<template>
  <div class="market-list">
    <div class="market-header">
      <div>
        <h1>Market Overview</h1>
        <p>All cryptocurrencies ranked by market cap</p>
      </div>

      <div class="header-controls">
        <div class="search-box">
          <input
            v-model="filterStore.searchQuery"
            type="text"
            placeholder="Search coins..."
            class="search-input"
          />
        </div>
        <button @click="toggleFilterPanel" class="filter-toggle-btn">
          <span class="filter-icon">🔍</span>
          <span>進階篩選</span>
          <span v-if="filterStore.activeFilterCount > 0" class="filter-badge">
            {{ filterStore.activeFilterCount }}
          </span>
        </button>
      </div>
    </div>

    <!-- 進階篩選面板 -->
    <div v-if="showFilters" class="filter-panel">
      <div class="filter-header">
        <h3>進階篩選條件</h3>
        <button @click="clearAllFilters" class="clear-btn">清除所有篩選</button>
      </div>

      <div class="filter-grid">
        <!-- 價格範圍篩選 -->
        <div class="filter-group">
          <label>價格範圍 (USD)</label>
          <div class="range-inputs">
            <input
              v-model.number="filterStore.filters.priceMin"
              type="number"
              placeholder="最小值"
              class="filter-input"
              step="0.01"
            />
            <span class="range-separator">-</span>
            <input
              v-model.number="filterStore.filters.priceMax"
              type="number"
              placeholder="最大值"
              class="filter-input"
              step="0.01"
            />
          </div>
        </div>

        <!-- 市值範圍篩選 -->
        <div class="filter-group">
          <label>市值範圍 (USD)</label>
          <div class="range-inputs">
            <input
              v-model.number="filterStore.filters.marketCapMin"
              type="number"
              placeholder="最小值"
              class="filter-input"
            />
            <span class="range-separator">-</span>
            <input
              v-model.number="filterStore.filters.marketCapMax"
              type="number"
              placeholder="最大值"
              class="filter-input"
            />
          </div>
        </div>

        <!-- 24h 交易量篩選 -->
        <div class="filter-group">
          <label>24h 交易量（最小值）</label>
          <input
            v-model.number="filterStore.filters.volume24hMin"
            type="number"
            placeholder="最小交易量"
            class="filter-input"
          />
        </div>

        <!-- 24h 漲跌幅篩選 -->
        <div class="filter-group">
          <label>24h 漲跌幅 (%)</label>
          <div class="range-inputs">
            <input
              v-model.number="filterStore.filters.priceChange24hMin"
              type="number"
              placeholder="最小值"
              class="filter-input"
              step="0.1"
            />
            <span class="range-separator">-</span>
            <input
              v-model.number="filterStore.filters.priceChange24hMax"
              type="number"
              placeholder="最大值"
              class="filter-input"
              step="0.1"
            />
          </div>
        </div>
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
      :sortBy="filterStore.sortBy"
      :sortOrder="filterStore.sortOrder"
      @sort="handleSort"
    />

    <div v-if="!isLoading && filteredCoins.length === 0" class="no-results">
      <p>No cryptocurrencies found matching "{{ filterStore.searchQuery }}"</p>
    </div>

    <!-- 分頁控制 -->
    <div v-if="!isLoading && !filterStore.searchQuery" class="pagination">
      <!-- 第一頁按鈕 -->
      <button
        @click="currentPage = 1"
        :disabled="currentPage === 1"
        class="pagination-btn pagination-btn-edge"
        title="Go to first page"
      >
        « First
      </button>

      <!-- 上一頁按鈕 -->
      <button
        @click="currentPage--"
        :disabled="currentPage === 1"
        class="pagination-btn"
      >
        ← Previous
      </button>

      <!-- 頁碼資訊與輸入框 -->
      <div class="pagination-info">
        <div class="page-display">
          <span>Page {{ currentPage }} of {{ totalPages }}</span>
        </div>
        <div class="page-jump">
          <input
            v-model="pageInput"
            @input="handlePageInput"
            @keyup.enter="goToPage"
            type="text"
            inputmode="numeric"
            placeholder="Jump to..."
            class="page-input"
            maxlength="3"
          />
          <button @click="goToPage" class="go-btn">Go</button>
        </div>
        <span class="page-range">
          (Coins {{ (currentPage - 1) * perPage + 1 }} - {{ currentPage * perPage }})
        </span>
      </div>

      <!-- 下一頁按鈕 -->
      <button
        @click="currentPage++"
        :disabled="currentPage === totalPages"
        class="pagination-btn"
      >
        Next →
      </button>

      <!-- 最後一頁按鈕 -->
      <button
        @click="currentPage = totalPages"
        :disabled="currentPage === totalPages"
        class="pagination-btn pagination-btn-edge"
        title="Go to last page"
      >
        Last »
      </button>
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

.header-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.search-box {
  flex-shrink: 0;
}

.filter-toggle-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: #6366F1;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.filter-toggle-btn:hover {
  background: #4F46E5;
  transform: translateY(-1px);
}

.filter-icon {
  font-size: 1.125rem;
}

.filter-badge {
  background: #EF4444;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
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

/* 篩選面板樣式 */
.filter-panel {
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.filter-header h3 {
  margin: 0;
  font-size: 1.125rem;
  color: #111827;
}

.clear-btn {
  padding: 0.5rem 1rem;
  background: #EF4444;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.clear-btn:hover {
  background: #DC2626;
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.filter-input {
  padding: 0.625rem 0.875rem;
  border: 1px solid #D1D5DB;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: border-color 0.2s;
}

.filter-input:focus {
  outline: none;
  border-color: #6366F1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.range-inputs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.range-inputs .filter-input {
  flex: 1;
}

.range-separator {
  color: #6B7280;
  font-weight: 500;
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

/* 分頁樣式 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding: 2rem 0;
  flex-wrap: wrap;
}

.pagination-btn {
  padding: 0.75rem 1.5rem;
  background: #4F46E5;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.pagination-btn:hover:not(:disabled) {
  background: #4338CA;
  transform: translateY(-1px);
}

.pagination-btn:disabled {
  background: #D1D5DB;
  cursor: not-allowed;
  transform: none;
}

.pagination-btn-edge {
  background: #6366F1;
  padding: 0.75rem 1.25rem;
}

.pagination-btn-edge:hover:not(:disabled) {
  background: #4F46E5;
}

.pagination-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  color: #374151;
  padding: 0 1rem;
}

.page-display {
  font-weight: 600;
}

.page-jump {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.page-input {
  width: 90px;
  padding: 0.5rem 0.75rem;
  border: 1px solid #D1D5DB;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  text-align: center;
  transition: border-color 0.2s;
}

.page-input:focus {
  outline: none;
  border-color: #4F46E5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.page-input::placeholder {
  color: #9CA3AF;
  font-size: 0.813rem;
}

.go-btn {
  padding: 0.5rem 1rem;
  background: #10B981;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.go-btn:hover {
  background: #059669;
  transform: translateY(-1px);
}

.page-range {
  font-size: 0.875rem;
  color: #6B7280;
}

@media (max-width: 768px) {
  .pagination {
    gap: 0.5rem;
  }

  .pagination-btn {
    padding: 0.625rem 1rem;
    font-size: 0.875rem;
  }

  .pagination-btn-edge {
    padding: 0.625rem 0.875rem;
  }

  .pagination-info {
    padding: 0 0.5rem;
  }

  .page-input {
    width: 70px;
    font-size: 0.813rem;
  }
}
</style>
