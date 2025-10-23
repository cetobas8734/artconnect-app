# Services Folder (`src/services/`)

**Services** adalah layer untuk komunikasi dengan **external APIs** dan third-party services (Firebase, Backend REST API, dll).

---

## 🎯 Apa itu Service?

**Service** = Pure API communication layer (no state management, no UI logic)

**Purpose:**
- Encapsulate API calls
- Abstract implementation details
- Provide clean interface untuk composables/components
- Handle request/response transformation

**Bedanya dengan composable:**
- **Service:** Pure API calls (Promise-based, no Vue reactivity)
- **Composable:** State management + orchestrate services

---

## 📂 Folder Structure

```
services/
├── firebase/                   # Firebase SDK services
│   ├── auth.js                 # Firebase Authentication
│   ├── index.js                # Firebase initialization
│   └── config.js               # Firebase config
│
├── api/                        # Backend REST API clients
│   ├── artworks.js             # Artwork API endpoints
│   ├── contacts.js             # Contacts API endpoints
│   ├── opportunities.js        # Opportunities API endpoints
│   ├── analytics.js            # Analytics API endpoints
│   └── auth.js                 # Auth API (token exchange)
│
└── storage/                    # File handling services
    ├── imageUpload.js          # Image upload helper
    └── fileDownload.js         # File download helper
```

---

## ✅ Best Practices

### 1. **Return Data (not Response)**

```javascript
// ❌ Jangan begini (return full response)
export async function getArtworks() {
  const response = await axios.get('/artworks')
  return response // ❌ Response object
}

// ✅ Begini (return data only)
export async function getArtworks() {
  const response = await axios.get('/artworks')
  return response.data // ✅ Clean data
}
```

**Why?**
- Caller doesn't need response metadata (headers, status, etc)
- Cleaner API
- Easy to mock dalam tests

---

### 2. **Throw Errors (Let Caller Handle)**

```javascript
// ❌ Jangan begini (swallow errors)
export async function getArtwork(id) {
  try {
    const response = await axios.get(`/artworks/${id}`)
    return response.data
  } catch (error) {
    console.error(error) // ❌ Silent error
    return null // ❌ Loses error info
  }
}

// ✅ Begini (throw errors)
export async function getArtwork(id) {
  const response = await axios.get(`/artworks/${id}`)
  return response.data
  // Let axios throw error, caller will handle
}
```

**Why?**
- Caller can decide how to handle errors (toast, retry, fallback)
- Preserve error info
- Better error tracking

---

### 3. **Use Async/Await (not .then())**

```javascript
// ❌ Jangan begini (.then() chains)
export function getArtworks() {
  return axios.get('/artworks')
    .then(response => response.data)
    .catch(error => {
      throw error
    })
}

// ✅ Begini (async/await)
export async function getArtworks() {
  const response = await axios.get('/artworks')
  return response.data
}
```

**Why?**
- More readable
- Easier error handling
- Modern JavaScript standard

---

### 4. **Export Object (not Individual Functions)**

```javascript
// ❌ Jangan begini (individual exports)
export async function getAll() { /* ... */ }
export async function getById(id) { /* ... */ }
export async function create(data) { /* ... */ }

// ✅ Begini (export object)
const artworksService = {
  async getAll() { /* ... */ },
  async getById(id) { /* ... */ },
  async create(data) { /* ... */ },
  async update(id, data) { /* ... */ },
  async delete(id) { /* ... */ }
}

export default artworksService
```

**Why?**
- Clear namespace (`artworksService.getAll()`)
- Easy to mock entire service
- Consistent pattern

---

### 5. **Transform Data (if Needed)**

```javascript
// Backend returns snake_case, frontend uses camelCase
const artworksService = {
  async getAll() {
    const response = await axios.get('/artworks')
    
    // Transform snake_case → camelCase
    return response.data.map(artwork => ({
      id: artwork.id,
      title: artwork.title,
      price: artwork.price,
      imageUrl: artwork.image_url, // ✅ Transform
      createdAt: artwork.created_at // ✅ Transform
    }))
  }
}
```

---

## 📝 Service Examples

### Example 1: Firebase Auth Service

