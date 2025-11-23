<script setup>
import { ref, onMounted, watch, onUnmounted } from 'vue'
import { formatPrice } from '../utils/format'

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
const tooltipVisible = ref(false)
const tooltipData = ref({ price: 0, date: '', x: 0, y: 0 })

// 圖表邊距（為軸標籤留空間）
let padding = { top: 20, right: 20, bottom: 40, left: 70 }

let points = []
let chartData = []

// 根據價格範圍動態計算需要的小數位數
const calculateDecimalPlaces = (priceRange, basePrice) => {
  if (priceRange === 0) return 2

  // 計算需要多少小數位才能區分最小和最大價格
  // 例如：範圍 0.0001 需要至少 4 位小數
  const rangeDecimals = Math.max(0, Math.ceil(-Math.log10(priceRange)) + 1)

  // 根據基準價格決定基本小數位
  let baseDecimals = 2
  if (basePrice < 0.01) baseDecimals = 6
  else if (basePrice < 1) baseDecimals = 4

  // 取較大值，確保能顯示價格變動
  return Math.min(8, Math.max(baseDecimals, rangeDecimals))
}

let dynamicDecimals = 2 // 會在 drawChart 中根據數據更新

const formatAxisPrice = (price) => {
  if (price >= 1000 && dynamicDecimals <= 2) {
    return '$' + (price / 1000).toFixed(1) + 'K'
  } else if (price >= 1) {
    return '$' + price.toFixed(dynamicDecimals)
  } else if (price >= 0.01) {
    return '$' + price.toFixed(Math.max(4, dynamicDecimals))
  } else {
    return '$' + price.toFixed(Math.max(6, dynamicDecimals))
  }
}

