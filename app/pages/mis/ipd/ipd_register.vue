<template>
    <div class="p-1">
        <!-- IPD Register Table -->
        <CKCardList 
            :title="title" 
            :show-filter="true"
            :filterForm="filterForm"
            :show-add="false"
            @handleAdd="handleAdd" 
            @filter="handleFilterSubmit"
            @filterClear="handleFilterClear"
            v-model="searchQuery">
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

                <!-- IPD No Column -->
                <template #ipd_no-cell="{ row }">
                    <span class="text-sm font-medium">{{ row.original.ipd_no || 'N/A' }}</span>
                </template>

                <!-- D No Column -->
                <template #d_no-cell="{ row }">
                    <span class="text-sm">{{ row.original.d_no || 'N/A' }}</span>
                </template>

                <!-- Patient Name Column -->
                <template #patient_name-cell="{ row }">
                    <span class="text-sm font-medium text-gray-900 dark:text-white">
                        {{ row.original.patient_name || 'N/A' }}
                    </span>
                </template>

                <!-- TPA Column -->
                <template #tpa-cell="{ row }">
                    <UBadge 
                        v-if="row.original.tpa"
                        :label="row.original.tpa"
                        color="primary"
                        variant="soft"
                        size="xs"
                    />
                    <span v-else class="text-sm text-gray-500 dark:text-gray-400">N/A</span>
                </template>

                <!-- Consultant Name Column -->
                <template #consultant_name-cell="{ row }">
                    <span class="text-sm">{{ row.original.consultant_name || 'N/A' }}</span>
                </template>

                <!-- Date Admit Column -->
                <template #date_admit-cell="{ row }">
                    <span class="text-sm whitespace-nowrap">{{ row.original.date_admit || 'N/A' }}</span>
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
const title = "IPD Register"
const advancedFilters = ref({})

// Filter Config
const filterForm = {
        fields: [
            {
                id: 'doa_start',
                field_code: 'doa_start',
                label: 'DOA Start',
                data_type: 'DATE',
                placeholder: 'Date of admission',
                col:'3',
                value: [advancedFilters.value.doa_start || '']
            },
            {
                id: 'doa_end',
                field_code: 'doa_end',
                label: 'DOA End',
                data_type: 'DATE',
                placeholder: 'Date of admission',
                col:'3',
                value: [advancedFilters.value.doa_end || '']
            },
            {
                id: 'uhid_start',
                field_code: 'uhid_start',
                label: 'UHID Start',
                data_type: 'TEXT',
                placeholder: 'UHID',
                col:'3',
                value: [advancedFilters.value.uhid_start || '']
            },
            {
                id: 'ipd_no_start',
                field_code: 'ipd_no_start',
                label: 'PD No. Start',
                data_type: 'TEXT',
                placeholder: 'IPD No.',
                col:'3',
                value: [advancedFilters.value.ipd_no_start || '']
            }
        ]
    }

