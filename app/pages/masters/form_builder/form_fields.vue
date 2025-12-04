<template>
  <div class="w-full">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <UButton
              @click="navigateTo('/masters/form_builder/forms')"
              icon="i-lucide:arrow-left"
              variant="outline"
              color="neutral"
              size="sm"
            />
            <h2 class="text-lg font-semibold">
              Form Field
              <span v-if="selectedForm" class="text-sm text-gray-500 font-normal">
                - {{ selectedForm.title }}
              </span>
            </h2>
          </div>
          <UButton
            @click="handleNewFormField"
            icon="i-lucide:plus"
            label="New"
            color="info"
          />
        </div>
      </template>

      <div v-if="selectedForm" class="space-y-2">
        <UCard
          v-for="(field, index) in selectedFormFields"
          :key="field.id || index"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <UBadge :label="field.type" color="error" size="xs" />
                <span class="text-xs text-gray-500">{{ field.id }}</span>
              </div>
              <p class="text-sm mb-1">{{ field.description }}</p>
              <code class="text-xs text-gray-500">{{ field.key }}</code>
            </div>
            <UButton
              @click="handleFormFieldEdit(field)"
              size="xs"
              icon="i-lucide:pencil"
              variant="outline"
              color="neutral"
            />
          </div>
        </UCard>
      </div>
     
    </UCard>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'home' });

const route = useRoute();

// Mock forms data - in production, this would come from an API/store
const forms = [
  { id: 1, title: 'DIABETIC FLOW SHEET' },
  { id: 2, title: 'Doctor Diabetic Flow Sheet' },
  { id: 3, title: 'Doctor Urinary Catheterization Checklist' },
  { id: 4, title: 'EMERGENCY NURSING ASSESSMENT SHEET' },
  { id: 5, title: 'PATIENT VITALS RECORD' }
];

// Mock form fields data - in production, this would come from an API
const formFieldsData = {
  1: [
    { type: 'TEXT', id: 101, description: 'Patient chief complaint', key: 'CHIEF-COMPLAINT' },
    { type: 'TEXTAREA', id: 102, description: 'Detailed complaint description', key: 'COMPLAINT-DETAIL' },
    { type: 'TEXT', id: 201, description: 'Onset of symptoms', key: 'ONSET' },
    { type: 'TEXT', id: 202, description: 'Duration of illness', key: 'DURATION' },
    { type: 'RADIO', id: 301, description: 'Smoking status', key: 'SMOKING-STATUS' },
    { type: 'TEXT', id: 401, description: 'Medication name', key: 'MEDICATION-NAME' }
  ],
  2: [
    { type: 'TEXT', id: 101, description: 'Patient chief complaint', key: 'CHIEF-COMPLAINT' },
    { type: 'TEXTAREA', id: 102, description: 'Detailed complaint description', key: 'COMPLAINT-DETAIL' },
    { type: 'TEXT', id: 201, description: 'Onset of symptoms', key: 'ONSET' },
    { type: 'RADIO', id: 301, description: 'Smoking status', key: 'SMOKING-STATUS' },
    { type: 'TEXT', id: 401, description: 'Medication name', key: 'MEDICATION-NAME' }
  ],
  3: [
    { type: 'RADIO', id: 696, description: '1. Identified the patient and checked doctor\'s order', key: 'DOCTORS-ORDER' },
    { type: 'RADIO', id: 380, description: 'Given dorsal recumbent position and draped patient.', key: 'DORSAL-RECUMBENT' },
    { type: 'RADIO', id: 384, description: 'Applied sterile drape and applied sterile gloves', key: 'APPLIED-STERILE' },
    { type: 'TEXT', id: 377, description: 'State the reason for catheterization', key: 'STATE' },
    { type: 'RADIO', id: 381, description: 'The urethral meatus was cleaned with sterile saline and betadine.', key: 'URETHRAL-MEATUS' },
    { type: 'TEXT', id: 382, description: 'Foley\'s size', key: 'FOLEYS-SIZE' }
  ],
  4: [
    { type: 'TEXT', id: 601, description: 'Blood Pressure', key: 'BP' },
    { type: 'TEXT', id: 602, description: 'Heart Rate', key: 'HR' },
    { type: 'TEXT', id: 603, description: 'Temperature', key: 'TEMP' },
    { type: 'TEXT', id: 604, description: 'Respiratory Rate', key: 'RR' }
  ],
  5: [
    { type: 'TEXT', id: 801, description: 'Systolic BP', key: 'SYS-BP' },
    { type: 'TEXT', id: 802, description: 'Diastolic BP', key: 'DIA-BP' },
    { type: 'TEXT', id: 803, description: 'Pulse', key: 'PULSE' }
  ]
};

// Get selected form based on query parameter
const selectedForm = computed(() => {
  const formId = Number(route.query.id);
  return forms.find(f => f.id === formId) || null;
});

// Get form fields for selected form
const selectedFormFields = computed(() => {
  if (!selectedForm.value) return [];
  return formFieldsData[selectedForm.value.id] || [];
});

const handleNewFormField = () => {
  console.log('New form field for:', selectedForm.value);
};

const handleFormFieldEdit = (field) => {
  console.log('Edit form field:', field);
};
</script>
