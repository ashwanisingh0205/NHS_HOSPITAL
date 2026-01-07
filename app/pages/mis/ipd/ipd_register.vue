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
const filterForm = computed(() => ({
        fields: [
            // Row 1
            {
                id: 'date_filter_type',
                field_code: 'date_filter_type',
                label: 'Date Filter Type',
                data_type: 'DROPDOWN',
                placeholder: 'Date of Admission',
                col: '3',
                choices: [
                    { id: 'date_of_admission', value: 'Date of Admission' },
                    { id: 'date_of_discharge', value: 'Date of Discharge' }
                ],
                value: [advancedFilters.value.date_filter_type || 'date_of_admission']
            },
            {
                id: 'uhid_start',
                field_code: 'uhid_start',
                label: 'UHID Start',
                data_type: 'TEXT',
                placeholder: 'UHID Start',
                col: '3',
                value: [advancedFilters.value.uhid_start || '']
            },
            {
                id: 'uhid_end',
                field_code: 'uhid_end',
                label: 'UHID End',
                data_type: 'TEXT',
                placeholder: 'UHID End',
                col: '3',
                value: [advancedFilters.value.uhid_end || '']
            },
            {
                id: 'billing',
                field_code: 'billing',
                label: 'Billing',
                data_type: 'DROPDOWN',
                placeholder: 'All',
                col: '3',
                choices: [
                    { id: 'all', value: 'All' },
                    { id: 'cash', value: 'Cash' },
                    { id: 'insurance', value: 'Insurance' },
                    { id: 'tpa', value: 'TPA' }
                ],
                value: [advancedFilters.value.billing || 'all']
            },
            {
                id: 'cons_dept',
                field_code: 'cons_dept',
                label: 'Cons. Dept.',
                data_type: 'DROPDOWN',
                placeholder: 'All Departments',
                col: '3',
                choices: [
                    { id: 'all', value: 'All Departments' },
                    { id: 'cardiology', value: 'Cardiology' },
                    { id: 'neurology', value: 'Neurology' },
                    { id: 'orthopedics', value: 'Orthopedics' },
                    { id: 'general', value: 'General Medicine' }
                ],
                value: [advancedFilters.value.cons_dept || 'all']
            },
            // Row 2
            {
                id: 'doa_start',
                field_code: 'doa_start',
                label: 'DOA Start',
                data_type: 'DATE',
                placeholder: 'DOA Start',
                col: '3',
                value: [advancedFilters.value.doa_start || '']
            },
            {
                id: 'doa_end',
                field_code: 'doa_end',
                label: 'DOA End',
                data_type: 'DATE',
                placeholder: 'DOA End',
                col: '3',
                value: [advancedFilters.value.doa_end || '']
            },
            {
                id: 'ipd_no_start',
                field_code: 'ipd_no_start',
                label: 'IPD No. Start',
                data_type: 'TEXT',
                placeholder: 'IPD No. Start',
                col: '3',
                value: [advancedFilters.value.ipd_no_start || '']
            },
            {
                id: 'ipd_no_end',
                field_code: 'ipd_no_end',
                label: 'IPD No. End',
                data_type: 'TEXT',
                placeholder: 'IPD No. End',
                col: '3',
                value: [advancedFilters.value.ipd_no_end || '']
            },
            {
                id: 'type_of_admission',
                field_code: 'type_of_admission',
                label: 'Type of admission',
                data_type: 'DROPDOWN',
                placeholder: 'All admission',
                col: '3',
                choices: [
                    { id: 'all', value: 'All admission' },
                    { id: 'emergency', value: 'Emergency' },
                    { id: 'elective', value: 'Elective' },
                    { id: 'transfer', value: 'Transfer' }
                ],
                value: [advancedFilters.value.type_of_admission || 'all']
            },
            {
                id: 'consultant',
                field_code: 'consultant',
                label: 'Consultant',
                data_type: 'DROPDOWN',
                placeholder: 'All Consultants',
                col: '3',
                choices: [
                    { id: 'all', value: 'All Consultants' },
                    { id: 'dr_smith', value: 'Dr. Smith' },
                    { id: 'dr_johnson', value: 'Dr. Johnson' },
                    { id: 'dr_brown', value: 'Dr. Brown' },
                    { id: 'dr_wilson', value: 'Dr. Wilson' }
                ],
                value: [advancedFilters.value.consultant || 'all']
            },
            // Row 3
            {
                id: 'city',
                field_code: 'city',
                label: 'City',
                data_type: 'TEXT',
                placeholder: 'Address',
                col: '3',
                value: [advancedFilters.value.city || '']
            },
            {
                id: 'discharge_no_start',
                field_code: 'discharge_no_start',
                label: 'Discharge No. Start',
                data_type: 'TEXT',
                placeholder: 'Discharge No. Start',
                col: '3',
                value: [advancedFilters.value.discharge_no_start || '']
            },
            {
                id: 'discharge_no_end',
                field_code: 'discharge_no_end',
                label: 'Discharge No. End',
                data_type: 'TEXT',
                placeholder: 'Discharge No. End',
                col: '3',
                value: [advancedFilters.value.discharge_no_end || '']
            },
            {
                id: 'sorting',
                field_code: 'sorting',
                label: 'Sorting',
                data_type: 'DROPDOWN',
                placeholder: 'D.No.(Descending)',
                col: '3',
                choices: [
                    { id: 'd_no_desc', value: 'D.No.(Descending)' },
                    { id: 'd_no_asc', value: 'D.No.(Ascending)' },
                    { id: 'ipd_no_desc', value: 'IPD No.(Descending)' },
                    { id: 'ipd_no_asc', value: 'IPD No.(Ascending)' },
                    { id: 'date_desc', value: 'Date(Descending)' },
                    { id: 'date_asc', value: 'Date(Ascending)' }
                ],
                value: [advancedFilters.value.sorting || 'd_no_desc']
            },
            {
                id: 'company',
                field_code: 'company',
                label: 'Company',
                data_type: 'DROPDOWN',
                placeholder: 'All Companies',
                col: '3',
                choices: [
                    { id: 'all', value: 'All Companies' },
                    { id: 'star_health', value: 'Star Health' },
                    { id: 'hdfc_ergo', value: 'HDFC Ergo' },
                    { id: 'icici_lombard', value: 'ICICI Lombard' },
                    { id: 'bajaj_allianz', value: 'Bajaj Allianz' }
                ],
                value: [advancedFilters.value.company || 'all']
            }
        ]
    }))

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

    // Date range filters (DOA)
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

    // UHID range filter
    if (advancedFilters.value.uhid_start) {
        filtered = filtered.filter(item => {
            if (!item.uhid) return false
            const uhidNum = Number.parseInt(item.uhid.replace(/\D/g, ''), 10) || 0
            const startNum = Number.parseInt(advancedFilters.value.uhid_start.replace(/\D/g, ''), 10) || 0
            return uhidNum >= startNum
        })
    }

    if (advancedFilters.value.uhid_end) {
        filtered = filtered.filter(item => {
            if (!item.uhid) return false
            const uhidNum = Number.parseInt(item.uhid.replace(/\D/g, ''), 10) || 0
            const endNum = Number.parseInt(advancedFilters.value.uhid_end.replace(/\D/g, ''), 10) || 0
            return uhidNum <= endNum
        })
    }

    // IPD No range filter
    if (advancedFilters.value.ipd_no_start) {
        filtered = filtered.filter(item => {
            if (!item.ipd_no) return false
            const ipdNum = Number.parseInt(item.ipd_no.replace(/\D/g, ''), 10) || 0
            const startNum = Number.parseInt(advancedFilters.value.ipd_no_start.replace(/\D/g, ''), 10) || 0
            return ipdNum >= startNum
        })
    }

    if (advancedFilters.value.ipd_no_end) {
        filtered = filtered.filter(item => {
            if (!item.ipd_no) return false
            const ipdNum = Number.parseInt(item.ipd_no.replace(/\D/g, ''), 10) || 0
            const endNum = Number.parseInt(advancedFilters.value.ipd_no_end.replace(/\D/g, ''), 10) || 0
            return ipdNum <= endNum
        })
    }

    // Discharge No range filter
    if (advancedFilters.value.discharge_no_start) {
        filtered = filtered.filter(item => {
            if (!item.d_no) return false
            const dNum = Number.parseInt(item.d_no.replace(/\D/g, ''), 10) || 0
            const startNum = Number.parseInt(advancedFilters.value.discharge_no_start.replace(/\D/g, ''), 10) || 0
            return dNum >= startNum
        })
    }

    if (advancedFilters.value.discharge_no_end) {
        filtered = filtered.filter(item => {
            if (!item.d_no) return false
            const dNum = Number.parseInt(item.d_no.replace(/\D/g, ''), 10) || 0
            const endNum = Number.parseInt(advancedFilters.value.discharge_no_end.replace(/\D/g, ''), 10) || 0
            return dNum <= endNum
        })
    }

    // Billing filter
    if (advancedFilters.value.billing && advancedFilters.value.billing !== 'all') {
        filtered = filtered.filter(item => {
            if (advancedFilters.value.billing === 'tpa') {
                return item.tpa !== null && item.tpa !== ''
            } else if (advancedFilters.value.billing === 'cash') {
                return !item.tpa || item.tpa === ''
            }
            return true
        })
    }

    // Consultant filter
    if (advancedFilters.value.consultant && advancedFilters.value.consultant !== 'all') {
        filtered = filtered.filter(item => {
            const consultantMap = {
                'dr_smith': 'Dr. Smith',
                'dr_johnson': 'Dr. Johnson',
                'dr_brown': 'Dr. Brown',
                'dr_wilson': 'Dr. Wilson'
            }
            const consultantName = consultantMap[advancedFilters.value.consultant]
            return item.consultant_name === consultantName
        })
    }

    // Company filter (TPA)
    if (advancedFilters.value.company && advancedFilters.value.company !== 'all') {
        filtered = filtered.filter(item => {
            const companyMap = {
                'star_health': 'Star Health',
                'hdfc_ergo': 'HDFC Ergo',
                'icici_lombard': 'ICICI Lombard',
                'bajaj_allianz': 'Bajaj Allianz'
            }
            const companyName = companyMap[advancedFilters.value.company]
            return item.tpa === companyName
        })
    }

    // City filter
    if (advancedFilters.value.city) {
        filtered = filtered.filter(item => {
            // Assuming city data might be in patient data - adjust based on actual data structure
            return item.city?.toLowerCase().includes(advancedFilters.value.city.toLowerCase())
        })
    }

    // Sorting
    if (advancedFilters.value.sorting) {
        const sortType = advancedFilters.value.sorting
        filtered = [...filtered].sort((a, b) => {
            if (sortType === 'd_no_desc' || sortType === 'd_no_asc') {
                const aNum = Number.parseInt(a.d_no?.replace(/\D/g, '') || '0', 10)
                const bNum = Number.parseInt(b.d_no?.replace(/\D/g, '') || '0', 10)
                return sortType === 'd_no_desc' ? bNum - aNum : aNum - bNum
            } else if (sortType === 'ipd_no_desc' || sortType === 'ipd_no_asc') {
                const aNum = Number.parseInt(a.ipd_no?.replace(/\D/g, '') || '0', 10)
                const bNum = Number.parseInt(b.ipd_no?.replace(/\D/g, '') || '0', 10)
                return sortType === 'ipd_no_desc' ? bNum - aNum : aNum - bNum
            } else if (sortType === 'date_desc' || sortType === 'date_asc') {
                const aDate = new Date(a.date_admit || 0)
                const bDate = new Date(b.date_admit || 0)
                return sortType === 'date_desc' ? bDate - aDate : aDate - bDate
            }
            return 0
        })
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
