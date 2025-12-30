<template>
    <div class="flex items-center gap-1">
        <UButton
            v-for="star in maxStars"
            :key="star"
            :variant="star <= (hoveredStar || Number(modelValue) || 0) ? 'solid' : 'outline'"
            :color="star <= (hoveredStar || Number(modelValue) || 0) ? 'yellow' : 'gray'"
            @click="updateValue(star)"
            @mouseenter="hoveredStar = star"
            @mouseleave="hoveredStar = null"
            size="md"
            square
        >
            <span v-if="star <= (hoveredStar || Number(modelValue) || 0)">⭐</span>
            <span v-else>✩</span>
        </UButton>
        <span v-if="modelValue > 0" class="ml-2 text-sm text-gray-600 dark:text-gray-400">
            {{ modelValue }}/{{ maxStars }}
        </span>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
    modelValue: { type: [Number, String], default: 0 },
    maxStars: { type: Number, default: 5 }
})

const emit = defineEmits(['update:modelValue'])

const hoveredStar = ref(null)

const updateValue = (rating) => {
    emit('update:modelValue', rating)
}
</script>

