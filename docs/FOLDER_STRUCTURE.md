# Vue 3 Folder Structure – Quick Reference

Dokumen ini adalah **quick reference** untuk struktur folder Vue 3 di ArtConnect. Untuk detail lengkap, lihat README di setiap folder.

---

## 📁 Complete Structure

```
artconnect-frontend/
├── public/                         # Static assets (tidak di-process Vite)
│
├── src/
│   ├── main.js                     # ⭐ Entry point aplikasi
│   ├── App.vue                     # ⭐ Root component
│   ├── style.css                   # Global styles
│   │
│   ├── modules/                    # ⭐ Feature-based modules (by domain)
│   │   ├── auth/                   # Authentication module
│   │   │   ├── components/         # Auth-specific components
│   │   │   ├── composables/        # Auth-specific composables
│   │   │   ├── services/           # Auth API calls
│   │   │   ├── views/              # Auth pages (LoginView, RegisterView)
│   │   │   └── index.js            # Module public API
│   │   ├── artworks/               # Artworks management module
│   │   ├── contacts/               # Contacts management module
│   │   ├── pipeline/               # Sales pipeline module
│   │   └── analytics/              # Analytics module
│   │
│   ├── components/                 # ⭐ Shared/reusable components
│   │   ├── ui/                     # Pure UI components (Button, Card, Modal)
│   │   ├── forms/                  # Form components (TextInput, Select)
│   │   ├── layout/                 # Layout components (Header, Sidebar, Footer)
│   │   ├── feedback/               # User feedback (Toast, Alert)
│   │   └── data/                   # Data display (Table, Pagination)
│   │
│   ├── composables/                # ⭐ Reusable composition functions
│   │   ├── useAuth.js              # Authentication state & methods
│   │   ├── useFetch.js             # Generic data fetching
│   │   ├── useForm.js              # Form state & validation
│   │   ├── useToast.js             # Toast notifications
│   │   ├── usePagination.js        # Pagination logic
│   │   ├── useDebounce.js          # Debounce utility
│   │   └── useLocalStorage.js      # localStorage sync
│   │
│   ├── services/                   # ⭐ External API communication
│   │   ├── firebase/               # Firebase SDK services
│   │   │   ├── auth.js             # Firebase Auth methods
│   │   │   └── index.js            # Firebase initialization
│   │   ├── api/                    # Backend REST API clients
│   │   │   ├── artworks.js         # Artwork CRUD API
│   │   │   ├── contacts.js         # Contacts CRUD API
│   │   │   ├── opportunities.js    # Opportunities CRUD API
│   │   │   └── auth.js             # Auth API (token exchange)
│   │   └── storage/                # File handling
│   │       └── imageUpload.js      # Image upload/validation
│   │
│   ├── router/                     # ⭐ Vue Router configuration
│   │   ├── index.js                # Router setup & routes
│   │   └── guards.js               # Navigation guards (auth check)
│   │
│   ├── stores/                     # State management (Pinia - future)
│   │   ├── auth.js                 # Auth store
│   │   └── artworks.js             # Artworks store
│   │
│   ├── utils/                      # ⭐ Pure utility functions
│   │   ├── formatters.js           # Data formatting (currency, date, etc)
│   │   ├── validators.js           # Input validation
│   │   ├── constants.js            # App constants & enums
│   │   └── helpers.js              # Generic helpers (debounce, etc)
│   │
│   ├── config/                     # ⭐ External library configuration
│   │   ├── firebase.js             # Firebase SDK init
│   │   └── axios.js                # Axios instance config
│   │
│   ├── directives/                 # Custom Vue directives (future)
│   │   └── clickOutside.js         # v-click-outside directive
│   │
│   ├── plugins/                    # Vue plugins (future)
│   │   └── toast.js                # Toast plugin
│   │
│   ├── layouts/                    # ⭐ Page layout components
│   │   ├── DefaultLayout.vue       # Authenticated layout (header+sidebar)
│   │   ├── AuthLayout.vue          # Login/register layout
│   │   └── EmptyLayout.vue         # Minimal layout (error pages)
│   │
│   └── assets/                     # Static assets (imported in code)
│       ├── images/                 # Images, logos
│       ├── icons/                  # SVG icons
│       └── styles/                 # CSS files
│           ├── variables.css       # CSS custom properties
│           ├── reset.css           # CSS reset
│           └── utilities.css       # Utility classes
│
├── tests/                          # Test files (Vitest)
│   ├── unit/                       # Unit tests
│   ├── components/                 # Component tests
│   └── integration/                # Integration tests
│
├── docs/                           # Project documentation
│   ├── ARCHITECTURE.md             # System architecture overview
│   ├── GIT_STRATEGY.md             # Git workflow
│   ├── SPRINT_ROADMAP.md           # Sprint planning
│   └── ...                         # Other docs
│
├── .env.example                    # Environment variables template
├── .env.local                      # Local env vars (gitignored)
├── vite.config.ts                  # Vite configuration
├── tsconfig.json                   # TypeScript configuration
├── tsconfig.node.json              # TypeScript config for Node.js
├── tailwind.config.js              # Tailwind CSS configuration
├── postcss.config.js               # PostCSS configuration
└── package.json                    # Dependencies & scripts
```

