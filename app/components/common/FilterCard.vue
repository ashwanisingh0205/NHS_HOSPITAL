<template>
    <UCard>
        <!-- Quick Search -->
        <div class="mb-4">
            <UFormField label="Quick Search">
                <UInput 
                    v-model="searchQuery"
                    placeholder="Search employees by name, email, or ID..."
                    icon="lucide:search"
                    class="w-full"
                />
            </UFormField>
        </div>

        <!-- Advanced Filters Slideover -->
        <USlideover side="right" inset title="Advanced Filters">
            <UButton 
                variant="solid"
                color="primary"
                icon="lucide:filter"
                block
            >
                Advanced Filters
            </UButton>

            <template #body>
                <div class="p-4 space-y-4">
                    <DynamicStaticData 
                        :staticData="filterConfig"
                        @submit="handleFilterSubmit"
                    />
                </div>
            </template>
        </USlideover>
    </UCard>
</template>

<script setup>
import DynamicStaticData from '~/components/emr/DynamicStaticData.vue'

const props = defineProps({
    filterData: { type: Object, default: () => ({}) }
})

const emit = defineEmits(['search', 'filter'])

const searchQuery = ref('')

const filterConfig = computed(() => {
    return {
        fields: [
            {
                id: 'employee_number',
                field_code: 'employee_number',
                label: 'Employee Number',
                data_type: 'TEXT',
                placeholder: 'Employee Number',
                value: ['']
            },
            {
                id: 'employee_name',
                field_code: 'employee_name',
                label: 'Employee Name/Phone',
                data_type: 'TEXT',
                placeholder: 'Employee Name/Pl',
                value: ['']
            },
            {
                id: 'date_of',
                field_code: 'date_of',
                label: 'Date Of',
                data_type: 'DROPDOWN',
                placeholder: 'Select Date Type',
                options: props.filterData.dateOf?.map(item => ({
                    label: item.value,
                    value: item.key
                })) || [],
                value: [null]
            },
            {
                id: 'date_from',
                field_code: 'date_from',
                label: 'Date From',
                data_type: 'DATE',
                placeholder: 'Date from',
                value: ['']
            },
            {
                id: 'date_to',
                field_code: 'date_to',
                label: 'Date To',
                data_type: 'DATE',
                placeholder: 'Date to',
                value: ['']
            },
            {
                id: 'birthday_month',
                field_code: 'birthday_month',
                label: 'Birthday Month',
                data_type: 'DROPDOWN',
                placeholder: 'N/A',
                options: props.filterData.birthdayMonth?.map(item => ({
                    label: item.value,
                    value: item.key
                })) || [],
                value: [null]
            },
            {
                id: 'department',
                field_code: 'department',
                label: 'Department',
                data_type: 'DROPDOWN',
                placeholder: 'All Sub Department',
                options: props.filterData.departments?.map(item => ({
                    label: item.value || item.name,
                    value: item.key || item.id
                })) || [],
                value: [null]
            },
            {
                id: 'designation',
                field_code: 'designation',
                label: 'Designation',
                data_type: 'DROPDOWN',
                placeholder: 'All Designation',
                options: props.filterData.designations?.map(item => ({
                    label: item.value || item.name,
                    value: item.key || item.id
                })) || [],
                value: [null]
            },
            {
                id: 'status',
                field_code: 'status',
                label: 'Status',
                data_type: 'DROPDOWN',
                placeholder: 'All',
                options: props.filterData.status?.map(item => ({
                    label: item.value,
                    value: item.key
                })) || [],
                value: [null]
            },
            {
                id: 'gender',
                field_code: 'gender',
                label: 'Gender',
                data_type: 'DROPDOWN',
                placeholder: 'N/A',
                options: props.filterData.gender?.map(item => ({
                    label: item.value,
                    value: item.key
                })) || [],
                value: [null]
            },
            {
                id: 'verified',
                field_code: 'verified',
                label: 'Verified',
                data_type: 'DROPDOWN',
                placeholder: 'N/A',
                options: props.filterData.verified?.map(item => ({
                    label: item,
                    value: item
                })) || [],
                value: [null]
            },
            {
                id: 'blood_group',
                field_code: 'blood_group',
                label: 'Blood Group',
                data_type: 'DROPDOWN',
                placeholder: 'N/A',
                options: props.filterData.blood_groups?.map(item => ({
                    label: item,
                    value: item
                })) || [],
                value: [null]
            }
        ]
    }
})

const handleFilterSubmit = (event) => {
    emit('filter', event.payload)
}

watch(searchQuery, (val) => {
    emit('search', val)
})
</script>

