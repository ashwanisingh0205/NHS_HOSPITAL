<template>
    <UModal v-model:open="localValue">
        <template #header>
            <div class="flex items-center justify-between w-full">
                <h3 class="text-lg font-semibold">New Employee</h3>
                <UButton 
                    variant="ghost" 
                    icon="lucide:x"
                    size="sm"
                    @click="localValue = false"
                />
            </div>
        </template>

        <template #body>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3 p-0">
                <!-- New CV Card -->
                <UCard 
                    variant="outline"
                    :ui="cardUi"
                    class="cursor-pointer hover:ring-green-500 hover:ring-1 transition-all"
                    @click.stop="handleNewCV"
                >
                    <div class="flex flex-col items-center text-center p-4">
                        <div class="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-3">
                            <UIcon name="lucide:file-text" class="w-6 h-6 text-red-600 dark:text-red-400" />
                        </div>
                        <h4 class="text-sm font-semibold text-gray-900 dark:text-white">New CV</h4>
                    </div>
                </UCard>

                <!-- New Provisional Card -->
                <UCard 
                    variant="outline"
                    :ui="cardUi"
                    class="cursor-pointer hover:ring-green-500 hover:ring-1 transition-all"
                    @click.stop="handleNewProvisional"
                >
                    <div class="flex flex-col items-center text-center p-4">
                        <div class="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-3">
                            <UIcon name="lucide:user" class="w-6 h-6 text-red-600 dark:text-red-400" />
                        </div>
                        <h4 class="text-sm font-semibold text-gray-900 dark:text-white">New Provisional</h4>
                    </div>
                </UCard>

                <!-- New Employee Card -->
                <UCard 
                    variant="outline"
                    :ui="cardUi"
                    class="cursor-pointer hover:ring-green-500 hover:ring-1 transition-all"
                    @click.stop="handleNewEmployee"
                >
                    <div class="flex flex-col items-center text-center p-4">
                        <div class="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-3">
                            <UIcon name="lucide:user-plus" class="w-6 h-6 text-red-600 dark:text-red-400" />
                        </div>
                        <h4 class="text-sm font-semibold text-gray-900 dark:text-white">New Employee</h4>
                    </div>
                </UCard>
            </div>
        </template>
    </UModal>
</template>

<script setup>
const props = defineProps({
    modelValue: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'newCV', 'newProvisional', 'newEmployee'])

/* --------------- Model Value: emit and bind with 'localValue' --------------- */
const localValue = ref(props.modelValue)
watch(localValue, (val) => {
    emit('update:modelValue', val)
})
watch(() => props.modelValue, (val) => {
    localValue.value = val
})

const router = useRouter()

const navigateToPage = (type) => {
    // Emit the event first
    if (type === 'newCV') emit('newCV')
    else if (type === 'newProvisional') emit('newProvisional')
    else if (type === 'newEmployee') emit('newEmployee')
    
    // Close modal immediately
    localValue.value = false
    emit('update:modelValue', false)
    
    // Navigate after modal closes
    const route = `/hrm/profile/employees/new?type=${type}`
    nextTick(() => {
        router.push(route).catch(() => {
            // Fallback if router fails
            globalThis.location.href = route
        })
    })
}

const handleNewCV = () => {
    navigateToPage('newCV')
}

const handleNewProvisional = () => {
    navigateToPage('newProvisional')
}

const handleNewEmployee = () => {
    navigateToPage('newEmployee')
}

const cardUi = computed(() => ({
    body: { padding: 'p-0' }
}))
</script>

