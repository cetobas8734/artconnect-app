<template>
  <router-link
    :to="{ name: 'ArtworkDetail', params: { id: artwork.artwork_id } }"
    class="block p-3 transition-all duration-150 bg-white border border-gray-200 rounded shadow cursor-grab hover:border-indigo-400 active:cursor-grabbing hover:shadow-md"
    :data-artwork-id="artwork.artwork_id"
  >
    <p class="text-sm font-medium text-gray-900 truncate">
      {{ artwork.title || "Tanpa Judul" }}
    </p>

    <p class="mt-1 text-xs text-gray-500">{{ formattedPrice }}</p>

    <img
      v-if="artwork.primary_image_url"
      :src="artwork.primary_image_url"
      :alt="artwork.title"
      class="object-cover w-full h-16 mt-2 bg-gray-100 rounded-sm"
    />
  </router-link>
</template>
<script setup>
import { computed } from "vue";
import { formatCurrency } from "@/utils/formatters.js";

const props = defineProps({ artwork: { type: Object, required: true } });

const formattedPrice = computed(() => {
  if (
    props.artwork.price === undefined ||
    props.artwork.price === null ||
    props.artwork.status !== "for_sale"
  )
    return "";
  return formatCurrency(props.artwork.price, props.artwork.currency || "IDR");
});
</script>
