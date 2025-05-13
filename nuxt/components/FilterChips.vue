<template>
    <div class="flex flex-wrap gap-2">
      <button
        v-for="item in items"
        :key="item.slug"
        @click="onSelect(item.slug)"
        :class="[
          'px-3 py-1 rounded-full text-sm transition font-medium',
          selected === item.slug
            ? 'bg-violet-500 text-white'
            : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
        ]"
      >
        {{ item.name }}
      </button>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps<{
    items: { name: string; slug: string }[]
    selected: string | null
    onSelect: (slug: string) => void
  }>()
  </script>
  