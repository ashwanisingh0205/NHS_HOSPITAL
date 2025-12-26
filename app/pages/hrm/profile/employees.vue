<template>
    <div class="p-6 space-y-6">
        <!-- Show parent content only when not on child route -->
        <template v-if="!isChildRoute">
            <!-- Header -->
            <div class="flex items-center justify-between">
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Employee Management</h1>
                
            </div>

        <!-- Summary Statistics and Right Panel Section -->
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <!-- Left Side: Summary Statistics (4 cards) -->
            <div class="lg:col-span-4 grid grid-cols-2 gap-4">
                <StaticCard 
                    label="Total Employees" 
                    :value="summaryStats.total"
                    icon="lucide:users"
                    color="blue"
                />
                <StaticCard 
                    label="Today's Birthdays" 
                    :value="todayBirthdays.length"
                    icon="lucide:cake"
                    color="pink"
                />
                <StaticCard 
                    label="With Privileges" 
                    :value="summaryStats.withPrivileges"
                    icon="lucide:shield-check"
                    color="green"
                />
                <StaticCard 
                    label="With Designation" 
                    :value="summaryStats.withDesignation"
                    icon="lucide:briefcase"
                    color="purple"
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
                            :key="employee.employee_id"
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
                <div class="flex items-center justify-between">
                    <div class="text-lg font-semibold">Employee List</div>
                    <UButton icon="lucide:plus" variant="solid" color="primary" size="sm" @click="openAddEmployeeModal">Add Employee</UButton>
                </div>
            </template>
            <div class="overflow-x-auto">
                <UTable 
                    :loading="loading" 
                    :data="filteredEmployees" 
                    :columns="columns"
                    class="min-w-full"
                >
                <template v-if="!loading" #empty>
                    <UError :error="{ statusMessage: error || 'No Record Found!!' }" />
                </template>

                <!-- Employee Info Column -->
                <template #employee_info-cell="{ row }">
                    <div class="flex items-center gap-3">
                        <div 
                            class="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm overflow-hidden"
                            :class="getAvatarClass(row.original)"
                        >
                            <img 
                                v-if="row.original.url_profile" 
                                :src="row.original.url_profile" 
                                :alt="getEmployeeName(row.original)"
                                class="w-full h-full object-cover"
                            />
                            <span v-else>{{ getInitials(row.original) }}</span>
                        </div>
                        <div class="flex-1 min-w-0">
                            <div class="flex items-center gap-2">
                                <p class="font-medium text-gray-900 dark:text-white truncate">
                                    {{ getEmployeeName(row.original) }}
                                </p>
                                <UIcon name="lucide:external-link" class="w-4 h-4 text-gray-400 shrink-0" />
                            </div>
                            <p class="text-sm text-gray-500 dark:text-gray-400">
                                {{ getAge(row.original) }} years old
                            </p>
                        </div>
                    </div>
                </template>

                <!-- Phone Number Column -->
                <template #phone_number-cell="{ row }">
                    <span class="text-sm whitespace-nowrap">{{ row.original.phone_number || 'N/A' }}</span>
                </template>

                <!-- Patient Number Column -->
                <template #patient_number-cell="{ row }">
                    <span class="text-sm whitespace-nowrap">{{ row.original.patient_number || 'N/A' }}</span>
                </template>

                <!-- Privileges Column -->
                <template #privileges-cell="{ row }">
                    <div class="flex flex-wrap gap-1">
                        <UBadge 
                            v-for="(priv, index) in getPrivilegesList(row.original.privileges)" 
                            :key="index"
                            :label="priv"
                            color="primary"
                            variant="soft"
                            size="xs"
                        />
                        <span v-if="!row.original.privileges" class="text-gray-500 dark:text-gray-400">N/A</span>
                    </div>
                </template>

                <!-- Languages Column -->
                <template #languages-cell="{ row }">
                    <div class="flex flex-wrap gap-1">
                        <UBadge 
                            v-for="(lang, index) in getLanguagesList(row.original.languages)" 
                            :key="index"
                            :label="lang"
                            color="gray"
                            variant="soft"
                            size="xs"
                        />
                        <span v-if="!row.original.languages" class="text-gray-500 dark:text-gray-400">N/A</span>
                    </div>
                </template>

                <!-- Designation Column -->
                <template #designation-cell="{ row }">
                    <span class="text-sm">{{ row.original.designation || 'N/A' }}</span>
                </template>

                <!-- Department Column -->
                <template #department-cell="{ row }">
                    <span class="text-sm">{{ row.original.department || 'N/A' }}</span>
                </template>

                <!-- Actions Column -->
                <template #View-cell="{ row }">
                    <div class="flex items-center gap-2">
                        <UButton 
                            variant="ghost" 
                            icon="lucide:eye"
                            size="sm"
                            @click="handleView(row.original)"
                        />
                        
                       
                    </div>
                </template>
                </UTable>
            </div>
        </UCard>

            <!-- New Employee Modal -->
            <EmployeeModal 
                v-model="addEmployeeModalOpen"
                @newCV="handleNewCV"
                @newProvisional="handleNewProvisional"
                @newEmployee="handleNewEmployee"
            />
        </template>
        
        <!-- Child Route Renderer -->
        <NuxtPage />
    </div>
