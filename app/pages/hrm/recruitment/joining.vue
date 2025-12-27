<template>
    <div>
        <CKCardList :loading="loading" :title="title" @handleAdd="handleAdd" v-model="searchQuery">
            <UTable :loading="loading" :data="filteredData" :columns="columns">
                <!-- Empty message -->
                <template v-if="!loading" #empty>
                    <UError :error="{ statusMessage: error || 'No Record Found!!' }" />
                </template>
                <template #id-cell="{ row }">
                    {{ filteredData.findIndex(f => f.id === row.original.id) + 1 }}
                </template>
                <template #name-cell="{ row }">
                    <div class="flex items-center gap-3">
                        <UAvatar size="sm" />
                        <span class="font-medium">{{ row.original.name || '-' }}</span>
                    </div>
                </template>
                <template #designation-cell="{ row }">
                    <UBadge variant="soft" color="primary">
                        {{ row.original.designation || '-' }}
                    </UBadge>
                </template>
                <template #department-cell="{ row }">
                    {{ row.original.department || '-' }}
                </template>
                <template #phone_number-cell="{ row }">
                    {{ row.original.phone_number || '-' }}
                </template>
                <template #action-cell="{ row }">
                    <div class="flex gap-1 flex-wrap">
                        <!-- Verification Button -->
                        <UButton 
                            size="xs" 
                            variant="solid" 
                            color="info"
                            @click="handleVerification(row.original)"
                        >
                            Verification
                        </UButton>
                        
                        <!-- Assessment Button -->
                        <UButton 
                            size="xs" 
                            variant="solid" 
                            color="primary"
                            @click="handleAssessment(row.original)"
                        >
                            Assessment
                        </UButton>
                        
                        <!-- Offer Letter Button -->
                        <UButton 
                            size="xs" 
                            variant="solid" 
                            color="warning"
                            @click="handleOfferLetter(row.original)"
                        >
                            Offer Letter
                        </UButton>
                        
                        <!-- Joining Kit Button -->
                        <UButton 
                            size="xs" 
                            variant="solid" 
                            color="success"
                            @click="handleJoiningKit(row.original)"
                        >
                            Joining Kit
                        </UButton>
                        
                        <!-- Approve Button -->
                        <UButton 
                            size="xs" 
                            color="error"
                            @click="handleApprove(row.original)"
                        >
                            Approve
                        </UButton>
                    </div>
                </template>
            </UTable>
        </CKCardList>

        <!-- New Joining Form Modal -->
        <CKFormModal
            v-model="formModel"
            :title="params.id ? 'Edit Joining' : 'New Joining'"
            :endPoint="'/form/defaultForm'"
            :formCode="'hr_joining'"
            :id="id"
            :params="params"
            @handleFormSubmit="handleFormSubmit"
        />

        <!-- Verification Form Modal -->
        <CKFormModal
            v-model="verificationModel"
            title="Employee Verification"
            :endPoint="'/form/defaultForm'"
            :formCode="verificationFormCode"
            :id="verificationId"
            :params="verificationParams"
            @handleFormSubmit="handleVerificationSubmit"
        />

        <!-- Assessment Form Modal -->
        <CKFormModal
            v-model="assessmentModel"
            title="Assessment"
            :endPoint="'/form/defaultForm'"
            :formCode="assessmentFormCode"
            :id="assessmentId"
            :params="assessmentParams"
            @handleFormSubmit="handleAssessmentSubmit"
        />

        <!-- Offer Letter Modal -->
        <CKFormModal
            v-model="offerLetterModel"
            title="Offer Letter"
            :endPoint="'/form/defaultForm'"
            :formCode="offerLetterFormCode"
            :id="offerLetterId"
            :params="offerLetterParams"
            @handleFormSubmit="handleOfferLetterSubmit"
        />

        <!-- Joining Kit Modal -->
        <CKFormModal
            v-model="joiningKitModel"
            title="Joining Kit"
            :endPoint="'/form/defaultForm'"
            :formCode="joiningKitFormCode"
            :id="joiningKitId"
            :params="joiningKitParams"
            @handleFormSubmit="handleJoiningKitSubmit"
        />
    </div>
</template>

<script setup>
import CKCardList from "~/components/common/CKCardList.vue";
import CKFormModal from "~/components/common/CKFormModal.vue";

/* ------------------ Default Variables ------------------ */
definePageMeta({ layout: 'home' });
const { $axios } = useNuxtApp()
const title = ref("Employee Joining Process");
const endPoint = ref("/form/defaultForm");
const params = ref({});
const formModel = ref(false);
const id = ref('');

// Verification Modal
const verificationModel = ref(false);
const verificationId = ref('');
const verificationParams = ref({});
const verificationFormCode = ref('hr_joining_verification'); // Update with actual form code

// Assessment Modal
const assessmentModel = ref(false);
const assessmentId = ref('');
const assessmentParams = ref({});
const assessmentFormCode = ref('hr_assessment'); // Update with actual form code

// Offer Letter Modal
const offerLetterModel = ref(false);
const offerLetterId = ref('');
const offerLetterParams = ref({});
const offerLetterFormCode = ref('hr_offer_letter'); // Update with actual form code

