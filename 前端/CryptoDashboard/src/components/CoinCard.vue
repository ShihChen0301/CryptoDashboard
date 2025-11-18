<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { formatPrice } from '../utils/fakeData'
import FavoriteButton from './FavoriteButton.vue'

const props = defineProps({
  coin: {
    type: Object,
    required: true
  }
})

const router = useRouter()

const isPositive = computed(() => props.coin.change24h >= 0)
const changeColor = computed(() => isPositive.value ? '#10b981' : '#ef4444')

const goToDetail = () => {
  router.push(`/coin/${props.coin.id}`)
}
</script>

<template>
  <div class="coin-card" @click="goToDetail">
    <div class="card-header">
      <div class="coin-info">
        <div class="coin-symbol">{{ coin.symbol }}</div>
        <div class="coin-name">{{ coin.name }}</div>
      </div>
      <FavoriteButton :coinId="coin.id" @click.stop />
    </div>

    <div class="card-body">
      <div class="price">{{ formatPrice(coin.price) }}</div>
      <div class="change" :style="{ color: changeColor }">
        {{ isPositive ? '+' : '' }}{{ coin.change24h.toFixed(2) }}%
      </div>
    </div>
  </div>
</template>

<style scoped>
.coin-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.2s;
}

.coin-card:hover {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.coin-info {
  flex: 1;
}

.coin-symbol {
  font-size: 1.25rem;
  font-weight: bold;
  color: #111827;
  margin-bottom: 0.25rem;
}

.coin-name {
  font-size: 0.875rem;
  color: #6b7280;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.price {
  font-size: 1.5rem;
  font-weight: bold;
  color: #111827;
}

.change {
  font-size: 1rem;
  font-weight: 600;
}
</style>
