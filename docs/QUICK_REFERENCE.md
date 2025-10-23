# Quick Reference – ArtConnect

## Overview

Cheat sheet untuk common commands, patterns, dan workflows yang sering digunakan dalam ArtConnect development.

---

## NPM Scripts

### Development

```powershell
# Start dev server (Vite)
npm run dev
# → http://localhost:5173

# Build for production
npm run build
# → Output: dist/ folder

# Preview production build locally
npm run preview
# → http://localhost:4173
```

### Testing

```powershell
# Run all tests (single run)
npm run test

# Watch mode (auto re-run on changes)
npm run test:watch

# Coverage report
npm run coverage

# Run specific test file
npm run test -- artworkService.spec.js

# Run tests matching pattern
npm run test -- --grep "ArtworkCard"
```

### Utilities

```powershell
# Extract SKPL PDF to text
npm run extract:pdf

# (Future) Lint code
npm run lint

# (Future) Format code
npm run format
```

---

## Git Commands

### Daily Workflow

```powershell
# Pull latest changes
git pull origin develop

# Create feature branch
git checkout -b feature/artwork-upload

# Stage changes
git add src/modules/artworks/

# Commit dengan conventional format
git commit -m "feat(artwork): add upload form validation"

# Push to remote
git push origin feature/artwork-upload

# After PR merged, cleanup
git checkout develop
git pull origin develop
git branch -d feature/artwork-upload
```

### Common Scenarios

```powershell
# Undo last commit (keep changes)
git reset HEAD~1

# Discard uncommitted changes
git checkout -- <file>

# View commit history
git log --oneline

# View changes before commit
git diff

# View staged changes
git diff --staged

# Rebase dengan develop
git fetch origin
git rebase origin/develop

# Resolve merge conflicts
git status  # See conflicted files
# Edit files, resolve conflicts
git add <resolved-files>
git rebase --continue
```

---

## Firebase Commands

### Firestore

```javascript
import { db } from '@/services/firebase'
import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit 
} from 'firebase/firestore'

// Create document
const docRef = await addDoc(collection(db, 'artworks'), {
  title: 'Sunset',
  price: 1500000,
  createdAt: new Date()
})

// Read document by ID
const docSnap = await getDoc(doc(db, 'artworks', docId))
if (docSnap.exists()) {
  const data = docSnap.data()
}

// Read all documents
const querySnapshot = await getDocs(collection(db, 'artworks'))
querySnapshot.forEach(doc => {
  console.log(doc.id, doc.data())
})

// Query with filters
const q = query(
  collection(db, 'artworks'),
  where('status', '==', 'published'),
  orderBy('createdAt', 'desc'),
  limit(10)
)
const querySnapshot = await getDocs(q)

// Update document
await updateDoc(doc(db, 'artworks', docId), {
  price: 2000000,
  updatedAt: new Date()
})

// Delete document
await deleteDoc(doc(db, 'artworks', docId))
```

### Firebase Storage

```javascript
import { storage } from '@/services/firebase'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'

// Upload file
const storageRef = ref(storage, `artworks/${userId}/${fileName}`)
await uploadBytes(storageRef, file)

// Get download URL
const downloadURL = await getDownloadURL(storageRef)

// Delete file
await deleteObject(storageRef)
```

### Firebase Authentication

```javascript
import { auth } from '@/services/firebase'
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  onAuthStateChanged
} from 'firebase/auth'

// Register new user
const userCredential = await createUserWithEmailAndPassword(auth, email, password)
const user = userCredential.user

// Login
const userCredential = await signInWithEmailAndPassword(auth, email, password)
const user = userCredential.user

// Logout
await signOut(auth)

// Listen to auth state changes
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('User logged in:', user.uid)
  } else {
    console.log('User logged out')
  }
})
```

---

## Vue Composition API Patterns

### Reactive State

```javascript
import { ref, reactive, computed, watch } from 'vue'

// Ref (primitives & objects)
const count = ref(0)
const user = ref(null)

// Reactive (objects only)
const state = reactive({
  loading: false,
  error: null
})

// Computed (derived state)
const doubleCount = computed(() => count.value * 2)

// Watch (side effects)
watch(count, (newValue, oldValue) => {
  console.log(`Count changed from ${oldValue} to ${newValue}`)
})
```

### Composables

```javascript
// useCounter.js
import { ref } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  
  function increment() {
    count.value++
  }
  
  function decrement() {
    count.value--
  }
  
  return {
    count,
    increment,
    decrement
  }
}

// Usage in component
import { useCounter } from '@/composables/useCounter'

const { count, increment, decrement } = useCounter()
```

