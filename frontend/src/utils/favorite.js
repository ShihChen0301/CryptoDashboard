/**
 * 收藏功能工具函式
 * 使用後端 API 管理用戶的收藏列表
 */
import { favoriteApi } from './api'

// 快取收藏列表（減少 API 請求）
let favoritesCache = null
let lastFetchTime = 0
const CACHE_DURATION = 30000 // 30 秒快取

/**
 * 獲取所有收藏的幣種 ID
 */
export const getFavorites = async () => {
  try {
    // 檢查是否有登入 Token
    const token = localStorage.getItem('authToken')
    if (!token) {
      // 沒有登入，返回空陣列，不發送請求
      favoritesCache = []
      return []
    }

    // 如果快取有效，直接返回
    if (favoritesCache && Date.now() - lastFetchTime < CACHE_DURATION) {
      return favoritesCache.map(f => f.coinId)
    }

    // 從後端獲取
    const response = await favoriteApi.getAll()
    favoritesCache = response.data
    lastFetchTime = Date.now()
    return favoritesCache.map(f => f.coinId)
  } catch (error) {
    console.error('Error getting favorites:', error)
    // 如果是 401/403 錯誤，清除快取
    favoritesCache = []
    return []
  }
}

/**
 * 同步檢查某個幣種是否已收藏（使用快取）
 */
export const isFavorite = (coinId) => {
  if (!favoritesCache) {
    // 沒有快取時，直接返回 false，不觸發載入（避免無限循環）
    return false
  }
  return favoritesCache.some(f => f.coinId === coinId)
}

/**
 * 添加收藏
 */
export const addFavorite = async (coinId) => {
  try {
    const response = await favoriteApi.add(coinId)

    // 直接更新快取，而不是清除（避免所有星星閃爍）
    if (favoritesCache && response.data) {
      favoritesCache.push(response.data)
      lastFetchTime = Date.now()
    }

    // 觸發自定義事件，通知其他組件
    window.dispatchEvent(new CustomEvent('favoritesChanged', {
      detail: { action: 'add', coinId }
    }))

    return true
  } catch (error) {
    console.error('Error adding favorite:', error)
    return false
  }
}

/**
 * 移除收藏
 */
export const removeFavorite = async (coinId) => {
  try {
    // 確認收藏存在
    if (!favoritesCache) {
      await getFavorites()
    }

    const favorite = favoritesCache?.find(f => f.coinId === coinId)
    if (!favorite) {
      console.warn('Favorite not found:', coinId)
      return false
    }

    // 傳遞 coinId（幣種 ID），而不是 favorite.id（數據庫記錄 ID）
    await favoriteApi.remove(coinId)

    // 直接更新快取，而不是清除（避免所有星星閃爍）
    if (favoritesCache) {
      favoritesCache = favoritesCache.filter(f => f.coinId !== coinId)
      lastFetchTime = Date.now()
    }

    // 觸發自定義事件，通知其他組件
    window.dispatchEvent(new CustomEvent('favoritesChanged', {
      detail: { action: 'remove', coinId }
    }))

    return true
  } catch (error) {
    console.error('Error removing favorite:', error)
    return false
  }
}

/**
 * 切換收藏狀態
 */
export const toggleFavorite = async (coinId) => {
  // 先載入快取
  if (!favoritesCache) {
    await getFavorites()
  }

  if (isFavorite(coinId)) {
    return await removeFavorite(coinId)
  } else {
    return await addFavorite(coinId)
  }
}

/**
 * 清空所有收藏
 */
export const clearFavorites = async () => {
  try {
    if (!favoritesCache) {
      await getFavorites()
    }

    // 刪除所有收藏（使用 coinId）
    await Promise.all(favoritesCache.map(f => favoriteApi.remove(f.coinId)))

    // 直接更新快取為空陣列（避免所有星星閃爍）
    favoritesCache = []
    lastFetchTime = Date.now()

    // 觸發自定義事件，通知其他組件
    window.dispatchEvent(new CustomEvent('favoritesChanged', {
      detail: { action: 'clear' }
    }))

    return true
  } catch (error) {
    console.error('Error clearing favorites:', error)
    return false
  }
}

/**
 * 獲取收藏數量
 */
export const getFavoritesCount = async () => {
  const favorites = await getFavorites()
  return favorites.length
}

/**
 * 初始化收藏資料（預載入）
 */
export const initFavorites = async () => {
  return await getFavorites()
}

export default {
  getFavorites,
  isFavorite,
  addFavorite,
  removeFavorite,
  toggleFavorite,
  clearFavorites,
  getFavoritesCount
}
