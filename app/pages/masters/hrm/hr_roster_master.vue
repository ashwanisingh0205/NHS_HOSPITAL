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
                    <template #roster_date-cell="{ row }">
                        {{ row.original.roster_date ? new Date(row.original.roster_date).toLocaleDateString() : '' }}
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


    <CKFormModal v-model="formModel" :title="params.id ? 'Edit Roster' : 'New Roster'" :endPoint="endPoint"
        :formCode="'hr_roster_master'" :initialData="initialData" :params="params"
        @handleFormSubmit="handleFormSubmit" />


</template>

<script setup>
import CKEdit from "~/components/common/CKEdit.vue";
import CKCardList from "~/components/common/CKCardList.vue";
import CKFormModal from "~/components/common/CKFormModal.vue";

/* ------------------ Default Variables ------------------ */
definePageMeta({ layout: 'home' });
const { $axios } = useNuxtApp()
const title = ref("Roster List");
const endPoint = ref("/hrm/roster_master");
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
    { accessorKey: 'roster_date', header: 'Roster Date' },
    { id: 'action' }
]);
const loadData = async () => {
    loading.value = true;
    error.value = null;
    try {
        const response = await $axios.get(endPoint.value);
        const temp = response.data;
        if (temp.success && Array.isArray(temp.rosters)) {
            data.value = temp.rosters;
        } else {
            error.value = 'Invalid response format from API';
        }
    } catch (err) {
        error.value = err.response?.data?.message || err.message || 'Failed to load rosters';
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
    return data.value.filter(roster => {
        const dateStr = roster.roster_date ? new Date(roster.roster_date).toLocaleDateString().toLowerCase() : '';
        const remarks = roster.remarks?.toLowerCase() || '';
        return dateStr.includes(query) || remarks.includes(query);
    });
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
