<template>
    <CKCardList title="Appointments" class="w-1/3">
        <UTable :data="appointments" :columns="columns" :loading="loading">
            <template #loading>
                <CKLoader />
            </template>
        </UTable>
    </CKCardList>
</template>

<script setup>
import CKCardList from "~/components/common/CKCardList.vue"
import CKLoader from "~/components/common/CKLoader.vue"

const props = defineProps({
    appointments: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false }
})

const columns = [
    { accessorKey: 'patient_name', header: 'Patient Name' },
    { accessorKey: 'uhid', header: 'UHID' },
    { accessorKey: 'appointment_date', header: 'Date' },
    { accessorKey: 'appointment_time', header: 'Time' },
    { accessorKey: 'status', header: 'Status' }
]
</script>

