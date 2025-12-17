<template>
  <UModal
    v-model:open="isOpen"
    :ui="{ width: 'w-[95vw] max-w-[95vw]', bg: 'bg-white dark:bg-gray-800', rounded: 'rounded-lg', zIndex: 'z-50' }"
  >
    <template #header>
      <div class="flex items-center justify-between w-full">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">
          {{ props.block ? 'Edit Block' : 'Create New Block' }}
        </h2>
        <UButton
          @click="isOpen = false"
          variant="ghost"
          size="sm"
          icon="i-lucide:x"
          color='neutral'
        />
      </div>
    </template>
    <template #body>
      <DynamicForm
        :form-config="props.formConfig"
        :initial-data="formData"
        @close="isOpen = false"
        @submit="handleSubmit"
      />
    </template>
  </UModal>
</template>

<script setup>
import DynamicForm from '~/components/emr/DynamicForm.vue'
import axios from 'axios'

const props = defineProps({
  open: { type: Boolean, default: false },
  block: { type: Object, default: null },
  formConfig: { type: Object, default: null }
});

const emit = defineEmits(['update:open', 'submit']);

const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value)
});

// Prepare form data - ensure block_name is available for API formConfig
const formData = computed(() => {
  if (props.block) {
    // Editing existing block - ensure block_name is available
    return {
      ...props.block,
      block_name: props.block.block_name || ''
    }
  } else {
    // Creating new block - provide defaults
    return {
      corporate_id: 0,
      unit_id: 0,
      block_name: '',
      status: true
    }
  }
})

const handleSubmit = async (submitData) => {
  try {
    // The submitData contains the form data from DynamicForm
    // Since we're using formConfig with field_code as id, the data will have block_name as key
    const formDataValue = submitData.data || {}
    
    // Extract block_name from form data (it uses field_code as the key)
    const blockName = formDataValue.block_name || ''
    
    if (!blockName || blockName.trim() === '') {
      // Show error - block_name is required
      console.error('Block name is required')
      return
    }
    
    // Transform the form data to match API expectations
    let statusValue = true
    if (formDataValue.status !== undefined) {
      statusValue = formDataValue.status
    } else if (formData.value.status !== undefined) {
      statusValue = formData.value.status
    }
    
    const payload = {
      corporate_id: formDataValue.corporate_id ?? formData.value.corporate_id ?? 0,
      unit_id: formDataValue.unit_id ?? formData.value.unit_id ?? 0,
      block_name: blockName,
      status: statusValue
    }

    // If editing, include the id
    if (props.block?.id) {
      payload.id = props.block.id
    }

    // Submit to API
    const response = await axios.post('http://13.200.174.164:3001/v1/masters/infra/blocks', payload, {
      headers: { 'Content-Type': 'application/json' }
    })

    if (response.data.success) {
      emit('submit', { data: payload, response: response.data })
      isOpen.value = false
    }
  } catch (err) {
    console.error('Error submitting block:', err)
    // You might want to show an error message to the user here
  }
}
</script>

