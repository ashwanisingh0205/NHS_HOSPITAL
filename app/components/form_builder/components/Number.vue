<template>
    <UFormField :label="field.label">
        <UInput 
            type="number"
            v-model="fieldValue"
            :placeholder="field.label"
            :icon="field.icon"
            class="w-full"
            :min="field.min_value"
            :max="field.max_value"
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
        props.field.value = [props.field.value || 0]
    }
})

// Use computed with getter/setter for field.value[0]
const fieldValue = computed({
    get: () => {
        if (!Array.isArray(props.field.value)) {
            props.field.value = [0]
        }
        return props.field.value[0] ?? 0
    },
    set: (val) => {
        if (!Array.isArray(props.field.value)) {
            props.field.value = []
        }
        props.field.value[0] = val === '' ? 0 : Number(val)
    }
})
</script>

