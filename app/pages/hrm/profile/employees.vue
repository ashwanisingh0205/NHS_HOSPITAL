<!--
List of employees
    Filter by Clinical Department, designations, Unit, Full-time/Part-time/Contract
    
-->
<template>
    <div class="p-4 space-y-6">
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

                <!-- Right Side: Quick Search and Today's Birthdays -->
                <div class="lg:col-span-1 space-y-4">
                    <FilterCard 
                        :filterData="filterData"
                        @search="quickSearchQuery = $event"
                        @filter="advancedFilters = $event"
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
                        >
                            <ProfileCard 
                                v-for="employee in todayBirthdays" 
                                :key="employee.employee_id"
                                :employee="employee"
                            />
                            <div v-if="!todayBirthdays.length" class="text-center py-8 text-gray-500 w-full">
                                No birthdays today
                            </div>
                        </div>
                    </UCard>
                </div>
            </div>

            
            <CKCardList>
                <UTable
                    :loading="loading"
                    :data="filteredEmployees"
                    :columns="columns"
                    class="min-w-full">
                    
                    <template #loading>
                        <CKLoader />
                    </template>
                    <template #empty>
                        <UError :error="{ statusMessage: error || 'No Record Found!!' }" />
                    </template>
                    
                    <template #View-cell="{ row }">
                        <UButton
                            variant="ghost"
                            icon="lucide:eye"
                            size="sm"
                            @click="navigateTo(`/hrm/profile/employees/${row.original.employee_id}`)"
                        />
                    </template>
                    
                </UTable>
                
            </CKCardList>
            
            
            <!-- Employee Table -->
            <UCard>
                <template #header>
                    <div class="flex items-center justify-between">
                        <div class="text-lg font-semibold">Employee List</div>
                        <UButton 
                            icon="lucide:plus" 
                            variant="solid" 
                            color="primary" 
                            size="sm" 
                            @click="addEmployeeModalOpen = true"
                        >
                            Add Employee
                        </UButton>
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
                                    :class="getAvatarClass(row.original.employee_id)"
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

                        <!-- Simple Text Columns -->
                        <template #phone_number-cell="{ row }">
                            <span class="text-sm whitespace-nowrap">{{ row.original.phone_number || 'N/A' }}</span>
                        </template>

                        <template #patient_number-cell="{ row }">
                            <span class="text-sm whitespace-nowrap">{{ row.original.patient_number || 'N/A' }}</span>
                        </template>

                        <template #designation-cell="{ row }">
                            <span class="text-sm">{{ row.original.designation || 'N/A' }}</span>
                        </template>

                        <template #department-cell="{ row }">
                            <span class="text-sm">{{ row.original.department || 'N/A' }}</span>
                        </template>

                        <!-- Badge Columns -->
                        <template #privileges-cell="{ row }">
                            <div class="flex flex-wrap gap-1">
                                <UBadge 
                                    v-for="(priv, index) in splitCommaString(row.original.privileges)" 
                                    :key="index"
                                    :label="priv"
                                    color="primary"
                                    variant="soft"
                                    size="xs"
                                />
                                <span v-if="!row.original.privileges" class="text-gray-500 dark:text-gray-400">N/A</span>
                            </div>
                        </template>

                        <template #languages-cell="{ row }">
                            <div class="flex flex-wrap gap-1">
                                <UBadge 
                                    v-for="(lang, index) in splitCommaString(row.original.languages)" 
                                    :key="index"
                                    :label="lang"
                                    color="gray"
                                    variant="soft"
                                    size="xs"
                                />
                                <span v-if="!row.original.languages" class="text-gray-500 dark:text-gray-400">N/A</span>
                            </div>
                        </template>

                        <!-- Actions Column -->
                        <template #View-cell="{ row }">
                            <UButton 
                                variant="ghost" 
                                icon="lucide:eye"
                                size="sm"
                                @click="navigateTo(`/hrm/profile/employees/${row.original.employee_id}`)"
                            />
                        </template>
                    </UTable>
                </div>
            </UCard>

            <!-- New Employee Modal -->
            <EmployeeModal 
                v-model="addEmployeeModalOpen"
                @newCV="navigateToNew('newCV')"
                @newProvisional="navigateToNew('newProvisional')"
                @newEmployee="navigateToNew('newEmployee')"
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
import CKCardList from "~/components/common/CKCardList.vue";
import CKLoader from "~/components/common/CKLoader.vue";

