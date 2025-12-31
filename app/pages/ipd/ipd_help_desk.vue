<template>
    <div class="space-y-4">
        <!-- Search Bar -->
        <div class="flex items-center gap-2">
            <UInput
                v-model="searchQuery"
                placeholder="Search patient by... name, bed number"
                icon="i-heroicons-magnifying-glass"
                class="flex-1"
            />
           
        </div>

        <!-- Filter Tags -->
        <div class="flex flex-wrap gap-2">
            <UBadge
                v-for="tag in filterTags"
                :key="tag"
                :variant="selectedTags.includes(tag) ? 'solid' : 'soft'"
                :color="selectedTags.includes(tag) ? 'primary' : 'gray'"
                class="cursor-pointer border"
                @click="toggleTag(tag)"
            >
                {{ tag }}
            </UBadge>
        </div>

        <!-- Patient Cards Grid -->
        <div v-if="loading" class="flex justify-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>

        <div v-else-if="filteredPatients.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <UCard
                v-for="patient in filteredPatients"
                :key="patient.id"
                class="relative cursor-pointer"
            >
                <template #header>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <h3 class="font-semibold text-lg">{{ patient.patient_name }}</h3>
                        </div>
                    </div>
                </template>

                <div class="space-y-2">
                    <div class="flex items-center justify-between">
                        <span class="text-sm font-medium text-gray-600 dark:text-gray-400">
                            {{ patient.location_name }}
                        </span>
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-500">
                        UHID: {{ patient.UHID }}
                    </div>
                </div>
            </UCard>
        </div>

    </div>
</template>

<script setup>
definePageMeta({
    layout: 'home'
})

const { $axios } = useNuxtApp()

const searchQuery = ref('')
const selectedTags = ref(['All'])
const loading = ref(false)
const patients = ref([])
const filterTags = ref(['All'])

/* ------------------ Load Data ------------------ */
const loadData = async () => {
    loading.value = true
    try {
        const response = await $axios.get('/visits/ipd')
        
        if (response.data.success) {
            // Map bed data to patients
            patients.value = (response.data.bed || []).map(bed => ({
                id: bed.id,
                patient_name: bed.patient_name || '',
                location_name: bed.location_name || '',
                UHID: bed.UHID || ''
            }))
            
            // Generate filter tags from wards (unique ward names)
            const uniqueWards = [...new Set((response.data.wards || []).map(w => w.ward_name).filter(Boolean))]
            filterTags.value = ['All', ...uniqueWards]
        }
    } catch (err) {
        console.error('Error loading IPD data:', err)
    } finally {
        loading.value = false
    }
}

/* ------------------ Computed ------------------ */
const filteredPatients = computed(() => {
    return patients.value.filter(patient => {
        // Search filter
        const matchesSearch = !searchQuery.value.trim() ||
            patient.patient_name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            patient.location_name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            patient.UHID?.includes(searchQuery.value)

        // Tag filter - filter by ward name
        const matchesTags = selectedTags.value.includes('All') ||
            selectedTags.value.some(tag => {
                // Check if ward name appears in location_name
                return patient.location_name?.toLowerCase().includes(tag.toLowerCase())
            })

        return matchesSearch && matchesTags
    })
})

/* ------------------ Methods ------------------ */
const toggleTag = (tag) => {
    if (tag === 'All') {
        selectedTags.value = ['All']
        return
    }
    
    const tags = selectedTags.value.filter(t => t !== 'All')
    const hasTag = tags.includes(tag)
    
    selectedTags.value = hasTag 
        ? tags.filter(t => t !== tag)
        : [...tags, tag]
    
    if (selectedTags.value.length === 0) {
        selectedTags.value = ['All']
    }
}

/* ------------------ Lifecycle ------------------ */
onMounted(() => {
    loadData()
})


</script>