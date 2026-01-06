<!--
List of applications
List of interviews
list of CV new/OLD
Evaluation
Move to Employee Register
-->
<template>
    <div>
        <template v-if="!isChildRoute">
            <CKCardList :loading="loading" :title="title" :show-add="true" @handleAdd="handleAdd" v-model="searchQuery">
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
                        <b>{{ row.original.name || '-' }}</b>
                    </div>
                </template>
                <template #phone_number-cell="{ row }">
                    {{ row.original.phone_number || '-' }}
                </template>
                <template #address-cell="{ row }">
                    <div class="max-w-xs whitespace-normal break-words text-sm">
                        {{ row.original.address || '-' }}
                    </div>
                </template>
                <template #post_applied-cell="{ row }">
                    <UBadge variant="soft" color="primary">
                        {{ row.original.post_applied || '-' }}
                    </UBadge>
                </template>
                <template #application_status-cell="{ row }">
                    <UBadge 
                        variant="subtle"
                        :color="getStatusColor(row.original.application_status)"
                    >
                        {{ row.original.application_status || 'Pending' }}
                    </UBadge>
                </template>
                <template #action-cell="{ row }">
                    <div class="flex gap-1 flex-wrap">
                        <!-- HR Associate Verify Button -->
                        <UButton 
                            size="xs" 
                            variant="solid" 
                            color="info"
                            @click="handleAssociateVerify(row.original)"
                        >
                            HR Associate Verify
                        </UButton>
                        
                        <!-- HR Character Verify Button -->
                        <UButton 
                            size="xs" 
                            variant="solid" 
                            color="info"
                            @click="handleCharacterVerify(row.original)"
                        >
                            HR Character Verify
                        </UButton>
                        
                        <!-- HR Qualification Verify Button -->
                        <UButton 
                            size="xs" 
                            variant="solid" 
                            color="info"
                            @click="handleQualificationVerify(row.original)"
                        >
                            HR Qualification Verify
                        </UButton>
                        
                        <!-- HR Registration Verify Button -->
                        <UButton 
                            size="xs" 
                            variant="solid" 
                            color="info"
                            @click="handleRegistrationVerify(row.original)"
                        >
                            HR Registration Verify
                        </UButton>
                        
                        <!-- HR Application Status Button -->
                        <UButton 
                            size="xs" 
                            variant="solid" 
                            color="info"
                            @click="handleApplicationStatus(row.original)"
                        >
                            HR Application Status
                        </UButton>
                        
                        <!-- Interview Buttons -->
                        <UButton 
                            v-for="round in [1, 2]" 
                            :key="round"
                            size="xs" 
                            variant="solid" 
                            color="info"
                            @click="handleInterview(row.original, round)"
                        >
                            Interview {{ round }}
                        </UButton>
                        
                        <!-- CV Evaluation Button -->
                        <UButton 
                            size="xs" 
                            variant="solid" 
                            color="primary"
                            @click="handleCVEvaluation(row.original)"
                        >
                            CV Evaluation
                        </UButton>
                        
                        <!-- Accept Button -->
                        <UButton 
                            size="xs" 
                            color="warning"
                            @click="handleAccept(row.original)"
                        >
                            Accept
                        </UButton>
                        
                        <!-- Reject Button -->
                        <UButton 
                            size="xs" 
                            color="error"
                            @click="handleReject(row.original)"
                        >
                            Reject
                        </UButton>
                    </div>
                </template>
            </UTable>
        </CKCardList>
        </template>
        
        <!-- Child Route Renderer -->
        <NuxtPage />

        <!-- CV Evaluation Form Modal -->
        <CKFormModal
            v-model="cvEvaluationModel"
            title="CV Evaluation"
            :endPoint="'/hrm/job_application'"
            :formCode="'hr_cv_evaluation'"
            :id="cvEvaluationId"
            :params="cvEvaluationParams"
            @handleFormSubmit="handleCVEvaluationSubmit"
        />

        <!-- HR Associate Verify Form Modal -->
        <CKFormModal
            v-model="associateVerifyModel"
            title="HR Associate Verify"
            :endPoint="'/hrm/job_application'"
            :submitEndPoint="'/hrm/job_application'"
            :formCode="'hr_associate_verify'"
            :id="associateVerifyId"
            :params="associateVerifyParams"
            @handleFormSubmit="handleAssociateVerifySubmit"
        />

        <!-- HR Character Verify Form Modal -->
        <CKFormModal
            v-model="characterVerifyModel"
            title="HR Character Verify"
            :endPoint="'/hrm/job_application'"
            :submitEndPoint="'/hrm/job_application'"
            :formCode="'hr_character_verify'"
            :id="characterVerifyId"
            :params="characterVerifyParams"
            @handleFormSubmit="handleCharacterVerifySubmit"
        />

        <!-- HR Qualification Verify Form Modal -->
        <CKFormModal
            v-model="qualificationVerifyModel"
            title="HR Qualification Verify"
            :endPoint="'/hrm/job_application'"
            :submitEndPoint="'/hrm/job_application'"
            :formCode="'hr_qualification_verify'"
            :id="qualificationVerifyId"
            :params="qualificationVerifyParams"
            @handleFormSubmit="handleQualificationVerifySubmit"
        />

        <!-- HR Registration Verify Form Modal -->
        <CKFormModal
            v-model="registrationVerifyModel"
            title="HR Registration Verify"
            :endPoint="'/hrm/job_application'"
            :submitEndPoint="'/hrm/job_application'"
            :formCode="'hr_registration_verify'"
            :id="registrationVerifyId"
            :params="registrationVerifyParams"
            @handleFormSubmit="handleRegistrationVerifySubmit"
        />

        <!-- HR Application Status Form Modal -->
        <CKFormModal
            v-model="applicationStatusModel"
            title="HR Application Status"
            :endPoint="'/hrm/job_application'"
            :submitEndPoint="'/hrm/job_application'"
            :formCode="'hr_application_status'"
            :id="applicationStatusId"
            :params="applicationStatusParams"
            @handleFormSubmit="handleApplicationStatusSubmit"
        />

        <!-- Interview 1 Form Modal -->
        <CKFormModal
            v-model="interview1Model"
            title="Interview 1"
            :endPoint="'/hrm/job_application'"
            :formCode="'hr_interview_1'"
            :id="interview1Id"
            :params="interview1Params"
            @handleFormSubmit="handleInterview1Submit"
        />

        <!-- Interview 2 Form Modal -->
        <CKFormModal
            v-model="interview2Model"
            title="Interview 2"
            :endPoint="'/hrm/job_application'"
            :formCode="'hr_interview_2'"
            :id="interview2Id"
            :params="interview2Params"
            @handleFormSubmit="handleInterview2Submit"
        />
    </div>
