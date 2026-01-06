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


    <CKFormModal v-model="formModel" :title="params.original?.id ? 'Edit Bank Account' : 'New Bank Account'"
        :endPoint="endPoint" formCode="bank_account_master" :initialData="initialData" :params="params"
        @handleFormSubmit="handleFormSubmit" />


</template>

<script setup>
import CKEdit from "~/components/common/CKEdit.vue";
import CKCardList from "~/components/common/CKCardList.vue";
import CKFormModal from "~/components/common/CKFormModal.vue";

/* ------------------ Default Variables ------------------ */
definePageMeta({ layout: 'home' });
const { $axios } = useNuxtApp()
const title = ref("Bank Account Master");
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
    { accessorKey: 'account_holder_name', header: 'Account Holder Name' },
    { accessorKey: 'account_number', header: 'Account Number' },
    { accessorKey: 'account_type', header: 'Account Type' },
    { id: 'action' }
]);
const loadData = async () => {
    loading.value = true;
    error.value = null;
    try {
        const response = await $axios.get(endPoint.value, {
            params: { form_code: 'bank_account_master' }
        });
        const temp = response.data;
        if (temp.success && Array.isArray(temp.response_values)) {
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
                } catch (e) {  }

                if (val === null) val = "";

                grouped[rowId][item.field_code] = val;
            });
            data.value = Object.values(grouped);
        } else {
            data.value = [];
        }
    } catch (err) {
        error.value = err.response?.data?.message || err.message || 'Failed to load bank accounts';
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
        item.account_holder_name?.toLowerCase().includes(query) ||
        item.account_number?.toLowerCase().includes(query)
    );
});





/* ------------------ Add Button ------------------ */
const handleAdd = () => {
    params.value = { form_code: 'bank_account_master' };
    initialData.value = null;
    formModel.value = true;
};

/* ------------------ Edit Button ------------------ */
const handleEdit = async (item) => {
    params.value = { id: item.original.id, form_code: 'bank_account_master' };
    initialData.value = item.original;
    formModel.value = true;
};

/* ------------------ Form Submit ------------------ */
const handleFormSubmit = async () => {
    formModel.value = false;
    await loadData();
};

</script>
