# Directives Folder (`src/directives/`)

**Directives** adalah custom Vue directives untuk DOM manipulation (future use).

---

## 🎯 Apa itu Custom Directive?

**Directive** = Special attribute yang manipulate DOM secara langsung (contoh: `v-if`, `v-for`, `v-model`).

**Custom directive** = Buat directive sendiri untuk reusable DOM manipulation.

---

## 📝 Example: Click Outside Directive

```javascript
// directives/clickOutside.js
export const clickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = function(event) {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event)
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
}
```

**Usage:**
```vue
<script setup>
import { ref } from 'vue'
import { clickOutside } from '@/directives/clickOutside'

const showDropdown = ref(false)

const closeDropdown = () => {
  showDropdown.value = false
}
</script>

<template>
  <div v-click-outside="closeDropdown">
    <button @click="showDropdown = true">Open</button>
    <div v-if="showDropdown">Dropdown content</div>
  </div>
</template>
```

---

## 📖 Reference

- **Custom Directives:** https://vuejs.org/guide/reusability/custom-directives.html

---

**Current status:** Not yet implemented. Add jika diperlukan.
