<template>
    <div class="flex gap-2">
        <div class="md:w-1/3 lg:w-1/3">
            <CKCardList :loading="loading" :title="title" :show-add="true" @handleAdd="handleAdd" v-model="searchQuery">
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


    <CKFormModal v-model="formModel" :title="params.original?.id ? 'Edit Voucher Type' : 'New Voucher Type'"
        :endPoint="endPoint" formCode="account_voucher_type_master" :initialData="initialData" :params="params"
        @handleFormSubmit="handleFormSubmit" />


</template>

<script setup>
import CKEdit from "~/components/common/CKEdit.vue";
import CKCardList from "~/components/common/CKCardList.vue";
import CKFormModal from "~/components/common/CKFormModal.vue";

/* ------------------ Default Variables ------------------ */
definePageMeta({ layout: 'home' });
const { $axios } = useNuxtApp()
const title = ref("Account Voucher Type Master");
const endPoint = ref("form/defaultForm");
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
    { accessorKey: 'name', header: 'Name' }, // Use 'name' to match field_code
    { id: 'action' }
]);
const loadData = async () => {
    loading.value = true;
    error.value = null;
    try {
        const response = await $axios.get(endPoint.value, {
            params: { form_code: 'account_voucher_type_master', }
        });
        const temp = response.data;
        if (temp.success && Array.isArray(temp.response_values)) {
            // Transform EAV to Rows
            const grouped = {};
            temp.response_values.forEach(item => {
                const rowId = item.form_response_id;
                if (!grouped[rowId]) {
                    grouped[rowId] = { id: rowId };
                }

                let val = item.value;
                try {
                    const parsed = JSON.parse(val);
                    if (Array.isArray(parsed) && parsed.length === 1) val = parsed[0];
                    else val = parsed;
                } catch (e) { /* keep original */ }

                if (val === null) val = "";

                grouped[rowId][item.field_code] = val;
            });
            data.value = Object.values(grouped);
        } else {
            data.value = [];
        }
    } catch (err) {
        error.value = err.response?.data?.message || err.message || 'Failed to load voucher types';
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
        item.name?.toLowerCase().includes(query) ||
        item.code?.toLowerCase().includes(query)
    );
});





/* ------------------ Add Button ------------------ */
const handleAdd = () => {
    params.value = { form_code: 'account_voucher_type_master' };
    initialData.value = null;
    formModel.value = true;
};

/* ------------------ Edit Button ------------------ */
const handleEdit = async (item) => {
    params.value = { id: item.original.id, form_code: 'account_voucher_type_master' };
    initialData.value = item.original;
    formModel.value = true;
};

/* ------------------ Form Submit ------------------ */
const handleFormSubmit = async () => {
    formModel.value = false;
    await loadData();
};

</script>
