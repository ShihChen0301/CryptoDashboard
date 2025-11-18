<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: 'primary', // primary, secondary, success, danger, outline
    validator: (value) => ['primary', 'secondary', 'success', 'danger', 'outline'].includes(value)
  },
  size: {
    type: String,
    default: 'md', // sm, md, lg
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  fullWidth: {
    type: Boolean,
    default: false
  },
  icon: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['click'])

const handleClick = (event) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<template>
  <button
    :class="[
      'btn',
      `btn-${variant}`,
      `btn-${size}`,
      { 'btn-full-width': fullWidth, 'btn-loading': loading }
    ]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading" class="spinner"></span>
    <span v-if="icon && !loading" class="btn-icon">{{ icon }}</span>
    <span class="btn-content">
      <slot></slot>
    </span>
  </button>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  font-family: var(--font-sans);
  font-weight: var(--font-semibold);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-base);
  outline: none;
  position: relative;
  white-space: nowrap;
}

.btn:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Sizes */
.btn-sm {
  padding: 0.5rem 1rem;
  font-size: var(--text-sm);
}

.btn-md {
  padding: 0.75rem 1.5rem;
  font-size: var(--text-base);
}

.btn-lg {
  padding: 1rem 2rem;
  font-size: var(--text-lg);
}

/* Variants */
.btn-primary {
  background-color: var(--color-primary);
  color: var(--color-text-white);
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--color-primary-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
}

.btn-secondary {
  background-color: var(--color-bg-dark);
  color: var(--color-text-white);
}

.btn-secondary:hover:not(:disabled) {
  background-color: var(--color-bg-darker);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-success {
  background-color: var(--color-success);
  color: var(--color-text-white);
}

.btn-success:hover:not(:disabled) {
  background-color: var(--color-success-light);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-danger {
  background-color: var(--color-danger);
  color: var(--color-text-white);
}

.btn-danger:hover:not(:disabled) {
  background-color: var(--color-danger-light);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-outline {
  background-color: transparent;
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
}

.btn-outline:hover:not(:disabled) {
  background-color: var(--color-primary);
  color: var(--color-text-white);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

/* Full width */
.btn-full-width {
  width: 100%;
}

/* Loading state */
.btn-loading {
  pointer-events: none;
}

.spinner {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: var(--radius-full);
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.btn-icon {
  font-size: 1.2em;
}

.btn-content {
  display: inline-flex;
  align-items: center;
}
</style>
