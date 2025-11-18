// 假資料：加密貨幣列表
export const cryptoCoins = [
  {
    id: 'bitcoin',
    symbol: 'BTC',
    name: 'Bitcoin',
    price: 43250.50,
    change24h: 2.35,
    marketCap: 845000000000,
    volume24h: 25000000000,
    image: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png'
  },
  {
    id: 'ethereum',
    symbol: 'ETH',
    name: 'Ethereum',
    price: 2280.75,
    change24h: -1.25,
    marketCap: 274000000000,
    volume24h: 15000000000,
    image: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
  },
  {
    id: 'solana',
    symbol: 'SOL',
    name: 'Solana',
    price: 98.45,
    change24h: 5.67,
    marketCap: 42000000000,
    volume24h: 3000000000,
    image: 'https://cryptologos.cc/logos/solana-sol-logo.png'
  },
  {
    id: 'cardano',
    symbol: 'ADA',
    name: 'Cardano',
    price: 0.52,
    change24h: 1.15,
    marketCap: 18000000000,
    volume24h: 500000000,
    image: 'https://cryptologos.cc/logos/cardano-ada-logo.png'
  },
  {
    id: 'ripple',
    symbol: 'XRP',
    name: 'Ripple',
    price: 0.63,
    change24h: -0.85,
    marketCap: 33000000000,
    volume24h: 1200000000,
    image: 'https://cryptologos.cc/logos/xrp-xrp-logo.png'
  },
  {
    id: 'polkadot',
    symbol: 'DOT',
    name: 'Polkadot',
    price: 7.25,
    change24h: 3.45,
    marketCap: 9000000000,
    volume24h: 400000000,
    image: 'https://cryptologos.cc/logos/polkadot-new-dot-logo.png'
  },
  {
    id: 'dogecoin',
    symbol: 'DOGE',
    name: 'Dogecoin',
    price: 0.085,
    change24h: -2.15,
    marketCap: 12000000000,
    volume24h: 800000000,
    image: 'https://cryptologos.cc/logos/dogecoin-doge-logo.png'
  },
  {
    id: 'avalanche',
    symbol: 'AVAX',
    name: 'Avalanche',
    price: 36.80,
    change24h: 4.25,
    marketCap: 13000000000,
    volume24h: 600000000,
    image: 'https://cryptologos.cc/logos/avalanche-avax-logo.png'
  }
]

// 假資料：使用者資訊
export const mockUser = {
  id: '1',
  username: 'demo_user',
  email: 'demo@example.com',
  avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=4F46E5&color=fff',
  joinDate: '2024-01-15',
  favoriteCoins: []
}

// 假資料：價格圖表資料（最近 30 天）
export const generateChartData = (basePrice, days = 30) => {
  const data = []
  let price = basePrice

  for (let i = 0; i < days; i++) {
    const change = (Math.random() - 0.5) * basePrice * 0.05 // ±5% 波動
    price = Math.max(price + change, basePrice * 0.5) // 確保不會太低

    const date = new Date()
    date.setDate(date.getDate() - (days - i - 1))

    data.push({
      date: date.toISOString().split('T')[0],
      price: parseFloat(price.toFixed(2))
    })
  }

  return data
}

// 假資料：登入驗證
export const mockLogin = (email, password) => {
  // 簡單的假驗證
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

// 假資料：註冊
export const mockRegister = (username, email, password) => {
  // 假設註冊總是成功
  return {
    success: true,
    message: 'Registration successful',
    user: {
      ...mockUser,
      username,
      email
    }
  }
}

// 取得單一幣種資訊
export const getCoinById = (id) => {
  return cryptoCoins.find(coin => coin.id === id)
}

// 格式化數字
export const formatNumber = (num) => {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(2) + 'B'
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(2) + 'K'
  }
  return num.toFixed(2)
}

// 格式化價格
export const formatPrice = (price) => {
  if (price >= 1) {
    return '$' + price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }
  return '$' + price.toFixed(4)
}
