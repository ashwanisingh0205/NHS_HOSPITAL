<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Main Content -->
    <div class="flex-1 flex items-center justify-center mb-22 px-6 py-16">
      <UCard class="w-full max-w-md">
        <template #header>
          <div class="flex flex-col items-center">
            <!-- Icon -->
            <div class="w-24 h-24 rounded-full bg-teal-500 flex items-center justify-center mb-6">
              <UIcon name="lucide:home" class="w-12 h-12 text-white" />
            </div>

            <!-- Title -->
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Welcome</h1>
            <p class="text-center text-gray-600">MARC Hospital Complaint Window</p>
          </div>
        </template>

        <div class="space-y-6">
          <!-- Phone Input -->
          <div>
            <UFormField
              label="Phone Number"
            
            >
            <UInput
              v-model="phoneNumber"
              type="tel"
              placeholder="Enter your 10-digit number"
              icon="lucide:phone"
              size="lg"
              class="w-full"
              :maxlength="10"
              
              @input="validatePhone"
            />
            <p v-if="phoneError" class="mt-1 text-sm text-red-600">{{ phoneError }}</p>
            </UFormField>
          </div>

          <!-- Submit Button -->
          <UButton
            block
            color="primary"
            size="lg"
            :disabled="!isValidPhone"
            :loading="isLoading"
            icon="lucide:send"
            @click="sendOTP"
          >
            Send OTP
          </UButton>

          <!-- Terms -->
          <div class="text-center pt-4 border-t border-gray-200">
            <p class="text-xs text-gray-500">
              By continuing, you agree to our
              <UButton
                variant="link"
                color="teal"
                size="xs"
                class="p-0 h-auto"
              >
                Terms of Service
              </UButton>
            </p>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'home'
})

const phoneNumber = ref('')
const phoneError = ref('')
const isLoading = ref(false)
const router = useRouter()

const isValidPhone = computed(() => {
  return phoneNumber.value.length === 10 && /^\d+$/.test(phoneNumber.value)
})

const validatePhone = () => {
  phoneError.value = ''
  
  if (phoneNumber.value.length > 0 && !/^\d+$/.test(phoneNumber.value)) {
    phoneError.value = 'Phone number must contain only digits'
  } else if (phoneNumber.value.length === 10 && !/^[6-9]\d{9}$/.test(phoneNumber.value)) {
    phoneError.value = 'Please enter a valid 10-digit mobile number'
  }
}

const sendOTP = async () => {
  if (!isValidPhone.value) {
    phoneError.value = 'Please enter a valid 10-digit phone number'
    return
  }

  isLoading.value = true
  phoneError.value = ''
  
  await new Promise(resolve => setTimeout(resolve, 500))
  
  isLoading.value = false
  router.push(`/testing/verify-otp?phone=${phoneNumber.value}`)
}
</script>
