<template>
  <div class="pt-6">
    <div class="px-6 mb-8">
      <div
        class="relative overflow-hidden text-white shadow-lg rounded-2xl"
        :style="{
          backgroundImage:
            'url(\'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80\')',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '200px',
        }"
      >
        <div class="absolute inset-0 bg-gray-900 bg-opacity-40"></div>

        <div class="relative z-10 px-6 py-8 sm:px-8">
          <h1 class="mb-1 text-3xl font-bold sm:text-4xl">
            Welcome back, {{ authStore.user?.displayName || userFirstName }}!
          </h1>
          <p class="text-sm text-gray-200 sm:text-base">
            Your art business is thriving. Let's keep the momentum going.
          </p>
        </div>
      </div>
    </div>

    <div class="px-6">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 gap-5 mb-8 sm:grid-cols-3">
        <StatsCard
          title="Total Sales"
          value="$25,450"
          change="+15%"
          changeType="positive"
        />
        <StatsCard
          title="Average Sale Value"
          value="$1,272.50"
          change="+8%"
          changeType="positive"
        />
        <StatsCard
          title="New Contacts"
          value="15"
          change="+20%"
          changeType="positive"
        />
      </div>

      <!-- Sales Trends & Recent Artworks -->
      <div class="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-3">
        <div class="p-6 bg-white shadow rounded-2xl lg:col-span-2">
          <h2 class="mb-4 text-xl font-semibold text-gray-800">Sales Trends</h2>
          <SalesChart />
        </div>

        <div class="p-6 bg-white shadow rounded-2xl">
          <h2 class="mb-4 text-xl font-semibold text-gray-800">
            Recent Artworks
          </h2>
          <div v-if="artworksStore.loading">
            <Spinner class="w-8 h-8 mx-auto" />
          </div>
          <div
            v-else-if="recentArtworks.length > 0"
            class="grid grid-cols-2 gap-3"
          >
            <router-link
              v-for="artwork in recentArtworks"
              :key="artwork.artwork_id"
              :to="{
                name: 'ArtworkDetail',
                params: { id: artwork.artwork_id },
              }"
              class="block"
            >
              <img
                :src="artwork.primary_image_url || placeholderImage"
                :alt="artwork.title"
                class="object-cover transition-opacity rounded-lg aspect-square hover:opacity-80"
              />
            </router-link>
          </div>
          <p v-else class="text-sm text-gray-500">Belum ada karya seni.</p>
        </div>
      </div>

      <!-- Activity Feed & Key Contacts -->
      <div class="grid grid-cols-1 gap-6 pb-8 lg:grid-cols-3">
        <div class="p-6 bg-white shadow rounded-2xl lg:col-span-2">
          <h2 class="mb-4 text-xl font-semibold text-gray-800">
            Activity Feed
          </h2>
          <ul class="space-y-4">
            <ActivityFeedItem
              icon="💰"
              text="Sold 'Abstract Landscape' to Olivia Bennett"
              time="2 days ago"
            />
            <ActivityFeedItem
              icon="✨"
              text="Added new artwork 'Urban Sketch'"
              time="1 week ago"
            />
            <ActivityFeedItem
              icon="📞"
              text="Contacted by potential buyer, Ethan Chen"
              time="2 weeks ago"
            />
          </ul>
        </div>

        <div class="p-6 bg-white shadow rounded-2xl">
          <h2 class="mb-4 text-xl font-semibold text-gray-800">Key Contacts</h2>
          <div v-if="contactsStore.loading">
            <Spinner class="w-8 h-8 mx-auto" />
          </div>
          <ul v-else-if="keyContacts.length > 0" class="space-y-4">
            <KeyContactItem
              v-for="contact in keyContacts"
              :key="contact.contact_id"
              :name="contact.name"
              :avatar="contact.avatar_url"
              :contactId="contact.contact_id"
            />
          </ul>
          <p v-else class="text-sm text-gray-500">Belum ada kontak.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useArtworksStore } from "@/stores/artworks";
import { useContactsStore } from "@/stores/contacts";
import StatsCard from "@/modules/dashboard/components/StatsCard.vue";
import SalesChart from "@/modules/dashboard/components/SalesChart.vue";
import ActivityFeedItem from "@/modules/dashboard/components/ActivityFeedItem.vue";
import KeyContactItem from "@/modules/dashboard/components/KeyContactItem.vue";
import Spinner from "@/components/common/Spinner.vue";

const placeholderImage =
  "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80";

const authStore = useAuthStore();
const artworksStore = useArtworksStore();
const contactsStore = useContactsStore();

const userFirstName = computed(
  () =>
    authStore.user?.displayName ||
    authStore.user?.email?.split("@")[0] ||
    "Seniman"
);

onMounted(() => {
  if (artworksStore.artworksList.length === 0) artworksStore.fetchArtworks();
  if (contactsStore.contactsList.length === 0) contactsStore.fetchContacts();
});

const recentArtworks = computed(() => artworksStore.artworksList.slice(0, 4));
const keyContacts = computed(() => contactsStore.contactsList.slice(0, 5));
</script>
