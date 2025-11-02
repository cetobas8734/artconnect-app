<template>
  <div
    class="flex items-center justify-center min-h-screen p-0 bg-gray-100 sm:p-4"
  >
    <div
      class="flex w-full min-h-screen mx-auto overflow-hidden bg-white md:min-h-0 md:max-w-6xl md:rounded-xl md:shadow-auth-card"
      style="min-height: 700px"
    >
      <div class="items-center justify-center hidden w-1/2 p-4 md:flex">
        <div
          class="relative flex flex-col justify-between w-full h-full p-8 overflow-hidden rounded-xl"
          style="background-color: #f4f7ee"
        >
          <div
            class="absolute inset-0 z-0 opacity-50"
            style="
              background-image: url('data:image/svg+xml;utf8,<svg xmlns=&quot;http://www.w3.org/2000/svg&quot; viewBox=&quot;0 0 100 100&quot;><path fill=&quot;%23A7B99D&quot; d=&quot;M50 0 C70 0, 100 30, 100 50 C100 70, 70 100, 50 100 L0 100 Z&quot; opacity=&quot;0.2&quot; /><path fill=&quot;%23E6E8D8&quot; d=&quot;M0 0 H100 V100 L0 50 Z&quot; opacity=&quot;0.5&quot; /></svg>');
              background-size: cover;
              background-repeat: no-repeat;
            "
          ></div>

          <div class="relative z-10 self-start mt-6 text-gray-800">
            <h1 class="mb-4 text-4xl font-bold leading-snug">
              One Workspace for Your Art
            </h1>
          </div>

          <div
            class="absolute z-10 flex items-center space-x-2 text-sm text-gray-700 bottom-6 left-6 right-6"
          >
            <img
              class="w-auto h-4"
              src="@/assets/images/logo-artconnect.png"
              alt="Logo Kecil"
            />
            <span
              >Track artworks, nurture contacts, and streamline sales in one
              focused workspace.</span
            >
          </div>
        </div>
      </div>

      <div class="flex flex-col justify-center w-full p-8 md:w-1/2 lg:p-12">
        <div class="mb-6">
          <div class="flex items-center mb-8">
            <img
              class="w-auto h-8 mr-2"
              src="@/assets/images/logo-artconnect.png"
              alt="Logo"
            />
            <span class="text-xl font-semibold text-artconnect-primary"
              >ArtConnect</span
            >
          </div>
        </div>
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup></script>
