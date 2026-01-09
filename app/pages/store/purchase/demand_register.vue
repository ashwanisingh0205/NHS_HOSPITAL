<template>
    <div class="p-1">
        <!-- IPD Register Table -->
        <CKCardList 
            :title="title" 
            :show-filter="false"
            :show-add="false"
            @handleAdd="handleAdd">
            <UTable 
                :loading="loading" 
                :data="ipdData" 
                :columns="columns"
            >
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
import CKEdit from "~/components/common/CKEdit.vue"

definePageMeta({
    layout: 'home'
})

// State
const loading = ref(true)
const error = ref(null)
const title = "IPD Register"

// Data
const ipdData = ref([])
const { $axios } = useNuxtApp()

const loadForm = async () => {
    loading.value = true
    
    try {
        const endpoint = '/form/dummy'
        
        const dataSchema = {
            ipd_no: 'TEXT',
            d_no: 'TEXT',
            patient_name: 'TEXT',
            tpa: 'TEXT',
            consultant_name: 'TEXT',
            date_admit: 'DATE',
            amount: 'CURRENCY',
        }
        
        const result = await $axios.post(endpoint, { schema: dataSchema })
        console.log('result', result)
        ipdData.value = result.data?.result?.data || []
        
    } catch (err) {
        error.value = err.response?.data?.message || err.message || 'Failed to load data'
        console.error('Error loading IPD register:', err)
    } finally {
        loading.value = false
    }
}

onMounted(loadForm)

// Table Columns
const columns = [
    { accessorKey: 'ipd_no', header: 'IPD NO' },
    { accessorKey: 'd_no', header: 'D NO' },
    { accessorKey: 'patient_name', header: 'PATIENT NAME' },
    { accessorKey: 'tpa', header: 'TPA' },
    { accessorKey: 'consultant_name', header: 'CONSULTANT NAME' },
    { accessorKey: 'date_admit', header: 'DATE ADMIT' },
    { accessorKey: 'amount', header: 'AMOUNT' },
    { id: 'action'}
]

const handleAdd = () => {
    // Handle add new IPD record
    console.log('Add new IPD record')
}
</script>
