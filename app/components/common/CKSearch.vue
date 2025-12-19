<template>
    <UInput
        v-model="localValue"
        :placeholder="placeholder"
        icon="i-lucide:search"
        class="w-full"
    />
</template>

<script setup>
const props = defineProps({
    modelValue: { type: String, default: "" },
    placeholder: { type: String, default: "Search..." },
})

/* --------------- Model Value: emit and bind with 'localValue' --------------- */
const emit = defineEmits(['update:modelValue'])
const localValue = ref(props.modelValue)
watch(localValue, (val) => {
    emit('update:modelValue', val)
})
watch(() => props.modelValue, (val) => {
    localValue.value = val
})
</script>

