import { defineStore } from 'pinia'
import { coinApi } from '../utils/api'

const CACHE_TTL = 5 * 60 * 1000 // 5 分鐘

const buildKey = (currency, perPage, page) => `${currency}-${perPage}-${page}`

// 轉換後端回傳的資料格式
const convertToAppFormat = (coin) => ({
  id: coin.id,
  name: coin.name,
  symbol: coin.symbol?.toUpperCase() || '',
  image: coin.image,
  price: coin.current_price,
  change24h: coin.price_change_percentage_24h || 0,
  marketCap: coin.market_cap,
  volume24h: coin.total_volume,
  rank: coin.market_cap_rank
})

export const useCoinsStore = defineStore('coins', {
  state: () => ({
    cache: {},
    fetchedAt: {},
    isFetching: false,
    error: null
  }),
  actions: {
    async fetchCoins({ currency = 'usd', perPage = 50, page = 1, force = false } = {}) {
      const key = buildKey(currency, perPage, page)
      const now = Date.now()
      const cached = this.cache[key]
      if (!force && cached && now - (this.fetchedAt[key] || 0) < CACHE_TTL) {
        return cached
      }

      this.isFetching = true
      this.error = null

      try {
        // 透過後端 proxy 呼叫 CoinGecko API（避免 CORS 問題）
        const response = await coinApi.getList(page, perPage)
        const coins = response.data || response || []
        const formatted = coins.map(convertToAppFormat)
        this.cache[key] = formatted
        this.fetchedAt[key] = now
        return formatted
      } catch (error) {
        console.error('Failed to fetch coins from backend:', error)
        this.error = '無法取得幣種資料，請確認後端服務是否啟動'
        this.cache[key] = []
        this.fetchedAt[key] = now
        return []
      } finally {
        this.isFetching = false
      }
    }
  }
})
