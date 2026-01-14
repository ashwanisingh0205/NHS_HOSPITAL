import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  // State
  const items = ref([])

  // Getters
  const totalItems = computed(() => {
    return items.value.reduce((sum, item) => sum + item.quantity, 0)
  })

  const totalPrice = computed(() => {
    return items.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  })

  const isEmpty = computed(() => items.value.length === 0)

  // Actions
  function addToCart(foodItem) {
    const existingItem = items.value.find(
      item => item.id === foodItem.id && item.size === foodItem.size
    )

    if (existingItem) {
      existingItem.quantity += foodItem.quantity
    } else {
      items.value.push({
        id: foodItem.id,
        name: foodItem.name,
        description: foodItem.description,
        price: foodItem.price,
        size: foodItem.size,
        image: foodItem.image,
        categoryId: foodItem.categoryId,
        categoryName: foodItem.categoryName,
        quantity: foodItem.quantity || 1
      })
    }

    // Persist to localStorage
    if (process.client) {
      localStorage.setItem('cart', JSON.stringify(items.value))
    }
  }

  function removeFromCart(itemId, size) {
    const index = items.value.findIndex(
      item => item.id === itemId && item.size === size
    )
    if (index > -1) {
      items.value.splice(index, 1)
      
      // Persist to localStorage
      if (process.client) {
        localStorage.setItem('cart', JSON.stringify(items.value))
      }
    }
  }

  function updateQuantity(itemId, size, quantity) {
    const item = items.value.find(
      item => item.id === itemId && item.size === size
    )
    if (item) {
      if (quantity <= 0) {
        removeFromCart(itemId, size)
      } else {
        item.quantity = quantity
        
        // Persist to localStorage
        if (process.client) {
          localStorage.setItem('cart', JSON.stringify(items.value))
        }
      }
    }
  }

  function clearCart() {
    items.value = []
    if (process.client) {
      localStorage.removeItem('cart')
    }
  }

  function restoreCart() {
    if (process.client) {
      const storedCart = localStorage.getItem('cart')
      if (storedCart) {
        try {
          items.value = JSON.parse(storedCart)
        } catch (error) {
          console.error('Error restoring cart:', error)
          items.value = []
        }
      }
    }
  }

  return {
    // State
    items,
    // Getters
    totalItems,
    totalPrice,
    isEmpty,
    // Actions
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    restoreCart
  }
})
