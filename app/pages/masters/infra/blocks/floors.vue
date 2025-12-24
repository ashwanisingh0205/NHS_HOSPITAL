<template>
    <div class="md:w-1/3 lg:w-1/3">
        <CKCardList :loading="loading" :title="title" @handleAdd="handleAdd" v-model="searchQuery">
            <UTable :loading="loading" :data="filteredData" :columns="columns">
                <!-- Empty message -->
                <template v-if="!loading" #empty>
                    <UError :error="{ statusMessage: error || 'No Record Found!!' }" />
                </template>
                <template #id-cell="{ row }">
                    {{ filteredData.findIndex(f => f.id === row.original.id) + 1 }}
                </template>
                <template #floor_name-cell="{ row }">
                    <ULink
                        :to="{ name: 'masters-infra-blocks-floors-locations', query: { block_id: route.query.block_id, floor_id: row.original.id } }"  class="cursor-pointer">
                        {{ row.original.floor_name }}
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
    <NuxtPage :key="$route.params" />
    
    
    <CKFormModal
        v-model="formModel"
        :title="params.id ? 'Edit Floor' : 'New Floor'"
        :endPoint="endPoint"
        :id="id"
        :params="params"
        @handleFormSubmit="handleFormSubmit"
    />

</template>

<script setup>
import CKEdit from "~/components/common/CKEdit.vue";
import CKCardList from "~/components/common/CKCardList.vue";
import CKFormModal from "~/components/common/CKFormModal.vue";

const route = useRoute();
const { $axios } = useNuxtApp();

/* ------------------ Default Variables ------------------ */
definePageMeta({ layout: 'home' });
const title = ref("Floor List");
const endPoint = ref("/masters/infra/floors");
const params = ref({});
const formModel = ref(false);
const id = ref('');


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
    { accessorKey: 'floor_name', header: 'Floor Name' },
    { id: 'action' }
]);
const loadData = async () => {
    loading.value = true;
    error.value = null;
    try {
        const response = await $axios.get(endPoint.value, {
            params: { block_id: route.query.block_id }
        });
        const temp = response.data;
        if (temp.success && Array.isArray(temp.floors)) {
            data.value = temp.floors;
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
    // Get block_id from route query or default to 1
    const blockId = route.query.block_id ? Number(route.query.block_id) : 1;
    
    // Set params for form submission
    params.value = { block_id: blockId };
    formModel.value = true;
};

/* ------------------ Edit Button ------------------ */
const handleEdit = async (item) => {
    params.value = { id: item.original.id };
    id.value = item.original.id;
    formModel.value = true;
};

/* ------------------ Form Submit ------------------ */
const handleFormSubmit = async () => {
    formModel.value = false;
    await loadData();
};

</script>

