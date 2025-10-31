<template>
  <div>
    <label
      v-if="label"
      :for="inputId"
      class="block text-sm font-medium text-gray-700"
      >{{ label }}</label
    >
    <div class="relative mt-1 rounded-md">
      <input
        :id="inputId"
        :name="name"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :autocomplete="autocomplete"
        @input="onInput"
        class="block w-full px-3 py-2 placeholder-gray-400 border rounded-lg appearance-none focus:outline-none sm:text-sm"
        :class="[
          error
            ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
            : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500',
          inputClass,
        ]"
        v-bind="$attrs"
      />
      <div
        v-if="error"
        class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
      >
        <svg
          class="w-5 h-5 text-red-500"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
    </div>
    <p v-if="error" class="mt-2 text-sm text-red-600">{{ error }}</p>
  </div>
</template>
<script setup>
import { computed } from "vue";
defineOptions({ inheritAttrs: false });
const props = defineProps({
  modelValue: [String, Number],
  label: String,
  name: String,
  type: { type: String, default: "text" },
  placeholder: String,
  required: Boolean,
  disabled: Boolean,
  error: String,
  id: String,
  inputClass: [String, Object, Array],
  autocomplete: String,
});
const emit = defineEmits(["update:modelValue"]);
const inputId = computed(() => props.id || `input-${crypto.randomUUID()}`);
const onInput = (event) => {
  if (props.type === "number") {
    const val = event.target.value === "" ? null : Number(event.target.value);
    emit("update:modelValue", val);
  } else {
    emit("update:modelValue", event.target.value);
  }
};
</script>
