<template>
  <button
    :type="type"
    :disabled="loading || disabled"
    class="inline-flex items-center justify-center font-medium transition-colors duration-150 border rounded-lg shadow-soft focus:outline-none focus:ring-2 focus:ring-offset-2"
    :class="[
      buttonClass,
      sizeClass,
      { 'opacity-50 cursor-not-allowed': loading || disabled },
    ]"
    @click="$emit('click', $event)"
  >
    <Spinner v-if="loading" class="mr-2 -ml-1" :class="spinnerSizeClass" />
    <slot></slot>
  </button>
</template>

<script setup>
import { computed } from "vue";
import Spinner from "@/components/common/Spinner.vue";

const props = defineProps({
  type: { type: String, default: "button" },
  variant: { type: String, default: "primary" },
  size: { type: String, default: "md" },
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
});
defineEmits(["click"]);

const buttonClass = computed(() => {
  switch (props.variant) {
    case "primary":
      return "text-gray-800 bg-artconnect-soft-green border-artconnect-soft-green hover:bg-artconnect-soft-green/90 focus:ring-artconnect-soft-green shadow-soft";

    case "custom-logout":
      return "text-gray-700 bg-gray-100 hover:bg-gray-200 focus:ring-gray-300 shadow-soft border-none rounded-full px-4 py-1.5";

    case "danger":
      return "text-white bg-red-600 hover:bg-red-700 focus:ring-red-500 shadow-soft";
    case "outline":
      return "text-gray-800 bg-white border-gray-300 hover:bg-gray-50 focus:ring-gray-300 shadow-soft";
    case "soft-green-primary":
      return "text-gray-800 bg-artconnect-soft-green border-artconnect-soft-green hover:bg-artconnect-soft-green/90 focus:ring-artconnect-soft-green shadow-soft";
    case "soft-green-outline":
      return "text-gray-800 bg-white border-gray-300 hover:bg-gray-50 focus:ring-gray-300 shadow-soft";
    case "action-dark":
      return "text-white bg-black border-black hover:bg-gray-800 focus:ring-black shadow-mid";

    default:
      return "text-gray-800 bg-artconnect-soft-green border-artconnect-soft-green hover:bg-artconnect-soft-green/90 focus:ring-artconnect-soft-green shadow-soft";
  }
});

const sizeClass = computed(() => {
  switch (props.size) {
    case "sm":
      return "px-3 py-1.5 text-xs";
    case "lg":
      return "px-6 py-3 text-base";
    default:
      return "px-4 py-2 text-sm";
  }
});
const spinnerSizeClass = computed(() => {
  switch (props.size) {
    case "sm":
      return "h-4 w-4";
    case "lg":
      return "h-6 w-6";
    default:
      return "h-5 w-5";
  }
});
</script>
