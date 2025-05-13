<template>
  <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
    <div
      v-for="mod in mods"
      :key="mod.id"
      class="bg-[#1a1a1c] rounded-xl overflow-hidden shadow-md border border-neutral-800 hover:shadow-lg transition"
    >
      <NuxtLink :to="`/mods/${mod.slug}`" class="block">
        <img
          :src="mod.imageUrl"
          :alt="mod.title"
          class="w-full h-40 object-cover"
        />
        <div class="p-4 space-y-1">
          <h3 class="font-semibold text-white text-base truncate">{{ mod.title }}</h3>
          <p class="text-xs text-neutral-400 truncate">{{ mod.game?.name }}</p>
          <p class="text-xs text-neutral-500 truncate">{{ mod.category?.name }}</p>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ mods: any[] }>()
</script>
