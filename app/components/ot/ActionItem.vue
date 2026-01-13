<template>
  <UCard 
    class="cursor-pointer transition-all hover:shadow-md bg-white"
    :class="{ 'ring-2 ring-blue-500': isHighlighted }"
    @click="handleClick"
  >
    <div class="flex items-center gap-3">
      <div 
        class="p-2.5 rounded-full shrink-0"
        :class="iconBgClass"
      >
        <UIcon :name="data.icon" class="w-5 h-5 text-white" />
      </div>
      <div class="flex-1 min-w-0">
        <h3 class="font-semibold text-gray-900 dark:text-gray-100 text-sm">
          {{ data.title }}
        </h3>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
          {{ data.description }}
        </p>
      </div>
      <UIcon
        v-if="data.locked"
        name="lucide:lock"
        class="w-4 h-4 text-gray-400 shrink-0"
      />
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

const emit = defineEmits(['click'])

const handleClick = () => {
  if (!props.data.locked) {
    emit('click', props.data)
  }
}

const iconBgClass = computed(() => {
  const colors = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    orange: 'bg-orange-600',
    purple: 'bg-purple-600',
    red: 'bg-red-600',
    teal: 'bg-teal-600',
    cyan: 'bg-cyan-600'
  }
  return colors[props.data.iconColor] || 'bg-gray-600'
})

const iconColorClass = computed(() => {
  const colors = {
    blue: 'text-blue-600 dark:text-blue-400',
    green: 'text-green-600 dark:text-green-400',
    orange: 'text-orange-600 dark:text-orange-400',
    purple: 'text-purple-600 dark:text-purple-400',
    red: 'text-red-600 dark:text-red-400',
    teal: 'text-teal-600 dark:text-teal-400',
    cyan: 'text-cyan-600 dark:text-cyan-400'
  }
  return colors[props.data.iconColor] || 'text-gray-600 dark:text-gray-400'
})
</script>
