<template>
    <UButton
        @click="handleAdd"
        :icon="icon"
        :label="label"
        :color="color" />
</template>

<script setup>
const props = defineProps({
    icon: { type: String, default: "i-lucide:plus" },
    label: { type: String, default: "New" },
    color: { type: String, default: "primary" },
})

const emit = defineEmits(['click']);
const handleAdd = async (submitData) => {
    emit('click')
}
</script>

