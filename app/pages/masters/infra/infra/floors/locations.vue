<template>
    <div class="w-1/3">
        <CKCardList :loading="loading" :title="title" @handleAdd="handleAdd" v-model="searchQuery">
            <UTable :loading="loading" :data="filteredData" :columns="columns">
                <!-- Empty message -->
                <template v-if="!loading" #empty>
                    <UError :error="{ statusMessage: error || 'No Record Found!!' }" />
                </template>
                <template #action-cell="{ row }">
                    <div class="text-end">
                        <CKEdit @click="handleEdit(row)" />
                    </div>
                </template>
            </UTable>
        </CKCardList>
    </div>
    <NuxtPage />
    
    
    <UModal v-model:open="formModel" :title="title">
        <template #body>
            <DynamicForm
                :endPoint="endPoint"
                :params="params"
                @submit="handleFormSubmit"
            />
        </template>
    </UModal>

</template>

<script setup>
import axios from 'axios';
import DynamicForm from "~/components/emr/DynamicForm.vue";
import CKEdit from "~/components/common/CKEdit.vue";
import CKCardList from "~/components/common/CKCardList.vue";
const route = useRoute();

/* ------------------ Default Variables ------------------ */
definePageMeta({ layout: 'home' });
const title = ref("Floor List");
const endPoint = ref("http://13.200.174.164:3001/v1/masters/infra/locations");
const params = ref({});
const formModel = ref(false);


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
    { accessorKey: 'location', header: 'Location Name' },
    { id: 'action' }
]);
const loadData = async () => {
    loading.value = true;
    error.value = null;
    try {
        const response = await axios.get(endPoint.value, {
            params: { floor_id: route.query.floor_id }
        });
        const temp = response.data;
        if (temp.success && Array.isArray(temp.locations)) {
            data.value = temp.locations;
        } else {
            error.value = 'Invalid response format from API';
        }
    } catch (err) {
        error.value = err.response?.data?.message || err.message || 'Failed to load floors';
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
        item.floor_name?.toLowerCase().includes(query)
    );
});





/* ------------------ Add Button ------------------ */
const handleAdd = () => {
    params.value = null;
    formModel.value = true;
};

/* ------------------ Edit Button ------------------ */
const handleEdit = (item) => {
    params.value = { id: item.id };
    formModel.value = true;
};

/* ------------------ Form Submit ------------------ */
const handleFormSubmit = async () => {
    formModel.value = false;
    await loadData();
};

</script>

