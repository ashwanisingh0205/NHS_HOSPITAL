<template>
  <UCard>
    <template #header>
      <div>
        <h3 class="text-sm font-semibold">{{ title }}</h3>
        <p class="text-xs text-gray-500 dark:text-gray-400">{{ subtitle }}</p>
      </div>
    </template>
    
    <div ref="chartRef" class="h-48 flex items-center justify-center">
      <VisSingleContainer
        :data="chartData"
        class="h-full w-full"
      >
        <VisDonut
          :value="value"
          :color="donutColor"
        />
      </VisSingleContainer>
    </div>
    
    <div class="mt-2 space-y-1.5">
      <div 
        v-for="(item, index) in legendData" 
        :key="index"
        class="flex items-center justify-between text-sm"
      >
        <div class="flex items-center gap-2">
          <div 
            class="w-3 h-3 rounded-full" 
            :style="{ backgroundColor: item.color }"
          ></div>
          <span>{{ item.label }}</span>
        </div>
        <span class="font-medium">{{ item.percentage }}%</span>
      </div>
    </div>
  </UCard>
</template>

<script setup>
import { computed, ref } from 'vue'
import { VisSingleContainer, VisDonut } from '@unovis/vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Payment Status'
  },
  subtitle: {
    type: String,
    default: 'Paid vs Pending breakdown.'
  },
  data: {
    type: Array,
    required: true
  }
})

const chartRef = ref(null)

const chartData = computed(() => props.data.map(d => d.value))

const value = (d) => d

const donutColor = (d, i) => {
  return props.data[i]?.color || '#10b981'
}

const legendData = computed(() => {
  const total = props.data.reduce((sum, item) => sum + item.value, 0)
  return props.data.map(item => ({
    ...item,
    percentage: total > 0 ? Math.round((item.value / total) * 100) : 0
  }))
})
</script>

<style scoped>
:deep(.unovis-single-container) {
  --vis-donut-segment-stroke-color: var(--ui-bg);
  --vis-donut-segment-stroke-width: 2;
}
</style>
