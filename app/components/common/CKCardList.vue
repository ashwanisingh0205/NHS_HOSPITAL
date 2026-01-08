<template>
    <UCard class="w-full" :ui="{ body: 'sm:p-0 p-0'}">
        <template #header>
            <div class="flex items-center justify-between">
                <h2 class="text-lg font-semibold">{{ title }}</h2>
                <div class="flex items-center gap-2">
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
                class="mt-4"
                v-model="localValue" />
        </template>
        
        <!-- Filter Section -->
        <div v-if="showFilter && isFilterVisible" class="pt-4 pb-2 bg-gray-50 border-b border-gray-200 dark:border-gray-800">
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
    showFilter: { type: Boolean, default: false },
    filterForm: { type: Object, default: () => ({ fields: [] }) },
    filterFormCode: { type: String, default: "" },
    filterEndPoint: { type: String, default: "" },
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



/* --------------- Model Value: emit and bind with 'localValue' --------------- */
const localValue = ref(props.modelValue)
watch(localValue, (val) => {
    emit('update:modelValue', val)
})
watch(() => props.modelValue, (val) => {
    localValue.value = val
})
</script>

