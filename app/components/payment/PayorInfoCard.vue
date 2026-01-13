<template>
  <UCard>
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div>
          <h4 class="font-semibold">{{ data.name }}</h4>
          <div class="flex items-center gap-2 mt-1">
            <div class="w-2 h-2 rounded-full bg-green-500"></div>
            <span class="text-xs text-gray-500 dark:text-gray-400">Approved</span>
          </div>
        </div>
      </div>
      
      <div class="flex items-center gap-6">
        <div class="text-center">
          <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Approved Amount</p>
          <p class="text-xl font-bold text-green-600 dark:text-green-400">₹{{ formatNumber(data.approvedAmount) }}</p>
        </div>
        
        <div class="flex items-center gap-2">
          <UIcon name="lucide:calendar" class="w-4 h-4 text-gray-400" />
          <div>
            <p class="text-xs text-gray-500 dark:text-gray-400">Valid Till</p>
            <p class="text-sm font-medium">{{ data.validTill }}</p>
          </div>
        </div>
        
        <UButton 
          color="primary" 
          variant="solid"
          icon="lucide:eye"
          @click="$emit('view')">
          View
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
      name: '',
      approvedAmount: 0,
      validTill: ''
    })
  }
})

defineEmits(['view'])

const formatNumber = (value) => {
  return new Intl.NumberFormat('en-IN').format(value)
}
</script>
