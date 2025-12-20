<template>
    
    <CKLoader v-if="loading" />
    
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
import CKLoader from "~/components/common/CKLoader.vue";

const props = defineProps({
    endPoint: { type: String, default: "" },
    params: { type: Object, default: null },
})
const emit = defineEmits(['submit', 'close'])

const { $axios } = useNuxtApp()

const form = ref({})
const loading = ref(true)
const submitting = ref(false)

onMounted(async () => {
    try {
        loading.value = true
        const params = { form: 'true' }
        if (props.params) {
            Object.assign(params, props.params)
        }
        const response = await $axios.get(props.endPoint, { params })
        form.value = response.data
    } catch (err) {
        console.error('Error loading form:', err)
    } finally {
        loading.value = false
    }
})

const handleSubmit = async () => {
    submitting.value = true
    try {
        const payload = {}
        
        form.value.fields?.forEach(field => {
            const key = field.field_code || field.id
            const value = field.value?.[0] ?? ''
            if (key === 'location_type' && value === '') return
            payload[key] = value
        })
        
        if (props.params) {
            Object.entries(props.params).forEach(([key, value]) => {
                if (key !== 'id') payload[key] = value
            })
        }
        
        const isEdit = props.params?.id
        const config = { headers: { 'Content-Type': 'application/json' } }
        if (isEdit) config.params = { id: Number(props.params.id) }
        
        await $axios[isEdit ? 'patch' : 'post'](props.endPoint, payload, config)
        emit('submit', { })
    } catch (err) {
        alert(err.response?.data?.message || err.message || 'Failed to submit form')
        emit('submit', { error: err.response?.data || err.message })
    } finally {
        submitting.value = false
    }
}
</script>
