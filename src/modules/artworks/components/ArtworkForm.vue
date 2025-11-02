<template>
  <div class="space-y-6">
    <AppInput
      label="Judul Karya *"
      v-model="editableArtworkData.title"
      required
    />
    <div>
      <label class="block mb-1 text-sm font-medium text-gray-700"
        >Gambar Utama Karya *</label
      >
      <input
        type="file"
        @change="handleImageUpload"
        accept="image/jpeg, image/png, image/webp"
        class="block w-full text-sm text-gray-500 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
      />
      <img
        v-if="imagePreviewUrl"
        :src="imagePreviewUrl"
        alt="Pratinjau Gambar"
        class="mt-4 rounded shadow max-h-48"
      />
      <img
        v-else-if="initialImageUrl && !imagePreviewUrl"
        :src="initialImageUrl"
        alt="Gambar Saat Ini"
        class="mt-4 rounded shadow max-h-48"
      />
      <p
        v-if="initialImageUrl && !imagePreviewUrl"
        class="mt-2 text-xs text-gray-500"
      >
        Pilih file baru untuk mengganti gambar saat ini.
      </p>
    </div>
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <AppInput
        label="Medium *"
        v-model="editableArtworkData.medium"
        required
      />
      <AppInput
        label="Tahun Dibuat *"
        type="number"
        v-model.number="editableArtworkData.year_created"
        required
        :max="new Date().getFullYear()"
        min="1900"
      />
    </div>
    <fieldset class="p-4 mt-4 border rounded">
      <legend class="px-1 text-sm font-medium text-gray-700">Dimensi *</legend>
      <div class="grid grid-cols-1 gap-4 mt-2 sm:grid-cols-4">
        <AppInput
          label="Lebar"
          type="number"
          v-model.number="editableArtworkData.dimensions.width"
          placeholder="Contoh: 100"
          required
        />
        <AppInput
          label="Tinggi"
          type="number"
          v-model.number="editableArtworkData.dimensions.height"
          placeholder="Contoh: 80"
          required
        />
        <AppInput
          label="Kedalaman (Ops)"
          type="number"
          v-model.number="editableArtworkData.dimensions.depth"
          placeholder="Contoh: 5"
        />
        <AppInput
          label="Unit"
          v-model="editableArtworkData.dimensions.unit"
          placeholder="cm/in"
          required
        />
      </div>
    </fieldset>
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <AppInput
        label="Harga (jika Dijual)"
        type="number"
        v-model.number="editableArtworkData.price"
        min="0"
      />
      <div>
        <label for="status" class="block text-sm font-medium text-gray-700"
          >Status Karya *</label
        >
        <select
          id="status"
          v-model="editableArtworkData.status"
          required
          class="block w-full py-2 pl-3 pr-10 mt-1 text-base border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="concept">Konsep</option>
          <option value="wip">Dalam Pengerjaan</option>
          <option value="completed">Selesai</option>
          <option value="for_sale">Untuk Dijual</option>
          <option value="sold">Terjual</option>
          <option value="exhibition">Dipamerkan</option>
          <option value="not_for_sale">Tidak Untuk Dijual</option>
        </select>
      </div>
    </div>
    <div>
      <label for="description" class="block text-sm font-medium text-gray-700"
        >Deskripsi (Opsional)</label
      >
      <textarea
        id="description"
        v-model="editableArtworkData.description"
        rows="4"
        class="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      ></textarea>
    </div>
  </div>
</template>
<script setup>
import { ref, watch, onMounted } from "vue";
import AppInput from "@/components/common/AppButton.vue";
const props = defineProps({
  artworkData: { type: Object, required: true },
  imageFile: { type: File, default: null },
  initialImageUrl: { type: String, default: "" },
});
const emit = defineEmits(["update:artworkData", "update:imageFile"]);
const editableArtworkData = ref({});
const imagePreviewUrl = ref(null);
const internalImageFile = ref(props.imageFile);
const syncData = (newData) => {
  editableArtworkData.value = JSON.parse(JSON.stringify(newData));
  if (!editableArtworkData.value.dimensions) {
    editableArtworkData.value.dimensions = {
      width: null,
      height: null,
      depth: null,
      unit: "cm",
    };
  }
  if (!editableArtworkData.value.status) {
    editableArtworkData.value.status = "concept";
  }
  if (!internalImageFile.value) {
    imagePreviewUrl.value = null;
  }
};
onMounted(() => syncData(props.artworkData));
watch(
  () => props.artworkData,
  (newData) => syncData(newData),
  { deep: true }
);
watch(
  editableArtworkData,
  (newData) => {
    emit("update:artworkData", newData);
  },
  { deep: true }
);
const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file && file.type.startsWith("image/")) {
    internalImageFile.value = file;
    emit("update:imageFile", file);
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreviewUrl.value = e.target.result;
    };
    reader.readAsDataURL(file);
  } else {
    internalImageFile.value = null;
    emit("update:imageFile", null);
    imagePreviewUrl.value = null;
    event.target.value = "";
  }
};
</script>
