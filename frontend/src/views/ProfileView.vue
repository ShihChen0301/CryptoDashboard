<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { getUserAvatar } from '@/utils/gravatar'
import { profileApi } from '@/utils/api'

const { t } = useI18n()
const isLoading = ref(false)
const errorMessage = ref('')

const user = ref({
  username: '',
  email: '',
  avatarUrl: '',
  joinDate: '',
  tradingExperience: ''
})

// 計算用戶頭像 URL
const userAvatar = computed(() => getUserAvatar(user.value))

const isEditing = ref(false)
const editForm = ref({
  username: '',
  email: '',
  tradingExperience: ''
})

const experienceOptions = computed(() => [
  { value: '', label: t('profile.experience.select') },
  { value: 'less-than-1', label: t('profile.experience.lessThan1') },
  { value: '1-2', label: t('profile.experience.oneToTwo') },
  { value: '3-5', label: t('profile.experience.threeToFive') },
  { value: '5-10', label: t('profile.experience.fiveToTen') },
  { value: 'more-than-10', label: t('profile.experience.moreThan10') }
])

const getExperienceLabel = (value) => {
  const option = experienceOptions.value.find(opt => opt.value === value)
  return option ? option.label : t('profile.experience.notSet')
}

onMounted(async () => {
  // 先從 localStorage 讀取基本資料
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}')
  user.value = storedUser
  editForm.value = {
    username: storedUser.username,
    email: storedUser.email,
    tradingExperience: storedUser.tradingExperience || ''
  }

  // 再從後端取得最新資料
  try {
    const response = await profileApi.get()
    if (response && response.data) {
      user.value = response.data
      editForm.value = {
        username: response.data.username,
        email: response.data.email,
        tradingExperience: response.data.tradingExperience || ''
      }
      // 同步更新 localStorage
      localStorage.setItem('user', JSON.stringify(response.data))
    }
  } catch (error) {
    console.error('Failed to fetch profile:', error)
  }
})

const startEdit = () => {
  isEditing.value = true
}

const cancelEdit = () => {
  isEditing.value = false
  editForm.value = {
    username: user.value.username,
    email: user.value.email,
    tradingExperience: user.value.tradingExperience || ''
  }
}

const saveProfile = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const response = await profileApi.update({
      username: editForm.value.username,
      tradingExperience: editForm.value.tradingExperience
    })

    if (response && response.data) {
      user.value = response.data
      // 同步更新 localStorage
      localStorage.setItem('user', JSON.stringify(response.data))
    }
    isEditing.value = false
  } catch (error) {
    console.error('Failed to save profile:', error)
    errorMessage.value = error.message || '儲存失敗，請稍後再試'
  } finally {
    isLoading.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<template>
  <div class="profile">
    <div class="profile-container">
      <h1>{{ t('profile.title') }}</h1>

      <div class="profile-card">
        <div class="profile-avatar">
          <img :src="userAvatar" :alt="user.username" />
        </div>

        <div class="profile-form">
          <div class="form-group">
            <label>{{ t('profile.username') }}</label>
            <input
              v-if="isEditing"
              v-model="editForm.username"
              type="text"
              class="form-input"
            />
            <div v-else class="form-value">{{ user.username }}</div>
          </div>

          <div class="form-group">
            <label>{{ t('profile.email') }}</label>
            <input
              v-if="isEditing"
              v-model="editForm.email"
              type="email"
              class="form-input"
            />
            <div v-else class="form-value">{{ user.email }}</div>
          </div>

          <div class="form-group">
            <label>{{ t('profile.joinDate') }}</label>
            <div class="form-value">{{ formatDate(user.joinDate) }}</div>
          </div>

          <div class="form-group">
            <label>{{ t('profile.tradingExperience') }}</label>
            <select
              v-if="isEditing"
              v-model="editForm.tradingExperience"
              class="form-input"
            >
              <option
                v-for="option in experienceOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
            <div v-else class="form-value">{{ getExperienceLabel(user.tradingExperience) }}</div>
          </div>

          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>

          <div class="form-actions">
            <button
              v-if="!isEditing"
              @click="startEdit"
              class="btn-primary"
            >
              {{ t('profile.edit') }}
            </button>

            <template v-else>
              <button @click="saveProfile" class="btn-primary" :disabled="isLoading">
                {{ isLoading ? '儲存中...' : t('profile.save') }}
              </button>
              <button @click="cancelEdit" class="btn-secondary" :disabled="isLoading">
                {{ t('profile.cancel') }}
              </button>
            </template>
          </div>
        </div>
      </div>

      <div class="info-section">
        <h2>{{ t('profile.accountInfo') }}</h2>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">{{ t('profile.userId') }}</div>
            <div class="info-value">{{ user.id }}</div>
          </div>

          <div class="info-item">
            <div class="info-label">{{ t('profile.accountStatus') }}</div>
            <div class="info-value status-active">{{ t('profile.statusActive') }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile {
  max-width: 800px;
  margin: 0 auto;
}

.profile-container h1 {
  margin: 0 0 2rem 0;
  font-size: 2rem;
  color: #111827;
}

.profile-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 2rem;
  margin-bottom: 2rem;
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}

.profile-avatar {
  flex-shrink: 0;
}

.profile-avatar img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 3px solid #4F46E5;
}

.profile-form {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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
  text-transform: uppercase;
  letter-spacing: 0.05em;
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

.form-value {
  padding: 0.75rem 0;
  font-size: 1rem;
  color: #111827;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
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

.btn-secondary {
  background: #e5e7eb;
  color: #374151;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-secondary:hover {
  background: #d1d5db;
}

.info-section {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 2rem;
}

.info-section h2 {
  margin: 0 0 1.5rem 0;
  font-size: 1.25rem;
  color: #111827;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.info-item {
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.375rem;
}

.info-label {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.info-value {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
}

.status-active {
  color: #10b981;
}

.error-message {
  padding: 0.75rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.375rem;
  color: #dc2626;
  font-size: 0.875rem;
}

.btn-primary:disabled,
.btn-secondary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
