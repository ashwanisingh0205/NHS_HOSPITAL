<template>
    <UModal v-model:open="localValue" :dismissible="false" :title="title">
        <template #body>
            <DynamicForm
                :key="formResetKey"
                :endPoint="endPoint"
                :staticForm="staticForm"
                :formCode="formCode"
                :id="id"
                :params="params"
                @submit="handleFormSubmit"
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

const formResetKey = ref(0);
watch(() => props.params, () => {
    formResetKey.value++;
}, { deep: true });
watch(() => props.id, () => {
    formResetKey.value++;
});
watch(() => props.modelValue, (newVal) => {
    if (newVal) {
        formResetKey.value++;
    }
});


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

