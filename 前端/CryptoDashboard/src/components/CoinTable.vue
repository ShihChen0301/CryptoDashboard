<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { formatPrice, formatNumber } from '../utils/fakeData'
import FavoriteButton from './FavoriteButton.vue'

const props = defineProps({
  coins: {
    type: Array,
    required: true
  }
})

const router = useRouter()

const goToDetail = (coinId) => {
  router.push(`/coin/${coinId}`)
}

const getChangeColor = (change) => {
  return change >= 0 ? '#10b981' : '#ef4444'
}
</script>

<template>
  <div class="table-container">
    <table class="coin-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Price</th>
          <th>24h Change</th>
          <th>Market Cap</th>
          <th>Volume (24h)</th>
          <th>Favorite</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(coin, index) in coins"
          :key="coin.id"
          @click="goToDetail(coin.id)"
          class="coin-row"
        >
          <td>{{ index + 1 }}</td>
          <td>
            <div class="coin-name-cell">
              <span class="symbol">{{ coin.symbol }}</span>
              <span class="name">{{ coin.name }}</span>
            </div>
          </td>
          <td class="price-cell">{{ formatPrice(coin.price) }}</td>
          <td :style="{ color: getChangeColor(coin.change24h) }" class="change-cell">
            {{ coin.change24h >= 0 ? '+' : '' }}{{ coin.change24h.toFixed(2) }}%
          </td>
          <td>{{ formatNumber(coin.marketCap) }}</td>
          <td>{{ formatNumber(coin.volume24h) }}</td>
          <td @click.stop>
            <FavoriteButton :coinId="coin.id" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table-container {
  background: white;
  border-radius: 0.5rem;
  overflow: hidden;
  border: 1px solid #e5e7eb;
}

.coin-table {
  width: 100%;
  border-collapse: collapse;
}

.coin-table thead {
  background: #f9fafb;
}

.coin-table th {
  text-align: left;
  padding: 1rem;
  font-weight: 600;
  color: #6b7280;
  font-size: 0.875rem;
  text-transform: uppercase;
  border-bottom: 1px solid #e5e7eb;
}

.coin-table td {
  padding: 1rem;
  border-bottom: 1px solid #f3f4f6;
}

.coin-row {
  cursor: pointer;
  transition: background 0.2s;
}

.coin-row:hover {
  background: #f9fafb;
}

.coin-name-cell {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.coin-name-cell .symbol {
  font-weight: 600;
  color: #111827;
}

.coin-name-cell .name {
  font-size: 0.875rem;
  color: #6b7280;
}

.price-cell {
  font-weight: 600;
  color: #111827;
}

.change-cell {
  font-weight: 600;
}
</style>
