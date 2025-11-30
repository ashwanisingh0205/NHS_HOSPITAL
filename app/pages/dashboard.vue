<template>
  <div class="container mx-auto p-8 max-w-6xl">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <UIcon name="lucide:loader-2" class="w-6 h-6 animate-spin text-gray-400" />
      <span class="ml-3 text-gray-600">Loading form...</span>
    </div>

    <!-- Dynamic Form 
     formCode="REGISTRATION",
      :formParam="{ userId: 12345 }" -->
      
    <DynamicForm
     v-else-if="formConfig"
:form-config="formConfig"
:initial-data="formData"
@submit="handleSubmit"
     
    />
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'home'
})

import DynamicForm from '~/components/emr/DynamicForm.vue'
import { useFormData } from '~/composables/useFormData'

const { loading, error, loadFormData } = useFormData()

const formConfig = ref(null)
const formData = ref(null)

// Handle form submission
const handleSubmit = (data) => {
  console.log('Form submitted:', data)
 
  alert('Form submitted successfully!')
}

// Load form data on mount
onMounted(async () => {
  try {
    const { config, data } = await loadFormData()
    formConfig.value = config
    formData.value = data
  } catch (err) {
    console.error('Error loading form:', err)
  }
})
</script>
