<template>
    <UFormField :label="field.label">
        <UInput 
            v-model="fieldValue"
            :placeholder="field.label"
            class="w-full"
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
