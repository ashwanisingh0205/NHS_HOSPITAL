<template>
    <div class="flex items-center gap-1">
        <UButton
            v-for="rating in maxRating"
            :key="rating"
            :variant="isActive(rating) ? 'solid' : 'outline'"
            :color="isActive(rating) ? 'primary' : 'gray'"
            @click="emit('update:modelValue', rating)"
            @mouseenter="hoveredRating = rating"
            @mouseleave="hoveredRating = null"
            size="md"
            square
            class="transition-all duration-200"
        >
            <span class="text-xl">{{ emojis[rating - 1] }}</span>
        </UButton>
        <span v-if="modelValue > 0" class="ml-3 text-sm font-medium text-gray-600 dark:text-gray-400">
            {{ modelValue }}/{{ maxRating }}
        </span>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
    modelValue: { type: Number, default: 0 },
    maxRating: { type: Number, default: 5 },
    emojis: { 
        type: Array, 
        default: () => ['😕', '😐', '🙂', '😊', '😄']
    }
})

const emit = defineEmits(['update:modelValue'])

const hoveredRating = ref(null)

const isActive = (rating) => rating <= (hoveredRating.value || props.modelValue)
</script>