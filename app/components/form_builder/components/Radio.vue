<template>
    <UFormField :label="field.label">
        <URadioGroup 
            v-model="fieldValue"
            :items="field.choices" 
            :label="field.label" 
            :orientation="field.orientation" 
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
        props.field.value = [props.field.value]
    }
})

const fieldValue = computed({
    get: () => {
        if (!Array.isArray(props.field.value)) {
            props.field.value = [props.field.value]
        }
        return props.field.value[0]
    },
    set: (newValue) => {
        if (!Array.isArray(props.field.value)) {
            props.field.value = []
        }
        props.field.value[0] = newValue
    }
})
</script>
