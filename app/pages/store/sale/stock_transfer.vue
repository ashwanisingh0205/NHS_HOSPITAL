<!-- status: Waiting/Done, uhid, patient_name, services, time_reg, time_in, time_out  -->
<template>
    <div class="p-1">
        <!-- Daily Sale Table -->
        <CKCardList 
            :title="title" 
            :show-filter="true" 
            :show-add="false"
            :filterFormCode="filterFormCode"
            :filterEndPoint="filterEndPoint">
            <UTable :loading="loading" :data="data" :columns="columns">
                <template #loading>
                    <CKLoader />
                </template>
                <template #empty>
                    <UError :error="{ statusMessage: error || 'No Record Found!!' }" />
                </template>
                <template #action-cell="{ row }">
                    <CKEdit  />
                </template>
            </UTable>
        </CKCardList>
    </div>
</template>

<script setup>
import CKCardList from "~/components/common/CKCardList.vue"
import CKLoader from "~/components/common/CKLoader.vue"
import CKEdit from "~/components/common/CKEdit.vue";

definePageMeta({
    layout: 'home'
})

// State
const loading = ref(false)
const error = ref(null)
const title = "Stock Transfer"
const { $axios } = useNuxtApp()

// Filter Form Configuration
const filterFormCode = "transfer_stock"
const filterEndPoint = "/form/defaultForm"

// Table Columns
const columns = [
    { accessorKey: 'slip_no', header: 'Slip No.' },
    { accessorKey: 'bill_no', header: 'Bill No' },
    { accessorKey: 'date', header: 'Date' },
    { accessorKey: 'patient', header: 'Patient' },
    { accessorKey: 'ipd_opd', header: 'IPD/OPD' },
    { accessorKey: 'user', header: 'User' },
    { accessorKey: 'amount', header: 'Amount' },
    { id: 'action'}
]

// Data
const data = ref([])

// Load data
const loadForm = async () => {
    loading.value = true
    
    try {
        const endpoint = '/form/dummy'
         
        const dataSchema = {
            slip_no: 'TEXT',
            bill_no: 'TEXT',
            date: 'DATE',
            patient: 'TEXT',
            ipd_opd: 'TEXT',
            user: 'TEXT',
            amount: 'CURRENCY',
        }
        
        const result = await $axios.post(endpoint, { schema: dataSchema })
        data.value = result.data.data || []
        
    } catch (err) {
        error.value = err.response?.data?.message || err.message || 'Failed to load data'
        console.error('Error loading daily sale:', err)
    } finally {
        loading.value = false
    }
}

// Initialize
onMounted(loadForm)



</script>

