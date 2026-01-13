<template>
  <UButton
    variant="ghost"
    color="gray"
    size="sm"
    class="uppercase"
  >
    {{ currentLanguage }}
  </UButton>
</template>

<script setup>
const currentLanguage = ref('EN')
</script>
