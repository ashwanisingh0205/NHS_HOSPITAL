<template>
    <div v-if="loading" class="flex items-center justify-center py-12">
        <UIcon name="lucide:loader-2" class="w-6 h-6 animate-spin text-gray-400 dark:text-gray-500" />
        <span class="ml-3 text-gray-600 dark:text-gray-400">Loading...</span>
    </div>
    
    <UForm v-else class="space-y-6" @submit.prevent="handleSubmit">
        <div v-if="staticData.fields?.length" class="grid gap-6 md:grid-cols-2">
            <Wrapper v-for="field in staticData.fields" :key="field.id || field.field_code" :field="field" />
        </div>
        <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>No fields available.</p>
        </div>
        
        <div v-if="staticData.fields?.length" class="flex gap-3 pt-2">
            <UButton type="submit" label="Apply Filters" :loading="submitting" :disabled="submitting" />
            <UButton type="button" variant="outline" label="Clear" @click="handleClear" />
        </div>
    </UForm>
</template>

<script setup>
import Wrapper from '~/components/emr/Wrapper.vue'

const props = defineProps({
    staticData: { type: Object, required: true }
})

const emit = defineEmits(['submit', 'clear'])

const loading = ref(false)
const submitting = ref(false)

const handleSubmit = async () => {
    submitting.value = true
    try {
        const payload = Object.fromEntries(
            props.staticData.fields.map(field => {
                const fieldKey = field.field_code || field.id
                if (field.data_type === 'DATE_RANGE') {
                    return [
                        [`${fieldKey}_from`, field.value?.[0] ?? ''],
                        [`${fieldKey}_to`, field.value?.[1] ?? '']
                    ]
                }
                return [[fieldKey, field.value?.[0] ?? null]]
            }).flat()
        )
        
        emit('submit', { staticData: props.staticData, payload })
    } catch (err) {
        console.error('Error submitting:', err)
        emit('submit', { error: err.message || 'Submission failed' })
    } finally {
        submitting.value = false
    }
}

const handleClear = () => {
    props.staticData.fields.forEach(field => {
        if (field.data_type === 'DATE_RANGE') {
            field.value = ['', '']
        } else {
            field.value = [null]
        }
    })
    emit('clear', { staticData: props.staticData })
}
</script>

