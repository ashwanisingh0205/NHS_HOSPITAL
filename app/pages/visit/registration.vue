<template>
    <div>
        <UCard>
            <template #header>
                <div class="flex items-center justify-between">
                    <h2 class="text-xl font-semibold">{{ title }}</h2>
                </div>
            </template>
            
            <div v-if="error" class="p-4 mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
                <p class="text-red-600 dark:text-red-400">{{ error }}</p>
            </div>
            
            <div v-if="successMessage" class="p-4 mb-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded">
                <p class="text-green-600 dark:text-green-400">{{ successMessage }}</p>
            </div>
            
            <DynamicForm
                :endPoint="endPoint"
                :formCode="formCode"
                :params="params"
                :id="id"
                :noAutoSubmit="true"
                @submit="handleFormSubmit"
            />
        </UCard>
    </div>
</template>

<script setup>
import DynamicForm from "~/components/emr/DynamicForm.vue";

definePageMeta({ layout: 'home' });

const { $axios } = useNuxtApp();

const title = ref("Patient Registration");
const endPoint = ref("/form/defaultForm");
const formCode = ref("patient_registration");
const params = ref({});
const id = ref('');
const error = ref(null);
const successMessage = ref(null);
const formStructure = ref(null);

onMounted(async () => {
    try {
        const response = await $axios.get(endPoint.value, {
            params: {
                form: 'true',
                form_code: formCode.value
            }
        });
        
        if (!response.data.success) {
            error.value = response.data.message || 'Failed to load form';
            return;
        }
        
        formStructure.value = response.data;
        
    } catch (err) {
        error.value = err.response?.data?.message || err.message || 'Failed to load form';
    }
});

const handleFormSubmit = async (submitData) => {
    if (submitData?.error) {
        error.value = submitData.error?.message || 'Form submission failed';
        successMessage.value = null;
        return;
    }
    
    error.value = null;
    successMessage.value = null;
    
    try {
        if (!formStructure.value) {
            error.value = 'Form structure not loaded. Please refresh the page.';
            return;
        }
        
        const payload = submitData.payload || {};
        
        const updatedFields = formStructure.value.fields.map(field => {
            let value = '';
            
            // Check if user provided a value, otherwise use original
            if (field.field_code in payload) {
                value = payload[field.field_code];
            } else {
                value = Array.isArray(field.value) ? (field.value[0] ?? '') : field.value;
            }
            
            // Format value based on data type
            let formattedValue = '';
            if (field.data_type === 'CHECKBOX') {
                formattedValue = value ? '1' : '';
            } else {
                formattedValue = value ? String(value) : '';
            }
            
            return {
                ...field,
                value: [formattedValue]
            };
        });
        
        const submitBody = {
            success: true,
            message: "success",
            form: formStructure.value.form,
            fields: updatedFields,
            fieldMap: formStructure.value.fieldMap
        };
        
        const response = await $axios.post("/form/defaultForm", submitBody, {
            params: { form_code: formCode.value }
        });
        
        if (response.data.success) {
            successMessage.value = 'Patient registration submitted successfully!';
            console.log('Patient registration submitted successfully!', response.data);
        } else {
            error.value = response.data.message || 'Form submission failed';
        }
        
    } catch (err) {
        error.value = err.response?.data?.message || err.message || 'Failed to submit registration';
    }
};

watch(successMessage, (newVal) => {
    if (newVal) {
        setTimeout(() => successMessage.value = null, 5000);
    }
});
</script>