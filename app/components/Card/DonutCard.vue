<template>
  <UCard ref="cardRef" :ui="{ root: 'overflow-visible', body: '!px-0 !pt-0 !pb-3' }">
    <template #header>
      <div>
        <p class="text-xs text-muted uppercase mb-1.5">{{ title }}</p>
        <p class="text-3xl text-highlighted font-semibold">{{ formatNumber(total) }}</p>
      </div>
    </template>

    <VisSingleContainer
      :data="chartData"
      class="h-96"
      :width="width"
    >
      <VisDonut
        :value="value"
        :color="donutColor"
      />
    </VisSingleContainer>
  </UCard>
</template>

<script setup>
import { computed, ref } from 'vue'
import { VisSingleContainer, VisDonut } from '@unovis/vue'

const cardRef = ref(null)

const props = defineProps({
  title: {
    type: String,
    default: 'Chart'
  },
  data: {
    type: Array,
    required: true
  },
  width: {
    type: Number,
    default: 600
  },
  colors: {
    type: Array,
    default: () => []
  }
})

const { width: containerWidth } = useElementSize(cardRef)

const chartData = computed(() => props.data)

const value = (d) => d

const donutColor = (d, i) => {
  if (props.colors && props.colors[i]) {
    return props.colors[i]
  }
  // Default color palette
  const defaultColors = [
    'var(--ui-primary)',
    '#10b981',
    '#3b82f6',
    '#f59e0b',
    '#ef4444',
    '#8b5cf6',
    '#ec4899',
    '#06b6d4'
  ]
  return defaultColors[i % defaultColors.length]
}

const total = computed(() => 
  chartData.value.reduce((acc, val) => acc + val, 0)
)

const numberFormatter = new Intl.NumberFormat('en', { maximumFractionDigits: 0 })
const formatNumber = (value) => numberFormatter.format(value)

const width = computed(() => containerWidth.value || props.width)
</script>

<style scoped>
.unovis-single-container {
  --vis-donut-segment-stroke-color: var(--ui-bg);
  --vis-donut-segment-stroke-width: 2;
}
</style>

