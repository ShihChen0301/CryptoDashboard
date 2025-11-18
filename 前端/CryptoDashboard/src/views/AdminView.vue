<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const submissions = ref([])
const currentUser = ref(null)

// 檢查是否為管理員
onMounted(() => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  currentUser.value = user

  if (user.role !== 'admin') {
    router.push('/dashboard')
    return
  }

  loadSubmissions()
})

const loadSubmissions = () => {
  const stored = localStorage.getItem('coinSubmissions')
  if (stored) {
    submissions.value = JSON.parse(stored)
  }
}

const pendingSubmissions = computed(() => {
  return submissions.value.filter(s => s.status === 'pending')
})

const processedSubmissions = computed(() => {
  return submissions.value.filter(s => s.status !== 'pending')
})

const approveSubmission = (id) => {
  const index = submissions.value.findIndex(s => s.id === id)
  if (index !== -1) {
    submissions.value[index].status = 'approved'
    submissions.value[index].processedAt = new Date().toISOString()
    submissions.value[index].processedBy = currentUser.value.email
    localStorage.setItem('coinSubmissions', JSON.stringify(submissions.value))
  }
}

const rejectSubmission = (id) => {
  const index = submissions.value.findIndex(s => s.id === id)
  if (index !== -1) {
    submissions.value[index].status = 'rejected'
    submissions.value[index].processedAt = new Date().toISOString()
    submissions.value[index].processedBy = currentUser.value.email
    localStorage.setItem('coinSubmissions', JSON.stringify(submissions.value))
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusColor = (status) => {
  switch (status) {
    case 'approved': return '#10b981'
    case 'rejected': return '#ef4444'
    default: return '#f59e0b'
  }
}
</script>

<template>
  <div class="admin-page">
    <div class="page-header">
      <h1>Admin Panel</h1>
      <p>Review and manage coin submissions</p>
    </div>

    <!-- 待審核 -->
    <div class="section">
      <h2>Pending Review ({{ pendingSubmissions.length }})</h2>

      <div v-if="pendingSubmissions.length === 0" class="empty-state">
        <p>No pending submissions</p>
      </div>

      <div v-else class="submissions-list">
        <div v-for="submission in pendingSubmissions" :key="submission.id" class="submission-card">
          <div class="submission-header">
            <div class="coin-info">
              <strong>{{ submission.name }}</strong>
              <span class="symbol">({{ submission.symbol.toUpperCase() }})</span>
            </div>
            <div class="submission-meta">
              <span>Submitted by: {{ submission.submittedBy }}</span>
              <span>{{ formatDate(submission.submittedAt) }}</span>
            </div>
          </div>

          <div v-if="submission.website" class="submission-detail">
            <label>Website:</label>
            <a :href="submission.website" target="_blank">{{ submission.website }}</a>
          </div>

          <div v-if="submission.description" class="submission-detail">
            <label>Description:</label>
            <p>{{ submission.description }}</p>
          </div>

          <div class="submission-actions">
            <button class="btn-approve" @click="approveSubmission(submission.id)">
              Approve
            </button>
            <button class="btn-reject" @click="rejectSubmission(submission.id)">
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 已處理 -->
    <div class="section">
      <h2>Processed Submissions</h2>

      <div v-if="processedSubmissions.length === 0" class="empty-state">
        <p>No processed submissions yet</p>
      </div>

      <div v-else class="processed-list">
        <div v-for="submission in processedSubmissions" :key="submission.id" class="processed-item">
          <div class="processed-info">
            <strong>{{ submission.name }}</strong>
            <span class="symbol">({{ submission.symbol.toUpperCase() }})</span>
          </div>
          <div class="processed-status" :style="{ color: getStatusColor(submission.status) }">
            {{ submission.status === 'approved' ? 'Approved' : 'Rejected' }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-page {
  max-width: 1000px;
  margin: 0 auto;
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

.section {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
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
  padding: 2rem;
  color: #6b7280;
}

.submissions-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.submission-card {
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1.5rem;
  background: #f9fafb;
}

.submission-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.coin-info {
  font-size: 1.125rem;
}

.coin-info .symbol {
  color: #6b7280;
  margin-left: 0.5rem;
}

.submission-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-size: 0.875rem;
  color: #6b7280;
}

.submission-detail {
  margin-bottom: 1rem;
}

.submission-detail label {
  font-weight: 600;
  color: #374151;
  display: block;
  margin-bottom: 0.25rem;
}

.submission-detail a {
  color: #4F46E5;
  text-decoration: none;
}

.submission-detail a:hover {
  text-decoration: underline;
}

.submission-detail p {
  margin: 0;
  color: #4b5563;
  line-height: 1.5;
}

.submission-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.btn-approve,
.btn-reject {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-approve {
  background: #10b981;
  color: white;
}

.btn-approve:hover {
  background: #059669;
}

.btn-reject {
  background: #ef4444;
  color: white;
}

.btn-reject:hover {
  background: #dc2626;
}

.processed-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.processed-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: #f9fafb;
  border-radius: 0.375rem;
}

.processed-info .symbol {
  color: #6b7280;
  margin-left: 0.5rem;
}

.processed-status {
  font-weight: 600;
  font-size: 0.875rem;
}
</style>
