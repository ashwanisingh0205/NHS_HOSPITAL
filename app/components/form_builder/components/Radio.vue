<template>
    <UFormField :label="field.label">
        <URadioGroup v-model="field.value" :items="field.choices" :label="field.label" :orientation="field.orientation" />
    </UFormField>
</template>
<script setup>
const props = defineProps({
    field: { type: Object, required: true },
});
</script>
