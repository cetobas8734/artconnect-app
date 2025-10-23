# Project Structure – ArtConnect

## Overview

Dokumen ini menjelaskan struktur folder, naming conventions, dan organizational patterns untuk codebase ArtConnect (Vue 3 + Vite + Firebase).

**Tujuan:**
- Consistency dalam file organization
- Easy navigation untuk developers
- Scalability untuk future features
- Clear separation of concerns

---

## Current Structure

```
artconnect-frontend/
├── public/                      # Static assets (tidak diproses Vite)
│   └── favicon.ico              # Site icon
│
├── src/                         # Source code utama
│   ├── main.js                  # App entry point
│   ├── App.vue                  # Root component
│   ├── style.css                # Global styles
│   │
│   ├── assets/                  # Assets yang diproses Vite
│   │   ├── images/              # Images (processed)
│   │   ├── icons/               # SVG icons
│   │   └── fonts/               # Custom fonts
│   │
│   └── components/              # Vue components
│       └── HelloWorld.vue       # Placeholder component
│
├── tests/                       # Test files (Vitest)
│   └── smoke.spec.js            # Sample test
│
├── docs/                        # Project documentation
│   ├── GIT_STRATEGY.md          # Git workflow
│   ├── DEFINITION_OF_DONE.md    # DoD checklists
│   ├── AGILE_SCRUM_PLAN.md      # Scrum plan
│   ├── SPRINT_CEREMONIES.md     # Ceremony guides
│   ├── SPRINT_TRACKING.md       # Tracking system
│   ├── DEVELOPMENT_CHECKLIST.md # Daily checklist
│   └── [this file]              # Project structure
│
├── scripts/                     # Build/dev scripts
│   └── extract-pdf.cjs          # PDF extraction utility
│
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore rules
├── index.html                   # HTML entry point
├── jsconfig.json                # JavaScript config (path alias)
├── package.json                 # Dependencies dan scripts
├── README.md                    # Project overview
└── vite.config.js               # Vite configuration
```

---

## Target Structure (Scalable Architecture)

Struktur yang akan diimplementasikan seiring development progress:

