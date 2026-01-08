<template>
    <div class="flex gap-5 justify-between">
        <OPDDoctors 
            :doctors="consultants"
            :show-add="false"
            :selected-id="selectedConsultant?.employee_id"
            :loading="loading"
            @select="selectConsultant"
        />
        
        <OPDPatients 
            :patients="patients"
            :show-add="false"
            :loading="loadingPatients"
        />
        
        <OPDAppointments 
            :appointments="todayAppointments"
            :show-add="false"
            :loading="loadingPatients"
        />
    </div>
</template>

<script setup>
import OPDDoctors from "~/components/opd/OPDDoctors.vue"
import OPDPatients from "~/components/opd/OPDPatients.vue"
import OPDAppointments from "~/components/opd/OPDAppointments.vue"

definePageMeta({ layout: 'home' })

const { $axios } = useNuxtApp()

const loading = ref(true)
const loadingPatients = ref(false)
const consultants = ref([])
const selectedConsultant = ref(null)
const patients = ref([])
const todayAppointments = ref([])

const getFullName = (employee) => {
    return [employee.first_name, employee.middle_name, employee.last_name]
        .filter(Boolean)
        .join(' ') || 'N/A'
}

const loadConsultants = async () => {
    loading.value = true
    try {
        const { data } = await $axios.get('/visits/opd_queue', {
            params: {
                consultants: true
            }
        })

        if (data?.success) {
            consultants.value = (data.consultants || []).map(consultant => ({
                ...consultant,
                employee_id: consultant.employee_id,
                doctor_name: getFullName(consultant)
            }))
        } else {
            consultants.value = []
        }
    } catch (err) {
        console.error('Error loading consultants:', err)
        consultants.value = []
    } finally {
        loading.value = false
    }
}

const loadPatientsAndAppointments = async (consultantId) => {
    loadingPatients.value = true
    try {
        const { data } = await $axios.get('/visits/opd_queue', {
            params: {
                consultants: true,
                patients: true,
                consultant_id: consultantId,
                appointments: true
            }
        })

        if (data?.success) {
            patients.value = data.patients || []
            todayAppointments.value = data.appointments || []
        } else {
            patients.value = []
            todayAppointments.value = []
        }
    } catch (err) {
        console.error('Error loading patients and appointments:', err)
        patients.value = []
        todayAppointments.value = []
    } finally {
        loadingPatients.value = false
    }
}

const selectConsultant = (consultant) => {
    selectedConsultant.value = consultant
    if (consultant?.employee_id) {
        loadPatientsAndAppointments(consultant.employee_id)
    }
}

onMounted(loadConsultants)
</script>
