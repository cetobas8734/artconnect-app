<template>
  <div
    class="flex-shrink-0 p-3 bg-gray-200 rounded-lg shadow-inner w-72 sm:w-80"
  >
    <h2
      class="flex items-center justify-between px-1 mb-3 text-sm font-semibold tracking-wide text-gray-700 uppercase"
    >
      <span>{{ title }}</span>
      <span
        class="text-xs text-gray-500 bg-gray-300 rounded-full px-2 py-0.5"
        >{{ artworks.length }}</span
      >
    </h2>
    <draggable
      :list="mutableArtworks"
      group="artworks"
      item-key="artwork_id"
      class="space-y-3 min-h-[150px] max-h-[70vh] overflow-y-auto pr-1"
      ghost-class="bg-indigo-100 rounded opacity-50"
      drag-class="shadow-lg ring-2 ring-indigo-500"
      animation="150"
      @end="onDragEnd"
    >
      <template v-if="mutableArtworks.length === 0" #footer>
        <div
          class="py-8 mt-4 text-xs text-center text-gray-500 border border-gray-400 border-dashed rounded-md"
        >
          Belum ada karya.
        </div>
      </template>

      <template #item="{ element }">
        <KanbanCard :artwork="element" />
      </template>
    </draggable>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import draggable from "vuedraggable";
import KanbanCard from "./KanbanCard.vue";

const props = defineProps({
  title: { type: String, required: true },
  artworks: { type: Array, required: true },
  statusKey: { type: String, required: true },
});
const emit = defineEmits(["update-list"]);

const mutableArtworks = ref([]);
watch(
  () => props.artworks,
  (newList) => {
    mutableArtworks.value = [...newList];
  },
  { immediate: true, deep: true }
);

const onDragEnd = (event) => {
  const artworkId = event.item.dataset.artworkId;
  if (!artworkId) return;
  if (event.to === event.target.parentElement) {
    emit("update-list", { artworkId: artworkId, newStatus: props.statusKey });
  }
};
</script>

<style scoped>
::-webkit-scrollbar {
  width: 4px;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}
</style>
