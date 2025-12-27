<template>
    <UFormField :label="field.label">
        <div class="space-y-2">
            <input 
                type="file" 
                :multiple="field.multiple || false"
                :accept="field.accept || '*'"
                @change="handleFileChange"
                class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
            />
            <div v-if="fileNames.length > 0" class="text-sm text-gray-600 dark:text-gray-400">
                <div v-for="(name, index) in fileNames" :key="index" class="flex items-center gap-2">
                    <UIcon name="lucide:file" class="w-4 h-4" />
                    <span>{{ name }}</span>
                </div>
            </div>
        </div>
    </UFormField>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
    field: { type: Object, required: true },
});

const fileNames = ref([])

// Ensure field.value is an array first
onMounted(() => {
    if (!Array.isArray(props.field.value)) {
        props.field.value = [props.field.value || '']
    }
    // Initialize file names from existing value
    if (props.field.value[0]) {
        if (Array.isArray(props.field.value[0])) {
            fileNames.value = props.field.value[0]
        } else {
            fileNames.value = [props.field.value[0]]
        }
    }
})

const handleFileChange = (event) => {
    const files = event.target.files
    if (!files || files.length === 0) {
        fileNames.value = []
        if (!Array.isArray(props.field.value)) {
            props.field.value = []
        }
        props.field.value[0] = ''
        return
    }

    const names = Array.from(files).map(file => file.name)
    fileNames.value = names

    // Store file names in field.value[0]
    if (!Array.isArray(props.field.value)) {
        props.field.value = []
    }
    
    if (props.field.multiple) {
        props.field.value[0] = names
    } else {
        props.field.value[0] = names[0] || ''
    }
}
</script>
