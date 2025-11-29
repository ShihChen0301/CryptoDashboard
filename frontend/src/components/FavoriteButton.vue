<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { isFavorite as checkFavorite, toggleFavorite as toggleFav, getFavorites } from '../utils/favorite'

const props = defineProps({
  coinId: {
    type: String,
    required: true
  }
})

const isFav = ref(false)
const isLoading = ref(true)

const loadFavoriteStatus = async () => {
  // 先確保已經載入收藏列表
  await getFavorites()
  // 然後檢查當前幣種是否已收藏
  isFav.value = checkFavorite(props.coinId)
  isLoading.value = false
}

const handleToggle = async (event) => {
  event.stopPropagation()
  event.preventDefault()

  if (isLoading.value) return

  try {
    await toggleFav(props.coinId)
    isFav.value = checkFavorite(props.coinId)
  } catch (error) {
    console.error('Failed to toggle favorite:', error)
  }
}

const handleFavoritesChanged = () => {
  isFav.value = checkFavorite(props.coinId)
}

onMounted(() => {
  loadFavoriteStatus()
  window.addEventListener('favoritesChanged', handleFavoritesChanged)
})

onUnmounted(() => {
  window.removeEventListener('favoritesChanged', handleFavoritesChanged)
})
</script>

<template>
  <button
    class="favorite-btn"
    @click="handleToggle"
    :class="{ active: isFav }"
    :title="isFav ? 'Remove from favorites' : 'Add to favorites'"
  >
    <span class="star-icon">{{ isFav ? '★' : '☆' }}</span>
  </button>
</template>

<style scoped>
.favorite-btn {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #d1d5db;
  transition: color 0.2s;
  padding: 0.5rem;
  line-height: 1;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.favorite-btn:hover {
  color: #fbbf24;
}

.favorite-btn.active {
  color: #fbbf24;
}

.star-icon {
  display: block;
}
</style>
