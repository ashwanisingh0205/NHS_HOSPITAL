<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <AppHeader show-back show-search @back="goBack" />

    <!-- Service Icon -->
    <div class="flex justify-center py-4 bg-white">
      <div class="w-16 h-16 rounded-full bg-teal-500 flex items-center justify-center">
        <UIcon name="lucide:headphones" class="w-8 h-8 text-white" />
      </div>
    </div>

    <!-- Main Content -->
    <div class="px-6 py-6">
      <!-- Search Bar -->
      <div class="mb-6">
        <UInput
          v-model="searchQuery"
          icon="lucide:search"
          placeholder="Search for services..."
          size="lg"
          class="w-full"
        />
      </div>

      <!-- Select Service -->
      <div>
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Select your service</h2>
        <div class="bg-white rounded-lg overflow-hidden">
          <div
            v-for="(service, index) in filteredServices"
            :key="service.id"
            class="flex items-center justify-between p-4 border-b border-gray-200 last:border-b-0 cursor-pointer hover:bg-gray-50 transition-colors"
            :class="{
              'rounded-t-lg': index === 0,
              'rounded-b-lg': index === filteredServices.length - 1
            }"
            @click="selectService(service)"
          >
            <span class="text-gray-900 font-medium">{{ service.name }}</span>
            <UIcon name="lucide:chevron-right" class="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import AppHeader from '~/components/testing/AppHeader.vue'

definePageMeta({
  layout: 'home'
})

const route = useRoute()
const router = useRouter()
const searchQuery = ref('')

// Service list based on category
const serviceList = {
  housekeeping: [
    { id: 1, name: 'Basin Cleaning' },
    { id: 2, name: 'Bath Towel Required' },
    { id: 3, name: 'Room Cleaning' },
    { id: 4, name: 'Bed Sheet Change' },
    { id: 5, name: 'Waste Disposal' }
  ],
  complaints: [
    { id: 1, name: 'Service Quality Issue' },
    { id: 2, name: 'Staff Behavior' },
    { id: 3, name: 'Facility Issue' },
    { id: 4, name: 'General Suggestion' }
  ],
  gda: [
    { id: 1, name: 'Patient Assistance' },
    { id: 2, name: 'Mobility Support' },
    { id: 3, name: 'Personal Care' }
  ],
  em: [
    { id: 1, name: 'Electrical Issue' },
    { id: 2, name: 'Equipment Malfunction' },
    { id: 3, name: 'Maintenance Request' }
  ],
  billing: [
    { id: 1, name: 'Bill Inquiry' },
    { id: 2, name: 'Payment Issue' },
    { id: 3, name: 'Insurance Query' }
  ],
  fb: [
    { id: 1, name: 'Food Quality' },
    { id: 2, name: 'Special Diet Request' },
    { id: 3, name: 'Meal Timing' }
  ]
}

const category = computed(() => route.query.category || 'housekeeping')
const services = computed(() => serviceList[category.value] || [])

const filteredServices = computed(() => {
  if (!searchQuery.value.trim()) {
    return services.value
  }
  const query = searchQuery.value.toLowerCase()
  return services.value.filter(service =>
    service.name.toLowerCase().includes(query)
  )
})

const goBack = () => {
  router.push('/testing/main-menu')
}

const selectService = (service) => {
  router.push(`/testing/service-request?service=${service.name}&category=${category.value}`)
}
</script>
