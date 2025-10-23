# Utils Folder (`src/utils/`)

**Utils** adalah folder untuk **pure utility functions** (no state, no side effects).

---

## 🎯 Apa itu Utility Function?

**Utility** = Pure function yang melakukan transformasi/calculation tanpa side effects.

**Characteristics:**
- **Pure:** Same input = same output (deterministic)
- **No side effects:** Tidak modify external state
- **Stateless:** Tidak store internal state
- **Reusable:** Can be used anywhere
- **Testable:** Easy to unit test

**Bedanya dengan composable:**
- **Util:** Pure function (no Vue reactivity)
- **Composable:** Stateful logic (uses ref, computed, etc)

---

## 📂 File Structure

```
utils/
├── formatters.js          # Format data (currency, date, text)
├── validators.js          # Input validation functions
├── constants.js           # App-wide constants & enums
├── helpers.js             # Generic helper functions
├── math.js                # Math calculations (future)
└── string.js              # String manipulation (future)
```

---

## ✅ Best Practices

### 1. **Pure Functions Only**

```javascript
// ❌ Jangan begini (impure - modifies external state)
let total = 0
export function addToTotal(amount) {
  total += amount // ❌ Side effect
  return total
}

// ✅ Begini (pure - no side effects)
export function add(a, b) {
  return a + b // ✅ Pure
}
```

---

### 2. **Named Exports (not Default)**

```javascript
// ❌ Jangan begini (default export)
export default function formatCurrency(amount) { /* ... */ }

// ✅ Begini (named exports)
export function formatCurrency(amount) { /* ... */ }
export function formatDate(date) { /* ... */ }
export function formatPercent(value) { /* ... */ }

// Import
import { formatCurrency, formatDate } from '@/utils/formatters'
```

**Benefits:**
- Tree-shaking (unused functions not bundled)
- Clearer imports
- Can import multiple functions at once

---

### 3. **JSDoc Comments**

```javascript
/**
 * Format number as Indonesian Rupiah currency
 * @param {number} amount - Amount to format
 * @param {boolean} [showSymbol=true] - Show Rp symbol
 * @returns {string} Formatted currency string
 * @example
 * formatCurrency(1500000) // "Rp 1.500.000"
 * formatCurrency(1500000, false) // "1.500.000"
 */
export function formatCurrency(amount, showSymbol = true) {
  const formatted = new Intl.NumberFormat('id-ID').format(amount)
  return showSymbol ? `Rp ${formatted}` : formatted
}
```

---

### 4. **Defensive Programming**

```javascript
// Handle edge cases
export function formatCurrency(amount, showSymbol = true) {
  // Validate input
  if (typeof amount !== 'number' || isNaN(amount)) {
    return showSymbol ? 'Rp 0' : '0'
  }
  
  const formatted = new Intl.NumberFormat('id-ID').format(amount)
  return showSymbol ? `Rp ${formatted}` : formatted
}
```

---

## 📝 Utility Examples

### `formatters.js` - Data Formatting

```javascript
// utils/formatters.js

/**
 * Format number as Indonesian Rupiah
 * @param {number} amount
 * @param {boolean} [showSymbol=true]
 * @returns {string}
 */
export function formatCurrency(amount, showSymbol = true) {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return showSymbol ? 'Rp 0' : '0'
  }
  
  const formatted = new Intl.NumberFormat('id-ID').format(amount)
  return showSymbol ? `Rp ${formatted}` : formatted
}

/**
 * Format date to Indonesian format
 * @param {Date|string} date
 * @param {string} [format='long'] - 'short', 'medium', 'long'
 * @returns {string}
 */
export function formatDate(date, format = 'long') {
  if (!date) return '-'
  
  const d = new Date(date)
  if (isNaN(d.getTime())) return '-'
  
  const options = {
    short: { day: '2-digit', month: '2-digit', year: 'numeric' },
    medium: { day: 'numeric', month: 'short', year: 'numeric' },
    long: { day: 'numeric', month: 'long', year: 'numeric' }
  }
  
  return new Intl.DateTimeFormat('id-ID', options[format]).format(d)
}

/**
 * Format number as percentage
 * @param {number} value - Value between 0 and 1
 * @param {number} [decimals=0] - Decimal places
 * @returns {string}
 */
export function formatPercent(value, decimals = 0) {
  if (typeof value !== 'number' || isNaN(value)) return '0%'
  
  const percent = (value * 100).toFixed(decimals)
  return `${percent}%`
}

/**
 * Truncate text to max length
 * @param {string} text
 * @param {number} maxLength
 * @param {string} [suffix='...']
 * @returns {string}
 */
export function truncate(text, maxLength, suffix = '...') {
  if (!text || text.length <= maxLength) return text
  
  return text.substring(0, maxLength - suffix.length) + suffix
}

/**
 * Format file size to human readable
 * @param {number} bytes
 * @returns {string}
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Format phone number to Indonesian format
 * @param {string} phone
 * @returns {string}
 */
export function formatPhone(phone) {
  if (!phone) return '-'
  
  // Remove non-digits
  const cleaned = phone.replace(/\D/g, '')
  
  // Format: +62 812-3456-7890
  if (cleaned.startsWith('62')) {
    const match = cleaned.match(/^62(\d{3})(\d{4})(\d{4})$/)
    if (match) {
      return `+62 ${match[1]}-${match[2]}-${match[3]}`
    }
  }
  
  // Format: 0812-3456-7890
  if (cleaned.startsWith('0')) {
    const match = cleaned.match(/^0(\d{3})(\d{4})(\d{4})$/)
    if (match) {
      return `0${match[1]}-${match[2]}-${match[3]}`
    }
  }
  
  return phone
}
```