```
artconnect-frontend/
├── public/
│   ├── favicon.ico
│   ├── robots.txt               # SEO configuration
│   └── manifest.json            # PWA manifest (future)
│
├── src/
│   ├── main.js                  # App entry point
│   ├── App.vue                  # Root component
│   │
│   ├── assets/                  # Static assets
│   │   ├── images/
│   │   │   ├── logos/           # Brand logos
│   │   │   ├── placeholders/    # Placeholder images
│   │   │   └── backgrounds/     # Background images
│   │   ├── icons/               # SVG icon library
│   │   └── styles/              # Global styles
│   │       ├── main.css         # Main stylesheet
│   │       ├── variables.css    # CSS variables (colors, spacing)
│   │       ├── typography.css   # Font styles
│   │       └── utilities.css    # Utility classes
│   │
│   ├── modules/                 # Feature modules (domain-driven)
│   │   │
│   │   ├── auth/                # Authentication module (SRS-F-001 to F-004)
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.vue
│   │   │   │   ├── RegisterForm.vue
│   │   │   │   ├── ForgotPasswordForm.vue
│   │   │   │   └── ProfileForm.vue
│   │   │   ├── composables/
│   │   │   │   ├── useAuth.js           # Auth state management
│   │   │   │   └── useAuthValidation.js # Form validation
│   │   │   ├── services/
│   │   │   │   └── authService.js       # Firebase Auth API
│   │   │   ├── views/
│   │   │   │   ├── LoginView.vue
│   │   │   │   ├── RegisterView.vue
│   │   │   │   └── ProfileView.vue
│   │   │   └── routes.js                # Auth module routes
│   │   │
│   │   ├── artworks/            # Artwork management (SRS-F-007 to F-013)
│   │   │   ├── components/
│   │   │   │   ├── ArtworkCard.vue
│   │   │   │   ├── ArtworkGrid.vue
│   │   │   │   ├── ArtworkUploadForm.vue
│   │   │   │   ├── ArtworkEditForm.vue
│   │   │   │   ├── ArtworkDetailModal.vue
│   │   │   │   ├── ArtworkFilters.vue
│   │   │   │   └── ArtworkSortDropdown.vue
│   │   │   ├── composables/
│   │   │   │   ├── useArtworks.js       # Artwork CRUD
│   │   │   │   ├── useArtworkUpload.js  # Upload logic
│   │   │   │   └── useArtworkSearch.js  # Search/filter
│   │   │   ├── services/
│   │   │   │   ├── artworkService.js    # Firestore API
│   │   │   │   └── storageService.js    # Firebase Storage API
│   │   │   ├── views/
│   │   │   │   ├── ArtworkListView.vue
│   │   │   │   ├── ArtworkCreateView.vue
│   │   │   │   └── ArtworkDetailView.vue
│   │   │   └── routes.js
│   │   │
│   │   ├── contacts/            # Contact management (SRS-F-014 to F-017)
│   │   │   ├── components/
│   │   │   │   ├── ContactCard.vue
│   │   │   │   ├── ContactList.vue
│   │   │   │   ├── ContactForm.vue
│   │   │   │   ├── ContactDetailModal.vue
│   │   │   │   └── ContactFilters.vue
│   │   │   ├── composables/
│   │   │   │   ├── useContacts.js
│   │   │   │   └── useContactSearch.js
│   │   │   ├── services/
│   │   │   │   └── contactService.js
│   │   │   ├── views/
│   │   │   │   ├── ContactListView.vue
│   │   │   │   └── ContactDetailView.vue
│   │   │   └── routes.js
│   │   │
│   │   ├── pipeline/            # Sales pipeline (SRS-F-018 to F-020)
│   │   │   ├── components/
│   │   │   │   ├── KanbanBoard.vue
│   │   │   │   ├── KanbanColumn.vue
│   │   │   │   ├── OpportunityCard.vue
│   │   │   │   ├── OpportunityForm.vue
│   │   │   │   └── OpportunityDetailModal.vue
│   │   │   ├── composables/
│   │   │   │   ├── usePipeline.js
│   │   │   │   └── useOpportunityDragDrop.js
│   │   │   ├── services/
│   │   │   │   └── pipelineService.js
│   │   │   ├── views/
│   │   │   │   └── PipelineView.vue
│   │   │   └── routes.js
│   │   │
│   │   ├── analytics/           # Analytics & reporting (SRS-F-021 to F-025)
│   │   │   ├── components/
│   │   │   │   ├── RevenueChart.vue
│   │   │   │   ├── ArtworkPerformanceChart.vue
│   │   │   │   ├── ConversionFunnelChart.vue
│   │   │   │   ├── DateRangePicker.vue
│   │   │   │   └── StatCard.vue
│   │   │   ├── composables/
│   │   │   │   ├── useAnalytics.js
│   │   │   │   └── useChartData.js
│   │   │   ├── services/
│   │   │   │   └── analyticsService.js
│   │   │   ├── views/
│   │   │   │   └── AnalyticsView.vue
│   │   │   └── routes.js
│   │   │
│   │   └── shared/              # Shared module components
│   │       ├── components/
│   │       │   ├── BaseButton.vue
│   │       │   ├── BaseInput.vue
│   │       │   ├── BaseTextarea.vue
│   │       │   ├── BaseSelect.vue
│   │       │   ├── BaseModal.vue
│   │       │   ├── BaseToast.vue
│   │       │   ├── LoadingSpinner.vue
│   │       │   ├── EmptyState.vue
│   │       │   └── ErrorBoundary.vue
│   │       └── composables/
│   │           ├── useToast.js
│   │           ├── useModal.js
│   │           └── useLoading.js
│   │
│   ├── layouts/                 # Layout components
│   │   ├── DefaultLayout.vue    # Layout dengan navbar + sidebar
│   │   ├── AuthLayout.vue       # Layout untuk login/register
│   │   └── EmptyLayout.vue      # Layout minimal (404, etc)
│   │
│   ├── router/                  # Vue Router configuration
│   │   ├── index.js             # Router instance + setup
│   │   ├── routes.js            # Route definitions (aggregate modules)
│   │   └── guards.js            # Navigation guards (auth check)
│   │
│   ├── composables/             # Global composables
│   │   ├── useFirebase.js       # Firebase SDK initialization
│   │   ├── useErrorHandler.js   # Global error handling
│   │   └── useBreakpoints.js    # Responsive breakpoints
│   │
│   ├── services/                # Global services
│   │   ├── firebase.js          # Firebase config & init
│   │   └── api.js               # API client (if REST API needed)
│   │
│   ├── utils/                   # Utility functions
│   │   ├── date.js              # Date formatting utilities
│   │   ├── currency.js          # Currency formatting
│   │   ├── validation.js        # Common validation rules
│   │   ├── string.js            # String manipulation
│   │   └── constants.js         # App-wide constants
│   │
│   └── types/                   # Type definitions (JSDoc atau TypeScript future)
│       ├── artwork.js           # Artwork types
│       ├── contact.js           # Contact types
│       └── opportunity.js       # Opportunity types
│
├── tests/                       # Test files (mirror src structure)
│   ├── unit/                    # Unit tests
│   │   ├── utils/
│   │   │   ├── date.spec.js
│   │   │   └── validation.spec.js
│   │   └── services/
│   │       └── artworkService.spec.js
│   │
│   ├── components/              # Component tests
│   │   ├── auth/
│   │   │   └── LoginForm.spec.js
│   │   ├── artworks/
│   │   │   └── ArtworkCard.spec.js
│   │   └── shared/
│   │       └── BaseButton.spec.js
│   │
│   └── integration/             # Integration tests (future)
│       └── auth-flow.spec.js
│
├── docs/                        # Documentation
│   └── [all documentation files]
│
├── scripts/                     # Development scripts
│   ├── extract-pdf.cjs          # PDF extraction
│   └── seed-data.js             # Seed Firestore (dev)
│
├── .env.example
├── .env.local                   # Local environment (gitignored)
├── .gitignore
├── index.html
├── jsconfig.json
├── package.json
├── README.md
└── vite.config.js
```

