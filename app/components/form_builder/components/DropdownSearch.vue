<template>
  <UFormField :label="field.label">
    <USelectMenu
      v-model="fieldValue"
      :options="options"
      :loading="loading"
      :searchable="true"
      class="w-full"
      :placeholder="field.title || field.placeholder || 'Search...'"
      :icon="field.icon"
      searchable-placeholder="Type to search..."
      @search="handleSearch"
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
})

const emit = defineEmits(['event'])

// State
const loading = ref(false)
const options = ref([])
const searchQuery = ref('')

// Computed
const apiEndpoint = computed(() => {
  return props.field.data_endpoint || props.field.endpoint || ''
})

// Ensure field.value is an array first
onMounted(() => {
  if (!Array.isArray(props.field.value)) {
    props.field.value = [props.field.value || '']
  }
})

// Use computed with getter/setter for field.value[0]
const fieldValue = computed({
  get: () => {
    if (!Array.isArray(props.field.value)) {
      props.field.value = ['']
    }
    return props.field.value[0] ?? ''
  },
  set: (val) => {
    if (!Array.isArray(props.field.value)) {
      props.field.value = []
    }
    props.field.value[0] = val
    
    // Update raw value if field has value_raw
    if (props.field.value_raw) {
      if (!Array.isArray(props.field.value_raw)) {
        props.field.value_raw = []
      }
      props.field.value_raw[0] = val
    }

    // Trigger server event if needed
    if (props.field.serverTrigger || props.field.server_trigger) {
      props.field.trigger = 1
      emit('event')
    }
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

  if (!apiEndpoint.value) {
    console.warn('No API endpoint configured for DropdownSearch')
    return
  }

  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(async () => {
    await fetchOptions(query)
  }, 300)
}

// Fetch options from API (lazy loading)
async function fetchOptions(query) {
  if (!query || !apiEndpoint.value) return

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
</script>
