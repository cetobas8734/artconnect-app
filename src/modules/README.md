# Modules Folder (`src/modules/`)

**Modules** adalah pendekatan **feature-based** untuk mengorganisir code berdasarkan **business domain** (bukan berdasarkan technical layer).

---

## 🎯 Apa itu Module?

**Module** = Kumpulan semua code yang berhubungan dengan satu **business feature/domain**.

### Contoh Module:
- `auth/` → Authentication & user management
- `artworks/` → Artwork portfolio management
- `contacts/` → Contact/buyer management
- `pipeline/` → Sales pipeline & opportunities
- `analytics/` → Analytics & reporting

---

## 📂 Struktur Module (Template)

Setiap module mengikuti struktur yang konsisten:

```
modules/artworks/
├── README.md                   # Dokumentasi module
│
├── components/                 # Artworks-specific components
│   ├── ArtworkCard.vue         # Display artwork dalam card
│   ├── ArtworkForm.vue         # Form create/edit artwork
│   ├── ArtworkGallery.vue      # Grid gallery view
│   └── ArtworkFilters.vue      # Filter/search controls
│
├── composables/                # Artworks-specific composables
│   ├── useArtworks.js          # CRUD operations + state
│   ├── useArtworkForm.js       # Form logic (validation, submit)
│   └── useArtworkFilters.js    # Filter/search logic
│
├── services/                   # Artworks API client
│   └── artworksService.js      # API calls (backend REST API)
│
├── views/                      # Route target pages
│   ├── ArtworksListView.vue    # /artworks - List all artworks
│   ├── ArtworkDetailView.vue   # /artworks/:id - View detail
│   ├── ArtworkCreateView.vue   # /artworks/new - Create form
│   └── ArtworkEditView.vue     # /artworks/:id/edit - Edit form
│
├── utils/                      # Artworks-specific utilities (optional)
│   └── artworkHelpers.js       # Helper functions
│
└── index.js                    # Module public API (exports)
```

---

## ✅ Best Practices

### 1. **Encapsulation (Public API)**

**Export semua via `index.js`** untuk kontrol akses:

```javascript
// modules/artworks/index.js

// Export views (untuk router)
export { default as ArtworksListView } from './views/ArtworksListView.vue'
export { default as ArtworkDetailView } from './views/ArtworkDetailView.vue'
export { default as ArtworkCreateView } from './views/ArtworkCreateView.vue'

// Export composables (untuk reuse)
export { useArtworks } from './composables/useArtworks'
export { useArtworkForm } from './composables/useArtworkForm'

// Export services (jika diperlukan module lain)
export { default as artworksService } from './services/artworksService'
```

**Import dari module (bukan subfolder):**

```javascript
// ❌ Jangan begini (import dari subfolder)
import ArtworkCard from '@/modules/artworks/components/ArtworkCard.vue'

// ✅ Begini (import dari module index)
import { ArtworksListView, useArtworks } from '@/modules/artworks'
```

**Keuntungan:**
- ✅ Control what's public vs private
- ✅ Easier refactoring (change internal structure tanpa break imports)
- ✅ Clear module API

---

### 2. **Naming Conventions**

**Components:**
- PascalCase + domain prefix
- `ArtworkCard.vue`, `ArtworkForm.vue` (bukan `Card.vue`, `Form.vue`)
- Benefit: Jelas dari mana asalnya (vs shared component `Card.vue` di `components/`)

**Composables:**
- camelCase + `use` prefix
- `useArtworks.js`, `useArtworkForm.js`
- Return object dengan `{ state, methods }`

**Services:**
- camelCase + `Service` suffix
- `artworksService.js`, `contactsService.js`
- Export object dengan methods: `{ getAll(), getById(), create(), update(), delete() }`

**Views:**
- PascalCase + `View` suffix
- `ArtworksListView.vue`, `ArtworkDetailView.vue`
- Benefit: Distinguish page components dari regular components

---

### 3. **Separation: Components vs Views**