// Joining Kit Modal
const joiningKitModel = ref(false);
const joiningKitId = ref('');
const joiningKitParams = ref({});
const joiningKitFormCode = ref('hr_joining_kit'); // Update with actual form code

/* ------------------ onMounted ------------------ */
onMounted(async () => {
    await loadData();
});

/* ------------------ Load Table Data ------------------ */
const loading = ref(true);
const error = ref(null);
const data = ref([]);
const searchQuery = ref('');
const columns = ref([
    { accessorKey: 'id', header: 'Sr.No.' },
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'designation', header: 'Designation' },
    { accessorKey: 'department', header: 'Department' },
    { accessorKey: 'phone_number', header: 'Phone' },
    { id: 'action' }
]);

const loadData = async () => {
    loading.value = true;
    error.value = null;
    
    try {
        const { data: res } = await $axios.get(endPoint.value, {
            params: { form_code: 'hr_joining' }
        });
        
        if (!res.success || !Array.isArray(res.response_values)) {
            error.value = res.message || 'Invalid response format';
            return;
        }
        
        const parseValue = (val) => {
            if (!val) return '';
            try {
                const parsed = JSON.parse(val);
                return Array.isArray(parsed) ? parsed[0] : parsed;
            } catch {
                return val;
            }
        };
        
        const grouped = {};
        
        res.response_values.forEach(({ form_response_id, field_code, value }) => {
            if (!grouped[form_response_id]) {
                grouped[form_response_id] = { form_response_id };
            }
            grouped[form_response_id][field_code] = parseValue(value);
        });
        
        data.value = Object.values(grouped).map(j => ({
            id: j.form_response_id,
            form_response_id: j.form_response_id,
            name: j.name || j.employee_name_lang1 || '-',
            designation: j.designation || '-',
            department: j.department || j.department_id || '-',
            phone_number: j.phone_number || '-'
        }));
        
    } catch (err) {
        error.value = err.response?.data?.message || err.message || 'Failed to load joining data';
        console.error('Error loading joining data:', err);
    } finally {
        loading.value = false;
    }
};

/* ------------------ Search Filter ------------------ */
const filteredData = computed(() => {
    if (!searchQuery.value) return data.value;
    
    const query = searchQuery.value.toLowerCase();
    return data.value.filter(item => 
        (item.name && item.name.toLowerCase().includes(query)) ||
        (item.designation && item.designation.toLowerCase().includes(query)) ||
        (item.department && item.department.toLowerCase().includes(query)) ||
        (item.phone_number && item.phone_number.includes(query))
    );
});

/* ------------------ Add Button ------------------ */
const handleAdd = () => {
    params.value = {};
    id.value = '';
    formModel.value = true;
};

/* ------------------ Form Submit ------------------ */
const handleFormSubmit = async () => {
    formModel.value = false;
    await loadData();
};

/* ------------------ Verification Handler ------------------ */
const handleVerification = (joining) => {
    const responseId = joining.form_response_id || joining.id;
    verificationParams.value = { 
        joining_id: responseId,
        form_response_id: responseId
    };
    verificationId.value = responseId;
    verificationModel.value = true;
};

const handleVerificationSubmit = async () => {
    verificationModel.value = false;
    await loadData();
};

/* ------------------ Assessment Handler ------------------ */
const handleAssessment = (joining) => {
    const responseId = joining.form_response_id || joining.id;
    assessmentParams.value = { 
        joining_id: responseId,
        form_response_id: responseId
    };
    assessmentId.value = responseId;
    assessmentModel.value = true;
};

const handleAssessmentSubmit = async () => {
    assessmentModel.value = false;
    await loadData();
};

/* ------------------ Offer Letter Handler ------------------ */
const handleOfferLetter = (joining) => {
    const responseId = joining.form_response_id || joining.id;
    offerLetterParams.value = { 
        joining_id: responseId,
        form_response_id: responseId
    };
    offerLetterId.value = responseId;
    offerLetterModel.value = true;
};

const handleOfferLetterSubmit = async () => {
    offerLetterModel.value = false;
    await loadData();
};

/* ------------------ Joining Kit Handler ------------------ */
const handleJoiningKit = (joining) => {
    const responseId = joining.form_response_id || joining.id;
    joiningKitParams.value = { 
        joining_id: responseId,
        form_response_id: responseId
    };
    joiningKitId.value = responseId;
    joiningKitModel.value = true;
};

const handleJoiningKitSubmit = async () => {
    joiningKitModel.value = false;
    await loadData();
};

/* ------------------ Approve Handler ------------------ */
const handleApprove = async (joining) => {
    try {
        const responseId = joining.form_response_id || joining.id;
        await $axios.post('/form/defaultForm', {
            form_response_id: responseId,
            status: 'Approved'
        }, {
            params: {
                form_code: 'hr_joining',
                form_response_id: responseId
            }
        });
        await loadData();
    } catch (err) {
        alert(err.response?.data?.message || err.message || 'Failed to approve joining');
        console.error('Error approving joining:', err);
    }
};
</script>
