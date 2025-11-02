<template>
  <div>
    <h2 class="mb-6 text-2xl font-bold text-gray-900">Lupa Password?</h2>
    <p class="mb-6 text-sm text-gray-600">
      Masukkan alamat email Anda dan kami akan mengirimkan link untuk mereset
      password Anda.
    </p>
    <div
      v-if="successMessage"
      class="p-3 mb-4 text-sm text-green-700 bg-green-100 border border-green-200 rounded"
    >
      {{ successMessage }}
    </div>
    <form v-else @submit.prevent="handleReset" class="space-y-6">
      <AppInput
        label="Alamat Email"
        name="email"
        type="email"
        v-model="email"
        required
        placeholder="anda@contoh.com"
        :error="authStore.error"
        autocomplete="email"
      />
      <div>
        <AppButton
          type="submit"
          variant="primary"
          class="w-full"
          :loading="loading"
        >
          Kirim Link Reset
        </AppButton>
      </div>
    </form>
    <p class="mt-6 text-sm text-center text-gray-600">
      Ingat password Anda?
      <router-link
        :to="{ name: 'Login' }"
        class="font-medium text-indigo-600 hover:text-indigo-500"
      >
        Masuk
      </router-link>
    </p>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import AppInput from "@/components/common/AppInput.vue";
import AppButton from "@/components/common/AppButton.vue";
const authStore = useAuthStore();
const email = ref("");
const loading = ref(false);
const successMessage = ref("");
const handleReset = async () => {
  loading.value = true;
  successMessage.value = "";
  authStore.error = null;
  try {
    await authStore.resetPassword(email.value);
    successMessage.value = "Link reset password terkirim! Cek email Anda.";
  } catch (error) {
    console.error("Password reset failed:", error);
  } finally {
    loading.value = false;
  }
};
</script>
