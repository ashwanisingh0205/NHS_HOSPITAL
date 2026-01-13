<template>
  <UCard>
    <!-- Patient Summary Header -->
    <div class="flex items-start justify-between pb-4">
      <!-- Left Side - Patient Identification -->
      <div class="flex items-start gap-4 flex-1">
        <UAvatar 
          :src="patient.avatar" 
          :alt="patient.name"
          size="xl"
          class="flex-shrink-0"
        />
        
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-2">
            <h2 class="text-2xl font-bold">{{ patient.name }}</h2>
            <UBadge 
              v-for="badge in patient.badges" 
              :key="badge"
              :color="getBadgeColor(badge)"
              variant="soft"
              size="sm"
              :class="getBadgeClass(badge)"
            >
              {{ badge }}
            </UBadge>
            <UIcon 
              :name="isExpanded ? 'lucide:chevron-up' : 'lucide:chevron-down'" 
              class="w-4 h-4 text-gray-400 cursor-pointer transition-transform duration-200"
              @click="toggleAccordion"
            />
          </div>
          
          <div class="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div class="flex items-center gap-1.5">
              <UIcon name="lucide:user" class="w-4 h-4" />
              <span>{{ patient.age }} years / {{ patient.gender }}</span>
            </div>
            
            <div class="flex items-center gap-1.5">
              <UIcon name="lucide:id-card" class="w-4 h-4" />
              <span>Patient ID: {{ patient.id }}</span>
            </div>
            
            <div class="flex items-center gap-1.5">
              <UIcon name="lucide:calendar" class="w-4 h-4" />
              <span>Admitted: {{ patient.admissionDate }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Right Side - Attending Physician -->
      <div class="text-right flex-shrink-0 ml-4">
        <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">Attending Physician</p>
        <div class="flex items-center gap-2 justify-end">
          <UAvatar 
            :src="patient.physician.avatar" 
            :alt="patient.physician.name"
            size="md"
          />
          <p class="text-sm font-bold">{{ patient.physician.name }}</p>
        </div>
      </div>
    </div>

    <!-- Separator -->
    <div v-if="isExpanded" class="border-t border-dashed border-gray-300 dark:border-gray-700 my-4"></div>

    <!-- Patient Details Body -->
    <div v-show="isExpanded" class="grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-300">
      <!-- Left Column -->
      <div class="space-y-4">
        <div v-if="patient.contactNumber">
          <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Contact Number</p>
          <p class="text-sm font-bold">{{ patient.contactNumber }}</p>
        </div>
        
        <div v-if="patient.email">
          <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Email Address</p>
          <p class="text-sm font-bold">{{ patient.email }}</p>
        </div>
        
        <div v-if="patient.bloodGroup">
          <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Blood Group</p>
          <p class="text-sm font-bold">{{ patient.bloodGroup }}</p>
        </div>
        
        <div v-if="patient.allergies">
          <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Allergies</p>
          <p class="text-sm font-bold text-red-600 dark:text-red-400">{{ patient.allergies }}</p>
        </div>
      </div>

      <!-- Right Column -->
      <div class="space-y-4">
        <div v-if="patient.diagnosis">
          <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Diagnosis</p>
          <p class="text-sm font-bold">{{ patient.diagnosis }}</p>
        </div>
        
        <div v-if="patient.roomDetails">
          <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Room Details</p>
          <p class="text-sm font-bold">{{ patient.roomDetails }}</p>
        </div>
        
        <div v-if="patient.lengthOfStay">
          <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Length of Stay</p>
          <p class="text-sm font-bold">{{ patient.lengthOfStay }}</p>
        </div>
        
        <div v-if="patient.emergencyContact">
          <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Emergency Contact</p>
          <p class="text-sm font-bold">{{ patient.emergencyContact }}</p>
        </div>
      </div>
    </div>

    <!-- Residential Address (Full Width) -->
    <div v-if="patient.residentialAddress && isExpanded" class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-800">
      <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Residential Address</p>
      <p class="text-sm font-bold">{{ patient.residentialAddress }}</p>
    </div>
  </UCard>
</template>

<script setup>
const props = defineProps({
  patient: {
    type: Object,
    required: true,
    default: () => ({
      name: '',
      avatar: '',
      age: 0,
      gender: '',
      id: '',
      admissionDate: '',
      badges: [],
      physician: {
        name: '',
        avatar: ''
      },
      contactNumber: '',
      email: '',
      bloodGroup: '',
      allergies: '',
      diagnosis: '',
      roomDetails: '',
      lengthOfStay: '',
      emergencyContact: '',
      residentialAddress: ''
    })
  }
})

const isExpanded = ref(true)

const toggleAccordion = () => {
  isExpanded.value = !isExpanded.value
}

const getBadgeColor = (badge) => {
  const colors = {
    'Open': 'info',
    'Provisional': 'warning',
  }
  return colors[badge] || 'gray'
}

const getBadgeClass = (badge) => {
  if (badge === 'Open') {
    return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
  } else if (badge === 'Provisional') {
    return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
  }
  return ''
}
</script>
