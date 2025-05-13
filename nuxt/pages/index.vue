<!-- pages/index.vue -->
<template>
  <main class="bg-[#0f0f0f] text-white min-h-screen py-10 px-4">
    <div class="max-w-screen-xl mx-auto space-y-16">
      <!-- Слайдер игр -->
      <section>
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-semibold">Игры</h2>
          <NuxtLink to="/games" class="text-sm text-violet-400 hover:underline">Показать все</NuxtLink>
        </div>
        <Swiper
          :modules="[Navigation]"
          :slides-per-view="4"
          :space-between="20"
          navigation
          class="game-swiper"
        >
          <SwiperSlide v-for="game in games" :key="game.id">
            <div class="bg-neutral-800 p-4 rounded-lg">
              <h3 class="text-lg font-bold">{{ game.name }}</h3>
              <p class="text-sm text-neutral-400">{{ game.modsCount }} модов</p>
            </div>
          </SwiperSlide>
        </Swiper>
      </section>

      <!-- Популярные моды -->
      <section>
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-semibold">Популярные моды</h2>
          <NuxtLink to="/mods?sort=popular" class="text-sm text-violet-400 hover:underline">Показать все</NuxtLink>
        </div>
        <Swiper
          :modules="[Navigation]"
          :slides-per-view="4"
          :space-between="20"
          navigation
          class="mod-swiper"
        >
          <SwiperSlide v-for="mod in popularMods" :key="mod.id">
            <div class="bg-neutral-800 p-4 rounded-lg">
              <h3 class="text-lg font-bold">{{ mod.title }}</h3>
              <p class="text-sm text-neutral-400">{{ mod.downloads.length }} загрузок</p>
            </div>
          </SwiperSlide>
        </Swiper>
      </section>

      <!-- Новые моды -->
      <section>
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-semibold">Новые моды</h2>
          <NuxtLink to="/mods?sort=new" class="text-sm text-violet-400 hover:underline">Показать все</NuxtLink>
        </div>
        <Swiper
          :modules="[Navigation]"
          :slides-per-view="4"
          :space-between="20"
          navigation
          class="mod-swiper"
        >
          <SwiperSlide v-for="mod in newMods" :key="mod.id">
            <div class="bg-neutral-800 p-4 rounded-lg">
              <h3 class="text-lg font-bold">{{ mod.title }}</h3>
              <p class="text-sm text-neutral-400">{{ formatDate(mod.createdAt) }}</p>
            </div>
          </SwiperSlide>
        </Swiper>
      </section>

      <!-- Новые сборки -->
      <section>
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-semibold">Новые сборки</h2>
          <NuxtLink to="/builds?sort=new" class="text-sm text-violet-400 hover:underline">Показать все</NuxtLink>
        </div>
        <Swiper
          :modules="[Navigation]"
          :slides-per-view="4"
          :space-between="20"
          navigation
          class="build-swiper"
        >
          <SwiperSlide v-for="build in newBuilds" :key="build.id">
            <div class="bg-neutral-800 p-4 rounded-lg">
              <h3 class="text-lg font-bold">{{ build.title }}</h3>
              <p class="text-sm text-neutral-400">{{ formatDate(build.createdAt) }}</p>
            </div>
          </SwiperSlide>
        </Swiper>
      </section>

      <!-- Популярные сборки -->
      <section>
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-semibold">Популярные сборки</h2>
          <NuxtLink to="/builds?sort=popular" class="text-sm text-violet-400 hover:underline">Показать все</NuxtLink>
        </div>
        <Swiper
          :modules="[Navigation]"
          :slides-per-view="4"
          :space-between="20"
          navigation
          class="build-swiper"
        >
          <SwiperSlide v-for="build in popularBuilds" :key="build.id">
            <div class="bg-neutral-800 p-4 rounded-lg">
              <h3 class="text-lg font-bold">{{ build.title }}</h3>
              <p class="text-sm text-neutral-400">{{ build.downloads.length }} загрузок</p>
            </div>
          </SwiperSlide>
        </Swiper>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import { useFetch } from '#app'

const { data: modsData } = await useFetch('http://localhost:3000/api/mods/')
const { data: buildsData } = await useFetch('http://localhost:3000/api/builds/')
const { data: gamesData } = await useFetch('http://localhost:3000/api/games/')

const mods = computed(() => modsData.value?.data || [])
const builds = computed(() => buildsData.value?.data || [])
const games = computed(() => {
  const gameMap = new Map()
  mods.value.forEach(mod => {
    const game = mod.game
    if (game) {
      if (!gameMap.has(game.id)) {
        gameMap.set(game.id, { ...game, modsCount: 1 })
      } else {
        gameMap.get(game.id).modsCount++
      }
    }
  })
  return Array.from(gameMap.values()).sort((a, b) => b.modsCount - a.modsCount).slice(0, 10)
})

const popularMods = computed(() =>
  [...mods.value].sort((a, b) => (b.downloads?.length ?? 0) - (a.downloads?.length ?? 0)).slice(0, 10)
)

const newMods = computed(() =>
  [...mods.value].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10)
)

const popularBuilds = computed(() =>
  [...builds.value].sort((a, b) => (b.downloads?.length ?? 0) - (a.downloads?.length ?? 0)).slice(0, 10)
)

const newBuilds = computed(() =>
  [...builds.value].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10)
)

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<style scoped>
.swiper-button-next,
.swiper-button-prev {
  color: #a78bfa;
}
</style>
