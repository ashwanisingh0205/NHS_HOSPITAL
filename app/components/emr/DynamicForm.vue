<template>
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
        <UIcon name="lucide:loader-2" class="w-6 h-6 animate-spin text-gray-400 dark:text-gray-500" />
        <span class="ml-3 text-gray-600 dark:text-gray-400">Loading form...</span>
    </div>
    
    <!-- Form -->
    <UForm v-else-if="internalFormConfig" class="space-y-6 " @submit.prevent="handleSubmit">
        <!-- Form Edit with Cards Layout -->
        <template v-if="formType === 'form-edit'">
            <div class="space-y-6">
                <!-- Card 1: Basic Information -->
                <UCard>
                    <template #header>
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h3>
                    </template>
                    <div class="grid gap-4 md:grid-cols-2">
                        <Wrapper
                            v-for="field in getFieldsByGroup('basic')"
                            :key="field.id"
                            :field="form"
                            v-model="formData[field.id]"
                        />
                    </div>
                </UCard>
                
                <!-- Card 2: Templates & Design -->
                <UCard>
                    <template #header>
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Templates & Design</h3>
                    </template>
                    <div class="grid gap-4 md:grid-cols-2">
                        <Wrapper
                            v-for="field in getFieldsByGroup('templates')"
                            :key="field.id"
                            :field="field"
                            v-model="formData[field.id]"
                        />
                    </div>
                </UCard>
                
                <!-- Card 3: Communication Templates -->
                <UCard>
                    <template #header>
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Communication Templates</h3>
                    </template>
                    <div class="grid gap-4 md:grid-cols-2">
                        <Wrapper
                            v-for="field in getFieldsByGroup('communication')"
                            :key="field.id"
                            :field="field"
                            v-model="formData[field.id]"
                        />
                    </div>
                </UCard>
                
                <!-- Card 4: Advanced Settings -->
                <UCard>
                    <template #header>
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Advanced Settings</h3>
                    </template>
                    <div class="grid gap-4 md:grid-cols-2">
                        <Wrapper
                            v-for="field in getFieldsByGroup('advanced')"
                            :key="field.id"
                            :field="field"
                            v-model="formData[field.id]"
                        />
                    </div>
                </UCard>
            </div>
        </template>
        
        <!-- Default Layout for Other Form Types -->
        <template v-else>
            <div class="grid gap-6 md:grid-cols-2">
                <div v-for="field in internalFormConfig.fields" :key="field.id">
                    <Wrapper :field="field" v-model="formData[field.id]" />
                </div>
            </div>
        </template>
        
        <div class="flex gap-3 pt-2">
            <UButton type="submit" label="Submit form" :loading="loading" :disabled="loading" />
        </div>
    </UForm>
</template>

<script setup>
import axios from 'axios'
import Wrapper from '~/components/emr/Wrapper.vue'
import { useFormData } from '~/composables/useFormData'

const props = defineProps({
    endPoint: { type: String, default: "" },
    params: { type: Object, default: null },
})
const emit = defineEmits(['submit', 'close'])


const formData = ref({})
const loading = ref(true)
const internalFormConfig = ref(null)
const submitMessage = ref('')
const submitSuccess = ref(false)

const NUMERIC_FIELDS = new Set([
    'corporate_id', 'unit_id', 'category_id', 'template_id', 'header_id', 'footer_id',
    'css_id', 'pdf_id', 'letterhead_id', 'whatsapp_template_id', 'sms_template_id',
    'email_template_id', 'form_id', 'min_value', 'max_value', 'standard_value',
    'standard_value_level2', 'standard_value_level3', 'label_width', 'component_id', 'col', 'priority'
])

const BOOLEAN_FIELDS = new Set([
    'status_pdf', 'status_universal', 'status', 'lock_value_consultant',
    'status_required', 'status_readonly'
])

const getDefaultValue = (field) => {
    if (field.defaultValue !== undefined) return field.defaultValue
    if (field.type === 'checkbox') return field.options ? [] : false
    if (['number', 'select', 'radio'].includes(field.type)) return null
    return ''
}

const initFormData = (fields, source = {}) => {
    formData.value = Object.fromEntries(
        fields.map(f => [f.id, source[f.id] ?? getDefaultValue(f)])
    )
}

