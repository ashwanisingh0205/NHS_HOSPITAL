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
    noAutoSubmit: { type: Boolean, default: false }, // If true, only emit submit event without auto-submitting
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
            ...(props.formCode && { form_code: props.formCode, id: props.id })
        }
        if (props.params) {
            Object.assign(requestParams, props.params)
        }
        
        const { data } = await $axios.get(endpoint, { params: requestParams })
        
        form.value = data
        
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
        const formData = form.value.fields?.reduce((acc, field) => {
            const fieldCode = field.field_code || field.id
            if (fieldCode) {
                const fieldValue = field.value?.[0]
                acc[fieldCode] = fieldValue !== undefined && fieldValue !== null ? fieldValue : ''
            }
            return acc
        }, {}) || {}
        
        // If using staticForm or noAutoSubmit, just emit the data and let parent handle submission
        if (props.staticForm || props.noAutoSubmit) {
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
            form.value,
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
