<template>
  <div>
    <UCard
      :ui="cardUi"
      @click="$emit('view', form)"
      :variant="isSelected ? 'outline' : 'soft'"
    >
      <div class="flex items-start justify-between gap-4">
        <div class="flex-1 min-w-0">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-3">
            {{ form.title }}
          </h3>

          <div class="space-y-1.5">
            <div v-for="field in formFields" :key="field.key" class="flex items-center gap-2 text-sm">
              <span class="font-medium text-gray-600 dark:text-gray-400">{{ field.label }}:</span>
              <UBadge :label="field.value" color="gray" variant="subtle" size="sm" />
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <UButton
            @click.stop="$emit('view', form)"
            variant="solid"
            size="sm"
            icon="i-lucide:eye"
            color="neutral"
          />
          <UButton
            @click.stop="$emit('edit', form)"
            variant="outline"
            size="sm"
            icon="i-lucide:pencil"
            color="neutral"
          />
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup>
const props = defineProps({
  form: { type: Object, required: true },
  isSelected: { type: Boolean, default: false }
})

defineEmits(['edit', 'view'])

const cardUi = computed(() => ({
  base: 'cursor-pointer transition-all hover:shadow-md',
  body: { padding: 'p-4' }
}))

const formFields = computed(() => [
  { key: 'template', label: 'Template', value: props.form.template || 'Template Name' },
  { key: 'css', label: 'CSS', value: props.form.css || 'CSS' },
  { key: 'header', label: 'Header', value: props.form.header || 'Header' },
  { key: 'footer', label: 'Footer', value: props.form.footer || 'Footer' },
  { key: 'letterhead', label: 'Letterhead', value: props.form.letterhead || 'Letterhead' }
])
</script>
