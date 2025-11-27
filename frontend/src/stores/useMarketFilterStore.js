import { defineStore } from 'pinia'

export const useMarketFilterStore = defineStore('marketFilter', {
  state: () => ({
    // 篩選條件
    filters: {
      priceMin: null,
      priceMax: null,
      marketCapMin: null,
      marketCapMax: null,
      volume24hMin: null,
      priceChange24hMin: null,
      priceChange24hMax: null,
      categories: [] // 幣種分類標籤
    },

    // 排序設定
    sortBy: '',
    sortOrder: 'asc',

    // 搜尋關鍵字
    searchQuery: '',

    // 儲存的篩選預設
    savedPresets: []
  }),

  getters: {
    // 是否有啟用任何篩選
    hasActiveFilters: (state) => {
      return (
        state.filters.priceMin !== null ||
        state.filters.priceMax !== null ||
        state.filters.marketCapMin !== null ||
        state.filters.marketCapMax !== null ||
        state.filters.volume24hMin !== null ||
        state.filters.priceChange24hMin !== null ||
        state.filters.priceChange24hMax !== null ||
        state.filters.categories.length > 0
      )
    },

    // 取得篩選條件數量
    activeFilterCount: (state) => {
      let count = 0
      if (state.filters.priceMin !== null || state.filters.priceMax !== null) count++
      if (state.filters.marketCapMin !== null || state.filters.marketCapMax !== null) count++
      if (state.filters.volume24hMin !== null) count++
      if (state.filters.priceChange24hMin !== null || state.filters.priceChange24hMax !== null)
        count++
      if (state.filters.categories.length > 0) count++
      return count
    }
  },

  actions: {
    // 設定價格範圍
    setPriceRange(min, max) {
      this.filters.priceMin = min
      this.filters.priceMax = max
    },

    // 設定市值範圍
    setMarketCapRange(min, max) {
      this.filters.marketCapMin = min
      this.filters.marketCapMax = max
    },

    // 設定 24h 交易量最小值
    setVolume24hMin(value) {
      this.filters.volume24hMin = value
    },

    // 設定 24h 漲跌幅範圍
    setPriceChange24hRange(min, max) {
      this.filters.priceChange24hMin = min
      this.filters.priceChange24hMax = max
    },

    // 設定分類標籤
    setCategories(categories) {
      this.filters.categories = categories
    },

    // 切換分類標籤
    toggleCategory(category) {
      const index = this.filters.categories.indexOf(category)
      if (index > -1) {
        this.filters.categories.splice(index, 1)
      } else {
        this.filters.categories.push(category)
      }
    },

    // 設定排序
    setSort(field, order = 'asc') {
      this.sortBy = field
      this.sortOrder = order
    },

    // 設定搜尋關鍵字
    setSearchQuery(query) {
      this.searchQuery = query
    },

    // 清空所有篩選
    clearFilters() {
      this.filters = {
        priceMin: null,
        priceMax: null,
        marketCapMin: null,
        marketCapMax: null,
        volume24hMin: null,
        priceChange24hMin: null,
        priceChange24hMax: null,
        categories: []
      }
      this.searchQuery = ''
    },

    // 儲存當前篩選為預設
    savePreset(name) {
      const preset = {
        id: Date.now(),
        name,
        filters: { ...this.filters },
        sortBy: this.sortBy,
        sortOrder: this.sortOrder,
        createdAt: new Date().toISOString()
      }

      this.savedPresets.push(preset)
      this.saveTolocalStorage()
    },

    // 載入預設
    loadPreset(presetId) {
      const preset = this.savedPresets.find((p) => p.id === presetId)
      if (preset) {
        this.filters = { ...preset.filters }
        this.sortBy = preset.sortBy
        this.sortOrder = preset.sortOrder
      }
    },

    // 刪除預設
    deletePreset(presetId) {
      this.savedPresets = this.savedPresets.filter((p) => p.id !== presetId)
      this.saveToLocalStorage()
    },

    // 儲存到 localStorage
    saveToLocalStorage() {
      localStorage.setItem('market_filter_presets', JSON.stringify(this.savedPresets))
    },

    // 從 localStorage 載入
    loadFromLocalStorage() {
      const saved = localStorage.getItem('market_filter_presets')
      if (saved) {
        try {
          this.savedPresets = JSON.parse(saved)
        } catch (error) {
          console.error('Failed to load market filter presets:', error)
        }
      }
    },

    // 應用篩選到幣種列表
    applyFilters(coins) {
      let result = [...coins]

      // 搜尋過濾
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        result = result.filter(
          (coin) =>
            coin.name.toLowerCase().includes(query) || coin.symbol.toLowerCase().includes(query)
        )
      }

      // 價格篩選
      if (this.filters.priceMin !== null) {
        result = result.filter((coin) => coin.currentPrice >= this.filters.priceMin)
      }
      if (this.filters.priceMax !== null) {
        result = result.filter((coin) => coin.currentPrice <= this.filters.priceMax)
      }

      // 市值篩選
      if (this.filters.marketCapMin !== null) {
        result = result.filter((coin) => coin.marketCap >= this.filters.marketCapMin)
      }
      if (this.filters.marketCapMax !== null) {
        result = result.filter((coin) => coin.marketCap <= this.filters.marketCapMax)
      }

      // 24h 交易量篩選
      if (this.filters.volume24hMin !== null) {
        result = result.filter((coin) => coin.volume24h >= this.filters.volume24hMin)
      }

      // 24h 漲跌幅篩選
      if (this.filters.priceChange24hMin !== null) {
        result = result.filter((coin) => coin.priceChange24h >= this.filters.priceChange24hMin)
      }
      if (this.filters.priceChange24hMax !== null) {
        result = result.filter((coin) => coin.priceChange24h <= this.filters.priceChange24hMax)
      }

      // 排序
      if (this.sortBy) {
        result = result.sort((a, b) => {
          let aVal = a[this.sortBy]
          let bVal = b[this.sortBy]

          if (typeof aVal === 'string') {
            aVal = aVal.toLowerCase()
            bVal = bVal.toLowerCase()
          }

          if (this.sortOrder === 'asc') {
            return aVal > bVal ? 1 : aVal < bVal ? -1 : 0
          } else {
            return aVal < bVal ? 1 : aVal > bVal ? -1 : 0
          }
        })
      }

      return result
    }
  }
})
