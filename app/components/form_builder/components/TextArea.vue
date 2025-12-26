<template>
    <UFormField :label="field.label">
        <UTextarea 
            v-model="localValue"
            :placeholder="field.label" 
            :icon="field.icon" 
        />
    </UFormField>
</template>
<script setup>
import { watch, onMounted } from 'vue'

const props = defineProps({
    field: { type: Object, required: true },
});

onMounted(() => {
    if (!Array.isArray(props.field.value)) {
        props.field.value = [props.field.value || '']
    }
    localValue.value = Array.isArray(props.field.value) ? (props.field.value[0] || '') : ''
})

const localValue = ref('')

watch(() => {
    if (Array.isArray(props.field.value)) {
        return props.field.value[0]
    }
    return ''
}, (newValue) => {
    if (newValue !== localValue.value) {
        localValue.value = newValue || ''
    }
}, { immediate: true })

watch(localValue, (newValue) => {
    if (!Array.isArray(props.field.value)) {
        props.field.value = []
    }
    if (props.field.value[0] !== newValue) {
        props.field.value[0] = newValue
    }
})
</script>
