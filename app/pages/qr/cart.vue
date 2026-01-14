<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Header -->
    <AppHeader title="Shopping Cart" show-back @back="goBack" />

    <!-- Cart Items -->
    <div v-if="!cartStore.isEmpty" class="flex-1 px-6 py-6 space-y-4">
      <div
        v-for="item in cartStore.items"
        :key="`${item.id}-${item.size}`"
        class="bg-white rounded-lg p-4 shadow-sm"
      >
        <div class="flex gap-4">
          <!-- Item Image -->
          <div class="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-gray-200">
            <img
              v-if="item.image"
              :src="item.image"
              :alt="item.name"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <UIcon name="lucide:utensils" class="w-6 h-6 text-gray-400" />
            </div>
          </div>

          <!-- Item Details -->
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold text-gray-900 mb-1">{{ item.name }}</h3>
            <p class="text-xs text-gray-500 mb-1">{{ item.categoryName }}</p>
            <p class="text-xs text-gray-600 mb-2">{{ item.size }}</p>
            <p class="text-lg font-semibold text-teal-600">₹{{ item.price }}</p>

            <!-- Quantity Controls -->
            <div class="flex items-center gap-3 mt-3">
              <UButton
                icon="lucide:minus"
                size="xs"
                color="gray"
                variant="outline"
                @click="decreaseQuantity(item)"
              />
              <span class="text-gray-900 font-medium w-8 text-center">{{ item.quantity }}</span>
              <UButton
                icon="lucide:plus"
                size="xs"
                color="teal"
                variant="outline"
                @click="increaseQuantity(item)"
              />
              <UButton
                icon="lucide:trash-2"
                size="xs"
                color="red"
                variant="ghost"
                @click="removeItem(item)"
                class="ml-auto"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="bg-white rounded-lg p-4 shadow-sm sticky bottom-0">
        <div class="space-y-2 mb-4">
          <div class="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>₹{{ cartStore.totalPrice.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between text-gray-600">
            <span>Tax (5%)</span>
            <span>₹{{ taxAmount.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between text-gray-600">
            <span>Delivery Charges</span>
            <span>₹{{ deliveryCharges.toFixed(2) }}</span>
          </div>
          <div class="border-t border-gray-200 pt-2 flex justify-between text-lg font-semibold text-gray-900">
            <span>Total</span>
            <span>₹{{ totalAmount.toFixed(2) }}</span>
          </div>
        </div>

        <!-- Checkout Button -->
        <UButton
          block
          color="primary"
          size="lg"
          icon="lucide:shopping-bag"
          @click="checkout"
        >
          Proceed to Checkout
        </UButton>
      </div>
    </div>

    <!-- Empty Cart State -->
    <div v-else class="flex-1 flex items-center justify-center px-6">
      <div class="text-center">
        <UIcon name="lucide:shopping-cart" class="w-24 h-24 text-gray-300 mx-auto mb-4" />
        <h2 class="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
        <p class="text-gray-600 mb-6">Add some delicious food items to get started!</p>
        <UButton
          color="primary"
          size="lg"
          icon="lucide:arrow-left"
          @click="goToMenu"
        >
          Browse Menu
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import AppHeader from '~/components/testing/AppHeader.vue'
import { useCartStore } from '~/stores/cart'

definePageMeta({
  layout: 'home'
})

const router = useRouter()
const cartStore = useCartStore()

// Restore cart on mount
onMounted(() => {
  cartStore.restoreCart()
})

const taxRate = 0.05 // 5% tax
const deliveryCharges = ref(50) // Fixed delivery charges

const taxAmount = computed(() => {
  return cartStore.totalPrice * taxRate
})

const totalAmount = computed(() => {
  return cartStore.totalPrice + taxAmount.value + deliveryCharges.value
})

const increaseQuantity = (item) => {
  cartStore.updateQuantity(item.id, item.size, item.quantity + 1)
}

const decreaseQuantity = (item) => {
  cartStore.updateQuantity(item.id, item.size, item.quantity - 1)
}

const removeItem = (item) => {
  cartStore.removeFromCart(item.id, item.size)
}

const goBack = () => {
  router.push('/qr/food-menu')
}

const goToMenu = () => {
  router.push('/qr/food-menu')
}

const checkout = () => {
  // Navigate to checkout page or show checkout modal
  // For now, we'll just show an alert
  alert(`Order placed successfully! Total: ₹${totalAmount.value.toFixed(2)}`)
  cartStore.clearCart()
  router.push('/qr/home')
}
</script>
