<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug

const { data: modData, pending, error } = await useFetch(`http://localhost:3000/api/mods/slug/${slug}`)
const mod = computed(() => modData.value?.data ?? null)

function formatDate(date: string) {
  try {
    return new Date(date).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch {
    return date
  }
}
</script>

<template>
  <main class="bg-[#0f0f0f] text-white min-h-screen py-10 px-4">
    <div class="max-w-screen-md mx-auto space-y-10">

      <!-- Загрузка / ошибка -->
      <div v-if="pending" class="text-center text-neutral-400">Загрузка мода...</div>
      <div v-else-if="error || !mod" class="text-center text-red-500">Мод не найден</div>

      <!-- Контент мода -->
      <template v-else>
        <!-- Заголовок -->
        <section class="space-y-2">
          <h1 class="text-3xl font-bold leading-tight">{{ mod.title }}</h1>
          <p class="text-sm text-neutral-400">
            {{ mod.game?.name }} &middot; {{ mod.category?.name }} &middot; {{ formatDate(mod.createdAt) }}
          </p>
        </section>

        <!-- Обложка -->
        <section>
          <div class="rounded-xl overflow-hidden border border-neutral-800 aspect-video shadow">
            <img
              :src="mod.imageUrl"
              :alt="mod.title"
              class="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </section>

        <!-- Описание -->
        <section>
          <article class="prose prose-invert max-w-none text-neutral-200" v-html="mod.description" />
        </section>

        <!-- Теги -->
        <section v-if="mod.tags?.length" class="flex flex-wrap gap-2">
          <NuxtLink
            v-for="tag in mod.tags"
            :key="tag.tag.id"
            :to="`/tag/${tag.tag.slug}`"
            class="px-3 py-1 rounded-full bg-neutral-800 text-sm text-neutral-300 hover:bg-neutral-700 transition"
          >
            {{ tag.tag.name }}
          </NuxtLink>
        </section>

        <!-- Автор -->
        <section class="flex items-center gap-4 text-sm text-neutral-400 mt-4">
          <img
            :src="mod.author?.avatarUrl"
            alt="Аватар"
            class="size-10 rounded-full border border-neutral-700"
          />
          <div>
            <p>Автор: <span class="text-white">{{ mod.author?.username }}</span></p>
            <p class="text-xs">{{ mod.author?.bio }}</p>
          </div>
        </section>

        <!-- Версии -->
        <section v-if="mod.versions?.length" class="space-y-2 pt-6">
          <h2 class="text-lg font-semibold text-white">Версии</h2>
          <ul class="text-sm text-neutral-300 space-y-2">
            <li
              v-for="version in mod.versions"
              :key="version.id"
              class="flex justify-between items-center bg-neutral-900 px-4 py-3 rounded-md border border-neutral-800"
            >
              <div class="flex flex-col">
                <span class="font-medium text-white">{{ version.version }}</span>
                <span class="text-xs text-neutral-400">{{ version.changelog }}</span>
              </div>
              <NuxtLink
                :href="version.fileUrl"
                target="_blank"
                class="px-3 py-1 text-sm bg-violet-600 hover:bg-violet-500 text-white rounded transition"
              >
                Скачать
              </NuxtLink>
            </li>
          </ul>
        </section>
      </template>
    </div>
  </main>
</template>
