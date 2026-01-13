<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <AppHeader title="Service Request" show-back @back="goBack" />

    <!-- Main Content -->
    <div class="px-6 py-6 space-y-6">
      <!-- Selected Service Banner -->
      <div class="bg-teal-500 rounded-lg p-4 flex items-center gap-3 text-white">
        <UIcon name="lucide:check" class="w-6 h-6" />
        <div>
          <p class="text-sm opacity-90">Selected Service</p>
          <p class="font-semibold">{{ selectedService }}</p>
        </div>
      </div>

      <!-- Form Sections -->
      <div class="space-y-4">
        <!-- Request Type -->
        <UCard>
          <div class="space-y-3">
            <div class="flex items-center gap-2">
              <UIcon name="lucide:file-text" class="w-5 h-5 text-gray-600" />
              <label class="font-medium text-gray-900">Request Type</label>
            </div>
            <div class="flex gap-2">
              <UButton
                v-for="type in requestTypes"
                :key="type"
                :variant="requestType === type ? 'solid' : 'outline'"
                :color="requestType === type ? 'teal' : 'gray'"
                @click="requestType = type"
                class="flex-1"
              >
                {{ type }}
              </UButton>
            </div>
          </div>
        </UCard>

        <!-- Priority Level -->
        <UCard>
          <div class="space-y-3">
            <div class="flex items-center gap-2">
              <UIcon name="lucide:alert-circle" class="w-5 h-5 text-gray-600" />
              <label class="font-medium text-gray-900">Priority Level</label>
            </div>
            <USelectMenu
              v-model="priority"
              :options="priorityOptions"
              value-attribute="value"
              option-attribute="label"
            >
              <template #label>
                <div class="flex items-center gap-2">
                  <div class="w-2 h-2 rounded-full" :class="priorityColorClass"></div>
                  <span>{{ priorityLabel }}</span>
                </div>
              </template>
              <template #option="{ option }">
                <div class="flex items-center gap-2">
                  <div class="w-2 h-2 rounded-full" :class="getPriorityColorClass(option.value)"></div>
                  <span>{{ option.label }}</span>
                </div>
              </template>
            </USelectMenu>
          </div>
        </UCard>

        <!-- Your Name -->
        <UCard>
          <div class="space-y-3">
            <div class="flex items-center gap-2">
              <UIcon name="lucide:user" class="w-5 h-5 text-gray-600" />
              <label class="font-medium text-gray-900">Your Name (Optional)</label>
            </div>
            <UInput
              v-model="name"
              placeholder="Enter your full name"
            />
          </div>
        </UCard>

        <!-- Details & Remarks -->
        <UCard>
          <div class="space-y-3">
            <div class="flex items-center gap-2">
              <UIcon name="lucide:file-text" class="w-5 h-5 text-gray-600" />
              <label class="font-medium text-gray-900">Details & Remarks</label>
            </div>
            <UTextarea
              v-model="details"
              placeholder="Please provide detailed information about your request..."
              :rows="4"
              :maxlength="500"
            />
            <p class="text-xs text-gray-500 text-right">{{ details.length }}/500</p>
          </div>
        </UCard>

        <!-- Attach Photo -->
        <UCard>
          <div class="space-y-3">
            <div class="flex items-center gap-2">
              <UIcon name="lucide:camera" class="w-5 h-5 text-gray-600" />
              <label class="font-medium text-gray-900">Attach Photo (Optional)</label>
            </div>
            <div
              class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-teal-500 transition-colors"
              @click="triggerFileUpload"
            >
              <input
                ref="fileInput"
                type="file"
                accept="image/jpeg,image/png"
                class="hidden"
                @change="handleFileUpload"
              />
              <UIcon name="lucide:upload" class="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p class="text-sm text-gray-600 mb-1">Upload Image</p>
              <p class="text-xs text-gray-400">JPG, PNG up to 5MB</p>
              <p v-if="uploadedImage" class="text-sm text-teal-600 mt-2">{{ uploadedImage.name }}</p>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Info Message -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p class="text-sm text-blue-800">
          Your request will be processed within 24 hours. You'll receive a confirmation via SMS.
        </p>
      </div>

      <!-- Submit Button -->
      <UButton
        block
        color="primary"
        size="lg"
        icon="lucide:send"
        @click="submitRequest"
        :disabled="!canSubmit"
      >
        Submit Request
      </UButton>
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

const selectedService = computed(() => route.query.service || 'Floor Cleaning')
const requestType = ref('Request')
const requestTypes = ['Request', 'Complaint', 'Incident']
const priority = ref('normal')
const name = ref('')
const details = ref('')
const uploadedImage = ref(null)
const fileInput = ref(null)

const priorityOptions = [
  { label: 'Normal', value: 'normal' },
  { label: 'High', value: 'high' },
  { label: 'Urgent', value: 'urgent' }
]

const priorityLabel = computed(() => {
  const option = priorityOptions.find(opt => opt.value === priority.value)
  return option?.label || 'Normal'
})

const priorityColorClass = computed(() => {
  return getPriorityColorClass(priority.value)
})

const getPriorityColorClass = (value) => {
  const colors = {
    normal: 'bg-green-500',
    high: 'bg-yellow-500',
    urgent: 'bg-red-500'
  }
  return colors[value] || 'bg-green-500'
}

const canSubmit = computed(() => {
  return details.value.trim().length > 0
})

const goBack = () => {
  router.back()
}

const triggerFileUpload = () => {
  fileInput.value?.click()
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }
    uploadedImage.value = file
  }
}

const submitRequest = () => {
  if (canSubmit.value) {
    // Generate ticket number
    const ticketNumber = 'TKT' + Math.floor(Math.random() * 1000000)
    router.push(`/testing/success?ticket=${ticketNumber}`)
  }
}
</script>
