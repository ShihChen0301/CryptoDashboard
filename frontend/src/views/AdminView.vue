<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { adminApi, announcementApi } from '@/utils/api'

const router = useRouter()
const currentUser = ref(null)
const activeTab = ref('overview') // overview, users, announcements

// 數據統計
const stats = ref({
  totalUsers: 0,
  activeUsers: 0,
  totalFavorites: 0
})

// 用戶列表
const users = ref([])

// 收藏排行
const topFavoriteCoins = ref([])

// 公告列表
const announcements = ref([])
const newAnnouncement = ref({
  title: '',
  content: '',
  type: 'info' // info, warning, success
})

// 載入狀態
const loading = ref(false)
const error = ref(null)

// 檢查是否為管理員
onMounted(() => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  currentUser.value = user

  if (user.role !== 'admin') {
    router.push('/dashboard')
    return
  }

  loadData()
})

const loadData = async () => {
  loading.value = true
  error.value = null
  try {
    await Promise.all([
      loadStats(),
      loadUsers(),
      loadAnnouncements()
    ])
  } catch (err) {
    console.error('載入資料失敗:', err)
    error.value = err.message || '載入資料失敗'
  } finally {
    loading.value = false
  }
}

const loadUsers = async () => {
  try {
    const data = await adminApi.getAllUsers()
    users.value = data
  } catch (err) {
    console.error('載入用戶列表失敗:', err)
    throw err
  }
}

const loadStats = async () => {
  try {
    const data = await adminApi.getStats()
    stats.value = {
      totalUsers: data.totalUsers,
      activeUsers: data.activeUsers,
      totalFavorites: data.totalFavorites
    }
    // 收藏排行從統計 API 取得
    topFavoriteCoins.value = data.topCoins.map(coin => ({
      coinId: coin.coinId,
      coinName: getCoinName(coin.coinId),
      favoriteCount: coin.favoriteCount
    }))
  } catch (err) {
    console.error('載入統計資料失敗:', err)
    throw err
  }
}

const getCoinName = (coinId) => {
  const coinNames = {
    'bitcoin': 'Bitcoin (BTC)',
    'ethereum': 'Ethereum (ETH)',
    'tether': 'Tether (USDT)',
    'binancecoin': 'Binance Coin (BNB)',
    'cardano': 'Cardano (ADA)',
    'ripple': 'Ripple (XRP)',
    'solana': 'Solana (SOL)',
    'polkadot': 'Polkadot (DOT)'
  }
  return coinNames[coinId] || coinId.charAt(0).toUpperCase() + coinId.slice(1)
}

const loadAnnouncements = async () => {
  try {
    const data = await announcementApi.getAll()
    announcements.value = data
  } catch (err) {
    console.error('載入公告列表失敗:', err)
    throw err
  }
}

const createAnnouncement = async () => {
  if (!newAnnouncement.value.title || !newAnnouncement.value.content) {
    alert('請填寫標題和內容')
    return
  }

  try {
    const data = {
      title: newAnnouncement.value.title,
      content: newAnnouncement.value.content,
      type: newAnnouncement.value.type,
      isActive: true
    }
    await announcementApi.create(data)
    // 重新載入公告列表
    await loadAnnouncements()
    // 清空表單
    newAnnouncement.value = { title: '', content: '', type: 'info' }
    alert('公告建立成功！')
  } catch (err) {
    console.error('建立公告失敗:', err)
    alert('建立公告失敗：' + (err.message || '未知錯誤'))
  }
}

const toggleAnnouncement = async (id) => {
  const announcement = announcements.value.find(a => a.id === id)
  if (!announcement) return

  try {
    const data = {
      title: announcement.title,
      content: announcement.content,
      type: announcement.type,
      isActive: !announcement.isActive
    }
    await announcementApi.update(id, data)
    // 重新載入公告列表
    await loadAnnouncements()
  } catch (err) {
    console.error('更新公告失敗:', err)
    alert('更新公告失敗：' + (err.message || '未知錯誤'))
  }
}

