<template>
    <UFormField :label="field.label">
        <UInput 
            :type="inputType" 
            v-model="field.value" 
            :placeholder="field.label"
            :icon="field.icon"
            class="w-full"
            :maxlength="field.max_value" 
            :minlength="field.min_value" />
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
