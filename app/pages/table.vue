<template>
  <div class="container mt-4">
    <h1 class="text-2xl font-bold mb-4">{{ formConfig?.form?.form_name || 'Table Component Page' }}</h1>
    <form v-if="formConfig">
      <FormRenderer 
        :fields="formConfig.fields" 
      />
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import FormRenderer from '../components/form_builder/FormRenderer.vue'
import tableJson from '../../table.json'

definePageMeta({ layout: 'home' })

const formConfig = ref(null)



const loadForm = () => {
  formConfig.value = tableJson
  console.log('formConfig:', formConfig.value)
}

onMounted(() => {
  loadForm()
})
</script>
