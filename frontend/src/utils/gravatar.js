/**
 * Gravatar 工具函數
 * 根據 email 生成 Gravatar 頭像 URL
 */
import CryptoJS from 'crypto-js'

/**
 * 生成 Gravatar URL
 * @param {string} email - 用戶 email
 * @param {number} size - 圖片大小（默認 200）
 * @param {string} defaultImage - 默認圖片類型（默認 'identicon'）
 * @returns {string} Gravatar URL
 */
export function getGravatarUrl(email, size = 200, defaultImage = 'identicon') {
  if (!email) {
    return `https://www.gravatar.com/avatar/?s=${size}&d=${defaultImage}`
  }

  // 將 email 轉為小寫並去除空白
  const normalizedEmail = email.trim().toLowerCase()

  // 使用 MD5 加密
  const hash = CryptoJS.MD5(normalizedEmail).toString()

  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=${defaultImage}`
}

/**
 * 從 user 物件獲取頭像 URL
 * 優先使用 avatarUrl，沒有則使用 Gravatar
 * @param {object} user - 用戶物件
 * @returns {string} 頭像 URL
 */
export function getUserAvatar(user) {
  if (!user) {
    return getGravatarUrl('')
  }

  // 如果有 avatarUrl 且不為空，使用它
  if (user.avatarUrl && user.avatarUrl.trim()) {
    return user.avatarUrl
  }

  // 否則使用 Gravatar
  return getGravatarUrl(user.email)
}
