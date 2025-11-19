/**
 * 格式化工具函式
 * 用於數字、貨幣、日期等格式化
 */

/**
 * 格式化數字 (K, M, B)
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined) return '-'

  const absNum = Math.abs(num)

  if (absNum >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(2) + 'B'
  }
  if (absNum >= 1_000_000) {
    return (num / 1_000_000).toFixed(2) + 'M'
  }
  if (absNum >= 1_000) {
    return (num / 1_000).toFixed(2) + 'K'
  }

  return num.toFixed(2)
}

/**
 * 格式化價格 (美元)
 */
export const formatPrice = (price) => {
  if (price === null || price === undefined) return '-'

  if (price >= 1) {
    return '$' + price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  // 處理極小價格（如 SHIB）：動態計算需要的小數位
  if (price > 0 && price < 0.0001) {
    // 找出第一個非零數字的位置，再多顯示 2 位
    const priceStr = price.toFixed(20)
    const match = priceStr.match(/0\.0*[1-9]/)
    if (match) {
      const decimals = match[0].length - 1 + 2 // 小數點後零的數量 + 2 位有效數字
      return '$' + price.toFixed(Math.min(decimals, 10))
    }
  }

  // 小於 1 但不是極小的價格
  return '$' + price.toFixed(6)
}

/**
 * 格式化百分比
 */
export const formatPercentage = (percent, decimals = 2) => {
  if (percent === null || percent === undefined) return '-'

  const sign = percent >= 0 ? '+' : ''
  return sign + percent.toFixed(decimals) + '%'
}

/**
 * 格式化市值
 */
export const formatMarketCap = (marketCap) => {
  return formatNumber(marketCap)
}

/**
 * 格式化交易量
 */
export const formatVolume = (volume) => {
  return formatNumber(volume)
}

/**
 * 格式化日期
 */
export const formatDate = (date, options = {}) => {
  if (!date) return '-'

  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }

  const dateObj = typeof date === 'string' ? new Date(date) : date

  return dateObj.toLocaleDateString('en-US', { ...defaultOptions, ...options })
}

/**
 * 格式化時間
 */
export const formatTime = (date) => {
  if (!date) return '-'

  const dateObj = typeof date === 'string' ? new Date(date) : date

  return dateObj.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * 格式化日期時間
 */
export const formatDateTime = (date) => {
  if (!date) return '-'

  return `${formatDate(date)} ${formatTime(date)}`
}

/**
 * 格式化相對時間 (如 "2 hours ago")
 */
export const formatRelativeTime = (date) => {
  if (!date) return '-'

  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffMs = now - dateObj
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffDay > 7) {
    return formatDate(dateObj)
  }
  if (diffDay > 0) {
    return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`
  }
  if (diffHour > 0) {
    return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`
  }
  if (diffMin > 0) {
    return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`
  }

  return 'Just now'
}

/**
 * 截斷文字
 */
export const truncate = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

/**
 * 獲取價格變化的顏色類別
 */
export const getPriceChangeClass = (change) => {
  if (change > 0) return 'text-success'
  if (change < 0) return 'text-danger'
  return ''
}

/**
 * 獲取價格變化的顏色
 */
export const getPriceChangeColor = (change) => {
  if (change > 0) return 'var(--color-success)'
  if (change < 0) return 'var(--color-danger)'
  return 'var(--color-text-secondary)'
}

export default {
  formatNumber,
  formatPrice,
  formatPercentage,
  formatMarketCap,
  formatVolume,
  formatDate,
  formatTime,
  formatDateTime,
  formatRelativeTime,
  truncate,
  getPriceChangeClass,
  getPriceChangeColor
}
