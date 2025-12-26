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

onMounted(() => {
    if (!Array.isArray(props.field.value)) {
        props.field.value = [props.field.value || false]
    }
})

const fieldValue = computed({
    get: () => {
        if (!Array.isArray(props.field.value)) {
            props.field.value = [props.field.value || false]
        }
        return props.field.value[0] || false
    },
    set: (newValue) => {
        if (!Array.isArray(props.field.value)) {
            props.field.value = []
        }
        props.field.value[0] = newValue
    }
})
</script>
