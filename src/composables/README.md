# Composables Folder (`src/composables/`)

**Composables** adalah reusable composition functions yang encapsulate **stateful logic** menggunakan Vue Composition API.

---

## 🎯 Apa itu Composable?

**Composable** = Function yang menggunakan **Vue Composition API** (ref, computed, watch, lifecycle hooks) untuk create reusable logic.

**Formula:**
```
Composable = Reactive State + Methods + Side Effects
```

**Kapan pakai composable?**
- ✅ Logic yang dipakai di 2+ components
- ✅ Perlu reactive state (ref, reactive)
- ✅ Perlu lifecycle hooks (onMounted, onUnmounted)
- ✅ Complex logic yang bisa di-extract

**Kapan TIDAK pakai composable?**
- ❌ Pure functions (no state) → Pakai `utils/`
- ❌ API calls only (no state management) → Pakai `services/`
- ❌ Component-specific logic → Keep di component

---

## 📂 File Structure

```
composables/
├── useAuth.js              # Authentication state & methods
├── useFetch.js             # Generic data fetching utility
├── useForm.js              # Form state & validation
├── useToast.js             # Toast notification system
├── usePagination.js        # Pagination logic
├── useDebounce.js          # Debounce utility
├── useLocalStorage.js      # localStorage sync
└── useClickOutside.js      # Detect clicks outside element
```

---

## ✅ Best Practices

### 1. **Naming Convention**

**Always prefix dengan `use`:**
```javascript
// ✅ Good
useAuth.js
useFetch.js
useForm.js

// ❌ Bad
auth.js
fetch.js
form.js
```

**Why?**
- Clear identifier (langsung tau ini composable)
- Follows Vue convention
- Distinct dari services/utils

---

### 2. **Return Object (not Array)**

```javascript
// ❌ Jangan begini (array destructuring)
export function useCounter() {
  const count = ref(0)
  const increment = () => count.value++
  
  return [count, increment] // ❌ Array
}

// Usage (confusing order)
const [count, increment] = useCounter()
```

```javascript
// ✅ Begini (object destructuring)
export function useCounter() {
  const count = ref(0)
  const increment = () => count.value++
  
  return { count, increment } // ✅ Object
}

// Usage (clear, order-independent)
const { count, increment } = useCounter()
const { increment } = useCounter() // Can skip count
```

**Keuntungan:**
- ✅ Self-documenting (clear names)
- ✅ Flexible (can skip properties)
- ✅ Order-independent

---

### 3. **Accept Options Object**

```javascript
// ✅ Good (options object)
export function useFetch(url, options = {}) {
  const {
    method = 'GET',
    immediate = true,
    onSuccess,
    onError
  } = options
  
  // ...
}

// Usage
const { data, loading } = useFetch('/api/artworks', {
  immediate: false,
  onSuccess: (data) => console.log('Loaded:', data)
})
```

**Keuntungan:**
- ✅ Clear intent
- ✅ Easy to add new options
- ✅ Default values

---

### 4. **Reactive Return Values**

```javascript
// Always return reactive values (ref, computed)
export function useAuth() {
  const user = ref(null)
  const isAuthenticated = computed(() => user.value !== null)
  
  return {
    user,           // ref
    isAuthenticated // computed
  }
}

// Usage
const { user, isAuthenticated } = useAuth()

// ✅ Reactive (auto-updates template)
watch(isAuthenticated, (newVal) => {
  console.log('Auth changed:', newVal)
})
```

---

### 5. **Cleanup in onUnmounted**

```javascript
import { ref, onMounted, onUnmounted } from 'vue'

export function useEventListener(target, event, handler) {
  onMounted(() => {
    target.addEventListener(event, handler)
  })
  
  onUnmounted(() => {
    target.removeEventListener(event, handler) // ✅ Cleanup
  })
}
```

**Always cleanup:**
- Event listeners
- Timers (setTimeout, setInterval)
- Subscriptions
- WebSocket connections

---

## 📝 Composable Examples

### Example 1: useAuth (Authentication State)