</template>

<script setup>
import CKCardList from "~/components/common/CKCardList.vue";
import CKFormModal from "~/components/common/CKFormModal.vue";

/* ------------------ Default Variables ------------------ */
definePageMeta({ layout: 'home' });
const { $axios } = useNuxtApp()
const route = useRoute()
const router = useRouter()
const title = ref("Job Applications");
const endPoint = ref("/hrm/job_application");
const params = ref({});
const formModel = ref(false);
const id = ref('');

// Check if we're on a child route
const isChildRoute = computed(() => route.path.includes('/applications/new'))

// CV Evaluation Modal
const cvEvaluationModel = ref(false);
const cvEvaluationId = ref('');
const cvEvaluationParams = ref({});

// HR Associate Verify Modal
const associateVerifyModel = ref(false);
const associateVerifyId = ref('');
const associateVerifyParams = ref({});

// HR Character Verify Modal
const characterVerifyModel = ref(false);
const characterVerifyId = ref('');
const characterVerifyParams = ref({});

// HR Qualification Verify Modal
const qualificationVerifyModel = ref(false);
const qualificationVerifyId = ref('');
const qualificationVerifyParams = ref({});

// HR Registration Verify Modal
const registrationVerifyModel = ref(false);
const registrationVerifyId = ref('');
const registrationVerifyParams = ref({});

