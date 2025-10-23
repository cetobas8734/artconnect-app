# Components Folder (`src/components/`)

**Components** adalah reusable UI pieces yang digunakan di banyak tempat dalam aplikasi.

---

## 🎯 Apa Bedanya dengan `modules/{name}/components/`?

| | `src/components/` | `modules/{name}/components/` |
|---|---|---|
| **Scope** | Generic, reusable across modules | Module-specific |
| **Example** | Button, Modal, Card, Input | ArtworkCard, PipelineBoard |
| **Dependency** | No business logic | May use module composables |
| **Usage** | Used dalam 2+ modules | Only used dalam 1 module |

**Rule of thumb:**
- Jika component dipakai di 2+ modules → `src/components/`
- Jika component specific untuk 1 module → `modules/{name}/components/`

---

## 📂 Folder Structure

```
components/
├── ui/                         # Pure UI components (presentational)
│   ├── Button.vue              # Button (primary, secondary, danger)
│   ├── Card.vue                # Card container
│   ├── Modal.vue               # Modal/dialog
│   ├── Badge.vue               # Badge/label
│   ├── Spinner.vue             # Loading spinner
│   └── Dropdown.vue            # Dropdown menu
│
├── forms/                      # Form-related components
│   ├── TextInput.vue           # Text input dengan validation
│   ├── TextArea.vue            # Textarea field
│   ├── Select.vue              # Select dropdown
│   ├── Checkbox.vue            # Checkbox input
│   ├── RadioGroup.vue          # Radio buttons
│   ├── FileUpload.vue          # File upload dengan preview
│   └── DatePicker.vue          # Date picker (future)
│
├── layout/                     # Layout components
│   ├── AppHeader.vue           # Top navigation bar
│   ├── AppSidebar.vue          # Sidebar navigation
│   ├── AppFooter.vue           # Footer
│   └── Container.vue           # Content container (max-width, padding)
│
├── feedback/                   # User feedback components
│   ├── Toast.vue               # Toast notification
│   ├── Alert.vue               # Alert message (info, success, error)
│   └── EmptyState.vue          # Empty state placeholder
│
└── data/                       # Data display components
    ├── Table.vue               # Data table (future)
    ├── Pagination.vue          # Pagination controls (future)
    └── Chart.vue               # Chart wrapper (future)
```

---

## ✅ Best Practices

### 1. **Props-Driven (Stateless)**

Components should be **presentational** (tidak manage internal state):

```vue
<!-- ❌ Jangan begini (stateful, hardcoded) -->
<script setup>
import { ref } from 'vue'

const count = ref(0) // ❌ Internal state
const increment = () => count.value++
</script>

<template>
  <button @click="increment">Count: {{ count }}</button>
</template>
```

```vue
<!-- ✅ Begini (stateless, props-driven) -->
<script setup>
defineProps({
  count: { type: Number, required: true }
})

defineEmits(['increment'])
</script>

<template>
  <button @click="$emit('increment')">Count: {{ count }}</button>
</template>

<!-- Usage: -->
<!-- <MyButton :count="count" @increment="handleIncrement" /> -->
```

**Keuntungan:**
- ✅ Reusable (parent control behavior)
- ✅ Testable (no side effects)
- ✅ Predictable (same props = same output)

---

### 2. **Props Validation**

Always validate props:

```vue
<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'danger'].includes(value)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  }
})
</script>
```

**Best practices:**
- ✅ Use `type` untuk type checking
- ✅ Set `default` value
- ✅ Use `validator` untuk enum values
- ✅ Mark `required: true` jika mandatory

---

### 3. **Emit Events (not Direct Mutation)**

```vue
<!-- ❌ Jangan begini (mutate props) -->
<script setup>
const props = defineProps({ modelValue: String })

const updateValue = (e) => {
  props.modelValue = e.target.value // ❌ Mutating props
}
</script>

<template>
  <input :value="modelValue" @input="updateValue">
</template>
```

```vue
<!-- ✅ Begini (emit events) -->
<script setup>
defineProps({ modelValue: String })
defineEmits(['update:modelValue'])
</script>

<template>
  <input 
    :value="modelValue" 
    @input="$emit('update:modelValue', $event.target.value)"
  >
</template>

<!-- Usage dengan v-model: -->
<!-- <TextInput v-model="name" /> -->
```

---

### 4. **Slots for Flexibility**

Use slots untuk custom content:

```vue
<!-- components/ui/Card.vue -->
<script setup>
defineProps({
  title: String
})
</script>

<template>
  <div class="card">
    <div v-if="title || $slots.header" class="card-header">
      <slot name="header">
        <h3>{{ title }}</h3>
      </slot>
    </div>
    
    <div class="card-body">
      <slot>Default content</slot>
    </div>
    
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>
```

**Usage:**
```vue
<Card title="My Card">
  <p>Card content here</p>
  
  <template #footer>
    <button>Action</button>
  </template>
</Card>
```

---

### 5. **Scoped Styles**

Always use `<style scoped>`:

```vue
<style scoped>
.button {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-weight: 500;
}

.button--primary {
  background: var(--color-primary);
  color: white;
}

.button--secondary {
  background: var(--color-secondary);
  color: var(--color-text);
}

.button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
```

**Best practices:**
- ✅ Use `scoped` to avoid style leaks
- ✅ Use CSS custom properties (variables)
- ✅ BEM naming convention (`.block__element--modifier`)

---

## 📝 Component Examples

### Example 1: Button Component

