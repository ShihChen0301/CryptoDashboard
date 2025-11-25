import { defineStore } from 'pinia'
import { getCoinsList, convertToAppFormat } from '../utils/coingeckoApi'
import * as coincapApi from '../utils/coincapApi'

const CACHE_TTL = 5 * 60 * 1000 // 5 分鐘

const buildKey = (currency, perPage, page) => `${currency}-${perPage}-${page}`

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
        const coins = await getCoinsList(currency, perPage, page)
        const formatted = coins.map(convertToAppFormat)
        this.cache[key] = formatted
        this.fetchedAt[key] = now
        return formatted
      } catch (error) {
        console.error('CoinGecko coins fetch failed, trying CoinCap...', error)
        try {
          const fallback = await coincapApi.getCoinsList(perPage)
          const formatted = fallback.map(coincapApi.convertToAppFormat)
          this.cache[key] = formatted
          this.fetchedAt[key] = now
          this.error = '使用備援資料來源（CoinCap）'
          return formatted
        } catch (fallbackError) {
          console.error('CoinCap fallback failed:', fallbackError)
          this.error = 'CoinGecko / CoinCap 皆無法取得資料'
          this.cache[key] = []
          this.fetchedAt[key] = now
          return []
        }
      } finally {
        this.isFetching = false
      }
    }
  }
})
