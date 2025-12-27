<!--
Complete profile show progress for profile
Employee Verification
Buttons for different Assessments
Print Stationery Offer letter/appointment letter/
Joining Kit
Provisional/Probation Period
-->
<template>
    <div class="p-6 space-y-6">
        <div class="flex items-center justify-between mb-6">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Employee Joining Process</h1>
        </div>

        <UStepper :items="stepperItems" v-model="currentStep" class="w-full mb-8" />

        <UCard>
            <template #header>
                <div class="flex items-center justify-between">
                    <h2 class="text-lg font-semibold">{{ stepperItems[currentStep]?.title }}</h2>
                    <div class="flex gap-2">
                        <UButton 
                            v-if="currentStep > 0"
                            variant="outline" 
                            icon="lucide:chevron-left"
                            @click="previousStep"
                        >
                            Previous
                        </UButton>
                        <UButton 
                            v-if="currentStep < stepperItems.length - 1"
                            icon="lucide:chevron-right"
                            @click="nextStep"
                        >
                            Next
                        </UButton>
                        <UButton 
                            v-if="currentStep === stepperItems.length - 1"
                            color="primary"
                            icon="lucide:check"
                            @click="handleApprove"
                        >
                            Approve & Complete
                        </UButton>
                    </div>
                </div>
            </template>

            <!-- Step 1: Profile -->
            <div v-if="currentStep === 0" class="p-6">
                <FormRenderer :fields="profileFields" :cols="2" />
            </div>

            <!-- Step 2: Employee Verification -->
            <div v-if="currentStep === 1" class="p-6">
                <div class="space-y-4">
                    <h3 class="text-lg font-semibold mb-4">Employee Verification Checklist</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <UCard>
                            <div class="flex items-center justify-between">
                                <div>
                                    <h4 class="font-medium">Identity Verification</h4>
                                    <p class="text-sm text-gray-500">Aadhar, PAN, Passport</p>
                                </div>
                                <UCheckbox v-model="verification.identity" />
                            </div>
                        </UCard>
                        <UCard>
                            <div class="flex items-center justify-between">
                                <div>
                                    <h4 class="font-medium">Educational Documents</h4>
                                    <p class="text-sm text-gray-500">Degree, Certificates</p>
                                </div>
                                <UCheckbox v-model="verification.education" />
                            </div>
                        </UCard>
                        <UCard>
                            <div class="flex items-center justify-between">
                                <div>
                                    <h4 class="font-medium">Previous Employment</h4>
                                    <p class="text-sm text-gray-500">Experience Letters</p>
                                </div>
                                <UCheckbox v-model="verification.employment" />
                            </div>
                        </UCard>
                        <UCard>
                            <div class="flex items-center justify-between">
                                <div>
                                    <h4 class="font-medium">Background Check</h4>
                                    <p class="text-sm text-gray-500">Reference Verification</p>
                                </div>
                                <UCheckbox v-model="verification.background" />
                            </div>
                        </UCard>
                    </div>
                </div>
            </div>

            <!-- Step 3: Assessments -->
            <div v-if="currentStep === 2" class="p-6">
                <div class="space-y-4">
                    <h3 class="text-lg font-semibold mb-4">Assessments</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <UCard 
                            v-for="assessment in assessments" 
                            :key="assessment.id"
                            class="cursor-pointer hover:shadow-lg transition-shadow"
                            @click="handleAssessment(assessment)"
                        >
                            <div class="text-center space-y-2">
                                <UIcon :name="assessment.icon" class="w-12 h-12 mx-auto text-primary-500" />
                                <h4 class="font-medium">{{ assessment.name }}</h4>
                                <p class="text-sm text-gray-500">{{ assessment.description }}</p>
                                <UBadge 
                                    :color="assessment.status === 'completed' ? 'green' : 'gray'"
                                    :label="assessment.status === 'completed' ? 'Completed' : 'Pending'"
                                />
                            </div>
                        </UCard>
                    </div>
                </div>
            </div>

            <!-- Step 4: Offer Letter -->
            <div v-if="currentStep === 3" class="p-6">
                <div class="space-y-4">
                    <h3 class="text-lg font-semibold mb-4">Offer Letter</h3>
                    <UCard>
                        <div class="space-y-4">
                            <div class="flex items-center justify-between">
                                <span class="font-medium">Offer Letter Status:</span>
                                <UBadge color="green" label="Generated" />
                            </div>
                            <div class="flex gap-2">
                                <UButton icon="lucide:eye" variant="outline">Preview</UButton>
                                <UButton icon="lucide:download" variant="outline">Download</UButton>
                                <UButton icon="lucide:printer" variant="outline">Print</UButton>
                            </div>
                        </div>
                    </UCard>
                </div>
            </div>

            <!-- Step 5: Appointment Letter -->
            <div v-if="currentStep === 4" class="p-6">
                <div class="space-y-4">
                    <h3 class="text-lg font-semibold mb-4">Appointment Letter</h3>
                    <UCard>
                        <div class="space-y-4">
                            <div class="flex items-center justify-between">
                                <span class="font-medium">Appointment Letter Status:</span>
                                <UBadge color="green" label="Generated" />
                            </div>
                            <div class="flex gap-2">
                                <UButton icon="lucide:eye" variant="outline">Preview</UButton>
                                <UButton icon="lucide:download" variant="outline">Download</UButton>
                                <UButton icon="lucide:printer" variant="outline">Print</UButton>
                            </div>
                        </div>
                    </UCard>
                </div>
            </div>

            <!-- Step 6: Joining Kit -->
            <div v-if="currentStep === 5" class="p-6">
                <div class="space-y-4">
                    <h3 class="text-lg font-semibold mb-4">Joining Kit</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <UCard 
                            v-for="item in joiningKit" 
                            :key="item.id"
                        >
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-3">
                                    <UIcon :name="item.icon" class="w-6 h-6 text-primary-500" />
                                    <div>
                                        <h4 class="font-medium">{{ item.name }}</h4>
                                        <p class="text-sm text-gray-500">{{ item.description }}</p>
                                    </div>
                                </div>
                                <UCheckbox v-model="item.issued" />
                            </div>
                        </UCard>
                    </div>
                </div>
            </div>

            <!-- Step 7: Approve Section -->
            <div v-if="currentStep === 6" class="p-6">
                <div class="space-y-4">
                    <h3 class="text-lg font-semibold mb-4">Final Approval</h3>
                    <UCard>
                        <div class="space-y-4">
                            <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <div>
                                    <h4 class="font-medium">Provisional/Probation Period</h4>
                                    <p class="text-sm text-gray-500">Set probation period duration</p>
                                </div>
                                <UInput 
                                    v-model="probationPeriod" 
                                    type="number" 
                                    placeholder="Days"
                                    class="w-32"
                                />
                            </div>
                            <div class="space-y-2">
                                <UCheckbox v-model="approval.checklist" label="All documents verified" />
                                <UCheckbox v-model="approval.assessments" label="All assessments completed" />
                                <UCheckbox v-model="approval.letters" label="Offer & Appointment letters generated" />
                                <UCheckbox v-model="approval.kit" label="Joining kit prepared" />
                            </div>
                            <div class="pt-4 border-t">
                                <UTextarea 
                                    v-model="approval.remarks" 
                                    placeholder="Add any remarks or notes..."
                                    :rows="4"
                                />
                            </div>
                        </div>
                    </UCard>
                </div>
            </div>
        </UCard>
    </div>
