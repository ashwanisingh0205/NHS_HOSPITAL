<template>
  <div class="h-screen overflow-hidden flex flex-col relative">
    <!--  Background Image -->
    <div 
      class="absolute inset-0 bg-cover bg-center bg-no-repeat blur-xs z-0 "
       :style="hospitalImage 
    ? { backgroundImage: `url(${hospitalImage})` } 
    : { backgroundColor: '#E0F2F1' }"
    ></div>
    
    <!-- Background Overlay for dark mode -->
    <div class="absolute inset-0 bg-gray-50/40 dark:bg-gray-900/70 transition-colors duration-200 z-0"></div>
    
    
    <!-- Page Content -->
    <slot />
  </div>
</template>

<script setup>
import hospitalImage from "~/assets/images/nhs2.png";
</script>

