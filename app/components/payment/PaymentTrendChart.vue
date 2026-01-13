<template>
  <UCard ref="cardRef" class="h-full" :ui="{ root: 'overflow-visible', body: '!px-0 !pt-0 !pb-3' }">
    <template #header>
      <div>
        <h3 class="text-sm font-semibold">{{ data.title || 'Payment Trend' }}</h3>
        <p class="text-xs text-gray-500 dark:text-gray-400">{{ data.subtitle || 'Daily total vs paid amounts.' }}</p>
      </div>
    </template>
    
    <div ref="chartRef" class="h-64 w-full">
      <VisXYContainer
        :data="chartData"
        :padding="{ top: 10, bottom: 0, left: 20, right: 10 }"
        class="h-full w-full"
        :width="width"
      >
        <VisGroupedBar
          :x="x"
          :y="yAccessors"
          :color="barColor"
          :bar-padding="0.2"
        />
        <VisAxis
          type="x"
          :x="x"
          :tick-format="xTicks"
          :grid-line="false"
        />
        <VisAxis
          type="y"
          :y="yTotal"
          :grid-line="true"
          :tick-format="yTicks"
        />
        <VisTooltip :template="template" />
      </VisXYContainer>
      
      
      <div class="flex items-center justify-center gap-2 mt-3">
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded" style="background-color: #06b6d4"></div>
          <span class="text-xs text-gray-600 dark:text-gray-400">Total Amount</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded" style="background-color: #10b981"></div>
          <span class="text-xs text-gray-600 dark:text-gray-400">Paid Amount</span>
        </div>
      </div>
      
    </div>
  </UCard>
</template>

<script setup>
import { computed, ref } from 'vue'
import { VisXYContainer, VisGroupedBar, VisAxis, VisTooltip } from '@unovis/vue'
import { format } from 'date-fns'

const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: () => ({
      title: 'Payment Trend',
      subtitle: 'Daily total vs paid amounts.',
      data: []
    })
  }
})

const cardRef = ref(null)
const chartRef = ref(null)

const { width: containerWidth } = useElementSize(cardRef)

// Create data for grouped bars
const chartData = computed(() => 
  props.data.data.map((item, index) => ({
    x: index,
    date: item.date,
    paidAmount: item.paidAmount,
    totalAmount: item.totalAmount
  }))
)

const width = computed(() => containerWidth.value || 600)

const x = (d) => d.x
const yTotal = (d) => d.totalAmount
const yPaid = (d) => d.paidAmount

// Array of accessor functions for grouped bars
const yAccessors = [yTotal, yPaid]

// Color function for grouped bars
const barColor = (d, i) => {
  // i is the series index: 0 = Total Amount (teal), 1 = Paid Amount (green)
  return i === 0 ? '#06b6d4' : '#10b981'
}

const xTicks = (i) => {
  const item = props.data.data[i]
  return item ? format(new Date(item.date), 'd MMM') : ''
}

const yTicks = (value) => {
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(value)
}

const template = (d) => {
  return `${format(new Date(d.date), 'd MMM')}: Total ₹${yTicks(d.totalAmount)}, Paid ₹${yTicks(d.paidAmount)}`
}
</script>

<style scoped>
:deep(.unovis-xy-container) {
  --vis-axis-grid-color: var(--ui-border);
  --vis-axis-tick-color: var(--ui-border);
  --vis-axis-tick-label-color: var(--ui-text-dimmed);
  --vis-tooltip-background-color: var(--ui-bg);
  --vis-tooltip-border-color: var(--ui-border);
  --vis-tooltip-text-color: var(--ui-text-highlighted);
}
</style>
