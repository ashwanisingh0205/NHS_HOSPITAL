<template>
    <div class="p-6 space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Employee Management</h1>
            
        </div>

        <!-- Summary Statistics and Right Panel Section -->
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <!-- Left Side: Summary Statistics (4 cards) -->
            <div class="lg:col-span-4 grid grid-cols-2 gap-4">
                <StaticCard 
                    label="Active Employees" 
                    :value="summaryStats.active"
                    icon="lucide:check-circle"
                    color="green"
                />
                <StaticCard 
                    label="On Leave" 
                    :value="summaryStats.onLeave"
                    icon="lucide:calendar"
                    color="yellow"
                />
                <StaticCard 
                    label="Remote Workers" 
                    :value="summaryStats.remote"
                    icon="lucide:home"
                    color="blue"
                />
                <StaticCard 
                    label="Offline/Left" 
                    :value="summaryStats.offline"
                    icon="lucide:x-circle"
                    color="red"
                />
            </div>

            <!-- Right Side: Quick Search and Today's Birthdays (stacked) -->
            <div class="lg:col-span-1 space-y-4">
                <!-- Filter Card -->
                <FilterCard 
                    :filterData="filterData"
                    @search="handleQuickSearch"
                    @filter="handleAdvancedFilter"
                />

                <!-- Today's Birthdays -->
                <UCard>
                    <template #header>
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <UIcon name="lucide:cake" class="w-4 h-4" />
                                <h2 class="text-lg font-semibold">Today's Birthdays</h2>
                                <UBadge :label="todayBirthdays.length" color="primary" />
                            </div>
                            <div class="flex gap-2">
                                <UButton 
                                    variant="ghost" 
                                    icon="lucide:chevron-left"
                                    size="sm"
                                    @click="scrollBirthdays('left')"
                                />
                                <UButton 
                                    variant="ghost" 
                                    icon="lucide:chevron-right"
                                    size="sm"
                                    @click="scrollBirthdays('right')"
                                />
                            </div>
                        </div>
                    </template>
                    <div 
                        ref="birthdaysContainer"
                        class="flex gap-4 overflow-x-auto pb-2 scrollbar-hide"
                        style="scroll-behavior: smooth;"
                    >
                        <ProfileCard 
                            v-for="employee in todayBirthdays" 
                            :key="employee.id"
                            :employee="employee"
                        />
                        <div v-if="todayBirthdays.length === 0" class="text-center py-8 text-gray-500 w-full">
                            No birthdays today
                        </div>
                    </div>
                </UCard>
            </div>
        </div>

        <!-- Employee Table -->
        <UCard>
            <template #header>
                <div class="text-lg font-semibold">Employee List</div>
            </template>
            <UTable 
                :loading="loading" 
                :data="filteredEmployees" 
                :columns="columns"
            >
                <template v-if="!loading" #empty>
                    <UError :error="{ statusMessage: error || 'No Record Found!!' }" />
                </template>

                <!-- Employee Info Column -->
                <template #employee_info-cell="{ row }">
                    <div class="flex items-center gap-3">
                        <div 
                            class="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                            :class="getAvatarClass(row.original)"
                        >
                            <span>{{ getInitials(row.original) }}</span>
                        </div>
                        <div class="flex-1 min-w-0">
                            <div class="flex items-center gap-2">
                                <p class="font-medium text-gray-900 dark:text-white truncate">
                                    {{ getEmployeeName(row.original) }}
                                </p>
                                <UIcon name="lucide:external-link" class="w-4 h-4 text-gray-400 shrink-0" />
                            </div>
                            <p class="text-sm text-gray-500 dark:text-gray-400">
                                {{ getAge(row.original) }} • {{ getGender(row.original) }}
                            </p>
                        </div>
                    </div>
                </template>

                <!-- EMP ID Column -->
                <template #employee_number-cell="{ row }">
                    {{ row.original.employee_number || 'N/A' }}
                </template>

                <!-- Department Column -->
                <template #department-cell="{ row }">
                    <div>
                        <p class="font-medium text-gray-900 dark:text-white">{{ row.original.department_name || 'N/A' }}</p>
                        <p class="text-sm text-gray-500 dark:text-gray-400">Medical Dept</p>
                    </div>
                </template>

                <!-- Specialization Column -->
                <template #specialization-cell="{ row }">
                    {{ row.original.qualification || 'N/A' }}
                </template>

                <!-- Reporting To Column -->
                <template #reporting_to-cell="{ row }">
                    {{ row.original.jp_details || 'N/A' }}
                </template>

                <!-- Status Column -->
                <template #status-cell="{ row }">
                    <div class="flex items-center gap-2">
                        <div 
                            class="w-2 h-2 rounded-full"
                            :class="getStatusColor(row.original)"
                        ></div>
                        <span>{{ getStatusText(row.original) }}</span>
                    </div>
                </template>

                <!-- Tenure Column -->
                <template #tenure-cell="{ row }">
                    {{ getTenure(row.original) }}
                </template>

                <!-- Actions Column -->
                <template #actions-cell="{ row }">
                    <div class="flex items-center gap-2">
                        <UButton 
                            variant="ghost" 
                            icon="lucide:eye"
                            size="sm"
                            @click="handleView(row.original)"
                        />
                        <UButton 
                            variant="ghost" 
                            icon="lucide:pencil"
                            size="sm"
                            @click="handleEdit(row.original)"
                        />
                        <UDropdown :items="actionItems(row.original)">
                            <UButton 
                                variant="ghost" 
                                icon="lucide:more-vertical"
                                size="sm"
                            />
                        </UDropdown>
                    </div>
                </template>
            </UTable>
        </UCard>
    </div>
