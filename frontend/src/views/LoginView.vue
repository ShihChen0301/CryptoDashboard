<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { mockLogin } from '../utils/mockAuth'

const router = useRouter()

const email = ref('')
const password = ref('')
const error = ref('')

const handleLogin = () => {
  error.value = ''

  // 表單驗證
  if (!email.value || !password.value) {
    error.value = 'Please fill in all fields'
    return
  }

  // 假登入驗證
  const result = mockLogin(email.value, password.value)

  if (result.success) {
    // 儲存 token 和使用者資訊
    localStorage.setItem('authToken', result.token)
    localStorage.setItem('user', JSON.stringify(result.user))

    // 導向 dashboard
    router.push('/dashboard')
  } else {
    error.value = result.message
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <div class="brand-logo">
          <img src="/favicon.jpg" alt="CoinVue Logo" class="logo-image" />
          <div class="brand-text">
            <h1>CoinVue</h1>
            <span class="brand-subtitle">幣景</span>
          </div>
        </div>
        <p>Sign in to your account</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="demo@example.com"
            required
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Enter your password"
            required
          />
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <button type="submit" class="btn-submit">
          Sign In
        </button>

        <div class="login-footer">
          <p>
            Don't have an account?
            <router-link to="/register">Sign up</router-link>
          </p>
        </div>

        <div class="demo-info">
          <p><strong>Demo Account:</strong></p>
          <p>Email: demo@example.com</p>
          <p>Password: password</p>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
}

.login-card {
  background: white;
  border-radius: 0.75rem;
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.brand-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.logo-image {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #4F46E5;
}

.brand-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.login-header h1 {
  color: #4F46E5;
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.2;
}

.brand-subtitle {
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
  margin-top: 0.125rem;
}

.login-header p {
  color: #6b7280;
  margin: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
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

.form-group input {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #4F46E5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.error-message {
  background: #fee2e2;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.btn-submit {
  background: #4F46E5;
  color: white;
  border: none;
  padding: 0.875rem;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-submit:hover {
  background: #4338ca;
}

.login-footer {
  text-align: center;
  margin-top: 1rem;
}

.login-footer p {
  color: #6b7280;
  font-size: 0.875rem;
}

.login-footer a {
  color: #4F46E5;
  text-decoration: none;
  font-weight: 600;
}

.login-footer a:hover {
  text-decoration: underline;
}

.demo-info {
  background: #f3f4f6;
  padding: 1rem;
  border-radius: 0.375rem;
  margin-top: 1rem;
}

.demo-info p {
  margin: 0.25rem 0;
  font-size: 0.875rem;
  color: #4b5563;
}
</style>