**Usage:**
```vue
<script setup>
import { formatCurrency, formatDate, truncate } from '@/utils/formatters'

const artwork = {
  title: 'Very Long Artwork Title That Needs Truncation',
  price: 1500000,
  createdAt: '2025-10-23T10:00:00Z'
}
</script>

<template>
  <div>
    <h3>{{ truncate(artwork.title, 30) }}</h3>
    <p>{{ formatCurrency(artwork.price) }}</p>
    <p>{{ formatDate(artwork.createdAt, 'medium') }}</p>
  </div>
</template>
```

---

### `validators.js` - Input Validation

```javascript
// utils/validators.js

/**
 * Validate email format
 * @param {string} email
 * @returns {boolean}
 */
export function isValidEmail(email) {
  if (!email) return false
  
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

/**
 * Validate Indonesian phone number
 * @param {string} phone
 * @returns {boolean}
 */
export function isValidPhone(phone) {
  if (!phone) return false
  
  // Remove non-digits
  const cleaned = phone.replace(/\D/g, '')
  
  // Must start with 0 or 62, length 10-13
  return /^(0|62)\d{9,11}$/.test(cleaned)
}

/**
 * Validate URL format
 * @param {string} url
 * @returns {boolean}
 */
export function isValidUrl(url) {
  if (!url) return false
  
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Validate password strength
 * @param {string} password
 * @returns {Object} { valid: boolean, errors: string[] }
 */
export function validatePassword(password) {
  const errors = []
  
  if (!password) {
    return { valid: false, errors: ['Password is required'] }
  }
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters')
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain uppercase letter')
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain lowercase letter')
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain number')
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Validate number range
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {boolean}
 */
export function isInRange(value, min, max) {
  return typeof value === 'number' && value >= min && value <= max
}

/**
 * Validate required field
 * @param {*} value
 * @returns {string|null} Error message or null
 */
export function required(value) {
  if (value === null || value === undefined || value === '') {
    return 'This field is required'
  }
  return null
}

/**
 * Validate min length
 * @param {number} length
 * @returns {Function} Validator function
 */
export function minLength(length) {
  return (value) => {
    if (!value || value.length < length) {
      return `Minimum ${length} characters required`
    }
    return null
  }
}

/**
 * Validate max length
 * @param {number} length
 * @returns {Function} Validator function
 */
export function maxLength(length) {
  return (value) => {
    if (value && value.length > length) {
      return `Maximum ${length} characters allowed`
    }
    return null
  }
}
```

**Usage:**
```vue
<script setup>
import { ref, computed } from 'vue'
import { isValidEmail, validatePassword } from '@/utils/validators'

const email = ref('')
const password = ref('')

const emailError = computed(() => {
  if (!email.value) return null
  return isValidEmail(email.value) ? null : 'Invalid email format'
})

const passwordValidation = computed(() => validatePassword(password.value))
</script>

<template>
  <input v-model="email" type="email">
  <span v-if="emailError" class="error">{{ emailError }}</span>
  
  <input v-model="password" type="password">
  <ul v-if="!passwordValidation.valid">
    <li v-for="err in passwordValidation.errors" :key="err" class="error">
      {{ err }}
    </li>
  </ul>
</template>
```

---

### `constants.js` - App Constants

