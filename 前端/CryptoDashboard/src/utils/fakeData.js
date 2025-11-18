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
  },
  {
    id: 'binancecoin',
    symbol: 'BNB',
    name: 'BNB',
    price: 315.20,
    change24h: 1.85,
    marketCap: 48000000000,
    volume24h: 1200000000,
    image: 'https://cryptologos.cc/logos/bnb-bnb-logo.png'
  },
  {
    id: 'chainlink',
    symbol: 'LINK',
    name: 'Chainlink',
    price: 14.75,
    change24h: 3.20,
    marketCap: 8500000000,
    volume24h: 450000000,
    image: 'https://cryptologos.cc/logos/chainlink-link-logo.png'
  },
  {
    id: 'polygon',
    symbol: 'MATIC',
    name: 'Polygon',
    price: 0.92,
    change24h: -0.65,
    marketCap: 8200000000,
    volume24h: 380000000,
    image: 'https://cryptologos.cc/logos/polygon-matic-logo.png'
  },
  {
    id: 'litecoin',
    symbol: 'LTC',
    name: 'Litecoin',
    price: 72.30,
    change24h: 1.45,
    marketCap: 5300000000,
    volume24h: 320000000,
    image: 'https://cryptologos.cc/logos/litecoin-ltc-logo.png'
  },
  {
    id: 'uniswap',
    symbol: 'UNI',
    name: 'Uniswap',
    price: 6.25,
    change24h: 2.80,
    marketCap: 4700000000,
    volume24h: 180000000,
    image: 'https://cryptologos.cc/logos/uniswap-uni-logo.png'
  },
  {
    id: 'cosmos',
    symbol: 'ATOM',
    name: 'Cosmos',
    price: 9.15,
    change24h: -1.90,
    marketCap: 3500000000,
    volume24h: 150000000,
    image: 'https://cryptologos.cc/logos/cosmos-atom-logo.png'
  },
  {
    id: 'stellar',
    symbol: 'XLM',
    name: 'Stellar',
    price: 0.12,
    change24h: 0.95,
    marketCap: 3400000000,
    volume24h: 120000000,
    image: 'https://cryptologos.cc/logos/stellar-xlm-logo.png'
  },
  {
    id: 'algorand',
    symbol: 'ALGO',
    name: 'Algorand',
    price: 0.18,
    change24h: 2.10,
    marketCap: 1400000000,
    volume24h: 85000000,
    image: 'https://cryptologos.cc/logos/algorand-algo-logo.png'
  },
  {
    id: 'vechain',
    symbol: 'VET',
    name: 'VeChain',
    price: 0.028,
    change24h: -0.45,
    marketCap: 2000000000,
    volume24h: 65000000,
    image: 'https://cryptologos.cc/logos/vechain-vet-logo.png'
  },
  {
    id: 'tron',
    symbol: 'TRX',
    name: 'TRON',
    price: 0.11,
    change24h: 1.35,
    marketCap: 9800000000,
    volume24h: 450000000,
    image: 'https://cryptologos.cc/logos/tron-trx-logo.png'
  },
  {
    id: 'toncoin',
    symbol: 'TON',
    name: 'Toncoin',
    price: 5.85,
    change24h: 4.50,
    marketCap: 14500000000,
    volume24h: 280000000,
    image: 'https://cryptologos.cc/logos/toncoin-ton-logo.png'
  },
  {
    id: 'shiba-inu',
    symbol: 'SHIB',
    name: 'Shiba Inu',
    price: 0.0000095,
    change24h: -3.25,
    marketCap: 5600000000,
    volume24h: 220000000,
    image: 'https://cryptologos.cc/logos/shiba-inu-shib-logo.png'
  },
  {
    id: 'aptos',
    symbol: 'APT',
    name: 'Aptos',
    price: 8.45,
    change24h: 2.95,
    marketCap: 3200000000,
    volume24h: 140000000,
    image: 'https://cryptologos.cc/logos/aptos-apt-logo.png'
  },
  {
    id: 'near',
    symbol: 'NEAR',
    name: 'NEAR Protocol',
    price: 5.20,
    change24h: 3.80,
    marketCap: 5100000000,
    volume24h: 280000000,
    image: 'https://cryptologos.cc/logos/near-protocol-near-logo.png'
  },
  {
    id: 'arbitrum',
    symbol: 'ARB',
    name: 'Arbitrum',
    price: 1.15,
    change24h: -1.20,
    marketCap: 2900000000,
    volume24h: 350000000,
    image: 'https://cryptologos.cc/logos/arbitrum-arb-logo.png'
  },
  {
    id: 'optimism',
    symbol: 'OP',
    name: 'Optimism',
    price: 2.35,
    change24h: 1.65,
    marketCap: 2400000000,
    volume24h: 180000000,
    image: 'https://cryptologos.cc/logos/optimism-ethereum-op-logo.png'
  }
]

// 假資料：使用者資訊
export const mockUser = {
  id: '1',
  username: 'demo_user',
  email: 'demo@example.com',
  avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=4F46E5&color=fff',
  joinDate: '2024-01-15',
  favoriteCoins: [],
  role: 'user' // user or admin
}

// 管理員帳號
export const mockAdmin = {
  id: '2',
  username: 'admin',
  email: 'admin@example.com',
  avatar: 'https://ui-avatars.com/api/?name=Admin&background=dc2626&color=fff',
  joinDate: '2024-01-01',
  favoriteCoins: [],
  role: 'admin'
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

// 假資料：購買趨勢數據
export const getTrendingBuys = () => {
  // 模擬各幣種的購買次數
  const buyData = [
    { coinId: 'bitcoin', buys: 15420 },
    { coinId: 'ethereum', buys: 12350 },
    { coinId: 'solana', buys: 8920 },
    { coinId: 'binancecoin', buys: 6780 },
    { coinId: 'ripple', buys: 5430 },
    { coinId: 'cardano', buys: 4210 },
    { coinId: 'dogecoin', buys: 3890 },
    { coinId: 'polygon', buys: 3520 },
    { coinId: 'avalanche', buys: 2980 },
    { coinId: 'chainlink', buys: 2650 }
  ]

  return buyData.map(item => {
    const coin = cryptoCoins.find(c => c.id === item.coinId)
    return {
      ...item,
      name: coin ? coin.name : item.coinId,
      symbol: coin ? coin.symbol : item.coinId.toUpperCase()
    }
  })
}
