<template>
    <div class="">
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

/* ------------------ Page Meta ------------------ */
definePageMeta({ layout: 'home' });

const { $axios } = useNuxtApp()

/* ------------------ Default Variables ------------------ */
const title = ref("Patient Registration");
const endPoint = ref("/form/defaultForm");
const formCode = ref("patient_registration");
const params = ref({});
const id = ref('');
const error = ref(null);
const successMessage = ref(null);
const formStructure = ref(null);

/* ------------------ Load Form Structure ------------------ */
onMounted(async () => {
    try {
        const response = await $axios.get(endPoint.value, {
            params: {
                form: 'true',
                form_code: formCode.value
            }
        });
        
        if (!response.data.success) {
            error.value = response.data.message || 'API returned unsuccessful response';
            return;
        }
        
        // Store the complete form structure (form, fields, fieldMap)
        formStructure.value = {
            form: response.data.form || {},
            fields: response.data.fields || [],
            fieldMap: response.data.fieldMap || {}
        };
        
    } catch (err) {
        error.value = err.response?.data?.message || err.message || 'Failed to load form';
        console.error('API Error:', err);
    }
});

/* ------------------ Form Submit Handler ------------------ */
const handleFormSubmit = async (submitData) => {
    if (submitData?.error) {
        console.error('Form submission error:', submitData.error);
        error.value = submitData.error?.message || 'Form submission failed';
        successMessage.value = null;
        return;
    }
    
    error.value = null;
    successMessage.value = null;
    
    try {
        // Get the form data from DynamicForm
        const formData = submitData.form || {};
        const currentFields = formData.fields || [];
        const payload = submitData.payload || {};
        
        // Build the submission body matching the GET response structure
        if (!formStructure.value) {
            error.value = 'Form structure not loaded. Please refresh the page.';
            return;
        }
        
        // Helper function to extract value from field
        const extractFieldValue = (fieldValue) => {
            if (fieldValue === undefined || fieldValue === null) {
                return '';
            }
            if (Array.isArray(fieldValue)) {
                return fieldValue[0] ?? '';
            }
            return fieldValue;
        };
        
        // Helper function to format value for API
        const formatValueForAPI = (value, dataType) => {
            if (dataType === 'CHECKBOX') {
                // For checkbox, value should be truthy string or empty
                const isTruthy = value === true || value === 'true' || value === 1 || value === '1';
                return isTruthy ? '1' : '';
            }
            return value !== null && value !== undefined ? String(value) : '';
        };
        
        // Map current field values to the original structure (including HIDDEN fields)
        const updatedFields = formStructure.value.fields.map(field => {
            // Find the corresponding field in the current form data
            const currentField = currentFields.find(f => f.id === field.id || f.field_code === field.field_code);
            
            // Get value with priority: payload (user input) > currentField value > original field value
            let updatedValue = '';
            if (field.field_code && field.field_code in payload) {
                updatedValue = payload[field.field_code];
            } else if (currentField) {
                updatedValue = extractFieldValue(currentField.value);
            } else {
                updatedValue = extractFieldValue(field.value);
            }
            
            // Format value for API
            const finalValue = formatValueForAPI(updatedValue, field.data_type);
            
            // Return field with updated value, preserving all original properties including choices
            return {
                ...field,
                value: [finalValue]
            };
        });
        
        const submitBody = {
            success: true,
            message: "success",
            form: formStructure.value.form || {},
            fields: updatedFields,
            fieldMap: formStructure.value.fieldMap || {}
        };
        
        // Make POST request to /v1/form/defaultForm
        const submitEndpoint = "/form/defaultForm";
        const response = await $axios.post(submitEndpoint, submitBody, {
            params: {
                form_code: formCode.value
            }
        });
        
        if (response.data.success) {
            successMessage.value = 'Patient registration submitted successfully!';
            console.log('Form submitted successfully:', response.data);
            
            // Optionally reset form after successful submission
            // You can reload the form structure if needed
        } else {
            error.value = response.data.message || 'Form submission failed';
        }
        
    } catch (err) {
        console.error('Submit error:', err);
        console.error('Error response:', err.response?.data);
        error.value = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to submit registration';
    }
};

// Auto-clear success message after 5 seconds
watch(successMessage, (newVal) => {
    if (newVal) {
        setTimeout(() => {
            successMessage.value = null;
        }, 5000);
    }
});
</script>
