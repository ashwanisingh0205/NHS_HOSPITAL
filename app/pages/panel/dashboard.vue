<template>
</template>

<script setup>
definePageMeta({
  layout: 'home'
})

const handleSubmit = (data) => {
  console.log('Form submitted:', data)
  alert('Form submitted successfully!')
}
</script>
