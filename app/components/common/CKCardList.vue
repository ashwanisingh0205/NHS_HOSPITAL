<template>
    <UCard class="w-full" :ui="{ body: 'sm:p-0 p-0'}">
        <template #header>
            <div class="flex items-center justify-between">
                <h2 class="text-lg font-semibold">{{ title }}</h2>
                <div class="flex items-center gap-2">
                    <slot name="header-actions" />
                    <UButton
                        v-if="showFilter"
                        variant="ghost"
                        @click="toggleFilter"
                        :class="isFilterVisible ? 'text-primary' : ''"
                        leading-icon="lucide:filter">
                        <div class="flex items-center gap-1">
                            Filter
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
                v-if="showSearch"
                class="mt-4"
                v-model="localValue" />
        </template>
        
        <!-- Filter Section -->
        <div v-if="showFilter && isFilterVisible" class="pt-4 pb-2 border-b bg-gray-50 dark:bg-gray-900 border-gray-200  dark:border-gray-800">
            <DynamicForm
                :key="filterConfigKey"
                :formCode="filterFormCode"
                :endPoint="filterEndPoint"
                @submit="handleFilterSubmit"
                @clear="handleFilterClear"
                class="mx-4"
            />
        </div>
        
        <slot />
        
        <!-- Pagination -->
        <div v-if="pagination && pagination.total_pages > 1" class="flex items-center justify-center px-4 py-3 border-t border-gray-200 dark:border-gray-800">
            
            <UPagination
                v-model:page="localCurrentPage"
                :items-per-page="pagination.limit"
                :total="pagination.total_entries"
            />
        </div>
    </UCard>

</template>

<script setup>
import CKSearch from "~/components/common/CKSearch.vue";
import CKAdd from "~/components/common/CKAdd.vue";
import DynamicForm from "~/components/emr/DynamicForm.vue";

const props = defineProps({
    modelValue: { type: String, default: null },
    loading: { type: Boolean, default: false },
    title: { type: String, default: "Title" },
    showSearch: { type: Boolean, default: false },
    showFilter: { type: Boolean, default: false },
    filterForm: { type: Object, default: () => ({ fields: [] }) },
    filterFormCode: { type: String, default: "" },
    filterEndPoint: { type: String, default: "" },
    showAdd: { type: [Boolean, String], default: true },
    pagination: { type: Object, default: null }
})

const emit = defineEmits(['update:modelValue', 'handleAdd', 'filter', 'filterClear', 'page-change']);

const isFilterVisible = ref(false)
const filterConfigKey = ref(0)

const shouldShowAdd = computed(() => {
    return props.showAdd === true || props.showAdd === 'yes' || props.showAdd === 'Yes'
})

const localCurrentPage = ref(props.pagination?.current_page || 1)
const isUpdatingFromApi = ref(false)

watch(() => props.pagination?.current_page, (newPage) => {
    if (newPage && newPage !== localCurrentPage.value) {
        isUpdatingFromApi.value = true
        localCurrentPage.value = newPage
        nextTick(() => {
            isUpdatingFromApi.value = false
        })
    }
})

watch(localCurrentPage, (newPage) => {
    if (!isUpdatingFromApi.value && newPage && typeof newPage === 'number' && props.pagination) {
        emit('page-change', newPage)
    }
})



const toggleFilter = () => {
    isFilterVisible.value = !isFilterVisible.value
}

const handleAdd = async (submitData) => {
    emit('handleAdd')
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

