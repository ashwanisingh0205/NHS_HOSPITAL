<template>
    <UButton
        @click="handleAdd"
        :icon="icon"
        variant="outline"
        size="sm"
        :color="color" />
</template>

<script setup>
const props = defineProps({
    icon: { type: String, default: "i-lucide:pencil" },
    label: { type: String, default: "Edit" },
    color: { type: String, default: "neutral" },
})

const emit = defineEmits(['click']);
const handleAdd = async (submitData) => {
    emit('click')
}
</script>

