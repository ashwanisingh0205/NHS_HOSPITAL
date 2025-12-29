<template>
    <UModal v-model:open="localValue" :dismissible="true" :title="title">
        <template #body>
            <DynamicForm
                :formCode="formCode"
                :endPoint="endPoint"
                :params="params"
                @submit="handleFormSubmit"
                
                
                :staticForm="staticForm"
            />
        </template>
    </UModal>
</template>

<script setup>
import DynamicForm from "~/components/emr/DynamicForm.vue";

const props = defineProps({
    modelValue: { type: Boolean, default: false },
    title: { type: String, default: "Form" },
    endPoint: { type: String, default: "" },
    staticForm: { type: Object, default: null },
    formCode: { type: String, default: "" },
    id: { type: String, default: "" },
    params: { type: Object, default: {} },
})


const emit = defineEmits(['update:modelValue', 'handleFormSubmit']);
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

