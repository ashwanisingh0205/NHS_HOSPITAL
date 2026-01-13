<template>
  <div class="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6 mb-6">
    <div class="flex items-center justify-between gap-6 flex-wrap">
      <!-- Patient Information (Left) -->
      <div class="flex items-center gap-4 flex-1 min-w-0">
        <div class="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center shrink-0 overflow-hidden">
          <img 
            v-if="patientData.profileImage" 
            :src="patientData.profileImage" 
            :alt="patientData.name"
            class="w-full h-full object-cover"
          />
          <UIcon v-else name="lucide:user" class="w-8 h-8 text-gray-400" />
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 flex-wrap">
            <h1 class="text-xl font-bold text-gray-900 dark:text-gray-100">{{ patientData.name }}</h1>
            <UBadge 
              v-for="(badge, index) in patientData.badges" 
              :key="index"
              :label="badge.label" 
              :color="badge.color" 
              variant="soft" 
              size="sm" 
            />
          </div>
          <div class="flex items-center gap-4 mt-1 text-sm text-gray-600 dark:text-gray-400 flex-wrap">
            <span v-if="patientData.age && patientData.gender">{{ patientData.age }} years / {{ patientData.gender }}</span>
            <span v-if="patientData.patientId">Patient ID: {{ patientData.patientId }}</span>
            <span v-if="patientData.admittedDate">Admitted: {{ patientData.admittedDate }}</span>
          </div>
        </div>
      </div>

      <!-- Search Bar (Middle) -->
      <div class="flex-1 max-w-md">
        <SearchBar
          :model-value="searchQuery"
          :suggestions="suggestions"
          @update:model-value="$emit('update:searchQuery', $event)"
          @search="$emit('search', $event)"
        />
      </div>

      <!-- Attending Physician (Right) -->
      <div class="flex flex-col items-center gap-2 shrink-0">
        <div class="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
          <img 
            v-if="attendingPhysician.profileImage" 
            :src="attendingPhysician.profileImage" 
            :alt="attendingPhysician.name"
            class="w-full h-full object-cover"
          />
          <UIcon v-else name="lucide:user" class="w-6 h-6 text-gray-400" />
        </div>
        <div class="text-center">
          <p class="text-xs text-gray-500 dark:text-gray-400">Attending Physician</p>
          <p class="text-sm font-semibold text-gray-900 dark:text-gray-100">{{ attendingPhysician.name }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import SearchBar from '~/components/ot/SearchBar.vue'

const props = defineProps({
  patientData: {
    type: Object,
    required: true,
    default: () => ({
      name: '',
      badges: [],
      age: '',
      gender: '',
      patientId: '',
      admittedDate: '',
      profileImage: null
    })
  },
  attendingPhysician: {
    type: Object,
    required: true,
    default: () => ({
      name: '',
      profileImage: null
    })
  },
  searchQuery: {
    type: String,
    default: ''
  },
  suggestions: {
    type: Array,
    default: () => []
  }
})

defineEmits(['update:searchQuery', 'search'])
</script>
