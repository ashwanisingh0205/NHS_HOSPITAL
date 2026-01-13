<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="text-center">
      <div class="w-24 h-24 rounded-full bg-teal-500 flex items-center justify-center mx-auto mb-6">
        <UIcon name="lucide:loader-2" class="w-12 h-12 text-white animate-spin" />
      </div>
      <p class="text-gray-600">Redirecting to welcome screen...</p>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'home'
})

// Redirect to welcome screen on mount
onMounted(() => {
  navigateTo('/testing/welcome')
})
</script>