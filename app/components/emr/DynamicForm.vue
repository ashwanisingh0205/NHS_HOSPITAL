<template>
    <div v-if="loading" class="flex items-center justify-center py-12">
        <UIcon name="lucide:loader-2" class="w-6 h-6 animate-spin text-gray-400 dark:text-gray-500" />
        <span class="ml-3 text-gray-600 dark:text-gray-400">Loading form...</span>
    </div>
    
    <UForm v-else class="space-y-6" @submit.prevent="handleSubmit">
        <div class="grid gap-6 md:grid-cols-2">
            <div v-for="field in form.fields" :key="field.id">
                <Wrapper :field="field" v-model="formData[field.id]" />
            </div>
        </div>
        
        <div class="flex gap-3 pt-2">
            <UButton type="submit" label="Submit form" :loading="submitting" :disabled="submitting" />
        </div>
    </UForm>
</template>

<script setup>
import axios from 'axios'
import Wrapper from '~/components/emr/Wrapper.vue'

const props = defineProps({
    endPoint: { type: String, default: "" },
    params: { type: Object, default: null },
})
const emit = defineEmits(['submit', 'close'])

const form = ref({})

onMounted(async () => {
    try {
        loading.value = true
        console.log("asdf");
        
        const blockResponse = await axios.get(props.endPoint, {
            params: {
                form: 'true',
                ...props.params
            }
        })
        form.value= blockResponse.data
        
    } catch (err) {
        console.error('Error loading form:', err)
    } finally {
        loading.value = false
    }
})

const formData = ref({})
const loading = ref(true)
const submitting = ref(false)
const fields = ref([])

const handleSubmit = async () => {
    
    submitting.value = true
    try {
        
        if(props.params.id){
            const response = await axios.post(props.endPoint, form.fields, {
                headers: { 'Content-Type': 'application/json' }
            })
        } else {
            const response = await axios.patch(props.endPoint, form.fields, {
                headers: { 'Content-Type': 'application/json' }
            })
        }
        
        if (response.data) {
            emit('submit', { })
        }
    } catch (err) {
        const errorMsg = err.response?.data?.message || err.message || 'Failed to submit form'
        alert(`Error: ${errorMsg}`)
        emit('submit', { data: formData.value, error: err.response?.data || err.message })
    } finally {
        submitting.value = false
    }
}


</script>
