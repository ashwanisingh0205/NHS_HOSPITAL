<template>
    <div v-if="loading" class="flex items-center justify-center py-12">
        <UIcon name="lucide:loader-2" class="w-6 h-6 animate-spin text-gray-400 dark:text-gray-500" />
        <span class="ml-3 text-gray-600 dark:text-gray-400">Loading form...</span>
    </div>
    
    <UForm v-else class="space-y-6" @submit.prevent="handleSubmit">
        <div v-if="form.fields?.length" class="grid gap-6 md:grid-cols-2">
            <Wrapper v-for="field in form.fields" :key="field.id" :field="field" />
        </div>
        <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>No form fields available. Please check the API endpoint configuration.</p>
        </div>
        
        <div v-if="form.fields?.length" class="flex gap-3 pt-2">
            <UButton type="submit" label="Submit form" :loading="submitting" :disabled="submitting" />
        </div>
    </UForm>
</template>

<script setup>
import Wrapper from '~/components/emr/Wrapper.vue'

const { $axios } = useNuxtApp()

const props = defineProps({
    endPoint: { type: String, default: "" },
    submitEndPoint: { type: String, default: "" }, // Separate endpoint for submission
    params: { type: Object, default: null },
    staticForm: { type: Object, default: null },
    formCode: { type: String, default: "" },
    id: { type: String, default: "" },
})
const emit = defineEmits(['submit'])

const form = ref({ fields: [] })
const loading = ref(true)
const submitting = ref(false)

const loadForm = async () => {
    loading.value = true
    
    try {
        if (props.staticForm) {
            form.value = structuredClone(props.staticForm)
            return
        }
        
        const endpoint = props.endPoint || '/form/defaultForm'
        
        // Build request params - always include form=true for form structure
        const requestParams = { 
            form: 'true',
            ...(props.formCode && { form_code: props.formCode, id: props.id }),
            ...(!props.formCode && props.params || {})
        }
        
        const { data } = await $axios.get(endpoint, { params: requestParams })
        console.log('DATA', data)
        
        const fields = data?.success !== false 
            ? (data.fields || [])
            : []
        
        form.value = { 
            fields: Array.isArray(fields) ? fields.map(field => ({
                ...field,
                value: Array.isArray(field.value) ? field.value : 
                       (field.value != null ? [field.value] : [''])
            })) : []
        }
        
    } catch (err) {
        console.error('Error loading form:', err)
        form.value = { fields: [] }
    } finally {
        loading.value = false
    }
}

onMounted(loadForm)
watch([() => props.formCode, () => props.staticForm, () => props.endPoint, () => props.params], loadForm, { deep: true })

const handleSubmit = async () => {
    submitting.value = true
    try {
        // Build payload from form fields
        const payload = {}
        form.value.fields.forEach(field => {
            const fieldCode = field.field_code || field.id
            if (fieldCode) {
                const fieldValue = field.value?.[0]
                // Include all fields, even if empty (null/undefined/empty string)
                // This ensures choice_code and other optional fields are sent
                payload[fieldCode] = fieldValue !== undefined && fieldValue !== null ? fieldValue : ''
            }
        })
        
        // Merge params into payload (except 'id' which is handled separately for edit mode)
        if (props.params) {
            Object.keys(props.params).forEach(key => {
                if (key !== 'id' && props.params[key] !== undefined && props.params[key] !== null) {
                    payload[key] = props.params[key]
                }
            })
        }
        
        // Use submitEndPoint if provided, otherwise use endPoint
        const submitEndpoint = props.submitEndPoint || props.endPoint
        
        if (submitEndpoint) {
            const isEdit = !!props.params?.id || !!props.id
            const requestConfig = {
                headers: { 'Content-Type': 'application/json' }
            }
            
            // For PATCH requests, add id and form_code as query params
            if (isEdit) {
                requestConfig.params = { 
                    id: Number(props.params?.id || props.id)
                }
                // Add form_code to query params if provided
                if (props.formCode) {
                    requestConfig.params.form_code = props.formCode
                }
            }
            
            console.log('Submitting to:', submitEndpoint)
            console.log('Payload:', payload)
            console.log('Request Config:', requestConfig)
            
            await $axios[isEdit ? 'patch' : 'post'](
                submitEndpoint, 
                payload,
                requestConfig
            )
        }
        
        emit('submit', { form: form.value, payload })
    } catch (err) {
        console.error('Form submission error:', err)
        console.error('Error response:', err.response?.data)
        alert(err.response?.data?.message || err.message || 'Failed to submit form')
        emit('submit', { error: err.response?.data || err.message })
    } finally {
        submitting.value = false
    }
}
</script>