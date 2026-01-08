<template>
    <UButton
        @click="handleClick"
        :icon="icon"
        variant="solid"
        size="sm"
        :color="color">
        {{ label }}
    </UButton>
</template>

<script setup>
const props = defineProps({
    icon: { type: String, default: "i-lucide:file-plus" },
    label: { type: String, default: "Generate GRN" },
    color: { type: String, default: "primary" },
})

const emit = defineEmits(['click']);
const handleClick = async () => {
    emit('click')
}
</script>

