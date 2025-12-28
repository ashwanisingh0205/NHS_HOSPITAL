<template>
    <div class="flex gap-2">
        <div class="w-full">
            <CKCardList :loading="loading" :title="title" @handleAdd="handleAdd" v-model="searchQuery">
                <UTable :loading="loading" :data="filteredDetails" :columns="columns">
                    <template v-if="!loading" #empty>
                        <UError :error="{ statusMessage: error || 'No Record Found!!' }" />
                    </template>
                    <template #id-cell="{ row }">
                        {{ filteredDetails.findIndex(f => f.id === row.original.id) + 1 }}
                    </template>
                    <template #action-cell="{ row }">
                        <div class="text-end">
                            <CKEdit @click="handleEdit(row)" />
                        </div>
                    </template>
                </UTable>
            </CKCardList>
        </div>
    </div>
    
    <UModal v-model:open="formModel" :title="modalTitle">
        <template #body>
            <DynamicForm
                :key="formResetKey"
                :staticForm="staticFormConfig"
                @submit="handleFormSubmit"
            />
        </template>
    </UModal>
</template>

<script setup>
import DynamicForm from "~/components/emr/DynamicForm.vue";
import CKEdit from "~/components/common/CKEdit.vue";
import CKCardList from "~/components/common/CKCardList.vue";

definePageMeta({ layout: 'home' });

const { $axios } = useNuxtApp();
const route = useRoute();
const selectedChoice = inject('selectedChoice', ref(null));

// Debug: Log route and selectedChoice
watch(() => route.query.id, (id) => {
    console.log('Route query id changed:', id);
}, { immediate: true });

watch(() => selectedChoice.value, (choice) => {
    console.log('Selected choice changed:', choice);
}, { immediate: true });

// State
const details = ref([]);
const formModel = ref(false);
const formResetKey = ref(0);
const loading = ref(false);
const error = ref(null);
const editingDetail = ref(null);
const searchQuery = ref('');

// Computed
const title = computed(() => 
    selectedChoice.value ? `Choice Details - ${selectedChoice.value.choice_name}` : "Choice Details"
);

const modalTitle = computed(() => editingDetail.value ? "Edit Choice Detail" : "New Choice Detail");

const columns = [
    { accessorKey: 'id', header: 'Sr.No.' },
    { accessorKey: 'choice_title', header: 'Choice Title' },
    { accessorKey: 'choice_data', header: 'Choice Data' },
    { id: 'action' }
];

const staticFormConfig = computed(() => {
    const data = editingDetail.value || { 
        choice_id: selectedChoice.value?.id,
        corporate_id: 1,
        unit_id: 1
    };
    
    return {
        fields: [
            { id: 'corporate_id', field_code: 'corporate_id', data_type: 'NUMBER', label: 'Corporate ID', value: [data.corporate_id ?? 1], required: true },
            { id: 'unit_id', field_code: 'unit_id', data_type: 'NUMBER', label: 'Unit ID', value: [data.unit_id ?? 1], required: true },
            { id: 'choice_id', field_code: 'choice_id', data_type: 'NUMBER', label: 'Choice ID', value: [data.choice_id], required: true },
            { id: 'choice_title', field_code: 'choice_title', data_type: 'TEXT', label: 'Choice Title', value: [data.choice_title || ''], required: true },
            { id: 'choice_data', field_code: 'choice_data', data_type: 'TEXT', label: 'Choice Data', value: [data.choice_data || ''], required: true }
        ]
    };
});

const filteredDetails = computed(() => {
    if (!searchQuery.value.trim()) return details.value;
    
    const query = searchQuery.value.toLowerCase();
    return details.value.filter(d => 
        d.choice_title?.toLowerCase().includes(query) || 
        d.choice_data?.toLowerCase().includes(query)
    );
});

// Methods
const loadChoiceDetails = async () => {
    const choiceId = route.query.id || selectedChoice.value?.id;
    if (!choiceId) {
        console.warn('No choice ID found. Route query:', route.query, 'Selected choice:', selectedChoice.value);
        return;
    }
    
    loading.value = true;
    error.value = null;
    
    try {
        console.log('Loading choice details for choice_id:', choiceId);
        const { data } = await $axios.get('/masters/forms/choice_details', {
            params: { choice_id: Number(choiceId) }
        });
        
        console.log('Choice details API response:', data);
        
        // API returns { success: true, message: "success", choice_details: [...] }
        if (data.success && Array.isArray(data.choice_details)) {
            details.value = data.choice_details;
        } else if (Array.isArray(data.choice_details)) {
            // Fallback: use choice_details even if success is false
            details.value = data.choice_details;
        } else {
            // Try other possible structures as fallback
            details.value = data.choices || data.rows || data.data || [];
        }
        
        console.log('Parsed details array:', details.value);
        
        if (details.value.length === 0) {
            console.warn('No choice details found for choice_id:', choiceId);
        }
    } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to load choice details';
        error.value = errorMessage;
        console.error('Error loading choice details:', err);
        console.error('Error response:', err.response?.data);
        console.error('Error status:', err.response?.status);
        console.error('Request URL:', err.config?.url);
        console.error('Request params:', err.config?.params);
        details.value = [];
    } finally {
        loading.value = false;
    }
};

const handleAdd = () => {
    editingDetail.value = null;
    formResetKey.value++;
    formModel.value = true;
};

const handleEdit = (row) => {
    editingDetail.value = row.original;
    formResetKey.value++;
    formModel.value = true;
};

const handleFormSubmit = async (submitData) => {
    if (submitData?.error) return;
    
    try {
        const payload = submitData.payload;
        
        console.log('Choice detail submit payload:', payload);
        
        if (editingDetail.value) {
            // PATCH request for editing
            const patchPayload = {
                ...payload,
                corporate_id: Number(payload.corporate_id),
                unit_id: Number(payload.unit_id),
                choice_id: Number(payload.choice_id)
            };
            console.log('PATCH payload:', patchPayload);
            
            const response = await $axios.patch('/masters/forms/choice_details', patchPayload, {
                params: { id: editingDetail.value.id }
            });
            
            console.log('PATCH response:', response.data);
        } else {
            // POST request for creating
            const postPayload = {
                corporate_id: Number(payload.corporate_id),
                unit_id: Number(payload.unit_id),
                choice_id: Number(payload.choice_id),
                choice_title: payload.choice_title,
                choice_data: payload.choice_data
            };
            console.log('POST payload:', postPayload);
            
            await $axios.post('/masters/forms/choice_details', postPayload);
        }
        
        formModel.value = false;
        await loadChoiceDetails();
    } catch (err) {
        console.error('Choice detail submit error:', err);
        alert(err.response?.data?.message || 'Failed to submit choice detail');
    }
};

watch(() => route.query.id, loadChoiceDetails);
watch(() => selectedChoice.value?.id, loadChoiceDetails);

onMounted(loadChoiceDetails);
</script>

