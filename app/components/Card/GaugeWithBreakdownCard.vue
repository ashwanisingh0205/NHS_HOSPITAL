<template>
  <UCard>
    <template #header>
      <div class="text-center">
        <p class="text-sm font-semibold">{{ title }}: {{ value }}</p>
      </div>
    </template>

    <div class="space-y-4">
      <!-- Gauge -->
      <div class="flex justify-center">
        <VueSpeedometer
          :value="value"
          :min-value="minValue"
          :max-value="maxValue"
          :segments="segments"
          :needle-color="needleColor"
          :start-color="startColor"
          :end-color="endColor"
          :width="gaugeWidth"
          :height="gaugeHeight"
          :customSegmentStops="customSegmentStops"
          :segmentColors="segmentColors"
          :ringWidth="ringWidth"
          :needleHeightRatio="needleHeightRatio"
        />
      </div>

      <!-- Breakdown Cards -->
      <div class="grid grid-cols-2 gap-2">
        <BreakdownCard
          v-for="(item, index) in breakdown"
          :key="index"
          :emoji="item.emoji"
          :percentage="item.percentage"
          :label="item.label"
        />
      </div>
    </div>
  </UCard>
</template>

<script setup>
import VueSpeedometer from 'vue-speedometer'
import BreakdownCard from './BreakdownCard.vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true
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
    default: 4
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
  gaugeWidth: {
    type: Number,
    default: 300
  },
  gaugeHeight: {
    type: Number,
    default: 200
  },
  customSegmentStops: {
    type: Array,
    default: () => [0, 20, 40, 60, 100]
  },
  segmentColors: {
    type: Array,
    default: () => ['#ef4444', '#f59e0b', '#eab308', '#10b981']
  },
  ringWidth: {
    type: Number,
    default: 30
  },
  needleHeightRatio: {
    type: Number,
    default: 0.7
  },
  breakdown: {
    type: Array,
    required: true
  }
})
</script>

