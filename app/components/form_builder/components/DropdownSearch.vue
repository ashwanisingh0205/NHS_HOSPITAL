<template>
  <UFormField :label="field.label">
    <USelectMenu
      v-model="selectedValue"
      :options="options"
      :loading="loading"
      :searchable="true"
      :placeholder="field.title || field.placeholder || 'Search...'"
      :icon="field.icon"
      searchable-placeholder="Type to search..."
      @search="handleSearch"
      @update:model-value="handleSelect"
    >
      <template #option="{ option }">
        <span>{{ getDisplayText(option) }}</span>
      </template>
    </USelectMenu>
  </UFormField>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useFetch } from '#app'

const props = defineProps({
  field: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits(['event'])

// State
const selectedValue = ref(null)
const loading = ref(false)
const options = ref([])
const searchQuery = ref('')

// Computed
const apiEndpoint = computed(() => {
  return props.field.data_endpoint || props.field.endpoint || 'http://localhost:4000/marc/patient_info'
})

// Initialize selected value on mount
onMounted(() => {
  const initialValue = props.field.value?.[props.index]
  if (initialValue) {
    selectedValue.value = initialValue
  }
})

// Get display text for option
function getDisplayText(option) {
  if (typeof option === 'string') return option
  return option?.title || option?.name || option?.label || option?.value || String(option)
}

// Handle search with debouncing and lazy loading
let debounceTimer = null
async function handleSearch(query) {
  searchQuery.value = query
  
  if (!query || query.length < 2) {
    options.value = []
    return
  }

  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(async () => {
    await fetchOptions(query)
  }, 300)
}

// Fetch options from API (lazy loading)
async function fetchOptions(query) {
  if (!query) return

  loading.value = true
  
  try {
    const { data, error } = await useFetch(apiEndpoint.value, {
      method: 'GET',
      params: {
        search: query,
        limit: props.field.limit || 50,
      },
      lazy: true,
    })

    if (error.value) {
      console.error('Search error:', error.value)
      options.value = []
      return
    }

    // Handle different response formats
    const responseData = data.value
    const items = responseData?.result || responseData?.data || responseData?.items || responseData || []
    
    options.value = Array.isArray(items) ? items : []
  } catch (err) {
    console.error('Search error:', err)
    options.value = []
  } finally {
    loading.value = false
  }
}

// Handle selection
function handleSelect(value) {
  if (!value) return

  const displayText = getDisplayText(value)
  
  // Update field value
  if (!Array.isArray(props.field.value)) {
    props.field.value = []
  }
  props.field.value[props.index] = displayText

  // Update raw value if field has value_raw
  if (props.field.value_raw) {
    if (!Array.isArray(props.field.value_raw)) {
      props.field.value_raw = []
    }
    props.field.value_raw[props.index] = value
  }

  // Trigger server event if needed
  if (props.field.serverTrigger) {
    props.field.trigger = 1
    emit('event')
  }
}
</script>
