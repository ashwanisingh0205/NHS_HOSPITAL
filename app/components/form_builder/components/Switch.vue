<template>
    <UFormField :label="field.label">
        <USwitch v-model="field.value" :checked-icon="field.icon" />
    </UFormField>
</template>
<script setup>
const props = defineProps({
    field: { type: Object, required: true },
});
</script>
