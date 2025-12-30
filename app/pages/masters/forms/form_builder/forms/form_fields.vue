<template>
    <CKCardList :loading="loading" :title="title" @handleAdd="handleAdd" v-model="searchQuery">
        <UTable :loading="loading" :data="filteredFields" :columns="columns">
            <template #loading>
                <CKLoader />
            </template>
            <template #empty>
                <UError :error="{ statusMessage: error || 'No Record Found!!' }" />
            </template>
            <template #data_type-cell="{ row }">
                <b>{{ row.original.data_type }}</b> <br>
                <small>{{ row.original.choice_code }}</small>
            </template>
            <template #label-cell="{ row }">
                <b>{{ row.original.label }}</b> <br>
                <small>{{ row.original.field_code }}</small>
            </template>
            <template #action-cell="{ row }">
                <div class="text-end">
                    <CKEdit @click="handleEdit(row)" />
                </div>
            </template>
        </UTable>
    </CKCardList>
    
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
import CKLoader from "~/components/common/CKLoader.vue";

definePageMeta({ layout: 'home' });

const { $axios } = useNuxtApp();
const route = useRoute();
const selectedForm = inject('selectedForm', ref(null));

// State
const fields = ref([]);
const formModel = ref(false);
const formResetKey = ref(0);
const loading = ref(false);
const error = ref(null);
const editingField = ref(null);
const searchQuery = ref('');

// Computed
const title = computed(() => 
    selectedForm.value ? `Form Fields - ${selectedForm.value.form_name}` : "Form Fields"
);

const modalTitle = computed(() => editingField.value ? "Edit Form Field" : "New Form Field");

const columns = [
    { accessorKey: 'id', header: 'Sr.No.' },
    { accessorKey: 'data_type', header: 'Date Type' },
    { accessorKey: 'label', header: 'Label' },
    { id: 'action' }
];

const staticFormConfig = computed(() => {
    const data = editingField.value || { form_id: selectedForm.value?.id };
    
    const dataTypeArray = [
        { id: "TEXT", value: "Text" },
        { id: "NUMBER", value: "Number" },
        { id: "HIDDEN", value: "Hidden" },
        { id: "DATE", value: "Date" },
        { id: "DROPDOWN", value: "Dropdown/Select" },
        { id: "CHECKBOX", value: "Checkbox" },
        { id: "RADIO", value: "Radio" },
        { id: "FILE", value: "File" },
        { id: "CARD", value: "Card" },
        { id: "GROUP", value: "Group" },
        { id: "TAB", value: "Tab" },
        { id: "SECTION", value: "Section" },
        { id: "TABLE", value: "Table" }
    ]
    
    return {
        fields: [
            { id: 'form_id', field_code: 'form_id', data_type: 'HIDDEN', label: 'Form ID', value: [data.form_id || selectedForm.value?.id || ''], required: true },
            { id: 'data_type', field_code: 'data_type', data_type: 'DROPDOWN', choices: dataTypeArray, label: 'Data Type', value: [data.data_type || 'TEXT'], required: true },
            { id: 'field_code', field_code: 'field_code', data_type: 'TEXT', label: 'Field Code', value: [data.field_code || ''], required: true },
            { id: 'label', field_code: 'label', data_type: 'TEXT', label: 'Label', value: [data.label || ''], required: true },
            { id: 'col', field_code: 'col', data_type: 'TEXT', label: 'Column', value: [data.col || ''], required: false },
            { id: 'priority', field_code: 'priority', data_type: 'NUMBER', label: 'Priority', value: [data.priority || 0], required: false },
            { id: 'choice_code', field_code: 'choice_code', data_type: 'TEXT', label: 'Choice Code', value: [data.choice_code || ''], required: false },
            { id: 'status', field_code: 'status', data_type: 'CHECKBOX', label: 'Status', value: [data.status ?? true], required: false }
        ]
    };
});

const filteredFields = computed(() => {
    const allFields = flattenFields(fields.value);
    
    if (!searchQuery.value.trim()) return allFields;
    
    const query = searchQuery.value.toLowerCase();
    return allFields.filter(f => 
        f.label?.toLowerCase().includes(query) || 
        f.field_code?.toLowerCase().includes(query) ||
        f.data_type?.toLowerCase().includes(query)
    );
});

// Methods
const flattenFields = (fieldArray) => {
    const result = [];
    fieldArray.forEach(field => {
        result.push(field);
        if (field.fields) result.push(...flattenFields(field.fields));
    });
    return result;
};

const loadFormFields = async () => {
    const formId = route.query.id || selectedForm.value?.id;
    if (!formId) return;
    
    loading.value = true;
    error.value = null;
    
    try {
        const { data } = await $axios.get('/masters/forms/field', {
            params: { form_id: formId }
        });
        
        fields.value = data.success && data.fields ? data.fields : [];
    } catch (err) {
        error.value = err.response?.data?.message || 'Failed to load form fields';
        fields.value = [];
    } finally {
        loading.value = false;
    }
};

const handleAdd = () => {
    editingField.value = null;
    formResetKey.value++;
    formModel.value = true;
};

const handleEdit = (row) => {
    editingField.value = row.original;
    formResetKey.value++;
    formModel.value = true;
};

const handleFormSubmit = async (submitData) => {
    if (submitData?.error) return;
    
    try {
        const payload = submitData.payload;
        
        console.log('Form submit payload:', payload);
        
        if (editingField.value) {
            const patchPayload = {
                ...payload,
                col: payload.col || null,
                priority: Number(payload.priority) || 0,
                choice_code: payload.choice_code ?? null
            };
            console.log('PATCH payload:', patchPayload);
            console.log('PATCH request URL:', `/masters/forms/field?id=${editingField.value.id}`);
            
            const response = await $axios.patch('/masters/forms/field', patchPayload, {
                params: { id: editingField.value.id }
            });
            
            console.log('PATCH response:', response.data);
        } else {
            const postPayload = {
                fields: [{
                    form_id: Number(payload.form_id),
                    data_type: payload.data_type,
                    field_code: payload.field_code,
                    label: payload.label,
                    col: payload.col || null,
                    priority: Number(payload.priority) || 0,
                    choice_code: payload.choice_code || null,
                    status: payload.status ?? true
                }]
            };
            console.log('POST payload:', postPayload);
            await $axios.post('/masters/forms/field', postPayload);
        }
        
        formModel.value = false;
        await loadFormFields();
    } catch (err) {
        console.error('Form submit error:', err);
        alert(err.response?.data?.message || 'Failed to submit form field');
    }
};

watch(() => route.query.id, loadFormFields);
watch(() => selectedForm.value?.id, loadFormFields);

onMounted(loadFormFields);
</script>
