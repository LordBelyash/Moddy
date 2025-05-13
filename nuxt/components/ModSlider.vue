<template>
    <div class="space-y-4">
      <!-- Заголовок секции -->
      <div class="flex items-center justify-between px-1">
        <h2 class="text-lg font-semibold text-white">{{ title }}</h2>
        <NuxtLink
          v-if="link"
          :to="link"
          class="text-sm text-violet-400 hover:underline"
        >
          Показать больше →
        </NuxtLink>
      </div>
  
      <!-- Горизонтальный скролл -->
      <div class="overflow-x-auto">
        <div class="flex gap-4 min-w-full pb-1 px-1">
          <ModCard
            v-for="mod in mods"
            :key="mod.id"
            :mod="mod"
            class="shrink-0 w-[240px] sm:w-[260px] md:w-[280px]"
          />
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps<{
    title: string
    link?: string
    mods: any[]
  }>()
  </script>
  