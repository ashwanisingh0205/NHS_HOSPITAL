<!--
List of applications
List of interviews
list of CV new/OLD
Evaluation
Move to Employee Register
-->
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
                <template #date_of_application-cell="{ row }">
                    {{ formatDate(row.original.date_of_application) }}
                </template>
                <template #phone_number-cell="{ row }">
                    {{ row.original.phone_number || '-' }}
                </template>
                <template #address-cell="{ row }">
                    {{ row.original.address || '-' }}
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

        <!-- New Application Form Modal -->
        <CKFormModal
            v-model="formModel"
            :title="params.id ? 'Edit Application' : 'New Application'"
            :endPoint="'/form/defaultForm'"
            :submitEndPoint="'/hrm/job_application'"
            :formCode="'hr_job_application'"
            :id="id"
            :params="params"
            @handleFormSubmit="handleFormSubmit"
        />

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

        <!-- Interview Remark Modal -->
        <UModal v-model:open="interviewRemarkModel" :title="`Interview ${selectedInterviewRound} - Remarks`">
            <template #body>
                <div class="space-y-4">
                    <UFormField label="Remarks">
                        <UTextarea 
                            v-model="interviewRemark" 
                            placeholder="Enter interview remarks..."
                            :rows="6"
                        />
                    </UFormField>
                    <div class="flex gap-2 justify-end">
                        <UButton 
                            @click="saveInterviewRemark"
                            :loading="savingRemark"
                        >
                            Save
                        </UButton>
                        <UButton 
                            variant="outline" 
                            @click="interviewRemarkModel = false"
                        >
                            Cancel
                        </UButton>
                    </div>
                </div>
            </template>
        </UModal>
    </div>
</template>

<script setup>
import CKCardList from "~/components/common/CKCardList.vue";
import CKFormModal from "~/components/common/CKFormModal.vue";

/* ------------------ Default Variables ------------------ */
definePageMeta({ layout: 'home' });
const { $axios } = useNuxtApp()
const title = ref("Job Applications");
const endPoint = ref("/hrm/job_application");
const params = ref({});
const formModel = ref(false);
const id = ref('');

// CV Evaluation Modal
const cvEvaluationModel = ref(false);
const cvEvaluationId = ref('');
const cvEvaluationParams = ref({});

// HR Associate Verify Modal
const associateVerifyModel = ref(false);
const associateVerifyId = ref('');
const associateVerifyParams = ref({});

// Interview Remark Modal
const interviewRemarkModel = ref(false);
const interviewRemark = ref('');
const selectedInterviewRound = ref(1);
const selectedApplicationId = ref(null);
const savingRemark = ref(false);

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
    params.value = {};
    id.value = '';
    formModel.value = true;
};

/* ------------------ Form Submit ------------------ */
const handleFormSubmit = async () => {
    formModel.value = false;
    await loadData();
};

/* ------------------ Interview Handler ------------------ */
const handleInterview = (application, round) => {
    selectedApplicationId.value = application.form_response_id || application.id;
    selectedInterviewRound.value = round;
    interviewRemark.value = application[`remark${round}`] || application[`interview_remark_${round}`] || '';
    interviewRemarkModel.value = true;
};

const saveInterviewRemark = async () => {
    savingRemark.value = true;
    try {
        // Save interview remark via API
        const remarkField = `remark${selectedInterviewRound.value}`;
        const payload = {
            form_response_id: selectedApplicationId.value,
            [remarkField]: interviewRemark.value
        };
        
        // Update the application with interview remark
        await $axios.post('/form/defaultForm', payload, {
            params: {
                form_code: 'hr_job_application',
                form_response_id: selectedApplicationId.value
            }
        });
        
        interviewRemarkModel.value = false;
        await loadData();
    } catch (err) {
        alert(err.response?.data?.message || err.message || 'Failed to save interview remark');
        console.error('Error saving interview remark:', err);
    } finally {
        savingRemark.value = false;
    }
};

/* ------------------ CV Evaluation Handler ------------------ */
const handleCVEvaluation = (application) => {
    const responseId = application.form_response_id || application.id;
    cvEvaluationParams.value = { 
        application_id: responseId,
        form_response_id: responseId
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