const deleteAnnouncement = async (id) => {
  if (!confirm('確定要刪除此公告？')) return

  try {
    await announcementApi.delete(id)
    // 重新載入公告列表
    await loadAnnouncements()
    alert('公告刪除成功！')
  } catch (err) {
    console.error('刪除公告失敗:', err)
    // 即使刪除失敗，也嘗試重新同步列表，避免顯示過期資料
    try {
      await loadAnnouncements()
    } catch {
      // ignore
    }

    const message = err.message || '未知錯誤'
    if (message.includes('Announcement not found')) {
      alert('刪除公告失敗：此公告可能已不存在（已重新整理列表）')
      return
    }
    alert('刪除公告失敗：' + message)
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getAnnouncementTypeColor = (type) => {
  const typeLower = typeof type === 'string' ? type.toLowerCase() : type
  switch (typeLower) {
    case 'success': return '#10b981'
    case 'warning': return '#f59e0b'
    case 'info': return '#3b82f6'
    default: return '#6b7280'
  }
}

const getAnnouncementTypeLabel = (type) => {
  const typeLower = typeof type === 'string' ? type.toLowerCase() : type
  switch (typeLower) {
    case 'success': return '成功'
    case 'warning': return '警告'
    case 'info': return '資訊'
    default: return '一般'
  }
}
</script>

<template>
  <div class="admin-page">
    <div class="page-header">
      <h1>管理員控制台</h1>
      <p>系統管理與數據統計</p>
    </div>

    <!-- Tab 導航 -->
    <div class="tabs">
      <button
        :class="['tab', { active: activeTab === 'overview' }]"
        @click="activeTab = 'overview'"
      >
        📊 數據總覽
      </button>
      <button
        :class="['tab', { active: activeTab === 'users' }]"
        @click="activeTab = 'users'"
      >
        👥 用戶管理
      </button>
      <button
        :class="['tab', { active: activeTab === 'announcements' }]"
        @click="activeTab = 'announcements'"
      >
        📢 公告管理
      </button>
    </div>

    <!-- 數據總覽 -->
    <div v-if="activeTab === 'overview'" class="tab-content">
      <!-- 統計卡片 -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-info">
            <div class="stat-label">總用戶數</div>
            <div class="stat-value">{{ stats.totalUsers }}</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">✅</div>
          <div class="stat-info">
            <div class="stat-label">活躍用戶（7天內）</div>
            <div class="stat-value">{{ stats.activeUsers }}</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">⭐</div>
          <div class="stat-info">
            <div class="stat-label">總收藏數</div>
            <div class="stat-value">{{ stats.totalFavorites }}</div>
          </div>
        </div>
      </div>

      <!-- 最多收藏的幣種排行 -->
      <div class="section">
        <h2>🏆 最多收藏的幣種排行</h2>
        <div v-if="topFavoriteCoins.length === 0" class="empty-state">
          <p>目前沒有收藏數據</p>
        </div>
        <div v-else class="ranking-list">
          <div
            v-for="(coin, index) in topFavoriteCoins"
            :key="coin.coinId"
            class="ranking-item"
          >
            <div class="ranking-number">{{ index + 1 }}</div>
            <div class="ranking-info">
              <div class="coin-name">{{ coin.coinName }}</div>
            </div>
            <div class="ranking-count">
              <span class="count-badge">{{ coin.favoriteCount }} 個收藏</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 用戶管理 -->
    <div v-if="activeTab === 'users'" class="tab-content">
      <div class="section">
        <h2>用戶列表</h2>
        <div class="users-table">
          <table>
            <thead>
              <tr>
                <th>用戶名</th>
                <th>Email</th>
                <th>角色</th>
                <th>註冊時間</th>
                <th>收藏數</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id">
                <td><strong>{{ user.username }}</strong></td>
                <td>{{ user.email }}</td>
                <td>
                  <span :class="['role-badge', user.role]">
                    {{ user.role === 'admin' ? '管理員' : '用戶' }}
                  </span>
                </td>
                <td>{{ user.joinDate ? formatDate(user.joinDate) : '-' }}</td>
                <td>{{ user.favoriteCount || 0 }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 公告管理 -->
    <div v-if="activeTab === 'announcements'" class="tab-content">
      <!-- 新增公告表單 -->
      <div class="section">
        <h2>新增公告</h2>
        <div class="announcement-form">
          <div class="form-group">
            <label>標題</label>
            <input
              v-model="newAnnouncement.title"
              type="text"
              placeholder="輸入公告標題"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label>類型</label>
            <select v-model="newAnnouncement.type" class="form-select">
              <option value="info">資訊</option>
              <option value="success">成功</option>
              <option value="warning">警告</option>
            </select>
          </div>

          <div class="form-group">
            <label>內容</label>
            <textarea
              v-model="newAnnouncement.content"
              placeholder="輸入公告內容"
              class="form-textarea"
              rows="4"
            ></textarea>
          </div>

          <button @click="createAnnouncement" class="btn-primary">
            發布公告
          </button>
        </div>
      </div>

      <!-- 公告列表 -->
      <div class="section">
        <h2>公告列表</h2>
        <div v-if="announcements.length === 0" class="empty-state">
          <p>目前沒有公告</p>
        </div>
        <div v-else class="announcements-list">
          <div
            v-for="announcement in announcements"
            :key="announcement.id"
            class="announcement-card"
          >
            <div class="announcement-header">
              <div class="announcement-title-row">
                <h3>{{ announcement.title }}</h3>
                <span
                  class="type-badge"
                  :style="{ backgroundColor: getAnnouncementTypeColor(announcement.type) }"
                >
                  {{ getAnnouncementTypeLabel(announcement.type) }}
                </span>
              </div>
              <div class="announcement-meta">
                <span>發布者：{{ announcement.createdBy }}</span>
                <span>{{ formatDate(announcement.createdAt) }}</span>
              </div>
            </div>

            <div class="announcement-content">
              {{ announcement.content }}
            </div>

            <div class="announcement-actions">
              <button
                @click="toggleAnnouncement(announcement.id)"
                :class="['btn-toggle', { active: announcement.isActive }]"
              >
                {{ announcement.isActive ? '✓ 啟用中' : '✕ 已停用' }}
              </button>
              <button
                @click="deleteAnnouncement(announcement.id)"
                class="btn-delete"
              >
                刪除
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  color: #111827;
}

.page-header p {
  margin: 0;
  color: #6b7280;
}

/* Tabs */
.tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid #e5e7eb;
}

.tab {
  padding: 0.75rem 1.5rem;
  border: none;
  background: transparent;
  font-size: 1rem;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  transition: all 0.2s;
}

.tab:hover {
  color: #4F46E5;
}

.tab.active {
  color: #4F46E5;
  border-bottom-color: #4F46E5;
}

.tab-content {
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 統計卡片 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  font-size: 2.5rem;
}

.stat-info {
  flex: 1;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
}

/* Section */
.section {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.section h2 {
  margin: 0 0 1.5rem 0;
  font-size: 1.25rem;
  color: #111827;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #6b7280;
}

/* 排行榜 */
.ranking-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.ranking-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.5rem;
  transition: background 0.2s;
}

.ranking-item:hover {
  background: #f3f4f6;
}

.ranking-number {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #4F46E5 0%, #6366f1 100%);
  color: white;
  font-weight: 700;
  border-radius: 50%;
  flex-shrink: 0;
}

.ranking-info {
  flex: 1;
}

.coin-name {
  font-weight: 600;
  color: #111827;
}

.count-badge {
  background: #4F46E5;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 600;
}

/* 用戶表格 */
.users-table {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #f9fafb;
}

th {
  padding: 0.75rem;
  text-align: left;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
}

td {
  padding: 0.75rem;
  border-bottom: 1px solid #f3f4f6;
  font-size: 0.875rem;
}

.role-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.role-badge.admin {
  background: #fef3c7;
  color: #92400e;
}

.role-badge.user {
  background: #e0e7ff;
  color: #3730a3;
}

/* 公告表單 */
.announcement-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
}

