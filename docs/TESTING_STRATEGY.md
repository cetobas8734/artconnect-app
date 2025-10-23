# Testing Strategy – ArtConnect

## Overview

Comprehensive testing strategy untuk ArtConnect menggunakan **Vitest** + **Vue Test Utils** + **happy-dom**. Dokumen ini covers test types, patterns, organization, dan best practices.

**Goals:**
- Catch bugs early dalam development
- Enable confident refactoring
- Document expected behavior
- Maintain code quality over time

---

## Testing Stack

### Tools & Libraries

| Tool | Version | Purpose |
|------|---------|---------|
| **Vitest** | 2.1.3 | Modern test runner (fast, Vite-native) |
| **@vue/test-utils** | 2.4.6 | Official Vue component testing library |
| **happy-dom** | 15.11.7 | Lightweight DOM implementation (faster than jsdom) |

### Why Vitest?

✅ **Vite-native:** Zero config dengan Vite project  
✅ **Fast:** Parallel execution, smart caching  
✅ **Compatible:** Jest-like API (easy migration)  
✅ **ESM support:** Native ES modules  
✅ **Watch mode:** Instant feedback  

---

## Test Types

### 1. Unit Tests

**What:** Test individual functions, utilities, helpers dalam isolation.

**When to write:**
- Pure functions (utils)
- Business logic
- Validation rules
- Data transformations

**Example:**

```javascript
// src/utils/date.js
export function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

// tests/unit/utils/date.spec.js
import { describe, it, expect } from 'vitest'
import { formatDate } from '@/utils/date'

describe('formatDate', () => {
  it('formats ISO date to Indonesian locale', () => {
    const result = formatDate('2024-01-15')
    expect(result).toBe('15 Januari 2024')
  })
  
  it('handles invalid date gracefully', () => {
    const result = formatDate('invalid-date')
    expect(result).toBe('Invalid Date')
  })
})
```

### 2. Component Tests

**What:** Test Vue components (rendering, user interaction, props, emits).

**When to write:**
- Every presentational component
- Form components
- Interactive components (buttons, modals)

**Example:**

```javascript
// src/modules/shared/components/BaseButton.vue
<script setup>
defineProps({
  label: { type: String, required: true },
  disabled: { type: Boolean, default: false }
})
const emit = defineEmits(['click'])
</script>

<template>
  <button 
    :disabled="disabled"
    @click="emit('click')"
    data-test="base-button"
  >
    {{ label }}
  </button>
</template>

// tests/components/shared/BaseButton.spec.js
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseButton from '@/modules/shared/components/BaseButton.vue'

describe('BaseButton', () => {
  it('renders label prop', () => {
    const wrapper = mount(BaseButton, {
      props: { label: 'Click Me' }
    })
    expect(wrapper.text()).toBe('Click Me')
  })
  
  it('emits click event when clicked', async () => {
    const wrapper = mount(BaseButton, {
      props: { label: 'Click Me' }
    })
    
    await wrapper.find('[data-test="base-button"]').trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })
  
  it('disables button when disabled prop is true', () => {
    const wrapper = mount(BaseButton, {
      props: { label: 'Click Me', disabled: true }
    })
    expect(wrapper.find('button').element.disabled).toBe(true)
  })
})
```

### 3. Integration Tests

**What:** Test multiple components working together atau component + composable + service.

**When to write:**
- Complex user flows
- Multi-step forms
- Component composition scenarios

**Example:**

```javascript
// Integration test: LoginForm + useAuth + authService
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import LoginForm from '@/modules/auth/components/LoginForm.vue'
import { authService } from '@/modules/auth/services/authService'

// Mock authService
vi.mock('@/modules/auth/services/authService', () => ({
  authService: {
    login: vi.fn()
  }
}))

describe('LoginForm Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  
  it('submits login form and handles success', async () => {
    authService.login.mockResolvedValue({ uid: '123', email: 'test@example.com' })
    
    const wrapper = mount(LoginForm)
    
    await wrapper.find('[data-test="email-input"]').setValue('test@example.com')
    await wrapper.find('[data-test="password-input"]').setValue('password123')
    await wrapper.find('[data-test="submit-button"]').trigger('click')
    
    await flushPromises()  // Wait for async operations
    
    expect(authService.login).toHaveBeenCalledWith('test@example.com', 'password123')
    expect(wrapper.emitted('login-success')).toBeTruthy()
  })
})
```