</template>

<script setup>
import StaticCard from '~/components/common/StaticCard.vue'
import FilterCard from '~/components/common/FilterCard.vue'
import ProfileCard from '~/components/common/ProfileCard.vue'
import EmployeeModal from '~/components/common/EmployeeModal.vue'

const route = useRoute()
const isChildRoute = computed(() => route.path.includes('/employees/new'))

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
const addEmployeeModalOpen = ref(false)

// Summary Statistics
const summaryStats = computed(() => {
    const total = employees.value.length
    const withPrivileges = employees.value.filter(emp => emp.privileges && emp.privileges.trim()).length
    const withDesignation = employees.value.filter(emp => emp.designation && emp.designation.trim()).length
    
    return { total, withPrivileges, withDesignation }
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
    { accessorKey: 'phone_number', header: 'PHONE NUMBER' },
    { accessorKey: 'patient_number', header: 'PATIENT NUMBER' },
    { accessorKey: 'privileges', header: 'PRIVILEGES' },
    { accessorKey: 'department', header: 'DEPARTMENT' },
    { accessorKey: 'designation', header: 'DESIGNATION' },
    { accessorKey: 'languages', header: 'LANGUAGES' },
    { id: 'View', header: 'View' }
])

// Filtered Employees
const filteredEmployees = computed(() => {
    let filtered = employees.value

    // Quick search
    if (quickSearchQuery.value) {
        const query = quickSearchQuery.value.toLowerCase()
        filtered = filtered.filter(emp => {
            const name = getEmployeeName(emp).toLowerCase()
            const phone = (emp.phone_number || '').toLowerCase()
            const empId = (emp.employee_id || '').toString().toLowerCase()
            const patientNumber = (emp.patient_number || '').toLowerCase()
            return name.includes(query) || phone.includes(query) || empId.includes(query) || patientNumber.includes(query)
        })
    }

    // Advanced filters
    if (advancedFilters.value.employee_number) {
        filtered = filtered.filter(emp => 
            (emp.employee_id || '').toString().includes(advancedFilters.value.employee_number) ||
            (emp.patient_number || '').includes(advancedFilters.value.employee_number)
        )
    }

    if (advancedFilters.value.employee_name) {
        const query = advancedFilters.value.employee_name.toLowerCase()
        filtered = filtered.filter(emp => 
            getEmployeeName(emp).toLowerCase().includes(query)
        )
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
        const response = await $axios.get('/hrm/employee')
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
    const parts = [employee.first_name, employee.middle_name, employee.last_name]
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

const getTenure = (employee) => {
    if (!employee.date_of_joining) return 'N/A'
    const joinDate = new Date(employee.date_of_joining)
    const today = new Date()
    const years = today.getFullYear() - joinDate.getFullYear()
    const monthDiff = today.getMonth() - joinDate.getMonth()
    const actualYears = monthDiff < 0 || (monthDiff === 0 && today.getDate() < joinDate.getDate()) ? years - 1 : years
    const months = monthDiff < 0 ? 12 + monthDiff : monthDiff
    if (actualYears === 0) {
        return `${months} months`
    }
    return `${actualYears} year${actualYears > 1 ? 's' : ''}`
}

const getAvatarClass = (employee) => {
    const colors = ['bg-blue-500', 'bg-pink-500', 'bg-purple-500', 'bg-yellow-500', 'bg-green-500', 'bg-orange-500']
    const index = (employee.employee_id || 0) % colors.length
    return colors[index]
}

const getPrivilegesList = (privileges) => {
    if (!privileges) return []
    return privileges.split(',').map(p => p.trim()).filter(Boolean)
}

const getLanguagesList = (languages) => {
    if (!languages) return []
    return languages.split(',').map(l => l.trim()).filter(Boolean)
}

const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    if (Number.isNaN(date.getTime())) return dateString
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
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

const openAddEmployeeModal = () => {
    addEmployeeModalOpen.value = true
}

const router = useRouter()

const handleNewCV = () => {
    addEmployeeModalOpen.value = false
    nextTick(() => {
        router.push({ path: '/hrm/profile/employees/new', query: { type: 'newCV' } })
    })
}

const handleNewProvisional = () => {
    addEmployeeModalOpen.value = false
    nextTick(() => {
        router.push({ path: '/hrm/profile/employees/new', query: { type: 'newProvisional' } })
    })
}

const handleNewEmployee = () => {
    addEmployeeModalOpen.value = false
    nextTick(() => {
        router.push({ path: '/hrm/profile/employees/new', query: { type: 'newEmployee' } })
    })
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
