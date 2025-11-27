<template>
  <UCard>
    <form class="space-y-6" @submit.prevent="handleSubmit">
      <div class="grid gap-6 md:grid-cols-2">
        <div
          v-for="field in formConfig.fields"
          :key="field.id"
          :class="{ 'md:col-span-2': field.fullWidth || field.type === 'group' }"
        >
          <Wrapper
            :field="field"
            v-model="formData[field.id]"
            :error="validationErrors[field.id]"
          />
        </div>
      </div>

      <div class="flex gap-3 pt-2">
        <UButton type="submit" :loading="loading" size="lg">
          Submit form
        </UButton>
      </div>
    </form>
  </UCard>
</template>

<script setup>
import Wrapper from '~/components/emr/Wrapper.vue'

const props = defineProps({
  formConfig: { type: Object, required: true },
  initialData: { type: Object, default: null }
})

const emit = defineEmits(['submit'])

const formData = ref({})
const loading = ref(false)
const validationErrors = ref({})

const getDefaultValue = (field) => {
  if (field.defaultValue !== undefined) return field.defaultValue
  if (field.type === 'checkbox') return false
  if (['number', 'select', 'radio'].includes(field.type)) return null
  return ''
}

const getValueFromData = (field, data) => {
  if (!data) return getDefaultValue(field)
  
  if (field.type === 'group' && field.fields) {
    const groupData = data[field.id] || {}
    const result = {}
    field.fields.forEach(subField => {
      result[subField.id] = groupData[subField.id] ?? getDefaultValue(subField)
    })
    return result
  }
  
  return data[field.id] ?? getDefaultValue(field)
}

const initForm = () => {
  const initialState = {}
  const sourceData = props.initialData || {}
  
  props.formConfig.fields?.forEach(field => {
    initialState[field.id] = getValueFromData(field, sourceData)
  })
  
  formData.value = initialState
  validationErrors.value = {}
}

const isFieldEmpty = (value, fieldType) => {
  if (value === null || value === undefined) return true
  if (fieldType === 'checkbox') return !value
  if (typeof value === 'string') return !value.trim()
  return false
}

const validateForm = () => {
  const errors = {}
  let isValid = true

  props.formConfig.fields?.forEach(field => {
    if (!field.required) return
    
    const value = formData.value[field.id]
    
    if (field.type === 'group' && field.fields) {
      field.fields.forEach(subField => {
        if (subField.required) {
          const subValue = value?.[subField.id]
          if (isFieldEmpty(subValue, subField.type)) {
            errors[field.id] = errors[field.id] || {}
            errors[field.id][subField.id] = `${subField.label || 'This field'} is required`
            isValid = false
          }
        }
      })
    } else {
      if (isFieldEmpty(value, field.type)) {
        errors[field.id] = `${field.label || 'This field'} is required`
        isValid = false
      }
    }
  })

  validationErrors.value = errors
  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return

  loading.value = true
  try {
    emit('submit', { ...formData.value })
  } finally {
    loading.value = false
  }
}

onMounted(() => initForm())
watch(() => props.formConfig, () => initForm(), { deep: true })
watch(() => props.initialData, () => initForm(), { deep: true })
</script>