### Lifecycle Hooks

```javascript
import { onMounted, onUnmounted, onBeforeMount, onBeforeUnmount } from 'vue'

onBeforeMount(() => {
  console.log('Before component mounts')
})

onMounted(() => {
  console.log('Component mounted')
  // Fetch data, setup listeners
})

onBeforeUnmount(() => {
  console.log('Before component unmounts')
  // Cleanup
})

onUnmounted(() => {
  console.log('Component unmounted')
})
```

---

## Common Code Snippets

### Loading State Pattern

```vue
<script setup>
import { ref } from 'vue'

const isLoading = ref(false)
const error = ref(null)
const data = ref(null)

async function fetchData() {
  isLoading.value = true
  error.value = null
  
  try {
    const response = await api.getData()
    data.value = response
  } catch (e) {
    error.value = e.message
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div v-if="isLoading">Loading...</div>
  <div v-else-if="error">Error: {{ error }}</div>
  <div v-else>{{ data }}</div>
</template>
```

### Form Validation Pattern

```vue
<script setup>
import { ref, computed } from 'vue'

const email = ref('')
const password = ref('')

const emailError = computed(() => {
  if (!email.value) return 'Email is required'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    return 'Invalid email format'
  }
  return null
})

const passwordError = computed(() => {
  if (!password.value) return 'Password is required'
  if (password.value.length < 6) return 'Password must be at least 6 characters'
  return null
})

const isFormValid = computed(() => {
  return !emailError.value && !passwordError.value
})

function handleSubmit() {
  if (!isFormValid.value) return
  // Submit form
}
</script>
```

### Modal Pattern

```vue
<script setup>
import { ref } from 'vue'

const isOpen = ref(false)

function openModal() {
  isOpen.value = true
}

function closeModal() {
  isOpen.value = false
}

defineExpose({ openModal })  // Expose to parent
</script>

<template>
  <Transition name="fade">
    <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <slot />
        <button @click="closeModal">Close</button>
      </div>
    </div>
  </Transition>
</template>
```

### Toast Notification Pattern

```javascript
// useToast.js
import { ref } from 'vue'

const toasts = ref([])

export function useToast() {
  function show(message, type = 'info', duration = 3000) {
    const id = Date.now()
    toasts.value.push({ id, message, type })
    
    setTimeout(() => {
      remove(id)
    }, duration)
  }
  
  function remove(id) {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) toasts.value.splice(index, 1)
  }
  
  return {
    toasts,
    show,
    remove,
    success: (msg) => show(msg, 'success'),
    error: (msg) => show(msg, 'error'),
    warning: (msg) => show(msg, 'warning'),
    info: (msg) => show(msg, 'info')
  }
}
```

---

## Utility Functions

### Date Formatting

```javascript
// utils/date.js

export function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

export function formatDateTime(dateString) {
  const date = new Date(dateString)
  return date.toLocaleString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function formatRelativeTime(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  
  if (diffMins < 1) return 'Baru saja'
  if (diffMins < 60) return `${diffMins} menit yang lalu`
  if (diffHours < 24) return `${diffHours} jam yang lalu`
  if (diffDays < 7) return `${diffDays} hari yang lalu`
  return formatDate(dateString)
}
```

### Currency Formatting

```javascript
// utils/currency.js

export function formatCurrency(amount, currency = 'IDR') {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0
  }).format(amount)
}

export function parseCurrency(formattedString) {
  // Remove non-numeric characters except decimal point
  const cleaned = formattedString.replace(/[^0-9.-]/g, '')
  return parseFloat(cleaned) || 0
}
```

### Validation

```javascript
// utils/validation.js

export function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

export function isValidPhone(phone) {
  // Indonesian phone format
  const regex = /^(\+62|62|0)[0-9]{9,12}$/
  return regex.test(phone)
}

export function isValidURL(url) {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export function isStrongPassword(password) {
  // Min 8 chars, at least 1 uppercase, 1 lowercase, 1 number
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
  return regex.test(password)
}
```

---

## VS Code Shortcuts

### Essential Shortcuts

| Action | Windows | Mac |
|--------|---------|-----|
| Command Palette | Ctrl+Shift+P | Cmd+Shift+P |
| Quick Open File | Ctrl+P | Cmd+P |
| Find in File | Ctrl+F | Cmd+F |
| Find in Workspace | Ctrl+Shift+F | Cmd+Shift+F |
| Go to Definition | F12 | F12 |
| Go to Line | Ctrl+G | Cmd+G |
| Toggle Terminal | Ctrl+` | Cmd+` |
| Split Editor | Ctrl+\ | Cmd+\ |
| Close Editor | Ctrl+W | Cmd+W |
| Save All | Ctrl+K S | Cmd+K S |
| Format Document | Shift+Alt+F | Shift+Opt+F |
| Multi-cursor | Alt+Click | Opt+Click |
| Select Next Match | Ctrl+D | Cmd+D |
| Comment Line | Ctrl+/ | Cmd+/ |

