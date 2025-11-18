<script setup>
import { ref, onMounted } from 'vue'

const formData = ref({
  name: '',
  symbol: '',
  website: '',
  description: ''
})

const submissions = ref([])
const isSubmitting = ref(false)
const submitSuccess = ref(false)

// 從 localStorage 載入已提交的幣種
onMounted(() => {
  const stored = localStorage.getItem('coinSubmissions')
  if (stored) {
    submissions.value = JSON.parse(stored)
  }
})

const submitCoin = () => {
  if (!formData.value.name || !formData.value.symbol) {
    alert('Please fill in the required fields')
    return
  }

  isSubmitting.value = true

  // 模擬提交延遲
  setTimeout(() => {
    const newSubmission = {
      id: Date.now().toString(),
      ...formData.value,
      status: 'pending', // pending, approved, rejected
      submittedAt: new Date().toISOString(),
      submittedBy: JSON.parse(localStorage.getItem('user') || '{}').email || 'anonymous'
    }

    submissions.value.unshift(newSubmission)
    localStorage.setItem('coinSubmissions', JSON.stringify(submissions.value))

    // 重置表單
    formData.value = {
      name: '',
      symbol: '',
      website: '',
      description: ''
    }

    isSubmitting.value = false
    submitSuccess.value = true

    setTimeout(() => {
      submitSuccess.value = false
    }, 3000)
  }, 1000)
}

const getStatusColor = (status) => {
  switch (status) {
    case 'approved': return '#10b981'
    case 'rejected': return '#ef4444'
    default: return '#f59e0b'
  }
}

const getStatusLabel = (status) => {
  switch (status) {
    case 'approved': return 'Approved'
    case 'rejected': return 'Rejected'
    default: return 'Pending Review'
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
</script>

<template>
  <div class="submit-coin-page">
    <div class="page-header">
      <h1>Submit New Cryptocurrency</h1>
      <p>If a coin is not available on our platform, you can submit it for review</p>
    </div>

    <!-- 提交表單 -->
    <div class="submit-form-section">
      <h2>Submission Form</h2>
      <form @submit.prevent="submitCoin" class="submit-form">
        <div class="form-row">
          <div class="form-group">
            <label>Coin Name *</label>
            <input
              v-model="formData.name"
              type="text"
              placeholder="e.g., Bitcoin"
              class="form-input"
              required
            />
          </div>
          <div class="form-group">
            <label>Symbol *</label>
            <input
              v-model="formData.symbol"
              type="text"
              placeholder="e.g., BTC"
              class="form-input"
              maxlength="10"
              required
            />
          </div>
        </div>

        <div class="form-group">
          <label>Official Website</label>
          <input
            v-model="formData.website"
            type="url"
            placeholder="https://..."
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label>Description</label>
          <textarea
            v-model="formData.description"
            placeholder="Brief description of the cryptocurrency..."
            class="form-input"
            rows="4"
          ></textarea>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-primary" :disabled="isSubmitting">
            {{ isSubmitting ? 'Submitting...' : 'Submit for Review' }}
          </button>
        </div>

        <div v-if="submitSuccess" class="success-message">
          Your submission has been received and is pending review.
        </div>
      </form>
    </div>

    <!-- 已提交的幣種列表 -->
    <div class="submissions-section">
      <h2>Your Submissions</h2>

      <div v-if="submissions.length === 0" class="empty-state">
        <p>You haven't submitted any coins yet</p>
      </div>

      <div v-else class="submissions-list">
        <div v-for="submission in submissions" :key="submission.id" class="submission-item">
          <div class="submission-info">
            <div class="submission-name">
              <strong>{{ submission.name }}</strong>
              <span class="symbol">({{ submission.symbol.toUpperCase() }})</span>
            </div>
            <div class="submission-date">
              Submitted: {{ formatDate(submission.submittedAt) }}
            </div>
          </div>
          <div class="submission-status" :style="{ color: getStatusColor(submission.status) }">
            {{ getStatusLabel(submission.status) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.submit-coin-page {
  max-width: 800px;
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

.submit-form-section {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 2rem;
  margin-bottom: 2rem;
}

.submit-form-section h2 {
  margin: 0 0 1.5rem 0;
  font-size: 1.25rem;
  color: #111827;
}

.submit-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

@media (max-width: 600px) {
  .form-row {
    grid-template-columns: 1fr;
  }
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

.form-input {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #4F46E5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

textarea.form-input {
  resize: vertical;
  min-height: 100px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
}

.btn-primary {
  background: #4F46E5;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary:hover {
  background: #4338ca;
}

.btn-primary:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.success-message {
  background: #d1fae5;
  color: #065f46;
  padding: 1rem;
  border-radius: 0.375rem;
  text-align: center;
  font-weight: 500;
}

.submissions-section {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 2rem;
}

.submissions-section h2 {
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

.submission-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.375rem;
  border: 1px solid #e5e7eb;
}

.submission-info {
  flex: 1;
}

.submission-name {
  margin-bottom: 0.25rem;
}

.submission-name .symbol {
  color: #6b7280;
  margin-left: 0.5rem;
}

.submission-date {
  font-size: 0.875rem;
  color: #6b7280;
}

.submission-status {
  font-weight: 600;
  font-size: 0.875rem;
}
</style>
