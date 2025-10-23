# Path Aliases Setup – ArtConnect

## Overview

Path aliases memungkinkan imports yang clean dan maintainable dengan absolute paths instead of messy relative paths (`../../../`).

**Configured alias:**
- `@` → `src/`

---

## Why Use Path Aliases?

### ❌ Without Path Aliases (Relative Imports)

```javascript
// Deep nesting nightmare
import BaseButton from '../../../modules/shared/components/BaseButton.vue'
import { useAuth } from '../../../../modules/auth/composables/useAuth'
import { formatDate } from '../../../utils/date'

// Masalah:
// - Hard to read
// - Brittle (breaks jika file moved)
// - Hard to refactor
// - Mental overhead (count ../ levels)
```

### ✅ With Path Aliases (Absolute Imports)

```javascript
// Clean, readable, maintainable
import BaseButton from '@/modules/shared/components/BaseButton.vue'
import { useAuth } from '@/modules/auth/composables/useAuth'
import { formatDate } from '@/utils/date'

// Benefits:
// - Easy to read
// - Refactor-friendly (file location independent)
// - No mental overhead
// - IDE autocomplete friendly
```

---

## Configuration Files

ArtConnect sudah configured dengan path alias `@` dalam 2 files:

### 1. `vite.config.js` (Build Tool)

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  // ... rest of config
})
```

**What it does:**
- Tells Vite to resolve `@` as `src/` directory
- Used during development server (`npm run dev`)
- Used during production build (`npm run build`)
- Works in `.vue` files, `.js` files, dan CSS imports

### 2. `jsconfig.json` (IDE Support)

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "exclude": ["node_modules", "dist"]
}
```

**What it does:**
- Provides IDE autocomplete untuk path alias
- Enables "Go to Definition" (Ctrl+Click) in VS Code
- Helps ESLint resolve imports correctly
- Used by JavaScript language service (IntelliSense)

---

## Usage Examples

### Importing Vue Components

```javascript
// ✅ GOOD: Use @ alias
import App from '@/App.vue'
import BaseButton from '@/modules/shared/components/BaseButton.vue'
import ArtworkCard from '@/modules/artworks/components/ArtworkCard.vue'
import LoginView from '@/modules/auth/views/LoginView.vue'

// ❌ BAD: Relative paths
import App from './App.vue'                    // OK for same folder
import BaseButton from '../../../modules/shared/components/BaseButton.vue'  // Hard to read
import ArtworkCard from '../../artworks/components/ArtworkCard.vue'         // Brittle
```

### Importing Composables

```javascript
// ✅ GOOD
import { useAuth } from '@/modules/auth/composables/useAuth'
import { useArtworks } from '@/modules/artworks/composables/useArtworks'
import { useToast } from '@/modules/shared/composables/useToast'

// ❌ BAD
import { useAuth } from '../auth/composables/useAuth'
import { useArtworks } from './composables/useArtworks'  // Unclear base path
```

### Importing Services

```javascript
// ✅ GOOD
import { artworkService } from '@/modules/artworks/services/artworkService'
import { authService } from '@/modules/auth/services/authService'
import { db, storage } from '@/services/firebase'

// ❌ BAD
import { artworkService } from '../services/artworkService'
import { db } from '../../services/firebase'
```

### Importing Utilities

```javascript
// ✅ GOOD
import { formatDate } from '@/utils/date'
import { formatCurrency } from '@/utils/currency'
import { isValidEmail } from '@/utils/validation'
import { MAX_FILE_SIZE } from '@/utils/constants'

// ❌ BAD
import { formatDate } from '../../../utils/date'
import { MAX_FILE_SIZE } from './utils/constants'  # Unclear where "utils" is
```

### Importing Assets

```javascript
// ✅ GOOD
import logo from '@/assets/images/logo.png'
import heroImage from '@/assets/images/backgrounds/hero.jpg'
import '@/assets/styles/main.css'

// ❌ BAD
import logo from '../assets/images/logo.png'  # Brittle if component moves
```

### In Vue SFC (Single File Components)

```vue
<script setup>
// All imports use @ alias
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '@/modules/shared/components/BaseButton.vue'
import { useArtworks } from '@/modules/artworks/composables/useArtworks'
import { artworkService } from '@/modules/artworks/services/artworkService'
import { formatDate } from '@/utils/date'
import { ARTWORK_STATUS } from '@/utils/constants'

const router = useRouter()
const { artworks, fetchArtworks } = useArtworks()
</script>

<template>
  <BaseButton @click="fetchArtworks">Load Artworks</BaseButton>
</template>

<style scoped>
/* CSS imports also support @ alias */
@import '@/assets/styles/variables.css';
</style>
```

### In CSS/SCSS