// HR Application Status Modal
const applicationStatusModel = ref(false);
const applicationStatusId = ref('');
const applicationStatusParams = ref({});

// Interview 1 Modal
const interview1Model = ref(false);
const interview1Id = ref('');
const interview1Params = ref({});

// Interview 2 Modal
const interview2Model = ref(false);
const interview2Id = ref('');
const interview2Params = ref({});

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
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'date_of_application', header: 'Date' },
    { accessorKey: 'phone_number', header: 'Phone' },
    { accessorKey: 'address', header: 'Address' },
    { accessorKey: 'post_applied', header: 'Post Applied' },
    { accessorKey: 'application_status', header: 'Status' },
    { id: 'action' }
]);

const loadData = async () => {
    loading.value = true;
    error.value = null;
    
    try {
        const { data: res } = await $axios.get(endPoint.value);
        
        console.log('API Response:', res);
        
        if (!res.success) {
            error.value = res.message || 'Failed to load applications';
            console.error('API returned unsuccessful response:', res);
            return;
        }
        
        if (!Array.isArray(res.rows)) {
            error.value = res.message || 'Invalid response format - rows is not an array';
            console.error('Invalid response format:', res);
            return;
            }
        
        if (res.rows.length === 0) {
            error.value = 'No applications found';
            data.value = [];
            return;
        }
        
        // Map the direct object structure to table format
        data.value = res.rows.map(app => ({
            id: app.id,
            form_response_id: app.id,
            name: [app.title, app.first_name, app.middle_name, app.last_name]
                .filter(Boolean).join(' ').trim() || '-',
            date_of_application: app.created_at_date || app.created_at || '-',
            phone_number: app.phone_number || '-',
            address: app.local_address_line1 
                ? [app.local_address_line1, app.local_address_line2, app.local_city]
                    .filter(Boolean).join(', ')
                : '-',
            post_applied: app.designation_id || '-', // You might want to fetch designation name
            application_status: app.application_status || 'Pending'
        }));
        
    } catch (err) {
        error.value = err.response?.data?.message || err.message || 'Failed to load applications';
        console.error('Error loading applications:', err);
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
    return data.value.filter(app =>
        (app.name?.toLowerCase().includes(query)) ||
        (app.phone_number?.toLowerCase().includes(query)) ||
        (app.post_applied?.toLowerCase().includes(query)) ||
        (app.application_status?.toLowerCase().includes(query))
    );
});

/* ------------------ Format Date ------------------ */
const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    } catch {
        return dateString;
    }
};

/* ------------------ Get Status Color ------------------ */
const getStatusColor = (status) => {
    if (!status) return 'gray';
    const statusLower = status.toLowerCase();
    if (statusLower.includes('approved') || statusLower.includes('accepted') || statusLower === 'cleared') {
        return 'green';
    } else if (statusLower.includes('rejected') || statusLower === 'rejected') {
        return 'red';
    } else if (statusLower.includes('pending') || statusLower === 'pending') {
        return 'amber';
    } else if (statusLower.includes('interview')) {
        return 'blue';
    }
    return 'gray';
};

/* ------------------ Add Button ------------------ */
const handleAdd = () => {
    router.push('/hrm/recruitment/applications/new');
};

/* ------------------ Form Submit ------------------ */
const handleFormSubmit = async () => {
    formModel.value = false;
    await loadData();
};

/* ------------------ Interview Handler ------------------ */
const handleInterview = (application, round) => {
    const responseId = application.form_response_id || application.id;
    
    if (round === 1) {
        interview1Params.value = {
            id: responseId,
            application_id: responseId,
            form_response_id: responseId
        };
        interview1Id.value = responseId;
        interview1Model.value = true;
    } else if (round === 2) {
        interview2Params.value = {
            id: responseId,
            application_id: responseId,
            form_response_id: responseId
        };
        interview2Id.value = responseId;
        interview2Model.value = true;
    }
};

const handleInterview1Submit = async () => {
    interview1Model.value = false;
    await loadData();
};

