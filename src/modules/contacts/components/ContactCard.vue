<template>
  <li class="px-4 py-4 transition-colors duration-150 sm:px-6 hover:bg-gray-50">
    <router-link
      :to="{ name: 'ContactDetail', params: { id: contact.contact_id } }"
      class="block group"
    >
      <div class="flex items-center justify-between">
        <p
          class="text-sm font-medium truncate text-artconnect-primary-text group-hover:text-gray-600"
        >
          {{ contact.name || "Nama Tidak Diketahui" }}
        </p>
        <div class="flex flex-shrink-0 ml-2">
          <p
            class="inline-flex px-2 text-xs font-semibold leading-5 text-gray-800 capitalize bg-gray-100 rounded-full"
          >
            {{ contact.category?.replace("_", " ") || "Lainnya" }}
          </p>
        </div>
      </div>
      <div class="mt-2 sm:flex sm:justify-between">
        <div class="items-center text-sm text-gray-500 sm:flex">
          <svg
            class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 hidden sm:inline-block"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm0 4h2v2H7V9zm4-4h2v2h-2V5zm0 4h2v2h-2V9z"
              clip-rule="evenodd"
            />
          </svg>
          <span class="truncate">{{
            contact.organization || contact.title || "Informasi tidak tersedia"
          }}</span>
        </div>
        <div class="flex items-center mt-2 text-sm text-gray-500 sm:mt-0">
          <svg
            class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
              clip-rule="evenodd"
            />
          </svg>
          <p>
            Kontak Terakhir:
            <time
              v-if="contact.last_contact_date"
              :datetime="contact.last_contact_date.toDate().toISOString()"
              >{{ formatRelativeTime(contact.last_contact_date) }}</time
            >
            <span v-else>Belum Pernah</span>
          </p>
        </div>
      </div>
    </router-link>
  </li>
</template>
<script setup>
import { formatRelativeTime } from "@/utils/formatters.js";
defineProps({ contact: { type: Object, required: true } });
</script>
