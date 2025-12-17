<template>
  <UModal
    v-model:open="isOpen"
    :ui="{ width: 'w-[95vw] max-w-[95vw]', bg: 'bg-white dark:bg-gray-800', rounded: 'rounded-lg', zIndex: 'z-50' }"
  >
    <template #header>
      <div class="flex items-center justify-between w-full">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">
          {{ props.location ? 'Edit Location' : 'Create New Location' }}
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
  location: { type: Object, default: null },
  floor: { type: Object, default: null },
  formConfig: { type: Object, default: null }
});

const emit = defineEmits(['update:open', 'submit']);

const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value)
});

// Prepare form data - ensure location and floor_id are available
const formData = computed(() => {
  if (props.location) {
    // Editing existing location
    return {
      ...props.location,
      location: props.location.location || '',
      floor_id: props.location.floor_id || props.floor?.id || null
    }
  } else {
    // Creating new location - use selected floor's data
    return {
      corporate_id: props.floor?.corporate_id || 0,
      unit_id: props.floor?.unit_id || 0,
      block_id: props.floor?.block_id || null,
      floor_id: props.floor?.id || null,
      company_id: 1,
      location_type_id: 1,
      location_type: 'PT',
      category_id: 1,
      location: '',
      full_path: '',
      status_store: true,
      status: true
    }
  }
})

const handleSubmit = async (submitData) => {
  try {
    // The submitData contains the form data from DynamicForm
    const formDataValue = submitData.data || {}
    
    // Extract location from form data
    const locationName = formDataValue.location || ''
    
    if (!locationName || locationName.trim() === '') {
      console.error('Location is required')
      return
    }
    
    // Ensure floor_id is present
    const floorId = formDataValue.floor_id ?? formData.value.floor_id
    if (!floorId) {
      console.error('Floor ID is required')
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
      block_id: formDataValue.block_id ?? formData.value.block_id ?? null,
      floor_id: floorId,
      company_id: formDataValue.company_id ?? formData.value.company_id ?? 1,
      location_type_id: formDataValue.location_type_id ?? formData.value.location_type_id ?? 1,
      location_type: formDataValue.location_type ?? formData.value.location_type ?? 'PT',
      category_id: formDataValue.category_id ?? formData.value.category_id ?? 1,
      location: locationName,
      full_path: formDataValue.full_path ?? formData.value.full_path ?? '',
      status_store: (() => {
        if (formDataValue.status_store !== undefined) return formDataValue.status_store
        if (formData.value.status_store !== undefined) return formData.value.status_store
        return true
      })(),
      status: statusValue
    }

    // If editing, include the id
    if (props.location?.id) {
      payload.id = props.location.id
    }

    // Submit to API
    const response = await axios.post('http://13.200.174.164:3001/v1/masters/infra/locations', payload, {
      headers: { 'Content-Type': 'application/json' }
    })

    if (response.data.success) {
      emit('submit', { data: payload, response: response.data })
      isOpen.value = false
    }
  } catch (err) {
    console.error('Error submitting location:', err)
  }
}
</script>

