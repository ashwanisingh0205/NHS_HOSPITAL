<template>
    <div class="flex items-center gap-2">
        <UButton
            v-for="rating in maxRating"
            :key="rating"
            @click="handleClick(rating)"
            :variant="isActive(rating) ? 'solid' : 'primary'"
            :color="isActive(rating) ? getColor(rating) : 'gray'"
            size="md"
            square
            :class="[
                'w-10 h-10 rounded-full ',
                'hover:scale-110',
                isActive(rating) ? getActiveButtonClass(rating) : ''
            ]"
        >
            <Icon 
                :name="`lucide:${emojis[rating - 1]}`" 
                :class="[
                    'w-6 h-6 ',
                    isActive(rating) ? getIconColorClass(rating) : 'text-gray-400 dark:text-gray-500',
                    isActive(rating) && 'icon-filled'
                ]"
            />
        </UButton>
    </div>
</template>

<script setup>
const props = defineProps({
    modelValue: { type: Number, default: 0 },
    maxRating: { type: Number, default: 5 },
    emojis: { 
        type: Array, 
        default: () => ['frown', 'frown', 'meh', 'smile', 'laugh']
    }
})

const emit = defineEmits(['update:modelValue'])

const hoveredRating = ref(null)

const isActive = (rating) => rating <= (hoveredRating.value || props.modelValue)

const getColor = (rating) => {
    const colors = ['red', 'orange', 'yellow', 'green', 'emerald']
    return colors[rating - 1] || 'gray'
}

const getActiveButtonClass = (rating) => {
    const classes = [
        'bg-red-100 dark:bg-red-900/40 shadow-sm',
        'bg-orange-100 dark:bg-orange-900/40 shadow-sm',
        'bg-yellow-100 dark:bg-yellow-900/40 shadow-sm',
        'bg-green-100 dark:bg-green-900/40 shadow-sm',
        'bg-emerald-100 dark:bg-emerald-900/40 shadow-sm'
    ]
    return classes[rating - 1] || 'bg-gray-100 dark:bg-gray-800'
}

const getIconColorClass = (rating) => {
    const classes = [
        'text-red-600 dark:text-red-400',
        'text-orange-600 dark:text-orange-400',
        'text-yellow-600 dark:text-yellow-400',
        'text-green-500 dark:text-green-400',
        'text-emerald-600 dark:text-emerald-400'
    ]
    return classes[rating - 1] || 'text-gray-600 dark:text-gray-400'
}

const handleClick = (rating) => {
    emit('update:modelValue', props.modelValue === rating ? 0 : rating)
}
</script>

