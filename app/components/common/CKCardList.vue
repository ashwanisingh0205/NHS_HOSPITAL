<template>
    <UCard class="w-full" :ui="{ body: 'sm:p-0 p-0'}">
        <template #header>
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-lg font-semibold">{{ title }}</h2>
                <div class="flex items-center gap-2">
                    <UButton
                        v-if="showFilter"
                        variant="ghost"
                        size="sm"
                        @click="toggleFilter"
                        :class="isFilterVisible ? 'text-primary' : ''"
                    >
                        <div class="flex items-center gap-1">
                            <UIcon name="lucide:filter" class="w-4 h-4" />
                            <UIcon 
                                name="lucide:chevron-down"
                                class="w-4 h-4 transition-transform"
                                :class="isFilterVisible ? 'rotate-180' : ''"
                            />
                        </div>
                    </UButton>
                    <CKAdd
                        v-if="shouldShowAdd"
                        :loading="loading"
                        :disabled="loading"
                        @click="handleAdd" />
                </div>
            </div>
            <CKSearch
                v-model="localValue" />
            
            <!-- Filter Section -->
            <div v-if="showFilter && isFilterVisible" class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                <DynamicForm 
                    :key="filterConfigKey"
                    :staticForm="filterForm"
                    :noAutoSubmit="true"
                    :showClearButton="true"
                    @submit="handleFilterSubmit"
                    @clear="handleFilterClear"
                />
            </div>
        </template>
        
        <slot />
    </UCard>

</template>

<script setup>
import CKSearch from "~/components/common/CKSearch.vue";
import CKAdd from "~/components/common/CKAdd.vue";
import DynamicForm from "~/components/emr/DynamicForm.vue";

const props = defineProps({
    modelValue: { type: String, default: "" },
    loading: { type: Boolean, default: false },
    title: { type: String, default: "Title" },
    showFilter: { type: Boolean, default: false },
    filterForm: { type: Object, default: () => ({ fields: [] }) },
    showAdd: { type: [Boolean, String], default: true } // Show add button if true or "yes"
})

const emit = defineEmits(['update:modelValue', 'handleAdd', 'filter', 'filterClear']);

const isFilterVisible = ref(false)
const filterConfigKey = ref(0)

const shouldShowAdd = computed(() => {
    return props.showAdd === true || props.showAdd === 'yes' || props.showAdd === 'Yes'
})

const toggleFilter = () => {
    isFilterVisible.value = !isFilterVisible.value
}

const handleAdd = async (submitData) => {
    emit('handleAdd')
}

const handleFilterSubmit = (event) => {
    if (event.payload) {
        emit('filter', event.payload)
    }
}

const handleFilterClear = () => {
    filterConfigKey.value++
    emit('filterClear')
}

/* --------------- Model Value: emit and bind with 'localValue' --------------- */
const localValue = ref(props.modelValue)
watch(localValue, (val) => {
    emit('update:modelValue', val)
})
watch(() => props.modelValue, (val) => {
    localValue.value = val
})
</script>

