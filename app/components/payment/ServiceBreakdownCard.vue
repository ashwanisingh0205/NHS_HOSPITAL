<template>
  <UCard class="h-full flex flex-col" ">
    <template #header>
      <div class="flex items-center gap-3">
        <div class="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 flex-shrink-0">
          <UIcon :name="icon" class="w-5 h-5" :class="iconColor" />
        </div>
        <h3 class="font-semibold text-gray-900 dark:text-gray-100">{{ title }}</h3>
      </div>
    </template>
    
    <div class="flex-1 flex flex-col space-y-2">
      <!-- Remaining Amount Section -->
      <div class="flex flex-col">
        <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
          Remaining Amount
        </p>
        <p class="text-3xl font-bold leading-tight" :class="amountColor">
          ₹{{ formatNumber(remainingAmount) }}
        </p>
      </div>
      
      <!-- Amount Details -->
      <div class="space-y-2.5 py-3 border-t border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <span class="text-sm text-gray-600 dark:text-gray-400">Paid Amount</span>
          <span class="text-sm font-semibold text-gray-900 dark:text-gray-100">
            ₹{{ formatNumber(paidAmount) }}
          </span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-sm text-gray-600 dark:text-gray-400">Total Amount</span>
          <span class="text-sm font-semibold text-gray-900 dark:text-gray-100">
            ₹{{ formatNumber(totalAmount) }}
          </span>
        </div>
      </div>
      
      <!-- Progress Bar -->
      <div class="space-y-1.5">
        <div class="flex items-center justify-between text-xs">
          <span class="text-gray-500 dark:text-gray-400">Payment Progress</span>
          <span class="font-medium text-gray-700 dark:text-gray-300">
            {{ progressPercentage }}%
          </span>
        </div>
        <UProgress 
          :value="progressPercentage" 
          :color="progressColor"
          size="md"
          class="w-full"
        />
      </div>
      
      <!-- Action Buttons -->
      <div class="flex gap-2 pt-2 mt-auto">
        <UButton 
          color="info" 
          variant="solid" 
          block
          size="sm"
          icon="lucide:wallet"
          class="flex-1"
          @click="$emit('add-payment')">
          Add Payment
        </UButton>
        <UButton 
          color="neutral" 
          variant="outline" 
          block
          size="sm"
          icon="lucide:plus-circle"
          class="flex-1"
          @click="$emit('add-service')">
          Add Service
        </UButton>
      </div>
    </div>
  </UCard>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  iconColor: {
    type: String,
    default: 'text-blue-600'
  },
  totalAmount: {
    type: Number,
    default: 0
  },
  paidAmount: {
    type: Number,
    default: 0
  },
  progressColor: {
    type: String,
    default: 'green'
  },
  amountColor: {
    type: String,
    default: 'text-gray-900 dark:text-gray-100'
  }
})

defineEmits(['add-payment', 'add-service'])

const remainingAmount = computed(() => props.totalAmount - props.paidAmount)

const progressPercentage = computed(() => {
  if (props.totalAmount === 0) return 0
  return Math.round((props.paidAmount / props.totalAmount) * 100)
})

const formatNumber = (value) => {
  return new Intl.NumberFormat('en-IN').format(value)
}
</script>
