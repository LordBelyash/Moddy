<template>
    <article class="group relative w-full rounded-lg overflow-hidden bg-[#1c1c1c] shadow-sm hover:shadow-md transition">
      <!-- Изображение -->
      <NuxtLink :to="`/mods/${mod.slug}`" class="block aspect-video overflow-hidden">
        <img
          :src="mod.imageUrl"
          :alt="mod.title"
          class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </NuxtLink>
  
      <!-- Контент -->
      <div class="p-4 flex flex-col gap-2">
        <!-- Название -->
        <h3 class="text-base font-semibold leading-tight text-white line-clamp-2">
          <NuxtLink :to="`/mods/${mod.slug}`" class="hover:text-violet-400 transition-colors">
            {{ mod.title }}
          </NuxtLink>
        </h3>
  
        <!-- Игра + категория -->
        <p class="text-xs text-neutral-400">
          {{ mod.game?.name }} &middot; {{ mod.category?.name }}
        </p>
  
        <!-- Теги -->
        <div class="flex flex-wrap gap-1 mt-1">
          <span
            v-for="tag in mod.tags"
            :key="tag.tag.id"
            class="px-2 py-0.5 text-[10px] uppercase bg-neutral-800 text-neutral-300 tracking-wide"
          >
            {{ tag.tag.name }}
          </span>
        </div>
  
        <!-- Автор и дата -->
        <div class="mt-auto pt-2 flex justify-between text-[11px] text-neutral-500">
          <span>{{ mod.author?.username }}</span>
          <span>{{ formatDate(mod.createdAt) }}</span>
        </div>
      </div>
    </article>
  </template>
  
  <script setup lang="ts">
  defineProps<{ mod: any }>()
  
  function formatDate(date: string) {
    return new Date(date).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
  </script>
  