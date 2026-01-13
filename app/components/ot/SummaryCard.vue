<template>
  <UCard 
    class="cursor-pointer"
    :class="{ 'ring-2 ring-blue-500': isHighlighted }"
    @click="toggleExpanded"
  >
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3 flex-1">
        <div 
          class="p-2.5 rounded-lg shrink-0"
          :class="iconBgClass"
        >
          <UIcon :name="data.icon" class="w-5 h-5" :class="iconColorClass" />
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="font-semibold text-gray-900 dark:text-gray-100 text-sm">
            {{ data.title }}
          </h3>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {{ data.subtitle }}
          </p>
        </div>
      </div>
      <UIcon 
        name="lucide:chevron-down" 
        class="w-5 h-5 text-gray-400 transition-transform shrink-0"
        :class="{ 'rotate-180': isExpanded }"
      />
    </div>

    <!-- Expanded Content -->
    <div 
      v-if="isExpanded && data.items"
      class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2"
    >
      <div
        v-for="(item, index) in data.items"
        :key="index"
        class="flex items-center gap-3 pl-2 border-l-2 border-gray-200 dark:border-gray-700 py-2"
      >
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
            {{ item.name }}
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {{ item.time }} • {{ item.department }}
          </p>
        </div>
        <UBadge
          :label="item.status"
          :color="getStatusColor(item.status)"
          variant="soft"
          size="sm"
        />
      </div>
    </div>
  </UCard>
</template>

<script setup>
const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  isHighlighted: {
    type: Boolean,
    default: false
  }
})

const isExpanded = ref(false)

const toggleExpanded = () => {
  if (props.data.items && props.data.items.length > 0) {
    isExpanded.value = !isExpanded.value
  }
}

const iconBgClass = computed(() => {
  const colors = {
    blue: 'bg-blue-100 dark:bg-blue-900/30',
    purple: 'bg-purple-100 dark:bg-purple-900/30',
    green: 'bg-green-100 dark:bg-green-900/30',
    red: 'bg-red-100 dark:bg-red-900/30',
    orange: 'bg-orange-100 dark:bg-orange-900/30'
  }
  return colors[props.data.iconColor] || colors.blue
})

const iconColorClass = computed(() => {
  const colors = {
    blue: 'text-blue-600 dark:text-blue-400',
    purple: 'text-purple-600 dark:text-purple-400',
    green: 'text-green-600 dark:text-green-400',
    red: 'text-red-600 dark:text-red-400',
    orange: 'text-orange-600 dark:text-orange-400'
  }
  return colors[props.data.iconColor] || colors.blue
})

const getStatusColor = (status) => {
  const statusMap = {
    'Done': 'green',
    'Pending': 'orange',
    'Scheduled': 'blue',
    'Approved': 'green',
    'Rejected': 'red'
  }
  return statusMap[status] || 'gray'
}
</script>
