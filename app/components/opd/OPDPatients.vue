<template>
    <CKCardList title="Patients" class="w-full">
        <UTable :data="patients" :columns="columns" :loading="loading">
            <template #loading>
                <CKLoader />
            </template>
            <template #id-cell="{ row }">
                {{ getPatientIndex(row.original.id) }}
            </template>
            <template #patient_name-cell="{ row }">
                {{ row.original.patient_name || '-' }}
            </template>
            <template #action-cell="{ row }">
                <UButton size="xs" variant="ghost" @click="handleView(row.original)">
                    View
                </UButton>
            </template>
        </UTable>
    </CKCardList>
</template>

<script setup>
import CKCardList from "~/components/common/CKCardList.vue"
import CKLoader from "~/components/common/CKLoader.vue"

const props = defineProps({
    patients: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false }
})

const emit = defineEmits(['view'])

const columns = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'patient_name', header: 'Patient Name' },
    { id: 'action' }
]

const getPatientIndex = (id) => {
    return props.patients.findIndex(p => p.id === id) + 1
}

const handleView = (patient) => {
    emit('view', patient)
}
</script>