```css
/* Import CSS variables */
@import '@/assets/styles/variables.css';

/* Background image */
.hero {
  background-image: url('@/assets/images/backgrounds/hero.jpg');
}

/* Font face */
@font-face {
  font-family: 'CustomFont';
  src: url('@/assets/fonts/CustomFont.woff2') format('woff2');
}
```

---

## When to Use @ Alias vs Relative Imports

### ✅ Use @ Alias When:

```javascript
// 1. Importing from different modules
import { useAuth } from '@/modules/auth/composables/useAuth'

// 2. Importing shared components
import BaseButton from '@/modules/shared/components/BaseButton.vue'

// 3. Importing utilities/services
import { formatDate } from '@/utils/date'
import { db } from '@/services/firebase'

// 4. Importing assets
import logo from '@/assets/images/logo.png'

// 5. Any import requiring ../../ or more
import Something from '@/somewhere/Something.vue'  // Instead of ../../../
```

### ✅ Use Relative Imports When:

```javascript
// 1. Same folder (sibling files)
import ArtworkCard from './ArtworkCard.vue'
import { validateForm } from './validation.js'

// 2. Child components in same module
import ArtworkFilters from './components/ArtworkFilters.vue'

// 3. One level up (parent folder)
import { useArtworks } from '../composables/useArtworks'  // From views/ to composables/
```

**Rule of Thumb:**
- Same folder or 1 level up → Relative import OK
- 2+ levels up (../../) → Use @ alias
- Cross-module imports → Always use @ alias

---

## VS Code Setup (IDE Configuration)

### 1. Auto Import with Path Alias

VS Code should automatically use @ alias when auto-importing.

**Test it:**
1. Start typing component name: `<BaseButton`
2. Accept autocomplete suggestion
3. VS Code should insert: `import BaseButton from '@/modules/shared/components/BaseButton.vue'`

**If not working:**
- Ensure `jsconfig.json` exists di root project
- Restart VS Code
- Check VS Code setting: `"javascript.preferences.importModuleSpecifier": "non-relative"`

### 2. Go to Definition (Ctrl+Click)

Dengan `jsconfig.json`, Ctrl+Click pada import should jump ke file.

```javascript
import { useAuth } from '@/modules/auth/composables/useAuth'
//                      ↑ Ctrl+Click here → jumps to useAuth.js
```

### 3. File Path Autocomplete

Saat typing path dalam import statement:

```javascript
import Something from '@/mod
//                         ↑ Press Ctrl+Space → suggests folders/files
```

### 4. Recommended VS Code Extensions

Install extensions untuk better experience:

- **Path Intellisense** - Autocompletes file paths
- **Auto Import** - Automatically adds imports
- **Vue - Official (Volar)** - Vue 3 language support
- **ESLint** - Linting dengan alias support

---

## Testing with Path Aliases

Vitest already configured untuk recognize @ alias dalam `vite.config.js`.

### Test File Imports

```javascript
// tests/components/artworks/ArtworkCard.spec.js

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ArtworkCard from '@/modules/artworks/components/ArtworkCard.vue'
import { formatDate } from '@/utils/date'
import { ARTWORK_STATUS } from '@/utils/constants'

describe('ArtworkCard', () => {
  it('renders artwork title', () => {
    const wrapper = mount(ArtworkCard, {
      props: {
        artwork: {
          title: 'Test Artwork',
          status: ARTWORK_STATUS.PUBLISHED
        }
      }
    })
    
    expect(wrapper.text()).toContain('Test Artwork')
  })
})
```

**No additional configuration needed** - Vitest uses Vite config yang sudah include alias resolution.

---

## Troubleshooting

### Issue: Import not resolving (red squiggle in editor)

**Symptoms:**
```javascript
import Something from '@/modules/something/Something.vue'  // Red underline
```

**Solutions:**

1. **Check jsconfig.json exists** di root project
   ```powershell
   ls jsconfig.json  # Should exist
   ```

2. **Restart VS Code**
   - Close and reopen VS Code
   - Or: Ctrl+Shift+P → "Developer: Reload Window"

3. **Check path is correct**
   ```powershell
   ls src\modules\something\Something.vue  # File should exist
   ```

4. **Verify jsconfig.json syntax**
   ```json
   {
     "compilerOptions": {
       "baseUrl": ".",
       "paths": {
         "@/*": ["src/*"]  // Correct syntax
       }
     }
   }
   ```

### Issue: Build fails (Vite error)

**Symptoms:**
```
[vite] Internal server error: Failed to resolve import "@/modules/..."
```

**Solutions:**

1. **Check vite.config.js alias configuration**
   ```javascript
   resolve: {
     alias: {
       '@': fileURLToPath(new URL('./src', import.meta.url))
     }
   }
   ```

