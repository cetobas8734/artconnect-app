# Router Folder (`src/router/`)

**Router** adalah konfigurasi **Vue Router** untuk navigation dan routing dalam aplikasi SPA (Single Page Application).

---

## 🎯 Apa itu Vue Router?

**Vue Router** = Official routing library untuk Vue.js, mapping URL ke components.

**Features:**
- Client-side routing (no page reload)
- Dynamic routes (`/artworks/:id`)
- Navigation guards (auth check)
- Nested routes
- Lazy loading (code splitting)

---

## 📂 Folder Structure

```
router/
├── index.js            # Main router configuration
├── guards.js           # Navigation guards (auth, permissions)
└── routes/             # Route definitions by module (future)
    ├── auth.js
    ├── artworks.js
    ├── contacts.js
    └── pipeline.js
```

---

## 📝 Router Configuration (`index.js`)

```javascript
// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { authGuard } from './guards'

// Layouts
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'

// Views (lazy loaded)
const LoginView = () => import('@/modules/auth/views/LoginView.vue')
const DashboardView = () => import('@/modules/dashboard/views/DashboardView.vue')
const ArtworksListView = () => import('@/modules/artworks/views/ArtworksListView.vue')
const ArtworkDetailView = () => import('@/modules/artworks/views/ArtworkDetailView.vue')
const ArtworkCreateView = () => import('@/modules/artworks/views/ArtworkCreateView.vue')
const ArtworkEditView = () => import('@/modules/artworks/views/ArtworkEditView.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Auth routes (no auth required)
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: {
        layout: 'auth',
        requiresAuth: false
      }
    },

    // Protected routes (require auth)
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: {
        layout: 'default',
        requiresAuth: true,
        title: 'Dashboard'
      }
    },

    // Artworks routes
    {
      path: '/artworks',
      name: 'artworks',
      component: ArtworksListView,
      meta: {
        layout: 'default',
        requiresAuth: true,
        title: 'My Artworks'
      }
    },
    {
      path: '/artworks/new',
      name: 'artwork-create',
      component: ArtworkCreateView,
      meta: {
        layout: 'default',
        requiresAuth: true,
        title: 'Add Artwork'
      }
    },
    {
      path: '/artworks/:id',
      name: 'artwork-detail',
      component: ArtworkDetailView,
      meta: {
        layout: 'default',
        requiresAuth: true,
        title: 'Artwork Detail'
      }
    },
    {
      path: '/artworks/:id/edit',
      name: 'artwork-edit',
      component: ArtworkEditView,
      meta: {
        layout: 'default',
        requiresAuth: true,
        title: 'Edit Artwork'
      }
    },

    // 404 Not Found
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
      meta: {
        layout: 'empty',
        title: '404 Not Found'
      }
    }
  ],

  // Scroll behavior
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Global navigation guard
router.beforeEach(authGuard)

// Update document title
router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} - ArtConnect` : 'ArtConnect'
})

export default router
```

---

## 🔐 Navigation Guards (`guards.js`)

```javascript
// router/guards.js
import { useAuth } from '@/composables/useAuth'

/**
 * Auth guard - Check if user is authenticated
 * @param {Route} to - Target route
 * @param {Route} from - Current route
 * @returns {boolean | Object} true | { name: 'login' }
 */
export async function authGuard(to, from) {
  const { isAuthenticated, loading } = useAuth()

  // Wait for auth state to load
  if (loading.value) {
    // Could show loading spinner here
    await new Promise(resolve => {
      const unwatch = watch(loading, (newVal) => {
        if (!newVal) {
          unwatch()
          resolve()
        }
      })
    })
  }

  // Check if route requires auth
  const requiresAuth = to.meta.requiresAuth !== false // Default true

  if (requiresAuth && !isAuthenticated.value) {
    // Redirect to login, save intended destination
    return {
      name: 'login',
      query: { redirect: to.fullPath }
    }
  }

  // If authenticated and trying to access login, redirect to dashboard
  if (isAuthenticated.value && to.name === 'login') {
    return { name: 'dashboard' }
  }

  return true
}

