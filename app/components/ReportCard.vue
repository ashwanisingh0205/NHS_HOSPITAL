<script setup>
const props = defineProps({
  item:Object,
})

const colorMap = {
  'Total Admission': { icon: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30' },
  'Total Discharge': { icon: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30' },
  'Cashless Admission': { icon: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30' },
  'Cashless Discharge': { icon: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-900/30' }
}

const styles = computed(() => {
  const key = Object.keys(colorMap).find(k => props.title?.includes(k))
  return key ? colorMap[key] : { icon: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-100 dark:bg-gray-900/30' }
})

console.log(item)
</script>

<template>
  <UCard class="h-full ">
    <div class="p-6">
      <div class="flex items-start gap-4">
        <div :class="['p-3 rounded-lg', styles.bg]">
          <UIcon :name="item.icon" :class="['w-6 h-6', styles.icon]" />
        </div>
        <div class="flex-1">
          <p class="text-4xl font-bold text-gray-900 dark:text-white mb-2">{{ item.count }}</p>
          <p class="text-base font-medium text-gray-600 dark:text-gray-400">{{ item.title }}</p>
        </div>
      </div>
    </div>
  </UCard>
</template>
