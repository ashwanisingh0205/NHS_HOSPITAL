<template>
    <div class="p-1">
        <CKCardList 
            :title="title" 
            :show-filter="true" 
            :show-add="false"
            :filterFormCode="filterFormCode"
            :filterEndPoint="filterEndPoint">
            <template #header-actions>
                <UButton
                    color="primary"
                    variant="solid"
                    :href="pdfPreviewUrl"
                    @click.prevent="handlePDFClick"
                    :loading="downloadingPDF"
                    leading-icon="lucide:file-pdf">
                    PDF
                </UButton>
                <UButton
                    color="info"
                    variant="solid"
                    :href="csvPreviewUrl"
                    target="_blank"
                    @click.prevent="handleCSVClick"
                    :loading="downloadingCSV"
                    leading-icon="lucide:file-spreadsheet">
                    CSV
                </UButton>
            </template>
            <UTable :loading="loading" :data="data" :columns="columns">
                <template #loading>
                    <CKLoader />
                </template>
                <template #empty>
                    <UError :error="{ statusMessage: error || 'No Record Found!!' }" />
                </template>
                <template #action-cell>
                    <CKEdit />
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

const { $axios } = useNuxtApp()

const loading = ref(false)
const error = ref(null)
const data = ref([])
const downloadingPDF = ref(false)
const downloadingCSV = ref(false)
const pdfPreviewUrl = ref(null)
const csvPreviewUrl = ref(null)

const title = "Patient Register"
const filterFormCode = "patient_register_filter"
const filterEndPoint = "/form/defaultForm"

const columns = [
    { accessorKey: 'uhid', header: 'UHID' },
    { accessorKey: 'patient_name', header: 'Patient Name' },
    { accessorKey: 'phone_mobile', header: 'Mobile' },
    { accessorKey: 'source', header: 'Source' },
    { accessorKey: 'created_at_date', header: 'Date' },
    { accessorKey: 'pending_amount', header: 'Amount' },
    { id: 'action'}
]

const loadForm = async () => {
    loading.value = true
    try {
        const result = await $axios.get('/visits/patient_register')
        data.value = result.data?.registrations?.data || []
    } catch (err) {
        error.value = err.response?.data?.message || err.message || 'Failed to load data'
        console.error('Error loading patient register:', err)
    } finally {
        loading.value = false
    }
}

const handlePDFClick = async () => {
    if (process.server) return
    
    if (pdfPreviewUrl.value) {
        window.open(pdfPreviewUrl.value, '_blank')
        return
    }
    
    downloadingPDF.value = true
    try {
        const response = await $axios.get('/visits/patient_register?output=PDF', {
            responseType: 'blob'
        })
        
        const blob = new Blob([response.data], { type: 'application/pdf' })
        pdfPreviewUrl.value = globalThis.URL.createObjectURL(blob)
        window.open(pdfPreviewUrl.value, '_blank')
    } catch (err) {
        error.value = err.response?.data?.message || err.message || 'Failed to load PDF preview'
        console.error('Error loading PDF preview:', err)
    } finally {
        downloadingPDF.value = false
    }
}

const handleCSVClick = async () => {
    if (process.server) return
    
    if (csvPreviewUrl.value) {
        window.open(csvPreviewUrl.value, '_blank')
        return
    }
    
    downloadingCSV.value = true
    try {
        const response = await $axios.get('/visits/patient_register?output=CSV', {
            responseType: 'blob'
        })
        
        const blob = new Blob([response.data], { type: 'text/csv' })
        csvPreviewUrl.value = globalThis.URL.createObjectURL(blob)
        window.open(csvPreviewUrl.value, '_blank')
    } catch (err) {
        error.value = err.response?.data?.message || err.message || 'Failed to load CSV preview'
        console.error('Error loading CSV preview:', err)
    } finally {
        downloadingCSV.value = false
    }
}

onMounted(loadForm)
</script>

