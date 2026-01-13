<template>
  <UCard>
    <div class="flex items-center justify-between flex-wrap gap-6">
      <!-- Date Selector Section -->
      <div class="flex flex-col gap-3">
        <!-- Header -->
        <div class="flex items-center gap-2">
          <UIcon name="lucide:calendar" class="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
            Show Bill for Selected Date
          </span>
        </div>
        
        <!-- Date Buttons -->
        <div class="flex gap-2">
          <button
            v-for="(day, index) in data.weekDays"
            :key="index"
            @click="handleDateSelect(day.date)"
            class="flex flex-col items-center justify-center w-12 h-14 rounded-lg transition-all"
            :class="data.selectedDate === day.date 
              ? 'bg-teal-500 text-white shadow-sm' 
              : 'bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-600'"
          >
            <span class="text-xs font-medium leading-tight">{{ day.label }}</span>
            <span class="text-base font-semibold leading-tight mt-0.5">{{ getDateNumber(day.date) }}</span>
          </button>
        </div>
      </div>
      
      <!-- Action Buttons -->
      <div class="flex gap-2 flex-wrap">
        <UButton
          color="gray"
          variant="outline"
          size="sm"
          icon="lucide:plus-circle"
          @click="$emit('add-service')"
        >
          Add Service
        </UButton>
        <UButton
          color="gray"
          variant="outline"
          size="sm"
          icon="lucide:wallet"
          @click="$emit('add-payment')"
        >
          Add Payment
        </UButton>
        <UButton
          color="gray"
          variant="outline"
          size="sm"
          icon="lucide:tag"
          @click="$emit('add-discount')"
        >
          Add Discount
        </UButton>
      </div>
    </div>
  </UCard>
</template>

<script setup>
const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: () => ({
      weekDays: [],
      selectedDate: ''
    })
  }
})

const emit = defineEmits(['date-select', 'add-service', 'add-payment', 'add-discount'])

const handleDateSelect = (date) => {
  emit('date-select', date)
}

const getDateNumber = (dateString) => {
  // Extract day number from date string (e.g., "2025-01-05" -> "5")
  const date = new Date(dateString)
  return date.getDate()
}
</script>