const formatDate = (timestamp) => {
  const date = new Date(timestamp)
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${month}/${day}`
}

const drawChart = () => {
  if (!canvas.value || !props.data.length) return

  const ctx = canvas.value.getContext('2d')
  const totalWidth = canvas.value.width
  const totalHeight = canvas.value.height

  // 清空畫布
  ctx.clearRect(0, 0, totalWidth, totalHeight)

  // 計算價格範圍
  const prices = props.data.map(d => d.price)
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  const priceRange = maxPrice - minPrice || 1

  // 根據價格範圍動態計算小數位數（解決穩定幣顯示問題）
  const avgPrice = (minPrice + maxPrice) / 2
  dynamicDecimals = calculateDecimalPlaces(priceRange, avgPrice)

  // 根據小數位數動態調整左邊 padding
  // 每多一位小數大約需要多 7px 寬度
  padding.left = 70 + Math.max(0, (dynamicDecimals - 2) * 7)

  // 圖表繪製區域（在計算 padding 之後）
  const chartWidth = totalWidth - padding.left - padding.right
  const chartHeight = totalHeight - padding.top - padding.bottom

  // 儲存數據供 tooltip 使用
  chartData = props.data

  // 計算座標點
  points = props.data.map((item, index) => {
    const x = padding.left + (index / (props.data.length - 1)) * chartWidth
    const y = padding.top + chartHeight - ((item.price - minPrice) / priceRange) * chartHeight
    return { x, y, price: item.price, date: item.date }
  })

  // 繪製 Y 軸標籤（價格）
  ctx.fillStyle = '#6b7280'
  ctx.font = '11px sans-serif'
  ctx.textAlign = 'right'
  ctx.textBaseline = 'middle'

  const yTickCount = 5
  for (let i = 0; i <= yTickCount; i++) {
    const price = minPrice + (priceRange * i) / yTickCount
    const y = padding.top + chartHeight - (i / yTickCount) * chartHeight
    ctx.fillText(formatAxisPrice(price), padding.left - 10, y)

    // 繪製水平網格線
    ctx.strokeStyle = '#e5e7eb'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(padding.left, y)
    ctx.lineTo(totalWidth - padding.right, y)
    ctx.stroke()
  }

  // 繪製 X 軸標籤（日期）
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'

  const xTickCount = Math.min(6, props.data.length)
  for (let i = 0; i < xTickCount; i++) {
    const dataIndex = Math.floor((i / (xTickCount - 1)) * (props.data.length - 1))
    const item = props.data[dataIndex]
    const x = padding.left + (dataIndex / (props.data.length - 1)) * chartWidth
    ctx.fillText(formatDate(item.date), x, totalHeight - padding.bottom + 10)
  }

  // 繪製漸層背景
  const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartHeight)
  gradient.addColorStop(0, 'rgba(79, 70, 229, 0.2)')
  gradient.addColorStop(1, 'rgba(79, 70, 229, 0)')

  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.moveTo(points[0].x, padding.top + chartHeight)
  points.forEach(point => {
    ctx.lineTo(point.x, point.y)
  })
  ctx.lineTo(points[points.length - 1].x, padding.top + chartHeight)
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
}

const handleMouseMove = (event) => {
  if (!canvas.value || !points.length) return

  const rect = canvas.value.getBoundingClientRect()
  const scaleX = canvas.value.width / rect.width
  const mouseX = (event.clientX - rect.left) * scaleX

  // 找到最近的數據點
  let closestPoint = points[0]
  let closestDistance = Math.abs(mouseX - points[0].x)

  points.forEach(point => {
    const distance = Math.abs(mouseX - point.x)
    if (distance < closestDistance) {
      closestDistance = distance
      closestPoint = point
    }
  })

  // 只在滑鼠接近數據點時顯示 tooltip
  if (closestDistance < 30) {
    tooltipVisible.value = true
    tooltipData.value = {
      price: closestPoint.price,
      date: new Date(closestPoint.date).toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }),
      x: closestPoint.x / scaleX + rect.left,
      y: closestPoint.y / scaleX + rect.top
    }

    // 重繪圖表並高亮當前點
    drawChart()
    const ctx = canvas.value.getContext('2d')

    // 繪製垂直指示線
    ctx.strokeStyle = '#4F46E5'
    ctx.lineWidth = 1
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.moveTo(closestPoint.x, padding.top)
    ctx.lineTo(closestPoint.x, canvas.value.height - padding.bottom)
    ctx.stroke()
    ctx.setLineDash([])

    // 繪製高亮點
    ctx.fillStyle = '#4F46E5'
    ctx.beginPath()
    ctx.arc(closestPoint.x, closestPoint.y, 6, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = 'white'
    ctx.beginPath()
    ctx.arc(closestPoint.x, closestPoint.y, 3, 0, Math.PI * 2)
    ctx.fill()
  } else {
    tooltipVisible.value = false
    drawChart()
  }
}

const handleMouseLeave = () => {
  tooltipVisible.value = false
  drawChart()
}

onMounted(() => {
  if (canvas.value) {
    canvas.value.width = canvas.value.offsetWidth
    canvas.value.height = props.height
    drawChart()

    canvas.value.addEventListener('mousemove', handleMouseMove)
    canvas.value.addEventListener('mouseleave', handleMouseLeave)
  }
})

onUnmounted(() => {
  if (canvas.value) {
    canvas.value.removeEventListener('mousemove', handleMouseMove)
    canvas.value.removeEventListener('mouseleave', handleMouseLeave)
  }
})

watch(() => props.data, () => {
  drawChart()
}, { deep: true })
</script>

<template>
  <div class="chart-container">
    <canvas ref="canvas" :height="height"></canvas>

    <!-- Tooltip -->
    <div
      v-if="tooltipVisible"
      class="tooltip"
      :style="{
        left: tooltipData.x + 'px',
        top: (tooltipData.y - 60) + 'px'
      }"
    >
      <div class="tooltip-price">{{ formatPrice(tooltipData.price) }}</div>
      <div class="tooltip-date">{{ tooltipData.date }}</div>
    </div>
  </div>
</template>

<style scoped>
.chart-container {
  width: 100%;
  background: white;
  border-radius: 0.5rem;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  position: relative;
}

canvas {
  width: 100%;
  display: block;
  cursor: crosshair;
}

.tooltip {
  position: fixed;
  background: #1f2937;
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  pointer-events: none;
  transform: translateX(-50%);
  z-index: 100;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: #1f2937;
}

.tooltip-price {
  font-weight: 600;
  font-size: 0.9375rem;
}

.tooltip-date {
  color: #9ca3af;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}
</style>