### 4. Snapshot Tests (Optional)

**What:** Capture component output dan compare jika changes.

**When to write:**
- Complex component structures
- Ensure UI doesn't change unexpectedly

**Example:**

```javascript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ArtworkCard from '@/modules/artworks/components/ArtworkCard.vue'

describe('ArtworkCard', () => {
  it('matches snapshot', () => {
    const wrapper = mount(ArtworkCard, {
      props: {
        artwork: {
          id: '1',
          title: 'Sunset',
          artist: 'John Doe',
          price: 1500000
        }
      }
    })
    expect(wrapper.html()).toMatchSnapshot()
  })
})
```

---

## Test File Organization

Mirror `src/` structure dalam `tests/` folder:

```
tests/
├── unit/                       # Pure function tests
│   ├── utils/
│   │   ├── date.spec.js
│   │   ├── currency.spec.js
│   │   └── validation.spec.js
│   └── services/
│       ├── artworkService.spec.js
│       └── authService.spec.js
│
├── components/                 # Component tests
│   ├── shared/
│   │   ├── BaseButton.spec.js
│   │   ├── BaseInput.spec.js
│   │   └── BaseModal.spec.js
│   ├── auth/
│   │   ├── LoginForm.spec.js
│   │   └── RegisterForm.spec.js
│   ├── artworks/
│   │   ├── ArtworkCard.spec.js
│   │   ├── ArtworkGrid.spec.js
│   │   └── ArtworkUploadForm.spec.js
│   ├── contacts/
│   │   └── ContactCard.spec.js
│   └── pipeline/
│       └── KanbanBoard.spec.js
│
└── integration/                # Integration tests
    ├── auth-flow.spec.js
    ├── artwork-upload-flow.spec.js
    └── pipeline-drag-drop.spec.js
```

**Naming convention:** `<SourceFileName>.spec.js`

---

## Writing Tests

### Test Structure (AAA Pattern)

```javascript
describe('Component/Function Name', () => {
  it('should do something specific', () => {
    // 1. ARRANGE: Setup test data & conditions
    const input = 'test-value'
    const expected = 'expected-result'
    
    // 2. ACT: Execute the code under test
    const result = functionUnderTest(input)
    
    // 3. ASSERT: Verify the result
    expect(result).toBe(expected)
  })
})
```

### Good Test Practices

#### ✅ DO:

```javascript
// Clear, descriptive test names
it('should format date to Indonesian locale', () => {})
it('should disable submit button when form is invalid', () => {})
it('should emit update event when save button clicked', () => {})

// Test one thing per test
it('should validate email format', () => {
  expect(isValidEmail('test@example.com')).toBe(true)
})

// Use data-test attributes for selectors
const button = wrapper.find('[data-test="submit-button"]')

// Async tests dengan async/await
it('should fetch artworks on mount', async () => {
  const wrapper = mount(ArtworkList)
  await flushPromises()
  expect(wrapper.vm.artworks).toHaveLength(5)
})
```

#### ❌ DON'T:

```javascript
// Vague test names
it('should work', () => {})
it('test button', () => {})

// Test multiple things in one test (hard to debug)
it('should handle form submission', () => {
  // Tests validation, submission, success, error handling all together
})

// Use fragile selectors (class/tag names)
const button = wrapper.find('.btn-primary')  // Bad: CSS class might change
const button = wrapper.find('button')        // Bad: Too generic

// Forget to wait for async operations
it('should fetch data', () => {
  const wrapper = mount(Component)
  expect(wrapper.vm.data).toBeDefined()  // Fails - data not loaded yet
})
```

---

## Mocking Firebase SDK

Firebase Auth calls should be mocked dalam tests (no real auth calls).

**Note:** ArtConnect uses **Firebase Auth only** (Google Sign-In). Business data (artworks, contacts, pipeline) is handled by **custom REST API backend** (separate project).

### Mock Strategy 1: vi.mock() (Module-level)

```javascript
// tests/unit/services/authService.spec.js
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { authService } from '@/modules/auth/services/authService'

// Mock Firebase Auth methods
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  signInWithPopup: vi.fn(),
  GoogleAuthProvider: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChanged: vi.fn()
}))

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  
  it('signs in with Google', async () => {
    const { signInWithPopup } = await import('firebase/auth')
    signInWithPopup.mockResolvedValue({
      user: { uid: 'mock-uid', email: 'test@example.com' }
    })
    
    const result = await authService.signInWithGoogle()
    
    expect(signInWithPopup).toHaveBeenCalled()
    expect(result.user.email).toBe('test@example.com')
  })
})
```