---

## Module Structure Pattern

Setiap feature module mengikuti consistent pattern:

```
module-name/
├── components/       # UI components specific to module
├── composables/      # Module-specific composables (logic)
├── services/         # API/Firebase interactions
├── views/            # Page-level components
└── routes.js         # Module routes (imported by router/routes.js)
```

### Why This Structure?

**✅ Co-location:** Related files ditempatkan together  
**✅ Scalability:** Mudah add new modules tanpa chaos  
**✅ Clear ownership:** Setiap module self-contained  
**✅ Testing:** Easy to find related tests (mirror structure)  
**✅ Code splitting:** Vite can lazy-load modules efficiently

---

## Naming Conventions

### Files & Folders

#### Vue Components

**Format:** PascalCase, descriptive names

```
✅ GOOD:
ArtworkCard.vue
ContactDetailModal.vue
BaseButton.vue
LoginForm.vue

❌ BAD:
artwork-card.vue        # Wrong case
Card.vue                # Too generic
ArtworkCardComponent.vue # Redundant "Component"
```

**Naming Rules:**
- Base components (reusable): Prefix `Base` (BaseButton, BaseInput)
- Single-instance components: Prefix `The` (TheNavbar, TheSidebar)
- Child components: Parent name prefix (TodoList, TodoListItem)

#### JavaScript Files

**Format:** camelCase untuk utilities, PascalCase untuk classes

```
✅ GOOD:
authService.js
useAuth.js
date.js
ValidationError.js  # Class

❌ BAD:
AuthService.js      # Services should be camelCase
use-auth.js         # Use camelCase, not kebab-case
DATE.js             # All caps incorrect
```

#### Test Files

**Format:** Match source file name + `.spec.js`

```
Source:              Test:
LoginForm.vue   →   LoginForm.spec.js
authService.js  →   authService.spec.js
date.js         →   date.spec.js
```

#### Folders

**Format:** lowercase, kebab-case untuk multi-word

```
✅ GOOD:
artworks/
auth/
sales-pipeline/  # Kebab-case for multi-word

❌ BAD:
Artworks/        # No uppercase
Auth_Module/     # No underscores, no uppercase
salesPipeline/   # Use kebab-case, not camelCase
```

### Vue Component Structure

**Internal ordering convention:**