```javascript
// composables/useAuth.js
import { ref, computed } from 'vue'
import { signInWithGoogle, signOutUser, onAuthChange } from '@/services/firebase/auth'

// Shared state (singleton pattern)
const user = ref(null)
const loading = ref(true)
const error = ref(null)

export function useAuth() {
  // Computed
  const isAuthenticated = computed(() => user.value !== null)
  const userName = computed(() => user.value?.displayName || '')
  const userEmail = computed(() => user.value?.email || '')

  // Methods
  const login = async () => {
    loading.value = true
    error.value = null
    
    try {
      const result = await signInWithGoogle()
      user.value = result.user
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      await signOutUser()
      user.value = null
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  // Initialize auth state listener (call once)
  if (!user.value && !loading.value) {
    onAuthChange((newUser) => {
      user.value = newUser
      loading.value = false
    })
  }

  return {
    // State
    user,
    loading,
    error,
    
    // Computed
    isAuthenticated,
    userName,
    userEmail,
    
    // Methods
    login,
    logout
  }
}
```

**Usage:**
```vue
<script setup>
import { useAuth } from '@/composables/useAuth'

const { user, isAuthenticated, login, logout } = useAuth()
</script>

<template>
  <div v-if="isAuthenticated">
    <p>Welcome, {{ user.displayName }}</p>
    <button @click="logout">Logout</button>
  </div>
  <div v-else>
    <button @click="login">Sign in with Google</button>
  </div>
</template>
```

---

### Example 2: useFetch (Generic Data Fetching)

```javascript
// composables/useFetch.js
import { ref, watchEffect } from 'vue'
import axios from '@/config/axios'

export function useFetch(url, options = {}) {
  const {
    method = 'GET',
    immediate = true,
    onSuccess,
    onError
  } = options

  const data = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const execute = async (config = {}) => {
    loading.value = true
    error.value = null

    try {
      const response = await axios({
        url,
        method,
        ...config
      })
      
      data.value = response.data
      
      if (onSuccess) {
        onSuccess(response.data)
      }
      
      return response.data
    } catch (err) {
      error.value = err.message
      
      if (onError) {
        onError(err)
      }
      
      throw err
    } finally {
      loading.value = false
    }
  }

  if (immediate) {
    execute()
  }

  return {
    data,
    loading,
    error,
    execute,
    refetch: execute
  }
}
```

**Usage:**
```vue
<script setup>
import { useFetch } from '@/composables/useFetch'

const { data: artworks, loading, error, refetch } = useFetch('/artworks')
</script>

<template>
  <div v-if="loading">Loading...</div>
  <div v-else-if="error">Error: {{ error }}</div>
  <div v-else>
    <button @click="refetch">Refresh</button>
    <div v-for="art in artworks" :key="art.id">{{ art.title }}</div>
  </div>
</template>
```

---

### Example 3: useForm (Form State & Validation)

```javascript
// composables/useForm.js
import { ref, reactive, computed } from 'vue'

export function useForm(initialValues, validators = {}) {
  const values = reactive({ ...initialValues })
  const errors = reactive({})
  const touched = reactive({})
  const isSubmitting = ref(false)

  const isValid = computed(() => {
    return Object.keys(errors).length === 0
  })

  const validate = (field) => {
    if (validators[field]) {
      const error = validators[field](values[field])
      if (error) {
        errors[field] = error
      } else {
        delete errors[field]
      }
    }
  }

  const validateAll = () => {
    Object.keys(validators).forEach(field => validate(field))
  }

  const handleChange = (field, value) => {
    values[field] = value
    touched[field] = true
    validate(field)
  }

  const handleBlur = (field) => {
    touched[field] = true
    validate(field)
  }

  const handleSubmit = async (onSubmit) => {
    validateAll()
    
    if (!isValid.value) {
      return
    }

    isSubmitting.value = true
    
    try {
      await onSubmit(values)
    } finally {
      isSubmitting.value = false
    }
  }

  const reset = () => {
    Object.assign(values, initialValues)
    Object.keys(errors).forEach(key => delete errors[key])
    Object.keys(touched).forEach(key => delete touched[key])
  }

  return {
    values,
    errors,
    touched,
    isValid,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    validate,
    validateAll
  }
}
```

