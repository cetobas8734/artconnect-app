<template>
  <li class="flex items-start py-2 space-x-3">
    <div class="flex-shrink-0 text-xl pt-0.5">{{ icon || "🔔" }}</div>
    <div class="flex-1 min-w-0">
      <p class="text-sm text-gray-800 truncate">{{ text }}</p>
      <p class="text-xs text-gray-500">{{ time }}</p>
    </div>
  </li>
</template>

<script setup>
defineProps({
  icon: String,
  text: {
    type: String,
    required: true,
  },
  time: String,
});
</script>
<style scoped></style>