2. **Ensure import.meta.url is used** (not __dirname)
   - `import.meta.url` is ESM standard
   - `__dirname` is CommonJS (don't mix)

3. **Check file exists**
   ```powershell
   ls src\modules\auth\composables\useAuth.js  # Should exist
   ```

4. **Clear Vite cache and restart**
   ```powershell
   rm -r node_modules\.vite  # Delete cache
   npm run dev               # Restart dev server
   ```

### Issue: Test fails (Vitest can't resolve @)

**Symptoms:**
```
Error: Cannot find module '@/utils/date'
```

**Solution:**

Vitest should use vite.config.js automatically. Check:

```javascript
// vite.config.js
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  test: {
    // Vitest config
  }
})
```

If still failing, explicitly set test resolve:

```javascript
test: {
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
}
```

### Issue: CSS imports not working

**Symptoms:**
```css
@import '@/assets/styles/variables.css';  /* Not found */
```

**Solution:**

Vite supports @ alias dalam CSS. Ensure:

1. **Use quotes** dalam CSS imports
   ```css
   @import '@/assets/styles/variables.css';  /* Correct */
   @import @/assets/styles/variables.css;    /* Wrong - no quotes */
   ```

2. **Use @ in url() also**
   ```css
   background-image: url('@/assets/images/hero.jpg');  /* Correct */
   background-image: url(@/assets/images/hero.jpg);    /* Wrong */
   ```

---

## Adding More Aliases (Future)

If needed, you can add more aliases beyond `@`:

### Example: Add `~` for assets

```javascript
// vite.config.js
resolve: {
  alias: {
    '@': fileURLToPath(new URL('./src', import.meta.url)),
    '~': fileURLToPath(new URL('./src/assets', import.meta.url))  // New alias
  }
}
```

```json
// jsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "~/*": ["src/assets/*"]  // New alias
    }
  }
}
```

**Usage:**
```javascript
import logo from '~/images/logo.png'  // Instead of @/assets/images/logo.png
```

**Recommendation:** Stick dengan `@` only untuk consistency. Only add aliases jika team agrees dan clear use case exists.

---

## Best Practices

### ✅ DO:

```javascript
// Use @ for cross-module imports
import { useAuth } from '@/modules/auth/composables/useAuth'

// Use @ for utilities
import { formatDate } from '@/utils/date'

// Use @ for shared components
import BaseButton from '@/modules/shared/components/BaseButton.vue'

// Use relative for same-folder imports
import ArtworkCard from './ArtworkCard.vue'
```

### ❌ DON'T:

```javascript
// Don't mix @ and relative unnecessarily
import { useAuth } from '@/modules/auth/composables/useAuth'
import Something from '../components/Something.vue'  // Be consistent

// Don't use @ for same folder (overkill)
import ArtworkCard from '@/modules/artworks/components/ArtworkCard.vue'  // Dalam ArtworkList.vue yang same folder

// Don't use ../../ when @ would be clearer
import { formatDate } from '../../../utils/date'  // Use @ instead
```

---

## Migration Checklist

Jika converting existing codebase dengan relative imports:

- [ ] **Install jsconfig.json** (already done ✅)
- [ ] **Update vite.config.js** (already done ✅)
- [ ] **Restart VS Code** untuk reload config
- [ ] **Find all ../../ imports**
  ```powershell
  # Search for relative imports
  grep -r "from '\.\./\.\." src/
  ```
- [ ] **Convert to @ alias** systematically (one module at a time)
- [ ] **Test build** after each module conversion
  ```powershell
  npm run build
  ```
- [ ] **Test tests** after conversion
  ```powershell
  npm run test
  ```
- [ ] **Update documentation** jika needed

---

## Quick Reference Card

```
┌──────────────────────────────────────────────────────┐
│  Path Alias Quick Reference                          │
├──────────────────────────────────────────────────────┤
│  ALIAS: @  → src/                                    │
│                                                      │
│  EXAMPLES:                                           │
│  @/modules/auth/composables/useAuth                  │
│  @/modules/shared/components/BaseButton.vue          │
│  @/utils/date                                        │
│  @/services/firebase                                 │
│  @/assets/images/logo.png                            │
│                                                      │
│  WHEN TO USE:                                        │
│  ✅ Cross-module imports                             │
│  ✅ Utilities/services                               │
│  ✅ 2+ levels up (../../)                            │
│  ✅ Assets                                           │
│                                                      │
│  WHEN NOT TO USE:                                    │
│  ❌ Same folder (use ./)                             │
│  ❌ One level up in same module (use ../)            │
│                                                      │
│  CONFIGURATION FILES:                                │
│  📄 vite.config.js   - Build tool                    │
│  📄 jsconfig.json    - IDE support                   │
│                                                      │
│  TROUBLESHOOTING:                                    │
│  🔧 Red squiggle? → Restart VS Code                  │
│  🔧 Build fails? → Check vite.config.js              │
│  🔧 Test fails? → Vitest uses vite.config.js         │
└──────────────────────────────────────────────────────┘
```

---

**Document Version:** 1.0  
**Last Updated:** [Date]  
**Owner:** Development Team  
**Status:** Configuration complete ✅
