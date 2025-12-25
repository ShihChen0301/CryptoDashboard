/**
 * CoinGecko API 服務
 * 文檔: https://www.coingecko.com/en/api/documentation
 *
 * Demo API Key 限制: 每分鐘 30 次請求
 */

const BASE_URL = 'https://api.coingecko.com/api/v3'
const API_KEY = import.meta.env.VITE_COINGECKO_API_KEY || ''
const REQUEST_TIMEOUT = 6000 // ms (優化：從 6000失敗切換)
const MAX_RETRIES = 1
const RETRY_DELAY = 200 // ms (優化：從 500 降到 200，加快重試速度)

/**
 * 通用 API 請求函數
 */
const fetchCoinGecko = async (endpoint, params = {}) => {
  const url = new URL(`${BASE_URL}${endpoint}`)

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, value)
    }
  })

  const headers = {}
  if (API_KEY) {
    headers['x-cg-demo-api-key'] = API_KEY
  }

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const controller = new AbortController()
    const timeoutId = setTimeout(
      () => controller.abort(new Error('CoinGecko request timeout')),
      REQUEST_TIMEOUT,
    )

    try {
      const response = await fetch(url.toString(), { headers, signal: controller.signal })
      clearTimeout(timeoutId)

      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait a moment.')
      }

      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      clearTimeout(timeoutId)
      const isLastAttempt = attempt === MAX_RETRIES
      if (isLastAttempt) {
        console.error('CoinGecko API request failed (final):', error)
        throw error
      }
      console.warn(`CoinGecko request failed (attempt ${attempt + 1}), retrying...`, error)
      await sleep(RETRY_DELAY)
    }
  }
}

/**
 * 取得幣種列表 (含市場數據)
 * @param {string} currency - 貨幣單位 (usd, twd, etc.)
 * @param {number} perPage - 每頁數量
 * @param {number} page - 頁碼
 */
export const getCoinsList = async (currency = 'usd', perPage = 100, page = 1) => {
  return await fetchCoinGecko('/coins/markets', {
    vs_currency: currency,
    order: 'market_cap_desc',
    per_page: perPage,
    page: page,
    sparkline: false,
    price_change_percentage: '24h',
  })
}

/**
 * 取得單一幣種詳細資訊
 * @param {string} coinId - 幣種 ID (例: 'bitcoin')
 */
export const getCoinDetails = async (coinId) => {
  return await fetchCoinGecko(`/coins/${coinId}`, {
    localization: false,
    tickers: false,
    market_data: true,
    community_data: false,
    developer_data: false,
  })
}

/**
 * 取得幣種歷史價格數據 (圖表用)
 * @param {string} coinId - 幣種 ID
 * @param {string} currency - 貨幣單位
 * @param {number} days - 天數 (1, 7, 30, 90, 365, max)
 */
export const getCoinMarketChart = async (coinId, currency = 'usd', days = 30) => {
  return await fetchCoinGecko(`/coins/${coinId}/market_chart`, {
    vs_currency: currency,
    days: days,
    interval: days <= 1 ? 'hourly' : 'daily',
  })
}

/**
 * 取得多個幣種的簡易價格
 * @param {string[]} coinIds - 幣種 ID 陣列
 * @param {string} currency - 貨幣單位
 */
export const getSimplePrice = async (coinIds, currency = 'usd') => {
  return await fetchCoinGecko('/simple/price', {
    ids: coinIds.join(','),
    vs_currencies: currency,
    include_24hr_change: true,
    include_market_cap: true,
    include_24hr_vol: true,
  })
}

/**
 * 搜尋幣種
 * @param {string} query - 搜尋關鍵字
 */
export const searchCoins = async (query) => {
  return await fetchCoinGecko('/search', { query })
}

/**
 * 取得全球市場數據
 */
export const getGlobalData = async () => {
  return await fetchCoinGecko('/global')
}

/**
 * 取得趨勢幣種
 */
export const getTrendingCoins = async () => {
  return await fetchCoinGecko('/search/trending')
}

// ==================== 數據轉換函數 ====================

/**
 * 將 CoinGecko 幣種數據轉換為應用格式
 */
export const convertToAppFormat = (coin) => {
  return {
    id: coin.id,
    symbol: coin.symbol.toUpperCase(),
    name: coin.name,
    price: coin.current_price,
    change24h: coin.price_change_percentage_24h || 0,
    marketCap: coin.market_cap,
    volume24h: coin.total_volume,
    image: coin.image,
    high24h: coin.high_24h,
    low24h: coin.low_24h,
    circulatingSupply: coin.circulating_supply,
    totalSupply: coin.total_supply,
    ath: coin.ath,
    athDate: coin.ath_date,
  }
}

/**
 * 將 CoinGecko 圖表數據轉換為應用格式
 */
export const convertChartData = (marketChart) => {
  if (!marketChart || !marketChart.prices) {
    return []
  }

  return marketChart.prices.map(([timestamp, price]) => ({
    date: new Date(timestamp).toISOString().split('T')[0],
    price: price,
  }))
}

export default {
  getCoinsList,
  getCoinDetails,
  getCoinMarketChart,
  getSimplePrice,
  searchCoins,
  getGlobalData,
  getTrendingCoins,
  convertToAppFormat,
  convertChartData,
}
