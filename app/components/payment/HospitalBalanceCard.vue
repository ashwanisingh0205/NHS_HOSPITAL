<template>
  <UCard class="bg-teal-500 text-white">
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon name="lucide:building-2" class="w-5 h-5 text-white" />
        <h3 class="font-semibold text-white">Hospital Balance</h3>
      </div>
    </template>
    
    <div class="space-y-4">
      <div>
        <p class="text-4xl font-bold text-white mb-2">₹{{ formatNumber(data.currentBalance) }}</p>
      </div>
      
      <div class="space-y-2 pt-4 border-t border-white/20">
        <div class="flex justify-between text-sm">
          <span class="text-white/80">Total Bill</span>
          <span class="font-medium text-white">₹{{ formatNumber(data.totalBill) }}</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-white/80">Total Paid</span>
          <span class="font-medium text-white">₹{{ formatNumber(data.totalPaid) }}</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-white/80">Remaining</span>
          <span class="font-medium text-white">₹{{ formatNumber(remaining) }}</span>
        </div>
      </div>
      
      <UButton 
        color="neutral" 
        variant="solid" 
        block
        icon="lucide:wallet"
        class="mt-4 text-white"
        @click="$emit('collect-payment')">
        Collect Payment
      </UButton>
    </div>
  </UCard>
</template>

<script setup>
const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: () => ({
      currentBalance: 0,
      totalBill: 0,
      totalPaid: 0
    })
  }
})

defineEmits(['collect-payment'])

const remaining = computed(() => props.data.totalBill - props.data.totalPaid)

const formatNumber = (value) => {
  return new Intl.NumberFormat('en-IN').format(value)
}
</script>