```javascript
// services/firebase/auth.js
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import { auth } from './index' // Firebase auth instance

const googleProvider = new GoogleAuthProvider()

const authService = {
  /**
   * Sign in with Google
   * @returns {Promise<UserCredential>}
   */
  async signInWithGoogle() {
    const result = await signInWithPopup(auth, googleProvider)
    return result
  },

  /**
   * Sign out current user
   * @returns {Promise<void>}
   */
  async signOut() {
    await signOut(auth)
  },

  /**
   * Get ID token for current user
   * @returns {Promise<string>}
   */
  async getIdToken() {
    const user = auth.currentUser
    if (!user) throw new Error('No user logged in')
    
    const token = await user.getIdToken()
    return token
  },

  /**
   * Listen to auth state changes
   * @param {Function} callback - Callback dengan user object
   * @returns {Function} Unsubscribe function
   */
  onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, callback)
  },

  /**
   * Get current user
   * @returns {User | null}
   */
  getCurrentUser() {
    return auth.currentUser
  }
}

export default authService
```

**Usage:**
```javascript
import authService from '@/services/firebase/auth'

// Sign in
const result = await authService.signInWithGoogle()
console.log('User:', result.user)

// Get token
const token = await authService.getIdToken()

// Listen to changes
const unsubscribe = authService.onAuthStateChanged((user) => {
  console.log('Auth changed:', user)
})
```

---

### Example 2: Backend API Service (Artworks)

```javascript
// services/api/artworks.js
import axios from '@/config/axios'

const BASE_URL = '/artworks'

const artworksService = {
  /**
   * Get all artworks for current user
   * @returns {Promise<Array>}
   */
  async getAll() {
    const response = await axios.get(BASE_URL)
    return response.data
  },

  /**
   * Get single artwork by ID
   * @param {string} id - Artwork ID
   * @returns {Promise<Object>}
   */
  async getById(id) {
    const response = await axios.get(`${BASE_URL}/${id}`)
    return response.data
  },

  /**
   * Create new artwork
   * @param {Object} data - Artwork data
   * @param {string} data.title
   * @param {number} data.price
   * @param {string} data.description
   * @param {File} data.imageFile - Image file
   * @returns {Promise<Object>}
   */
  async create(data) {
    const formData = new FormData()
    formData.append('title', data.title)
    formData.append('price', data.price)
    formData.append('description', data.description || '')
    formData.append('medium', data.medium || '')
    formData.append('dimensions', data.dimensions || '')
    formData.append('year', data.year || '')
    
    if (data.imageFile) {
      formData.append('image', data.imageFile)
    }

    const response = await axios.post(BASE_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    return response.data
  },

  /**
   * Update existing artwork
   * @param {string} id - Artwork ID
   * @param {Object} data - Updated data
   * @returns {Promise<Object>}
   */
  async update(id, data) {
    const formData = new FormData()
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key])
      }
    })

    const response = await axios.put(`${BASE_URL}/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    return response.data
  },

  /**
   * Delete artwork
   * @param {string} id - Artwork ID
   * @returns {Promise<void>}
   */
  async delete(id) {
    await axios.delete(`${BASE_URL}/${id}`)
  },

  /**
   * Search artworks
   * @param {Object} filters
   * @param {string} filters.query - Search query
   * @param {number} filters.minPrice - Min price
   * @param {number} filters.maxPrice - Max price
   * @param {string} filters.medium - Medium filter
   * @returns {Promise<Array>}
   */
  async search(filters) {
    const params = new URLSearchParams()
    
    if (filters.query) params.append('q', filters.query)
    if (filters.minPrice) params.append('minPrice', filters.minPrice)
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice)
    if (filters.medium) params.append('medium', filters.medium)

    const response = await axios.get(`${BASE_URL}?${params.toString()}`)
    return response.data
  }
}

export default artworksService
```

**Usage:**
```javascript
import artworksService from '@/services/api/artworks'

// Get all
const artworks = await artworksService.getAll()

// Create
const newArtwork = await artworksService.create({
  title: 'Sunset Painting',
  price: 1500000,
  description: 'Beautiful sunset',
  imageFile: file // File object from input
})

// Search
const results = await artworksService.search({
  query: 'sunset',
  minPrice: 1000000,
  maxPrice: 2000000
})
```

---

### Example 3: Auth API Service (Token Exchange)

```javascript
// services/api/auth.js
import axios from '@/config/axios'

const authApiService = {
  /**
   * Exchange Firebase ID token for backend JWT
   * @param {string} firebaseToken - Firebase ID token
   * @returns {Promise<Object>} { token, user }
   */
  async verifyFirebaseToken(firebaseToken) {
    const response = await axios.post('/auth/verify', {
      firebaseToken
    })
    
    return response.data // { token, user }
  },

  /**
   * Get current user profile from backend
   * @returns {Promise<Object>}
   */
  async getProfile() {
    const response = await axios.get('/auth/profile')
    return response.data
  },

  /**
   * Update user profile
   * @param {Object} data - Profile data
   * @returns {Promise<Object>}
   */
  async updateProfile(data) {
    const response = await axios.put('/auth/profile', data)
    return response.data
  }
}

