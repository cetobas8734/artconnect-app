<template>
  <div class="px-4 py-10 mx-auto max-w-7xl sm:px-6 lg:px-8">
    <div
      class="flex flex-col items-center justify-between gap-4 mb-6 sm:flex-row"
    >
      <h1 class="text-2xl font-semibold text-gray-900">Karya Seni</h1>
      <AppButton variant="primary" @click="goToCreateArtwork">
        + Tambah Karya Baru
      </AppButton>
    </div>
    <div class="mb-6">
      <SearchBar v-model="searchTerm" placeholder="Cari Karya..." />
    </div>
    <div class="mb-8 overflow-x-auto">
      <SegmentFilter :segments="statusSegments" v-model="selectedStatus" />
    </div>

    <div v-if="artworksStore.loading" class="py-10 text-center">
      <Spinner class="w-8 h-8 mx-auto mb-2" />
      <p class="mt-2 text-gray-500">Memuat koleksi karya seni...</p>
    </div>
    <div v-else>
      <div
        v-if="filteredArtworks.length > 0"
        class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        <ArtworkCard
          v-for="artwork in filteredArtworks"
          :key="artwork.artwork_id"
          :artwork="artwork"
        />
      </div>
      <div v-else class="py-16 mt-8 text-center bg-white rounded-lg shadow">
        <svg
          class="w-12 h-12 mx-auto text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            vector-effect="non-scaling-stroke"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">
          Tidak ada karya yang ditemukan
        </h3>
        <p v-if="searchTerm" class="mt-1 text-sm text-gray-500">
          Coba kata kunci atau filter status yang berbeda.
        </p>
        <p v-else class="mt-1 text-sm text-gray-500">
          Mulai dengan menambahkan karya seni pertama Anda.
        </p>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useArtworksStore } from "@/stores/artworks";
import ArtworkCard from "@/modules/artworks/components/ArtworkCard.vue";
import SearchBar from "@/modules/artworks/components/SearchBar.vue";
import SegmentFilter from "@/modules/contacts/components/SegmentFilter.vue";
import AppButton from "@/components/common/AppButton.vue";
import Spinner from "@/components/common/Spinner.vue";
const router = useRouter();
const artworksStore = useArtworksStore();
const statusSegments = [
  "Semua Status",
  "Tersedia",
  "Konsep",
  "Dipamerkan",
  "Terjual",
];
const selectedStatus = ref(statusSegments[0]);
const searchTerm = ref("");
onMounted(() => {
  if (artworksStore.artworksList.length === 0) {
    artworksStore.fetchArtworks();
  }
});
const filteredArtworks = computed(() => {
  let list = artworksStore.artworksList;
  const statusKey = selectedStatus.value.toLowerCase().replace(" ", "_");
  if (statusKey !== "semua_status") {
    const targetStatus = statusKey === "tersedia" ? "for_sale" : statusKey;
    list = list.filter((a) => a.status?.toLowerCase() === targetStatus);
  }
  if (searchTerm.value) {
    const lowerSearch = searchTerm.value.toLowerCase();
    list = list.filter(
      (a) =>
        a.title?.toLowerCase().includes(lowerSearch) ||
        a.medium?.toLowerCase().includes(lowerSearch)
    );
  }
  return list;
});
const goToCreateArtwork = () => {
  router.push({ name: "ArtworkCreate" });
};
</script>
