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
                        <!-- Interview Buttons -->
                        <UButton 
                            v-for="round in [1, 2, 3]" 
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
            :formCode="'hr_job_application'"
            :id="id"
            :params="params"
            @handleFormSubmit="handleFormSubmit"
        />

        <!-- CV Evaluation Form Modal -->
        <CKFormModal
            v-model="cvEvaluationModel"
            title="CV Evaluation"
            :endPoint="'/form/defaultForm'"
            :formCode="'hr_cv_evaluation'"
            :id="cvEvaluationId"
            :params="cvEvaluationParams"
            @handleFormSubmit="handleCVEvaluationSubmit"
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
const endPoint = ref("/form/defaultForm");
const params = ref({});
const formModel = ref(false);
const id = ref('');

// CV Evaluation Modal
const cvEvaluationModel = ref(false);
const cvEvaluationId = ref('');
const cvEvaluationParams = ref({});

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
        const response = await $axios.get(endPoint.value, {
            params: { 
                form_code: 'hr_job_application'
            }
        });
        const temp = response.data;
        
        // Handle API response structure with response_values
        if (temp.success && Array.isArray(temp.response_values)) {
            // Helper function to parse JSON string values
            const parseValue = (valueStr) => {
                if (!valueStr) return '';
                try {
                    const valueArray = JSON.parse(valueStr);
                    return Array.isArray(valueArray) ? valueArray[0] : valueArray;
                } catch {
                    return valueStr;
                }
            };
            
            // Group fields by form_response_id
            const groupedByResponseId = {};
            
            temp.response_values.forEach(item => {
                const responseId = item.form_response_id;
                
                if (!groupedByResponseId[responseId]) {
                    groupedByResponseId[responseId] = {
                        id: responseId,
                        form_response_id: responseId
                    };
                }
                
                // Parse the value field (it's a JSON string like "[\"value\"]")
                const parsedValue = parseValue(item.value);
                
                // Map field_code to property name
                const fieldCode = item.field_code;
                groupedByResponseId[responseId][fieldCode] = parsedValue;
            });
            
            // Convert to array and map to display fields
            data.value = Object.values(groupedByResponseId).map(app => {
                // Build full name from title, first_name, last_name
                const title = app.title || '';
                const firstName = app.first_name || '';
                const lastName = app.last_name || '';
                const fullName = [title, firstName, lastName].filter(Boolean).join(' ').trim() || '-';
                
                return {
                    id: app.form_response_id,
                    form_response_id: app.form_response_id,
                    name: fullName,
                    date_of_application: app.date_of_application || '-',
                    phone_number: app.phone_number || '-',
                    address: app.address || '-',
                    post_applied: app.post_applied_for || '-',
                    application_status: app.application_status || 'Pending'
                };
            });
        } else {
            error.value = temp.message || 'Invalid response format from API';
        }
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
