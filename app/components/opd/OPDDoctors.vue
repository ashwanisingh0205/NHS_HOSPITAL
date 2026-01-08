<template>
    <CKCardList title="Doctors" class="w-1/3">
        <UTable
            :data="doctors"
            :columns="columns"
            :loading="loading"
            class="text-sm"
        >
            <template #loading>
                <CKLoader />
            </template>
            <template #doctor_name-cell="{ row }">
                <div
                    @click="handleSelect(row.original)"
                    class="cursor-pointer font-medium text-gray-900 dark:text-gray-100 hover:text-primary transition-colors"
                    :class="selectedId === row.original.employee_id ? 'text-primary font-semibold' : ''"
                >
                    {{ row.original.doctor_name }}
                </div>
            </template>
        </UTable>
    </CKCardList>
</template>

<script setup>
import CKCardList from "~/components/common/CKCardList.vue"
import CKLoader from "~/components/common/CKLoader.vue"

const props = defineProps({
    doctors: { type: Array, default: () => [] },
    selectedId: { type: [Number, String], default: null },
    loading: { type: Boolean, default: false }
})

const emit = defineEmits(['select'])

const columns = [
    { accessorKey: 'doctor_name', header: 'Doctor Name' },
    
]

const handleSelect = (doctor) => {
    emit('select', doctor)
}
</script>