/**
 * Permission guard - Check user permissions (future)
 * @param {string[]} requiredPermissions
 * @returns {Function} Guard function
 */
export function permissionGuard(requiredPermissions) {
  return async (to, from) => {
    const { user } = useAuth()
    
    const hasPermission = requiredPermissions.every(permission =>
      user.value?.permissions?.includes(permission)
    )

    if (!hasPermission) {
      return { name: 'forbidden' }
    }

    return true
  }
}
```

---

## ✅ Best Practices

### 1. **Lazy Loading (Code Splitting)**

```javascript
// ❌ Jangan begini (import semua di awal)
import ArtworksListView from '@/modules/artworks/views/ArtworksListView.vue'
import ArtworkDetailView from '@/modules/artworks/views/ArtworkDetailView.vue'

// ✅ Begini (lazy load)
const ArtworksListView = () => import('@/modules/artworks/views/ArtworksListView.vue')
const ArtworkDetailView = () => import('@/modules/artworks/views/ArtworkDetailView.vue')
```

**Benefits:**
- Faster initial load
- Code splitting (smaller bundles)
- Load on-demand

---

### 2. **Named Routes (not Paths)**

```vue
<!-- ❌ Jangan begini (hardcoded path) -->
<router-link to="/artworks/123">View</router-link>
<button @click="router.push('/artworks/123')">View</button>

<!-- ✅ Begini (named route) -->
<router-link :to="{ name: 'artwork-detail', params: { id: 123 }}">View</router-link>
<button @click="router.push({ name: 'artwork-detail', params: { id: 123 }})">View</button>
```

**Benefits:**
- Refactor-friendly (change path tanpa update semua references)
- Type-safe (can add TypeScript validation)
- Clearer intent

---

### 3. **Route Meta for Configuration**

```javascript
{
  path: '/artworks',
  name: 'artworks',
  component: ArtworksListView,
  meta: {
    layout: 'default',       // Layout to use
    requiresAuth: true,      // Requires authentication
    title: 'My Artworks',    // Page title
    breadcrumb: 'Artworks',  // Breadcrumb text
    icon: 'gallery'          // Sidebar icon
  }
}
```

**Usage dalam component:**
```vue
<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
console.log(route.meta.title) // "My Artworks"
</script>
```

---

### 4. **Nested Routes (Parent-Child)**

```javascript
{
  path: '/settings',
  component: SettingsLayout,
  children: [
    {
      path: '',
      redirect: 'profile'
    },
    {
      path: 'profile',
      name: 'settings-profile',
      component: ProfileSettingsView
    },
    {
      path: 'security',
      name: 'settings-security',
      component: SecuritySettingsView
    },
    {
      path: 'billing',
      name: 'settings-billing',
      component: BillingSettingsView
    }
  ]
}
```

**Parent component (`SettingsLayout.vue`):**
```vue
<template>
  <div class="settings-layout">
    <nav>
      <router-link :to="{ name: 'settings-profile' }">Profile</router-link>
      <router-link :to="{ name: 'settings-security' }">Security</router-link>
      <router-link :to="{ name: 'settings-billing' }">Billing</router-link>
    </nav>
    
    <router-view /> <!-- Child routes render here -->
  </div>
</template>
```

---

### 5. **Query Parameters & Route Params**

```javascript
// Route params (part of URL path)
// /artworks/:id → /artworks/123
{
  path: '/artworks/:id',
  name: 'artwork-detail'
}

// Navigate
router.push({ name: 'artwork-detail', params: { id: 123 }})

// Access
const route = useRoute()
console.log(route.params.id) // "123"

// Query params (URL search params)
// /artworks?search=sunset&sort=price
router.push({
  name: 'artworks',
  query: { search: 'sunset', sort: 'price' }
})

// Access
console.log(route.query.search) // "sunset"
console.log(route.query.sort) // "price"
```

---

## 🔄 Programmatic Navigation

### Basic Navigation

```vue
<script setup>
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// Navigate to route
const goToArtworks = () => {
  router.push({ name: 'artworks' })
}

// Navigate dengan params
const viewArtwork = (id) => {
  router.push({ name: 'artwork-detail', params: { id }})
}

