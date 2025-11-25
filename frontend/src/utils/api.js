/**
 * API 工具函式
 * 用於處理 API 請求的基礎設定
 */

// API 基礎 URL (這裡使用假資料，實際應該指向真實 API)
const BASE_URL = import.meta.env.VITE_API_URL || 'https://api.example.com'

/**
 * 通用 API 請求函式
 */
export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('authToken')

  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  }

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers
    }
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('API Request Error:', error)
    throw error
  }
}

/**
 * GET 請求
 */
export const get = (endpoint) => {
  return apiRequest(endpoint, { method: 'GET' })
}

/**
 * POST 請求
 */
export const post = (endpoint, data) => {
  return apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

/**
 * PUT 請求
 */
export const put = (endpoint, data) => {
  return apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}

/**
 * DELETE 請求
 */
export const del = (endpoint) => {
  return apiRequest(endpoint, { method: 'DELETE' })
}

export default {
  get,
  post,
  put,
  del
}
