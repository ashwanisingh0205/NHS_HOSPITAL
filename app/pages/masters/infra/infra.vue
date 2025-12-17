<template>
  <div class="flex gap-2 h-[calc(103vh-8rem)]">
    <!-- Block List Column (Left) -->
    <div class="w-1/3 min-w-0 flex flex-col h-full">
      <UCard class="h-full flex flex-col">
        <template #header>
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold">Block List</h2>
            <UButton
              @click="handleNewBlock"
              icon="i-lucide:plus"
              label="New"
              color="info"
            />
          </div>
          <!-- Search Input -->
          <div class="mt-4">
            <UInput
              v-model="searchQuery"
              placeholder="Search blocks..."
              icon="i-lucide:search"
              class="w-full"
              @input="handleSearch"
            />
          </div>
        </template>

        <template #default>
          <div class="overflow-y-auto h-full" style="max-height: calc(110vh - 20rem);">
            <div v-if="loading" class="p-4 text-center text-gray-500">
              Loading blocks...
            </div>
            <div v-else-if="error" class="p-4 text-center text-red-500">
              {{ error }}
            </div>
            <div v-else-if="filteredBlocks.length === 0" class="p-4 text-center text-gray-500">
              No blocks found
            </div>
            <div v-else class="p-4 space-y-4">
              <BlockCard
                v-for="block in filteredBlocks"
                :key="block.id"
                :block="block"
                :is-selected="selectedBlock?.id === block.id"
                @view="handleBlockView"
                @edit="handleBlockEdit"
              />
            </div>
          </div>
        </template>
      </UCard>
    </div>

    <!-- Right Column (for future use) -->
    <div class="flex-1 min-w-0 flex flex-col h-full">
      <!-- Can add nested pages here later -->
    </div>
  </div>

  <BlockEditModal
    v-model:open="isModalOpen"
    :block="blockForModal"
    :form-config="formConfig"
    @submit="handleBlockSubmit"
  />
</template>

<script setup>
import axios from 'axios';

definePageMeta({ layout: 'home' });

const isModalOpen = ref(false);
const selectedBlock = ref(null);
const blockForModal = ref(null);
const blocks = ref([]);
const loading = ref(false);
const error = ref(null);
const searchQuery = ref('');
const formConfig = ref(null);

const route = useRoute();

// Fetch form configuration for blocks
const loadFormConfig = async () => {
  try {
    const response = await axios.get('http://13.200.174.164:3001/v1/masters/infra/form_blocks');
    const data = response.data;
    if (data.success && data.form && Array.isArray(data.fields)) {
      // Transform fields to work with DynamicForm
      const transformedFields = data.fields.map(field => {
        // Map data_type to type for Wrapper component
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
        
        return {
          ...field,
          id: field.field_code || field.id, // Use field_code as id
          type: typeMap[field.data_type] || 'text',
          required: field.status_required || false,
          placeholder: field.placeholder || `Enter ${field.label?.toLowerCase() || field.field_code}`
        };
      });

      formConfig.value = {
        form: data.form,
        fields: transformedFields,
        fieldMap: data.fieldMap || {}
      };
    }
  } catch (err) {
    console.error('Failed to load form config:', err);
  }
};

// Fetch blocks from API
const loadBlocks = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await axios.get('http://13.200.174.164:3001/v1/masters/infra/blocks');
    const data = response.data;
    if (data.success && Array.isArray(data.block)) {
      blocks.value = data.block;
    } else {
      error.value = 'Invalid response format from API';
    }
  } catch (err) {
    error.value = err.response?.data?.message || err.message || 'Failed to load blocks';
  } finally {
    loading.value = false;
  }
};

// Filter blocks based on search query
const filteredBlocks = computed(() => {
  if (!searchQuery.value.trim()) {
    return blocks.value;
  }
  const query = searchQuery.value.toLowerCase();
  return blocks.value.filter(block => 
    block.block_name?.toLowerCase().includes(query)
  );
});

const handleSearch = () => {
  // Search is handled by computed property
};

const handleBlockView = (block) => {
  selectedBlock.value = block;
  // Can navigate to nested route here if needed
};

const handleBlockEdit = (block) => {
  selectedBlock.value = block;
  blockForModal.value = block;
  isModalOpen.value = true;
};

const handleNewBlock = () => {
  blockForModal.value = null;
  isModalOpen.value = true;
};

const handleBlockSubmit = async () => {
  await loadBlocks();
};

// Load form config and blocks on mount
onMounted(async () => {
  await loadFormConfig();
  await loadBlocks();
});
</script>
