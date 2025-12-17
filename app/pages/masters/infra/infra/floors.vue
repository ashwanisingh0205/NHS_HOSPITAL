<template>
  <div class="w-full flex flex-col">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
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
      </template>

      <template #default>
        <div v-if="loading" class="p-8 text-center text-gray-500">
          <UIcon name="lucide:loader-2" class="w-8 h-8 mx-auto mb-2 animate-spin" />
          <p>Loading floors...</p>
        </div>
        <div v-else-if="error" class="p-8 text-center text-red-500">
          <UIcon name="lucide:alert-circle" class="w-8 h-8 mx-auto mb-2" />
          <p>{{ error }}</p>
        </div>
        <div v-else-if="floors.length > 0" class="p-4 space-y-4">
          <FloorCard
            v-for="floor in floors"
            :key="floor.id"
            :floor="floor"
            :is-selected="false"
            @edit="handleFloorEdit"
          />
        </div>
        <div v-else-if="selectedBlock" class="p-8 text-center">
          <UIcon name="lucide:building" class="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
          <p class="text-gray-600 dark:text-gray-400 mb-2">No floors found</p>
          <p class="text-sm text-gray-500 dark:text-gray-500">Click "New" to add a floor</p>
        </div>
        <div v-else class="p-8 text-center">
          <UIcon name="lucide:file-search" class="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
          <p class="text-gray-600 dark:text-gray-400 mb-2">No block selected</p>
          <p class="text-sm text-gray-500 dark:text-gray-500">Select a block from the list to view its floors</p>
        </div>
      </template>
    </UCard>
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
const floorForModal = ref(null);
const loading = ref(false);
const error = ref(null);
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

const handleFloorEdit = (floor) => {
  floorForModal.value = floor;
  isFloorModalOpen.value = true;
};

const handleFloorSubmit = async () => {
  if (selectedBlock.value?.id) {
    await loadFloors(selectedBlock.value.id);
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

