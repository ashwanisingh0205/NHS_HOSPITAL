<template>
    <div class="flex h-screen bg-gray-50 dark:bg-gray-950">

        <!-- Left Sidebar - Consultants -->
        <aside class="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 overflow-y-auto" aria-label="Consultants list">
            <div class="p-4 border-b border-gray-200 dark:border-gray-800">
                <h2 class="font-semibold text-gray-900 dark:text-gray-100">
                    Doctors
                </h2>
            </div>

            <!-- Loading -->
            <div v-if="loading" class="p-4 space-y-2">
                <USkeleton v-for="i in 5" :key="i" class="h-10 w-full" />
            </div>

            <!-- Consultant Table -->
            <div v-else class="p-2">
                <UTable 
                    :data="consultants" 
                    :columns="consultantColumns"
                    class="text-sm"
                >
                    <template #doctor_name-cell="{ row }">
                        <div 
                            @click="selectConsultant(row.original)"
                            class="cursor-pointer font-medium text-gray-900 dark:text-gray-100 hover:text-primary transition-colors"
                            :class="selectedConsultant?.id === row.original.id ? 'text-primary font-semibold' : ''"
                        >
                            {{ row.original.doctor_name }}
                        </div>
                    </template>
                </UTable>
            </div>
        </aside>

        <!-- Main Content -->
        <div class="flex-1 flex flex-col overflow-hidden">
            <div class="flex-1 overflow-y-auto p-6">

                <!-- Patient Table -->
                <UCard v-if="!loading && filteredPatients.length">
                    <UTable :data="filteredPatients" :columns="patientColumns">
                        <template #id-cell="{ row }">
                            {{ row.original.id || '-' }}
                        </template>
                        <template #patient_name-cell="{ row }">
                            {{ row.original.patient_name || '-' }}
                        </template>
                        <template #action-cell="{ row }">
                            <UButton size="xs" variant="ghost" @click="viewPatient(row.original)">
                                View
                            </UButton>
                        </template>
                    </UTable>
                </UCard>

            </div>
        </div>

        <!-- Right Sidebar - Appointments -->
        <aside class="w-80 bg-white-100 dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col" aria-label="Appointments panel">
            <div class="p-4 border-b flex justify-between items-center">
                <h3 class="font-semibold">Apt.</h3>
                <UButton color="red" size="sm" @click="createAppointment">
                    Appointment
                </UButton>
            </div>

            <div class="flex-1 overflow-y-auto p-4">
                <div v-if="loading" class="text-center py-8">
                    <div class="animate-spin h-6 w-6 border-b-2 border-primary mx-auto rounded-full"></div>
                </div>

                <div v-else-if="!todayAppointments.length" class="text-center py-8 text-sm text-gray-500">
                    No Appointment for today
                </div>

                <div v-else class="space-y-3">
                    <UCard
                        v-for="(appointment, index) in todayAppointments"
                        :key="index"
                        class="cursor-pointer "
                        @click="viewAppointment(appointment)"
                    >
                        <div class="space-y-1">
                            <div class="font-semibold">{{ appointment.date }}</div>
                            <div class="text-sm text-gray-600 dark:text-gray-400">
                                {{ appointment.time }}
                            </div>
                            <div class="text-xs text-gray-500">
                                UHID: {{ appointment.uhid }}
                            </div>
                        </div>
                    </UCard>
                </div>
            </div>
        </aside>
    </div>
</template>

<script setup>
definePageMeta({ layout: 'home' })

const { $axios } = useNuxtApp()
const router = useRouter()

/* ------------------ State ------------------ */
const loading = ref(true)

const consultants = ref([])
const selectedConsultant = ref(null)

const patients = ref([])
const todayAppointments = ref([])

/* ------------------ Table Columns ------------------ */
const consultantColumns = [
    { accessorKey: 'doctor_name', header: 'Doctor Name' }
]

const patientColumns = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'patient_name', header: 'Patient Name' },
    { id: 'action' }
]

/* ------------------ Computed ------------------ */
const filteredPatients = computed(() => patients.value)

/* ------------------ Methods ------------------ */
const loadData = async () => {
    loading.value = true
    try {
        const { data } = await $axios.get('/visits/opd')

        if (data?.success) {
            // Map doctors to consultants
            consultants.value = (data.doctors || []).map(doctor => ({
                id: doctor.id,
                doctor_name: doctor.doctor_name || ''
            }))

            // Set first consultant as selected by default
            if (consultants.value.length > 0 && !selectedConsultant.value) {
                selectedConsultant.value = consultants.value[0]
            }

            // Map patients
            patients.value = data.patients || []

            // Map appointments
            todayAppointments.value = data.appointments || []
        }
    } catch (err) {
        console.error('Error loading OPD data:', err)
    } finally {
        loading.value = false
    }
}

/* ------------------ Actions ------------------ */
const selectConsultant = (consultant) => {
    selectedConsultant.value = consultant
}

const viewPatient = () => {}
const viewAppointment = () => {}
const createAppointment = () => router.push('/opd/appointment/create')
const goBack = () => router.back()
const registerPatient = () => router.push('/visit/registration')

/* ------------------ Lifecycle ------------------ */
onMounted(() => {
    loadData()
})
</script>
