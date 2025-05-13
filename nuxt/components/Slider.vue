<template>
    <div class="slider-container">
      <div class="slider-header">
        <h2>{{ title }}</h2>
        <NuxtLink :to="link">Показать все</NuxtLink>
      </div>
      <Swiper :slides-per-view="4" :space-between="20" navigation pagination>
        <SwiperSlide v-for="item in items" :key="item.id">
          <!-- Отображение элемента (игры, мода или сборки) -->
        </SwiperSlide>
      </Swiper>
    </div>
  </template>
  
  <script setup>
  import { Swiper, SwiperSlide } from 'swiper/vue';
  import 'swiper/css';
  import 'swiper/css/navigation';
  import 'swiper/css/pagination';
  
  defineProps({
    title: String,
    items: Array,
    link: String,
  });
  </script>
  