---

## 🎯 When to Use Each Folder

| Folder | Use When... | Example |
|--------|-------------|---------|
| **`modules/{name}/`** | Code specific to one business domain | `modules/artworks/` untuk semua artwork-related code |
| **`components/`** | Reusable UI component (used in 2+ modules) | `Button.vue`, `Modal.vue`, `TextInput.vue` |
| **`composables/`** | Reusable logic dengan state (Vue reactivity) | `useAuth.js`, `useFetch.js`, `useForm.js` |
| **`services/`** | API calls, external service communication | `artworksService.js`, `authService.js` |
| **`router/`** | Route definitions, navigation logic | Route `/artworks` → `ArtworksListView` |
| **`stores/`** | Global state management (Pinia) | `authStore`, `cartStore` |
| **`utils/`** | Pure functions (no state, no side effects) | `formatCurrency()`, `validateEmail()` |
| **`config/`** | External library setup | Firebase init, Axios instance |
| **`layouts/`** | Page wrapper components | `DefaultLayout` (header+sidebar+footer) |
| **`assets/`** | Static files imported in code | Images, icons, styles |

---

## 📖 Detailed Documentation

Setiap folder punya README lengkap dengan:
- Purpose & best practices
- Code examples
- Learning exercises

**Read:**
- **[src/README.md](../src/README.md)** - Overview struktur lengkap
- **[src/modules/README.md](../src/modules/README.md)** - Feature modules guide
- **[src/components/README.md](../src/components/README.md)** - Shared components guide
- **[src/composables/README.md](../src/composables/README.md)** - Composables patterns
- **[src/services/README.md](../src/services/README.md)** - API service layer
- **[src/router/README.md](../src/router/README.md)** - Vue Router setup
- **[src/utils/README.md](../src/utils/README.md)** - Utility functions
- **[src/config/README.md](../src/config/README.md)** - External configs
- **[src/layouts/README.md](../src/layouts/README.md)** - Layout components

---

## 🚀 Getting Started

### 1. Understand the Flow

**User Action → Component → Composable → Service → API**

Example: User creates artwork
1. `ArtworkCreateView.vue` (view) - User fills form
2. `useArtworkForm.js` (composable) - Handle form state & validation
3. `artworksService.js` (service) - Call backend API
4. Backend API - Save to database
5. Response → Service → Composable → View updates

---

### 2. Import Pattern

**Always use path alias `@/`:**

```typescript
// ✅ Good
import Button from '@/components/ui/Button.vue'
import { useAuth } from '@/composables/useAuth'
import artworksService from '@/services/api/artworks'
import { formatCurrency } from '@/utils/formatters'

// ❌ Bad (relative paths)
import Button from '../../components/ui/Button.vue'
import { useAuth } from '../composables/useAuth'
```

