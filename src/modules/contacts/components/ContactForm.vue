<template>
  <div class="space-y-6">
    <AppInput
      label="Nama Kontak *"
      v-model="editableContactData.name"
      required
      autocomplete="name"
    />
    <AppInput
      label="Organisasi / Galeri (Opsional)"
      v-model="editableContactData.organization"
      autocomplete="organization"
    />
    <AppInput
      label="Jabatan (Opsional)"
      v-model="editableContactData.title"
      autocomplete="organization-title"
    />

    <div>
      <label for="category" class="block text-sm font-medium text-gray-700"
        >Kategori *</label
      >
      <select
        id="category"
        v-model="editableContactData.category"
        required
        class="block w-full py-2 pl-3 pr-10 mt-1 text-base border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      >
        <option value="collector">Kolektor</option>
        <option value="gallery">Galeri</option>
        <option value="curator">Kurator</option>
        <option value="critic">Kritikus</option>
        <option value="media">Media</option>
        <option value="artist">Sesama Seniman</option>
        <option value="other">Lainnya</option>
      </select>
    </div>

    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <AppInput
        label="Email (Opsional)"
        type="email"
        v-model="editableContactData.email"
        autocomplete="email"
      />
      <AppInput
        label="Telepon (Opsional)"
        type="tel"
        v-model="editableContactData.phone"
        autocomplete="tel"
      />
    </div>

    <AppInput
      label="Website (Opsional)"
      type="url"
      v-model="editableContactData.website"
      placeholder="https://..."
      autocomplete="url"
    />

    <fieldset class="p-4 mt-4 border rounded">
      <legend class="px-1 text-sm font-medium text-gray-700">
        Alamat (Opsional)
      </legend>
      <div class="mt-2 space-y-4">
        <AppInput
          label="Jalan"
          v-model="editableContactData.address.street"
          autocomplete="street-address"
        />
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <AppInput
            label="Kota"
            v-model="editableContactData.address.city"
            autocomplete="address-level2"
          />
          <AppInput
            label="Kode Pos"
            v-model="editableContactData.address.postal_code"
            autocomplete="postal-code"
          />
          <AppInput
            label="Negara"
            v-model="editableContactData.address.country"
            autocomplete="country-name"
          />
        </div>
      </div>
    </fieldset>

    <div>
      <label for="notes" class="block text-sm font-medium text-gray-700"
        >Catatan (Opsional)</label
      >
      <textarea
        id="notes"
        v-model="editableContactData.notes"
        rows="4"
        class="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      ></textarea>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">Status</label>
      <div class="flex items-center mt-1">
        <input
          id="is_active"
          name="is_active"
          type="checkbox"
          v-model="editableContactData.is_active"
          class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
        />
        <label for="is_active" class="block ml-2 text-sm text-gray-900"
          >Kontak Aktif</label
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import AppInput from "@/components/common/AppInput.vue";

const props = defineProps({ contactData: { type: Object, required: true } });
const emit = defineEmits(["update:contactData"]);

const editableContactData = ref({});

const syncData = (newData) => {
  editableContactData.value = JSON.parse(JSON.stringify(newData));
  if (!editableContactData.value.address)
    editableContactData.value.address = {
      street: "",
      city: "",
      country: "",
      postal_code: "",
    };
  if (!editableContactData.value.category)
    editableContactData.value.category = "collector";
  if (editableContactData.value.is_active === undefined)
    editableContactData.value.is_active = true;
};

onMounted(() => syncData(props.contactData));
watch(
  () => props.contactData,
  (newData) => syncData(newData),
  { deep: true }
);

watch(
  editableContactData,
  (newData) => {
    emit("update:contactData", newData);
  },
  { deep: true }
);
</script>
