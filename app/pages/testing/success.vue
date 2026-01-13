<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12">
    <div class="w-full max-w-md">
      <!-- Success Icon -->
      <div class="flex justify-center mb-6">
        <div class="w-24 h-24 rounded-full bg-teal-500 flex items-center justify-center">
          <UIcon name="lucide:check" class="w-12 h-12 text-white" />
        </div>
      </div>

      <!-- Title -->
      <h1 class="text-3xl font-bold text-center text-gray-900 mb-2">Success!</h1>
      <p class="text-center text-gray-600 mb-8">Your complaint has been registered</p>

      <!-- Ticket Number -->
      <UCard class="mb-6">
        <div class="text-center">
          <p class="text-sm text-gray-600 mb-2">Ticket Number</p>
          <p class="text-2xl font-bold text-blue-600">{{ ticketNumber }}</p>
        </div>
      </UCard>

      <!-- Info Message -->
      <div class="flex items-start gap-3 mb-8 p-4 bg-blue-50 rounded-lg">
        <UIcon name="lucide:info" class="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <p class="text-sm text-blue-800">
          Our team will review your request and get back to you shortly. You can track your complaint status using the ticket number.
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="space-y-3">
        <UButton
          block
          color="primary"
          size="lg"
          @click="goHome"
        >
          Back to Home
        </UButton>
        <UButton
          block
          variant="outline"
          color="primary"
          size="lg"
          @click="submitAnother"
        >
          Submit Another
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'home'
})

const route = useRoute()
const router = useRouter()

const ticketNumber = computed(() => route.query.ticket || 'TKT888307')

const goHome = () => {
  router.push('/testing/main-menu')
}

const submitAnother = () => {
  router.push('/testing/main-menu')
}
</script>
