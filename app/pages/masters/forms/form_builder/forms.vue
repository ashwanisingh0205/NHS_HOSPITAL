<template>
    <div class="flex gap-2">
        <div class="w-1/3">
            <CKCardList :title="title" @handleAdd="handleAdd" v-model="searchQuery">
                <UTable :loading="loading" :data="filteredData" :columns="columns">
                    <template #loading>
                        <CKLoader />
                    </template>
                    <template #empty>
                        <UError :error="{ statusMessage: error || 'No Record Found!!' }" />
                    </template>
                    
                    <template #form_name-cell="{ row }">
                        <ULink
                            :to="{ name: 'masters-forms-form_builder-forms-form_fields', query: { id: row.original.id } }"
                             class="cursor-pointer block max-w-[180px] truncate">
                            <small>{{ row.original.category_id }}{{ row.original.category_name }}</small> <br>
                            <b>{{ row.original.form_name }}</b> <br>
                            <small>{{ row.original.form_code }}</small>
                        </ULink>
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

    <CKFormModal
        v-model="formModel" :title="modalTitle" :endPoint="endPoint" :staticForm="staticFormConfig"
        :params="params" @handleFormSubmit="handleFormSubmit" />

    <CKFormModal v-model="showDefaultFields" :fields="defaultFields" :form-id="selectedDefaultForm.id"
        :form-code="selectedDefaultForm.form_code" />

</template>

<script setup>
import CKEdit from "~/components/common/CKEdit.vue";
import CKCardList from "~/components/common/CKCardList.vue";
import CKFormModal from "~/components/common/CKFormModal.vue";
import CKLoader from "~/components/common/CKLoader.vue";

definePageMeta({ layout: 'home' });

const { $axios } = useNuxtApp();
const route = useRoute();

const title = "Form List";
const endPoint = "/masters/forms/form";

const columns = [
    { accessorKey: 'id', header: 'Sr.No.', size: 50 },
    { accessorKey: 'form_name', header: 'Form Name', size: 180 },
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
    
    const formTypeArray = [
        { key: "FORM", value: "Data entry form" },
        { key: "SURVEY", value: "Survey/Feedback/Checklist" },
        { key: "WORKFLOW", value: "Workflow Initializer" },
    ]
    
    const categoryArray = [
        { key: 1, value: "Patient" },
        { key: 2, value: "HR" },
        { key: 3, value: "HR Joining" },
    ]

    return {
        fields: [
            {
                id: 'category_id',
                field_code: 'form_type',
                data_type: 'DROPDOWN',
                label: 'Category',
                value: ["1"],
                choices: categoryArray,
                required: false,
                cols: '6'
            },
            {
                id: 'form_type',
                field_code: 'form_type',
                data_type: 'DROPDOWN',
                label: 'Form Type',
                value: [initial.form_type ?? 'FORM'],
                choices: formTypeArray,
                required: false,
                cols: '6'
            },
            {
                id: 'form_code',
                field_code: 'form_code',
                data_type: 'TEXT',
                label: 'Form Code',
                value: [initial.form_code ?? ''],
                required: false,
                cols: '6'
            },
            {
                id: 'form_name',
                field_code: 'form_name',
                data_type: 'TEXT',
                label: 'Form Name',
                value: [initial.form_name ?? ''],
                required: false,
                cols: '6'
            },
            {
                id: 'status_pdf',
                field_code: 'status_pdf',
                data_type: 'CHECKBOX',
                label: 'Status PDF',
                value: [initial.status_pdf ?? false],
                required: false
            },
            {
                id: 'status',
                field_code: 'status',
                data_type: 'CHECKBOX',
                label: 'Status',
                value: [initial.status ?? true],
                required: false
            }
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
        console.log(staticFormConfig)
        data.value.map((form, index) => {
            form.category_name = staticFormConfig.value.categoryArray.find(c => c.key === form.category_id)?.value
        })
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
    params.value = null;
    formData.value = null;
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
