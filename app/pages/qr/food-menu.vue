<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <AppHeader 
      title="Food Menu" 
      show-back 
      show-cart
      :cart-count="cartItemCount"
      @back="goBack"
      @cart="goToCart"
    />

    <!-- Main Content -->
    <div class="px-6 py-6">
      <!-- Search Bar -->
      <div class="mb-6">
        <UInput
          v-model="searchQuery"
          icon="lucide:search"
          placeholder="Search for food items..."
          size="lg"
          class="w-full"
        />
      </div>

      <!-- Categories -->
      <div class="mb-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Categories</h2>
        <div class="flex gap-3 overflow-x-auto pb-2">
          <UButton
            v-for="category in foodCategories"
            :key="category.id"
            :variant="selectedCategory === category.id ? 'solid' : 'outline'"
            :color="selectedCategory === category.id ? 'teal' : 'gray'"
            size="lg"
            @click="selectedCategory = category.id"
            class="shrink-0"
          >
            {{ category.name }}
          </UButton>
        </div>
      </div>

      <!-- Food Items -->
      <div class="space-y-4">
        <div
          v-for="item in filteredItems"
          :key="item.id"
          class="bg-white rounded-lg overflow-hidden shadow-sm relative"
        >
          <div class="flex gap-4 p-4 relative z-0">
            <!-- Food Image -->
            <div class="w-24 h-24 rounded-lg overflow-hidden shrink-0 bg-gray-200">
              <img
                v-if="item.image"
                :src="item.image"
                :alt="item.name"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full flex items-center justify-center">
                <UIcon name="lucide:utensils" class="w-8 h-8 text-gray-400" />
              </div>
            </div>

            <!-- Food Details -->
            <div class="flex-1 min-w-0 relative z-10">
              <h3 class="font-semibold text-gray-900 mb-1">{{ item.name }}</h3>
              <p class="text-sm text-gray-600 mb-2 line-clamp-2">{{ item.description }}</p>
              
              <!-- Size Options -->
              <div class="mb-3">
                <p class="text-xs text-gray-500 mb-1">Size:</p>
                <div class="flex gap-2 flex-wrap">
                  <UButton
                    v-for="size in item.sizes"
                    :key="size.name"
                    :variant="selectedSizes[item.id] === size.name ? 'solid' : 'outline'"
                    :color="selectedSizes[item.id] === size.name ? 'primary' : 'info'"
                    size="xs"
                    @click.stop="selectSize(item.id, size.name, size.price)"
                  >
                    {{ size.name }} - ₹{{ size.price }}
                  </UButton>
                </div>
              </div>

              <!-- Add to Cart Button -->
              <div class="mt-2">
                <UButton
                  color="primary"
                  size="sm"
                  icon="lucide:plus"
                  @click="handleAddToCart(item)"
                  class="w-full"
                  style="pointer-events: auto; position: relative; z-index: 10;"
                >
                  {{ selectedSizes[item.id] ? 'Add to Cart' : 'Select Size First' }}
                </UButton>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredItems.length === 0" class="text-center py-12">
          <UIcon name="lucide:utensils-crossed" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p class="text-gray-600">No food items found</p>
        </div>
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
const searchQuery = ref('')
const selectedCategory = ref(null)
const selectedSizes = ref({})
const itemPrices = ref({})

// Reactive cart count
const cartItemCount = computed(() => cartStore.totalItems)

// Food Categories
const foodCategories = ref([
  { id: 1, name: 'North Indian' },
  { id: 2, name: 'South Indian' },
  { id: 3, name: 'Chinese' },
  { id: 4, name: 'Continental' },
  { id: 5, name: 'Beverages' },
  { id: 6, name: 'Desserts' }
])