```vue
<script setup>
// 1. Imports
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '@/modules/shared/components/BaseButton.vue'

// 2. Props
const props = defineProps({
  artwork: {
    type: Object,
    required: true
  }
})

// 3. Emits
const emit = defineEmits(['update', 'delete'])

// 4. Composables
const router = useRouter()

// 5. Reactive state
const isLoading = ref(false)
const errorMessage = ref('')

// 6. Computed properties
const formattedPrice = computed(() => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR'
  }).format(props.artwork.price)
})

// 7. Methods
function handleUpdate() {
  emit('update', props.artwork.id)
}

// 8. Lifecycle hooks
onMounted(() => {
  console.log('Component mounted')
})
</script>

<template>
  <!-- Template content -->
</template>

<style scoped>
/* Component-specific styles */
</style>
```

### Constants

**Format:** SCREAMING_SNAKE_CASE

```javascript
// utils/constants.js

export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png']
export const DEFAULT_PAGE_SIZE = 20

export const ARTWORK_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived'
}

export const PIPELINE_STAGES = {
  INQUIRY: 'inquiry',
  NEGOTIATION: 'negotiation',
  CLOSED_WON: 'closed_won',
  CLOSED_LOST: 'closed_lost'
}
```

### Functions

**Format:** camelCase, verb prefix

```javascript
// ✅ GOOD:
function fetchArtworks() {}
function createArtwork() {}
function updateContact() {}
function deleteOpportunity() {}
function isValidEmail() {}    // Boolean returns: "is", "has", "can"
function hasPermission() {}
function canEditArtwork() {}

// ❌ BAD:
function artwork() {}         // No verb
function GetArtworks() {}     # PascalCase incorrect
function do_create() {}       # Snake case incorrect
```

### Composables

**Format:** camelCase, prefix `use`

```javascript
// ✅ GOOD:
useAuth.js        → export function useAuth() {}
useArtworks.js    → export function useArtworks() {}
useToast.js       → export function useToast() {}

// ❌ BAD:
auth.js           # Missing "use" prefix
UseAuth.js        # PascalCase incorrect
use-auth.js       # Kebab-case incorrect
```

### Services

**Format:** camelCase, suffix `Service`

```javascript
// ✅ GOOD:
authService.js
artworkService.js
storageService.js

// ❌ BAD:
auth.js           # Missing "Service" suffix
AuthService.js    # PascalCase incorrect
```

---

## Import Path Conventions

### Using Path Alias `@`

**Configuration:** `vite.config.js` dan `jsconfig.json` sudah configured

```javascript
// ✅ GOOD: Use @ alias untuk absolute imports
import BaseButton from '@/modules/shared/components/BaseButton.vue'
import { useAuth } from '@/modules/auth/composables/useAuth'
import { formatDate } from '@/utils/date'

// ❌ BAD: Avoid deep relative paths
import BaseButton from '../../../shared/components/BaseButton.vue'
import { useAuth } from '../../auth/composables/useAuth'
```

### Import Grouping & Ordering

```javascript
// 1. External dependencies (node_modules)
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// 2. Internal modules (alias imports)
import BaseButton from '@/modules/shared/components/BaseButton.vue'
import { useArtworks } from '@/modules/artworks/composables/useArtworks'

// 3. Relative imports (same module)
import ArtworkCard from './ArtworkCard.vue'
import { validateArtwork } from './validation'

// 4. Utilities
import { formatDate } from '@/utils/date'
import { ARTWORK_STATUS } from '@/utils/constants'

// 5. Assets
import logoImage from '@/assets/images/logo.png'
```

---

## File Size Guidelines

**Maintain readability dan maintainability:**

| File Type | Ideal Size | Max Size | Action if Exceeded |
|-----------|-----------|----------|-------------------|
| Vue Component | <250 lines | 400 lines | Split into child components |
| Composable | <150 lines | 250 lines | Extract logic to separate composable |
| Service | <200 lines | 350 lines | Split into multiple services |
| Utility | <100 lines | 200 lines | Group related utils separately |

**Red Flags:**
- Component >500 lines → Definitely refactor
- Function >50 lines → Extract to smaller functions
- Deeply nested (>3 levels) → Simplify logic

---

## Code Organization Best Practices

### 1. Single Responsibility Principle

Each file should have **one clear purpose**.