// Navigate dengan query
const searchArtworks = (query) => {
  router.push({ name: 'artworks', query: { search: query }})
}

// Go back
const goBack = () => {
  router.back()
  // or router.go(-1)
}

// Replace (no history entry)
const replaceRoute = () => {
  router.replace({ name: 'dashboard' })
}
</script>

<template>
  <button @click="goToArtworks">View Artworks</button>
  <button @click="viewArtwork(123)">View Artwork #123</button>
  <button @click="goBack">Go Back</button>
</template>
```

---

### Navigation after Action

```vue
<script setup>
import { useRouter } from 'vue-router'
import artworksService from '@/services/api/artworks'

const router = useRouter()

const handleDelete = async (id) => {
  if (!confirm('Delete artwork?')) return
  
  await artworksService.delete(id)
  
  // Redirect to list after delete
  router.push({ name: 'artworks' })
}

const handleSave = async (data) => {
  const artwork = await artworksService.create(data)
  
  // Redirect to detail page of created artwork
  router.push({ 
    name: 'artwork-detail', 
    params: { id: artwork.id }
  })
}
</script>
```

---

## 🎓 Common Patterns

### Pattern 1: Login Redirect

```javascript
// router/guards.js
export function authGuard(to, from) {
  const { isAuthenticated } = useAuth()

  if (to.meta.requiresAuth && !isAuthenticated.value) {
    // Save intended destination
    return {
      name: 'login',
      query: { redirect: to.fullPath } // Save where user wanted to go
    }
  }

  return true
}
```

```vue
<!-- modules/auth/views/LoginView.vue -->
<script setup>
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const route = useRoute()
const { login } = useAuth()

const handleLogin = async () => {
  await login()
  
  // Redirect to intended destination or dashboard
  const redirect = route.query.redirect || '/dashboard'
  router.push(redirect)
}
</script>
```

---

### Pattern 2: Breadcrumbs

```vue
<!-- components/layout/Breadcrumbs.vue -->
<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const breadcrumbs = computed(() => {
  const matched = route.matched.filter(r => r.meta.breadcrumb)
  return matched.map(r => ({
    text: r.meta.breadcrumb,
    to: r.path
  }))
})
</script>

<template>
  <nav class="breadcrumbs">
    <router-link to="/">Home</router-link>
    <span v-for="(crumb, index) in breadcrumbs" :key="index">
      / <router-link :to="crumb.to">{{ crumb.text }}</router-link>
    </span>
  </nav>
</template>
```

---

### Pattern 3: Active Route Styling

```vue
<template>
  <nav>
    <!-- Vue Router adds .router-link-active class automatically -->
    <router-link to="/dashboard" class="nav-link">Dashboard</router-link>
    <router-link to="/artworks" class="nav-link">Artworks</router-link>
    <router-link to="/contacts" class="nav-link">Contacts</router-link>
  </nav>
</template>

<style scoped>
.nav-link {
  color: #666;
}

.nav-link.router-link-active {
  color: #3b82f6;
  font-weight: bold;
}

/* Exact active (only for exact match) */
.nav-link.router-link-exact-active {
  background: #eff6ff;
}
</style>
```

---

## 🎓 Learning Exercise

**Task:** Setup router untuk ArtConnect

Requirements:
1. Create `router/index.js` dengan routes:
   - `/login` → LoginView (no auth)
   - `/` → redirect to `/dashboard`
   - `/dashboard` → DashboardView (auth required)
   - `/artworks` → ArtworksListView (auth required)
   - `/artworks/:id` → ArtworkDetailView (auth required)
2. Create `router/guards.js` dengan `authGuard`
3. Lazy load all views
4. Add meta titles
5. Update `main.js` to use router

---

## 📖 Reference

- **Vue Router Docs:** https://router.vuejs.org/
- **Navigation Guards:** https://router.vuejs.org/guide/advanced/navigation-guards.html
- **Lazy Loading:** https://router.vuejs.org/guide/advanced/lazy-loading.html

---

**Next:** Baca README di `utils/`, `config/`, `layouts/`
