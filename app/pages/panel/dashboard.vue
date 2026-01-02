<template>
  <div class="p-6 space-y-6 bg-gray-50 dark:bg-gray-950 min-h-screen">
    <!-- Key Metrics Section -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
      <!-- NPS Card -->
      <StatsCard
        icon="lucide:trending-up"
        icon-color="text-green-600 dark:text-green-400"
        value="93"
        label="NPS"
      />

      <!-- Rounds Card -->
      <StatsCard
        icon="lucide:check-circle"
        icon-color="text-blue-600 dark:text-blue-400"
        value="30"
        label="Rounds"
      />

     

     
    </div>

    <!-- Trend Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <!-- NPS Trend Chart -->
      <GraphCard
        title="NPS Trend"
        :data="npsTrendData"
        :width="600"
        :height="280"
      />

      <!-- Feedback Trends Chart -->
      <BarCard
        title="Feedback Trends"
        :data="feedbackTrendData"
        :width="600"
        :show-menu="true"
      />
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'home'
})

import StatsCard from '~/components/Card/StatsCard.vue'
import GraphCard from '~/components/Card/GraphCard.vue'
import BarCard from '~/components/Card/BarCard.vue'

// NPS Trend Data
const npsTrendData = [
  { label: '25 Dec', value: 13 },
  { label: '26 Dec', value: 15.5 },
  { label: '27 Dec', value: 15.2 },
  { label: '28 Dec', value: 20 },
  { label: '30 Dec', value: 13.9 },
  { label: '31 Dec', value: 12.9 }
]

// Feedback Trends Data
const feedbackTrendData = [
  { label: '25 Dec', value: 2, color: '#10b981' },
  { label: '26 Dec', value: 2, color: '#10b981' },
  { label: '27 Dec', value: 6, color: '#10b981' },
  { label: '28 Dec', value: 2, color: '#10b981' },
  { label: '30 Dec', value: 11, color: '#10b981' },
  { label: '31 Dec', value: 8, color: '#10b981' }
]
</script>
