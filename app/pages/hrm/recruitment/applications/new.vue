<template>
    <div>
        <div class="mb-6 flex items-center justify-between">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
                New Application
            </h1>
            <UButton variant="outline" icon="lucide:arrow-left" @click="goBack">
                Back
            </UButton>
        </div>

        <DynamicForm
            :formCode="'hr_job_application'"
            :endPoint="'/hrm/job_application'"
            @submit="handleFormSubmit"
        />
    </div>
</template>

<script setup>
import DynamicForm from "~/components/emr/DynamicForm.vue";

definePageMeta({
    layout: 'home'
})

const router = useRouter()

const handleFormSubmit = async (submitData) => {
    if (submitData?.error) {
        alert(submitData.error?.message || 'Failed to submit form');
        return;
    }
    
    // DynamicForm already handles the API submission
    // Just redirect on success
    if (submitData?.payload) {
        router.push('/hrm/recruitment/applications');
    }
}

const goBack = () => router.push('/hrm/recruitment/applications')
</script>