```vue
<!-- components/ui/Button.vue -->
<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (v) => ['primary', 'secondary', 'danger'].includes(v)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (v) => ['small', 'medium', 'large'].includes(v)
  },
  disabled: Boolean,
  loading: Boolean,
  type: {
    type: String,
    default: 'button'
  }
})

defineEmits(['click'])
</script>

<template>
  <button
    :class="[
      'btn',
      `btn--${variant}`,
      `btn--${size}`,
      { 'btn--loading': loading }
    ]"
    :disabled="disabled || loading"
    :type="type"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="btn__spinner"></span>
    <slot></slot>
  </button>
</template>

<style scoped>
.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn--primary {
  background: #3b82f6;
  color: white;
}

.btn--primary:hover {
  background: #2563eb;
}

.btn--secondary {
  background: #e5e7eb;
  color: #1f2937;
}

.btn--danger {
  background: #ef4444;
  color: white;
}

.btn--small {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

.btn--large {
  padding: 0.75rem 1.5rem;
  font-size: 1.125rem;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn--loading {
  position: relative;
  color: transparent;
}

.btn__spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  /* Add spinner animation */
}
</style>
```

**Usage:**
```vue
<Button variant="primary" @click="handleSave">Save</Button>
<Button variant="danger" size="small" @click="handleDelete">Delete</Button>
<Button variant="secondary" :loading="isLoading">Submit</Button>
```

---

### Example 2: TextInput Component

```vue
<!-- components/forms/TextInput.vue -->
<script setup>
defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  label: String,
  type: {
    type: String,
    default: 'text'
  },
  placeholder: String,
  error: String,
  required: Boolean,
  disabled: Boolean
})

defineEmits(['update:modelValue', 'blur'])
</script>

<template>
  <div class="text-input">
    <label v-if="label" class="text-input__label">
      {{ label }}
      <span v-if="required" class="text-input__required">*</span>
    </label>
    
    <input
      :value="modelValue"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="['text-input__field', { 'text-input__field--error': error }]"
      @input="$emit('update:modelValue', $event.target.value)"
      @blur="$emit('blur', $event)"
    >
    
    <span v-if="error" class="text-input__error">{{ error }}</span>
  </div>
</template>

<style scoped>
.text-input {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.text-input__label {
  font-weight: 500;
  font-size: 0.875rem;
  color: #374151;
}

.text-input__required {
  color: #ef4444;
}

.text-input__field {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 1rem;
}

.text-input__field:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.text-input__field--error {
  border-color: #ef4444;
}

.text-input__error {
  color: #ef4444;
  font-size: 0.875rem;
}
</style>
```

**Usage:**
```vue
<script setup>
import { ref } from 'vue'

const email = ref('')
const emailError = ref('')

const validateEmail = () => {
  if (!email.value.includes('@')) {
    emailError.value = 'Invalid email'
  } else {
    emailError.value = ''
  }
}
</script>

<template>
  <TextInput
    v-model="email"
    label="Email"
    type="email"
    placeholder="you@example.com"
    :error="emailError"
    required
    @blur="validateEmail"
  />
</template>
```

---

### Example 3: Modal Component

```vue
<!-- components/ui/Modal.vue -->
<script setup>
defineProps({
  show: {
    type: Boolean,
    required: true
  },
  title: String,
  size: {
    type: String,
    default: 'medium',
    validator: (v) => ['small', 'medium', 'large'].includes(v)
  }
})

defineEmits(['close'])
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="modal-overlay" @click="$emit('close')">
        <div 
          :class="['modal', `modal--${size}`]" 
          @click.stop
        >
          <div class="modal__header">
            <h2 v-if="title">{{ title }}</h2>
            <slot name="header"></slot>
            <button class="modal__close" @click="$emit('close')">×</button>
          </div>
          
          <div class="modal__body">
            <slot></slot>
          </div>
          
          <div v-if="$slots.footer" class="modal__footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 8px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  max-height: 90vh;
  overflow-y: auto;
}

.modal--small { width: 400px; }
.modal--medium { width: 600px; }
.modal--large { width: 800px; }

.modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal__close {
  font-size: 2rem;
  line-height: 1;
  background: none;
  border: none;
  cursor: pointer;
}

.modal__body {
  padding: 1.5rem;
}

.modal__footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

/* Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
```

**Usage:**
```vue
<script setup>
import { ref } from 'vue'

const showModal = ref(false)
</script>

<template>
  <Button @click="showModal = true">Open Modal</Button>
  
  <Modal :show="showModal" title="Confirm Delete" @close="showModal = false">
    <p>Are you sure you want to delete this artwork?</p>
    
    <template #footer>
      <Button variant="secondary" @click="showModal = false">Cancel</Button>
      <Button variant="danger" @click="handleDelete">Delete</Button>
    </template>
  </Modal>
</template>
```

---

## 🎓 Learning Exercise

**Task:** Buat component `Card.vue`

Requirements:
1. Props: `title`, `subtitle`, `image`
2. Slots: `header`, default, `footer`
3. Emit: `click` event
4. Style: Scoped CSS dengan hover effect
5. Responsive: Stack pada mobile

**Bonus:** Add `variant` prop (default, bordered, elevated)

---

## 📖 Reference

- **Vue Components:** https://vuejs.org/guide/essentials/component-basics.html
- **Props:** https://vuejs.org/guide/components/props.html
- **Events:** https://vuejs.org/guide/components/events.html
- **Slots:** https://vuejs.org/guide/components/slots.html

---

**Next:** Baca README di `composables/`, `services/`
