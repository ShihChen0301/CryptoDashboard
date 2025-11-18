import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/',
      component: () => import('../components/MainLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          redirect: '/dashboard'
        },
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('../views/DashboardView.vue')
        },
        {
          path: 'market',
          name: 'market',
          component: () => import('../views/MarketListView.vue')
        },
        {
          path: 'coin/:id',
          name: 'coin-detail',
          component: () => import('../views/CoinDetailView.vue')
        },
        {
          path: 'watchlist',
          name: 'watchlist',
          component: () => import('../views/WatchlistView.vue')
        },
        {
          path: 'compare',
          name: 'compare',
          component: () => import('../views/CompareView.vue')
        },
        {
          path: 'submit-coin',
          name: 'submit-coin',
          component: () => import('../views/SubmitCoinView.vue')
        },
        {
          path: 'admin',
          name: 'admin',
          component: () => import('../views/AdminView.vue'),
          meta: { requiresAdmin: true }
        },
        {
          path: 'profile',
          name: 'profile',
          component: () => import('../views/ProfileView.vue')
        }
      ]
    }
  ]
})

// 路由守衛
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('authToken')
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresGuest && isAuthenticated) {
    next('/dashboard')
  } else if (to.meta.requiresAdmin && user.role !== 'admin') {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
