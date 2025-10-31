<template>
  <div
    class="overflow-hidden transition-shadow duration-200 bg-white border border-gray-200 rounded-lg shadow-soft group hover:shadow-mid"
  >
    <div class="overflow-hidden bg-gray-200 rounded-t-lg aspect-w-1 aspect-h-1">
      <img
        :src="artwork.primary_image_url || placeholderImage"
        :alt="artwork.title || 'Artwork image'"
        class="object-cover w-full h-full transition-opacity group-hover:opacity-90"
        loading="lazy"
      />
    </div>
    <div class="relative p-4">
      <h3
        class="text-base font-semibold truncate text-artconnect-primary-text"
        :title="artwork.title"
      >
        {{ artwork.title || "Untitled" }}
      </h3>
      <p class="mt-1 text-sm text-gray-500 truncate">
        {{ artwork.medium || "N/A" }}
        <span v-if="dimensionString">| {{ dimensionString }}</span>
      </p>
      <p class="mt-2 text-lg font-medium text-gray-800">{{ formattedPrice }}</p>

      <span
        v-if="
          artwork.status?.toLowerCase() === 'sold' ||
          artwork.status?.toLowerCase() === 'terjual'
        "
        class="absolute px-3 py-1 text-xs font-semibold text-gray-800 rounded-md shadow-sm bottom-12 right-4 bg-artconnect-soft-green"
      >
        Terjual
      </span>
      <span
        v-else-if="artwork.status"
        :class="statusBadgeClass(artwork.status)"
        class="absolute bottom-12 right-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize"
      >
        {{ artwork.status.replace("_", " ") }}
      </span>

      <router-link
        :to="{ name: 'ArtworkDetail', params: { id: artwork.artwork_id } }"
        class="block mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-800"
      >
        View Details →
      </router-link>
    </div>
  </div>
</template>
<script setup>
import { computed } from "vue";
import { formatCurrency, formatDimensions } from "@/utils/formatters.js";
const placeholderImage =
  "data:image/svg+xml;charset=utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%2BviewBox%3D%220%200%20100%20100%22%20preserveAspectRatio%3D%22none%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23E5E7EB%22%2F%3E%3C%2Fsvg%3E";
const props = defineProps({ artwork: { type: Object, required: true } });
const formattedPrice = computed(() =>
  formatCurrency(props.artwork.price || 0, props.artwork.currency || "IDR")
);
const dimensionString = computed(() =>
  formatDimensions(props.artwork.dimensions)
);

const statusBadgeClass = (status) => {
  const s = status?.toLowerCase();
  switch (s) {
    case "for_sale":
    case "tersedia":
      return "bg-artconnect-soft-green text-gray-800";
    case "wip":
      return "bg-yellow-100 text-yellow-800";
    case "konsep":
      return "bg-purple-100 text-purple-800";
    case "exhibition":
    case "dipamerkan":
      return "bg-pink-100 text-pink-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
</script>
