<template>
    <UFormField :label="field.label">
        <UTextarea v-model="field.value" :placeholder="field.label" :icon="field.icon" />
    </UFormField>
</template>
<script setup>
const props = defineProps({
    field: { type: Object, required: true },
});
</script>
