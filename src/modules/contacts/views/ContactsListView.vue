<template>
  <div>
    <div
      class="flex flex-col items-center justify-between gap-4 mb-6 sm:flex-row"
    >
      <h1 class="text-2xl font-semibold text-gray-900">Kontak Profesional</h1>
      <AppButton
        variant="primary"
        @click="$router.push({ name: 'ContactCreate' })"
      >
        + Tambah Kontak Baru
      </AppButton>
    </div>

    <div class="mb-6">
      <SegmentFilter :segments="segments" v-model="selectedSegment" />
    </div>

    <div v-if="contactsStore.loading" class="py-10 text-center">
      <Spinner class="w-8 h-8 mx-auto mb-2" />
      <p class="mt-2 text-gray-500">Memuat kontak...</p>
    </div>

    <div
      v-else-if="contactsStore.error"
      class="p-4 py-10 text-center border border-red-200 rounded bg-red-50"
    >
      <p class="font-medium text-red-700">Gagal memuat kontak.</p>
      <p class="mt-1 text-sm text-red-600">{{ contactsStore.error }}</p>
      <AppButton variant="secondary" @click="retryFetch" class="mt-4"
        >Coba Lagi</AppButton
      >
    </div>

    <div
      v-else-if="filteredContacts.length === 0"
      class="py-16 text-center bg-white rounded-lg shadow"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-12 h-12 mx-auto text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="1"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">Belum ada kontak</h3>
      <p class="mt-1 text-sm text-gray-500">
        Mulai bangun jaringan Anda dengan menambahkan kontak pertama.
      </p>
      <div class="mt-6">
        <AppButton
          variant="primary"
          @click="$router.push({ name: 'ContactCreate' })"
        >
          + Tambah Kontak Baru
        </AppButton>
      </div>
    </div>

    <div v-else class="overflow-hidden bg-white shadow sm:rounded-md">
      <ul role="list" class="divide-y divide-gray-200">
        <ContactCard
          v-for="contact in filteredContacts"
          :key="contact.contact_id"
          :contact="contact"
        />
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useContactsStore } from "@/stores/contacts";
import ContactCard from "@/modules/contacts/components/ContactCard.vue";
import SegmentFilter from "@/modules/contacts/components/SegmentFilter.vue";
import AppButton from "@/components/common/AppButton.vue";
import Spinner from "@/components/common/Spinner.vue";

const contactsStore = useContactsStore();
const segments = ["Semua", "Kolektor", "Galeri", "Kurator"];
const selectedSegment = ref(segments[0]);

onMounted(() => {
  if (contactsStore.contactsList.length === 0) {
    retryFetch();
  }
});

const filteredContacts = computed(() => {
  return contactsStore.contactsByCategory(selectedSegment.value);
});

const retryFetch = () => {
  contactsStore.fetchContacts();
};
</script>
