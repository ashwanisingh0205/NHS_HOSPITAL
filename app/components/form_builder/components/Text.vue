<template>
    <UFormField :label="field.label">
            <UInput 
                v-model="field.value" 
                :placeholder="field.label"
                :icon="field.icon"
                :type="inputType" 
                :maxlength="field.max_value" 
                :minlength="field.min_value"
            >
            </UInput>
    </UFormField>
</template>
<script setup>
const props = defineProps({
    field: { type: Object, required: true },
});

const inputType = computed(() => {
    switch (props.field.data_type) {
        case "NUMBER":
            return "number";
        case "DATE":
            return "date";
        case "DATETIME":
            return "datetime-local";
        default:
            return "text";
    }
});
</script>
