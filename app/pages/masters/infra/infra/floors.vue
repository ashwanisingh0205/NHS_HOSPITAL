<template>
  <div class="flex gap-2 h-[calc(103vh-8rem)]">
    <!-- Floor List Column (Left) -->
    <div class="w-1/3 min-w-0 flex flex-col h-full">
      <UCard class="h-full flex flex-col">
        <template #header>
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold">
              Floors
              <span v-if="selectedBlock" class="text-sm text-gray-500 font-normal">
                - {{ selectedBlock.block_name }}
              </span>
            </h2>
            <UButton
              v-if="selectedBlock"
              @click="isFloorModalOpen = true"
              icon="i-lucide:plus"
              label="New"
              color="info"
            />
          </div>
          <!-- Search Input -->
          <div class="mt-4">
            <UInput
              v-model="searchQuery"
              placeholder="Search floors..."
              icon="i-lucide:search"
              class="w-full"
              @input="handleSearch"
            />
          </div>
        </template>

        <template #default>
          <div class="overflow-y-auto h-full" style="max-height: calc(110vh - 20rem);">
            <div v-if="loading" class="p-4 text-center text-gray-500">
              Loading floors...
            </div>
            <div v-else-if="error" class="p-4 text-center text-red-500">
              {{ error }}
            </div>
            <div v-else-if="!selectedBlock" class="p-4 text-center text-gray-500">
              Select a block to view floors
            </div>
            <div v-else-if="filteredFloors.length === 0" class="p-4 text-center text-gray-500">
              No floors found
            </div>
            <div v-else class="p-4 space-y-4">
              <FloorCard
                v-for="floor in filteredFloors"
                :key="floor.id"
                :floor="floor"
                :is-selected="selectedFloor?.id === floor.id"
                @view="handleFloorView"
                @edit="handleFloorEdit"
              />
            </div>
          </div>
        </template>
      </UCard>
    </div>

    <!-- Locations Column (Right) -->
    <div class="flex-1 min-w-0 flex flex-col h-full">
      <NuxtPage />
    </div>
  </div>

  <FloorEditModal
    v-model:open="isFloorModalOpen"
    :floor="floorForModal"
    :block="selectedBlock"
    :form-config="formConfig"
    @submit="handleFloorSubmit"
  />
</template>

<script setup>
import axios from 'axios';
import FloorCard from '../../../../components/FloorCard.vue';
import FloorEditModal from '../../../../components/FloorEditModal.vue';

definePageMeta({ layout: 'home' });

const route = useRoute();
const selectedBlock = inject('selectedBlock', ref(null));
const blocks = inject('blocks', ref([]));

const floors = ref([]);
const selectedFloor = ref(null);
const floorForModal = ref(null);
const loading = ref(false);
const error = ref(null);
const searchQuery = ref('');
const isFloorModalOpen = ref(false);
const formConfig = ref(null);

// Fetch form configuration for floors (if available)
const loadFormConfig = async () => {
  try {
    // Try to get form config for floors - adjust endpoint if different
    const response = await axios.get('http://13.200.174.164:3001/v1/masters/infra/form_floors').catch(() => null);
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
        form: { form_name: 'Floor Form' },
        fields: [
          {
            id: 'floor_name',
            field_code: 'floor_name',
            label: 'Floor Name',
            type: 'text',
            data_type: 'TEXT',
            required: true,
            placeholder: 'Enter floor name'
          },
          {
            id: 'floor_code',
            field_code: 'floor_code',
            label: 'Floor Code',
            type: 'text',
            data_type: 'TEXT',
            required: false,
            placeholder: 'Enter floor code'
          },
          {
            id: 'floor_number',
            field_code: 'floor_number',
            label: 'Floor Number',
            type: 'number',
            data_type: 'NUMBER',
            required: false,
            placeholder: 'Enter floor number'
          }
        ],
        fieldMap: {}
      };
    }
  } catch (err) {
    // Create default form config on error
    console.error('Failed to load floor form config:', err);
    formConfig.value = {
      form: { form_name: 'Floor Form' },
      fields: [
        {
          id: 'floor_name',
          field_code: 'floor_name',
          label: 'Floor Name',
          type: 'text',
          data_type: 'TEXT',
          required: true,
          placeholder: 'Enter floor name'
        },
        {
          id: 'floor_code',
          field_code: 'floor_code',
          label: 'Floor Code',
          type: 'text',
          data_type: 'TEXT',
          required: false,
          placeholder: 'Enter floor code'
        },
        {
          id: 'floor_number',
          field_code: 'floor_number',
          label: 'Floor Number',
          type: 'number',
          data_type: 'NUMBER',
          required: false,
          placeholder: 'Enter floor number'
        }
      ],
      fieldMap: {}
    };
  }
};

// Fetch floors from API
const loadFloors = async (blockId) => {
  if (!blockId) {
    floors.value = [];
    return;
  }

  loading.value = true;
  error.value = null;
  try {
    const response = await axios.get(`http://13.200.174.164:3001/v1/masters/infra/floors?block_id=${blockId}`);
    const data = response.data;
    if (data.success && Array.isArray(data.floors)) {
      floors.value = data.floors;
    } else {
      error.value = 'Invalid response format from API';
    }
  } catch (err) {
    error.value = err.response?.data?.message || err.message || 'Failed to load floors';
  } finally {
    loading.value = false;
  }
};

// Filter floors based on search query
const filteredFloors = computed(() => {
  if (!searchQuery.value.trim()) {
    return floors.value;
  }
  const query = searchQuery.value.toLowerCase();
  return floors.value.filter(floor => 
    floor.floor_name?.toLowerCase().includes(query) ||
    floor.floor_code?.toLowerCase().includes(query)
  );
});

const handleSearch = () => {
  // Search is handled by computed property
};

// Provide floors data to child pages via provide/inject
provide('floors', floors);
provide('selectedFloor', selectedFloor);

const handleFloorView = (floor) => {
  selectedFloor.value = floor;
  // Navigate to nested route for locations
  navigateTo({
    path: '/masters/infra/infra/floors/locations',
    query: { id: floor.id.toString() }
  });
};

const handleFloorEdit = (floor) => {
  selectedFloor.value = floor;
  floorForModal.value = floor;
  isFloorModalOpen.value = true;
};

const handleNewFloor = () => {
  floorForModal.value = null;
  isFloorModalOpen.value = true;
};

const handleFloorSubmit = async () => {
  if (selectedBlock.value?.id) {
    await loadFloors(selectedBlock.value.id);
  }
};

const checkAndLoadFloors = () => {
  let blockId = selectedBlock.value?.id;
  
  if (!blockId && route.query.id && blocks.value.length) {
    const block = blocks.value.find(b => b.id === Number.parseInt(route.query.id, 10));
    if (block) {
      selectedBlock.value = block;
      blockId = block.id;
    }
  }
  
  if (blockId) {
    loadFloors(blockId);
  } else {
    floors.value = [];
  }
};

onMounted(async () => {
  await loadFormConfig();
  checkAndLoadFloors();
});

onUpdated(() => {
  checkAndLoadFloors();
});
</script>
