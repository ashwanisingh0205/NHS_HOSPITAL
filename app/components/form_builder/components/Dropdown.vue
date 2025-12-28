<template>
    <UFormField :label="field.label">
        <USelectMenu 
            v-model="fieldValue"
            :items="fieldOptions"
            :icon="field.icon" 
            class="w-full"
            :placeholder="field.label"
        />
    </UFormField>
</template>

<script setup>
import { onMounted } from 'vue'

const props = defineProps({
    field: { type: Object, required: true },
});

// Format choices for USelectMenu
const fieldOptions = computed(() => {
    if (!props.field.choices || !Array.isArray(props.field.choices)) {
        return []
    }
    return props.field.choices.map(choice => {
        if (typeof choice === 'string') {
            return { label: choice, value: choice }
        }
        // Display label, send data value
        // Priority: label for display, data for value (what gets sent to API)
        return {
            label: choice.label || choice.name || choice.value || choice.data || '',
            value: choice.data || choice.value || choice.label || choice.name || ''
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
// Handle object from USelectMenu :items
const fieldValue = computed({
    get: () => {
        if (!Array.isArray(props.field.value)) {
            props.field.value = ['']
        }
        const currentValue = props.field.value[0] ?? ''
        
        // If current value is a string, find matching option object for USelectMenu
        if (typeof currentValue === 'string' && currentValue !== '') {
            const matchingOption = fieldOptions.value.find(opt => opt.value === currentValue)
            return matchingOption || currentValue
        }
        
        // If current value is an object, return it
        if (typeof currentValue === 'object' && currentValue !== null) {
            return currentValue
        }
        
        return ''
    },
    set: (val) => {
        if (!Array.isArray(props.field.value)) {
            props.field.value = []
        }
        
        // USelectMenu with :items returns the entire object, extract the value
        if (typeof val === 'object' && val !== null) {
            // Store only the value property (data value) as string
            props.field.value[0] = val.value || val.label || ''
        } else {
            // Store the value directly if it's already a string
            props.field.value[0] = val || ''
        }
    }
})
</script>
