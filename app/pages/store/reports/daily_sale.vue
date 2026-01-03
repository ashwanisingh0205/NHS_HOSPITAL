<template>
  <Form />
</template>

<script setup>
definePageMeta({
  layout: 'home'
})

import Form from '~/components/form_builder/Form.vue'
const handleSubmit = (data) => {
  console.log('Form submitted:', data)
  alert('Form submitted successfully!')
}
</script>
