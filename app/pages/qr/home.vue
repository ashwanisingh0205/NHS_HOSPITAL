<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <AppHeader show-notifications />

    <!-- Main Content -->
    <div class="px-6 py-6">
      <!-- Welcome Section -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-1">Welcome</h1>
        <p class="text-gray-600">How can we help you today?</p>
      </div>

      <!-- Complaint Window Card -->
      <UCard class="mb-6 bg-gray-100 border-0">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-full bg-teal-500 flex items-center justify-center shrink-0">
            <UIcon name="lucide:headphones" class="w-6 h-6 text-white" />
          </div>
          <div class="flex-1">
            <h3 class="font-semibold text-gray-900">Complaint Window</h3>
            <p class="text-sm text-gray-600">We're here to help 24/7</p>
          </div>
        </div>
      </UCard>

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

      <!-- All Services -->
      <div class="mb-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">ALL SERVICES</h2>
        <div class="grid grid-cols-2 gap-4">
          <UCard
            v-for="service in filteredServices"
            :key="service.id"
            class="cursor-pointer hover:shadow-md transition-shadow text-center p-4"
            @click="selectService(service)"
          >
            <div class="flex flex-col items-center gap-3">
              <div class="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                <UIcon :name="service.icon" class="w-8 h-8 text-gray-600" />
              </div>
              <p class="text-sm font-medium text-gray-900">{{ service.name }}</p>
            </div>
          </UCard>
        </div>
      </div>

      <!-- Need Assistance -->
      <div class="bg-white rounded-lg p-4 flex items-center gap-3">
        <UIcon name="lucide:phone" class="w-6 h-6 text-teal-600" />
        <div class="flex-1">
          <p class="text-sm text-gray-600">Need immediate assistance?</p>
          <a href="tel:18001234567" class="text-teal-600 font-semibold">1800-123-4567</a>
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

const router = useRouter()
const searchQuery = ref('')

const services = ref([
  { id: 1, name: 'House Keeping', icon: 'lucide:brush-cleaning', category: 'housekeeping' },
    { id: 2, name: 'Food & Beverage', icon: 'lucide:utensils', category: 'fb' },
  { id: 3, name: 'Patient Complaints & Suggestions', icon: 'lucide:headphones', category: 'complaints' },
  { id: 4, name: 'Plumber', icon: 'lucide:bed', category: 'gda' },
  { id: 5, name: 'Electricity & Maintenance', icon: 'lucide:zap', category: 'em' },
  { id: 6, name: 'IPD Billing', icon: 'lucide:dollar-sign', category: 'billing' },

])

const filteredServices = computed(() => {
  if (!searchQuery.value.trim()) {
    return services.value
  }
  const query = searchQuery.value.toLowerCase()
  return services.value.filter(service =>
    service.name.toLowerCase().includes(query)
  )
})

const selectService = (service) => {
  router.push(`/qr/select-service?category=${service.category}`)
}
</script>
