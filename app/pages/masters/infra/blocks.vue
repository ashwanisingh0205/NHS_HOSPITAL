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
                        {{ filteredData.findIndex(f => f.id === row.original.id) + 1 }}
                    </template>
                    <template #block_name-cell="{ row }">
                        <ULink
                            :to="{ name: 'masters-infra-blocks-floors', query: { block_id: row.original.id } }"  class="cursor-pointer">
                            {{ row.original.block_name }}
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
    </div>
    
    
    <CKFormModal
        v-model="formModel"
        :title="params.id ? 'Edit Block' : 'New Block'"
        :endPoint="endPoint"
        :formCode="'infra_block_master'"
        :initialData="initialData"
        :params="params"
        @handleFormSubmit="handleFormSubmit"
    />
    
    
</template>

<script setup>
import CKEdit from "~/components/common/CKEdit.vue";
import CKCardList from "~/components/common/CKCardList.vue";
import CKFormModal from "~/components/common/CKFormModal.vue";

/* ------------------ Default Variables ------------------ */
definePageMeta({ layout: 'home' });
const { $axios } = useNuxtApp()
const title = ref("Block List");
const endPoint = ref("/masters/infra/blocks");
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
    { accessorKey: 'block_name', header: 'Block Name' },
    { id: 'action' }
]);
const loadData = async () => {
    loading.value = true;
    error.value = null;
    try {
        const response = await $axios.get(endPoint.value);
        const temp = response.data;
        if (temp.success && Array.isArray(temp.block)) {
            data.value = temp.block;
        } else {
            error.value = 'Invalid response format from API';
        }
    } catch (err) {
        error.value = err.response?.data?.message || err.message || 'Failed to load blocks';
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
    return data.value.filter(block =>
        block.block_name?.toLowerCase().includes(query)
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