---

## Mocking Backend REST API

For business data operations, mock **Axios/Fetch** calls to backend API.

### Mock Strategy: Axios Mocking

```javascript
// tests/unit/services/artworkService.spec.js
import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { artworkService } from '@/modules/artworks/services/artworkService'

// Mock axios
vi.mock('axios')

describe('artworkService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  
  it('fetches artworks from API', async () => {
    const mockArtworks = [
      { id: 1, title: 'Artwork 1', price: 1500000 },
      { id: 2, title: 'Artwork 2', price: 2000000 }
    ]
    
    axios.get.mockResolvedValue({ data: mockArtworks })
    
    const result = await artworkService.fetchArtworks()
    
    expect(axios.get).toHaveBeenCalledWith('/api/artworks')
    expect(result).toEqual(mockArtworks)
  })
  
  it('creates artwork via API', async () => {
    const artworkData = { title: 'New Artwork', price: 1500000 }
    const mockResponse = { id: 3, ...artworkData }
    
    axios.post.mockResolvedValue({ data: mockResponse })
    
    const result = await artworkService.createArtwork(artworkData)
    
    expect(axios.post).toHaveBeenCalledWith('/api/artworks', artworkData)
    expect(result.id).toBe(3)
  })
})
```

### Mock Strategy 2: MSW (Mock Service Worker) - Advanced

For integration tests, use MSW untuk mock HTTP requests:

```javascript
// tests/mocks/handlers.js
import { http, HttpResponse } from 'msw'

export const handlers = [
  // Mock GET /api/artworks
  http.get('/api/artworks', () => {
    return HttpResponse.json([
      { id: 1, title: 'Artwork 1', price: 1500000 },
      { id: 2, title: 'Artwork 2', price: 2000000 }
    ])
  }),
  
  // Mock POST /api/artworks
  http.post('/api/artworks', async ({ request }) => {
    const artwork = await request.json()
    return HttpResponse.json({ id: 3, ...artwork }, { status: 201 })
  })
]

// tests/mocks/server.js
import { setupServer } from 'msw/node'
import { handlers } from './handlers'

export const server = setupServer(...handlers)
```

**Setup dalam test:**

```javascript
// vitest.setup.js
import { beforeAll, afterEach, afterAll } from 'vitest'
import { server } from './tests/mocks/server'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

---

## Component Testing Patterns

### Testing Props

```javascript
it('renders artwork title from props', () => {
  const wrapper = mount(ArtworkCard, {
    props: {
      artwork: { title: 'Sunset', price: 1500000 }
    }
  })
  
  expect(wrapper.text()).toContain('Sunset')
})

it('validates required props', () => {
  // Vue Test Utils will warn if required prop missing
  const wrapper = mount(ArtworkCard, {
    props: {}  // Missing required 'artwork' prop → console warning
  })
})
```

### Testing Events (Emits)

```javascript
it('emits delete event when delete button clicked', async () => {
  const wrapper = mount(ArtworkCard, {
    props: { artwork: { id: '1', title: 'Test' } }
  })
  
  await wrapper.find('[data-test="delete-button"]').trigger('click')
  
  expect(wrapper.emitted('delete')).toHaveLength(1)
  expect(wrapper.emitted('delete')[0]).toEqual(['1'])  // Payload
})
```

### Testing Computed Properties

```javascript
it('computes formatted price correctly', () => {
  const wrapper = mount(ArtworkCard, {
    props: {
      artwork: { title: 'Test', price: 1500000 }
    }
  })
  
  // Access computed property
  expect(wrapper.vm.formattedPrice).toBe('Rp 1.500.000')
})
```

### Testing Conditional Rendering

```javascript
it('shows loading spinner when isLoading is true', () => {
  const wrapper = mount(ArtworkList, {
    data() {
      return { isLoading: true }
    }
  })
  
  expect(wrapper.find('[data-test="loading-spinner"]').exists()).toBe(true)
  expect(wrapper.find('[data-test="artwork-grid"]').exists()).toBe(false)
})

