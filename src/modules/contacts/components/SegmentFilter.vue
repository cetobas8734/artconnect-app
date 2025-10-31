<template>
  <div
    class="flex px-4 pb-2 -mx-4 space-x-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
  >
    <button
      v-for="segment in segments"
      :key="segment"
      @click="$emit('update:modelValue', segment)"
      :class="[
        modelValue === segment
          ? 'bg-artconnect-soft-green text-white border-artconnect-soft-green' // 🎨 Aktif (Soft Green)
          : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-300', // Inaktif
        'px-4 py-2 rounded-full text-sm font-medium border focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-artconnect-soft-green whitespace-nowrap shadow-sm transition-colors duration-150',
      ]"
    >
      {{ segment }}
    </button>
  </div>
</template>
<script setup>
defineProps({
  segments: { type: Array, required: true },
  modelValue: { type: String, required: true },
});
defineEmits(["update:modelValue"]);
</script>
