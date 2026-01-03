<template>
  <UCard class="h-full">
    <div class="flex items-center gap-3 p-3">
      <div class="text-2xl">{{ emoji }}</div>
      <div class="flex-1">
        <div class="text-lg font-bold text-gray-900 dark:text-gray-100">
          {{ percentage }}
        </div>
        <div class="text-xs text-gray-600 dark:text-gray-400">
          {{ label }}
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup>
defineProps({
  emoji: {
    type: String,
    required: true
  },
  percentage: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  }
})
</script>

