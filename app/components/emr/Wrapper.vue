<template>
  <div class="space-y-2">
    <!-- Field Label -->
    <div v-if="field.label" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
      {{ field.label }}
      <span v-if="field.required" class="text-red-500">*</span>
    </div>

    <!-- Text Input Types -->
    <UInput
      v-if="isTextInput"
      v-model="field.value[0]"
      :type="field.data_type.toLowerCase()"
      :placeholder="field.label"
      :icon="field.icon"
      class="w-full"
    />

    <!-- Select -->
    <USelectMenu
      v-else-if="field.data_type === 'DROPDOWN'"
      v-model="field.value[0]"
      :items="selectItems"
      :placeholder="field.label"
      searchable
      :icon="field.icon"
      class="w-full"
    />

    <!-- Textarea -->
    <UTextarea
      v-else-if="field.data_type === 'textarea'"
      v-model="field.value[0]"
      :placeholder="field.label"
      :rows="field.rows || 4"
    />

    <!-- Single Checkbox -->
    <UCheckbox
      v-else-if="field.data_type === 'CHECKBOX' && !field.options"
      v-model="field.value[0]"
      :label="field.checkboxLabel || field.label"
    />

    <!-- Multiple Checkboxes -->
    <div v-else-if="field.data_type === 'CHECKBOX' && field.options" class="space-y-2">
      <UCheckbox
        v-for="opt in normalizedOptions"
        :key="opt.value"
        :model-value="isCheckboxSelected(opt.value)"
        @update:model-value="toggleCheckbox(opt.value, $event)"
        :label="opt.label"
      />
    </div>

    <!-- Radio -->
    <div v-else-if="field.data_type === 'RADIO'" class="flex gap-4">
      <label
        v-for="opt in normalizedOptions"
        :key="opt.value"
        class="flex items-center gap-2 cursor-pointer"
      >
        <input
          type="radio"
          :name="field.id"
          :value="opt.value"
          :checked="localValue === opt.value"
          @change="localValue = opt.value"
          class="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
        />
        <span class="text-sm text-gray-700 dark:text-gray-300">{{ opt.label }}</span>
      </label>
    </div>

    <!-- Star Rating -->
    <div v-else-if="isStarRating" class="flex items-center gap-1">
      <UButton
        v-for="star in maxStars"
        :key="star"
        :variant="star <= (hoveredStar || starRating) ? 'solid' : 'outline'"
        :color="star <= (hoveredStar || starRating) ? 'yellow' : 'gray'"
        @click="setStarRating(star)"
        @mouseenter="hoveredStar = star"
        @mouseleave="hoveredStar = null"
        size="md"
        square
      >
        <span v-if="star <= (hoveredStar || starRating)">⭐</span>
        <span v-else>✩</span>
      </UButton>
      <span v-if="starRating > 0" class="ml-2 text-sm text-gray-600 dark:text-gray-400">
        {{ starRating }}/{{ maxStars }}
      </span>
    </div>

    <!-- Date -->
    <UInput
      v-else-if="field.data_type === 'DATE'"
      v-model="localValue"
      type="date"
    />

    <!-- Date Range -->
    <div v-else-if="field.data_type === 'DATE_RANGE'" class="flex items-center gap-2 w-full">
      <UInput 
        v-model="field.value[0]" 
        type="date"
        :placeholder="field.placeholderFrom || 'Date from'"
        class="flex-1 min-w-0"
      />
      <UIcon name="lucide:arrow-left-right" class="w-4 h-4 text-gray-400 shrink-0" />
      <UInput 
        v-model="field.value[1]" 
        type="date"
        :placeholder="field.placeholderTo || 'Date to'"
        class="flex-1 min-w-0"
      />
    </div>

    <!-- Nested Fields -->
    <div
      v-else-if="field.data_type === 'group' && field.fields"
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
          @update:model-value="updateNested(subField.id, $event)"
        />
      </div>
    </div>

    <!-- Error Message -->
    <p v-if="errorMsg" class="text-sm text-red-600 dark:text-red-400 mt-1">
      {{ errorMsg }}
    </p>
  </div>
</template>

<script setup>
const props = defineProps({
  field: { type: Object, required: true },
  modelValue: { type: [String, Number, Boolean, Object, Array], default: '' },
  error: { type: [String, Object], default: null }
})

const emit = defineEmits(['update:modelValue'])

// Field type checks
const isTextInput = computed(() => 
  ['TEXT', 'EMAIL', 'NUMBER', 'PASSWORD', 'tel', 'url', 'DATE'].includes(props.field.data_type)
)

const isStarRating = computed(() => 
  ['STAR', 'star'].includes(props.field.data_type)
)

// Select items (simple strings for USelectMenu)
const selectItems = computed(() => {
  const opts = props.field.options || []
  return opts.map(opt => typeof opt === 'object' ? opt.value || opt.label : opt)
})

// Normalized options for checkboxes/radio
const normalizedOptions = computed(() => {
  const opts = props.field.options || []
  return opts.map(opt => 
    typeof opt === 'object' ? opt : { label: opt, value: opt }
  )
})

// Main v-model handler
const localValue = computed({
  get: () => props.field.data_type === 'group' ? nestedValues.value : props.modelValue,
  set: val => {
    if (props.field.data_type === 'group') return
    emit('update:modelValue', props.field.data_type === 'number' ? (val === '' ? null : Number(val)) : val)
  }
})

// Checkbox helpers
const isCheckboxSelected = (value) => {
  if (!Array.isArray(localValue.value)) return false
  return localValue.value.includes(value)
}

const toggleCheckbox = (value, checked) => {
  const arr = Array.isArray(localValue.value) ? [...localValue.value] : []
  const idx = arr.indexOf(value)
  
  if (checked && idx === -1) {
    arr.push(value)
    emit('update:modelValue', arr)
  } else if (!checked && idx > -1) {
    arr.splice(idx, 1)
    emit('update:modelValue', arr)
  }
}

// Nested fields
const nestedValues = ref({})

const updateNested = (id, val) => {
  nestedValues.value[id] = val
  emit('update:modelValue', { ...nestedValues.value })
}

// Star rating
const maxStars = computed(() => props.field.maxStars || props.field.max_stars || 5)

const starRating = computed(() => {
  const val = props.field.value?.[0] ?? props.modelValue ?? null
  
  if (val == null || val === '' || val === undefined) return 0
  
  if (typeof val === 'number') return Math.max(0, val)
  
  if (typeof val === 'string') {
    const num = parseInt(val, 10)
    return isNaN(num) || num <= 0 ? 0 : num
  }
  
  return 0
})

const hoveredStar = ref(null)

const setStarRating = (rating) => {
  // Update field.value[0] directly
  if (!props.field.value) {
    props.field.value = []
  }
  if (!Array.isArray(props.field.value)) {
    props.field.value = []
  }
  props.field.value[0] = rating
  
  // Emit for v-model support
  emit('update:modelValue', rating)
  
  // Clear hover state
  hoveredStar.value = null
}

// Error message
const errorMsg = computed(() => {
  if (!props.error) return null
  return typeof props.error === 'string' ? props.error : props.error?.[props.field.id] || null
})
</script>