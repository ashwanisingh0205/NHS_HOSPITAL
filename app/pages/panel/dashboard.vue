<template>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div class="p-6 space-y-6">
            <!-- Loading State -->
            <CKLoader v-if="loading" />
            
            
            <!-- Error State -->
            <UAlert
                v-else-if="error"
                color="red"
                variant="soft"
                :title="error"
                icon="lucide:alert-circle"
            />
            
            <!-- Dashboard Content -->
            <template v-else>
                <!-- Top Metrics Section - 7 Cards -->
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
                    <!-- NPS Card with Gauge -->
                    <GaugeMetricCard
                        :label="stats.nps?.score?.label || 'NPS'"
                        :value="stats.nps?.score?.value || 0"
                        :min-value="0"
                        :max-value="100"
                        :segments="3"
                        needle-color="#10b981"
                        start-color="#10b981"
                        end-color="#ef4444"
                        :gauge-width="120"
                        :gauge-height="80"
                        value-color="text-green-600 dark:text-green-400"
                    />
                    
                    <!-- Promoters Card -->
                    <StatsCard
                        icon="lucide:check-circle"
                        icon-color="text-green-600 dark:text-green-400"
                        :value="stats.nps?.promoters?.percentage || '0%'"
                        :label="stats.nps?.promoters?.label || 'Promoters'"
                    />
                    
                    <!-- Passives Card -->
                    <StatsCard
                        icon="lucide:check-circle"
                        icon-color="text-orange-600 dark:text-orange-400"
                        :value="stats.nps?.passives?.percentage || '0%'"
                        :label="stats.nps?.passives?.label || 'Passives'"
                    />
                    
                    <!-- Detractors Card -->
                    <StatsCard
                        icon="lucide:check-circle"
                        icon-color="text-red-600 dark:text-red-400"
                        :value="stats.nps?.detractors?.percentage || '0%'"
                        :label="stats.nps?.detractors?.label || 'Detractors'"
                    />
                    
                    <!-- Rounds Card -->
                    <StatsCard
                        icon="lucide:check-circle"
                        icon-color="text-blue-600 dark:text-blue-400"
                        :value="stats.rounds?.value || 0"
                        :label="stats.rounds?.label || 'Rounds'"
                    />
                    
                    <!-- Pending Card -->
                    <StatsCard
                        icon="lucide:alert-circle"
                        icon-color="text-orange-600 dark:text-orange-400"
                        :value="stats.pending?.value || 0"
                        :label="stats.pending?.label || 'Pending'"
                    />
                    
                    <!-- Done Card -->
                    <StatsCard
                        icon="lucide:check"
                        icon-color="text-green-600 dark:text-green-400"
                        :value="stats.done?.value || 0"
                        :label="stats.done?.label || 'Done'"
                    />
                </div>
                
                <!-- Gauge Charts with Breakdown Section -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <!-- C-SAT Gauge -->
                    <GaugeWithBreakdownCard
                        title="C-SAT"
                        :value="stats.csat?.score?.value || 0"
                        :min-value="0"
                        :max-value="100"
                        :segments="4"
                        needle-color="#3b82f6"
                        :custom-segment-stops="[0, 20, 40, 60, 100]"
                        :segment-colors="['#ef4444', '#f59e0b', '#eab308', '#10b981']"
                        :gauge-width="300"
                        :gauge-height="200"
                        :breakdown="csatBreakdown"
                    />
                    
                    <!-- CES Gauge -->
                    <GaugeWithBreakdownCard
                        title="CES"
                        :value="stats.ces?.score?.value || 0"
                        :min-value="0"
                        :max-value="100"
                        :segments="4"
                        needle-color="#3b82f6"
                        :custom-segment-stops="[0, 20, 40, 60, 100]"
                        :segment-colors="['#ef4444', '#f59e0b', '#eab308', '#10b981']"
                        :gauge-width="300"
                        :gauge-height="200"
                        :breakdown="cesBreakdown"
                    />
                </div>
                
                <!-- NPS Trend Chart Section -->
                <div>
                    <GraphCard
                        :title="stats.nps_trends?.title || 'NPS Trend'"
                        :data="npsTrendData"
                        :width="600"
                    />
                </div>
            </template>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { format } from 'date-fns'
import StatsCard from '~/components/Card/StatsCard.vue'
import GraphCard from '~/components/Card/GraphCard.vue'
import GaugeMetricCard from '~/components/Card/GaugeMetricCard.vue'
import GaugeWithBreakdownCard from '~/components/Card/GaugeWithBreakdownCard.vue'
import CKLoader from "~/components/common/CKLoader.vue";

definePageMeta({
    layout: 'home'
})

const { $axios } = useNuxtApp()
const route = useRoute()

// State
const loading = ref(true)
const error = ref(null)
const stats = ref({})

// Fetch dashboard data
const fetchDashboardData = async () => {
    loading.value = true
    error.value = null
    
    try {
        const feedbackId = route.query.feedback_id || 6
        const response = await $axios.get('/feedback/getstats', {
            params: { feedback_id: feedbackId }
        })
        
        if (response.data.success) {
            stats.value = response.data.stats || {}
        } else {
            error.value = response.data.message || 'Failed to load dashboard data'
        }
    } catch (err) {
        error.value = err.response?.data?.message || err.message || 'Failed to load dashboard data'
        console.error('Dashboard API error:', err)
    } finally {
        loading.value = false
    }
}

// C-SAT Breakdown - computed from API data
const csatBreakdown = computed(() => {
    if (!stats.value.csat?.breakdown) {
        return []
    }
    return stats.value.csat.breakdown.map(item => ({
        emoji: item.emoji || '😐',
        percentage: item.percentage || `${item.value || 0}%`,
        label: item.label || ''
    }))
})

// CES Breakdown - computed from API data
const cesBreakdown = computed(() => {
    if (!stats.value.ces?.breakdown) {
        return []
    }
    return stats.value.ces.breakdown.map(item => ({
        emoji: item.emoji || '😐',
        percentage: item.percentage || `${item.value || 0}%`,
        label: item.label || ''
    }))
})

// NPS Trend Data - computed from API data
const npsTrendData = computed(() => {
    if (!stats.value.nps_trends?.data || !Array.isArray(stats.value.nps_trends.data)) {
        return []
    }
    
    return stats.value.nps_trends.data.map(item => {
        let label = ''
        try {
            const date = new Date(item.date)
            label = format(date, 'd MMM')
        } catch {
            label = item.date || ''
        }
        
        return {
            label,
            value: item.value || 0
        }
    })
})

// Load data on mount
onMounted(() => {
    fetchDashboardData()
})
</script>
