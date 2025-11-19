/**
 * 模擬用戶認證
 * 在連接後端 API 之前使用
 * TODO: 連接 MySQL 後端後可移除此文件
 */

// 模擬用戶資訊
const mockUser = {
  id: '1',
  username: 'demo_user',
  email: 'demo@example.com',
  avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=4F46E5&color=fff',
  joinDate: '2024-01-15',
  favoriteCoins: [],
  role: 'user'
}

// 模擬管理員帳號
const mockAdmin = {
  id: '2',
  username: 'admin',
  email: 'admin@example.com',
  avatar: 'https://ui-avatars.com/api/?name=Admin&background=dc2626&color=fff',
  joinDate: '2024-01-01',
  favoriteCoins: [],
  role: 'admin'
}

/**
 * 模擬登入驗證
 * 測試帳號:
 * - 一般用戶: demo@example.com / password
 * - 管理員: admin@example.com / admin123
 */
export const mockLogin = (email, password) => {
  // 管理員登入
  if (email === 'admin@example.com' && password === 'admin123') {
    return {
      success: true,
      token: 'mock-jwt-token-admin-' + Date.now(),
      user: mockAdmin
    }
  }
  // 一般用戶登入
  if (email === 'demo@example.com' && password === 'password') {
    return {
      success: true,
      token: 'mock-jwt-token-' + Date.now(),
      user: mockUser
    }
  }
  return {
    success: false,
    message: 'Invalid email or password'
  }
}

/**
 * 模擬註冊
 */
export const mockRegister = (username, email, password) => {
  // 模擬註冊總是成功
  return {
    success: true,
    message: 'Registration successful',
    user: {
      ...mockUser,
      id: Date.now().toString(),
      username,
      email,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=4F46E5&color=fff`
    }
  }
}

export default {
  mockLogin,
  mockRegister
}
