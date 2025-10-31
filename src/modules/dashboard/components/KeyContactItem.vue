<template>
  <li class="flex items-center py-2 space-x-3">
    <router-link
      :to="{ name: 'ContactDetail', params: { id: contactId } }"
      class="flex items-center space-x-3 group"
    >
      <img
        :src="avatar || defaultAvatar"
        :alt="name"
        class="flex-shrink-0 object-cover w-10 h-10 transition-opacity rounded-full group-hover:opacity-80"
      />

      <p
        class="text-sm font-medium text-gray-900 truncate group-hover:text-indigo-600"
      >
        {{ name }}
      </p>
    </router-link>
  </li>
</template>

<script setup>
const defaultAvatar =
  "data:image/svg+xml;base64,PHNnZyBmaWxsPSIjYmJiYmJiIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zz48cGF0aCBkPSJNMTEgMiBDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDExIDJ6bTAgM2MxLjY2IDAgMyAxLjM0IDMgM3MtMS4zNCAzLTMgMy0zLTEuMzQtMy0zIDEuMzQtMyAzLTN6bTAgMTRjLTIuNjcgMC04IDEuMzQtOCA0djJoMTZjMC0uNjYtMi42Ny00LTgtNHoiLz48L3N2Z3E+";

defineProps({
  avatar: String,
  name: String,
  contactId: String,
});
</script>
