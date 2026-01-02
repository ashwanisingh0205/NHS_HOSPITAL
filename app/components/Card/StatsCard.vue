<template>
  <UCard class="h-full">
    <div class="flex items-center gap-3 p-3">
      <!-- Icon on the left -->
      <div class="shrink-0">
        <UIcon 
          :name="icon" 
          class="w-8 h-8" 
          :class="iconColor || 'text-blue-600 dark:text-blue-400'" 
        />
      </div>
      
      <!-- Value and Label on the right -->
      <div class="flex-1">
        <div class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-0.5">
          {{ value }}
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
  icon: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  label: {
    type: String,
    required: true
  },
  iconColor: {
    type: String,
    default: 'text-blue-600 dark:text-blue-400'
  }
})
</script>
