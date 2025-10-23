# Config Folder (`src/config/`)

**Config** adalah folder untuk **konfigurasi external libraries** dan services (Firebase, Axios, dll).

---

## 🎯 Purpose

Centralized configuration untuk:
- Initialize external SDKs (Firebase)
- Configure HTTP clients (Axios)
- Setup interceptors
- Load environment variables

**Benefit:**
- Single source of truth
- Easy to modify settings
- Reusable configured instances

---

## 📂 File Structure

```
config/
├── firebase.js         # Firebase SDK initialization
└── axios.js            # Axios instance configuration
```

---

## 📝 Configuration Files

### `firebase.js` - Firebase Configuration

```javascript
// config/firebase.js
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

// Validate config
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  throw new Error('Missing Firebase configuration. Check your .env.local file.')
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize services
export const auth = getAuth(app)

// Export app (if needed)
export default app
```

**Usage:**
```javascript
import { auth } from '@/config/firebase'
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'

const provider = new GoogleAuthProvider()
const result = await signInWithPopup(auth, provider)
```

---

### `axios.js` - Axios Instance Configuration

```javascript
// config/axios.js
import axios from 'axios'

// Create axios instance
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 15000, // 15 seconds
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor (add JWT token)
instance.interceptors.request.use(
  (config) => {
    // Get JWT token from localStorage
    const token = localStorage.getItem('jwt')
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor (handle errors globally)
instance.interceptors.response.use(
  (response) => {
    // Success - just return response
    return response
  },
  (error) => {
    // Handle errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response
      
      switch (status) {
        case 401:
          // Unauthorized - token expired or invalid
          console.error('Unauthorized. Redirecting to login...')
          localStorage.removeItem('jwt')
          window.location.href = '/login'
          break
          
        case 403:
          // Forbidden - no permission
          console.error('Forbidden:', data.message)
          break
          
        case 404:
          // Not found
          console.error('Resource not found:', data.message)
          break
          
        case 422:
          // Validation error
          console.error('Validation error:', data.errors)
          break
          
        case 500:
          // Server error
          console.error('Server error:', data.message)
          break
          
        default:
          console.error('API error:', data.message)
      }
    } else if (error.request) {
      // Request made but no response (network error)
      console.error('Network error. Please check your connection.')
    } else {
      // Something else happened
      console.error('Request error:', error.message)
    }
    
    return Promise.reject(error)
  }
)

export default instance
```

**Usage:**
```javascript
import axios from '@/config/axios'

// Automatically includes JWT token + baseURL
const artworks = await axios.get('/artworks')
const artwork = await axios.post('/artworks', data)
```

---

## ✅ Best Practices

### 1. **Load from Environment Variables**

```javascript
// ✅ Good - Load from .env.local
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

// ❌ Bad - Hardcoded (security risk)
const firebaseConfig = {
  apiKey: "AIzaSyAbc123...",
  authDomain: "myapp.firebaseapp.com",
  // ...
}
```

---

### 2. **Validate Configuration**

```javascript
// Validate required config
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_API_BASE_URL'
]

requiredEnvVars.forEach(varName => {
  if (!import.meta.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`)
  }
})
```

---

### 3. **Export Configured Instances**

```javascript
// ❌ Bad - Export raw imports
export { initializeApp } from 'firebase/app'

// ✅ Good - Export configured instance
const app = initializeApp(config)
export default app
```

---

### 4. **Use Interceptors for Cross-Cutting Concerns**

```javascript
// Request interceptor - Add auth token
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('jwt')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor - Handle errors
axios.interceptors.response.use(
  response => response,
  error => {
    // Global error handling
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
```

---

## 🔐 Environment Variables Setup

### `.env.local` (Gitignored)

```bash
# Firebase Authentication
VITE_FIREBASE_API_KEY=AIzaSyAbc123def456...
VITE_FIREBASE_AUTH_DOMAIN=artconnect-dev.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=artconnect-dev
VITE_FIREBASE_APP_ID=1:123456789:web:abc123def456

# Backend API
VITE_API_BASE_URL=http://localhost:3000/api
```

### `.env.production` (For Production Build)

```bash
# Firebase Authentication (Production)
VITE_FIREBASE_API_KEY=AIzaSyXyz789...
VITE_FIREBASE_AUTH_DOMAIN=artconnect-prod.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=artconnect-prod
VITE_FIREBASE_APP_ID=1:987654321:web:xyz789

# Backend API (Production)
VITE_API_BASE_URL=https://api.artconnect.com
```

---

## 📖 Advanced Patterns

### Pattern 1: Axios with Toast Notifications

```javascript
// config/axios.js
import axios from 'axios'
import { useToast } from '@/composables/useToast'

const instance = axios.create({ /* ... */ })

// Response interceptor with toast
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const toast = useToast()
    
    if (error.response) {
      const { status, data } = error.response
      
      switch (status) {
        case 401:
          toast.error('Session expired. Please login again.')
          break
        case 403:
          toast.error('You do not have permission.')
          break
        case 404:
          toast.error('Resource not found.')
          break
        case 500:
          toast.error('Server error. Please try again later.')
          break
        default:
          toast.error(data.message || 'An error occurred.')
      }
    } else if (error.request) {
      toast.error('Network error. Check your connection.')
    }
    
    return Promise.reject(error)
  }
)

export default instance
```

---

### Pattern 2: Request Logging (Development Only)

```javascript
// config/axios.js
const instance = axios.create({ /* ... */ })

// Log requests in development
if (import.meta.env.DEV) {
  instance.interceptors.request.use(config => {
    console.log(`[API Request] ${config.method.toUpperCase()} ${config.url}`, config.data)
    return config
  })
  
  instance.interceptors.response.use(
    response => {
      console.log(`[API Response] ${response.config.url}`, response.data)
      return response
    },
    error => {
      console.error(`[API Error] ${error.config?.url}`, error.response?.data)
      return Promise.reject(error)
    }
  )
}
```

---

## 🎓 Learning Exercise

**Task:** Complete config setup

Requirements:
1. Create `config/firebase.js`:
   - Load config from env vars
   - Initialize Firebase app
   - Export `auth` instance
   - Add config validation
2. Create `config/axios.js`:
   - Create instance dengan baseURL
   - Add request interceptor (JWT token)
   - Add response interceptor (401 redirect)
3. Test by making API call from component

---

## 📖 Reference

- **Vite Env Variables:** https://vitejs.dev/guide/env-and-mode.html
- **Axios Interceptors:** https://axios-http.com/docs/interceptors
- **Firebase Setup:** https://firebase.google.com/docs/web/setup

---

**Next:** Baca README di `layouts/`