### Vue-specific

| Action | Shortcut |
|--------|----------|
| Vue component template | Type `vue` then Tab |
| Import component | Type component name, auto-import |
| Go to definition | Ctrl+Click on import path |

---

## Debugging

### Console Debugging

```javascript
// Basic logging
console.log('Value:', value)

// Grouped logging
console.group('User Details')
console.log('Name:', user.name)
console.log('Email:', user.email)
console.groupEnd()

// Table format
console.table(artworks)

// Conditional logging
console.assert(artworks.length > 0, 'No artworks found')

// Performance timing
console.time('fetch')
await fetchArtworks()
console.timeEnd('fetch')  // fetch: 234ms
```

### Vue Devtools

**Install:** [Vue.js devtools](https://devtools.vuejs.org/)

**Features:**
- Inspect component tree
- View component data, props, computed
- Track events
- Time-travel debugging (Vuex/Pinia)

### Vitest Debugging

```powershell
# Run tests with debugger
node --inspect-brk ./node_modules/vitest/vitest.js

# Then open chrome://inspect in Chrome
# Set breakpoints in code
```

---

## Environment Variables

### Setup

Create `.env.local` (gitignored):

```bash
# Firebase configuration
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef

# Optional: Other configs
VITE_API_URL=https://api.example.com
```

### Usage

```javascript
// Access in code
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY
const apiUrl = import.meta.env.VITE_API_URL

// Check environment
const isDev = import.meta.env.DEV
const isProd = import.meta.env.PROD
```

**Rules:**
- Prefix dengan `VITE_` (exposed to client)
- Never commit `.env.local` (use `.env.example` as template)
- Never expose sensitive keys dalam client code

---

## Common Errors & Solutions

### Error: "Cannot find module '@/...'"

**Solution:** Ensure `jsconfig.json` exists dan restart VS Code

### Error: "Firebase: Error (auth/...)"

**Solution:** Check Firebase config dalam `.env.local`, ensure Firebase project setup complete

### Error: "Hydration mismatch"

**Solution:** Ensure server & client render same HTML (no random IDs, check dates/timestamps)

### Error: "Maximum call stack size exceeded"

**Solution:** Check for circular dependencies dalam imports or infinite loops

### Test Error: "Cannot find module" dalam test

**Solution:** Vitest uses vite.config.js - ensure path alias configured

---

## Keyboard Shortcuts for ArtConnect

Print-friendly quick card:

```
┌─────────────────────────────────────────────────────┐
│  ArtConnect Quick Reference Card                    │
├─────────────────────────────────────────────────────┤
│  DEV SERVER:                                        │
│  npm run dev          Start dev server              │
│  npm run build        Build production              │
│                                                     │
│  TESTING:                                           │
│  npm run test         Run all tests                 │
│  npm run test:watch   Watch mode                    │
│  npm run coverage     Coverage report               │
│                                                     │
│  GIT:                                               │
│  git checkout -b feature/name   New branch          │
│  git commit -m "type: message"  Conventional commit │
│  git push origin <branch>       Push to remote      │
│                                                     │
│  IMPORTS:                                           │
│  @/modules/...        Use @ alias for src/          │
│  ./Component.vue      Relative for same folder      │
│                                                     │
│  FIREBASE:                                          │
│  collection(db, 'name')         Get collection      │
│  addDoc(ref, data)              Create document     │
│  getDoc(doc(db, 'col', id))     Read document       │
│  updateDoc(ref, updates)        Update document     │
│  deleteDoc(ref)                 Delete document     │
│                                                     │
│  VUE:                                               │
│  ref()           Reactive primitive                 │
│  reactive()      Reactive object                    │
│  computed()      Derived state                      │
│  watch()         Side effects                       │
│                                                     │
│  VS CODE:                                           │
│  Ctrl+P          Quick open file                    │
│  Ctrl+Shift+P    Command palette                    │
│  F12             Go to definition                   │
│  Ctrl+`          Toggle terminal                    │
└─────────────────────────────────────────────────────┘
```

---

**Document Version:** 1.0  
**Last Updated:** [Date]  
**Owner:** Development Team  
**Tip:** Bookmark this page dalam browser untuk quick access!
