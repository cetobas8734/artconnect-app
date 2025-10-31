<template>
  <div class="px-4 py-10 mx-auto max-w-7xl sm:px-6 lg:px-8">
    <div class="flex items-center mb-6">
      <button
        @click="goBack"
        aria-label="Kembali"
        class="mr-2 p-1.5 rounded-full hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
      </button>
      <h1 class="text-2xl font-semibold text-gray-900">Detail Karya Seni</h1>
    </div>
    <div v-if="artworksStore.loading && !artwork" class="py-20 text-center">
      <Spinner class="w-10 h-10 mx-auto mb-2" />
      <p class="text-gray-500">Memuat detail...</p>
    </div>
    <div
      v-else-if="artworksStore.error"
      class="px-4 py-3 text-red-700 bg-red-100 border border-red-400 rounded"
    >
      Error: {{ artworksStore.error }}
    </div>

    <div
      v-else-if="artwork"
      class="p-6 overflow-hidden bg-white shadow-soft sm:rounded-lg sm:p-8"
    >
      <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div class="md:col-span-1">
          <div
            class="overflow-hidden bg-gray-200 aspect-w-1 aspect-h-1 rounded-xl"
            :style="{ backgroundColor: '#E5E7EB' }"
          >
            <img
              :src="artwork.primary_image_url || placeholderImage"
              :alt="artwork.title"
              class="object-cover w-full h-full"
            />
          </div>
        </div>
        <div class="space-y-4 md:col-span-1">
          <h2 class="text-3xl font-bold text-gray-900">
            {{ artwork.title || "Urban Dreams" }}
          </h2>
          <dl class="space-y-3 text-base">
            <div class="flex">
              <dt class="w-24 text-gray-700">Medium</dt>
              <dd class="text-gray-900">{{ artwork.medium || "N/A" }}</dd>
            </div>
            <div class="flex">
              <dt class="w-24 text-gray-700">Dimensi</dt>
              <dd class="text-gray-900">
                {{ formatDimensions(artwork.dimensions) || "N/A" }}
              </dd>
            </div>
            <div class="flex">
              <dt class="w-24 text-gray-700">Harga</dt>
              <dd class="text-gray-900">
                {{ formatCurrency(artwork.price, artwork.currency) || "N/A" }}
              </dd>
            </div>

            <div class="flex pt-1">
              <dt class="w-24 text-gray-700">Status</dt>
              <dd>
                <span
                  :class="statusBadgeClass(artwork.status)"
                  class="inline-flex items-center px-3 py-1 text-sm font-medium capitalize rounded-md"
                >
                  {{ artwork.status?.replace("_", " ") || "N/A" }}
                </span>
              </dd>
            </div>
            <div class="flex">
              <dt class="w-24 text-gray-700">Deskripsi</dt>
              <dd class="text-gray-900">
                {{ artwork.description || "Tidak ada deskripsi." }}
              </dd>
            </div>
          </dl>
          <div class="pt-4 space-y-2 border-t border-gray-100">
            <h3 class="w-24 text-gray-700">Riwayat</h3>
            <ul class="space-y-1 text-sm text-gray-600">
              <li
                v-for="(history, index) in (artwork.status_history || []).slice(
                  0,
                  1
                )"
                :key="index"
                class="flex space-x-2"
              >
                <span
                  >Status {{ history.status?.replace("_", " ") }} pada:</span
                >
                <span class="font-medium">{{
                  formatFullDate(history.timestamp)
                }}</span>
              </li>
              <li
                v-if="
                  !artwork.status_history || artwork.status_history.length === 0
                "
              >
                Tidak ada riwayat status.
              </li>
            </ul>
          </div>

          <div class="flex pt-5 space-x-3">
            <AppButton
              type="button"
              variant="action-dark"
              size="lg"
              class="px-8"
              @click="editArtwork"
            >
              Edit
            </AppButton>
            <AppButton
              type="button"
              variant="outline"
              size="lg"
              class="px-4"
              @click="confirmDelete"
              :loading="deleting"
            >
              Hapus
            </AppButton>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="py-20 text-center text-gray-500">
      Karya seni tidak ditemukan.
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useArtworksStore } from "@/stores/artworks";
import {
  formatCurrency,
  formatDimensions,
  formatFullDate,
} from "@/utils/formatters.js";
import AppButton from "@/components/common/AppButton.vue";
import Spinner from "@/components/common/Spinner.vue";
const props = defineProps({ id: String });
const router = useRouter();
const artworksStore = useArtworksStore();
const deleting = ref(false);
const placeholderImage =
  "data:image/svg+xml;charset=utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%2BviewBox%3D%220%200%20100%20100%22%20preserveAspectRatio%3D%22none%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23E5E7EB%22%2F%3E%3C%2Fsvg%3E";
const artwork = computed(() => artworksStore.currentArtwork);
const fetchData = async (id) => {
  if (
    !artworksStore.currentArtwork ||
    artworksStore.currentArtwork.artwork_id !== id
  )
    await artworksStore.fetchArtworkById(id);
};
onMounted(() => fetchData(props.id));
watch(
  () => props.id,
  (newId) => fetchData(newId)
);
const confirmDelete = async () => {
  if (artwork.value && confirm(`Hapus "${artwork.value.title}"?`)) {
    deleting.value = true;
    try {
      await artworksStore.deleteArtwork(props.id);
      router.push({ name: "ArtworksList" });
    } catch (e) {
      alert("Gagal hapus.");
    } finally {
      deleting.value = false;
    }
  }
};
const goBack = () => router.go(-1);
const editArtwork = () => {
  alert("Fungsi Edit belum diaktifkan di MVP!");
};

const statusBadgeClass = (status) => {
  const s = status?.toLowerCase();
  switch (s) {
    case "sold":
      return "bg-red-100 text-red-800";
    case "for_sale":
    case "tersedia":
      return "bg-artconnect-soft-green text-gray-800";
    case "wip":
      return "bg-yellow-100 text-yellow-800";
    case "concept":
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
