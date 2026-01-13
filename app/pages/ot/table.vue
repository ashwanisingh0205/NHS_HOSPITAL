<template>
    <div class="space-y-4 bg-white dark:bg-gray-950 min-h-screen p-4">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold">Patient Data Table</h1>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Manage patient records with add and delete functionality.
                </p>
            </div>
            <UButton 
                color="primary" 
                icon="lucide:plus" 
                @click="addRow"
            >
                Add Row
            </UButton>
        </div>

        <UCard>
            <template #header>
                <h3 class="font-semibold">Patient Records</h3>
            </template>
            
            <UTable 
                :data="tableData" 
                :columns="columns"
                :empty-state="{ label: 'No records found. Click Add Row to create a new record.' }"
            >
                <template #patient_name-cell="{ row, rowIndex }">
                    <UInput
                        v-model="row.original.patient_name"
                        placeholder="Enter patient name"
                        class="min-w-[200px]"
                    />
                </template>
                
                <template #data_type-cell="{ row, rowIndex }">
                    <USelect
                        v-model="row.original.data_type"
                        :items="dataTypeOptions"
                        placeholder="Select data type"
                        class="min-w-[150px]"
                    />
                </template>
                
                <template #id-cell="{ row, rowIndex }">
                    <UInput
                        v-model="row.original.id"
                        placeholder="Enter ID"
                        class="min-w-[150px]"
                    />
                </template>
                <template #time-cell="{ row, rowIndex }">
                    <UInput
                        v-model="row.original.time"
                        placeholder="Enter Time"
                        class="min-w-[150px]"
                    />
                </template>
                
               
                
                <template #action-cell="{ row, rowIndex }">
                    <div class="flex items-center gap-2 justify-end">
                        <UButton
                            color="red"
                            variant="ghost"
                            icon="lucide:trash-2"
                            size="sm"
                            @click="deleteRow(row.original.id)"
                        />
                    </div>
                </template>
            </UTable>
        </UCard>
    </div>
</template>

<script setup>
definePageMeta({
    layout: 'home'
})

// Table columns configuration
const columns = [
    { accessorKey: 'patient_name', header: 'Patient Name' },
    { accessorKey: 'data_type', header: 'Data Type' },
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'time', header: 'Time Registered' },
    { accessorKey: 'action', header: 'Actions' }
]

// Data type options for dropdown
const dataTypeOptions = [
    'Number',
    'Date',
    'Boolean',
    'Text',
    'Email',
    'Phone'
]

// Table data - reactive array
const tableData = ref([
    {
        id: 'PAT-001',
        patient_name: 'John Doe',
        data_type: 'Number',
        time: ''
    },
    {
        id: 'PAT-002',
        patient_name: 'Jane Smith',
        data_type: 'Text',
        time: ''
    }
])

// Add new row function
const addRow = () => {
    const newRow = {
        id: `PAT-${String(tableData.value.length + 1).padStart(3, '0')}`,
        patient_name: '',
        data_type: 'Number',
        time: ''
    }
    tableData.value.push(newRow)
}

// Delete row function
const deleteRow = (id) => {
    const index = tableData.value.findIndex(row => row.id === id)
    if (index !== -1) {
        tableData.value.splice(index, 1)
    }
}
</script>