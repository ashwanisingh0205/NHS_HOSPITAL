<template>
    <div class="p-1">
        <!-- OPD Register Table -->
        <CKCardList 
            :title="title" 
            :show-filter="false"
            :show-add="false"
            >
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

definePageMeta({
    layout: 'home'
})

// State
const loading = ref(false)
const error = ref(null)
const searchQuery = ref('')
const title = "OPD Register"


// Table Columns
const columns = [
    { accessorKey: 'uhid', header: 'UHID' },
    { accessorKey: 'bill_no', header: 'BILL NO' },
    { accessorKey: 'patient_name', header: 'PATIENT NAME' },
    { accessorKey: 'consultant_name', header: 'CONSULTANT NAME' },
    { accessorKey: 'date_of_opd', header: 'DATE OF OPD' },
    { accessorKey: 'amount', header: 'AMOUNT' },
    { id: 'ACTION'}
]


// Dummy Data
const opdData = ref([
    {
        id: 1,
        uhid: 'UHID001',
        bill_no: 'BILL001',
        patient_name: 'John Doe',
        consultant_name: 'Dr. Smith',
        date_of_opd: '2024-01-15',
        amount: 500,
        tpa: 'Star Health',
        polyclinic: 'Polyclinic 1',
        cons_dept: 'Cardiology',
        user: 'User 1',
        company: 'Star Health',
        is_employee: false
    },
    {
        id: 2,
        uhid: 'UHID002',
        bill_no: 'BILL002',
        patient_name: 'Jane Smith',
        consultant_name: 'Dr. Johnson',
        date_of_opd: '2024-01-16',
        amount: 750,
        tpa: null,
        polyclinic: 'Polyclinic 2',
        cons_dept: 'Neurology',
        user: 'User 2',
        company: null,
        is_employee: true
    },
    {
        id: 3,
        uhid: 'UHID003',
        bill_no: 'BILL003',
        patient_name: 'Robert Williams',
        consultant_name: 'Dr. Brown',
        date_of_opd: '2024-01-17',
        amount: 1200,
        tpa: 'HDFC Ergo',
        polyclinic: 'Polyclinic 1',
        cons_dept: 'Orthopedics',
        user: 'User 1',
        company: 'HDFC Ergo',
        is_employee: false
    },
    {
        id: 4,
        uhid: 'UHID004',
        bill_no: 'BILL004',
        patient_name: 'Emily Davis',
        consultant_name: 'Dr. Wilson',
        date_of_opd: '2024-01-18',
        amount: 350,
        tpa: null,
        polyclinic: 'Polyclinic 3',
        cons_dept: 'General Medicine',
        user: 'User 3',
        company: null,
        is_employee: false
    },
    {
        id: 5,
        uhid: 'UHID005',
        bill_no: 'BILL005',
        patient_name: 'Michael Brown',
        consultant_name: 'Dr. Taylor',
        date_of_opd: '2024-01-19',
        amount: 950,
        tpa: 'ICICI Lombard',
        polyclinic: 'Polyclinic 2',
        cons_dept: 'Cardiology',
        user: 'User 2',
        company: 'ICICI Lombard',
        is_employee: true
    },
    {
        id: 6,
        uhid: 'UHID006',
        bill_no: 'BILL006',
        patient_name: 'Sarah Miller',
        consultant_name: 'Dr. Anderson',
        date_of_opd: '2024-01-20',
        amount: 600,
        tpa: null,
        polyclinic: 'Polyclinic 1',
        cons_dept: 'Neurology',
        user: 'User 1',
        company: null,
        is_employee: false
    },
    {
        id: 7,
        uhid: 'UHID007',
        bill_no: 'BILL007',
        patient_name: 'David Wilson',
        consultant_name: 'Dr. Martinez',
        date_of_opd: '2024-01-21',
        amount: 1100,
        tpa: 'Bajaj Allianz',
        polyclinic: 'Polyclinic 3',
        cons_dept: 'Orthopedics',
        user: 'User 3',
        company: 'Bajaj Allianz',
        is_employee: false
    },
    {
        id: 8,
        uhid: 'UHID008',
        bill_no: 'BILL008',
        patient_name: 'Lisa Anderson',
        consultant_name: 'Dr. Thomas',
        date_of_opd: '2024-01-22',
        amount: 450,
        tpa: null,
        polyclinic: 'Polyclinic 2',
        cons_dept: 'General Medicine',
        user: 'User 2',
        company: null,
        is_employee: true
    },
    {
        id: 9,
        uhid: 'UHID009',
        bill_no: 'BILL009',
        patient_name: 'James Taylor',
        consultant_name: 'Dr. Jackson',
        date_of_opd: '2024-01-23',
        amount: 800,
        tpa: 'Star Health',
        polyclinic: 'Polyclinic 1',
        cons_dept: 'Cardiology',
        user: 'User 1',
        company: 'Star Health',
        is_employee: false
    },
    {
        id: 10,
        uhid: 'UHID010',
        bill_no: 'BILL010',
        patient_name: 'Mary Garcia',
        consultant_name: 'Dr. White',
        date_of_opd: '2024-01-24',
        amount: 550,
        tpa: null,
        polyclinic: 'Polyclinic 3',
        cons_dept: 'Neurology',
        user: 'User 3',
        company: null,
        is_employee: false
    }
])



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

    return filtered
})

const handleAdd = () => {
    // Handle add new OPD record
    console.log('Add new OPD record')
}
</script>
