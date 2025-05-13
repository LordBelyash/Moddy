<template>
  <div class="bg-[#0f0f0f] text-white min-h-screen">
    <!-- Лоадер -->
    <NuxtLoadingIndicator color="#8b5cf6" :height="3" :throttle="100" />

    <!-- Навигация -->
    <NavBar />

    <!-- Плавный переход -->
    <NuxtPage :transition="{ name: 'fade', mode: 'out-in' }" />
  </div>
</template>

<script setup>
import NavBar from '~/components/NavBar.vue'
</script>
