import { defineStore } from 'pinia'

export const useLocaleStore = defineStore('locale', {
  state: () => ({
    currentLocale: 'zh-TW', // 預設語系
    availableLocales: ['zh-TW', 'en-US']
  }),

  getters: {
    isZhTW: (state) => state.currentLocale === 'zh-TW',
    isEnUS: (state) => state.currentLocale === 'en-US',
    localeLabel: (state) => {
      return state.currentLocale === 'zh-TW' ? '中文' : 'EN'
    }
  },

  actions: {
    // 初始化語系（從 localStorage 讀取）
    initLocale() {
      const savedLocale = localStorage.getItem('preferred_locale')
      if (savedLocale && this.availableLocales.includes(savedLocale)) {
        this.currentLocale = savedLocale
      }
    },

    // 設定語系
    setLocale(locale) {
      if (this.availableLocales.includes(locale)) {
        this.currentLocale = locale
        localStorage.setItem('preferred_locale', locale)
      }
    },

    // 切換語系（toggle）
    toggleLocale() {
      const newLocale = this.currentLocale === 'zh-TW' ? 'en-US' : 'zh-TW'
      this.setLocale(newLocale)
    }
  }
})
