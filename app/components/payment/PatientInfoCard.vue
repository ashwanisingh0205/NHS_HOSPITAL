<template>
  <UCard>
    <div class="flex items-center gap-4">
      <UAvatar 
        :src="patient.avatar" 
        :alt="patient.name"
        size="xl"
        class="flex-shrink-0"
      />
      
      <div class="flex-1">
        <div class="flex items-center gap-2 mb-2">
          <h2 class="text-xl font-bold">{{ patient.name }}</h2>
          <UBadge 
            v-for="badge in patient.badges" 
            :key="badge"
            :color="getBadgeColor(badge)"
            variant="soft"
            size="sm"
          >
            {{ badge }}
          </UBadge>
        </div>
        
        <div class="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div class="flex items-center gap-1">
            <UIcon name="lucide:user" class="w-4 h-4" />
            <span>{{ patient.age }} years / {{ patient.gender }}</span>
          </div>
          
          <div class="flex items-center gap-1">
            <UIcon name="lucide:id-card" class="w-4 h-4" />
            <span>Patient ID: {{ patient.id }}</span>
          </div>
          
          <div class="flex items-center gap-1">
            <UIcon name="lucide:calendar" class="w-4 h-4" />
            <span>Admitted: {{ patient.admissionDate }}</span>
          </div>
        </div>
      </div>
      
      <div class="text-right flex-shrink-0">
        <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Attending Physician</p>
        <div class="flex items-center gap-2">
          <UAvatar 
            :src="patient.physician.avatar" 
            :alt="patient.physician.name"
            size="sm"
          />
          <div>
            <p class="text-sm font-medium">{{ patient.physician.name }}</p>
          </div>
        </div>
      </div>
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
      }
    })
  }
})

const getBadgeColor = (badge) => {
  const colors = {
    'Open': 'info',
    'Provisional': 'error',
    
  }
  return colors[badge] || 'gray'
}
</script>
