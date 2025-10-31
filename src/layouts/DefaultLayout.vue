<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar />
    <main class="pb-10">
      <router-view />
    </main>
  </div>
</template>
<script setup>
import Navbar from "@/components/common/Navbar.vue";
</script>