.form-input,
.form-select,
.form-textarea {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-family: inherit;
  transition: border-color 0.2s;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #4F46E5;
}

.form-textarea {
  resize: vertical;
}

.btn-primary {
  padding: 0.75rem 1.5rem;
  background: #4F46E5;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  align-self: flex-start;
}

.btn-primary:hover {
  background: #4338ca;
}

/* 公告列表 */
.announcements-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.announcement-card {
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1.5rem;
  background: #f9fafb;
}

.announcement-header {
  margin-bottom: 1rem;
}

.announcement-title-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.announcement-title-row h3 {
  margin: 0;
  font-size: 1.125rem;
  color: #111827;
}

.type-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
}

.announcement-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.announcement-content {
  margin-bottom: 1rem;
  color: #4b5563;
  line-height: 1.6;
}

.announcement-actions {
  display: flex;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.btn-toggle,
.btn-delete {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-toggle {
  background: #e5e7eb;
  color: #6b7280;
}

.btn-toggle.active {
  background: #10b981;
  color: white;
}

.btn-toggle:hover {
  opacity: 0.8;
}

.btn-delete {
  background: #ef4444;
  color: white;
}

.btn-delete:hover {
  background: #dc2626;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .tabs {
    overflow-x: auto;
  }

  .tab {
    white-space: nowrap;
  }

  .users-table {
    font-size: 0.75rem;
  }
}
</style>