</template>

<script setup>
import StaticCard from '~/components/common/StaticCard.vue'
import FilterCard from '~/components/common/FilterCard.vue'
import ProfileCard from '~/components/common/ProfileCard.vue'

definePageMeta({
    layout: 'home'
})

const { $axios } = useNuxtApp()

// State
const loading = ref(true)
const error = ref(null)
const employees = ref([])
const filterData = ref({})
const quickSearchQuery = ref('')
const advancedFilters = ref({})

// Summary Statistics
const summaryStats = computed(() => {
    const active = employees.value.filter(emp => emp.status && !emp.date_resign).length
    const onLeave = employees.value.filter(emp => {
        if (!emp.date_resign) return false
        const resignDate = new Date(emp.date_resign)
        const today = new Date()
        return resignDate > today
    }).length
    const remote = employees.value.filter(emp => emp.status_online && !emp.status_not_employee).length
    const offline = employees.value.filter(emp => !emp.status || emp.date_resign).length
    
    return { active, onLeave, remote, offline }
})

// Today's Birthdays
const todayBirthdays = computed(() => {
    const today = new Date()
    const todayMonth = today.getMonth()
    const todayDay = today.getDate()
    
    return employees.value.filter(emp => {
        if (!emp.date_of_birth) return false
        const dob = new Date(emp.date_of_birth)
        return dob.getMonth() === todayMonth && dob.getDate() === todayDay
    }).slice(0, 4)
})

// Table Columns
const columns = ref([
    { accessorKey: 'employee_info', header: 'EMPLOYEE INFO' },
    { accessorKey: 'employee_number', header: 'EMP ID' },
    { accessorKey: 'department', header: 'DEPARTMENT' },
    { accessorKey: 'specialization', header: 'SPECIALIZATION' },
    { accessorKey: 'reporting_to', header: 'REPORTING TO' },
    { accessorKey: 'status', header: 'STATUS' },
    { accessorKey: 'tenure', header: 'TENURE' },
    { id: 'actions', header: 'ACTIONS' }
])

// Filtered Employees
const filteredEmployees = computed(() => {
    let filtered = employees.value

    // Quick search
    if (quickSearchQuery.value) {
        const query = quickSearchQuery.value.toLowerCase()
        filtered = filtered.filter(emp => {
            const name = getEmployeeName(emp).toLowerCase()
            const email = (emp.email_id || '').toLowerCase()
            const empId = (emp.employee_number || '').toLowerCase()
            return name.includes(query) || email.includes(query) || empId.includes(query)
        })
    }

    // Advanced filters
    if (advancedFilters.value.employee_number) {
        filtered = filtered.filter(emp => 
            (emp.employee_number || '').includes(advancedFilters.value.employee_number)
        )
    }

    if (advancedFilters.value.employee_name) {
        const query = advancedFilters.value.employee_name.toLowerCase()
        filtered = filtered.filter(emp => 
            getEmployeeName(emp).toLowerCase().includes(query)
        )
    }

    if (advancedFilters.value.status) {
        if (advancedFilters.value.status === 'ACT') {
            filtered = filtered.filter(emp => emp.status && !emp.date_resign)
        } else if (advancedFilters.value.status === 'LFT') {
            filtered = filtered.filter(emp => emp.date_resign)
        }
    }

    return filtered
})

