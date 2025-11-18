import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.css'

// 載入 API 測試函數 (開發用)
import './utils/finnhubApi.js'
import './utils/coingeckoApi.js'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
