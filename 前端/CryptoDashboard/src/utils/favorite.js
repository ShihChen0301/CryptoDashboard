/**
 * 收藏功能工具函式
 * 使用 localStorage 儲存用戶的收藏列表
 */

const STORAGE_KEY = 'crypto_favorites'

/**
 * 獲取所有收藏的幣種 ID
 */
export const getFavorites = () => {
  try {
    const favorites = localStorage.getItem(STORAGE_KEY)
    return favorites ? JSON.parse(favorites) : []
  } catch (error) {
    console.error('Error getting favorites:', error)
    return []
  }
}

/**
 * 檢查某個幣種是否已收藏
 */
export const isFavorite = (coinId) => {
  const favorites = getFavorites()
  return favorites.includes(coinId)
}

/**
 * 添加收藏
 */
export const addFavorite = (coinId) => {
  try {
    const favorites = getFavorites()

    if (!favorites.includes(coinId)) {
      favorites.push(coinId)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))

      // 觸發自定義事件，通知其他組件
      window.dispatchEvent(new CustomEvent('favoritesChanged', {
        detail: { favorites }
      }))

      return true
    }

    return false
  } catch (error) {
    console.error('Error adding favorite:', error)
    return false
  }
}

/**
 * 移除收藏
 */
export const removeFavorite = (coinId) => {
  try {
    const favorites = getFavorites()
    const index = favorites.indexOf(coinId)

    if (index > -1) {
      favorites.splice(index, 1)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))

      // 觸發自定義事件，通知其他組件
      window.dispatchEvent(new CustomEvent('favoritesChanged', {
        detail: { favorites }
      }))

      return true
    }

    return false
  } catch (error) {
    console.error('Error removing favorite:', error)
    return false
  }
}

/**
 * 切換收藏狀態
 */
export const toggleFavorite = (coinId) => {
  if (isFavorite(coinId)) {
    return removeFavorite(coinId)
  } else {
    return addFavorite(coinId)
  }
}

/**
 * 清空所有收藏
 */
export const clearFavorites = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]))

    // 觸發自定義事件，通知其他組件
    window.dispatchEvent(new CustomEvent('favoritesChanged', {
      detail: { favorites: [] }
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
export const getFavoritesCount = () => {
  return getFavorites().length
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
