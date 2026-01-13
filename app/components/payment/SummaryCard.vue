<template>
  <UCard class="h-full" :ui="{ body: 'p-4' }" :class="data.cardColor || 'bg-teal-500'">
    <div class=" items-center gap-3">
      <div class="w-10 h-10 p-2 rounded-lg bg-white dark:bg-gray-900/20 flex-shrink-0">
        <UIcon :name="data.icon" :class="data.iconColor || 'text-white'"  class="w-5 h-5  text-white " />
      </div>
      <div class=" min-w-0">
        <p class="text-xs text-white/80 mb-0.5 mt-4">{{ data.title }}</p>
        <p class="text-2xl font-bold text-white leading-tight">₹{{ formatNumber(data.amount) }}</p>
        <p class="text-xs text-white/70 mt-0.5 line-clamp-1">{{ data.subtitle }}</p>
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
      title: '',
      subtitle: '',
      amount: 0,
      icon: '',
      cardColor: 'bg-teal-500',
      iconColor: 'text-white'
    })
  }
})

const formatNumber = (value) => {
  return new Intl.NumberFormat('en-IN').format(value)
}
</script>
