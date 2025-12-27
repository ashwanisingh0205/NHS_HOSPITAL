<template>
    <div >
        <div class="mb-6 flex items-center justify-between">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ formTitle }}
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
            <UForm @submit.prevent="handleSubmit" class="space-y-6">
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

const formTitle = computed(() => {
    const titles = {
        'newCV': 'New CV',
        'newProvisional': 'New Provisional',
        'newEmployee': 'New Employee'
    }
    return titles[route.query.type || 'newEmployee'] || 'New Employee'
})

const getInitialValue = (field) => {
    if (field.data_type === 'CHECKBOX') {
        return (field.choices?.length > 0) ? [] : [false]
    }
    if (field.data_type === 'NUMBER') {
        return [field.standard_value || 0]
    }
    return ['']
}

const makeFieldReactive = (field) => {
    const fieldObj = reactive({
        ...field,
        value: getInitialValue(field),
        fields: field.fields?.map(makeFieldReactive)
    })
    return fieldObj
}

const loadForm = async () => {
    loading.value = true
    error.value = null
    
    try {
        const { data } = await $axios.get('/hrm/employee', { params: { form: true } })
        
        if (!data.success) {
            error.value = data.message || 'Failed to load form'
            return
        }
        
        formConfig.value = {
            form: data.form,
            fields: (data.fields || []).map(makeFieldReactive)
        }
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
        const { data } = await $axios.post('/hrm/employee', formData)
        
        if (data.success) {
            router.push('/hrm/profile/employees')
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

const goBack = () => router.push('/hrm/profile/employees')

onMounted(loadForm)
</script>