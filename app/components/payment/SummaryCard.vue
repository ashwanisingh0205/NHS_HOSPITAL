<template>
  <UCard class="h-full" :ui="{ body: 'p-4' }" :class="cardColor">
    <div class=" items-center gap-3">
      <div class="w-10 h-10 p-2 rounded-lg bg-white dark:bg-gray-900/20 flex-shrink-0">
        <UIcon :name="icon" :class="iconColor"  class="w-5 h-5  text-white " />
      </div>
      <div class=" min-w-0">
        <p class="text-xs text-white/80 mb-0.5 mt-4">{{ title }}</p>
        <p class="text-2xl font-bold text-white leading-tight">₹{{ formatNumber(amount) }}</p>
        <p class="text-xs text-white/70 mt-0.5 line-clamp-1">{{ subtitle }}</p>
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
  subtitle: {
    type: String,
    default: ''
  },
  amount: {
    type: Number,
    default: 0
  },
  icon: {
    type: String,
    required: true
  },
  cardColor: {
    type: String,
    default: 'bg-teal-500'
  },
  iconColor: {
    type: String,
    default: 'text-white'
  }
})

const formatNumber = (value) => {
  return new Intl.NumberFormat('en-IN').format(value)
}
</script>
