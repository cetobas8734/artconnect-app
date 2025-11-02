<template>
  <div>
    <div class="flex items-center mb-6">
      <button
        @click="goBack"
        class="p-1 mr-2 text-gray-600 rounded-full hover:bg-gray-200"
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
      <h1 class="text-2xl font-semibold text-gray-900">Tambah Kontak Baru</h1>
    </div>
    <form
      @submit.prevent="submitContact"
      class="p-6 space-y-6 bg-white rounded-lg shadow sm:p-8"
    >
      <ContactForm v-model:contactData="formData" />

      <div class="pt-5 border-t border-gray-200">
        <div class="flex justify-end space-x-3">
          <AppButton type="button" variant="outline" @click="cancel"
            >Batal</AppButton
          >
          <AppButton
            type="submit"
            variant="primary"
            :loading="contactsStore.loading || submitting"
            >Simpan Kontak</AppButton
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
import { useContactsStore } from "@/stores/contacts";
import ContactForm from "@/modules/contacts/components/ContactForm.vue";
import AppButton from "@/components/common/AppButton.vue";

const router = useRouter();
const contactsStore = useContactsStore();
const submitting = ref(false);
const formError = ref("");

const formData = ref({
  name: "",
  organization: "",
  title: "",
  category: "collector",
  email: "",
  phone: "",
  address: { street: "", city: "", country: "", postal_code: "" },
  website: "",
  social_media: {},
  tags: [],
  is_active: true,
});

const submitContact = async () => {
  formError.value = "";
  // Validasi dasar
  if (!formData.value.name) {
    formError.value = "Nama kontak wajib diisi.";
    return;
  }
  if (!formData.value.category) {
    formError.value = "Kategori kontak wajib dipilih.";
    return;
  }
  if (!formData.value.email && !formData.value.phone) {
    formError.value = "Minimal isi Email atau Telepon.";
    return;
  }

  submitting.value = true;
  try {
    await contactsStore.addContact(formData.value);
    router.push({ name: "ContactsList" });
  } catch (error) {
    console.error("Gagal menambah kontak:", error);
    formError.value =
      contactsStore.error || "Gagal menyimpan kontak. Coba lagi.";
  } finally {
    submitting.value = false;
  }
};

const cancel = () => {
  if (confirm("Anda yakin ingin membatalkan? Perubahan tidak akan disimpan.")) {
    goBack();
  }
};

const goBack = () => {
  router.go(-1);
};
</script>
