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
                    <template #reference_range_text-cell="{ row }">
                        {{ row.original.reference_range_text }}
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


    <CKFormModal v-model="formModel" :title="params.id ? 'Edit Item Reference Range' : 'New Item Reference Range'"
        :endPoint="endPoint" :id="id" :params="params"
        @handleFormSubmit="handleFormSubmit" />


</template>

<script setup>
import CKEdit from "~/components/common/CKEdit.vue";
import CKCardList from "~/components/common/CKCardList.vue";
import CKFormModal from "~/components/common/CKFormModal.vue";

/* ------------------ Default Variables ------------------ */
definePageMeta({ layout: 'home' });
const { $axios } = useNuxtApp()
const title = ref("Item Reference Range List");
const endPoint = ref("/masters/items/lis_reference");
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
    { accessorKey: 'reference_range_text', header: 'Reference Range' },
    { id: 'action' }
]);
const loadData = async () => {
    loading.value = true;
    error.value = null;
    try {
        const response = await $axios.get(endPoint.value);
        const temp = response.data;
        if (temp.success && Array.isArray(temp.data)) {
            data.value = temp.data;
        } else {
            error.value = 'Invalid response format from API';
        }
    } catch (err) {
        error.value = err.response?.data?.message || err.message || 'Failed to load reference ranges';
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
        item.reference_range_text?.toLowerCase().includes(query) ||
        item.interpretation?.toLowerCase().includes(query)
    );
});





/* ------------------ Add Button ------------------ */
const handleAdd = () => {
    params.value = {};
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
