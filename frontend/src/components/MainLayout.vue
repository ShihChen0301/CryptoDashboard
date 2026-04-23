<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from './Navbar.vue'
import Sidebar from './Sidebar.vue'

const route = useRoute()
const isMobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}
</script>

<template>
  <div class="main-layout">
    <Sidebar :class="{ 'mobile-open': isMobileMenuOpen }" />

    <!-- Mobile menu overlay -->
    <div
      v-if="isMobileMenuOpen"
      class="mobile-overlay"
      @click="closeMobileMenu"
    ></div>

    <div class="content-wrapper">
      <Navbar @toggle-mobile-menu="toggleMobileMenu" />
      <main class="main-content">
        <div class="content-container">
          <router-view v-slot="{ Component }">
            <component :is="Component" :key="route.fullPath" />
          </router-view>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.main-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  background: var(--color-bg-secondary);
  padding: var(--spacing-xl);
}

.content-container {
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;
}
/* Mobile overlay */
.mobile-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: calc(var(--z-fixed) - 1);
  backdrop-filter: blur(4px);
}

@media (max-width: 768px) {
  .main-content {
    padding: var(--spacing-md);
  }

  .mobile-overlay {
    display: block;
  }
}
</style>
