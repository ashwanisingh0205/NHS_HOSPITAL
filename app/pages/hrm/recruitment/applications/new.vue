<template>
    <div>
        <div class="mb-6 flex items-center justify-between">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
                New Application
            </h1>
            <UButton variant="outline" icon="lucide:arrow-left" @click="goBack">
                Back
            </UButton>
        </div>

        <UCard v-if="loading">
            <div class="flex items-center justify-center py-12">
                <UIcon name="lucide:loader-2" class="w-6 h-6 animate-spin text-gray-400 dark:text-gray-500" />
                <span class="ml-3 text-gray-600 dark:text-gray-400">Loading form...</span>
            </div>
        </UCard>

        <UCard v-else-if="error">
            <div class="text-center py-8">
                <UError :error="{ statusMessage: error }" />
                <UButton class="mt-4" @click="loadForm">Retry</UButton>
            </div>
        </UCard>

        <div v-else-if="formConfig?.fields?.length" class="space-y-6">
            
            
            <DynamicForm
                key="hr_job_application"
                :formCode="formCode"
                :id="id"
                :params="params"
                @submit="handleFormSubmit"
            />
            
            
            <UForm @submit.prevent="handleSubmit" class="space-y-6">
                <div class="grid grid-cols-3 lg:grid-cols-3 gap-6">
                    <FormRenderer 
                        :fields="formConfig.fields" 
                        :cols="formConfig.form?.cols || 2"
                    />
                </div>
                
                <div class="flex gap-3 pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
                    <UButton type="submit" label="Submit" :loading="submitting" :disabled="submitting" />
                    <UButton type="button" variant="outline" label="Cancel" @click="goBack" />
                </div>
            </UForm>
        </div>

        <UCard v-else>
            <div class="text-center py-8 text-gray-500 dark:text-gray-400">
                <p>No form fields available.</p>
                <p class="text-xs mt-2">Fields count: {{ formConfig?.fields?.length || 0 }}</p>
                <details class="mt-4 text-left">
                    <summary class="cursor-pointer text-sm">Debug Info</summary>
                    <pre class="mt-2 text-xs overflow-auto">{{ JSON.stringify(formConfig, null, 2) }}</pre>
                </details>
            </div>
        </UCard>
    </div>
</template>

<script setup>
import FormRenderer from '~/components/form_builder/FormRenderer.vue'
import DynamicForm from "~/components/emr/DynamicForm.vue";

definePageMeta({
    layout: 'home'
})

const route = useRoute()
const router = useRouter()
const { $axios } = useNuxtApp()

const loading = ref(true)
const error = ref(null)
const submitting = ref(false)
const formConfig = ref(null)

const getInitialValue = (field) => {
    if (field.data_type === 'CHECKBOX') {
        return (field.choices?.length > 0) ? [] : [false]
    }
    if (field.data_type === 'NUMBER') {
        return [field.standard_value || 0]
    }
    if (field.data_type === 'DATE' || field.data_type === 'DATETIME') {
        return ['']
    }
    return ['']
}

const loadForm = async () => {
    loading.value = true
    error.value = null
    
    try {
        const { data } = await $axios.get('/form/defaultForm', {
            params: {
                form_code: 'hr_job_application',
                form: 'true'
            }
        })
        
        console.log('Form API Response:', data)
        
        // Handle different response structures
        if (data.success === false) {
            error.value = data.message || 'Failed to load form'
            return
        }
        
        // Process fields recursively
        const processField = (field) => {
            const processedField = { ...field }
            
            // Ensure value is an array
            if (processedField.value !== undefined && processedField.value !== null) {
                if (!Array.isArray(processedField.value)) {
                    processedField.value = [processedField.value]
                }
            } else {
                processedField.value = getInitialValue(processedField)
            }
            
            // Recursively process nested fields (for GROUP type)
            if (processedField.fields && Array.isArray(processedField.fields)) {
                processedField.fields = processedField.fields.map(processField)
            }
            
            return reactive(processedField)
        }
        
        // Get fields from response - handle different response structures
        const fields = data.fields || data.rows || data.data?.fields || []
        const processedFields = Array.isArray(fields) ? fields.map(processField) : []
        
        formConfig.value = {
            form: data.form || {},
            fields: processedFields
        }
        
        console.log('Processed formConfig:', formConfig.value)
        console.log('Fields count:', processedFields.length)
    } catch (err) {
        error.value = err.response?.data?.message || err.message || 'Failed to load form'
        console.error('Error loading form:', err)
    } finally {
        loading.value = false
    }
}

const collectValues = (fields) => {
    const formData = {}
    
    fields.forEach(field => {
        if (field.data_type === 'GROUP' && field.fields) {
            Object.assign(formData, collectValues(field.fields))
        } else if (field.field_code && field.value) {
            const value = Array.isArray(field.value) ? field.value[0] : field.value
            if (value !== null && value !== undefined && value !== '') {
                formData[field.field_code] = value
            }
        }
    })
    
    return formData
}

const handleSubmit = async () => {
    submitting.value = true
    
    try {
        const formData = collectValues(formConfig.value.fields)
        const { data } = await $axios.post('/hrm/job_application', formData)
        
        if (data.success) {
            router.push('/hrm/recruitment/applications')
        } else {
            error.value = data.message || 'Failed to submit form'
        }
    } catch (err) {
        error.value = err.response?.data?.message || err.message || 'Failed to submit form'
        console.error('Error submitting form:', err)
    } finally {
        submitting.value = false
    }
}

const goBack = () => router.push('/hrm/recruitment/applications')

onMounted(loadForm)
</script>

