<template>
    <h2 class="text-2xl font-semibold mb-6 text-white text-shadow-sm">{{ title }}</h2>
  </template>
  
  <script setup lang="ts">
  defineProps<{ title: string }>()
  </script>
  