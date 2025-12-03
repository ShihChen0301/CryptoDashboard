// 統一的 API 請求工具
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

// 取得 Token
const getAuthToken = () => {
  return localStorage.getItem('authToken')
}

// 通用請求函數
export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  const token = getAuthToken()

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  }

  const response = await fetch(url, config)

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || 'API request failed')
  }

  return response.json()
}

// 認證 API
export const authApi = {
  register: (data) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  logout: () =>
    apiRequest('/auth/logout', {
      method: 'POST',
    }),
}

// 收藏 API
export const favoriteApi = {
  getAll: () => apiRequest('/favorites'),

  add: (coinId) =>
    apiRequest(`/favorites?coinId=${encodeURIComponent(coinId)}`, {
      method: 'POST',
    }),

  remove: (coinId) =>
    apiRequest(`/favorites/${encodeURIComponent(coinId)}`, {
      method: 'DELETE',
    }),
}

// 幣種 API
export const coinApi = {
  getList: (page = 1, perPage = 50, orderBy = 'market_cap_desc') =>
    apiRequest(`/coins?page=${page}&perPage=${perPage}&orderBy=${orderBy}`),
  getDetail: (coinId) => apiRequest(`/coins/${encodeURIComponent(coinId)}`),
}

// 管理員 API
export const adminApi = {
  getStats: () => apiRequest('/admin/stats'),
  getAllUsers: () => apiRequest('/admin/users'),
}

// 公告 API
export const announcementApi = {
  // 取得啟用的公告（所有用戶可見）
  getActive: () => apiRequest('/announcements'),

  // 管理員專用
  getAll: () => apiRequest('/admin/announcements'),
  create: (data) =>
    apiRequest('/admin/announcements', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    apiRequest(`/admin/announcements/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    apiRequest(`/admin/announcements/${id}`, {
      method: 'DELETE',
    }),
}