```
✅ GOOD:
artworkService.js    # Only Firestore operations untuk artworks
useArtworkUpload.js  # Only upload logic
useArtworkSearch.js  # Only search/filter logic

❌ BAD:
artworkUtils.js      # Vague, multiple responsibilities mixed
helpers.js           # Too generic, unclear purpose
```

### 2. Avoid God Components

Don't create massive components yang handle everything.

```vue
❌ BAD:
ArtworkManager.vue   # 800 lines: form, list, filters, modal, all mixed

✅ GOOD:
ArtworkListView.vue       # Orchestrates child components
  ├── ArtworkFilters.vue  # Filtering UI
  ├── ArtworkGrid.vue     # Display grid
  └── ArtworkCard.vue     # Individual card
```

### 3. Shared vs Module-Specific

**Shared components:** Used by **2+ modules**

```
src/modules/shared/components/
  ├── BaseButton.vue       # Used everywhere
  ├── BaseModal.vue        # Used everywhere
  └── LoadingSpinner.vue   # Used everywhere
```

**Module-specific components:** Used **only in one module**

```
src/modules/artworks/components/
  ├── ArtworkCard.vue      # Only used in artworks module
  └── ArtworkUploadForm.vue
```

**Promote to shared jika:**
- Component digunakan di 2+ modules
- Component generic (no domain-specific logic)

### 4. Composable Granularity

Each composable = **one logical concern**

```javascript
// ✅ GOOD: Focused composables
useAuth.js          # Auth state (login, logout, user)
useAuthValidation.js # Form validation logic
useAuthPersistence.js # Local storage persistence

// ❌ BAD: Too much in one composable
useAuth.js          # 500 lines: auth + validation + forms + API
```

### 5. Service Layer Pattern

Services handle **external interactions** (API, Firebase, storage).

```javascript
// artworkService.js

import { db, storage } from '@/services/firebase'
import { collection, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'

export const artworkService = {
  async create(artworkData) {
    // Firestore create logic
  },
  
  async update(id, updates) {
    // Firestore update logic
  },
  
  async delete(id) {
    // Firestore delete logic
  },
  
  async uploadImage(file) {
    // Firebase Storage upload logic
  }
}
```

**Composables use services:**

```javascript
// useArtworks.js

import { ref } from 'vue'
import { artworkService } from '../services/artworkService'

export function useArtworks() {
  const artworks = ref([])
  const isLoading = ref(false)
  
  async function createArtwork(data) {
    isLoading.value = true
    try {
      const result = await artworkService.create(data)
      artworks.value.push(result)
      return result
    } finally {
      isLoading.value = false
    }
  }
  
  return {
    artworks,
    isLoading,
    createArtwork
  }
}
```

---

## Migration Strategy (Current → Target)

### Phase 1: Foundation (Sprint 1-2)

```
src/
├── assets/styles/           # Move global styles
├── modules/shared/          # Create shared components
│   ├── components/
│   │   ├── BaseButton.vue
│   │   ├── BaseInput.vue
│   │   └── LoadingSpinner.vue
│   └── composables/
│       └── useToast.js
├── router/                  # Setup Vue Router
│   ├── index.js
│   ├── routes.js
│   └── guards.js
├── services/
│   └── firebase.js          # Firebase config
└── utils/
    ├── constants.js
    └── validation.js
```

**Actions:**
1. Create folder structure
2. Migrate `HelloWorld.vue` → `BaseButton.vue` (rename, generalize)
3. Setup Vue Router
4. Initialize Firebase SDK

### Phase 2: Auth Module (Sprint 3-4)

```
src/modules/auth/
├── components/
│   ├── LoginForm.vue
│   └── RegisterForm.vue
├── composables/
│   └── useAuth.js
├── services/
│   └── authService.js
├── views/
│   ├── LoginView.vue
│   └── RegisterView.vue
└── routes.js
```

**Actions:**
1. Implement auth components
2. Firebase Authentication integration
3. Navigation guards (auth check)

### Phase 3: Core Modules (Sprint 5-10)

Implement dalam order:

1. **Artworks module** (Sprint 5-7) - Highest priority (SRS-F-007 to F-013)
2. **Contacts module** (Sprint 8-9) - Medium priority (SRS-F-014 to F-017)
3. **Pipeline module** (Sprint 10-11) - Medium priority (SRS-F-018 to F-020)

