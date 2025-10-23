# Source Code Structure (`src/`)

Folder `src/` adalah inti dari aplikasi ArtConnect. Struktur ini mengikuti **Vue 3 best practices** dengan pendekatan **feature-based modules** dan **separation of concerns**.

---

## 📁 Folder Structure Overview

```
src/
├── main.js                 # Entry point aplikasi
├── App.vue                 # Root component
├── style.css               # Global styles
│
├── modules/                # Feature modules (business logic by domain)
│   ├── auth/               # Authentication & user management
│   ├── artworks/           # Artwork portfolio management
│   ├── contacts/           # Contact/buyer management
│   ├── pipeline/           # Sales pipeline & opportunities
│   └── analytics/          # Analytics & reporting
│
├── components/             # Shared/reusable components
│   ├── ui/                 # Pure UI components (Button, Card, Modal)
│   ├── forms/              # Form components (Input, Select, FileUpload)
│   └── layout/             # Layout components (Header, Sidebar, Footer)
│
├── composables/            # Reusable composition functions
│   ├── useAuth.js          # Authentication state & methods
│   ├── useFetch.js         # Data fetching utilities
│   └── useToast.js         # Notification/toast utilities
│
├── services/               # External API communication
│   ├── firebase/           # Firebase SDK initialization & helpers
│   ├── api/                # Backend REST API clients
│   └── storage/            # File upload/download handlers
│
├── router/                 # Vue Router configuration
│   ├── index.js            # Router setup & route definitions
│   └── guards.js           # Navigation guards (auth check)
│
├── stores/                 # State management (future: Pinia)
│   ├── auth.js             # Authentication state store
│   └── artworks.js         # Artworks data store
│
├── utils/                  # Pure utility functions
│   ├── formatters.js       # Date, currency, text formatters
│   ├── validators.js       # Input validation helpers
│   └── constants.js        # App constants & enums
│
├── config/                 # Configuration files
│   ├── firebase.js         # Firebase SDK config
│   └── axios.js            # Axios instance config (API client)
│
├── directives/             # Custom Vue directives (future)
│   └── clickOutside.js     # v-click-outside directive
│
├── plugins/                # Vue plugins (future)
│   └── toast.js            # Toast notification plugin
│
├── layouts/                # Page layout components
│   ├── DefaultLayout.vue   # Authenticated user layout
│   ├── AuthLayout.vue      # Login/register layout
│   └── EmptyLayout.vue     # Minimal layout (error pages)
│
└── assets/                 # Static assets
    ├── images/             # Images, logos
    ├── icons/              # SVG icons
    └── styles/             # CSS/SCSS files
```

---

## 🎯 Design Principles

### 1. **Feature-Based Modules** (Domain-Driven)
- Setiap **business domain** punya folder sendiri di `modules/`
- Contoh: `modules/auth/`, `modules/artworks/`, `modules/contacts/`
- Di dalam module: components, composables, services yang spesifik untuk domain itu

**Keuntungan:**
- ✅ Mudah mencari code (semua artwork-related code dalam satu folder)
- ✅ Scalable (tambah module baru tanpa ganggu yang lain)
- ✅ Team bisa work paralel (tiap developer handle 1 module)

### 2. **Separation of Concerns**
- **Components:** Pure UI rendering
- **Composables:** Reusable logic (state + methods)
- **Services:** External API communication
- **Utils:** Pure functions (no state, no side effects)

### 3. **Reusability**
- Shared components di `components/` (dipakai banyak module)
- Module-specific components di `modules/{name}/components/`
- Composables di-export untuk reuse across modules

### 4. **Single Responsibility**
- Satu file = satu purpose
- Component hanya render UI
- Composable handle business logic
- Service handle API calls

---

## 📚 Folder Details

### 🔹 `modules/` - Feature Modules
**Apa itu?** Folder yang berisi semua code untuk satu business domain/feature.

**Struktur tiap module:**
```
modules/auth/
├── README.md               # Module documentation
├── components/             # Auth-specific components
│   ├── LoginForm.vue
│   └── RegisterForm.vue
├── composables/            # Auth-specific composables
│   └── useAuthForm.js
├── services/               # Auth-specific API calls
│   └── authService.js
├── views/                  # Auth pages (route targets)
│   ├── LoginView.vue
│   └── RegisterView.vue
└── index.js                # Module exports (public API)
```