</template>

<script setup lang="ts">
import type { StepperItem } from '@nuxt/ui'
import FormRenderer from '~/components/form_builder/FormRenderer.vue'
import { reactive } from 'vue'

definePageMeta({
    layout: 'home'
})

// Stepper configuration
const currentStep = ref(0)

const stepperItems = ref<StepperItem[]>([
    {
        title: 'Profile',
        description: 'Complete employee profile',
        icon: 'i-lucide-user'
    },
    {
        title: 'Verification',
        description: 'Employee document verification',
        icon: 'i-lucide-shield-check'
    },
    {
        title: 'Assessments',
        description: 'Complete assessments',
        icon: 'i-lucide-clipboard-check'
    },
    {
        title: 'Offer Letter',
        description: 'Generate offer letter',
        icon: 'i-lucide-file-text'
    },
    {
        title: 'Appointment',
        description: 'Generate appointment letter',
        icon: 'i-lucide-briefcase'
    },
    {
        title: 'Joining Kit',
        description: 'Prepare joining kit',
        icon: 'i-lucide-package'
    },
    {
        title: 'Approve',
        description: 'Final approval and completion',
        icon: 'i-lucide-check-circle'
    }
])

// Dummy profile fields data
const profileFields = reactive([
    {
        id: 1,
        field_code: 'first_name',
        data_type: 'TEXT',
        label: 'First Name',
        value: [''],
        required: true
    },
    {
        id: 2,
        field_code: 'last_name',
        data_type: 'TEXT',
        label: 'Last Name',
        value: [''],
        required: true
    },
    {
        id: 3,
        field_code: 'email',
        data_type: 'TEXT',
        label: 'Email',
        value: [''],
        required: true
    },
    {
        id: 4,
        field_code: 'phone_number',
        data_type: 'TEXT',
        label: 'Phone Number',
        value: [''],
        required: true
    },
    {
        id: 5,
        field_code: 'date_of_birth',
        data_type: 'DATE',
        label: 'Date of Birth',
        value: [''],
        required: true
    },
    {
        id: 6,
        field_code: 'address',
        data_type: 'TEXTAREA',
        label: 'Address',
        value: [''],
        required: false
    },
    {
        id: 7,
        field_code: 'designation',
        data_type: 'TEXT',
        label: 'Designation',
        value: [''],
        required: true
    },
    {
        id: 8,
        field_code: 'department',
        data_type: 'TEXT',
        label: 'Department',
        value: [''],
        required: true
    },
    {
        id: 9,
        field_code: 'joining_date',
        data_type: 'DATE',
        label: 'Joining Date',
        value: [''],
        required: true
    },
    {
        id: 10,
        field_code: 'salary',
        data_type: 'NUMBER',
        label: 'Salary',
        value: [0],
        required: true
    }
])

