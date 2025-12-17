<template>
  <UModal
    v-model:open="isOpen"
    :ui="{ width: 'w-[95vw] max-w-[95vw]', bg: 'bg-white dark:bg-gray-800', rounded: 'rounded-lg', zIndex: 'z-50' }"
  >
    <template #header>
      <div class="flex items-center justify-between w-full">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">
          {{ props.floor ? 'Edit Floor' : 'Create New Floor' }}
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
  floor: { type: Object, default: null },
  block: { type: Object, default: null },
  formConfig: { type: Object, default: null }
});

const emit = defineEmits(['update:open', 'submit']);

const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value)
});

// Prepare form data - ensure floor_name and block_id are available
const formData = computed(() => {
  if (props.floor) {
    // Editing existing floor
    return {
      ...props.floor,
      floor_name: props.floor.floor_name || '',
      block_id: props.floor.block_id || props.block?.id || null
    }
  } else {
    // Creating new floor - use selected block's data
    return {
      corporate_id: props.block?.corporate_id || 0,
      unit_id: props.block?.unit_id || 0,
      block_id: props.block?.id || null,
      floor_number: 0,
      floor_code: null,
      floor_name: '',
      status: true
    }
  }
})

const handleSubmit = async (submitData) => {
  try {
    // The submitData contains the form data from DynamicForm
    const formDataValue = submitData.data || {}
    
    // Extract floor_name from form data
    const floorName = formDataValue.floor_name || ''
    
    if (!floorName || floorName.trim() === '') {
      console.error('Floor name is required')
      return
    }
    
    // Ensure block_id is present
    const blockId = formDataValue.block_id ?? formData.value.block_id
    if (!blockId) {
      console.error('Block ID is required')
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
      block_id: blockId,
      floor_number: formDataValue.floor_number ?? formData.value.floor_number ?? 0,
      floor_code: formDataValue.floor_code ?? formData.value.floor_code ?? null,
      floor_name: floorName,
      status: statusValue
    }

    // If editing, include the id
    if (props.floor?.id) {
      payload.id = props.floor.id
    }

    // Submit to API
    const response = await axios.post('http://13.200.174.164:3001/v1/masters/infra/floors', payload, {
      headers: { 'Content-Type': 'application/json' }
    })

    if (response.data.success) {
      emit('submit', { data: payload, response: response.data })
      isOpen.value = false
    }
  } catch (err) {
    console.error('Error submitting floor:', err)
  }
}
</script>

