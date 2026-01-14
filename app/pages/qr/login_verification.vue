<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    

    <!-- Main Content -->
    <div class="flex-1 flex items-center justify-center mb-24 px-6 py-12">
      <div class="w-full max-w-md">
        <!-- Icon -->
        <div class="flex justify-center mb-6">
          <div class="w-24 h-24 rounded-full bg-teal-500 flex items-center justify-center">
            <UIcon name="lucide:check" class="w-12 h-12 text-white" />
          </div>
        </div>

        <!-- Title -->
        <h1 class="text-3xl font-bold text-center text-gray-900 mb-2">Verify OTP</h1>
        <p class="text-center text-gray-600 mb-2">Enter the 6-digit code sent to</p>
        <p class="text-center mb-8">
          <a href="#" class="text-blue-600 hover:underline">{{ phoneNumber }}</a>
        </p>

        <!-- OTP Input -->
        <div class="mb-6">
          <div class="flex gap-2 justify-center">
            <input
              v-for="(digit, index) in otpDigits"
              :key="index"
              v-model="otpDigits[index]"
              type="text"
              maxlength="1"
              class="w-12 h-14 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none"
              @input="handleOTPInput(index, $event)"
              @keydown="handleKeyDown(index, $event)"
            />
          </div>
        </div>

        <!-- Verify Button -->
        <UButton
          block
          color="primary"
          size="lg"
          @click="verifyOTP"
          :disabled="!isOTPComplete"
          class="mb-4"
        >
          Verify & Continue
        </UButton>

        <!-- Links -->
        <div class="flex flex-col items-center gap-3">
          <a href="#" class="text-blue-600 hover:underline text-sm" @click.prevent="resendOTP">
            Resend OTP
          </a>
          <a href="#" class="text-blue-600 hover:underline text-sm flex items-center gap-1" @click.prevent="changePhoneNumber">
            <UIcon name="lucide:arrow-left" class="w-4 h-4" />
            Change Phone Number
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import LanguageSelector from '~/components/testing/LanguageSelector.vue'

definePageMeta({
  layout: 'home'
})

const route = useRoute()
const router = useRouter()

const phoneNumber = computed(() => {
  return route.query.phone ? `+91 ${route.query.phone}` : '+91 8347686760'
})

const otpDigits = ref(['', '', '', '', '', ''])

const isOTPComplete = computed(() => {
  return otpDigits.value.every(digit => digit !== '')
})

const handleOTPInput = (index, event) => {
  const value = event.target.value.replace(/\D/g, '')
  if (value) {
    otpDigits.value[index] = value
    if (index < 5) {
      const nextInput = event.target.parentElement.children[index + 1]
      if (nextInput) nextInput.focus()
    }
  } else {
    otpDigits.value[index] = ''
  }
}

const handleKeyDown = (index, event) => {
  if (event.key === 'Backspace' && !otpDigits.value[index] && index > 0) {
    const prevInput = event.target.parentElement.children[index - 1]
    if (prevInput) prevInput.focus()
  }
}

const verifyOTP = () => {
  if (isOTPComplete.value) {
    router.push('/qr/home')
  }
}

const resendOTP = () => {
  // Reset OTP
  otpDigits.value = ['', '', '', '', '', '']
  // In real app, would call API to resend OTP
}

const changePhoneNumber = () => {
  router.push('/qr/login')
}
</script>
