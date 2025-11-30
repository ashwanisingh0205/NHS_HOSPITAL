<template>
  <UCard>
    <UForm class="space-y-6" @submit.prevent="handleSubmit">
      <div class="grid gap-6 md:grid-cols-4">
        <div
          v-for="field in formConfig.fields"
          :key="field.id"
          
        >
          <Wrapper
            :field="field"
            v-model="formData[field.id]"
           
          />
        </div>
      </div>

      <div class="flex gap-3 pt-2">
        <UButton type="submit" :loading="loading" size="lg">
          Submit form
        </UButton>
      </div>
    </UForm>
  </UCard>
</template>

<script setup>
import Wrapper from '~/components/emr/Wrapper.vue'


const props = defineProps({
  formConfig: { type: Object, required: true },
  initialData: { type: Object, default: null }
})
const emit = defineEmits(['submit'])

/* ------------------- State ------------------- */
const formData = ref({})
const loading = ref(false)
const validationErrors = ref({})

/* ------------------- Helpers ------------------- */
const getDefaultValue = (field) => {
  if (field.defaultValue !== undefined) return field.defaultValue
  if (field.type === 'checkbox') return false
  if (['number', 'select', 'radio'].includes(field.type)) return null
  return ''
}



const getValue = (field, source = {}) => {
  const raw = source[field.id]

  return raw ?? getDefaultValue(field)
}

/* ------------------- Init Form ------------------- */
const initForm = () => {
  const source = props.initialData || {}
  formData.value = Object.fromEntries(
    props.formConfig.fields.map(f => [f.id, getValue(f, source)])
  )
  

}


/* ------------------- Submit ------------------- */
const handleSubmit = () => {
 
  

  emit('submit', { ...formData.value })
  loading.value = false
}

/* ------------------- Auto Re-init ------------------- */
onMounted(initForm)
</script>




/// event --- click , change , focus,blur 
// submit -- which url 