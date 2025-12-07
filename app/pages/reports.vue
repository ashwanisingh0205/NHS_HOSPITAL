<script setup>
definePageMeta({ layout: 'home' })

const { users } = usePatientData()

// Convert object response to array if needed
const reportsData = computed(() => {

  if (Array.isArray(users.value)) {
    return users.value
  }

  return []
})
</script>

<template>
  <UContainer>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl  text-gray-900 dark:text-white">IPD Patients</h1>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Admission and discharge statistics</p>
        </div>
        
      </div>

      <!-- Loading State -->
      <div v-if="pending" class="flex items-center justify-center py-12">
        
      </div>

      

      <!-- Data Grid -->
      <div v-else-if="reportsData && reportsData.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ReportCard
          v-for="(item, index) in reportsData"
          :key="index"
          :item="item"
        />
      </div>

      
    </div>
  </UContainer>
</template>