definePageMeta({
    layout: 'home'
})

const route = useRoute()
const router = useRouter()
const { $axios } = useNuxtApp()

// State
const loading = ref(true)
const error = ref(null)
const employees = ref([])
const filterData = ref({})
const quickSearchQuery = ref('')
const advancedFilters = ref({})
const addEmployeeModalOpen = ref(false)
const birthdaysContainer = ref(null)

// Computed
const isChildRoute = computed(() => route.path.includes('/employees/new'))

const summaryStats = computed(() => ({
    total: employees.value.length,
    withPrivileges: employees.value.filter(emp => emp.privileges?.trim()).length,
    withDesignation: employees.value.filter(emp => emp.designation?.trim()).length
}))

const todayBirthdays = computed(() => {
    const today = new Date()
    const todayMonth = today.getMonth()
    const todayDay = today.getDate()
    
    return employees.value
        .filter(emp => {
            if (!emp.date_of_birth) return false
            const dob = new Date(emp.date_of_birth)
            return dob.getMonth() === todayMonth && dob.getDate() === todayDay
        })
        .slice(0, 4)
})

const filteredEmployees = computed(() => {
    let filtered = employees.value

    // Quick search
    if (quickSearchQuery.value) {
        const query = quickSearchQuery.value.toLowerCase()
        filtered = filtered.filter(emp => {
            const searchFields = [
                getEmployeeName(emp),
                emp.phone_number,
                emp.employee_id?.toString(),
                emp.patient_number
            ].map(field => (field || '').toLowerCase())
            
            return searchFields.some(field => field.includes(query))
        })
    }

    // Advanced filters
    if (advancedFilters.value.employee_number) {
        const num = advancedFilters.value.employee_number
        filtered = filtered.filter(emp => 
            emp.employee_id?.toString().includes(num) ||
            emp.patient_number?.includes(num)
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

// Table Columns
const columns = [
    { accessorKey: 'employee_info', header: 'EMPLOYEE INFO' },
    { accessorKey: 'phone_number', header: 'PHONE NUMBER' },
    { accessorKey: 'patient_number', header: 'PATIENT NUMBER' },
    { accessorKey: 'privileges', header: 'PRIVILEGES' },
    { accessorKey: 'department', header: 'DEPARTMENT' },
    { accessorKey: 'designation', header: 'DESIGNATION' },
    { accessorKey: 'languages', header: 'LANGUAGES' },
    { id: 'View', header: 'View' }
]

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
    let age = today.getFullYear() - dob.getFullYear()
    const monthDiff = today.getMonth() - dob.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--
    }
    return age
}

const getAvatarClass = (employeeId) => {
    const colors = ['bg-blue-500', 'bg-pink-500', 'bg-purple-500', 'bg-yellow-500', 'bg-green-500', 'bg-orange-500']
    return colors[(employeeId || 0) % colors.length]
}

const splitCommaString = (str) => {
    if (!str) return []
    return str.split(',').map(s => s.trim()).filter(Boolean)
}

const scrollBirthdays = (direction) => {
    if (birthdaysContainer.value) {
        const scrollAmount = direction === 'right' ? 220 : -220
        birthdaysContainer.value.scrollLeft += scrollAmount
    }
}

const navigateToNew = (type) => {
    addEmployeeModalOpen.value = false
    nextTick(() => {
        router.push({ path: '/hrm/profile/employees/new', query: { type } })
    })
}

// API Calls
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

const loadEmployees = async () => {
    loading.value = true
    error.value = null
    try {
        const response = await $axios.get('/hrm/employee')
        if (response.data.success && Array.isArray(response.data.employees)) {
            employees.value = response.data.employees
        } else {
            error.value = 'Invalid response format from API'
        }
    } catch (err) {
        error.value = err.response?.data?.message || err.message || 'Failed to load employees'
    } finally {
        loading.value = false
    }
}

// Lifecycle
onMounted(() => {
    Promise.all([loadFilterData(), loadEmployees()])
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
