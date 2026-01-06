<template>
    <div class="p-1">
        <!-- OPD Register Table -->
        <CKCardList 
            :title="title" 
            :show-filter="true"
            :filterForm="filterForm"
            @filter="handleFilterSubmit"
            @filterClear="handleFilterClear"
            >
            <UTable 
                :loading="loading" 
                :data="filteredData" 
                :columns="columns"
                class="min-w-full"
            >
                <template #loading>
                    <CKLoader />
                </template>
                <template #empty>
                    <UError :error="{ statusMessage: error || 'No Record Found!!' }" />
                </template>

                <!-- UHID Column -->
                <template #uhid-cell="{ row }">
                    <span class="text-sm font-medium">{{ row.original.uhid || 'N/A' }}</span>
                </template>

                <!-- Bill No Column -->
                <template #bill_no-cell="{ row }">
                    <span class="text-sm">{{ row.original.bill_no || 'N/A' }}</span>
                </template>

                <!-- Patient Name Column -->
                <template #patient_name-cell="{ row }">
                    <span class="text-sm font-medium text-gray-900 dark:text-white">
                        {{ row.original.patient_name || 'N/A' }}
                    </span>
                </template>

                <!-- Consultant Name Column -->
                <template #consultant_name-cell="{ row }">
                    <span class="text-sm">{{ row.original.consultant_name || 'N/A' }}</span>
                </template>

                <!-- Date of OPD Column -->
                <template #date_of_opd-cell="{ row }">
                    <span class="text-sm whitespace-nowrap">{{ row.original.date_of_opd || 'N/A' }}</span>
                </template>

                <!-- Amount Column -->
                <template #amount-cell="{ row }">
                    <span class="text-sm font-semibold text-gray-900 dark:text-white">
                        {{ row.original.amount || 'N/A' }}
                    </span>
                </template>
            </UTable>
        </CKCardList>
    </div>
</template>

<script setup>
import CKCardList from "~/components/common/CKCardList.vue"
import CKLoader from "~/components/common/CKLoader.vue"

definePageMeta({
    layout: 'home'
})

// State
const loading = ref(false)
const error = ref(null)
const searchQuery = ref('')
const title = "OPD Register"
const advancedFilters = ref({})

// Filter Config
const filterForm = {
        fields: [
            {
                id: 'dopd_start',
                field_code: 'dopd_start',
                label: 'DOPD Start',
                data_type: 'DATE',
                placeholder: 'Date of OPD',
                value: [advancedFilters.value.dopd_start || '']
            },
            {
                id: 'dopd_end',
                field_code: 'dopd_end',
                label: 'DOPD End',
                data_type: 'DATE',
                placeholder: 'Date of OPD',
                value: [advancedFilters.value.dopd_end || '']
            },
            {
                id: 'uhid_start',
                field_code: 'uhid_start',
                label: 'UHID Start',
                data_type: 'TEXT',
                placeholder: 'UHID',
                value: [advancedFilters.value.uhid_start || '']
            },
            {
                id: 'bill_no_start',
                field_code: 'bill_no_start',
                label: 'Bill No. Start',
                data_type: 'TEXT',
                placeholder: 'Bill No.',
                value: [advancedFilters.value.bill_no_start || '']
            }
        ]
    }

