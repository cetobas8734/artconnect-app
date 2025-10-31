<template>
  <div class="max-w-4xl px-4 py-10 mx-auto sm:px-6 lg:px-8">
    <div class="flex items-center mb-6">
      <button
        @click="goBack"
        aria-label="Kembali"
        class="mr-2 p-1.5 rounded-full hover:bg-gray-200 text-gray-600"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-6 h-6"
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
      <h1 class="text-2xl font-semibold text-gray-900">
        Tambah Karya Seni Baru
      </h1>
    </div>
    <form
      @submit.prevent="submitArtwork"
      class="p-6 space-y-6 bg-white rounded-lg sm:p-8 shadow-soft"
    >
      <ArtworkForm
        v-model:artworkData="formData"
        v-model:imageFile="selectedImageFile"
      />
      <div class="pt-5 border-t border-gray-100">
        <div class="flex justify-end space-x-3">
          <AppButton type="button" variant="outline" @click="cancel"
            >Batal</AppButton
          >
          <AppButton
            type="submit"
            variant="primary"
            :loading="artworksStore.loading || submitting"
            >Simpan Karya</AppButton
          >
        </div>
      </div>
      <p v-if="formError" class="mt-4 text-sm text-red-600">{{ formError }}</p>
    </form>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useArtworksStore } from "@/stores/artworks";
import ArtworkForm from "@/modules/artworks/components/ArtworkForm.vue";
import AppButton from "@/components/common/AppButton.vue";
const router = useRouter();
const artworksStore = useArtworksStore();
const formData = ref({
  title: "",
  medium: "",
  dimensions: { width: null, height: null, depth: null, unit: "cm" },
  year_created: new Date().getFullYear(),
  price: null,
  currency: "IDR",
  status: "concept",
  description: "",
  tags: [],
});
const selectedImageFile = ref(null);
const formError = ref("");
const submitting = ref(false);
const submitArtwork = async () => {
  formError.value = "";
  if (!formData.value.title) {
    formError.value = "Judul wajib.";
    return;
  }
  if (!selectedImageFile.value) {
    formError.value = "Gambar wajib.";
    return;
  }
  if (!formData.value.medium) {
    formError.value = "Medium wajib.";
    return;
  }
  submitting.value = true;
  try {
    await artworksStore.addArtwork(formData.value, selectedImageFile.value);
    router.push({ name: "ArtworksList" });
  } catch (error) {
    formError.value = "Gagal menyimpan karya.";
  } finally {
    submitting.value = false;
  }
};
const cancel = () => {
  if (confirm("Batal? Perubahan tidak disimpan.")) goBack();
};
const goBack = () => {
  router.go(-1);
};
</script>
