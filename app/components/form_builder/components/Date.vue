<template>
    <UFormField :label="field.label">
        <UInput 
            :type="inputType"
            v-model="fieldValue"
            :placeholder="field.label"
            :icon="field.icon"
            class="w-full"
        />
    </UFormField>
</template>

<script setup>
import { onMounted } from 'vue'

const props = defineProps({
    field: { type: Object, required: true },
});

// Determine input type based on data_type
const inputType = computed(() => {
    return props.field.data_type === 'DATETIME' ? 'datetime-local' : 'date'
})

// Ensure field.value is an array first
onMounted(() => {
    if (!Array.isArray(props.field.value)) {
        props.field.value = [props.field.value || '']
    }
})

// Use computed with getter/setter for field.value[0]
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
