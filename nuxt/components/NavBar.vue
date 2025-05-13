<template>
    <header class="bg-[#0f0f0f] border-b border-neutral-800">
      <div class="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <!-- Логотип -->
        <NuxtLink to="/" class="text-white font-bold text-lg tracking-tight hover:text-violet-400 transition">
          ModHub
        </NuxtLink>
  
        <!-- Меню -->
        <nav class="hidden md:flex items-center gap-6 text-sm text-neutral-300">
          <NuxtLink to="#new" class="hover:text-white transition">Новые</NuxtLink>
          <NuxtLink to="#popular" class="hover:text-white transition">Популярные</NuxtLink>
          <NuxtLink to="#categories" class="hover:text-white transition">Категории</NuxtLink>
          <NuxtLink to="#games" class="hover:text-white transition">Игры</NuxtLink>
        </nav>
  
        <!-- Правый блок -->
        <div class="flex items-center gap-4">
          <!-- Поиск -->
          <div class="relative text-sm text-neutral-300 hidden sm:block">
            <input
              type="text"
              placeholder="Поиск модов..."
              class="bg-neutral-800 rounded-md px-3 py-1.5 placeholder-neutral-500 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition w-48"
            />
          </div>
  
          <!-- Профиль -->
          <button class="size-8 rounded-full overflow-hidden border border-neutral-700 bg-neutral-800 hover:ring-2 hover:ring-violet-400 transition">
            <!-- Пока заглушка -->
            <img
              src="https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/43.jpg"
              alt="profile"
              class="object-cover w-full h-full"
            />
          </button>
        </div>
      </div>
    </header>
  </template>
  