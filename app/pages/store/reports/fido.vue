<!-- status: Waiting/Done, uhid, patient_name, services, time_reg, time_in, time_out  -->
<template>
    <div class="p-1">
        <!-- FIDO Table -->
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
const title = "FIDO"
const { $axios } = useNuxtApp()

// Filter Form Configuration
const filterFormCode = "file_manager"
const filterEndPoint = "/form/defaultForm"

// Table Columns
const columns = [
    { accessorKey: 'uhid', header: 'UHID' },
    { accessorKey: 'ipd_no', header: 'IPD NO.' },
    { accessorKey: 'd_no', header: 'D NO.' },
    { accessorKey: 'patient_name', header: 'Patient Name' },
    { accessorKey: 'consultant_name', header: 'Consultant Name' },
    { accessorKey: 'date_admission', header: 'Date Admission' },
    { accessorKey: 'date_discharge', header: 'Dates Discharge' },
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
            uhid: 'TEXT',
            ipd_no: 'TEXT',
            d_no: 'TEXT',
            patient_name: 'TEXT',
            consultant_name: 'TEXT',
            date_admission: 'DATE',
            date_discharge: 'DATE',
        }
        
        const result = await $axios.post(endpoint, { schema: dataSchema })
        data.value = result.data.data || []
        
    } catch (err) {
        error.value = err.response?.data?.message || err.message || 'Failed to load data'
        console.error('Error loading FIDO:', err)
    } finally {
        loading.value = false
    }
}

// Initialize
onMounted(loadForm)



</script>

