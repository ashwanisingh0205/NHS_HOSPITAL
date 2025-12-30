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

const { $axios } = useNuxtApp()
const emit = defineEmits(['update:modelValue', 'handleFormSubmit']);

const handleFormSubmit = async (submitData) => {
    if (submitData?.error) {
        alert(submitData.error?.message || 'Failed to submit form');
        return;
    }
    
    // If endPoint is provided and staticForm is used, handle submission here
    if (props.endPoint && props.staticForm) {
        try {
            const payload = submitData?.payload || {};
            const isEdit = !!props.params?.id || !!props.id;
            
            // Convert NUMBER fields to numbers
            const processedPayload = { ...payload };
            if (payload.corporate_id) processedPayload.corporate_id = Number(payload.corporate_id);
            if (payload.unit_id) processedPayload.unit_id = Number(payload.unit_id);
            if (payload.category_id) processedPayload.category_id = Number(payload.category_id);
            if (payload.form_id) processedPayload.form_id = Number(payload.form_id);
            if (payload.priority !== undefined) processedPayload.priority = Number(payload.priority) || 0;
            
            if (isEdit) {
                await $axios.patch(props.endPoint, processedPayload, {
                    params: { id: props.params?.id || props.id }
                });
            } else {
                await $axios.post(props.endPoint, processedPayload);
            }
            
            localValue.value = false;
            emit('handleFormSubmit', submitData);
        } catch (err) {
            console.error('Form submit error:', err);
            alert(err.response?.data?.message || 'Failed to submit form');
            emit('handleFormSubmit', { error: err.response?.data || err.message });
        }
    } else {
        // Just pass through to parent
        emit('handleFormSubmit', submitData);
    }
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