// Dummy Data
const opdData = ref([
    {
        id: 1,
        uhid: 'UHID001',
        bill_no: 'BILL001',
        patient_name: 'John Doe',
        consultant_name: 'Dr. Smith',
        date_of_opd: '2024-01-15',
        amount: 500
    },
    {
        id: 2,
        uhid: 'UHID002',
        bill_no: 'BILL002',
        patient_name: 'Jane Smith',
        consultant_name: 'Dr. Johnson',
        date_of_opd: '2024-01-16',
        amount: 750
    },
    {
        id: 3,
        uhid: 'UHID003',
        bill_no: 'BILL003',
        patient_name: 'Robert Williams',
        consultant_name: 'Dr. Brown',
        date_of_opd: '2024-01-17',
        amount: 1200
    },
    {
        id: 4,
        uhid: 'UHID004',
        bill_no: 'BILL004',
        patient_name: 'Emily Davis',
        consultant_name: 'Dr. Wilson',
        date_of_opd: '2024-01-18',
        amount: 350
    },
    {
        id: 5,
        uhid: 'UHID005',
        bill_no: 'BILL005',
        patient_name: 'Michael Brown',
        consultant_name: 'Dr. Taylor',
        date_of_opd: '2024-01-19',
        amount: 950
    },
    {
        id: 6,
        uhid: 'UHID006',
        bill_no: 'BILL006',
        patient_name: 'Sarah Miller',
        consultant_name: 'Dr. Anderson',
        date_of_opd: '2024-01-20',
        amount: 600
    },
    {
        id: 7,
        uhid: 'UHID007',
        bill_no: 'BILL007',
        patient_name: 'David Wilson',
        consultant_name: 'Dr. Martinez',
        date_of_opd: '2024-01-21',
        amount: 1100
    },
    {
        id: 8,
        uhid: 'UHID008',
        bill_no: 'BILL008',
        patient_name: 'Lisa Anderson',
        consultant_name: 'Dr. Thomas',
        date_of_opd: '2024-01-22',
        amount: 450
    },
    {
        id: 9,
        uhid: 'UHID009',
        bill_no: 'BILL009',
        patient_name: 'James Taylor',
        consultant_name: 'Dr. Jackson',
        date_of_opd: '2024-01-23',
        amount: 800
    },
    {
        id: 10,
        uhid: 'UHID010',
        bill_no: 'BILL010',
        patient_name: 'Mary Garcia',
        consultant_name: 'Dr. White',
        date_of_opd: '2024-01-24',
        amount: 550
    }
])

// Table Columns
const columns = [
    { accessorKey: 'uhid', header: 'UHID' },
    { accessorKey: 'bill_no', header: 'BILL NO' },
    { accessorKey: 'patient_name', header: 'PATIENT NAME' },
    { accessorKey: 'consultant_name', header: 'CONSULTANT NAME' },
    { accessorKey: 'date_of_opd', header: 'DATE OF OPD' },
    { accessorKey: 'amount', header: 'AMOUNT' }
]

// Filtered Data
const filteredData = computed(() => {
    let filtered = opdData.value

    // Quick search
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(item => {
            return (
                item.uhid?.toLowerCase().includes(query) ||
                item.bill_no?.toLowerCase().includes(query) ||
                item.patient_name?.toLowerCase().includes(query) ||
                item.consultant_name?.toLowerCase().includes(query) ||
                item.date_of_opd?.toLowerCase().includes(query)
            )
        })
    }

    // Advanced filters
    if (advancedFilters.value.dopd_start) {
        filtered = filtered.filter(item => {
            if (!item.date_of_opd) return false
            return new Date(item.date_of_opd) >= new Date(advancedFilters.value.dopd_start)
        })
    }

    if (advancedFilters.value.dopd_end) {
        filtered = filtered.filter(item => {
            if (!item.date_of_opd) return false
            return new Date(item.date_of_opd) <= new Date(advancedFilters.value.dopd_end)
        })
    }

    if (advancedFilters.value.uhid_start) {
        filtered = filtered.filter(item => 
            item.uhid?.toLowerCase().includes(advancedFilters.value.uhid_start.toLowerCase())
        )
    }

    if (advancedFilters.value.bill_no_start) {
        filtered = filtered.filter(item => 
            item.bill_no?.toLowerCase().includes(advancedFilters.value.bill_no_start.toLowerCase())
        )
    }

    return filtered
})

// Filter Handlers
const handleFilterSubmit = (event) => {
    advancedFilters.value = event.payload || {}
}

const handleFilterClear = () => {
    advancedFilters.value = {}
}

const handleAdd = () => {
    // Handle add new OPD record
    console.log('Add new OPD record')
}
</script>
