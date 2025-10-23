# Stores Folder (`src/stores/`)

**Stores** adalah folder untuk **global state management** menggunakan Pinia (Vue state management library).

---

## 🎯 Kapan Pakai Store?

**Use store when:**
- ✅ State dipakai di banyak components (global)
- ✅ State perlu persist (tetap ada setelah route change)
- ✅ Complex state logic (actions, getters)
- ✅ State shared across modules

**Jangan pakai store when:**
- ❌ Simple local state → Use `ref()`, `reactive()` di component
- ❌ State hanya dipakai 1-2 components → Use composables
- ❌ State tidak perlu persist → Use composables

---

## 📂 File Structure

```
stores/
├── auth.js             # Authentication state
├── artworks.js         # Artworks data cache
├── contacts.js         # Contacts data cache
└── ui.js               # UI state (theme, sidebar, etc)
```

---

## 🚀 Setup Pinia (Future)

**Note:** Saat ini ArtConnect menggunakan **composables** untuk state management. Upgrade ke Pinia jika state makin complex.

### Installation

```powershell
npm install pinia
```

### Setup dalam `main.js`

```javascript
// main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.mount('#app')
```

---

## 📝 Store Example

```javascript
// stores/auth.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import authService from '@/services/firebase/auth'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Getters (computed)
  const isAuthenticated = computed(() => user.value !== null)
  const userName = computed(() => user.value?.displayName || '')

  // Actions
  async function login() {
    loading.value = true
    error.value = null
    
    try {
      const result = await authService.signInWithGoogle()
      user.value = result.user
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    await authService.signOut()
    user.value = null
  }

  return {
    // State
    user,
    loading,
    error,
    // Getters
    isAuthenticated,
    userName,
    // Actions
    login,
    logout
  }
})
```

**Usage:**
```vue
<script setup>
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>

<template>
  <div v-if="authStore.isAuthenticated">
    <p>Welcome, {{ authStore.userName }}</p>
    <button @click="authStore.logout">Logout</button>
  </div>
</template>
```

---

## 📖 Reference

- **Pinia Docs:** https://pinia.vuejs.org/

---

**Current approach:** Use composables (simpler). Migrate to Pinia later if needed.
