<template>
    <div v-if="loading" class="flex items-center justify-center py-12">
        <UIcon name="lucide:loader-2" class="w-6 h-6 animate-spin text-gray-400 dark:text-gray-500" />
        <span class="ml-3 text-gray-600 dark:text-gray-400">Loading form...</span>
    </div>
    
    <UForm v-else class="space-y-6" @submit.prevent="handleSubmit">
        <div class="grid gap-6 md:grid-cols-2">
            <Wrapper v-for="field in form.fields" :key="field.id" :field="field" />
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
const emit = defineEmits(['submit'])

const form = ref({ fields: [] })
const loading = ref(true)
const submitting = ref(false)

const mapFieldsWithInitialData = (fields) => {
    return fields.map(field => ({
        ...field,
        value: props.initialData?.[field.field_code] !== undefined
            ? [props.initialData[field.field_code]]
            : field.value || []
    }))
}

const loadForm = async () => {
    loading.value = true
    try {
        if (props.staticForm) {
            form.value = structuredClone(props.staticForm)
            return
        }
        
        if (props.formCode) {
            const { data } = await $axios.get('/form/defaultForm', {
                params: { form_code: props.formCode, form: 'true' }
            })
            
            if (data.success && data.fields) {
                form.value = { fields: mapFieldsWithInitialData(data.fields) }
            }
            return
        }
        
        if (props.endPoint) {
            const { data } = await $axios.get(props.endPoint, { 
                params: { form: 'true', ...props.params }
            })
            
            const fields = data.fields || []
            form.value = { fields: mapFieldsWithInitialData(fields) }
        }
    } catch (err) {
        console.error('Error loading form:', err)
    } finally {
        loading.value = false
    }
}

onMounted(loadForm)

watch([() => props.formCode, () => props.initialData, () => props.staticForm, () => props.endPoint, () => props.params], loadForm, { deep: true })

const handleSubmit = async () => {
    submitting.value = true
    try {
        const payload = Object.fromEntries(
            form.value.fields.map(field => [
                field.field_code || field.id,
                field.value?.[0] ?? ''
            ])
        )
        
        if (props.endPoint) {
            const isEdit = !!props.params?.id
            const config = {
                headers: { 'Content-Type': 'application/json' },
                ...(isEdit && { params: { id: Number(props.params.id) } })
            }
            
            await $axios[isEdit ? 'patch' : 'post'](props.endPoint, payload, config)
        }
        
        emit('submit', { form: form.value, payload })
    } catch (err) {
        alert(err.response?.data?.message || err.message || 'Failed to submit form')
        emit('submit', { error: err.response?.data || err.message })
    } finally {
        submitting.value = false
    }
}
</script>