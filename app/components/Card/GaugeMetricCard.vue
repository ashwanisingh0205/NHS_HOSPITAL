<template>
    <UCard class="h-full flex items-stretch">
        <div class="flex flex-col items-center justify-center p-4 w-full">
            <div class="w-full mb-2 flex justify-center">
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
                    :textColor="'transparent'"
                />
            </div>
            <div class="text-center w-full">
                <div class="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {{ label }}
                </div>
                <div class="text-2xl font-bold mt-1" :class="valueColor">
                    {{ displayValue }}
                </div>
            </div>
        </div>
    </UCard>
</template>

<script setup>
import { computed } from 'vue'
import VueSpeedometer from 'vue-speedometer'

const props = defineProps({
    label: {
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
        default: 3
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
        default: 120
    },
    gaugeHeight: {
        type: Number,
        default: 80
    },
    customSegmentStops: {
        type: Array,
        default: () => []
    },
    segmentColors: {
        type: Array,
        default: () => []
    },
    ringWidth: {
        type: Number,
        default: 20
    },
    needleHeightRatio: {
        type: Number,
        default: 0.7
    },
    valueColor: {
        type: String,
        default: 'text-gray-900 dark:text-gray-100'
    },
    displayValue: {
        type: [String, Number],
        default: null
    }
})

const displayValue = computed(() => {
    if (props.displayValue !== null) {
        return props.displayValue
    }
    return props.value
})
</script>