it('shows artwork grid when isLoading is false', () => {
  const wrapper = mount(ArtworkList, {
    data() {
      return { isLoading: false, artworks: [...] }
    }
  })
  
  expect(wrapper.find('[data-test="loading-spinner"]').exists()).toBe(false)
  expect(wrapper.find('[data-test="artwork-grid"]').exists()).toBe(true)
})
```

### Testing User Input

```javascript
it('updates email field when user types', async () => {
  const wrapper = mount(LoginForm)
  const emailInput = wrapper.find('[data-test="email-input"]')
  
  await emailInput.setValue('test@example.com')
  
  expect(wrapper.vm.email).toBe('test@example.com')
})
```

### Testing Form Submission

```javascript
it('validates form before submission', async () => {
  const wrapper = mount(LoginForm)
  
  // Leave email empty
  await wrapper.find('[data-test="password-input"]').setValue('password')
  await wrapper.find('[data-test="submit-button"]').trigger('click')
  
  expect(wrapper.find('[data-test="email-error"]').text()).toBe('Email is required')
  expect(wrapper.emitted('submit')).toBeUndefined()  // Not submitted
})
```

### Testing Slots

```javascript
// BaseModal.vue has default slot
it('renders slot content', () => {
  const wrapper = mount(BaseModal, {
    slots: {
      default: '<p>Modal Content</p>'
    }
  })
  
  expect(wrapper.html()).toContain('<p>Modal Content</p>')
})

// Named slots
it('renders header and footer slots', () => {
  const wrapper = mount(BaseModal, {
    slots: {
      header: '<h2>Title</h2>',
      default: '<p>Body</p>',
      footer: '<button>Close</button>'
    }
  })
  
  expect(wrapper.html()).toContain('<h2>Title</h2>')
  expect(wrapper.html()).toContain('<button>Close</button>')
})
```

---

## Coverage Goals

### Coverage Targets

| Metric | Target | Critical Areas |
|--------|--------|----------------|
| **Statements** | 80% | Utilities, services: 90%+ |
| **Branches** | 75% | Validation logic: 85%+ |
| **Functions** | 80% | Core business logic: 90%+ |
| **Lines** | 80% | - |

**Already configured dalam `vite.config.js`:**

```javascript
test: {
  coverage: {
    provider: 'v8',
    reporter: ['text', 'json', 'html'],
    thresholds: {
      statements: 80,
      branches: 75,
      functions: 80,
      lines: 80
    }
  }
}
```

### Running Coverage

```powershell
# Generate coverage report
npm run coverage

# Output:
# 1. Terminal summary
# 2. HTML report in coverage/ folder
# 3. JSON report (CI integration)
```

**View HTML report:**
```powershell
start coverage\index.html  # Opens in browser
```

### Interpreting Coverage

**Coverage types:**

- **Statements:** Individual instructions executed
- **Branches:** if/else paths executed
- **Functions:** Functions called
- **Lines:** Lines of code executed

**Example:**

```javascript
function calculateDiscount(price, isMember) {
  if (isMember) {       // Branch 1
    return price * 0.9  // Statement 1
  } else {              // Branch 2
    return price        // Statement 2
  }
}

// Test with isMember=true only:
// ✅ Statements: 50% (1/2 statements)
// ✅ Branches: 50% (1/2 branches)
// ✅ Functions: 100% (1/1 function)
// ❌ Need test with isMember=false for full coverage
```

---

## Running Tests

### CLI Commands

```powershell
# Run all tests (single run)
npm run test

# Watch mode (re-run on file changes)
npm run test:watch

# Coverage report
npm run coverage

# Run specific test file
npm run test -- artworkService.spec.js

# Run tests matching pattern
npm run test -- --grep "ArtworkCard"

# Run with UI (interactive browser UI)
npx vitest --ui
```

### Watch Mode Workflow

```powershell
npm run test:watch

# Vitest will:
# 1. Run all tests initially
# 2. Watch for file changes
# 3. Re-run related tests automatically
# 4. Show instant feedback
```

**Interactive commands dalam watch mode:**
- Press `a` to run all tests
- Press `f` to run failed tests only
- Press `t` to filter by test name
- Press `q` to quit

---

## Test-Driven Development (TDD)

### TDD Workflow (Red-Green-Refactor)

```
1. 🔴 RED: Write failing test first
2. 🟢 GREEN: Write minimal code to pass
3. 🔵 REFACTOR: Clean up code
4. Repeat
```

**Example:**

```javascript
// 1. 🔴 RED: Write test (fails - function doesn't exist)
describe('formatCurrency', () => {
  it('formats number to IDR currency', () => {
    expect(formatCurrency(1500000)).toBe('Rp 1.500.000')
  })
})

