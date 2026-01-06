<template>
    <div class="flex gap-5 justify-between">
        
        <CKLoader v-if="loading" />
        
        <UCard class="w-1/3" v-if="!loading">
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
        </UCard>
        
        <UCard class="w-full" v-if="!loading">
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
        
        <UCard class="w-1/3" v-if="!loading">
            <UTable :data="todayAppointments" >
            </UTable>
        </UCard>
        
        
    </div>
</template>

<script setup>
import CKLoader from "~/components/common/CKLoader.vue";

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
