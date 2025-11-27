import { createI18n } from 'vue-i18n'
import zhTW from '../locales/zh-TW.json'
import enUS from '../locales/en-US.json'

const messages = {
  'zh-TW': zhTW,
  'en-US': enUS
}

// 從 localStorage 讀取語系偏好，預設為中文
const savedLocale = localStorage.getItem('preferred_locale') || 'zh-TW'

const i18n = createI18n({
  legacy: false, // 使用 Composition API 模式
  locale: savedLocale, // 預設語系
  fallbackLocale: 'zh-TW', // 後備語系
  messages,
  globalInjection: true // 全域注入 $t
})

export default i18n