// 2. 🟢 GREEN: Implement function (test passes)
export function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount)
}

// 3. 🔵 REFACTOR: Improve implementation
export function formatCurrency(amount, currency = 'IDR') {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0
  }).format(amount)
}

// 4. Add more tests for edge cases
it('handles zero amount', () => {
  expect(formatCurrency(0)).toBe('Rp 0')
})
```

---

## Common Testing Pitfalls

### ❌ Pitfall 1: Not Waiting for Async

```javascript
// ❌ BAD: Doesn't wait for async operations
it('fetches artworks', () => {
  const wrapper = mount(ArtworkList)
  expect(wrapper.vm.artworks).toHaveLength(5)  // FAILS - not loaded yet
})

// ✅ GOOD: Wait for async
it('fetches artworks', async () => {
  const wrapper = mount(ArtworkList)
  await flushPromises()  // Wait for all promises
  expect(wrapper.vm.artworks).toHaveLength(5)
})
```

### ❌ Pitfall 2: Testing Implementation Details

```javascript
// ❌ BAD: Tests internal state/methods
it('updates internal counter', () => {
  const wrapper = mount(Component)
  wrapper.vm._internalCounter = 5  // Testing private implementation
  expect(wrapper.vm._internalCounter).toBe(5)
})

// ✅ GOOD: Tests observable behavior
it('increments counter when button clicked', async () => {
  const wrapper = mount(Component)
  await wrapper.find('[data-test="increment-button"]').trigger('click')
  expect(wrapper.text()).toContain('Count: 1')  // Test what user sees
})
```

### ❌ Pitfall 3: Brittle Selectors

```javascript
// ❌ BAD: CSS class (can change)
wrapper.find('.btn-primary')

// ❌ BAD: Tag name (too generic)
wrapper.find('button')

// ✅ GOOD: data-test attribute (stable, semantic)
wrapper.find('[data-test="submit-button"]')
```

### ❌ Pitfall 4: Not Cleaning Up Mocks

```javascript
// ❌ BAD: Mocks leak between tests
describe('Test Suite', () => {
  it('test 1', () => {
    vi.fn().mockReturnValue('value-1')
    // ... test
  })
  
  it('test 2', () => {
    // Mock from test 1 still active - unexpected behavior
  })
})

// ✅ GOOD: Clean up after each test
describe('Test Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks()  // Reset all mocks
  })
  
  it('test 1', () => { ... })
  it('test 2', () => { ... })
})
```

---

## Test Checklist

Untuk setiap feature/component:

- [ ] **Unit tests** for utilities/helpers
- [ ] **Component test** for rendering
- [ ] **Component test** for user interactions
- [ ] **Component test** for props validation
- [ ] **Component test** for event emissions
- [ ] **Integration test** (if multi-component flow)
- [ ] **Mock external dependencies** (Firebase, APIs)
- [ ] **Coverage >80%** untuk critical paths
- [ ] **All tests passing** before merging PR

---

## Quick Reference

### Vitest API

```javascript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

describe('Test Suite Name', () => {
  beforeEach(() => {
    // Runs before each test
  })
  
  afterEach(() => {
    // Runs after each test
  })
  
  it('test case name', () => {
    expect(actual).toBe(expected)
    expect(value).toEqual(object)
    expect(fn).toHaveBeenCalled()
    expect(wrapper.emitted('event')).toBeTruthy()
  })
})
```

### Vue Test Utils API

```javascript
import { mount, shallowMount } from '@vue/test-utils'

const wrapper = mount(Component, {
  props: { ... },
  data() { return { ... } },
  slots: { default: '...' },
  global: {
    mocks: { $route: ... },
    stubs: { RouterLink: true }
  }
})

wrapper.find('[data-test="button"]')  // Find element
wrapper.findAll('.item')              // Find all elements
wrapper.text()                        // Get text content
wrapper.html()                        // Get HTML
wrapper.vm.someProperty              // Access component instance
wrapper.emitted('event')              // Check emitted events
wrapper.trigger('click')              // Trigger event (returns Promise)
wrapper.setValue('value')            // Set input value (returns Promise)
```

---

**Document Version:** 1.0  
**Last Updated:** [Date]  
**Owner:** Development Team  
**Next Review:** After Sprint 3 (adjust strategy based on learnings)
