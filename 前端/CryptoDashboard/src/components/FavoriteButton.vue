<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { isFavorite as checkFavorite, toggleFavorite as toggleFav } from '../utils/favorite'

const props = defineProps({
  coinId: {
    type: String,
    required: true
  }
})

const isFav = ref(false)
const isAnimating = ref(false)

const loadFavoriteStatus = () => {
  isFav.value = checkFavorite(props.coinId)
}

const handleToggle = (event) => {
  event.stopPropagation()
  event.preventDefault()

  toggleFav(props.coinId)
  isFav.value = checkFavorite(props.coinId)

  // 觸發動畫
  isAnimating.value = true
  setTimeout(() => {
    isAnimating.value = false
  }, 600)
}

const handleFavoritesChanged = () => {
  loadFavoriteStatus()
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
    :class="{ active: isFav, animating: isAnimating }"
    :title="isFav ? 'Remove from favorites' : 'Add to favorites'"
  >
    <span class="star-icon">{{ isFav ? '★' : '☆' }}</span>
    <span v-if="isAnimating" class="ripple"></span>
  </button>
</template>

<style scoped>
.favorite-btn {
  position: relative;
  background: transparent;
  border: none;
  font-size: var(--text-2xl);
  cursor: pointer;
  color: var(--color-border-dark);
  transition: all var(--transition-base);
  padding: var(--spacing-sm);
  line-height: 1;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.favorite-btn:hover {
  color: var(--color-warning);
  transform: scale(1.15);
  background: rgba(245, 158, 11, 0.1);
}

.favorite-btn.active {
  color: var(--color-warning);
}

.favorite-btn.active .star-icon {
  animation: starPop 0.3s ease-out;
}

.star-icon {
  position: relative;
  z-index: 1;
  display: block;
  transition: transform var(--transition-base);
}

.favorite-btn.animating .star-icon {
  animation: heartBeat 0.6s ease-out;
}

@keyframes starPop {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3) rotate(20deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
  }
}

@keyframes heartBeat {
  0%, 100% {
    transform: scale(1);
  }
  10%, 30% {
    transform: scale(1.3);
  }
  20%, 40%, 60%, 80% {
    transform: scale(1.1);
  }
  50%, 70% {
    transform: scale(1.25);
  }
}

.ripple {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: var(--radius-full);
  background: var(--color-warning);
  opacity: 0.5;
  animation: rippleEffect 0.6s ease-out;
  pointer-events: none;
}

@keyframes rippleEffect {
  0% {
    transform: scale(0);
    opacity: 0.5;
  }
  100% {
    transform: scale(2.5);
    opacity: 0;
  }
}

.favorite-btn:active {
  transform: scale(0.95);
}
</style>