**Components:**
- Reusable UI pieces
- Accept props, emit events
- **Tidak** langsung call API
- **Tidak** tied to specific route

Example:
```vue
<!-- modules/artworks/components/ArtworkCard.vue -->
<script setup>
defineProps({
  artwork: { type: Object, required: true }
})

defineEmits(['edit', 'delete'])
</script>

<template>
  <div class="artwork-card">
    <img :src="artwork.imageUrl" :alt="artwork.title">
    <h3>{{ artwork.title }}</h3>
    <p>{{ formatCurrency(artwork.price) }}</p>
    <button @click="$emit('edit', artwork.id)">Edit</button>
    <button @click="$emit('delete', artwork.id)">Delete</button>
  </div>
</template>
```

**Views:**
- Route targets (pages)
- Orchestrate components + composables
- Call API via composables
- Handle routing (router.push)

Example:
```vue
<!-- modules/artworks/views/ArtworksListView.vue -->
<script setup>
import { useArtworks } from '../composables/useArtworks'
import ArtworkCard from '../components/ArtworkCard.vue'

const { artworks, loading, deleteArtwork } = useArtworks()

const handleEdit = (id) => {
  router.push(`/artworks/${id}/edit`)
}

const handleDelete = async (id) => {
  if (confirm('Delete artwork?')) {
    await deleteArtwork(id)
  }
}
</script>

<template>
  <div class="artworks-list-view">
    <h1>My Artworks</h1>
    
    <div v-if="loading">Loading...</div>
    
    <div v-else class="artwork-grid">
      <ArtworkCard
        v-for="artwork in artworks"
        :key="artwork.id"
        :artwork="artwork"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </div>
  </div>
</template>
```

---

### 4. **Composables Handle Business Logic**

**Composable = Reusable logic + state**

Example `useArtworks.js`:

```javascript
// modules/artworks/composables/useArtworks.js
import { ref, computed } from 'vue'
import artworksService from '../services/artworksService'

export function useArtworks() {
  // State
  const artworks = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Computed
  const totalArtworks = computed(() => artworks.value.length)
  const totalValue = computed(() => 
    artworks.value.reduce((sum, a) => sum + a.price, 0)
  )

  // Methods
  const fetchArtworks = async () => {
    loading.value = true
    error.value = null
    
    try {
      const data = await artworksService.getAll()
      artworks.value = data
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const deleteArtwork = async (id) => {
    try {
      await artworksService.delete(id)
      artworks.value = artworks.value.filter(a => a.id !== id)
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  // Auto-fetch on mount
  fetchArtworks()

  // Public API
  return {
    // State
    artworks,
    loading,
    error,
    
    // Computed
    totalArtworks,
    totalValue,
    
    // Methods
    fetchArtworks,
    deleteArtwork
  }
}
```

**Usage dalam component:**

```vue
<script setup>
import { useArtworks } from '@/modules/artworks'

const { artworks, loading, totalValue } = useArtworks()
</script>
```

---

### 5. **Services Handle API Calls**

**Service = Pure API communication layer**

Example `artworksService.js`:

```javascript
// modules/artworks/services/artworksService.js
import axios from '@/config/axios'

const BASE_URL = '/artworks'

export default {
  // GET /api/artworks
  async getAll() {
    const response = await axios.get(BASE_URL)
    return response.data
  },

  // GET /api/artworks/:id
  async getById(id) {
    const response = await axios.get(`${BASE_URL}/${id}`)
    return response.data
  },

  // POST /api/artworks
  async create(artworkData) {
    const formData = new FormData()
    formData.append('title', artworkData.title)
    formData.append('price', artworkData.price)
    formData.append('description', artworkData.description)
    formData.append('image', artworkData.imageFile)

    const response = await axios.post(BASE_URL, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  },

  // PUT /api/artworks/:id
  async update(id, artworkData) {
    const response = await axios.put(`${BASE_URL}/${id}`, artworkData)
    return response.data
  },

  // DELETE /api/artworks/:id
  async delete(id) {
    await axios.delete(`${BASE_URL}/${id}`)
  }
}
```

