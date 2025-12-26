<template>
    <UFormField :label="field.label">
        <UInput 
            :type="inputType" 
            v-model="fieldValue"
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

// Ensure field.value is an array first (this works because field is reactive)
if (!Array.isArray(props.field.value)) {
    props.field.value = [props.field.value || '']
}

// Use computed with getter/setter for field.value[0]
// Since field is reactive, we can mutate props.field.value[0]
const fieldValue = computed({
    get: () => {
        if (!Array.isArray(props.field.value)) {
            props.field.value = ['']
        }
        return props.field.value[0] ?? ''
    },
    set: (val) => {
        if (!Array.isArray(props.field.value)) {
            props.field.value = []
        }
        props.field.value[0] = val
    }
})
</script>
