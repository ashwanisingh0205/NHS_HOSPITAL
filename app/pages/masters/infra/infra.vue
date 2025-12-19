<template>
    <div class="flex gap-2">
        <div class="w-1/3">
            <UCard>
                <template #header>
                    <div class="flex items-center justify-between mb-4">
                        <h2 class="text-lg font-semibold">{{ title }}</h2>
                        <CKAdd @click="handleAdd" />
                    </div>
                    <CKSearch v-model="searchQuery" />
                </template>
                
                <template #default>
                    <!-- Table -->
                    <UTable :loading="loading" :data="filteredData" :columns="columns">
                        <!-- Empty message -->
                        <template v-if="!loading" #empty>
                            <UError :error="{ statusMessage: error || 'No Record Found!!' }" />
                        </template>
                        <template #block_name-cell="{ row }">
                            <ULink
                                :to="{ name: 'masters-infra-infra-floors', query: { id: row.original.id } }"  class="cursor-pointer">
                                {{ row.original.block_name }}
                            </ULink>
                        </template>
                        <template #action-cell="{ row }">
                            <div class="text-end">
                                <CKEdit @click="handleEdit(row)" />
                            </div>
                        </template>
                    </UTable>
                </template>
            </UCard>
        </div>
        
        <NuxtPage />
    </div>
    
    
    
    <UModal v-model:open="formModel" title="New Block">
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
import CKAdd from "~/components/common/CKAdd.vue";
import CKEdit from "~/components/common/CKEdit.vue";
import CKSearch from "~/components/common/CKSearch.vue";

definePageMeta({ layout: 'home' });



const title = ref("Block List");



onMounted(async () => {
    await loadData();
});


/* ------------------ Load Data ------------------ */
const loading = ref(true);
const error = ref(null);
const blocks = ref([]);
const columns = ref([
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'block_name', header: 'Block Name' },
    { id: 'action' }
]);
const loadData = async () => {
    loading.value = true;
    error.value = null;
    try {
        const response = await axios.get('http://13.200.174.164:3001/v1/masters/infra/blocks');
        const data = response.data;
        if (data.success && Array.isArray(data.block)) {
            blocks.value = data.block;
        } else {
            error.value = 'Invalid response format from API';
        }
    } catch (err) {
        error.value = err.response?.data?.message || err.message || 'Failed to load blocks';
    } finally {
        loading.value = false;
    }
};

/* ------------------ Filter Data ------------------ */
const searchQuery = ref('');
const filteredData = computed(() => {
    if (!searchQuery.value.trim()) {
        return blocks.value;
    }
    const query = searchQuery.value.toLowerCase();
    return blocks.value.filter(block =>
        block.block_name?.toLowerCase().includes(query)
    );
});



/* ------------------ Load Form ------------------ */
const form = ref(null);
const endPoint = ref("http://13.200.174.164:3001/v1/masters/infra/blocks");
const params = ref({});


/* ------------------ Add Button ------------------ */
const handleAdd = () => {
    params.value = {
        params: { form: 'true', id: 0 }
    };
    formModel.value = true;
};


/* ------------------ Edit Button ------------------ */
const formModel = ref(false);
const handleEdit = (block) => {
    params.value = {
        params: { form: 'true', id: block.id }
    };
    formModel.value = true;
};


/* ------------------ Form Submit ------------------ */
const handleFormSubmit = async () => {
    formModel.value = false;
    await loadData();
};

</script>

