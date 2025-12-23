<template>
    <div v-if="loading" class="flex items-center justify-center py-12">
        <UIcon name="lucide:loader-2" class="w-6 h-6 animate-spin text-gray-400 dark:text-gray-500" />
        <span class="ml-3 text-gray-600 dark:text-gray-400">Loading form...</span>
    </div>
    
    <UForm v-else class="space-y-6" @submit.prevent="handleSubmit">
        <div class="grid gap-6 md:grid-cols-2">
            <div v-for="field in form.fields" :key="field.id">
                <Wrapper :field="field" />
            </div>
        </div>
        
        <div class="flex gap-3 pt-2">
            <UButton type="submit" label="Submit form" :loading="submitting" :disabled="submitting" />
        </div>
    </UForm>
</template>

<script setup>
import Wrapper from '~/components/emr/Wrapper.vue'

const { $axios } = useNuxtApp()

const props = defineProps({
    endPoint: { type: String, default: "" },
    params: { type: Object, default: null },
    staticForm: { type: Object, default: null },
    formCode: { type: String, default: "" },
    initialData: { type: Object, default: null },
})
const emit = defineEmits(['submit', 'close'])

const form = ref({ fields: [] })
const loading = ref(true)
const submitting = ref(false)

const loadForm = async () => {
    try {
        loading.value = true
        if (props.staticForm) {
            // Use static form if provided - create deep copy to avoid reference issues
            form.value = structuredClone(props.staticForm)
        } else if (props.formCode) {
            // Fetch from defaultForm API using form_code
            const response = await $axios.get('/form/defaultForm', {
                params: { form_code: props.formCode, form: 'true' }
            })
            
            if (response.data.success && response.data.fields) {
                // Map API response to form structure
                form.value = {
                    fields: response.data.fields.map(field => ({
                        ...field,
                        // Set initial value from initialData if provided
                        value: props.initialData && props.initialData[field.field_code] !== undefined
                            ? [props.initialData[field.field_code]]
                            : field.value || []
                    }))
                }
            }
        } else if (props.endPoint) {
            // Fetch from endpoint
            const params = { form: 'true' }
            if (props.params) {
                Object.assign(params, props.params)
            }
            const response = await $axios.get(props.endPoint, { params })
            
            // Handle different response structures
            const responseData = response.data
            
            // Check if fields exist in response (handle both direct and wrapped in success)
            const fields = (responseData.fields && Array.isArray(responseData.fields)) 
                ? responseData.fields 
                : null
            
            if (fields) {
                // Map fields and set initial values
                form.value = {
                    fields: fields.map(field => ({
                        ...field,
                        // Set initial value from initialData if provided
                        value: props.initialData && props.initialData[field.field_code] !== undefined
                            ? [props.initialData[field.field_code]]
                            : field.value || []
                    }))
                }
            } else {
                // Fallback: use response.data as-is (might already have fields structure)
                form.value = responseData.fields ? responseData : { fields: [] }
            }
        }
    } catch (err) {
        console.error('Error loading form:', err)
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    loadForm()
})

// Watch for changes in formCode, initialData, staticForm, endPoint, or params to reload form
watch([() => props.formCode, () => props.initialData, () => props.staticForm, () => props.endPoint, () => props.params], () => {
    loadForm()
}, { deep: true })

const handleSubmit = async () => {
    submitting.value = true
    try {
        const payload = {}
        
        form.value.fields?.forEach(field => {
            const key = field.field_code || field.id
            const value = field.value?.[0] ?? ''
            payload[key] = value
        })
        
        const isEdit = props.params?.id
        const config = { headers: { 'Content-Type': 'application/json' } }
        if (isEdit) config.params = { id: Number(props.params.id) }
        
        // Only make API call if endPoint is provided
        if (props.endPoint) {
            await $axios[isEdit ? 'patch' : 'post'](props.endPoint, payload, config)
        }
        
        // Emit submit with form data
        emit('submit', { form: form.value, payload })
    } catch (err) {
        alert(err.response?.data?.message || err.message || 'Failed to submit form')
        emit('submit', { error: err.response?.data || err.message })
    } finally {
        submitting.value = false
    }
}
</script>
