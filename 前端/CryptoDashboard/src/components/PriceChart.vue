<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  height: {
    type: Number,
    default: 200
  }
})

const canvas = ref(null)

const drawChart = () => {
  if (!canvas.value || !props.data.length) return

  const ctx = canvas.value.getContext('2d')
  const width = canvas.value.width
  const height = canvas.value.height

  // 清空畫布
  ctx.clearRect(0, 0, width, height)

  // 計算價格範圍
  const prices = props.data.map(d => d.price)
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  const priceRange = maxPrice - minPrice

  // 計算座標點
  const points = props.data.map((item, index) => {
    const x = (index / (props.data.length - 1)) * width
    const y = height - ((item.price - minPrice) / priceRange) * height
    return { x, y }
  })

  // 繪製漸層背景
  const gradient = ctx.createLinearGradient(0, 0, 0, height)
  gradient.addColorStop(0, 'rgba(79, 70, 229, 0.2)')
  gradient.addColorStop(1, 'rgba(79, 70, 229, 0)')

  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.moveTo(points[0].x, height)
  points.forEach(point => {
    ctx.lineTo(point.x, point.y)
  })
  ctx.lineTo(points[points.length - 1].x, height)
  ctx.closePath()
  ctx.fill()

  // 繪製折線
  ctx.strokeStyle = '#4F46E5'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(points[0].x, points[0].y)
  points.forEach(point => {
    ctx.lineTo(point.x, point.y)
  })
  ctx.stroke()

  // 繪製點
  points.forEach(point => {
    ctx.fillStyle = '#4F46E5'
    ctx.beginPath()
    ctx.arc(point.x, point.y, 3, 0, Math.PI * 2)
    ctx.fill()
  })
}

onMounted(() => {
  if (canvas.value) {
    canvas.value.width = canvas.value.offsetWidth
    canvas.value.height = props.height
    drawChart()
  }
})

watch(() => props.data, () => {
  drawChart()
}, { deep: true })
</script>

<template>
  <div class="chart-container">
    <canvas ref="canvas" :height="height"></canvas>
  </div>
</template>

<style scoped>
.chart-container {
  width: 100%;
  background: white;
  border-radius: 0.5rem;
  padding: 1rem;
  border: 1px solid #e5e7eb;
}

canvas {
  width: 100%;
  display: block;
}
</style>