**Best Practice:**
- Semua export module via `index.js` (public API)
- Jangan import langsung dari subfolder (use `@/modules/auth` bukan `@/modules/auth/components/...`)

**Baca lebih lanjut:** [modules/README.md](modules/README.md)

---

### 🔹 `components/` - Shared Components
**Apa itu?** Komponen UI yang dipakai di banyak tempat (reusable).

**Contoh:**
- `ui/Button.vue` - Button component (primary, secondary, danger)
- `forms/TextInput.vue` - Text input dengan validation
- `layout/AppHeader.vue` - Header bar (logo, navigation, user menu)

**Best Practice:**
- Komponen harus **generic** (tidak tied ke specific business logic)
- Props untuk customization
- Emit events untuk parent communication

**Baca lebih lanjut:** [components/README.md](components/README.md)

---

### 🔹 `composables/` - Composition Functions
**Apa itu?** Reusable logic (state + methods) menggunakan Vue Composition API.

**Contoh:**
- `useAuth.js` - `{ user, login(), logout(), isAuthenticated }`
- `useFetch.js` - `{ data, loading, error, fetch() }`
- `useForm.js` - `{ values, errors, validate(), submit() }`

**Best Practice:**
- Naming: `use{Name}.js` (camelCase)
- Return reactive state (`ref`, `computed`) + methods
- Pure logic (no UI rendering)

**Baca lebih lanjut:** [composables/README.md](composables/README.md)

---

### 🔹 `services/` - API & External Services
**Apa itu?** Layer untuk komunikasi dengan external APIs (Firebase, Backend REST API).

**Contoh:**
- `firebase/auth.js` - Firebase Auth methods (signIn, signOut)
- `api/artworks.js` - Artwork API client (CRUD operations)
- `storage/imageUpload.js` - Image upload handler

**Best Practice:**
- Return Promises (async/await ready)
- Handle errors di service layer
- Export clean API (hide implementation details)

**Baca lebih lanjut:** [services/README.md](services/README.md)

---

### 🔹 `router/` - Vue Router
**Apa itu?** Konfigurasi routing (URL → component mapping).

**Contoh routes:**
- `/` → Dashboard
- `/login` → LoginView
- `/artworks` → ArtworksListView
- `/artworks/:id` → ArtworkDetailView

**Best Practice:**
- Lazy load components (`component: () => import(...)`)
- Navigation guards untuk auth check
- Named routes untuk flexibility

**Baca lebih lanjut:** [router/README.md](router/README.md)

---

### 🔹 `stores/` - State Management
**Apa itu?** Global state menggunakan Pinia (future) atau Composition API.

**Kapan pakai store?**
- State yang dipakai banyak components
- State yang perlu persist (refresh tetap ada)
- Complex state logic

**Best Practice:**
- Start dengan composables (simpler)
- Upgrade ke Pinia jika state makin complex
- One store per domain (auth store, artworks store)

**Baca lebih lanjut:** [stores/README.md](stores/README.md)

---

### 🔹 `utils/` - Utility Functions
**Apa itu?** Pure functions (no side effects, no state).

**Contoh:**
- `formatCurrency(1500000)` → "Rp 1.500.000"
- `formatDate(date, 'DD/MM/YYYY')` → "23/10/2025"
- `validateEmail(email)` → true/false

**Best Practice:**
- Pure functions (same input = same output)
- Unit testable (easy to test)
- No external dependencies

**Baca lebih lanjut:** [utils/README.md](utils/README.md)

---

### 🔹 `config/` - Configuration
**Apa itu?** Setup external libraries (Firebase, Axios).

**Contoh:**
- `firebase.js` - Initialize Firebase SDK
- `axios.js` - Axios instance dengan base URL + interceptors

**Best Practice:**
- Load env variables dari `.env.local`
- Export configured instances
- One file per library

**Baca lebih lanjut:** [config/README.md](config/README.md)

---

### 🔹 `directives/` - Custom Directives
**Apa itu?** Custom Vue directives (future use).

**Contoh:**
- `v-click-outside` - Detect clicks outside element (untuk close dropdown)
- `v-tooltip` - Show tooltip on hover

**Best Practice:**
- Use directives untuk DOM manipulation
- Prefer composables untuk logic

**Baca lebih lanjut:** [directives/README.md](directives/README.md)

---

### 🔹 `plugins/` - Vue Plugins
**Apa itu?** Vue plugins untuk extend functionality (future use).

**Contoh:**
- Toast notification plugin
- Form validation plugin

