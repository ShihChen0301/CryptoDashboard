<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
  },
  icon: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'blur', 'focus'])

const hasError = computed(() => !!props.error)

const handleInput = (event) => {
  emit('update:modelValue', event.target.value)
}

const handleBlur = (event) => {
  emit('blur', event)
}

const handleFocus = (event) => {
  emit('focus', event)
}
</script>

<template>
  <div class="input-field">
    <label v-if="label" class="input-label">
      {{ label }}
      <span v-if="required" class="required">*</span>
    </label>

    <div class="input-wrapper" :class="{ 'has-error': hasError, 'has-icon': icon }">
      <span v-if="icon" class="input-icon">{{ icon }}</span>
      <input
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        class="input"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      />
    </div>

    <span v-if="hasError" class="error-message">{{ error }}</span>
  </div>
</template>

<style scoped>
.input-field {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  width: 100%;
}

.input-label {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text-primary);
  display: block;
}

.required {
  color: var(--color-danger);
  margin-left: var(--spacing-xs);
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrapper.has-icon .input {
  padding-left: 2.5rem;
}

.input-icon {
  position: absolute;
  left: 0.875rem;
  font-size: var(--text-lg);
  color: var(--color-text-tertiary);
  pointer-events: none;
}

.input {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: var(--text-base);
  font-family: var(--font-sans);
  color: var(--color-text-primary);
  background-color: var(--color-bg-primary);
  border: 1px solid var(--color-border-medium);
  border-radius: var(--radius-md);
  transition: all var(--transition-base);
  outline: none;
}

.input::placeholder {
  color: var(--color-text-tertiary);
}

.input:hover:not(:disabled) {
  border-color: var(--color-border-dark);
}

.input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.input:disabled {
  background-color: var(--color-bg-tertiary);
  cursor: not-allowed;
  opacity: 0.6;
}

.input-wrapper.has-error .input {
  border-color: var(--color-danger);
}

.input-wrapper.has-error .input:focus {
  border-color: var(--color-danger);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.error-message {
  font-size: var(--text-sm);
  color: var(--color-danger);
  margin-top: var(--spacing-xs);
}
</style>
