<template>
  <div>
    <h2 class="mb-6 text-2xl font-bold text-gray-900">Mulai Sekarang</h2>
    <form @submit.prevent="handleRegister" class="space-y-6">
      <AppInput
        label="Nama (Opsional)"
        name="displayName"
        v-model="displayName"
        placeholder="Nama Anda"
        autocomplete="name"
      />
      <AppInput
        label="Alamat Email"
        name="email"
        type="email"
        v-model="email"
        required
        placeholder="anda@contoh.com"
        :error="emailError"
        autocomplete="email"
      />
      <AppInput
        label="Password"
        name="password"
        type="password"
        v-model="password"
        required
        placeholder="Buat password (min. 6 karakter)"
        :error="passwordError"
        autocomplete="new-password"
      />
      <AppInput
        label="Konfirmasi Password"
        name="confirmPassword"
        type="password"
        v-model="confirmPassword"
        required
        placeholder="Ulangi password"
        :error="passwordError"
        autocomplete="new-password"
      />
      <p
        v-if="authStore.error && !authStore.error.includes('email')"
        class="text-sm text-red-600"
      >
        {{ authStore.error }}
      </p>
      <div>
        <AppButton
          type="submit"
          variant="primary"
          class="w-full"
          :loading="authStore.loading"
        >
          Buat Akun
        </AppButton>
      </div>
    </form>
    <p class="mt-6 text-sm text-center text-gray-600">
      Sudah punya akun?
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
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import AppInput from "@/components/common/AppInput.vue";
import AppButton from "@/components/common/AppButton.vue";
const router = useRouter();
const authStore = useAuthStore();
const displayName = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const emailError = computed(() =>
  authStore.error?.includes("email-already-in-use")
    ? "Email sudah digunakan."
    : ""
);
const passwordError = computed(() => {
  if (password.value && password.value.length < 6)
    return "Password minimal 6 karakter.";
  if (
    password.value &&
    confirmPassword.value &&
    password.value !== confirmPassword.value
  )
    return "Password tidak cocok.";
  return "";
});
const handleRegister = async () => {
  if (passwordError.value) return;
  authStore.error = null;
  try {
    await authStore.registerUser({
      email: email.value,
      password: password.value,
      displayName: displayName.value,
    });
    router.push({ name: "Dashboard" });
  } catch (error) {
    console.error("Registration failed:", error);
  }
};
</script>