// Dummy Data
const ipdData = ref([
    {
        id: 1,
        ipd_no: 'IPD001',
        d_no: 'D001',
        uhid: 'UHID001',
        patient_name: 'John Doe',
        tpa: 'Star Health',
        consultant_name: 'Dr. Smith',
        date_admit: '2024-01-15',
        amount: 50000
    },
    {
        id: 2,
        ipd_no: 'IPD002',
        d_no: 'D002',
        uhid: 'UHID002',
        patient_name: 'Jane Smith',
        tpa: null,
        consultant_name: 'Dr. Johnson',
        date_admit: '2024-01-16',
        amount: 75000
    },
    {
        id: 3,
        ipd_no: 'IPD003',
        d_no: 'D003',
        uhid: 'UHID003',
        patient_name: 'Robert Williams',
        tpa: 'HDFC Ergo',
        consultant_name: 'Dr. Brown',
        date_admit: '2024-01-17',
        amount: 120000
    },
    {
        id: 4,
        ipd_no: 'IPD004',
        d_no: 'D004',
        uhid: 'UHID004',
        patient_name: 'Emily Davis',
        tpa: null,
        consultant_name: 'Dr. Wilson',
        date_admit: '2024-01-18',
        amount: 35000
    },
    {
        id: 5,
        ipd_no: 'IPD005',
        d_no: 'D005',
        uhid: 'UHID005',
        patient_name: 'Michael Brown',
        tpa: 'ICICI Lombard',
        consultant_name: 'Dr. Taylor',
        date_admit: '2024-01-19',
        amount: 95000
    },
    {
        id: 6,
        ipd_no: 'IPD006',
        d_no: 'D006',
        uhid: 'UHID006',
        patient_name: 'Sarah Miller',
        tpa: null,
        consultant_name: 'Dr. Anderson',
        date_admit: '2024-01-20',
        amount: 60000
    },
    {
        id: 7,
        ipd_no: 'IPD007',
        d_no: 'D007',
        uhid: 'UHID007',
        patient_name: 'David Wilson',
        tpa: 'Bajaj Allianz',
        consultant_name: 'Dr. Martinez',
        date_admit: '2024-01-21',
        amount: 110000
    },
    {
        id: 8,
        ipd_no: 'IPD008',
        d_no: 'D008',
        uhid: 'UHID008',
        patient_name: 'Lisa Anderson',
        tpa: null,
        consultant_name: 'Dr. Thomas',
        date_admit: '2024-01-22',
        amount: 45000
    },
    {
        id: 9,
        ipd_no: 'IPD009',
        d_no: 'D009',
        uhid: 'UHID009',
        patient_name: 'James Taylor',
        tpa: 'Star Health',
        consultant_name: 'Dr. Jackson',
        date_admit: '2024-01-23',
        amount: 80000
    },
    {
        id: 10,
        ipd_no: 'IPD010',
        d_no: 'D010',
        uhid: 'UHID010',
        patient_name: 'Mary Garcia',
        tpa: null,
        consultant_name: 'Dr. White',
        date_admit: '2024-01-24',
        amount: 55000
    }
])

// Table Columns
const columns = [
    { accessorKey: 'ipd_no', header: 'IPD NO' },
    { accessorKey: 'd_no', header: 'D NO' },
    { accessorKey: 'patient_name', header: 'PATIENT NAME' },
    { accessorKey: 'tpa', header: 'TPA' },
    { accessorKey: 'consultant_name', header: 'CONSULTANT NAME' },
    { accessorKey: 'date_admit', header: 'DATE ADMIT' },
    { accessorKey: 'amount', header: 'AMOUNT' }
]

// Filtered Data
const filteredData = computed(() => {
    let filtered = ipdData.value

    // Quick search
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(item => {
            return (
                item.ipd_no?.toLowerCase().includes(query) ||
                item.d_no?.toLowerCase().includes(query) ||
                item.uhid?.toLowerCase().includes(query) ||
                item.patient_name?.toLowerCase().includes(query) ||
                item.tpa?.toLowerCase().includes(query) ||
                item.consultant_name?.toLowerCase().includes(query) ||
                item.date_admit?.toLowerCase().includes(query)
            )
        })
    }

    // Advanced filters
    if (advancedFilters.value.doa_start) {
        filtered = filtered.filter(item => {
            if (!item.date_admit) return false
            return new Date(item.date_admit) >= new Date(advancedFilters.value.doa_start)
        })
    }

    if (advancedFilters.value.doa_end) {
        filtered = filtered.filter(item => {
            if (!item.date_admit) return false
            return new Date(item.date_admit) <= new Date(advancedFilters.value.doa_end)
        })
    }

    if (advancedFilters.value.uhid_start) {
        filtered = filtered.filter(item => 
            item.uhid?.toLowerCase().includes(advancedFilters.value.uhid_start.toLowerCase())
        )
    }

    if (advancedFilters.value.ipd_no_start) {
        filtered = filtered.filter(item => 
            item.ipd_no?.toLowerCase().includes(advancedFilters.value.ipd_no_start.toLowerCase())
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
    // Handle add new IPD record
    console.log('Add new IPD record')
}
</script>
