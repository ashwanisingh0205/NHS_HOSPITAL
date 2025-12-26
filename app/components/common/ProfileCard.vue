<template>
    <UCard class="min-w-[200px]">
        <div class="flex flex-col items-center text-center">
            <!-- Avatar -->
            <div 
                class="w-16 h-16 rounded-full mb-3 flex items-center justify-center text-white font-semibold text-lg"
                :class="avatarBgClass"
            >
                <img 
                    v-if="employee.profileImage" 
                    :src="employee.profileImage" 
                    :alt="employeeName"
                    class="w-full h-full rounded-full object-cover"
                />
                <span v-else>{{ initials }}</span>
            </div>
            
            <!-- Name -->
            <h3 class="font-semibold text-gray-900 dark:text-white mb-1">{{ employeeName }}</h3>
            
            <!-- Department -->
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">{{ employee.department_name || 'N/A' }}</p>
            
            <!-- Birthday -->
            <div class="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-500">
                <UIcon name="lucide:cake" class="w-4 h-4" />
                <span>{{ formattedDate }}</span>
            </div>
        </div>
    </UCard>
</template>

<script setup>
const props = defineProps({
    employee: { type: Object, required: true }
})

const employeeName = computed(() => {
    const parts = [props.employee.title, props.employee.first_name, props.employee.middle_name, props.employee.last_name]
    return parts.filter(Boolean).join(' ') || 'Unknown'
})

const initials = computed(() => {
    const first = props.employee.first_name?.[0] || ''
    const last = props.employee.last_name?.[0] || ''
    return (first + last).toUpperCase() || '??'
})

const formattedDate = computed(() => {
    if (!props.employee.date_of_birth) return 'N/A'
    const date = new Date(props.employee.date_of_birth)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
})

const avatarBgClass = computed(() => {
    const colors = ['bg-blue-500', 'bg-pink-500', 'bg-purple-500', 'bg-yellow-500', 'bg-green-500', 'bg-orange-500']
    const index = (props.employee.id || 0) % colors.length
    return colors[index]
})
</script>

