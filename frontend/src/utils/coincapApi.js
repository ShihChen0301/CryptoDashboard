/**
 * CoinCap API 服務
 * 作為 CoinGecko 的備援數據來源
 * 文檔: https://docs.coincap.io/
 */

const BASE_URL = 'https://api.coincap.io/v2'
const REQUEST_TIMEOUT = 3000 // ms (優化：從 6000 降到 3000，與 CoinGecko 一致)

/**
 * 通用 API 請求函數
 */
const fetchCoinCap = async (endpoint, params = {}) => {
  const url = new URL(`${BASE_URL}${endpoint}`)
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null) {
      url.searchParams.append(key, params[key])
    }
  })

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(new Error('CoinCap request timeout')), REQUEST_TIMEOUT)

  const response = await fetch(url.toString(), { signal: controller.signal }).catch((error) => {
    clearTimeout(timeoutId)
    throw error
  })
  clearTimeout(timeoutId)

  if (!response.ok) {
    throw new Error(`CoinCap API error: ${response.status}`)
  }

  const result = await response.json()
  return result.data
}

/**
 * CoinGecko ID 到 CoinCap ID 的映射
 */
const idMapping = {
  'bitcoin': 'bitcoin',
  'ethereum': 'ethereum',
  'solana': 'solana',
  'cardano': 'cardano',
  'ripple': 'xrp',
  'polkadot': 'polkadot',
  'dogecoin': 'dogecoin',
  'avalanche-2': 'avalanche',
  'binancecoin': 'binance-coin',
  'chainlink': 'chainlink',
  'matic-network': 'polygon',
  'litecoin': 'litecoin',
  'uniswap': 'uniswap',
  'cosmos': 'cosmos',
  'stellar': 'stellar',
  'algorand': 'algorand',
  'vechain': 'vechain',
  'tron': 'tron',
  'the-open-network': 'toncoin',
  'shiba-inu': 'shiba-inu',
  'aptos': 'aptos',
  'near': 'near-protocol',
  'arbitrum': 'arbitrum',
  'optimism': 'optimism'
}

/**
 * 將 CoinGecko ID 轉換為 CoinCap ID
 */
const toCoinCapId = (geckoId) => {
  return idMapping[geckoId] || geckoId
}

/**
 * 取得幣種列表
 * @param {number} limit - 數量限制
 */
export const getCoinsList = async (limit = 50) => {
  return await fetchCoinCap('/assets', { limit })
}

/**
 * 取得單一幣種詳情
 * @param {string} coinId - CoinGecko 格式的幣種 ID
 */
export const getCoinDetails = async (coinId) => {
  const coincapId = toCoinCapId(coinId)
  return await fetchCoinCap(`/assets/${coincapId}`)
}

/**
 * 取得歷史價格數據
 * @param {string} coinId - CoinGecko 格式的幣種 ID
 * @param {number} days - 天數
 */
export const getCoinHistory = async (coinId, days = 30) => {
  const coincapId = toCoinCapId(coinId)

  // 計算時間範圍
  const end = Date.now()
  const start = end - (days * 24 * 60 * 60 * 1000)

  // 根據天數選擇間隔
  let interval = 'd1' // 每日
  if (days <= 1) {
    interval = 'h1' // 每小時
  } else if (days <= 7) {
    interval = 'h12' // 每 12 小時
  }

  return await fetchCoinCap(`/assets/${coincapId}/history`, {
    interval,
    start,
    end
  })
}

/**
 * 取得全球市場數據（從前幾大幣種計算）
 */
export const getGlobalData = async () => {
  const assets = await fetchCoinCap('/assets', { limit: 100 })

  let totalMarketCap = 0
  let totalVolume = 0
  let btcMarketCap = 0

  assets.forEach(asset => {
    const marketCap = parseFloat(asset.marketCapUsd) || 0
    const volume = parseFloat(asset.volumeUsd24Hr) || 0

    totalMarketCap += marketCap
    totalVolume += volume

    if (asset.id === 'bitcoin') {
      btcMarketCap = marketCap
    }
  })

  return {
    totalMarketCap,
    totalVolume,
    btcDominance: totalMarketCap > 0 ? (btcMarketCap / totalMarketCap) * 100 : 0
  }
}

// ==================== 數據轉換函數 ====================

/**
 * 將 CoinCap 幣種數據轉換為應用格式
 */
export const convertToAppFormat = (asset) => {
  return {
    id: asset.id,
    symbol: asset.symbol,
    name: asset.name,
    price: parseFloat(asset.priceUsd) || 0,
    change24h: parseFloat(asset.changePercent24Hr) || 0,
    marketCap: parseFloat(asset.marketCapUsd) || 0,
    volume24h: parseFloat(asset.volumeUsd24Hr) || 0,
    image: `https://assets.coincap.io/assets/icons/${asset.symbol.toLowerCase()}@2x.png`,
    // CoinCap 沒有提供 high/low，使用估算值
    high24h: null,
    low24h: null,
    circulatingSupply: parseFloat(asset.supply) || 0,
    totalSupply: parseFloat(asset.maxSupply) || null
  }
}

/**
 * 將 CoinCap 歷史數據轉換為圖表格式
 */
export const convertChartData = (history) => {
  return history.map(item => ({
    date: new Date(item.time).toISOString().split('T')[0],
    price: parseFloat(item.priceUsd)
  }))
}

export default {
  getCoinsList,
  getCoinDetails,
  getCoinHistory,
  getGlobalData,
  convertToAppFormat,
  convertChartData
}
