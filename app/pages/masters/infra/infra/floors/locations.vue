<template>
  <div class="w-full flex flex-col h-full">
    <UCard class="h-full flex flex-col">
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold">
            Locations
            <span v-if="selectedFloor" class="text-sm text-gray-500 font-normal">
              - {{ selectedFloor.floor_name || `Floor ${selectedFloor.floor_number || selectedFloor.id}` }}
            </span>
          </h2>
          <UButton
            v-if="selectedFloor"
            @click="isLocationModalOpen = true"
            icon="i-lucide:plus"
            label="New"
            color="info"
          />
        </div>
      </template>

      <template #default>
        <div class="overflow-y-auto h-full" style="max-height: calc(110vh - 20rem);">
          <div v-if="loading" class="p-8 text-center text-gray-500">
            <UIcon name="lucide:loader-2" class="w-8 h-8 mx-auto mb-2 animate-spin" />
            <p>Loading locations...</p>
          </div>
          <div v-else-if="error" class="p-8 text-center text-red-500">
            <UIcon name="lucide:alert-circle" class="w-8 h-8 mx-auto mb-2" />
            <p>{{ error }}</p>
          </div>
          <div v-else-if="locations.length > 0" class="p-4 space-y-4">
            <LocationCard
              v-for="location in locations"
              :key="location.id"
              :location="location"
              :is-selected="false"
              @edit="handleLocationEdit"
            />
          </div>
          <div v-else-if="selectedFloor" class="p-8 text-center">
            <UIcon name="lucide:map-pin" class="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
            <p class="text-gray-600 dark:text-gray-400 mb-2">No locations found</p>
            <p class="text-sm text-gray-500 dark:text-gray-500">Click "New" to add a location</p>
          </div>
          <div v-else class="p-8 text-center">
            <UIcon name="lucide:file-search" class="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
            <p class="text-gray-600 dark:text-gray-400 mb-2">No floor selected</p>
            <p class="text-sm text-gray-500 dark:text-gray-500">Select a floor from the list to view its locations</p>
          </div>
        </div>
      </template>
    </UCard>
  </div>

  <LocationEditModal
    v-model:open="isLocationModalOpen"
    :location="locationForModal"
    :floor="selectedFloor"
    :form-config="formConfig"
    @submit="handleLocationSubmit"
  />
</template>

<script setup>
import axios from 'axios';
import LocationCard from '../../../../../components/LocationCard.vue';
import LocationEditModal from '../../../../../components/LocationEditModal.vue';

definePageMeta({ layout: 'home' });

const route = useRoute();
const selectedFloor = inject('selectedFloor', ref(null));
const floors = inject('floors', ref([]));

const locations = ref([]);
const locationForModal = ref(null);
const loading = ref(false);
const error = ref(null);
const isLocationModalOpen = ref(false);
const formConfig = ref(null);

// Fetch form configuration for locations (if available)
const loadFormConfig = async () => {
  try {
    // Try to get form config for locations - adjust endpoint if different
    const response = await axios.get('http://13.200.174.164:3001/v1/masters/infra/form_locations').catch(() => null);
    if (response?.data?.success && response.data.form && Array.isArray(response.data.fields)) {
      const typeMap = {
        'TEXT': 'text',
        'NUMBER': 'number',
        'DATE': 'date',
        'DATETIME': 'date',
        'TEXTAREA': 'textarea',
        'DROPDOWN': 'select',
        'DROPDOWN_SEARCH': 'select',
        'CHECKBOX': 'checkbox',
        'RADIO': 'radio',
        'SWITCH': 'checkbox'
      };
      
      const transformedFields = response.data.fields.map(field => ({
        ...field,
        id: field.field_code || field.id,
        type: typeMap[field.data_type] || 'text',
        required: field.status_required || false,
        placeholder: field.placeholder || `Enter ${field.label?.toLowerCase() || field.field_code}`
      }));

      formConfig.value = {
        form: response.data.form,
        fields: transformedFields,
        fieldMap: response.data.fieldMap || {}
      };
    } else {
      // Create a simple form config if API doesn't provide one
      formConfig.value = {
        form: { form_name: 'Location Form' },
        fields: [
          {
            id: 'location',
            field_code: 'location',
            label: 'Location',
            type: 'text',
            data_type: 'TEXT',
            required: true,
            placeholder: 'Enter location'
          },
          {
            id: 'full_path',
            field_code: 'full_path',
            label: 'Full Path',
            type: 'text',
            data_type: 'TEXT',
            required: false,
            placeholder: 'Enter full path'
          },
          {
            id: 'location_type',
            field_code: 'location_type',
            label: 'Location Type',
            type: 'text',
            data_type: 'TEXT',
            required: false,
            placeholder: 'Enter location type'
          }
        ],
        fieldMap: {}
      };
    }
  } catch (err) {
    // Create default form config on error
    console.error('Failed to load location form config:', err);
    formConfig.value = {
      form: { form_name: 'Location Form' },
      fields: [
        {
          id: 'location',
          field_code: 'location',
          label: 'Location',
          type: 'text',
          data_type: 'TEXT',
          required: true,
          placeholder: 'Enter location'
        },
        {
          id: 'full_path',
          field_code: 'full_path',
          label: 'Full Path',
          type: 'text',
          data_type: 'TEXT',
          required: false,
          placeholder: 'Enter full path'
        },
        {
          id: 'location_type',
          field_code: 'location_type',
          label: 'Location Type',
          type: 'text',
          data_type: 'TEXT',
          required: false,
          placeholder: 'Enter location type'
        }
      ],
      fieldMap: {}
    };
  }
};

// Fetch locations from API
const loadLocations = async (floorId) => {
  if (!floorId) {
    locations.value = [];
    return;
  }

  loading.value = true;
  error.value = null;
  try {
    const response = await axios.get(`http://13.200.174.164:3001/v1/masters/infra/locations?floor_id=${floorId}`);
    const data = response.data;
    if (data.success && Array.isArray(data.locations)) {
      locations.value = data.locations;
    } else {
      error.value = 'Invalid response format from API';
    }
  } catch (err) {
    error.value = err.response?.data?.message || err.message || 'Failed to load locations';
  } finally {
    loading.value = false;
  }
};

const checkAndLoadLocations = () => {
  let floorId = selectedFloor.value?.id;
  
  if (!floorId && route.query.id && floors.value.length) {
    const floor = floors.value.find(f => f.id === Number.parseInt(route.query.id, 10));
    if (floor) {
      selectedFloor.value = floor;
      floorId = floor.id;
    }
  }
  
  if (floorId) {
    loadLocations(floorId);
  } else {
    locations.value = [];
  }
};

const handleLocationEdit = (location) => {
  locationForModal.value = location;
  isLocationModalOpen.value = true;
};

const handleNewLocation = () => {
  locationForModal.value = null;
  isLocationModalOpen.value = true;
};

const handleLocationSubmit = async () => {
  if (selectedFloor.value?.id) {
    await loadLocations(selectedFloor.value.id);
  }
};

onMounted(async () => {
  await loadFormConfig();
  checkAndLoadLocations();
});

onUpdated(() => {
  checkAndLoadLocations();
});
</script>