export default authApiService
```

---

### Example 4: Image Upload Service

```javascript
// services/storage/imageUpload.js

const imageUploadService = {
  /**
   * Validate image file
   * @param {File} file
   * @returns {Object} { valid: boolean, error: string }
   */
  validateImage(file) {
    const maxSize = 5 * 1024 * 1024 // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']

    if (!file) {
      return { valid: false, error: 'No file selected' }
    }

    if (!allowedTypes.includes(file.type)) {
      return { 
        valid: false, 
        error: 'Invalid file type. Only JPEG, PNG, and WebP allowed' 
      }
    }

    if (file.size > maxSize) {
      return { 
        valid: false, 
        error: 'File too large. Maximum size is 5MB' 
      }
    }

    return { valid: true, error: null }
  },

  /**
   * Create preview URL for image
   * @param {File} file
   * @returns {string} Object URL
   */
  createPreviewUrl(file) {
    return URL.createObjectURL(file)
  },

  /**
   * Revoke preview URL (cleanup)
   * @param {string} url - Object URL to revoke
   */
  revokePreviewUrl(url) {
    URL.revokeObjectURL(url)
  },

  /**
   * Compress image before upload (future feature)
   * @param {File} file
   * @param {Object} options
   * @returns {Promise<Blob>}
   */
  async compressImage(file, options = {}) {
    // TODO: Implement image compression
    // Using library like browser-image-compression
    return file
  }
}

export default imageUploadService
```

**Usage:**
```vue
<script setup>
import { ref } from 'vue'
import imageUploadService from '@/services/storage/imageUpload'

const selectedFile = ref(null)
const previewUrl = ref(null)
const error = ref(null)

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  
  // Validate
  const validation = imageUploadService.validateImage(file)
  if (!validation.valid) {
    error.value = validation.error
    return
  }
  
  // Create preview
  selectedFile.value = file
  previewUrl.value = imageUploadService.createPreviewUrl(file)
}
</script>

<template>
  <input type="file" @change="handleFileSelect">
  <img v-if="previewUrl" :src="previewUrl">
  <p v-if="error" class="error">{{ error }}</p>
</template>
```

---

## 🔐 Authentication Flow with Services

**Complete auth flow:**

```
1. User clicks "Sign in with Google"
   ↓
2. authService.signInWithGoogle() (Firebase)
   → Returns Firebase ID token
   ↓
3. authApiService.verifyFirebaseToken(token) (Backend)
   → Backend verifies token
   → Returns JWT token
   ↓
4. Save JWT to localStorage
   ↓
5. axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`
   ↓
6. All subsequent API calls include JWT automatically
```

**Implementation:**
```javascript
// composables/useAuth.js
import authService from '@/services/firebase/auth'
import authApiService from '@/services/api/auth'
import axios from '@/config/axios'

export function useAuth() {
  const login = async () => {
    // Step 1: Firebase sign in
    const result = await authService.signInWithGoogle()
    
    // Step 2: Get Firebase ID token
    const firebaseToken = await result.user.getIdToken()
    
    // Step 3: Exchange for backend JWT
    const { token: jwt, user } = await authApiService.verifyFirebaseToken(firebaseToken)
    
    // Step 4: Save JWT
    localStorage.setItem('jwt', jwt)
    
    // Step 5: Set axios default header
    axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`
    
    return user
  }
  
  return { login }
}
```

---

## 🎓 Learning Exercise

**Task:** Buat `contactsService.js`

Requirements:
1. CRUD operations: `getAll()`, `getById(id)`, `create(data)`, `update(id, data)`, `delete(id)`
2. Search: `search(query)`
3. Export as default object
4. Use axios instance dari `@/config/axios`
5. JSDoc comments untuk documentation

**Example data structure:**
```javascript
{
  id: '123',
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+62812345678',
  notes: 'Interested in landscape paintings',
  tags: ['buyer', 'collector']
}
```

---

## 📖 Reference

- **Axios Docs:** https://axios-http.com/docs/intro
- **Firebase Auth:** https://firebase.google.com/docs/auth/web/start
- **Fetch API:** https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API

---

**Next:** Baca README di `router/`, `utils/`, `config/`
