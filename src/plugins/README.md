# Plugins Folder (`src/plugins/`)

**Plugins** adalah Vue plugins untuk extend functionality (future use).

---

## 🎯 Apa itu Vue Plugin?

**Plugin** = Object/function yang add global functionality ke Vue app.

**Use cases:**
- Global components (install globally)
- Global properties ($toast, $api)
- Global directives

---

## 📝 Example: Toast Plugin

```javascript
// plugins/toast.js
import { createApp } from 'vue'
import ToastComponent from '@/components/feedback/Toast.vue'

export default {
  install(app) {
    const toastContainer = document.createElement('div')
    toastContainer.id = 'toast-container'
    document.body.appendChild(toastContainer)

    const toastInstance = createApp(ToastComponent).mount(toastContainer)

    app.config.globalProperties.$toast = {
      success(message) {
        toastInstance.show(message, 'success')
      },
      error(message) {
        toastInstance.show(message, 'error')
      },
      info(message) {
        toastInstance.show(message, 'info')
      }
    }
  }
}
```

**Install dalam `main.js`:**
```javascript
import toastPlugin from '@/plugins/toast'

app.use(toastPlugin)
```

**Usage:**
```vue
<script setup>
import { getCurrentInstance } from 'vue'

const { proxy } = getCurrentInstance()

const handleSuccess = () => {
  proxy.$toast.success('Artwork created!')
}
</script>
```

---

## 📖 Reference

- **Vue Plugins:** https://vuejs.org/guide/reusability/plugins.html

---

**Current status:** Not yet implemented. Use composables instead (`useToast`).
