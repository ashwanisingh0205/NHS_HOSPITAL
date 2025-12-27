<template>
    <UFormField :label="field.label">
        <USwitch 
            v-model="fieldValue"
            :checked-icon="field.icon" 
        />
    </UFormField>
</template>

<script setup>
import { onMounted } from 'vue'

const props = defineProps({
    field: { type: Object, required: true },
});

// Ensure field.value is an array first
onMounted(() => {
    if (!Array.isArray(props.field.value)) {
        props.field.value = [props.field.value || false]
    }
})

// Use computed with getter/setter for field.value[0]
const fieldValue = computed({
    get: () => {
        if (!Array.isArray(props.field.value)) {
            props.field.value = [false]
        }
        return props.field.value[0] ?? false
    },
    set: (val) => {
        if (!Array.isArray(props.field.value)) {
            props.field.value = []
        }
        props.field.value[0] = val
    }
})
</script>
