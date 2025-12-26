<template>
    <UModal v-model:open="localValue" :ui="{ width: 'sm:max-w-4xl' }">
        <template #header>
            <div class="flex items-center justify-between w-full">
                <h3 class="text-lg font-semibold">{{ formTitle }}</h3>
                <UButton 
                    variant="ghost" 
                    icon="lucide:x"
                    size="sm"
                    @click="localValue = false"
                />
            </div>
        </template>

        <template #body>
            <div v-if="loading" class="flex items-center justify-center py-12">
                <UIcon name="lucide:loader-2" class="w-6 h-6 animate-spin text-gray-400 dark:text-gray-500" />
                <span class="ml-3 text-gray-600 dark:text-gray-400">Loading form...</span>
            </div>

            <div v-else-if="error" class="text-center py-8">
                <UError :error="{ statusMessage: error }" />
            </div>

            <UForm v-else-if="formConfig && formConfig.fields?.length" class="space-y-6" @submit.prevent="handleSubmit">
                <FormRenderer 
                    :fields="formConfig.fields" 
                    :cols="formConfig.form?.cols || 2"
                />
                
                <div class="flex gap-3 pt-4 border-t">
                    <UButton type="submit" label="Submit" :loading="submitting" :disabled="submitting" />
                    <UButton type="button" variant="outline" label="Cancel" @click="localValue = false" />
                </div>
            </UForm>

            <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400">
                <p>No form fields available.</p>
            </div>
        </template>
    </UModal>
</template>

<script setup>
import FormRenderer from '~/components/form_builder/FormRenderer.vue'

const props = defineProps({
    modelValue: { type: Boolean, default: false },
    formType: { type: String, default: '' } // 'newCV', 'newProvisional', 'newEmployee'
})

const emit = defineEmits(['update:modelValue', 'submit'])

const { $axios } = useNuxtApp()

const localValue = ref(props.modelValue)
const loading = ref(false)
const error = ref(null)
const submitting = ref(false)
const formConfig = ref(null)

watch(localValue, (val) => {
    emit('update:modelValue', val)
    if (val && props.formType) {
        loadForm()
    }
})

watch(() => props.modelValue, (val) => {
    localValue.value = val
    if (val && props.formType) {
        loadForm()
    }
})

const formTitle = computed(() => {
    const titles = {
        'newCV': 'New CV',
        'newProvisional': 'New Provisional',
        'newEmployee': 'New Employee'
    }
    return titles[props.formType] || 'Employee Form'
})

const loadForm = async () => {
    loading.value = true
    error.value = null
    formConfig.value = null
    
    try {
        const response = await $axios.get('/hrm/employee', {
            params: { form: true }
        })
        
        if (response.data.success) {
            // Initialize fields with proper value structure
            const fields = (response.data.fields || []).map(field => {
                // Initialize value based on data_type
                let initialValue = field.value
                
                if (initialValue === null || initialValue === undefined) {
                    if (field.data_type === 'CHECKBOX') {
                        initialValue = false
                    } else if (field.data_type === 'NUMBER') {
                        initialValue = field.standard_value || 0
                    } else {
                        initialValue = ''
                    }
                }
                
                return {
                    ...field,
                    value: initialValue
                }
            })
            
            formConfig.value = {
                form: response.data.form,
                fields: fields
            }
        } else {
            error.value = response.data.message || 'Failed to load form'
        }
    } catch (err) {
        error.value = err.response?.data?.message || err.message || 'Failed to load form'
        console.error('Error loading form:', err)
    } finally {
        loading.value = false
    }
}

const handleSubmit = async () => {
    submitting.value = true
    try {
        // Collect form data
        const formData = {}
        if (formConfig.value?.fields) {
            formConfig.value.fields.forEach(field => {
                if (field.value !== null && field.value !== undefined) {
                    formData[field.field_code] = Array.isArray(field.value) 
                        ? field.value[0] 
                        : field.value
                }
            })
        }
        
        emit('submit', formData)
        localValue.value = false
    } catch (err) {
        console.error('Error submitting form:', err)
    } finally {
        submitting.value = false
    }
}
</script>

