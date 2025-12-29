<template>
    <div class="flex gap-2">
        <div class="w-1/2">
            <CKCardList :loading="loading" :title="title" @handleAdd="handleAdd" v-model="searchQuery">
                <UTable :loading="loading" :data="filteredData" :columns="columns" :ui="{
                    table: 'table-fixed',
                    th: { base: 'px-2 py-2 text-sm whitespace-nowrap' },
                    td: { base: 'px-2 py-2 text-sm whitespace-nowrap' }
                }">
                    <template v-if="!loading" #empty>
                        <UError :error="{ statusMessage: error || 'No Record Found!!' }" />
                    </template>
                    <template #id-cell="{ row }">
                        {{filteredData.findIndex(f => f.id === row.original.id) + 1}}
                    </template>
                    <template #form_name-cell="{ row }">
                        <ULink
                            :to="{ name: 'masters-forms-form_builder-forms-form_fields', query: { id: row.original.id } }"
                             class="cursor-pointer block max-w-[180px] truncate">
                            {{ row.original.form_name }}
                        </ULink>
                    </template>
                    <template #form_code-cell="{ row }">
                        <span class="block max-w-[140px] truncate">
                            {{ row.original.form_code }}
                        </span>
                    </template>
                    <template #action-cell="{ row }">
                        <div class="flex justify-end items-center gap-1">
                            <CKEdit @click="handleEdit(row.original)" />
                            <UButton icon="lucide:star" variant="outline" size="sm" color="neutral"
                                @click="loadDefaultFields(row.original)" />
                        </div>
                    </template>
                </UTable>
            </CKCardList>
        </div>
        <NuxtPage :key="$route.fullPath" />
    </div>

    <CKFormModal v-model="formModel" :title="modalTitle" :endPoint="endPoint" :staticForm="staticFormConfig"
        :params="params" @handleFormSubmit="handleFormSubmit" />

    <CKFormModal v-model="showDefaultFields" :fields="defaultFields" :form-id="selectedDefaultForm.id"
        :form-code="selectedDefaultForm.form_code" />

</template>

<script setup>
import CKEdit from "~/components/common/CKEdit.vue";
import CKCardList from "~/components/common/CKCardList.vue";
import CKFormModal from "~/components/common/CKFormModal.vue";

definePageMeta({ layout: 'home' });

const { $axios } = useNuxtApp();
const route = useRoute();

const title = "Form List";
const endPoint = "/masters/forms/form";

const columns = [
    { accessorKey: 'id', header: 'Sr.No.', size: 50 },
    { accessorKey: 'form_name', header: 'Form Name', size: 180 },
    { accessorKey: 'form_code', header: 'Form Code', size: 140 },
    { id: 'action', size: 70 }
];

// State
const loading = ref(true);
const error = ref(null);
const data = ref([]);
const searchQuery = ref('');
const formModel = ref(false);
const params = ref(null);
const formData = ref(null);

// Computed
const modalTitle = computed(() => params.value?.id ? "Edit Form" : "New Form");

const filteredData = computed(() => {
    if (!searchQuery.value.trim()) return data.value;
    const query = searchQuery.value.toLowerCase();
    return data.value.filter(form =>
        form.form_name?.toLowerCase().includes(query) ||
        form.form_code?.toLowerCase().includes(query)
    );
});

const staticFormConfig = computed(() => {
    const initial = formData.value || {};

    return {
        fields: [
            { id: 'corporate_id', field_code: 'corporate_id', data_type: 'NUMBER', label: 'Corporate ID', value: [initial.corporate_id ?? 1], required: false },
            { id: 'unit_id', field_code: 'unit_id', data_type: 'NUMBER', label: 'Unit ID', value: [initial.unit_id ?? 1], required: false },
            { id: 'category_id', field_code: 'category_id', data_type: 'NUMBER', label: 'Category ID', value: [initial.category_id ?? 1], required: false },
            { id: 'form_type', field_code: 'form_type', data_type: 'TEXT', label: 'Form Type', value: [initial.form_type ?? 'FORM'], required: false },
            { id: 'form_code', field_code: 'form_code', data_type: 'TEXT', label: 'Form Code', value: [initial.form_code ?? ''], required: false },
            { id: 'form_name', field_code: 'form_name', data_type: 'TEXT', label: 'Form Name', value: [initial.form_name ?? ''], required: false },
            { id: 'frequency', field_code: 'frequency', data_type: 'TEXT', label: 'Frequency', value: [initial.frequency ?? 'DAILY'], required: false },
            { id: 'icon', field_code: 'icon', data_type: 'TEXT', label: 'Icon', value: [initial.icon ?? 'block'], required: false },
            { id: 'status_pdf', field_code: 'status_pdf', data_type: 'checkbox', label: 'Status PDF', value: [initial.status_pdf ?? false], required: false },
            { id: 'letterhead_id', field_code: 'letterhead_id', data_type: 'NUMBER', label: 'Letterhead ID', value: [initial.letterhead_id ?? 1], required: false },
            { id: 'status', field_code: 'status', data_type: 'checkbox', label: 'Status', value: [initial.status ?? true], required: false }
        ]
    };
});

const selectedForm = computed(() => {
    const id = route.query.id;
    return id ? data.value.find(f => f.id === Number(id)) : null;
});

// Provide for child components
provide('forms', data);
provide('selectedForm', selectedForm);

// Methods
const loadData = async () => {
    loading.value = true;
    error.value = null;
    try {
        const response = await $axios.get(endPoint);
        data.value = response.data.success ? response.data.forms : [];
    } catch (err) {
        error.value = err.response?.data?.message || 'Failed to load forms';
    } finally {
        loading.value = false;
    }
};

const handleAdd = () => {
    params.value = null;
    formData.value = null;
    formModel.value = true;
};

const handleEdit = async (form) => {
    params.value = { id: form.id };
    formData.value = null;

    try {
        const response = await $axios.get(endPoint, { params: { id: form.id } });

        // Extract form data from various possible response structures
        const formResponse = response.data.forms?.[0] || response.data.forms || response.data[0];

        if (formResponse) {
            formData.value = {
                corporate_id: 1,
                unit_id: 1,
                category_id: formResponse.category_id ?? 1,
                form_type: formResponse.form_type ?? "FORM",
                form_code: formResponse.form_code ?? "",
                form_name: formResponse.form_name ?? "",
                frequency: formResponse.frequency ?? "DAILY",
                icon: formResponse.icon ?? "block",
                status_pdf: formResponse.status_pdf ?? false,
                letterhead_id: formResponse.letterhead_id ?? 1,
                status: formResponse.status ?? true
            };

            await nextTick();
            formModel.value = true;
        }
    } catch (err) {
        console.error('Error loading form data:', err);
    }
};

const handleFormSubmit = async () => {
    formModel.value = false;
    await loadData();
};

const showDefaultFields = ref(false)
const selectedDefaultForm = ref({
    id: null,
    form_code: null
})
const defaultFields = ref([])

const loadDefaultFields = async (form) => {
    selectedDefaultForm.value = {
        id: form.id,
        form_code: form.form_code
    }

    const res = await $axios.get('form/defaultForm', {
        params: {
            form_code: form.form_code,
            form: true
        }
    })

    defaultFields.value = res.data.fields
    showDefaultFields.value = true
}


onMounted(loadData);
</script>