**Usage:**
```vue
<script setup>
import { useForm } from '@/composables/useForm'
import artworksService from '@/modules/artworks/services/artworksService'

const { values, errors, handleChange, handleSubmit, isValid } = useForm(
  {
    title: '',
    price: 0,
    description: ''
  },
  {
    title: (value) => {
      if (!value) return 'Title is required'
      if (value.length < 3) return 'Title must be at least 3 characters'
      return null
    },
    price: (value) => {
      if (value <= 0) return 'Price must be greater than 0'
      return null
    }
  }
)

const onSubmit = async (values) => {
  await artworksService.create(values)
  router.push('/artworks')
}
</script>

<template>
  <form @submit.prevent="handleSubmit(onSubmit)">
    <TextInput
      :modelValue="values.title"
      @update:modelValue="handleChange('title', $event)"
      label="Title"
      :error="errors.title"
    />
    
    <TextInput
      :modelValue="values.price"
      @update:modelValue="handleChange('price', $event)"
      type="number"
      label="Price"
      :error="errors.price"
    />
    
    <button type="submit" :disabled="!isValid">Submit</button>
  </form>
</template>
```

---

### Example 4: useDebounce (Debounce Input)

```javascript
// composables/useDebounce.js
import { ref, watch } from 'vue'

export function useDebounce(value, delay = 500) {
  const debouncedValue = ref(value.value)
  let timeout

  watch(value, (newValue) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      debouncedValue.value = newValue
    }, delay)
  })

  return debouncedValue
}
```

**Usage:**
```vue
<script setup>
import { ref } from 'vue'
import { useDebounce } from '@/composables/useDebounce'

const searchQuery = ref('')
const debouncedQuery = useDebounce(searchQuery, 500)

// Watch debounced value untuk API call
watch(debouncedQuery, (newQuery) => {
  // Call API dengan newQuery
  console.log('Search:', newQuery)
})
</script>

<template>
  <input v-model="searchQuery" placeholder="Search...">
  <p>Searching for: {{ debouncedQuery }}</p>
</template>
```

---

### Example 5: useLocalStorage (Persist State)

```javascript
// composables/useLocalStorage.js
import { ref, watch } from 'vue'

export function useLocalStorage(key, defaultValue) {
  const storedValue = localStorage.getItem(key)
  const data = ref(storedValue ? JSON.parse(storedValue) : defaultValue)

  watch(
    data,
    (newValue) => {
      localStorage.setItem(key, JSON.stringify(newValue))
    },
    { deep: true }
  )

  return data
}
```

**Usage:**
```vue
<script setup>
import { useLocalStorage } from '@/composables/useLocalStorage'

const theme = useLocalStorage('theme', 'light')
const settings = useLocalStorage('user-settings', { notifications: true })
</script>

<template>
  <select v-model="theme">
    <option value="light">Light</option>
    <option value="dark">Dark</option>
  </select>
  
  <!-- theme automatically saved to localStorage! -->
</template>
```

---

## 🎓 Learning Exercise

**Task:** Buat `usePagination.js` composable

Requirements:
1. Accept params: `totalItems`, `itemsPerPage`
2. Return:
   - `currentPage` (ref)
   - `totalPages` (computed)
   - `paginatedItems` (computed - slice items)
   - `nextPage()`, `prevPage()`, `goToPage(n)`
   - `hasNext`, `hasPrev` (computed)
3. Usage:
   ```javascript
   const { currentPage, totalPages, paginatedItems, nextPage } = 
     usePagination(artworks, 12)
   ```

---

## 📖 Reference

- **Composables Guide:** https://vuejs.org/guide/reusability/composables.html
- **Composition API:** https://vuejs.org/api/composition-api-setup.html
- **VueUse (Library):** https://vueuse.org/ (collection of useful composables)

---

**Next:** Baca README di `services/`, `router/`
