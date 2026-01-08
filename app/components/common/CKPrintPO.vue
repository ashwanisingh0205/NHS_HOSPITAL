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
    icon: { type: String, default: "i-lucide:printer" },
    label: { type: String, default: "Print PO" },
    color: { type: String, default: "neutral" },
})

const emit = defineEmits(['click']);
const handleClick = async () => {
    emit('click')
}
</script>