const handleInterview2Submit = async () => {
    interview2Model.value = false;
    await loadData();
};

/* ------------------ CV Evaluation Handler ------------------ */
const handleCVEvaluation = (application) => {
    const responseId = application.form_response_id || application.id;
    cvEvaluationParams.value = { 
        id: responseId,
        application_id: responseId,
        form_response_id: responseId,
        form_code: 'hr_cv_evaluation'
    };
    cvEvaluationId.value = responseId;
    cvEvaluationModel.value = true;
};

const handleCVEvaluationSubmit = async () => {
    cvEvaluationModel.value = false;
    await loadData();
};

/* ------------------ HR Associate Verify Handler ------------------ */
const handleAssociateVerify = (application) => {
    const responseId = application.form_response_id || application.id;
    // Set id in params so DynamicForm uses PATCH method
    associateVerifyParams.value = { 
        id: responseId,
        application_id: responseId,
        form_response_id: responseId
    };
    associateVerifyId.value = responseId;
    associateVerifyModel.value = true;
};

const handleAssociateVerifySubmit = async () => {
    associateVerifyModel.value = false;
    await loadData();
};

/* ------------------ HR Character Verify Handler ------------------ */
const handleCharacterVerify = (application) => {
    const responseId = application.form_response_id || application.id;
    characterVerifyParams.value = { 
        id: responseId,
        application_id: responseId,
        form_response_id: responseId
    };
    characterVerifyId.value = responseId;
    characterVerifyModel.value = true;
};

const handleCharacterVerifySubmit = async () => {
    characterVerifyModel.value = false;
    await loadData();
};

/* ------------------ HR Qualification Verify Handler ------------------ */
const handleQualificationVerify = (application) => {
    const responseId = application.form_response_id || application.id;
    qualificationVerifyParams.value = { 
        id: responseId,
        application_id: responseId,
        form_response_id: responseId
    };
    qualificationVerifyId.value = responseId;
    qualificationVerifyModel.value = true;
};

const handleQualificationVerifySubmit = async () => {
    qualificationVerifyModel.value = false;
    await loadData();
};

/* ------------------ HR Registration Verify Handler ------------------ */
const handleRegistrationVerify = (application) => {
    const responseId = application.form_response_id || application.id;
    registrationVerifyParams.value = { 
        id: responseId,
        application_id: responseId,
        form_response_id: responseId
    };
    registrationVerifyId.value = responseId;
    registrationVerifyModel.value = true;
};

const handleRegistrationVerifySubmit = async () => {
    registrationVerifyModel.value = false;
    await loadData();
};

/* ------------------ HR Application Status Handler ------------------ */
const handleApplicationStatus = (application) => {
    const responseId = application.form_response_id || application.id;
    applicationStatusParams.value = { 
        id: responseId,
        application_id: responseId,
        form_response_id: responseId
    };
    applicationStatusId.value = responseId;
    applicationStatusModel.value = true;
};

const handleApplicationStatusSubmit = async () => {
    applicationStatusModel.value = false;
    await loadData();
};

/* ------------------ Accept Handler ------------------ */
const handleAccept = async (application) => {
    try {
        const responseId = application.form_response_id || application.id;
        await $axios.post('/form/defaultForm', {
            form_response_id: responseId,
            application_status: 'Accepted'
        }, {
            params: {
                form_code: 'hr_job_application',
                form_response_id: responseId
            }
        });
        await loadData();
    } catch (err) {
        alert(err.response?.data?.message || err.message || 'Failed to accept application');
        console.error('Error accepting application:', err);
    }
};

/* ------------------ Reject Handler ------------------ */
const handleReject = async (application) => {
    try {
        const responseId = application.form_response_id || application.id;
        await $axios.post('/form/defaultForm', {
            form_response_id: responseId,
            application_status: 'Rejected'
        }, {
            params: {
                form_code: 'hr_job_application',
                form_response_id: responseId
            }
        });
        await loadData();
    } catch (err) {
        alert(err.response?.data?.message || err.message || 'Failed to reject application');
        console.error('Error rejecting application:', err);
    }
};
</script>
