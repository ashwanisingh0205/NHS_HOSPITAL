<template>
  <UCard ref="cardRef" :ui="{ root: 'overflow-visible', body: '!px-0 !pt-0 !pb-3' }">
    <template #header>
      <div>
        <p class="text-xs text-muted uppercase mb-1.5">{{ title }}</p>
        <p class="text-3xl text-highlighted font-semibold">{{ formatNumber(total) }}</p>
      </div>
    </template>

    <VisXYContainer
      :data="chartData"
      :padding="{ top: 40 }"
      class="h-96"
      :width="width"
    >
      <VisLine :x="x" :y="y" color="var(--ui-primary)" />
      <VisArea :x="x" :y="y" color="var(--ui-primary)" :opacity="0.1" />
      <VisAxis type="x" :x="x" :tick-format="xTicks" />
      <VisCrosshair color="var(--ui-primary)" :template="template" />
      <VisTooltip />
    </VisXYContainer>
  </UCard>
</template>

<script setup>
import { computed, ref } from 'vue'
import { VisXYContainer, VisLine, VisAxis, VisArea, VisCrosshair, VisTooltip } from '@unovis/vue'
import { parse, format, isValid } from 'date-fns'

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
  }
})

const { width: containerWidth } = useElementSize(cardRef)

const chartData = computed(() => 
  props.data.map((item, index) => {
    const parsedDate = parse(item.label, 'd MMM', new Date())
    const date = isValid(parsedDate) 
      ? parsedDate 
      : new Date(Date.now() - (props.data.length - 1 - index) * 86400000)
    
    return { date, amount: item.value }
  })
)

const x = (_, i) => i
const y = (d) => d.amount

const total = computed(() => 
  chartData.value.reduce((acc, { amount }) => acc + amount, 0)
)

const numberFormatter = new Intl.NumberFormat('en', { maximumFractionDigits: 1 })
const formatNumber = (value) => numberFormatter.format(value)

const formatDate = (date) => format(date, 'd MMM')

const xTicks = (i) => {
  const item = chartData.value[i]
  return (i > 0 && i < chartData.value.length - 1 && item) ? formatDate(item.date) : ''
}

const template = (d) => `${formatDate(d.date)}: ${formatNumber(d.amount)}`

const width = computed(() => containerWidth.value || props.width)
</script>

<style scoped>
.unovis-xy-container {
  --vis-crosshair-line-stroke-color: var(--ui-primary);
  --vis-crosshair-circle-stroke-color: var(--ui-bg);

  --vis-axis-grid-color: var(--ui-border);
  --vis-axis-tick-color: var(--ui-border);
  --vis-axis-tick-label-color: var(--ui-text-dimmed);

  --vis-tooltip-background-color: var(--ui-bg);
  --vis-tooltip-border-color: var(--ui-border);
  --vis-tooltip-text-color: var(--ui-text-highlighted);
}
</style>
