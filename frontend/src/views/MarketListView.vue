<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCoinsStore } from '../stores/useCoinsStore'
import CoinTable from '../components/CoinTable.vue'

const { t } = useI18n()
const searchQuery = ref('')
const allCoins = ref([])
const sortBy = ref('')
const sortOrder = ref('asc')
const isLoading = ref(true)
const error = ref(null)

// 分頁狀態
const currentPage = ref(1)
const perPage = ref(50)
const totalPages = ref(100) // CoinGecko 支援最多 100 頁
const coinsStore = useCoinsStore()

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
        <h1>{{ t('market.title') }}</h1>
        <p>{{ t('market.subtitle') }}</p>
      </div>

      <div class="search-box">
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="t('market.searchPlaceholder')"
          class="search-input"
        />
      </div>
    </div>

    <!-- 載入中 -->
    <div v-if="isLoading" class="loading-state">
      <p>{{ t('market.loading') }}</p>
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
      <p>{{ t('market.noResults', { query: searchQuery }) }}</p>
    </div>

    <!-- 分頁控制 -->
    <div v-if="!isLoading && !searchQuery" class="pagination">
      <!-- 第一頁按鈕 -->
      <button
        @click="currentPage = 1"
        :disabled="currentPage === 1"
        class="pagination-btn pagination-btn-edge"
      >
        {{ t('market.pagination.first') }}
      </button>

      <!-- 上一頁按鈕 -->
      <button
        @click="currentPage--"
        :disabled="currentPage === 1"
        class="pagination-btn"
      >
        {{ t('market.pagination.previous') }}
      </button>

      <!-- 頁碼資訊與輸入框 -->
      <div class="pagination-info">
        <div class="page-display">
          <span>{{ t('market.pagination.page', { current: currentPage, total: totalPages }) }}</span>
        </div>
        <div class="page-jump">
          <input
            v-model="pageInput"
            @input="handlePageInput"
            @keyup.enter="goToPage"
            type="text"
            inputmode="numeric"
            :placeholder="t('market.pagination.jumpTo')"
            class="page-input"
            maxlength="3"
          />
          <button @click="goToPage" class="go-btn">{{ t('market.pagination.go') }}</button>
        </div>
        <span class="page-range">
          {{ t('market.pagination.range', { start: (currentPage - 1) * perPage + 1, end: currentPage * perPage }) }}
        </span>
      </div>

      <!-- 下一頁按鈕 -->
      <button
        @click="currentPage++"
        :disabled="currentPage === totalPages"
        class="pagination-btn"
      >
        {{ t('market.pagination.next') }}
      </button>

      <!-- 最後一頁按鈕 -->
      <button
        @click="currentPage = totalPages"
        :disabled="currentPage === totalPages"
        class="pagination-btn pagination-btn-edge"
      >
        {{ t('market.pagination.last') }}
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
