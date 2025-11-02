<template>
  <div class="py-20 text-center">
    <h1 class="text-6xl font-bold text-gray-400">404</h1>
    <p class="mt-4 text-xl text-gray-600">Oops! Halaman Tidak Ditemukan.</p>
    <p class="mt-2 text-gray-500">Halaman yang Anda cari tidak ada.</p>
    <AppButton
      variant="primary"
      class="mt-8"
      @click="$router.push('/app/dashboard')"
    >
      Kembali ke Dashboard
    </AppButton>
  </div>
</template>
<script setup>
import AppButton from "@/components/common/AppButton.vue";
</script>
