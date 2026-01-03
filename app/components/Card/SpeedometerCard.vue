<template>
  <UCard ref="cardRef" :ui="{ root: 'overflow-visible', body: '!px-0 !pt-0 !pb-3' }">
    <template #header>
      <div>
        <p class="text-xs text-muted uppercase mb-1.5">{{ title }}</p>
        <p class="text-3xl text-highlighted font-semibold">{{ formatNumber(value) }}</p>
      </div>
    </template>

    <div class="flex items-center justify-center p-4" :style="{ height: '384px' }">
      <VueSpeedometer
        :value="value"
        :min-value="minValue"
        :max-value="maxValue"
        :segments="segments"
        :needle-color="needleColor"
        :start-color="startColor"
        :end-color="endColor"
        :current-value-text="currentValueText"
        :text-color="textColor"
        :width="width"
        :height="height"
      />
    </div>
  </UCard>
</template>

<script setup>
import { ref } from 'vue'
import VueSpeedometer from 'vue-speedometer'

const cardRef = ref(null)

const props = defineProps({
  title: {
    type: String,
    default: 'Speedometer'
  },
  value: {
    type: Number,
    required: true,
    default: 0
  },
  minValue: {
    type: Number,
    default: 0
  },
  maxValue: {
    type: Number,
    default: 100
  },
  segments: {
    type: Number,
    default: 5
  },
  needleColor: {
    type: String,
    default: '#3b82f6'
  },
  startColor: {
    type: String,
    default: '#10b981'
  },
  endColor: {
    type: String,
    default: '#ef4444'
  },
  currentValueText: {
    type: String,
    default: ''
  },
  textColor: {
    type: String,
    default: '#6b7280'
  },
  width: {
    type: Number,
    default: 300
  },
  height: {
    type: Number,
    default: 300
  }
})

const numberFormatter = new Intl.NumberFormat('en', { maximumFractionDigits: 0 })
const formatNumber = (value) => numberFormatter.format(value)
</script>

<style scoped>
/* Speedometer styling */
</style>

