<script setup>
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { formatPrice } from '../utils/format'

// 註冊 Chart.js 組件
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  height: {
    type: Number,
    default: 300,
  },
})

// 格式化日期標籤
const formatDate = (timestamp) => {
  const date = new Date(timestamp)
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${month}/${day}`
}

// 計算圖表數據
const chartData = computed(() => {
  if (!props.data || props.data.length === 0) {
    return {
      labels: [],
      datasets: [],
    }
  }

  // 減少數據點數量以提升性能（最多顯示 100 個點）
  const step = Math.max(1, Math.floor(props.data.length / 100))
  const sampledData = props.data.filter((_, index) => index % step === 0)

  return {
    labels: sampledData.map((item) => formatDate(item.date)),
    datasets: [
      {
        label: 'Price',
        data: sampledData.map((item) => item.price),
        borderColor: '#4F46E5',
        backgroundColor: (context) => {
          const ctx = context.chart.ctx
          const gradient = ctx.createLinearGradient(0, 0, 0, context.chart.height)
          gradient.addColorStop(0, 'rgba(79, 70, 229, 0.3)')
          gradient.addColorStop(1, 'rgba(79, 70, 229, 0)')
          return gradient
        },
        fill: true,
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: '#4F46E5',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2,
        borderWidth: 2,
      },
    ],
  }
})

// 圖表配置選項
const chartOptions = computed(() => {
  // 計算價格範圍以決定小數位數
  const prices = props.data.map((d) => d.price)
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  const avgPrice = (minPrice + maxPrice) / 2

  let decimals = 2
  if (avgPrice < 0.01) decimals = 6
  else if (avgPrice < 1) decimals = 4

  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1f2937',
        titleColor: '#9ca3af',
        bodyColor: '#fff',
        bodyFont: {
          size: 14,
          weight: 'bold',
        },
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: (context) => {
            const index = context[0].dataIndex
            const step = Math.max(1, Math.floor(props.data.length / 100))
            const originalIndex = index * step
            if (originalIndex < props.data.length) {
              const date = new Date(props.data[originalIndex].date)
              return date.toLocaleDateString('zh-TW', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              })
            }
            return ''
          },
          label: (context) => {
            return formatPrice(context.raw)
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 11,
          },
          maxTicksLimit: 6,
        },
        border: {
          display: false,
        },
      },
      y: {
        grid: {
          color: '#e5e7eb',
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 11,
          },
          callback: (value) => {
            if (value >= 1000) {
              return '$' + (value / 1000).toFixed(1) + 'K'
            } else if (value >= 1) {
              return '$' + value.toFixed(decimals)
            } else {
              return '$' + value.toFixed(Math.max(4, decimals))
            }
          },
        },
        border: {
          display: false,
        },
      },
    },
  }
})
</script>

<template>
  <div class="chart-container">
    <div v-if="!data || data.length === 0" class="no-data">
      <p>No chart data available</p>
    </div>
    <Line v-else :data="chartData" :options="chartOptions" :style="{ height: height + 'px' }" />
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

.no-data {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #6b7280;
}
</style>