**Best practices:**
- ✅ Return data (bukan response object)
- ✅ Throw errors (let caller handle)
- ✅ Use axios instance dari `@/config/axios` (auto JWT header)

---

### 6. **Module-Specific vs Shared**

**Kapan taruh di module vs `src/components/`?**

**Module-specific** (`modules/artworks/components/`):
- Tied to artworks domain
- Example: `ArtworkCard`, `ArtworkForm`, `ArtworkGallery`
- Hanya dipakai dalam artworks module

**Shared** (`src/components/`):
- Generic, reusable across modules
- Example: `Button`, `Modal`, `TextInput`, `Card`
- Dipakai di artworks, contacts, pipeline, dll

---

## 📋 Checklist: Buat Module Baru

Saat buat module baru (contoh: `notifications`), ikuti steps:

### Step 1: Create Folder Structure
```powershell
mkdir src/modules/notifications
mkdir src/modules/notifications/components
mkdir src/modules/notifications/composables
mkdir src/modules/notifications/services
mkdir src/modules/notifications/views
```

### Step 2: Create README.md
Dokumentasikan:
- Purpose module
- Key features
- Public API (exports)
- Usage examples

### Step 3: Create Service
```javascript
// services/notificationsService.js
export default {
  async getAll() { /* ... */ },
  async markAsRead(id) { /* ... */ }
}
```

### Step 4: Create Composable
```javascript
// composables/useNotifications.js
export function useNotifications() {
  // state + methods
  return { notifications, unreadCount, markAsRead }
}
```

### Step 5: Create Components
```vue
<!-- components/NotificationItem.vue -->
<!-- components/NotificationBadge.vue -->
```

### Step 6: Create Views
```vue
<!-- views/NotificationsView.vue -->
```

### Step 7: Create index.js (Public API)
```javascript
// index.js
export { default as NotificationsView } from './views/NotificationsView.vue'
export { useNotifications } from './composables/useNotifications'
```

### Step 8: Add Routes
```javascript
// router/index.js
import { NotificationsView } from '@/modules/notifications'

{
  path: '/notifications',
  component: NotificationsView
}
```

---

## 🔄 Module Communication

**Modules should be loosely coupled:**

### ❌ Jangan Begini (Tight Coupling)
```javascript
// modules/pipeline/composables/usePipeline.js
import { useArtworks } from '@/modules/artworks' // ❌ Direct dependency

export function usePipeline() {
  const { artworks } = useArtworks() // ❌ Tightly coupled
}
```

### ✅ Begini (Loose Coupling via Props/Events)
```vue
<!-- modules/pipeline/views/PipelineView.vue -->
<script setup>
import { usePipeline } from '../composables/usePipeline'
import { useArtworks } from '@/modules/artworks' // ✅ Import di view level

const { opportunities } = usePipeline()
const { artworks } = useArtworks()

// Pass data via props
</script>

<template>
  <OpportunityCard 
    :opportunity="opp" 
    :artwork="artworks.find(a => a.id === opp.artworkId)"
  />
</template>
```

**Or use shared store (Pinia) untuk cross-module state.**

---

## 🎓 Learning Exercise

**Task:** Buat module `contacts` untuk manage buyer contacts.

Requirements:
1. Folder structure (components, composables, services, views)
2. `contactsService.js` - API calls (GET, POST, PUT, DELETE)
3. `useContacts.js` - Composable (fetch, create, update, delete)
4. `ContactCard.vue` - Display contact
5. `ContactForm.vue` - Create/edit contact
6. `ContactsListView.vue` - Page showing all contacts
7. `index.js` - Export public API

**Bonus:** Add search/filter functionality dengan `useContactFilters.js`

---

## 📖 Reference

- **Vue 3 Composition API:** https://vuejs.org/guide/reusability/composables.html
- **Project Structure:** https://vuejs.org/guide/scaling-up/sfc.html

---

**Next:** Baca README di folder `components/`, `composables/`, `services/`
