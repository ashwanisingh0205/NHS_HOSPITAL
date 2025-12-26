<template>
    <UCard class="h-full">
        <div class="flex items-center gap-3">
            <div 
                class="p-3 rounded-lg flex-shrink-0"
                :class="iconBgClass"
            >
                <UIcon :name="icon" class="w-6 h-6" :class="iconColorClass" />
            </div>
            <div class="flex-1 min-w-0">
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ label }}</p>
                <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ value }}</p>
            </div>
        </div>
    </UCard>
</template>

<script setup>
const props = defineProps({
    label: { type: String, required: true },
    value: { type: [String, Number], required: true },
    icon: { type: String, required: true },
    color: { type: String, default: 'primary' }
})

const iconBgClass = computed(() => {
    const colors = {
        green: 'bg-green-100 dark:bg-green-900/30',
        yellow: 'bg-yellow-100 dark:bg-yellow-900/30',
        blue: 'bg-blue-100 dark:bg-blue-900/30',
        red: 'bg-red-100 dark:bg-red-900/30',
        primary: 'bg-primary-100 dark:bg-primary-900/30'
    }
    return colors[props.color] || colors.primary
})

const iconColorClass = computed(() => {
    const colors = {
        green: 'text-green-600 dark:text-green-400',
        yellow: 'text-yellow-600 dark:text-yellow-400',
        blue: 'text-blue-600 dark:text-blue-400',
        red: 'text-red-600 dark:text-red-400',
        primary: 'text-primary-600 dark:text-primary-400'
    }
    return colors[props.color] || colors.primary
})
</script>

