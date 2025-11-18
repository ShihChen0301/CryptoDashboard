<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const isCollapsed = ref(false)

const menuItems = [
  { name: 'Dashboard', path: '/dashboard', icon: '📊' },
  { name: 'Market', path: '/market', icon: '💹' },
  { name: 'Watchlist', path: '/watchlist', icon: '⭐' },
  { name: 'Profile', path: '/profile', icon: '👤' }
]

const isActive = (path) => {
  return route.path === path
}

const navigate = (path) => {
  router.push(path)
}

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}
</script>

<template>
  <aside :class="['sidebar', { collapsed: isCollapsed }]">
    <div class="sidebar-header">
      <button class="toggle-btn" @click="toggleSidebar">
        <span>{{ isCollapsed ? '☰' : '✕' }}</span>
      </button>
    </div>

    <div class="sidebar-menu">
      <div
        v-for="item in menuItems"
        :key="item.path"
        :class="['menu-item', { active: isActive(item.path) }]"
        @click="navigate(item.path)"
      >
        <span class="menu-icon">{{ item.icon }}</span>
        <span v-if="!isCollapsed" class="menu-name">{{ item.name }}</span>
      </div>
    </div>

    <div class="sidebar-footer">
      <div class="version-info" v-if="!isCollapsed">
        <span class="version-label">Version</span>
        <span class="version-number">1.0.0</span>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: var(--sidebar-width);
  background: linear-gradient(180deg, var(--color-bg-darker) 0%, var(--color-bg-dark) 100%);
  height: 100vh;
  position: sticky;
  top: 0;
  color: var(--color-text-white);
  padding: var(--spacing-lg) 0;
  display: flex;
  flex-direction: column;
  transition: width var(--transition-base);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: var(--shadow-lg);
}

.sidebar.collapsed {
  width: var(--sidebar-collapsed-width);
}

.sidebar-header {
  padding: 0 var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.toggle-btn {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-text-white);
  font-size: var(--text-xl);
  cursor: pointer;
  transition: all var(--transition-base);
  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: scale(1.05);
}

.sidebar-menu {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  padding: 0 var(--spacing-md);
  flex: 1;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
  cursor: pointer;
  transition: all var(--transition-base);
  color: rgba(255, 255, 255, 0.7);
  border-radius: var(--radius-lg);
  position: relative;
  overflow: hidden;
}

.menu-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: var(--color-primary-light);
  transform: scaleY(0);
  transition: transform var(--transition-base);
}

.menu-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-text-white);
  transform: translateX(4px);
}

.menu-item:hover::before {
  transform: scaleY(1);
}

.menu-item.active {
  background: linear-gradient(90deg, rgba(99, 102, 241, 0.2) 0%, rgba(99, 102, 241, 0.1) 100%);
  color: var(--color-text-white);
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.3);
}

.menu-item.active::before {
  transform: scaleY(1);
  background: var(--color-primary-light);
  box-shadow: 0 0 10px var(--color-primary-light);
}

.menu-icon {
  font-size: var(--text-2xl);
  min-width: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform var(--transition-base);
}

.menu-item:hover .menu-icon {
  transform: scale(1.1);
}

.menu-item.active .menu-icon {
  transform: scale(1.15);
  filter: drop-shadow(0 0 8px rgba(129, 140, 248, 0.8));
}

.menu-name {
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  white-space: nowrap;
  transition: opacity var(--transition-base);
}

.sidebar.collapsed .menu-name {
  opacity: 0;
  width: 0;
}

.sidebar-footer {
  padding: 0 var(--spacing-lg);
  margin-top: var(--spacing-xl);
}

.version-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  padding: var(--spacing-md);
  background: rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-md);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.version-label {
  font-size: var(--text-xs);
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.version-number {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--color-primary-light);
}

@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    z-index: var(--z-fixed);
    transform: translateX(-100%);
  }

  .sidebar.mobile-open {
    transform: translateX(0);
  }
}
</style>