// Load Filter Data
const loadFilterData = async () => {
    try {
        const response = await $axios.get('/v1/hrm/employee_master/filters')
        if (response.data.success) {
            filterData.value = response.data
        }
    } catch (err) {
        console.error('Error loading filter data:', err)
    }
}

// Load Employees
const loadEmployees = async () => {
    loading.value = true
    error.value = null
    try {
        const response = await $axios.get('/hrm/employee_master')
        const temp = response.data
        if (temp.success && Array.isArray(temp.employees)) {
            employees.value = temp.employees
        } else {
            error.value = 'Invalid response format from API'
        }
    } catch (err) {
        error.value = err.response?.data?.message || err.message || 'Failed to load employees'
    } finally {
        loading.value = false
    }
}

// Helper Functions
const getEmployeeName = (employee) => {
    const parts = [employee.title, employee.first_name, employee.middle_name, employee.last_name]
    return parts.filter(Boolean).join(' ') || 'Unknown'
}

const getInitials = (employee) => {
    const first = employee.first_name?.[0] || ''
    const last = employee.last_name?.[0] || ''
    return (first + last).toUpperCase() || '??'
}

const getAge = (employee) => {
    if (!employee.date_of_birth) return 'N/A'
    const dob = new Date(employee.date_of_birth)
    const today = new Date()
    const age = today.getFullYear() - dob.getFullYear()
    const monthDiff = today.getMonth() - dob.getMonth()
    return monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate()) ? age - 1 : age
}

const getGender = (employee) => {
    const genderMap = { 'M': 'Male', 'F': 'Female', 'O': 'Other' }
    return genderMap[employee.gender] || 'N/A'
}

const getStatusText = (employee) => {
    if (employee.date_resign) {
        const resignDate = new Date(employee.date_resign)
        const today = new Date()
        if (resignDate > today) return 'On Leave'
        return 'Left'
    }
    if (employee.status_online && !employee.status_not_employee) return 'Remote'
    if (employee.status) return 'Active'
    return 'Inactive'
}

const getStatusColor = (employee) => {
    const status = getStatusText(employee)
    if (status === 'Active' || status === 'Remote') return 'bg-blue-500'
    if (status === 'On Leave') return 'bg-orange-500'
    return 'bg-gray-500'
}

const getTenure = (employee) => {
    if (!employee.date_joining) return 'N/A'
    const joinDate = new Date(employee.date_joining)
    const today = new Date()
    const years = today.getFullYear() - joinDate.getFullYear()
    const monthDiff = today.getMonth() - joinDate.getMonth()
    const actualYears = monthDiff < 0 || (monthDiff === 0 && today.getDate() < joinDate.getDate()) ? years - 1 : years
    return `${actualYears} years`
}

const getAvatarClass = (employee) => {
    const colors = ['bg-blue-500', 'bg-pink-500', 'bg-purple-500', 'bg-yellow-500', 'bg-green-500', 'bg-orange-500']
    const index = (employee.id || 0) % colors.length
    return colors[index]
}

// Handlers
const handleQuickSearch = (query) => {
    quickSearchQuery.value = query
}

const handleAdvancedFilter = (payload) => {
    advancedFilters.value = payload
}

const scrollBirthdays = (direction) => {
    const container = birthdaysContainer.value
    if (container) {
        const scrollAmount = 220
        container.scrollLeft += direction === 'right' ? scrollAmount : -scrollAmount
    }
}

const handleView = (employee) => {
    console.log('View employee:', employee)
    // Navigate to employee detail page
    // navigateTo(`/hrm/profile/employees/${employee.id}`)
}

const handleEdit = (employee) => {
    console.log('Edit employee:', employee)
    // Open edit modal
    // editModal.value = true
    // selectedEmployee.value = employee
}

const actionItems = (employee) => [
    [{
        label: 'View Details',
        icon: 'lucide:eye',
        click: () => handleView(employee)
    }],
    [{
        label: 'Edit',
        icon: 'lucide:pencil',
        click: () => handleEdit(employee)
    }],
    [{
        label: 'Delete',
        icon: 'lucide:trash',
        click: () => console.log('Delete:', employee)
    }]
]

const birthdaysContainer = ref(null)

// Lifecycle
onMounted(async () => {
    await Promise.all([
        loadFilterData(),
        loadEmployees()
    ])
})
</script>

<style scoped>
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
</style>