// Verification state
const verification = reactive({
    identity: false,
    education: false,
    employment: false,
    background: false
})

// Assessments data
const assessments = reactive([
    {
        id: 1,
        name: 'Technical Assessment',
        description: 'Technical skills evaluation',
        icon: 'i-lucide-code',
        status: 'pending'
    },
    {
        id: 2,
        name: 'Medical Assessment',
        description: 'Health checkup and fitness',
        icon: 'i-lucide-heart-pulse',
        status: 'pending'
    },
    {
        id: 3,
        name: 'Background Check',
        description: 'Reference and background verification',
        icon: 'i-lucide-search',
        status: 'pending'
    },
    {
        id: 4,
        name: 'Psychometric Test',
        description: 'Personality and aptitude test',
        icon: 'i-lucide-brain',
        status: 'pending'
    }
])

// Joining kit items
const joiningKit = reactive([
    {
        id: 1,
        name: 'ID Card',
        description: 'Employee identification card',
        icon: 'i-lucide-credit-card',
        issued: false
    },
    {
        id: 2,
        name: 'Access Card',
        description: 'Building access card',
        icon: 'i-lucide-key',
        issued: false
    },
    {
        id: 3,
        name: 'Laptop',
        description: 'Work laptop and accessories',
        icon: 'i-lucide-laptop',
        issued: false
    },
    {
        id: 4,
        name: 'Uniform',
        description: 'Company uniform',
        icon: 'i-lucide-shirt',
        issued: false
    },
    {
        id: 5,
        name: 'Handbook',
        description: 'Employee handbook',
        icon: 'i-lucide-book',
        issued: false
    },
    {
        id: 6,
        name: 'Welcome Kit',
        description: 'Welcome package and goodies',
        icon: 'i-lucide-gift',
        issued: false
    }
])

// Approval state
const approval = reactive({
    checklist: false,
    assessments: false,
    letters: false,
    kit: false,
    remarks: ''
})

const probationPeriod = ref(90)

// Methods
const nextStep = () => {
    if (currentStep.value < stepperItems.value.length - 1) {
        currentStep.value++
    }
}

const previousStep = () => {
    if (currentStep.value > 0) {
        currentStep.value--
    }
}

const handleAssessment = (assessment: any) => {
    assessment.status = assessment.status === 'completed' ? 'pending' : 'completed'
}

const handleApprove = () => {
    // Handle final approval
    console.log('Approving joining process...', {
        profile: profileFields,
        verification,
        assessments,
        approval,
        probationPeriod: probationPeriod.value
    })
    // Add your approval logic here
}
</script>
