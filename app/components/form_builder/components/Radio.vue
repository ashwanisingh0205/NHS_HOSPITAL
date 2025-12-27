<template>
    <UFormField :label="field.label">
        <URadioGroup 
            v-model="fieldValue"
            :options="fieldOptions"
            :orientation="field.orientation || 'horizontal'" 
        />
    </UFormField>
</template>

<script setup>
import { onMounted } from 'vue'

const props = defineProps({
    field: { type: Object, required: true },
});

// Format choices for URadioGroup
const fieldOptions = computed(() => {
    if (!props.field.choices || !Array.isArray(props.field.choices)) {
        return []
    }
    return props.field.choices.map(choice => {
        if (typeof choice === 'string') {
            return { label: choice, value: choice }
        }
        return {
            label: choice.label || choice.name || choice.value || choice.data || '',
            value: choice.value || choice.data || choice.label || choice.name || ''
        }
    })
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
