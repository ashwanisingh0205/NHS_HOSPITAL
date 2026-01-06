<template>
    <div class="flex gap-2">
        <div class="w-1/3">
            <CKCardList :loading="loading" :title="title" :show-add="true" @handleAdd="handleAdd" v-model="searchQuery">
                <UTable :loading="loading" :data="filteredData" :columns="columns">
                    <template #loading>
                        <CKLoader />
                    </template>
                    <template #empty>
                        <UError :error="{ statusMessage: error || 'No Record Found!!' }" />
                    </template>
                    <template #choice_code-cell="{ row }">
                        <ULink
                            :to="{ path: '/masters/forms/choices/choice_master/choice_details', query: { id: row.original.id } }"
                            class="cursor-pointer">
                            <b>{{ row.original.choice_name }}</b><br>
                            <small>{{ row.original.choice_code }}</small>
                        </ULink>
                    </template>
                    <template #action-cell="{ row }">
                        <div class="flex justify-end items-center gap-1">
                            <CKEdit @click="handleEdit(row.original)" />
                        </div>
                    </template>
                </UTable>
            </CKCardList>
        </div>
        <NuxtPage :key="$route.fullPath" />
    </div>

    <CKFormModal v-model="formModel" :title="modalTitle" :endPoint="endPoint" :submitEndPoint="endPoint" :staticForm="staticFormConfig"
        :params="params" @handleFormSubmit="handleFormSubmit" />
</template>

<script setup>
import CKEdit from "~/components/common/CKEdit.vue";
import CKCardList from "~/components/common/CKCardList.vue";
import CKFormModal from "~/components/common/CKFormModal.vue";
import CKLoader from "~/components/common/CKLoader.vue";

definePageMeta({ layout: 'home' });

const { $axios } = useNuxtApp();
const route = useRoute();

const title = "Choice Master List";
const endPoint = "/masters/forms/choice_master";

const columns = [
    { accessorKey: 'id', header: 'Sr.No.' },
    { accessorKey: 'choice_code', header: 'Choice' },
    { id: 'action' }
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
const modalTitle = computed(() => params.value?.id ? "Edit Choice Master" : "New Choice Master");

const filteredData = computed(() => {
    if (!searchQuery.value.trim()) return data.value;
    const query = searchQuery.value.toLowerCase();
    return data.value.filter(choice =>
        choice.choice_name?.toLowerCase().includes(query) ||
        choice.choice_code?.toLowerCase().includes(query)
    );
});

const staticFormConfig = computed(() => {
    const initial = formData.value || {
        corporate_id: 1,
        unit_id: 1,
        status: true,
        status_universal: false
    };

    return {
        fields: [
            { id: 'choice_name', field_code: 'choice_name', data_type: 'TEXT', label: 'Choice Name', value: [initial.choice_name ?? ''], required: true },
            { id: 'choice_code', field_code: 'choice_code', data_type: 'TEXT', label: 'Choice Code', value: [initial.choice_code ?? ''], required: true },
            { id: 'status', field_code: 'status', data_type: 'CHECKBOX', label: 'Status', value: [initial.status ?? true], required: false },
        ]
    };
});

const selectedChoice = computed(() => {
    const id = route.query.id;
    return id ? data.value.find(c => c.id === Number(id)) : null;
});

// Provide for child components
provide('choices', data);
provide('selectedChoice', selectedChoice);

// Methods
const loadData = async () => {
    loading.value = true;
    error.value = null;
    try {
        const response = await $axios.get(endPoint);
        data.value = response.data.success ? response.data.choices || response.data.rows || response.data : [];
    } catch (err) {
        error.value = err.response?.data?.message || 'Failed to load choice masters';
        data.value = [];
    } finally {
        loading.value = false;
    }
};

const handleAdd = () => {
    params.value = null;
    formData.value = {
        corporate_id: 1,
        unit_id: 1,
        status: true,
        status_universal: false
    };
    formModel.value = true;
};

const handleEdit = async (choice) => {
    params.value = { id: choice.id };
    formData.value = {
        corporate_id: choice.corporate_id ?? 1,
        unit_id: choice.unit_id ?? 1,
        choice_code: choice.choice_code ?? "",
        choice_name: choice.choice_name ?? "",
        status: choice.status ?? true,
        status_universal: choice.status_universal ?? false
    };

    await nextTick();
    formModel.value = true;
};

const handleFormSubmit = async () => {
    formModel.value = false;
    await loadData();
};

onMounted(loadData);
</script>
