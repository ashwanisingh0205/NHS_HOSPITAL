<template>
  <div class="h-screen overflow-hidden flex flex-col relative">
    <!-- Blurred Background Image -->
    <div 
      class="absolute inset-0 bg-cover bg-center bg-no-repeat blur-xs -z-4"
       :style="hospitalImage 
    ? { backgroundImage: `url(${hospitalImage})` } 
    : { backgroundColor: 'teal-50' }"
    ></div>
    
    
    <!-- Page Content -->
    <slot />
  </div>
</template>

<script setup>
import hospitalImage from "~/assets/images/nhs2.png";
</script>

