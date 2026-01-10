<template>
    <CKCardList
        :title="title"
        :show-filter="true"
        :show-add="false"
        :filterFormCode="filterFormCode"
        :filterEndPoint="filterEndPoint">
        <template #header-actions>
            <UButton :href="urlPDF" download label="PDF" leadingIcon="lucide:file" />
            <UButton :href="urlCSV" label="CSV" download leading-icon="lucide:file-spreadsheet"/>
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
const urlPDF = ref("")
const urlCSV = ref("")

const title = "OPD Register"
const filterFormCode = "opd_register_filter"
const filterEndPoint = "/form/defaultForm"

const columns = [
    { accessorKey: 'uhid', header: 'UHID' },
    { accessorKey: 'patient_name', header: 'PATIENT NAME' },
    { accessorKey: 'consultant_name', header: 'CONSULTANT NAME' },
    { accessorKey: 'date_of_opd', header: 'DATE OF OPD' },
    { accessorKey: 'amount', header: 'AMOUNT' },
    { id: 'action'}
]

const loadForm = async () => {
    loading.value = true
    try {
        const result = await $axios.get('/visits/opd_register')
        data.value = result.data?.registrations?.data || []
        urlPDF.value = useRuntimeConfig().public.apiBase + `${filterEndPoint}?output=PDF`;
        urlCSV.value = useRuntimeConfig().public.apiBase + `${filterEndPoint}?output=CSV`;
    } catch (err) {
        error.value = err.response?.data?.message || err.message || 'Failed to load data'
    } finally {
        loading.value = false
    }
}
onMounted(loadForm)
</script>

