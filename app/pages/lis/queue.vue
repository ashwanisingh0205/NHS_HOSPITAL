<template>
    <div class="p-1">
        <!-- OPD Register Table -->
        <CKCardList :title="title" :show-filter="false" :show-add="false">
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
const title = "OPD Register"


// Table Columns
const columns = [
    { accessorKey: 'uhid', header: 'UHID' },
    { accessorKey: 'bill_no', header: 'BILL NO' },
    { accessorKey: 'patient_name', header: 'PATIENT NAME' },
    { accessorKey: 'consultant_name', header: 'CONSULTANT NAME' },
    { accessorKey: 'date_of_opd', header: 'DATE OF OPD' },
    { accessorKey: 'amount', header: 'AMOUNT' },
    { id: 'action'}
]



const data = ref();
const loadForm = async () => {
    loading.value = true
    
    try {
        
        const endpoint = '/form/dummy'
        
        const dataSchema = {
            uhid: 'TEXT',
            bill_no: 'TEXT',
            patient_name: 'TEXT',
            consultant_name: 'TEXT',
            date_of_opd: 'DATE',
            amount: 'CURRENCY',
        }
        
        const result = await $axios.get(endpoint, { params: {dataSchema} })
        data.value = result.data
        
    } catch (err) {
    
    } finally {
        loading.value = false
    }
}
onMounted(loadForm)



</script>
