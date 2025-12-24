<template>
    <div class="flex gap-2">
        <div class="md:w-1/3 lg:w-1/3">
            <CKCardList :loading="loading" :title="title" @handleAdd="handleAdd" v-model="searchQuery">
                <UTable :loading="loading" :data="filteredData" :columns="columns">
                    <!-- Empty message -->
                    <template v-if="!loading" #empty>
                        <UError :error="{ statusMessage: error || 'No Record Found!!' }" />
                    </template>
                    <template #id-cell="{ row }">
                        {{filteredData.findIndex(f => f.id === row.original.id) + 1}}
                    </template>
                    <template #action-cell="{ row }">
                        <div class="text-end">
                            <CKEdit @click="handleEdit(row)" />
                        </div>
                    </template>
                </UTable>
            </CKCardList>
        </div>
        <NuxtPage :key="$route.params" />
    </div>


    <CKFormModal v-model="formModel" :title="params.id ? 'Edit Feedback' : 'New Feedback'" :endPoint="endPoint"
        :formCode="'f17'" :initialData="initialData" :params="params" @handleFormSubmit="handleFormSubmit" />


</template>

<script setup>
import CKEdit from "~/components/common/CKEdit.vue";
import CKCardList from "~/components/common/CKCardList.vue";
import CKFormModal from "~/components/common/CKFormModal.vue";

/* ------------------ Default Variables ------------------ */
definePageMeta({ layout: 'home' });
const { $axios } = useNuxtApp()
const title = ref("Feedback about results of treatment - 2");
const endPoint = ref("/form/defaultForm");
const params = ref({});
const formModel = ref(false);
const initialData = ref(null);


/* ------------------ onMounted ------------------ */
onMounted(async () => {
    await loadData();
});


/* ------------------ Load Table Data ------------------ */
const loading = ref(true);
const error = ref(null);
const data = ref([]);
const columns = ref([
    { accessorKey: 'id', header: 'Sr.No.' },
    { accessorKey: 'hwyro', header: 'Health rating' },
    { id: 'action' }
]);
const loadData = async () => {
    loading.value = true;
    error.value = null;
    try {
        const response = await $axios.get(endPoint.value, {
            params: { form_code: 'f17' }
        });
        const temp = response.data;
        if (temp.success && Array.isArray(temp.response_values)) {
            // Group data by form_response_id
            const grouped = {};
            temp.response_values.forEach(item => {
                if (!grouped[item.form_response_id]) {
                    grouped[item.form_response_id] = { id: item.form_response_id };
                }
                try {
                    const parsedValue = JSON.parse(item.value);
                    grouped[item.form_response_id][item.field_code] = Array.isArray(parsedValue) ? parsedValue[0] : parsedValue;
                } catch (e) {
                    grouped[item.form_response_id][item.field_code] = item.value;
                }
            });
            data.value = Object.values(grouped);
        } else {
            error.value = 'Invalid response format from API';
        }
    } catch (err) {
        error.value = err.response?.data?.message || err.message || 'Failed to load feedback';
    } finally {
        loading.value = false;
    }
};


/* ------------------ Search ------------------ */
const searchQuery = ref('');
const filteredData = computed(() => {
    if (!searchQuery.value.trim()) {
        return data.value;
    }
    const query = searchQuery.value.toLowerCase();
    return data.value.filter(item =>
        item.hwyro?.toLowerCase().includes(query)
    );
});





/* ------------------ Add Button ------------------ */
const handleAdd = () => {
    params.value = {};
    initialData.value = null;
    formModel.value = true;
};

/* ------------------ Edit Button ------------------ */
const handleEdit = async (item) => {
    params.value = { id: item.original.id };
    initialData.value = null;

    // Load existing data for editing
    try {
        const existingItem = data.value.find(d => d.id === item.original.id);
        if (existingItem) {
            initialData.value = existingItem;
        }
    } catch (err) {
        console.error('Error loading item data:', err);
    }

    formModel.value = true;
};

/* ------------------ Form Submit ------------------ */
const handleFormSubmit = async () => {
    formModel.value = false;
    await loadData();
};

</script>