```javascript
// utils/constants.js

/**
 * Artwork medium types
 */
export const ARTWORK_MEDIUMS = [
  { value: 'oil', label: 'Oil Painting' },
  { value: 'acrylic', label: 'Acrylic Painting' },
  { value: 'watercolor', label: 'Watercolor' },
  { value: 'digital', label: 'Digital Art' },
  { value: 'mixed', label: 'Mixed Media' },
  { value: 'sculpture', label: 'Sculpture' },
  { value: 'photography', label: 'Photography' }
]

/**
 * Opportunity stages (sales pipeline)
 */
export const OPPORTUNITY_STAGES = [
  { value: 'lead', label: 'Lead', color: '#e5e7eb' },
  { value: 'qualified', label: 'Qualified', color: '#dbeafe' },
  { value: 'proposal', label: 'Proposal', color: '#fef3c7' },
  { value: 'negotiation', label: 'Negotiation', color: '#fed7aa' },
  { value: 'won', label: 'Won', color: '#bbf7d0' },
  { value: 'lost', label: 'Lost', color: '#fecaca' }
]

/**
 * Contact types
 */
export const CONTACT_TYPES = [
  { value: 'buyer', label: 'Buyer' },
  { value: 'collector', label: 'Collector' },
  { value: 'gallery', label: 'Gallery' },
  { value: 'agent', label: 'Agent' },
  { value: 'other', label: 'Other' }
]

/**
 * File upload limits
 */
export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp']
}

/**
 * Pagination defaults
 */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  PAGE_SIZE_OPTIONS: [12, 24, 48, 96]
}

/**
 * Currency settings
 */
export const CURRENCY = {
  CODE: 'IDR',
  SYMBOL: 'Rp',
  LOCALE: 'id-ID'
}

/**
 * Date format patterns
 */
export const DATE_FORMATS = {
  SHORT: 'DD/MM/YYYY',
  MEDIUM: 'DD MMM YYYY',
  LONG: 'DD MMMM YYYY',
  FULL: 'dddd, DD MMMM YYYY'
}

/**
 * API endpoints (if not using axios instance)
 */
export const API_ENDPOINTS = {
  AUTH: '/auth',
  ARTWORKS: '/artworks',
  CONTACTS: '/contacts',
  OPPORTUNITIES: '/opportunities',
  ANALYTICS: '/analytics'
}
```

**Usage:**
```vue
<script setup>
import { ARTWORK_MEDIUMS, UPLOAD_LIMITS } from '@/utils/constants'

const mediums = ARTWORK_MEDIUMS

const validateFile = (file) => {
  if (file.size > UPLOAD_LIMITS.MAX_FILE_SIZE) {
    alert('File too large')
    return false
  }
  
  if (!UPLOAD_LIMITS.ALLOWED_TYPES.includes(file.type)) {
    alert('Invalid file type')
    return false
  }
  
  return true
}
</script>

<template>
  <select>
    <option v-for="medium in mediums" :key="medium.value" :value="medium.value">
      {{ medium.label }}
    </option>
  </select>
</template>
```

---

### `helpers.js` - Generic Helpers

```javascript
// utils/helpers.js

/**
 * Debounce function execution
 * @param {Function} fn - Function to debounce
 * @param {number} delay - Delay in ms
 * @returns {Function} Debounced function
 */
export function debounce(fn, delay = 300) {
  let timeoutId
  
  return function (...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn.apply(this, args), delay)
  }
}

/**
 * Throttle function execution
 * @param {Function} fn - Function to throttle
 * @param {number} limit - Limit in ms
 * @returns {Function} Throttled function
 */
export function throttle(fn, limit = 300) {
  let inThrottle
  
  return function (...args) {
    if (!inThrottle) {
      fn.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * Deep clone object
 * @param {*} obj - Object to clone
 * @returns {*} Cloned object
 */
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * Sleep/delay function
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise}
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Generate random ID
 * @param {number} [length=8] - ID length
 * @returns {string}
 */
export function generateId(length = 8) {
  return Math.random().toString(36).substring(2, 2 + length)
}

/**
 * Group array by key
 * @param {Array} array - Array to group
 * @param {string} key - Key to group by
 * @returns {Object} Grouped object
 */
export function groupBy(array, key) {
  return array.reduce((result, item) => {
    const group = item[key]
    if (!result[group]) {
      result[group] = []
    }
    result[group].push(item)
    return result
  }, {})
}

/**
 * Sort array by key
 * @param {Array} array - Array to sort
 * @param {string} key - Key to sort by
 * @param {string} [order='asc'] - 'asc' or 'desc'
 * @returns {Array} Sorted array
 */
export function sortBy(array, key, order = 'asc') {
  return [...array].sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]
    
    if (aVal < bVal) return order === 'asc' ? -1 : 1
    if (aVal > bVal) return order === 'asc' ? 1 : -1
    return 0
  })
}
```

---

## 🎓 Learning Exercise

**Task:** Tambahkan utility functions

Requirements:
1. `formatters.js`:
   - `formatRelativeTime(date)` → "2 hours ago", "3 days ago"
   - `formatNumber(num)` → "1,234,567"
2. `validators.js`:
   - `isValidPrice(price)` → price > 0
   - `isValidYear(year)` → year between 1900 - current year
3. `helpers.js`:
   - `capitalize(str)` → "hello" → "Hello"
   - `removeAccents(str)` → Remove Indonesian accents

---

## 📖 Reference

- **Intl API:** https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl
- **Array Methods:** https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array

---

**Next:** Baca README di `config/`, `layouts/`
