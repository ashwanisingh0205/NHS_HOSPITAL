<!-- status: Waiting/Done, uhid, patient_name, services, time_reg, time_in, time_out  -->
<template>
    <div class="p-1">
        <!-- AMC Tracker Table -->
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
const title = "AMC Equipments"
const { $axios } = useNuxtApp()

// Filter Form Configuration
const filterFormCode = "amc_tracker"
const filterEndPoint = "/form/defaultForm"

// Table Columns
const columns = [
    { accessorKey: 'equipment_name', header: 'Equipment Name' },
    { accessorKey: 'amc_number', header: 'AMC Number' },
    { accessorKey: 'vendor', header: 'Vendor' },
    { accessorKey: 'start_date', header: 'Start Date' },
    { accessorKey: 'end_date', header: 'End Date' },
    { accessorKey: 'renewal_date', header: 'Renewal Date' },
    { accessorKey: 'status', header: 'Status' },
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
            equipment_name: 'TEXT',
            amc_number: 'TEXT',
            vendor: 'TEXT',
            start_date: 'DATE',
            end_date: 'DATE',
            renewal_date: 'DATE',
            status: 'TEXT',
            amount: 'CURRENCY',
        }
        
        const result = await $axios.post(endpoint, { schema: dataSchema })
        data.value = result.data.data || []
        
    } catch (err) {
        error.value = err.response?.data?.message || err.message || 'Failed to load data'
        console.error('Error loading AMC tracker:', err)
    } finally {
        loading.value = false
    }
}

// Initialize
onMounted(loadForm)



</script>

