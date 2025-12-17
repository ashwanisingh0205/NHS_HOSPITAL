<template>
  <div>
    <UCard
      :ui="cardUi"
      :variant="isSelected ? 'outline' : 'soft'"
    >
      <div class="flex items-start justify-between gap-2">
        <div class="flex-1 min-w-0">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-3">
            {{ field.label || field.field_code || `Field ${field.id}` }}
          </h3>
          <p v-if="field.field_code" class="text-sm text-gray-500">
            Code: {{ field.field_code }}
          </p>
          <p v-if="field.label" class="text-sm text-gray-500">
            Label: {{ field.label }}
          </p>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <UButton
            @click.stop="$emit('edit', field)"
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
  field: { type: Object, required: true },
  isSelected: { type: Boolean, default: false }
})

defineEmits(['edit', 'view'])

const cardUi = computed(() => ({
  base: 'cursor-pointer transition-all hover:shadow-md',
  body: { padding: 'p-4' }
}))
</script>

