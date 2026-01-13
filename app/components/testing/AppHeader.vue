<template>
  <div class="flex items-center justify-between p-4 bg-white">
    <div class="flex items-center gap-4">
      <UButton
        v-if="showBack"
        icon="lucide:arrow-left"
        variant="ghost"
        color="gray"
        @click="$emit('back')"
      />
      <h1 v-if="title" class="text-lg font-semibold text-gray-900">{{ title }}</h1>
      <h1 v-else class="text-lg font-semibold text-gray-900">MARC Hospital Patient And Staff Services</h1>
    </div>
    <div class="flex items-center gap-3">
      <UButton
        v-if="showSearch"
        icon="lucide:search"
        variant="ghost"
        color="gray"
        @click="$emit('search')"
      />
      <UButton
        v-if="showNotifications"
        icon="lucide:bell"
        variant="ghost"
        color="gray"
        @click="$emit('notify')"
      />
      <LanguageSelector />
    </div>
  </div>
</template>

<script setup>
import LanguageSelector from './LanguageSelector.vue'

defineProps({
  title: {
    type: String,
    default: ''
  },
  showBack: {
    type: Boolean,
    default: false
  },
  showSearch: {
    type: Boolean,
    default: false
  },
  showNotifications: {
    type: Boolean,
    default: false
  }
})

defineEmits(['back', 'search', 'notify'])
</script>