const transformPayload = (raw) => {
    const payload = {}
    
    Object.keys(raw).forEach(key => {
        const value = raw[key]
        
        // Skip null, undefined, and empty strings
        if (value === null || value === undefined || value === '') {
            return
        }
        
        // Handle numeric fields
        if (NUMERIC_FIELDS.has(key)) {
            const num = Number(value)
            // For form-field-edit, only include numeric fields if they have a value (except form_id which is required)
            if (props.formType === 'form-field-edit' && key !== 'form_id' && (Number.isNaN(num) || num === 0)) {
                return
            }
            payload[key] = Number.isNaN(num) ? 0 : num
        }
        // Handle boolean fields
        else if (BOOLEAN_FIELDS.has(key)) {
            payload[key] = Boolean(value)
        }
        // Handle string fields
        else {
            // Skip empty strings
            if (typeof value === 'string' && value.trim() === '') {
                return
            }
            payload[key] = value
        }
    })
    
    // Always set status to true if not present
    if (payload.status === undefined) payload.status = true
    return payload
}

const validateRequired = (payload, requiredFields) => {
    const missing = []
    
    Object.keys(requiredFields).forEach(field => {
        const value = payload[field]
        if (value === undefined || value === null || value === '' ||
            (typeof value === 'number' && value === 0 && field !== 'status' && field !== 'form_id')) {
            missing.push(requiredFields[field])
        }
    })
    
    return missing
}

const handleSubmit = async () => {
    loading.value = true
    submitMessage.value = ''
    submitSuccess.value = false
    
    try {
        const payload = transformPayload(formData.value)
        
        let requiredFields = {}
        let apiEndpoint = 'http://13.200.174.164:3001/v1/masters/forms/form'
        
        if (props.formType === 'form-field-edit') {
            requiredFields = {
                form_id: 'Form ID',
                data_type: 'Data Type',
                field_code: 'Field Code',
                label: 'Label'
            }
            apiEndpoint = 'http://13.200.174.164:3001/v1/masters/forms/field'
        } else if (props.formType === 'form-edit') {
            requiredFields = {
                corporate_id: 'Corporate ID',
                unit_id: 'Unit ID',
                category_id: 'Category ID',
                form_code: 'Form Code',
                form_name: 'Form Name'
            }
        }
        console.log('apiEndpoint', apiEndpoint);
        console.log('payload', payload);
        const missingFields = validateRequired(payload, requiredFields)
        if (missingFields.length > 0) {
            submitMessage.value = `Please fill in: ${missingFields.join(', ')}`
            submitSuccess.value = false
            return
        }
        
        // Wrap payload in fields array for form-field-edit
        const requestPayload = props.formType === 'form-field-edit'
            ? { fields: [payload] }
            : payload
        
        const response = await axios.post(apiEndpoint, requestPayload, {
            headers: { 'Content-Type': 'application/json' }
        })
        
        if (response.data) {
            submitSuccess.value = true
            submitMessage.value = response.data.message || 'Form submitted successfully!'
            emit('submit', { data: formData.value, response: response.data })
            setTimeout(() => emit('close'), 500)
        }
    } catch (err) {
        submitSuccess.value = false
        
        if (err.response?.status === 422 && err.response?.data?.errors) {
            submitMessage.value = 'Please fix the validation errors'
        } else if (err.response?.status >= 500) {
            const errorMsg = err.response?.data?.message || err.response?.data?.error || 'Server error occurred'
            submitMessage.value = `Error: ${errorMsg}`
        } else {
            submitMessage.value = err.response?.data?.message || err.message || 'Failed to submit form'
        }
        
        emit('submit', { data: formData.value, error: err.response?.data || err.message })
    } finally {
        loading.value = false
    }
}

const getFieldsByGroup = (group) => {
    if (!internalFormConfig.value || !internalFormConfig.value.fields) return []
    const groupFieldIds = fieldGroups[group] || []
    return internalFormConfig.value.fields.filter(field => groupFieldIds.includes(field.id))
}



const form = ref({})
onMounted(async () => {
    try {
        loading.value = true
        const response = await axios.get(props.endPoint, props.params);
        form.value = response.data;
        // if (props.formType && formConfigs[props.formType]) {
        //     internalFormConfig.value = formConfigs[props.formType]
        //     const source = props.form || {}
        //     initFormData(internalFormConfig.value.fields, source)
        // } else if (props.formConfig) {
        //     internalFormConfig.value = props.formConfig
        //     initFormData(internalFormConfig.value.fields, props.initialData)
        // } else {
        //     const { config, data } = await loadFormData()
        //     internalFormConfig.value = config
        //     initFormData(config.fields, data || props.initialData)
        // }
    } catch (err) {
        console.error('Error loading form:', err)
    } finally {
        loading.value = false
    }
})
</script>
