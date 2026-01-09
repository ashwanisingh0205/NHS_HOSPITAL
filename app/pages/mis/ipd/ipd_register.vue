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
                    target="_blank"
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

const title = "IPD Register"
const filterFormCode = "ipd_register_filter"
const filterEndPoint = "/form/defaultForm"

const columns = [
    { accessorKey: 'uhid', header: 'UHID' },
    { accessorKey: 'patient_name', header: 'PATIENT NAME' },
    { accessorKey: 'consultant_name', header: 'CONSULTANT NAME' },
    { accessorKey: 'ipd_date', header: 'IPD DATE' },
    { accessorKey: 'amount', header: 'AMOUNT' },
    { id: 'action'}
]



const loadForm = async () => {
    loading.value = true
    try {
        const result = await $axios.get('/visits/ipd_register')
        data.value = result.data?.registrations?.data || []
    } catch (err) {
        error.value = err.response?.data?.message || err.message || 'Failed to load data'
        console.error('Error loading IPD register:', err)
    } finally {
        loading.value = false
    }
}

onMounted(loadForm)
</script>
