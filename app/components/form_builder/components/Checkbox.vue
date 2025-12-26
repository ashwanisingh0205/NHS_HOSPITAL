<template>
    <UFormField :label="field.label">
        <div class="space-y-2">
            <!-- Single checkbox (boolean) -->
            <UCheckbox
                v-if="!field.choices || field.choices.length === 0"
                :model-value="field.value === true || field.value === 'true' || field.value === 1"
                @update:model-value="field.value = $event"
                :label="field.label"
            />
            
            <!-- Multiple checkboxes (array of choices) -->
            <template v-else>
                <UCheckbox
                    v-for="choice in field.choices"
                    :key="choice.id || choice.value || choice.data"
                    :model-value="isSelected(choice.value || choice.data)"
                    @update:model-value="toggleSelection(choice.value || choice.data, $event)"
                    :label="choice.label || choice.name || choice.value || choice.data"
                />
            </template>
        </div>
    </UFormField>
</template>

<script setup>
import { watch } from 'vue'

const props = defineProps({
    field: {
        type: Object,
        required: true
    }
})

// Initialize value as array if it's not already (for multiple checkboxes)
watch(() => props.field.choices, (choices) => {
    if (choices && choices.length > 0 && !Array.isArray(props.field.value)) {
        props.field.value = []
    }
}, { immediate: true })

// Check if a choice is selected
const isSelected = (value) => {
    const fieldValue = props.field.value
    if (!Array.isArray(fieldValue)) {
        return false
    }
    return fieldValue.includes(value) || fieldValue.includes(String(value))
}

// Toggle selection
const toggleSelection = (value, checked) => {
    // Ensure value is an array
    let currentValue = Array.isArray(props.field.value) 
        ? [...props.field.value] 
        : []
    
    if (checked) {
        // Add value if not already present
        if (!currentValue.includes(value) && !currentValue.includes(String(value))) {
            currentValue.push(value)
        }
    } else {
        // Remove value if present
        const index = currentValue.indexOf(value)
        const stringIndex = currentValue.indexOf(String(value))
        if (index > -1) {
            currentValue.splice(index, 1)
        } else if (stringIndex > -1) {
            currentValue.splice(stringIndex, 1)
        }
    }
    
    // Update the field value
    props.field.value = currentValue
}
</script>