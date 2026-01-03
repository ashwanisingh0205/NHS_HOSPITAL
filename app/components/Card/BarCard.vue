<template>
  <UCard ref="cardRef" :ui="{ root: 'overflow-visible', body: '!px-0 !pt-0 !pb-3' }">
    <template #header>
      <div class="flex items-center justify-between w-full">
        <div>
          <p class="text-xs text-muted uppercase mb-1.5">{{ title }}</p>
          <p class="text-3xl text-highlighted font-semibold">{{ formatNumber(total) }}</p>
        </div>
        
      </div>
    </template>

    <VisXYContainer
      :data="chartData"
      :padding="{ top: 40, bottom: 20, left: 20, right: 20 }"
      class="h-96"
      :width="width"
    >
      <VisStackedBar
        :x="x"
        :y="y"
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
        :y="y"
        :grid-line="true"
        :tick-format="yTicks"
      />
      <VisTooltip :template="template" />
    </VisXYContainer>
  </UCard>
</template>

<script setup>
import { computed, ref } from 'vue'
import { VisXYContainer, VisStackedBar, VisAxis, VisTooltip } from '@unovis/vue'
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
  },
  showMenu: {
    type: Boolean,
    default: false
  }
})

const { width: containerWidth } = useElementSize(cardRef)

const chartData = computed(() => 
  props.data.map((item, index) => {
    const parsedDate = parse(item.label, 'd MMM', new Date())
    const date = isValid(parsedDate) 
      ? parsedDate 
      : new Date(Date.now() - (props.data.length - 1 - index) * 86400000)
    
    return { 
      x: index,
      y: item.value,
      date,
      amount: item.value,
      color: item.color || 'var(--ui-primary)'
    }
  })
)

const x = (d) => d.x
const y = (d) => d.y
const barColor = (d) => d.color

const total = computed(() => 
  chartData.value.reduce((acc, { amount }) => acc + amount, 0)
)

const numberFormatter = new Intl.NumberFormat('en', { maximumFractionDigits: 0 })
const formatNumber = (value) => numberFormatter.format(value)

const formatDate = (date) => format(date, 'd MMM')

const xTicks = (i) => {
  const item = chartData.value[i]
  return item ? formatDate(item.date) : ''
}

const yTicks = (value) => formatNumber(value)

const template = (d) => `${formatDate(d.date)}: ${formatNumber(d.amount)}`

const width = computed(() => containerWidth.value || props.width)
</script>

<style scoped>
.unovis-xy-container {
  --vis-axis-grid-color: var(--ui-border);
  --vis-axis-tick-color: var(--ui-border);
  --vis-axis-tick-label-color: var(--ui-text-dimmed);

  --vis-tooltip-background-color: var(--ui-bg);
  --vis-tooltip-border-color: var(--ui-border);
  --vis-tooltip-text-color: var(--ui-text-highlighted);
}
</style>

