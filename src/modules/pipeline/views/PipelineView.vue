<template>
  <div>
    <h1 class="mb-6 text-2xl font-semibold text-gray-900">
      Pipeline Karya Seni
    </h1>

    <div
      v-if="artworksStore.loading && artworksStore.artworksList.length === 0"
      class="py-10 text-center"
    >
      <Spinner class="w-8 h-8 mx-auto mb-2" /> Memuat pipeline...
    </div>
    <div v-else-if="artworksStore.error" class="text-center text-red-600">
      Error: {{ artworksStore.error }}
    </div>

    <div
      v-else
      class="flex px-4 pb-4 -mx-4 space-x-4 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
    >
      <PipelineColumn
        title="Konsep"
        :artworks="artworksByStatus.concept"
        status-key="concept"
        @update-list="handleUpdateStatus"
      />
      <PipelineColumn
        title="Dalam Produksi"
        :artworks="artworksByStatus.wip"
        status-key="wip"
        @update-list="handleUpdateStatus"
      />
      <PipelineColumn
        title="Selesai"
        :artworks="artworksByStatus.completed"
        status-key="completed"
        @update-list="handleUpdateStatus"
      />
      <PipelineColumn
        title="Untuk Dijual"
        :artworks="artworksByStatus.for_sale"
        status-key="for_sale"
        @update-list="handleUpdateStatus"
      />
      <PipelineColumn
        title="Terjual"
        :artworks="artworksByStatus.sold"
        status-key="sold"
        @update-list="handleUpdateStatus"
      />
      <PipelineColumn
        title="Pameran"
        :artworks="artworksByStatus.exhibition"
        status-key="exhibition"
        @update-list="handleUpdateStatus"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useArtworksStore } from "@/stores/artworks";
import PipelineColumn from "@/modules/pipeline/components/PipelineColumn.vue";
import Spinner from "@/components/common/Spinner.vue";

const artworksStore = useArtworksStore();

onMounted(() => {
  if (artworksStore.artworksList.length === 0) {
    artworksStore.fetchArtworks();
  }
});

const artworksByStatus = computed(() => {
  const grouped = {
    concept: [],
    wip: [],
    completed: [],
    for_sale: [],
    sold: [],
    exhibition: [],
    not_for_sale: [],
  };
  artworksStore.artworksList.forEach((artwork) => {
    const statusKey = artwork.status || "concept";
    if (grouped[statusKey]) {
      grouped[statusKey].push(artwork);
    } else {
      console.warn(
        `Unknown status found: ${statusKey} for artwork ${artwork.artwork_id}`
      );
    }
  });
  return grouped;
});

const handleUpdateStatus = async ({ artworkId, newStatus }) => {
  console.log(
    `PipelineView received update: Artwork ${artworkId} moved to ${newStatus}`
  );
  try {
    const artwork = artworksStore.artworksList.find(
      (a) => a.artwork_id === artworkId
    );
    if (artwork && artwork.status !== newStatus) {
      await artworksStore.updateArtworkStatus(artworkId, newStatus);
      console.log(`Status updated successfully in Firestore for ${artworkId}`);
    } else if (artwork && artwork.status === newStatus) {
      console.log(
        `Artwork ${artworkId} already has status ${newStatus}, no update needed.`
      );
    }
  } catch (error) {
    console.error("Gagal update status karya:", error);

    artworksStore.fetchArtworks();
  }
};
</script>
<style scoped>
::-webkit-scrollbar {
  height: 8px;
}
::-webkit-scrollbar-thumb {
  background: #a0aec0;
  border-radius: 4px;
}
::-webkit-scrollbar-track {
  background: #edf2f7;
}
</style>
