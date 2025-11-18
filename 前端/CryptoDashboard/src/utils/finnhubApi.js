/**
 * Finnhub API 服務
 * 文檔: https://finnhub.io/docs/api
 *
 * 使用方式:
 * 1. 在 .env 中設定 VITE_FINNHUB_API_KEY=你的API金鑰
 * 2. 或直接在下方替換 API_KEY
 */

// API 設定
const API_KEY = import.meta.env.VITE_FINNHUB_API_KEY || 'YOUR_API_KEY_HERE'
const BASE_URL = 'https://finnhub.io/api/v1'

/**
 * 通用 API 請求函數
 */
const fetchFinnhub = async (endpoint, params = {}) => {
  const url = new URL(`${BASE_URL}${endpoint}`)
  url.searchParams.append('token', API_KEY)

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value)
  })

  try {
    const response = await fetch(url.toString())

    if (!response.ok) {
      throw new Error(`Finnhub API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Finnhub API request failed:', error)
    throw error
  }
}

/**
 * 取得支援的加密貨幣交易對
 * @param {string} exchange - 交易所名稱 (例: 'binance', 'coinbase')
 */
export const getCryptoSymbols = async (exchange = 'binance') => {
  return await fetchFinnhub('/crypto/symbol', { exchange })
}

/**
 * 取得加密貨幣即時報價
 * @param {string} symbol - 交易對符號 (例: 'BINANCE:BTCUSDT')
 */
export const getCryptoQuote = async (symbol) => {
  return await fetchFinnhub('/quote', { symbol })
}

/**
 * 取得加密貨幣 K線數據
 * @param {string} symbol - 交易對符號
 * @param {string} resolution - 時間間隔 (1, 5, 15, 30, 60, D, W, M)
 * @param {number} from - 開始時間 (Unix timestamp)
 * @param {number} to - 結束時間 (Unix timestamp)
 */
export const getCryptoCandles = async (symbol, resolution = 'D', from, to) => {
  return await fetchFinnhub('/crypto/candle', {
    symbol,
    resolution,
    from,
    to
  })
}

/**
 * 取得多個幣種的報價
 * @param {string[]} symbols - 交易對符號陣列
 */
export const getMultipleQuotes = async (symbols) => {
  const promises = symbols.map(symbol => getCryptoQuote(symbol))
  const results = await Promise.all(promises)

  return symbols.map((symbol, index) => ({
    symbol,
    ...results[index]
  }))
}

// ==================== 測試函數 ====================

/**
 * 測試 API 連線
 * 在瀏覽器控制台執行: testFinnhubConnection()
 */
export const testFinnhubConnection = async () => {
  console.log('Testing Finnhub API connection...')

  try {
    // 測試 1: 取得 Binance 的加密貨幣交易對
    console.log('\n1. Fetching crypto symbols from Binance...')
    const symbols = await getCryptoSymbols('binance')
    console.log(`   Found ${symbols.length} trading pairs`)
    console.log('   Sample:', symbols.slice(0, 3))

    // 測試 2: 取得 BTC 即時報價
    console.log('\n2. Fetching BTC quote...')
    const btcQuote = await getCryptoQuote('BINANCE:BTCUSDT')
    console.log('   BTC Quote:', btcQuote)

    // 測試 3: 取得 BTC 歷史 K線數據 (過去 7 天)
    console.log('\n3. Fetching BTC candles (7 days)...')
    const now = Math.floor(Date.now() / 1000)
    const weekAgo = now - (7 * 24 * 60 * 60)
    const candles = await getCryptoCandles('BINANCE:BTCUSDT', 'D', weekAgo, now)
    console.log('   Candle data:', candles)

    console.log('\n✅ Finnhub API connection successful!')

    return {
      success: true,
      symbols: symbols.length,
      btcQuote,
      candles
    }
  } catch (error) {
    console.error('\n❌ Finnhub API test failed:', error.message)
    return {
      success: false,
      error: error.message
    }
  }
}

// 將測試函數掛載到 window 方便在控制台測試
if (typeof window !== 'undefined') {
  window.testFinnhubConnection = testFinnhubConnection
}

// ==================== 數據轉換函數 ====================

/**
 * 將 Finnhub K線數據轉換為圖表格式
 */
export const convertCandlesToChartData = (candles) => {
  if (!candles || candles.s !== 'ok') {
    return []
  }

  return candles.t.map((timestamp, index) => ({
    date: new Date(timestamp * 1000).toISOString().split('T')[0],
    price: candles.c[index], // 收盤價
    open: candles.o[index],
    high: candles.h[index],
    low: candles.l[index],
    volume: candles.v[index]
  }))
}

/**
 * 將 Finnhub 報價轉換為應用格式
 */
export const convertQuoteToCoin = (symbol, quote) => {
  const symbolParts = symbol.split(':')
  const pair = symbolParts[1] || symbol
  const coinSymbol = pair.replace('USDT', '').replace('USD', '')

  return {
    id: coinSymbol.toLowerCase(),
    symbol: coinSymbol,
    name: coinSymbol, // 需要另外映射名稱
    price: quote.c, // 當前價格
    change24h: quote.dp, // 24h 變化百分比
    open: quote.o,
    high: quote.h,
    low: quote.l,
    previousClose: quote.pc
  }
}

export default {
  getCryptoSymbols,
  getCryptoQuote,
  getCryptoCandles,
  getMultipleQuotes,
  testFinnhubConnection,
  convertCandlesToChartData,
  convertQuoteToCoin
}
