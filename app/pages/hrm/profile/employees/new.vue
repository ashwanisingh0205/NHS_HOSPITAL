<template>
    <div class="p-6">
        <div class="mb-6">
            <div class="flex items-center justify-between">
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
                    {{ formTitle }}
                </h1>
                <UButton 
                    variant="outline" 
                    icon="lucide:arrow-left"
                    @click="goBack"
                >
                    Back
                </UButton>
            </div>
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

        <div v-else-if="formConfig && formConfig.fields?.length" class="space-y-6">
            <UForm @submit.prevent="handleSubmit" class="space-y-6">
                <!-- Two-column grid layout for form groups -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
            </div>
        </UCard>
    </div>
</template>

<script setup>
import FormRenderer from '~/components/form_builder/FormRenderer.vue'

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

const formType = computed(() => route.query.type || 'newEmployee')

const formTitle = computed(() => {
    const titles = {
        'newCV': 'New CV',
        'newProvisional': 'New Provisional',
        'newEmployee': 'New Employee'
    }
    return titles[formType.value] || 'New Employee'
})

const loadForm = async () => {
    loading.value = true
    error.value = null
    formConfig.value = null
    
    try {
        const response = await $axios.get('/hrm/employee', {
            params: { form: true }
        })
        
        if (!response.data.success) {
            error.value = response.data.message || 'Failed to load form'
            return
        }
        
        // Initialize fields with default values - make them reactive
        const makeFieldReactive = (field) => {
            const fieldValue = getInitialValue(field)
            // Create reactive object and ensure value is properly initialized
            const fieldObj = reactive({
                ...field,
                value: fieldValue
            })
            
            // Ensure value property exists and is reactive
            if (!('value' in fieldObj) || fieldObj.value === undefined) {
                fieldObj.value = fieldValue
            }
            
            // Recursively make nested fields reactive (for GROUP, CARD, etc.)
            if (Array.isArray(field.fields)) {
                fieldObj.fields = field.fields.map(makeFieldReactive)
            }
            
            return fieldObj
        }
        
        const fields = (response.data.fields || []).map(makeFieldReactive)
        
        formConfig.value = {
            form: response.data.form,
            fields: fields
        }
    } catch (err) {
        error.value = err.response?.data?.message || err.message || 'Failed to load form'
        console.error('Error loading form:', err)
    } finally {
        loading.value = false
    }
}

// Get initial value based on field data type
// For new forms, ignore API values and use defaults
// IMPORTANT: field.value should be an array [value] to match Wrapper.vue pattern
const getInitialValue = (field) => {
    // For new employee form, always start with empty/default values
    // Don't use API values unless we're editing an existing record
    
    if (field.data_type === 'CHECKBOX') {
        // If checkbox has choices, initialize as array of arrays, otherwise as [false]
        return (field.choices && field.choices.length > 0) ? [] : [false]
    }
    if (field.data_type === 'NUMBER') {
        return [field.standard_value || 0]
    }
    // For all other types (TEXT, DATE, etc.), start with empty string in array
    return ['']
}

const handleSubmit = async () => {
    submitting.value = true
    try {
        // Collect form data from all fields (including nested groups)
        const formData = {}
        const collectValues = (fields) => {
            fields.forEach(field => {
                if (field.data_type === 'GROUP' && Array.isArray(field.fields)) {
                    collectValues(field.fields)
                } else if (field.field_code && field.value !== null && field.value !== undefined) {
                    // field.value is an array, get the first element
                    const value = Array.isArray(field.value) ? field.value[0] : field.value
                    // Only include if value is not empty (for strings) or not null/undefined
                    if (value !== null && value !== undefined && value !== '') {
                        formData[field.field_code] = value
                    }
                }
            })
        }
        
        if (formConfig.value?.fields) {
            collectValues(formConfig.value.fields)
        }
        
        const response = await $axios.post('/hrm/employee', formData)
        
        if (response.data.success) {
            router.push('/hrm/profile/employees')
        } else {
            error.value = response.data.message || 'Failed to submit form'
        }
    } catch (err) {
        error.value = err.response?.data?.message || err.message || 'Failed to submit form'
        console.error('Error submitting form:', err)
    } finally {
        submitting.value = false
    }
}

const goBack = () => {
    router.push('/hrm/profile/employees')
}

onMounted(() => {
    loadForm()
})
</script>