---

### 3. File Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| **Components** | PascalCase + `.vue` | `ArtworkCard.vue`, `TextInput.vue` |
| **Composables** | camelCase + `use` prefix + `.ts` | `useAuth.ts`, `useForm.ts` |
| **Services** | camelCase + `Service` suffix + `.ts` | `artworksService.ts` |
| **Views** | PascalCase + `View` suffix + `.vue` | `ArtworksListView.vue` |
| **Utils** | camelCase + `.ts` | `formatters.ts`, `validators.ts` |
| **Types** | PascalCase + `.ts` in `types/` | `Artwork.ts`, `User.ts` |
| **Constants** | UPPER_SNAKE_CASE (values) | `ARTWORK_MEDIUMS` |

---

### 4. Code Organization Checklist

When building a new feature:

**Step 1: Plan Module**
- [ ] Create folder `modules/{feature}/`
- [ ] Define public API (`index.js`)

**Step 2: Create Service**
- [ ] Create `services/api/{feature}.js`
- [ ] Define CRUD methods (`getAll`, `getById`, `create`, `update`, `delete`)

**Step 3: Create Composable**
- [ ] Create `composables/use{Feature}.js`
- [ ] Call service, manage state

**Step 4: Create Components**
- [ ] Shared components → `components/`
- [ ] Feature-specific → `modules/{feature}/components/`

**Step 5: Create Views**
- [ ] Create `modules/{feature}/views/{Name}View.vue`
- [ ] Use composable + components

**Step 6: Add Routes**
- [ ] Update `router/index.js`
- [ ] Add navigation guards if needed

**Step 7: Export Module**
- [ ] Export views, composables dalam `modules/{feature}/index.js`

---

## 🎓 Learning Path

### Week 1-2: Basics
1. Read `src/README.md`
2. Explore `components/` - Create Button, Card, Input
3. Explore `utils/` - Create formatters & validators
4. Explore `assets/` - Add images, setup CSS variables

### Week 3-4: Interactivity
5. Explore `composables/` - Create `useCounter`, `useFetch`
6. Explore `router/` - Setup basic routes
7. Explore `layouts/` - Create layouts dengan header/footer

### Week 5-6: Integration
8. Explore `config/` - Setup Firebase, Axios
9. Explore `services/` - Create auth service, API clients
10. Explore `modules/` - Build complete auth module

### Week 7-8: Advanced
11. Explore `stores/` - Setup Pinia state management
12. Build complete CRUD feature (artworks)
13. Add tests (`tests/`)

---

## ❓ FAQ

**Q: Folder mana yang paling sering diedit?**  
A: `modules/`, `components/`, `composables/`, `services/` - ini inti development.

**Q: Kapan pakai `modules/{name}/components/` vs `components/`?**  
A:
- `components/` → Reusable di 2+ modules (Button, Modal, Input)
- `modules/{name}/components/` → Specific untuk 1 module (ArtworkCard)

**Q: Boleh langsung edit file di `components/ui/Button.vue`?**  
A: Ya! Tapi hati-hati karena dipakai banyak tempat. Buat test dulu.

**Q: Harus pakai semua folder?**  
A: Tidak! Mulai simple, tambah folder sesuai kebutuhan. Prioritas:
1. `modules/` - Feature code
2. `components/` - Shared UI
3. `composables/` - Shared logic
4. `services/` - API calls
5. `router/` - Navigation
6. Sisanya: Optional (add later)

**Q: File mana yang diedit pertama kali?**  
A:
1. `main.js` - Setup app
2. `router/index.js` - Add routes
3. `modules/auth/views/LoginView.vue` - First page
4. `App.vue` - Layout switching

---

## 🔗 Next Steps

1. ✅ Baca `src/README.md` (overview lengkap)
2. ✅ Pilih 1 module untuk dipelajari (mulai dari `auth/`)
3. ✅ Follow learning exercises di setiap README
4. ✅ Build first feature (authentication)
5. ✅ Repeat untuk features lain

---

**Happy coding!** 🚀
