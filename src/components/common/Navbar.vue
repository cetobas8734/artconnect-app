<template>
  <nav class="sticky top-0 z-50 bg-white shadow-sm">
    <div class="container px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <router-link
            to="/app/dashboard"
            class="flex items-center flex-shrink-0"
          >
            <img
              class="w-auto h-8"
              src="@/assets/images/logo-artconnect.png"
              alt="Logo"
            />
            <span
              class="ml-2 text-xl font-semibold text-artconnect-primary-text"
              >ArtConnect</span
            >
          </router-link>
        </div>

        <div class="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-8">
          <router-link
            v-for="item in navigation"
            :key="item.name"
            :to="item.href"
            class="relative inline-flex items-center h-full px-1 pt-1 text-sm transition-colors duration-150"
            :class="[
              $route.path.startsWith(item.href)
                ? 'font-semibold text-artconnect-primary-text'
                : 'font-medium text-gray-500 hover:text-gray-700',
            ]"
          >
            {{ item.name }}
            <span
              v-if="$route.path.startsWith(item.href)"
              class="absolute bottom-0 left-0 w-full h-0.5 bg-artconnect-soft-green"
            ></span>
          </router-link>
        </div>

        <div class="hidden space-x-3 sm:ml-6 sm:flex sm:items-center">
          <div v-if="authStore.user" class="flex items-center space-x-2">
            <img
              :src="authStore.user?.photoURL || defaultAvatar"
              :alt="userFirstName"
              class="object-cover w-8 h-8 border-2 border-transparent rounded-full cursor-pointer hover:border-artconnect-soft-green"
            />
            <span class="hidden text-sm text-gray-700 lg:inline"
              >Hi, {{ userFirstName }}</span
            >
          </div>
          <AppButton
            v-if="authStore.isAuthenticated"
            variant="custom-logout"
            size="sm"
            class="rounded-full"
            @click="handleLogout"
            >Logout</AppButton
          >
        </div>

        <div class="flex items-center -mr-2 sm:hidden">
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            type="button"
            class="inline-flex items-center justify-center p-2 text-gray-400 rounded-md hover:text-gray-500 hover:bg-gray-100 focus:ring-artconnect-soft-green"
            aria-controls="mobile-menu"
            :aria-expanded="mobileMenuOpen.toString()"
          >
            <span class="sr-only">Menu</span>
            <svg
              v-if="!mobileMenuOpen"
              class="block w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
            <svg
              v-else
              class="block w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="translate-y-1 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-1 opacity-0"
    >
      <div
        v-show="mobileMenuOpen"
        class="absolute inset-x-0 z-40 bg-white shadow-lg sm:hidden top-16"
        id="mobile-menu"
      >
        <div class="pt-2 pb-3 space-y-1">
          <router-link
            v-for="item in navigation"
            :key="item.name + '-m'"
            :to="item.href"
            @click="mobileMenuOpen = false"
            class="block py-2 pl-3 pr-4 text-base font-medium border-l-4"
            :class="[
              $route.path.startsWith(item.href)
                ? 'bg-green-50 border-artconnect-soft-green text-green-700'
                : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800',
            ]"
            >{{ item.name }}</router-link
          >
        </div>
        <div class="pt-4 pb-3 border-t border-gray-200">
          <div v-if="authStore.user" class="flex items-center px-5">
            <div class="ml-3">
              <div class="text-base font-medium text-gray-800">
                {{ authStore.user.displayName || userFirstName }}
              </div>
              <div class="text-sm font-medium text-gray-500">
                {{ authStore.user.email }}
              </div>
            </div>
          </div>
          <div class="mt-3 space-y-1">
            <button
              @click="handleLogout"
              class="block w-full px-5 py-2 text-base font-medium text-left text-gray-500 hover:text-gray-800 hover:bg-gray-100"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </transition>
  </nav>
</template>
<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import AppButton from "@/components/common/AppButton.vue";
const defaultAvatar =
  "data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjYmJiYmJiIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTAgM2MxLjY2IDAgMyAxLjM0IDMgM3MtMS4zNCAzLTMgMy0zLTEuMzQtMy0zIDEuMzQtMyAzLTN6bTAgMTRjLTIuNjcgMC04IDEuMzQtOCA0djJoMTZjMC0uNjYtMi4xNy00LTgtNHoiLz48L3N2Z3E+";
const router = useRouter();
const authStore = useAuthStore();
const mobileMenuOpen = ref(false);
const navigation = [
  { name: "Dashboard", href: "/app/dashboard" },
  { name: "Artworks", href: "/app/artworks" },
  { name: "Contacts", href: "/app/contacts" },
  { name: "Pipeline", href: "/app/pipeline" },
  { name: "Reports", href: "/app/reports" },
];
const userFirstName = computed(
  () =>
    authStore.user?.displayName ||
    authStore.user?.email?.split("@")[0] ||
    "User"
);
const handleLogout = async () => {
  mobileMenuOpen.value = false;
  await authStore.logout();
  router.push({ name: "Login" });
};
</script>
