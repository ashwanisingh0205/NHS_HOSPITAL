<template>
    <UModal v-model:open="localValue" :dismissible="false" title="New Block">
        <template #body>
            <DynamicForm
                :endPoint="endPoint"
                :params="params"
                @submit="handleFormSubmit"
            />
        </template>
    </UModal>
</template>

<script setup>
import DynamicForm from "~/components/emr/DynamicForm.vue";

const props = defineProps({
    modelValue: { type: String, default: "" },
    endPoint: { type: String, default: "" },
    params: { type: Object, default: {} },
})


const emit = defineEmits(['modelValue', 'handleFormSubmit']);
const handleFormSubmit = async (submitData) => {
    emit('handleFormSubmit')
}

/* --------------- Model Value: emit and bind with 'localValue' --------------- */
const localValue = ref(props.modelValue)
watch(localValue, (val) => {
    emit('update:modelValue', val)
})
watch(() => props.modelValue, (val) => {
    localValue.value = val
})
</script>

