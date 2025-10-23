# Layouts Folder (`src/layouts/`)

**Layouts** adalah **wrapper components** yang menyediakan shared UI structure untuk pages (header, sidebar, footer, dll).

---

## 🎯 Apa itu Layout?

**Layout** = Component yang wrap page content dengan shared UI elements.

**Common elements:**
- Header/Navigation bar
- Sidebar/Menu
- Footer
- Content area (where pages render)

**Benefits:**
- DRY (Don't Repeat Yourself) - No need to repeat header/footer di setiap page
- Consistent UI across pages
- Easy to change global structure

---

## 📂 Layout Types

```
layouts/
├── DefaultLayout.vue       # Authenticated user layout (header + sidebar + footer)
├── AuthLayout.vue          # Login/register layout (centered card)
├── EmptyLayout.vue         # Minimal layout (no chrome, for error pages)
└── FullscreenLayout.vue    # Fullscreen layout (future, untuk galleries)
```

---

## 📝 Layout Examples

### `DefaultLayout.vue` - Main App Layout

```vue
<!-- layouts/DefaultLayout.vue -->
<script setup>
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

const { user } = useAuth()
const sidebarOpen = ref(true)

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}
</script>

<template>
  <div class="default-layout">
    <!-- Header -->
    <AppHeader 
      :user="user" 
      :sidebar-open="sidebarOpen"
      @toggle-sidebar="toggleSidebar"
    />
    
    <!-- Sidebar -->
    <AppSidebar :open="sidebarOpen" />
    
    <!-- Main content area -->
    <main 
      :class="[
        'main-content',
        { 'main-content--sidebar-closed': !sidebarOpen }
      ]"
    >
      <!-- Page content renders here -->
      <router-view />
    </main>
    
    <!-- Footer -->
    <AppFooter />
  </div>
</template>

<style scoped>
.default-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  margin-left: 240px; /* Sidebar width */
  padding: 2rem;
  transition: margin-left 0.3s;
}

.main-content--sidebar-closed {
  margin-left: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
    padding: 1rem;
  }
}
</style>
```

---

### `AuthLayout.vue` - Login/Register Layout

```vue
<!-- layouts/AuthLayout.vue -->
<script setup>
// No complex logic needed
</script>

<template>
  <div class="auth-layout">
    <!-- Logo -->
    <div class="auth-layout__logo">
      <img src="@/assets/images/logo.png" alt="ArtConnect">
      <h1>ArtConnect</h1>
    </div>
    
    <!-- Auth form (login/register) renders here -->
    <div class="auth-layout__content">
      <router-view />
    </div>
    
    <!-- Footer -->
    <footer class="auth-layout__footer">
      <p>&copy; 2025 ArtConnect. All rights reserved.</p>
    </footer>
  </div>
</template>

<style scoped>
.auth-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.auth-layout__logo {
  text-align: center;
  margin-bottom: 2rem;
  color: white;
}

.auth-layout__logo img {
  width: 80px;
  height: 80px;
  margin-bottom: 1rem;
}

.auth-layout__logo h1 {
  font-size: 2rem;
  font-weight: 700;
}

.auth-layout__content {
  background: white;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 440px;
}

.auth-layout__footer {
  margin-top: 2rem;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
}
</style>
```

---

### `EmptyLayout.vue` - Minimal Layout

```vue
<!-- layouts/EmptyLayout.vue -->
<script setup>
// Minimal - no header, no sidebar
</script>

<template>
  <div class="empty-layout">
    <router-view />
  </div>
</template>

<style scoped>
.empty-layout {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
}
</style>
```

---

## 🔄 Layout Switching (via Router Meta)

### Router Configuration

```javascript
// router/index.js
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import EmptyLayout from '@/layouts/EmptyLayout.vue'

const routes = [
  {
    path: '/login',
    component: LoginView,
    meta: { layout: 'auth' } // Use AuthLayout
  },
  {
    path: '/dashboard',
    component: DashboardView,
    meta: { layout: 'default' } // Use DefaultLayout
  },
  {
    path: '/404',
    component: NotFoundView,
    meta: { layout: 'empty' } // Use EmptyLayout
  }
]
```

---

### App.vue - Dynamic Layout

```vue
<!-- App.vue -->
<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import EmptyLayout from '@/layouts/EmptyLayout.vue'

const route = useRoute()

const layouts = {
  default: DefaultLayout,
  auth: AuthLayout,
  empty: EmptyLayout
}

const currentLayout = computed(() => {
  const layoutName = route.meta.layout || 'default'
  return layouts[layoutName]
})
</script>

<template>
  <component :is="currentLayout">
    <router-view />
  </component>
</template>
```

**How it works:**
1. Route defines `meta.layout` (e.g., `'auth'`)
2. `App.vue` reads `route.meta.layout`
3. Dynamically renders corresponding layout component
4. Layout component renders `<router-view />` (the actual page)

---

## ✅ Best Practices

### 1. **Use `<router-view />` in Layouts**

```vue
<!-- ✅ Good - Layout wraps router-view -->
<template>
  <div class="layout">
    <Header />
    <main>
      <router-view /> <!-- Page renders here -->
    </main>
    <Footer />
  </div>
</template>
```

---

### 2. **Keep Layouts Simple**

```vue
<!-- ❌ Bad - Too much logic in layout -->
<script setup>
import { ref, onMounted } from 'vue'
import artworksService from '@/services/api/artworks'

const artworks = ref([])

onMounted(async () => {
  artworks.value = await artworksService.getAll() // ❌ Business logic
})
</script>

<!-- ✅ Good - Only structure, no business logic -->
<script setup>
import { useAuth } from '@/composables/useAuth'
const { user } = useAuth() // ✅ Just get user state
</script>

<template>
  <div>
    <Header :user="user" />
    <router-view />
  </div>
</template>
```

**Layouts should only:**
- Define structure
- Pass global state (user, theme)
- Handle layout-specific interactions (sidebar toggle)

**Layouts should NOT:**
- Fetch business data
- Contain complex business logic
- Directly call APIs

---

### 3. **Mobile Responsive Layouts**

```vue
<script setup>
import { ref } from 'vue'

const sidebarOpen = ref(false) // Closed by default on mobile

// Close sidebar when clicking outside (mobile)
const closeSidebarOnMobile = () => {
  if (window.innerWidth < 768) {
    sidebarOpen.value = false
  }
}
</script>

<template>
  <div class="layout">
    <AppSidebar 
      :open="sidebarOpen" 
      @close="sidebarOpen = false"
    />
    
    <main @click="closeSidebarOnMobile">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
/* Desktop - sidebar always visible */
@media (min-width: 769px) {
  .sidebar {
    position: static;
  }
}

/* Mobile - sidebar overlay */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    z-index: 1000;
    transform: translateX(-100%);
    transition: transform 0.3s;
  }
  
  .sidebar--open {
    transform: translateX(0);
  }
}
</style>
```

---

## 🎨 Layout Components

Layouts typically use shared components:

### `AppHeader.vue`

```vue
<!-- components/layout/AppHeader.vue -->
<script setup>
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

defineProps({
  sidebarOpen: Boolean
})

defineEmits(['toggle-sidebar'])

const router = useRouter()
const { user, logout } = useAuth()

const handleLogout = async () => {
  await logout()
  router.push('/login')
}
</script>

<template>
  <header class="app-header">
    <button @click="$emit('toggle-sidebar')" class="sidebar-toggle">
      ☰
    </button>
    
    <div class="app-header__logo">
      <router-link to="/">ArtConnect</router-link>
    </div>
    
    <nav class="app-header__nav">
      <router-link to="/dashboard">Dashboard</router-link>
      <router-link to="/artworks">Artworks</router-link>
      <router-link to="/contacts">Contacts</router-link>
    </nav>
    
    <div class="app-header__user">
      <img :src="user.photoURL" :alt="user.displayName">
      <span>{{ user.displayName }}</span>
      <button @click="handleLogout">Logout</button>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 2rem;
  background: white;
  border-bottom: 1px solid #e5e7eb;
}

.app-header__nav {
  flex: 1;
  display: flex;
  gap: 1.5rem;
}

.app-header__user {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
```

---

### `AppSidebar.vue`

```vue
<!-- components/layout/AppSidebar.vue -->
<script setup>
defineProps({
  open: {
    type: Boolean,
    default: true
  }
})
</script>

<template>
  <aside :class="['app-sidebar', { 'app-sidebar--open': open }]">
    <nav class="sidebar-nav">
      <router-link to="/dashboard" class="nav-item">
        <span class="nav-item__icon">📊</span>
        <span class="nav-item__label">Dashboard</span>
      </router-link>
      
      <router-link to="/artworks" class="nav-item">
        <span class="nav-item__icon">🎨</span>
        <span class="nav-item__label">Artworks</span>
      </router-link>
      
      <router-link to="/contacts" class="nav-item">
        <span class="nav-item__icon">👥</span>
        <span class="nav-item__label">Contacts</span>
      </router-link>
      
      <router-link to="/pipeline" class="nav-item">
        <span class="nav-item__icon">📈</span>
        <span class="nav-item__label">Pipeline</span>
      </router-link>
      
      <router-link to="/analytics" class="nav-item">
        <span class="nav-item__icon">📉</span>
        <span class="nav-item__label">Analytics</span>
      </router-link>
    </nav>
  </aside>
</template>

<style scoped>
.app-sidebar {
  width: 240px;
  background: #1f2937;
  color: white;
  padding: 1rem;
  position: fixed;
  top: 64px; /* Header height */
  bottom: 0;
  left: 0;
  transition: transform 0.3s;
}

.app-sidebar--open {
  transform: translateX(0);
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  color: #d1d5db;
  text-decoration: none;
  transition: background 0.2s;
}

.nav-item:hover {
  background: #374151;
}

.nav-item.router-link-active {
  background: #3b82f6;
  color: white;
}
</style>
```

---

## 🎓 Learning Exercise

**Task:** Create complete layout system

Requirements:
1. Create 3 layouts:
   - `DefaultLayout.vue` (header + sidebar + footer)
   - `AuthLayout.vue` (centered card)
   - `EmptyLayout.vue` (minimal)
2. Create shared components:
   - `AppHeader.vue`
   - `AppSidebar.vue`
   - `AppFooter.vue`
3. Update `App.vue` for dynamic layout switching
4. Add mobile responsive behavior

---

## 📖 Reference

- **Vue Dynamic Components:** https://vuejs.org/guide/essentials/component-basics.html#dynamic-components
- **Vue Router Layouts:** https://router.vuejs.org/guide/advanced/meta.html

---

**Selesai!** Semua folder sudah ada README lengkap 🎉