### Phase 4: Analytics (Sprint 12-14)

```
src/modules/analytics/
├── components/
│   ├── RevenueChart.vue
│   └── StatCard.vue
├── composables/
│   └── useAnalytics.js
├── services/
│   └── analyticsService.js
└── views/
    └── AnalyticsView.vue
```

### Phase 5: Polish & Optimization (Sprint 15-16)

- Code splitting optimization
- Performance tuning
- Documentation completion
- Testing coverage improvement

---

## Folder Creation Script

Untuk quickly create module structure:

```powershell
# Create new module structure
# Usage: .\scripts\create-module.ps1 artworks

param($moduleName)

$basePath = "src\modules\$moduleName"

New-Item -ItemType Directory -Path "$basePath\components" -Force
New-Item -ItemType Directory -Path "$basePath\composables" -Force
New-Item -ItemType Directory -Path "$basePath\services" -Force
New-Item -ItemType Directory -Path "$basePath\views" -Force

New-Item -ItemType File -Path "$basePath\routes.js" -Force

Write-Host "✅ Module '$moduleName' structure created!"
```

---

## Quick Reference

### Where to Put New Files?

| File Type | Location | Example |
|-----------|----------|---------|
| Vue component (reusable) | `modules/shared/components/` | `BaseModal.vue` |
| Vue component (feature) | `modules/<module>/components/` | `ArtworkCard.vue` |
| Page component | `modules/<module>/views/` | `ArtworkListView.vue` |
| Composable (global) | `composables/` | `useFirebase.js` |
| Composable (module) | `modules/<module>/composables/` | `useArtworks.js` |
| Service (global) | `services/` | `firebase.js` |
| Service (module) | `modules/<module>/services/` | `artworkService.js` |
| Utility function | `utils/` | `date.js` |
| Constant | `utils/constants.js` | `MAX_FILE_SIZE` |
| Test (unit) | `tests/unit/` | `date.spec.js` |
| Test (component) | `tests/components/<module>/` | `ArtworkCard.spec.js` |
| Image asset | `assets/images/` | `logo.png` |
| Global style | `assets/styles/` | `variables.css` |

### Import Path Examples

```javascript
// Shared component
import BaseButton from '@/modules/shared/components/BaseButton.vue'

// Module component
import ArtworkCard from '@/modules/artworks/components/ArtworkCard.vue'

// Composable
import { useAuth } from '@/modules/auth/composables/useAuth'

// Service
import { artworkService } from '@/modules/artworks/services/artworkService'

// Utility
import { formatDate } from '@/utils/date'

// Constant
import { MAX_FILE_SIZE } from '@/utils/constants'

// Asset
import logo from '@/assets/images/logo.png'
```

---

## Anti-Patterns to Avoid

❌ **Circular dependencies**

```javascript
// auth/useAuth.js imports artworks/useArtworks.js
// artworks/useArtworks.js imports auth/useAuth.js
// → Circular dependency! Refactor to shared composable.
```

❌ **Module coupling**

```javascript
// artworks module importing from contacts module directly
import { useContacts } from '@/modules/contacts/composables/useContacts'
// → Tight coupling. Use shared composable or service instead.
```

❌ **Deep nesting** (>4 levels)

```
src/modules/artworks/components/forms/upload/steps/metadata/
// → Too deep! Flatten structure.
```

❌ **Utility junk drawer**

```javascript
// utils/helpers.js with 50 unrelated functions
// → Split into focused utilities (date.js, string.js, validation.js)
```

---

## Continuous Improvement

### Monthly Structure Review

- [ ] Check for files >400 lines (refactor candidates)
- [ ] Identify shared components used in 1 module only (move to module)
- [ ] Identify module-specific components used in multiple modules (promote to shared)
- [ ] Review import paths (convert relative → alias)
- [ ] Check for orphaned files (not imported anywhere)

### Documentation Updates

- Update this document when structure changes
- Document new patterns/conventions dalam team meetings
- Share folder structure visual diagram dalam onboarding

---

**Document Version:** 1.0  
**Last Updated:** [Date]  
**Owner:** Development Team  
**Review:** Monthly during sprint retrospectives
