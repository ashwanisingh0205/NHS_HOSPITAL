<template>
    <div class="flex gap-2">
        <div class="w-1/2">
            <CKCardList :loading="loading" :title="title" @handleAdd="handleAdd" v-model="searchQuery">
                <UTable :loading="loading" :data="filteredData" :columns="columns">
                    <template v-if="!loading" #empty>
                        <UError :error="{ statusMessage: error || 'No Record Found!!' }" />
                    </template>
                    <template #id-cell="{ row }">
                        {{ filteredData.findIndex(f => f.id === row.original.id) + 1 }}
                    </template>
                    <template #form_name-cell="{ row }">
                        <ULink :to="{ name: 'masters-forms-form_builder-forms-form_fields', query: { id: row.original.id } }" class="cursor-pointer">
                            {{ row.original.form_name }}
                        </ULink>
                    </template>
                    <template #action-cell="{ row }">
                        <div class="text-end">
                            <CKEdit @click="handleEdit(row)" />
                        </div>
                    </template>
                </UTable>
            </CKCardList>
        </div>
        <NuxtPage :key="$route.fullPath" />
    </div>
    
    <UModal v-model:open="formModel" :title="modalTitle">
        <template #body>
            <DynamicForm
                :key="formResetKey"
                :staticForm="staticFormConfig"
                :params="params"
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
const title = ref("Form List");
const endPoint = "/masters/forms/form";

// State
const loading = ref(true);
const error = ref(null);
const data = ref([]);
const searchQuery = ref('');
const formModel = ref(false);
const params = ref(null);
const formData = ref(null);
const formResetKey = ref(0);

// Computed
const modalTitle = computed(() => params.value?.id ? "Edit Form" : "New Form");

const columns = [
    { accessorKey: 'id', header: 'Sr.No.' },
    { accessorKey: 'form_name', header: 'Form Name' },
    { id: 'action' }
];

const filteredData = computed(() => {
    if (!searchQuery.value.trim()) return data.value;
    const query = searchQuery.value.toLowerCase();
    return data.value.filter(form =>
        form.form_name?.toLowerCase().includes(query) ||
        form.form_code?.toLowerCase().includes(query)
    );
});

const staticFormConfig = computed(() => {
    const initialData = (params.value?.id && formData.value) ? formData.value : {};
    return {
        fields: [
            { id: 'corporate_id', field_code: 'corporate_id', data_type: 'NUMBER', label: 'Corporate ID', value: [initialData.corporate_id ?? 1], required: false },
            { id: 'unit_id', field_code: 'unit_id', data_type: 'NUMBER', label: 'Unit ID', value: [initialData.unit_id ?? 1], required: false },
            { id: 'category_id', field_code: 'category_id', data_type: 'NUMBER', label: 'Category ID', value: [initialData.category_id ?? 1], required: false },
            { id: 'form_type', field_code: 'form_type', data_type: 'TEXT', label: 'Form Type', value: [initialData.form_type ?? 'FORM'], required: false },
            { id: 'form_code', field_code: 'form_code', data_type: 'TEXT', label: 'Form Code', value: [initialData.form_code ?? ''], required: false },
            { id: 'form_name', field_code: 'form_name', data_type: 'TEXT', label: 'Form Name', value: [initialData.form_name ?? ''], required: false },
            { id: 'frequency', field_code: 'frequency', data_type: 'TEXT', label: 'Frequency', value: [initialData.frequency ?? 'DAILY'], required: false },
            { id: 'icon', field_code: 'icon', data_type: 'TEXT', label: 'Icon', value: [initialData.icon ?? 'block'], required: false },
            { id: 'status_pdf', field_code: 'status_pdf', data_type: 'checkbox', label: 'Status PDF', value: [initialData.status_pdf ?? false], required: false },
            { id: 'letterhead_id', field_code: 'letterhead_id', data_type: 'NUMBER', label: 'Letterhead ID', value: [initialData.letterhead_id ?? 1], required: false },
            { id: 'status', field_code: 'status', data_type: 'checkbox', label: 'Status', value: [initialData.status ?? true], required: false }
        ]
    };
});

const selectedForm = computed(() => {
    const id = route.query.id;
    return id ? data.value.find(f => f.id === Number(id)) || null : null;
});

// Provide
provide('forms', data);
provide('selectedForm', selectedForm);

// Methods
const loadData = async () => {
    loading.value = true;
    error.value = null;
    try {
        const response = await $axios.get(endPoint);
        if (response.data.success && Array.isArray(response.data.forms)) {
            data.value = response.data.forms;
        } else {
            error.value = 'Invalid response format from API';
        }
    } catch (err) {
        error.value = err.response?.data?.message || err.message || 'Failed to load forms';
    } finally {
        loading.value = false;
    }
};

const handleAdd = () => {
    params.value = null;
    formData.value = null;
    formModel.value = true;
};

const handleEdit = async (row) => {
    params.value = { id: row.original.id };
    try {
        const response = await $axios.get('/form/formdata', {
            params: { form_code: row.original.form_code }
        });
        
        if (response.data.success && response.data.form) {
            formData.value = {
                corporate_id: response.data.form.corporate_id || 1,
                unit_id: response.data.form.unit_id || 1,
                category_id: response.data.form.category_id || 1,
                form_type: response.data.form.form_type || "FORM",
                form_code: response.data.form.form_code || "",
                form_name: response.data.form.form_name || "",
                frequency: response.data.form.frequency || "DAILY",
                icon: response.data.form.icon || "block",
                status_pdf: response.data.form.status_pdf || false,
                letterhead_id: response.data.form.letterhead_id || 1,
                status: response.data.form.status ?? true
            };
        }
        formResetKey.value++;
        formModel.value = true;
    } catch (err) {
        console.error('Error loading form data:', err);
    }
};

const handleFormSubmit = async (submitData) => {
    if (submitData?.error) return;
    
    try {
        const isEdit = params.value?.id;
        const config = { headers: { 'Content-Type': 'application/json' } };
        
        if (isEdit) {
            await $axios.patch(endPoint, submitData.payload || {}, { ...config, params: { id: Number(params.value.id) } });
        } else {
            await $axios.post(endPoint, submitData.payload || {}, config);
        }
        
        formModel.value = false;
        await loadData();
    } catch (err) {
        alert(err.response?.data?.message || err.message || 'Failed to submit form');
    }
};

onMounted(loadData);
</script>