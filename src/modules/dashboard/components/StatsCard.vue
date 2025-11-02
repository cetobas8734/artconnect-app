<template>
  <div class="p-5 overflow-hidden bg-white rounded-lg shadow">
    <dl>
      <dt class="text-sm font-medium text-gray-500 truncate">{{ title }}</dt>
      <dd class="flex flex-col mt-1">
        <div class="text-2xl font-bold text-gray-900">{{ value }}</div>

        <div
          v-if="change"
          :class="[
            changeType === 'positive' ? 'text-green-600' : 'text-red-600',
            'text-sm font-medium mt-1',
          ]"
        >
          {{ change }}
        </div>
      </dd>
    </dl>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  value: String,
  change: String,
  changeType: String,
});
</script>
