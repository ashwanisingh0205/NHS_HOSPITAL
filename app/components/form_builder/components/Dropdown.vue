<template>
    <UFormField :label="field.label">
        <USelectMenu v-model="field.value" :icon="field.icon" />
    </UFormField>
</template>
<script setup>
const props = defineProps({
    field: { type: Object, required: true },
});
</script>
