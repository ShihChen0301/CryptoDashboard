<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const user = ref(JSON.parse(localStorage.getItem('user') || '{}'))
const showDropdown = ref(false)

const logout = () => {
  localStorage.removeItem('authToken')
  localStorage.removeItem('user')
  localStorage.removeItem('crypto_favorites')
  router.push('/login')
}

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const closeDropdown = () => {
  showDropdown.value = false
}
</script>

<template>
  <nav class="navbar">
    <div class="navbar-content">
      <div class="navbar-title" @click="router.push('/dashboard')">
        <img src="/favicon.jpg" alt="CryptoDashboard Logo" class="logo-image" />
        <h2>CryptoDashboard</h2>
      </div>

      <div class="navbar-right">
        <div class="user-section" @click="toggleDropdown">
          <div class="user-info">
            <img :src="user.avatar" alt="avatar" class="avatar" />
            <span class="username">{{ user.username || 'User' }}</span>
          </div>
          <span class="dropdown-arrow">▼</span>

          <div v-if="showDropdown" class="user-dropdown" @click.stop>
            <div class="dropdown-item user-profile">
              <div class="user-detail">
                <div class="user-name">{{ user.username || 'User' }}</div>
                <div class="user-email">{{ user.email || 'user@example.com' }}</div>
              </div>
            </div>
            <div class="dropdown-divider"></div>
            <button @click="logout" class="dropdown-item dropdown-button">
              <span class="dropdown-icon">🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showDropdown" class="dropdown-backdrop" @click="closeDropdown"></div>
  </nav>
</template>

<style scoped>
.navbar {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-border-default);
  padding: 0 var(--spacing-xl);
  height: var(--navbar-height);
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
  box-shadow: var(--shadow-sm);
}

.navbar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
}

.navbar-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
  transition: opacity var(--transition-base);
}

.navbar-title:hover {
  opacity: 0.8;
}

.logo-image {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  object-fit: cover;
}

.navbar-title h2 {
  margin: 0;
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

.user-section {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-base);
}

.user-section:hover {
  background: var(--color-bg-tertiary);
}

.user-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
  border: 2px solid var(--color-primary-light);
  object-fit: cover;
}

.username {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text-primary);
}

.dropdown-arrow {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
  transition: transform var(--transition-base);
}

.user-section:hover .dropdown-arrow {
  transform: translateY(2px);
}

.user-dropdown {
  position: absolute;
  top: calc(100% + var(--spacing-sm));
  right: 0;
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  min-width: 220px;
  overflow: hidden;
  z-index: var(--z-dropdown);
  animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-item {
  padding: var(--spacing-md);
  cursor: pointer;
  transition: background var(--transition-fast);
}

.dropdown-item:hover {
  background: var(--color-bg-secondary);
}

.user-profile {
  cursor: default;
}

.user-profile:hover {
  background: transparent;
}

.user-detail {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.user-name {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
}

.user-email {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

.dropdown-divider {
  height: 1px;
  background: var(--color-border-default);
  margin: var(--spacing-xs) 0;
}

.dropdown-button {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  width: 100%;
  border: none;
  background: transparent;
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-danger);
  text-align: left;
}

.dropdown-icon {
  font-size: var(--text-lg);
}

.dropdown-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: calc(var(--z-dropdown) - 1);
}

@media (max-width: 768px) {
  .navbar {
    padding: 0 var(--spacing-md);
  }

  .navbar-title h2 {
    font-size: var(--text-lg);
  }

  .username {
    display: none;
  }

  .avatar {
    width: 32px;
    height: 32px;
  }
}
</style>