**Best Practice:**
- Install dalam `main.js` via `app.use()`

**Baca lebih lanjut:** [plugins/README.md](plugins/README.md)

---

### 🔹 `layouts/` - Page Layouts
**Apa itu?** Wrapper components untuk pages (shared UI structure).

**Contoh:**
- `DefaultLayout.vue` - Header + Sidebar + Content + Footer (authenticated pages)
- `AuthLayout.vue` - Centered card (login/register)
- `EmptyLayout.vue` - No chrome (error pages, landing page)

**Best Practice:**
- Use `<router-view>` untuk inject page content
- Switch layouts di route meta (`meta: { layout: 'default' }`)

**Baca lebih lanjut:** [layouts/README.md](layouts/README.md)

---

### 🔹 `assets/` - Static Assets
**Apa itu?** Images, icons, styles yang di-import dalam components.

**Struktur:**
```
assets/
├── images/         # Photos, illustrations
├── icons/          # SVG icons
└── styles/         # CSS/SCSS files
    ├── variables.css   # CSS custom properties
    ├── reset.css       # CSS reset
    └── utilities.css   # Utility classes
```

**Best Practice:**
- Import dalam `<script>`: `import logo from '@/assets/images/logo.png'`
- Use dalam `<template>`: `<img :src="logo">`
- Vite will optimize images automatically

---

## 🔄 Data Flow Example

**User clicks "Login" button:**

```
1. LoginView.vue (page)
   └─ calls composable
      ↓
2. useAuth.js (composable)
   └─ calls service
      ↓
3. authService.js (service)
   └─ calls Firebase SDK
      ↓
4. Firebase Auth (external)
   └─ returns ID token
      ↓
5. authService.js
   └─ calls backend API
      ↓
6. Backend API (external)
   └─ returns JWT token
      ↓
7. useAuth.js
   └─ updates reactive state
      ↓
8. LoginView.vue
   └─ router.push('/dashboard')
```

**Key points:**
- **View** handles UI + user interaction
- **Composable** handles state + orchestration
- **Service** handles external communication
- **Separation** = testable, maintainable

---

## 🎓 Learning Path (Untuk Pemula)

### Week 1: Basics
1. ✅ **`components/`** - Buat button, card, input components
2. ✅ **`utils/`** - Buat formatter functions
3. ✅ **`assets/`** - Add images, setup CSS variables

### Week 2: Interactivity
4. ✅ **`composables/`** - Buat `useCounter.js` (simple state)
5. ✅ **`router/`** - Setup basic routes (home, about)
6. ✅ **`layouts/`** - Buat layout dengan header/footer

### Week 3: External Integration
7. ✅ **`config/`** - Setup Firebase config
8. ✅ **`services/`** - Buat auth service (login, logout)
9. ✅ **`modules/auth/`** - Buat auth module (login form)

### Week 4: Advanced
10. ✅ **`stores/`** - Setup Pinia untuk global state
11. ✅ **`directives/`** - Buat custom directive
12. ✅ **Integration** - Connect semua parts

---

## 📖 Reference Documentation

- **Vue 3 Docs:** https://vuejs.org/guide/
- **Composition API:** https://vuejs.org/guide/extras/composition-api-faq.html
- **Vue Router:** https://router.vuejs.org/
- **Pinia (State):** https://pinia.vuejs.org/
- **Vite:** https://vitejs.dev/guide/

---

## ❓ FAQ

**Q: Kapan pakai `components/` vs `modules/{name}/components/`?**  
A: 
- `components/` → Reusable di banyak module (Button, Modal, Input)
- `modules/{name}/components/` → Specific untuk module itu (LoginForm hanya untuk auth)

**Q: Kapan pakai composable vs store?**  
A: 
- **Composable:** Simple state, component-scoped (useForm, useFetch)
- **Store:** Global state, persist across routes (user auth, shopping cart)

**Q: Boleh import langsung dari subfolder?**  
A: Hindari! Gunakan path alias:
- ❌ `import Button from '../../components/ui/Button.vue'`
- ✅ `import Button from '@/components/ui/Button.vue'`

**Q: File mana yang diedit pertama kali?**  
A: 
1. `main.js` - Setup app, plugins, router
2. `App.vue` - Root component structure
3. `router/index.js` - Define routes
4. `modules/auth/views/LoginView.vue` - First page

---

**Next Steps:** Baca README.md di setiap subfolder untuk details!
