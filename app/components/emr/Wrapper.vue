<template>
  <div class="space-y-2">
    <!-- Field Label -->
    <label v-if="field.label" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
      {{ field.label }}
      <span v-if="field.required" class="text-red-500">*</span>
    </label>

    <!-- Text Input Types -->
    <UInput
      v-if="['text', 'email', 'number', 'password', 'tel', 'url','date'].includes(field.type)"
      v-model="localValue"
      :type="field.type"
      :placeholder="field.placeholder"
      :min="field.min"
      :max="field.max"
      :icon="field.icon"
      :error="errorMessage"
    />

    <!-- Select -->
    <USelectMenu
      v-else-if="field.type === 'select'"
      v-model="localValue"
      :options="fieldOptions"
      :placeholder="field.placeholder"
      option-attribute="label"
      value-attribute="value"
      :icon="field.icon"
      :error="errorMessage"
    />

    <!-- Textarea -->
    <UTextarea
      v-else-if="field.type === 'textarea'"
      v-model="localValue"
      :placeholder="field.placeholder"
      :rows="field.rows || 4"
      :error="errorMessage"
    />

    <!-- Checkbox -->
    <UCheckbox
      v-else-if="field.type === 'checkbox'"
      v-model="localValue"
      :label="field.checkboxLabel || field.label"
      :error="errorMessage"
    />

    <!-- Radio -->
    <div v-else-if="field.type === 'radio'" class="flex gap-4">
      <label
        v-for="option in fieldOptions"
        :key="option.value || option"
        class="flex items-center gap-2 cursor-pointer"
      >
        <input
          type="radio"
          :name="field.id"
          :value="option.value || option"
          :checked="localValue === (option.value || option)"
          @change="localValue = option.value || option"
          class="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
        />
        <span class="text-sm text-gray-700 dark:text-gray-300">{{ option.label || option }}</span>
      </label>
    </div>

    <!-- Date -->
    <UInput
      v-else-if="field.type === 'date'"
      v-model="localValue"
      type="date"
      :error="errorMessage"
    />

    <!-- Nested Fields (Recursive) -->
    <div
      v-else-if="field.type === 'group' && field.fields"
      class="rounded-lg border border-gray-200 bg-gray-50/60 p-4 dark:border-gray-800 dark:bg-gray-900/40"
    >
      <p v-if="field.label" class="font-semibold text-gray-900 dark:text-white mb-4">
        {{ field.label }}
      </p>
      <div class="grid gap-4 md:grid-cols-2">
        <Wrapper
          v-for="subField in field.fields"
          :key="subField.id"
          :field="subField"
          v-model="nestedValues[subField.id]"
          :error="nestedError(subField.id)"
          @update:model-value="updateNestedValue(subField.id, $event)"
        />
      </div>
    </div>

   
  </div>
</template>

<script setup>
const props = defineProps({
  field: { type: Object, required: true },
  modelValue: { type: [String, Number, Boolean, Object], default: '' },
  error: { type: [String, Object], default: null }
})

const emit = defineEmits(['update:modelValue'])

/* ------------------ Main v-model Handler ------------------ */
const localValue = computed({
  get: () =>
    props.field.type === 'group'
      ? nestedValues.value
      : props.modelValue,

  set: val => {
    if (props.field.type === 'group') return // groups handled separately

    if (props.field.type === 'number') {
      emit('update:modelValue', val === '' ? null : Number(val))
    } else {
      emit('update:modelValue', val)
    }
  }
})

/* ------------------ Options ------------------ */
const fieldOptions = computed(() =>
  (props.field.options || []).map(opt =>
    typeof opt === 'object' ? opt : { label: opt, value: opt }
  )
)


  typeof props.error === 'object' ? props.error?.[id] || null : null
</script>

