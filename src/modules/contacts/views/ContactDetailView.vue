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
      <h1 class="text-2xl font-semibold text-gray-900">Detail Kontak</h1>
    </div>

    <div v-if="contactsStore.loading && !contact" class="py-20 text-center">
      <Spinner class="w-10 h-10 mx-auto mb-2" /> Memuat detail kontak...
    </div>
    <div
      v-else-if="contactsStore.error"
      class="px-4 py-3 text-red-700 bg-red-100 border border-red-400 rounded"
    >
      Error: {{ contactsStore.error }}
    </div>
    <div
      v-else-if="contact"
      class="overflow-hidden bg-white shadow sm:rounded-lg"
    >
      <div class="px-4 py-5 sm:px-6">
        <h3 class="text-lg font-medium leading-6 text-gray-900">
          {{ contact.name }}
        </h3>
        <p class="max-w-2xl mt-1 text-sm text-gray-500 capitalize">
          {{ contact.title || contact.category || "Kontak" }}
          <span v-if="contact.organization">at {{ contact.organization }}</span>
        </p>
      </div>
      <div class="px-4 py-5 border-t border-gray-200 sm:p-0">
        <dl class="sm:divide-y sm:divide-gray-200">
          <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Kategori</dt>
            <dd
              class="mt-1 text-sm text-gray-900 capitalize sm:mt-0 sm:col-span-2"
            >
              {{ contact.category || "-" }}
            </dd>
          </div>
          <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Email</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {{ contact.email || "-" }}
            </dd>
          </div>
          <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Telepon</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {{ contact.phone || "-" }}
            </dd>
          </div>
          <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Website</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <a
                v-if="contact.website"
                :href="contact.website"
                target="_blank"
                rel="noopener noreferrer"
                class="text-indigo-600 hover:underline"
                >{{ contact.website }}</a
              >
              <span v-else>-</span>
            </dd>
          </div>
          <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Alamat</dt>
            <dd
              class="mt-1 text-sm text-gray-900 whitespace-pre-line sm:mt-0 sm:col-span-2"
            >
              {{ formatAddress(contact.address) || "-" }}
            </dd>
          </div>
          <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Catatan</dt>
            <dd
              class="mt-1 text-sm text-gray-900 whitespace-pre-wrap sm:mt-0 sm:col-span-2"
            >
              {{ contact.notes || "-" }}
            </dd>
          </div>
          <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Status</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {{ contact.is_active ? "Aktif" : "Tidak Aktif" }}
            </dd>
          </div>
        </dl>
      </div>
      <div
        class="px-4 py-3 text-right border-t border-gray-200 bg-gray-50 sm:px-6"
      >
        <div class="flex justify-end space-x-3">
          <AppButton variant="danger" @click="confirmDelete" :loading="deleting"
            >Hapus</AppButton
          >
        </div>
      </div>
    </div>
    <div v-else class="py-20 text-center text-gray-500">
      Kontak tidak ditemukan atau Anda tidak memiliki izin.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useContactsStore } from "@/stores/contacts";
import Spinner from "@/components/common/Spinner.vue";
import AppButton from "@/components/common/AppButton.vue";

const props = defineProps({ id: String });
const router = useRouter();
const contactsStore = useContactsStore();
const deleting = ref(false);

const contact = computed(() => contactsStore.currentContact);

const fetchData = async (contactId) => {
  if (
    !contactsStore.currentContact ||
    contactsStore.currentContact.contact_id !== contactId
  ) {
    await contactsStore.fetchContactById(contactId);
  }
};

onMounted(() => fetchData(props.id));
watch(
  () => props.id,
  (newId) => fetchData(newId)
);

const confirmDelete = async () => {
  if (
    contact.value &&
    window.confirm(`Hapus kontak "${contact.value.name}"?`)
  ) {
    deleting.value = true;
    try {
      await contactsStore.deleteContact(props.id);
      router.push({ name: "ContactsList" });
    } catch (error) {
      alert("Gagal menghapus kontak.");
    } finally {
      deleting.value = false;
    }
  }
};

const formatAddress = (addr) => {
  if (!addr) return "";
  let parts = [addr.street, addr.city, addr.postal_code, addr.country].filter(
    Boolean
  );
  return parts.join(", ");
};

const goBack = () => {
  router.go(-1);
};
</script>
