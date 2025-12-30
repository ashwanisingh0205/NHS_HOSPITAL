<template>
    <CKLoader v-if="loading" />
    
    <UForm v-else @submit.prevent="handleSubmit">
        <template v-if="form.fields?.length">
            <div  class="grid gap-6 md:grid-cols-2">
                <Wrapper
                    v-for="field in form.fields"
                    :key="field.id"
                    :field="field" />
            </div>
            <div class="flex gap-3 pt-2">
                <UButton
                    type="submit"
                    label="Submit"
                    :loading="submitting"
                    :disabled="submitting" />
            </div>
        </template>
        
        <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>No form fields available. Please check the API endpoint configuration.</p>
        </div>
        
        
    </UForm>
</template>

<script setup>
import Wrapper from '~/components/emr/Wrapper.vue'
import CKLoader from "~/components/common/CKLoader.vue";

const { $axios } = useNuxtApp()

const props = defineProps({
    endPoint: { type: String, default: "" },
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
        
        const fields = data?.success ? (data.fields || []) : []
        
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
        // Collect form data directly from fields
        const formData = form.value.fields.reduce((acc, field) => {
            const fieldCode = field.field_code || field.id
            if (fieldCode) {
                const fieldValue = field.value?.[0]
                acc[fieldCode] = fieldValue !== undefined && fieldValue !== null ? fieldValue : ''
            }
            return acc
        }, {})
        
        // Merge additional params (except 'id' which is handled separately for edit mode)
        if (props.params) {
            Object.assign(formData, 
                Object.fromEntries(
                    Object.entries(props.params).filter(([key]) => key !== 'id')
                )
            )
        }
        
        // If using staticForm, just emit the data and let parent handle submission
        if (props.staticForm) {
            emit('submit', { form: form.value, payload: formData })
            submitting.value = false
            return
        }
        
        const isEdit = !!props.params?.id || !!props.id
        const submitEndpoint = props.endPoint || '/form/defaultForm'
        
        const requestConfig = {
            headers: { 'Content-Type': 'application/json' }
        }
        
        // For PATCH requests, add id and form_code as query params
        if (isEdit) {
            requestConfig.params = { 
                id: Number(props.params?.id || props.id)
            }
            if (props.formCode) {
                requestConfig.params.form_code = props.formCode
            }
        } else if (!props.endPoint && props.formCode) {
            // For POST requests, add form_code as query param if using defaultForm endpoint
            requestConfig.params = { form_code: props.formCode }
        }
        
        await $axios[isEdit ? 'patch' : 'post'](
            submitEndpoint,
            formData,
            requestConfig
        )
        
        emit('submit', { form: form.value, payload: formData })
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
