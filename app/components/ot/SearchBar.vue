<template>
  <div class="relative w-full max-w-2xl mx-auto">
    <div class="relative">
      <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
        <UIcon name="lucide:search" class="w-5 h-5 text-gray-400" />
      </div>
      <input
        v-model="searchQuery"
        type="text"
        class="w-full pl-12 pr-4 py-3 text-base border border-gray-300 dark:border-gray-700 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
        placeholder="Search services, vitals, notes, actions..."
        @input="handleInput"
        @focus="showSuggestions = true"
        @blur="handleBlur"
        @keydown.down.prevent="navigateSuggestions('down')"
        @keydown.up.prevent="navigateSuggestions('up')"
        @keydown.enter.prevent="selectSuggestion"
      />
      <button
        v-if="searchQuery"
        @click="clearSearch"
        class="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
      >
        <UIcon name="lucide:x" class="w-5 h-5" />
      </button>
    </div>

    <!-- Suggestions Dropdown -->
    <div
      v-if="showSuggestions && filteredSuggestions.length > 0"
      class="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-96 overflow-y-auto"
    >
      <div
        v-for="(suggestion, index) in filteredSuggestions"
        :key="index"
        @mousedown.prevent="selectSuggestionItem(suggestion)"
        class="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
        :class="{ 'bg-blue-50 dark:bg-blue-900/20': index === selectedIndex }"
      >
        <div class="flex items-center gap-3">
          <UIcon :name="suggestion.icon" class="w-5 h-5 text-gray-400 shrink-0" />
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 dark:text-gray-100" v-html="highlightMatch(suggestion.title, searchQuery)"></p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5" v-html="highlightMatch(suggestion.description, searchQuery)"></p>
          </div>
          <UIcon
            v-if="suggestion.locked"
            name="lucide:lock"
            class="w-4 h-4 text-gray-400 shrink-0"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  suggestions: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'search', 'select'])

const searchQuery = ref(props.modelValue)
const showSuggestions = ref(false)
const selectedIndex = ref(-1)

watch(() => props.modelValue, (newVal) => {
  searchQuery.value = newVal
})

const filteredSuggestions = computed(() => {
  if (!searchQuery.value.trim()) {
    return props.suggestions.slice(0, 8) // Show top 8 when empty
  }
  
  const query = searchQuery.value.toLowerCase().trim()
  const queryWords = query.split(/\s+/)
  
  return props.suggestions.filter(item => {
    const title = item.title.toLowerCase()
    const desc = item.description?.toLowerCase() || ''
    const keywords = item.keywords?.map(k => k.toLowerCase()) || []
    
    // Check if all query words match (for multi-word searches)
    return queryWords.some(word => {
      const titleMatch = title.includes(word)
      const descMatch = desc.includes(word)
      const keywordMatch = keywords.some(k => k.includes(word))
      return titleMatch || descMatch || keywordMatch
    })
  })
  .sort((a, b) => {
    // Prioritize exact title matches
    const aTitleExact = a.title.toLowerCase().includes(query)
    const bTitleExact = b.title.toLowerCase().includes(query)
    if (aTitleExact && !bTitleExact) return -1
    if (!aTitleExact && bTitleExact) return 1
    return 0
  })
  .slice(0, 8)
})

const handleInput = () => {
  emit('update:modelValue', searchQuery.value)
  emit('search', searchQuery.value)
  selectedIndex.value = -1
}

const handleBlur = () => {
  // Delay to allow click events on suggestions
  setTimeout(() => {
    showSuggestions.value = false
  }, 200)
}

const clearSearch = () => {
  searchQuery.value = ''
  emit('update:modelValue', '')
  emit('search', '')
  showSuggestions.value = false
}

const navigateSuggestions = (direction) => {
  if (filteredSuggestions.value.length === 0) return
  
  if (direction === 'down') {
    selectedIndex.value = (selectedIndex.value + 1) % filteredSuggestions.value.length
  } else {
    selectedIndex.value = selectedIndex.value <= 0 
      ? filteredSuggestions.value.length - 1 
      : selectedIndex.value - 1
  }
}

const selectSuggestion = () => {
  if (selectedIndex.value >= 0 && filteredSuggestions.value[selectedIndex.value]) {
    selectSuggestionItem(filteredSuggestions.value[selectedIndex.value])
  }
}

const selectSuggestionItem = (suggestion) => {
  searchQuery.value = suggestion.title
  emit('update:modelValue', suggestion.title)
  emit('select', suggestion)
  showSuggestions.value = false
}

const highlightMatch = (text, query) => {
  if (!query || !text) return text
  const regex = new RegExp(`(${query})`, 'gi')
  return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>')
}
</script>

<style scoped>
mark {
  padding: 0;
  background-color: rgb(254 240 138);
}
</style>