// Food Items with categories
const foodItems = ref([
  {
    id: 1,
    name: 'Butter Chicken',
    description: 'Creamy tomato-based curry with tender chicken pieces, served with basmati rice',
    categoryId: 1,
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop',
    sizes: [
      { name: 'Small', price: 180 },
      { name: 'Half', price: 250 },
      { name: 'Medium', price: 320 },
      { name: 'Large', price: 450 }
    ]
  },
  {
    id: 2,
    name: 'Dal Makhani',
    description: 'Creamy black lentils cooked overnight with butter and cream',
    categoryId: 1,
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop',
    sizes: [
      { name: 'Small', price: 120 },
      { name: 'Half', price: 180 },
      { name: 'Medium', price: 240 },
      { name: 'Large', price: 320 }
    ]
  },
  {
    id: 3,
    name: 'Paneer Tikka',
    description: 'Marinated cottage cheese cubes grilled to perfection',
    categoryId: 1,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop',
    sizes: [
      { name: 'Small', price: 150 },
      { name: 'Half', price: 220 },
      { name: 'Medium', price: 300 },
      { name: 'Large', price: 400 }
    ]
  },
  {
    id: 4,
    name: 'Masala Dosa',
    description: 'Crispy rice crepe filled with spiced potatoes, served with sambar and chutney',
    categoryId: 2,
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=300&fit=crop',
    sizes: [
      { name: 'Small', price: 80 },
      { name: 'Half', price: 120 },
      { name: 'Medium', price: 150 },
      { name: 'Large', price: 200 }
    ]
  },
  {
    id: 5,
    name: 'Idli Sambar',
    description: 'Steamed rice cakes served with lentil curry and coconut chutney',
    categoryId: 2,
    image: 'https://images.unsplash.com/photo-1610194352361-4c81a6a8967e?w=400&h=300&fit=crop',
    sizes: [
      { name: 'Small', price: 60 },
      { name: 'Half', price: 90 },
      { name: 'Medium', price: 120 },
      { name: 'Large', price: 160 }
    ]
  },
  {
    id: 6,
    name: 'Veg Fried Rice',
    description: 'Fragrant basmati rice stir-fried with mixed vegetables and aromatic spices',
    categoryId: 3,
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop',
    sizes: [
      { name: 'Small', price: 140 },
      { name: 'Half', price: 200 },
      { name: 'Medium', price: 280 },
      { name: 'Large', price: 380 }
    ]
  },
  {
    id: 7,
    name: 'Chicken Manchurian',
    description: 'Crispy chicken balls in tangy Manchurian sauce',
    categoryId: 3,
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop',
    sizes: [
      { name: 'Small', price: 200 },
      { name: 'Half', price: 280 },
      { name: 'Medium', price: 360 },
      { name: 'Large', price: 480 }
    ]
  },
  {
    id: 8,
    name: 'Grilled Chicken',
    description: 'Tender chicken breast marinated in herbs and spices, grilled to perfection',
    categoryId: 4,
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop',
    sizes: [
      { name: 'Small', price: 250 },
      { name: 'Half', price: 350 },
      { name: 'Medium', price: 450 },
      { name: 'Large', price: 600 }
    ]
  },
  {
    id: 9,
    name: 'Fresh Lime Soda',
    description: 'Refreshing lime juice with soda and mint',
    categoryId: 5,
    image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400&h=300&fit=crop',
    sizes: [
      { name: 'Small', price: 50 },
      { name: 'Half', price: 70 },
      { name: 'Medium', price: 90 },
      { name: 'Large', price: 120 }
    ]
  },
  {
    id: 10,
    name: 'Gulab Jamun',
    description: 'Soft milk dumplings soaked in sugar syrup',
    categoryId: 6,
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop',
    sizes: [
      { name: 'Small', price: 80 },
      { name: 'Half', price: 120 },
      { name: 'Medium', price: 160 },
      { name: 'Large', price: 220 }
    ]
  }
])

// Set default category and restore cart
onMounted(() => {
  if (foodCategories.value.length > 0) {
    selectedCategory.value = foodCategories.value[0].id
  }
  // Restore cart from localStorage
  cartStore.restoreCart()
})

// Filter items by category and search
const filteredItems = computed(() => {
  let items = foodItems.value

  // Filter by category
  if (selectedCategory.value) {
    items = items.filter(item => item.categoryId === selectedCategory.value)
  }

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    items = items.filter(item =>
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query)
    )
  }

  return items
})

// Get category name
const getCategoryName = (categoryId) => {
  const category = foodCategories.value.find(cat => cat.id === categoryId)
  return category?.name || 'Unknown'
}

// Select size for an item
const selectSize = (itemId, sizeName, price) => {
  // Use Vue's reactivity properly
  selectedSizes.value = {
    ...selectedSizes.value,
    [itemId]: sizeName
  }
  itemPrices.value = {
    ...itemPrices.value,
    [itemId]: price
  }
}

// Handle add to cart with proper event handling
const handleAddToCart = (item, event) => {
  if (event) {
    event.preventDefault()
    event.stopPropagation()
  }
  
  addToCart(item)
}

// Add item to cart
const addToCart = (item) => {
  console.log('Add to cart clicked for:', item.name)
  console.log('Selected sizes:', selectedSizes.value)
  console.log('Item prices:', itemPrices.value)
  
  const selectedSize = selectedSizes.value[item.id]
  const price = itemPrices.value[item.id]

  if (!selectedSize || !price) {
    alert('Please select a size before adding to cart')
    return
  }

  const cartItem = {
    id: item.id,
    name: item.name,
    description: item.description,
    price: price,
    size: selectedSize,
    image: item.image,
    categoryId: item.categoryId,
    categoryName: getCategoryName(item.categoryId),
    quantity: 1
  }

  console.log('Adding to cart:', cartItem)
  cartStore.addToCart(cartItem)
  
  // Force reactivity update
  nextTick(() => {
    console.log('Cart items after add:', cartStore.items)
    console.log('Total items after add:', cartStore.totalItems)
  })
}

const goBack = () => {
  router.push('/qr/home')
}

const goToCart = () => {
  router.push('/qr/cart')
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
