<template>
  <div class="flex-1 min-w-0">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold">Form List</h2>
          <UButton
            @click="selectedForm = null; isModalOpen = true"
            icon="i-lucide:plus"
            label="New"
            color="info"
          />
        </div>
      </template>

      <div class="space-y-4">
        <FormCard
          v-for="form in forms"
          :key="form.id"
          :form="form"
          :is-selected="selectedForm?.id === form.id"
          @view="handleFormView"
          @edit="selectedForm = form; isModalOpen = true"
        />
      </div>
    </UCard>

    <FormEditModal
      v-model:open="isModalOpen"
      :form="selectedForm"
      @submit="handleFormSubmit"
    />
  </div>
</template>

<script setup>
definePageMeta({ layout: 'home' });

const isModalOpen = ref(false);
const selectedForm = ref(null);

const forms = ref([
  {
    id: 1,
    title: 'DIABETIC FLOW SHEET',
    template: 'Template Name',
    css: 'CSS',
    header: 'Header',
    footer: 'Footer',
    letterhead: 'Letterhead',
    formCode: 'DFS001',
    documentType: 'Document Type 1'
  },
  {
    id: 2,
    title: 'Doctor Diabetic Flow Sheet',
    template: 'Template Name',
    css: 'CSS',
    header: 'Header',
    footer: 'Footer',
    letterhead: 'Letterhead',
    formCode: 'DDFS002',
    documentType: 'Document Type 2'
  },
  {
    id: 3,
    title: 'Doctor Urinary Catheterization Checklist',
    template: 'Template Name',
    css: 'CSS',
    header: 'Header',
    footer: 'Footer',
    letterhead: 'Letterhead',
    formCode: 'DUCC003',
    documentType: 'Document Type 1'
  },
  {
    id: 4,
    title: 'EMERGENCY NURSING ASSESSMENT SHEET',
    template: 'Template Name',
    css: 'CSS',
    header: 'Header',
    footer: 'Footer',
    letterhead: 'Letterhead',
    formCode: 'ENAS004',
    documentType: 'Document Type 3'
  },
  {
    id: 5,
    title: 'PATIENT VITALS RECORD',
    template: 'Template Name',
    css: 'CSS',
    header: 'Header',
    footer: 'Footer',
    letterhead: 'Letterhead',
    formCode: 'PVR005',
    documentType: 'Document Type 2'
  }
]);

const handleFormView = (form) => {
  // Navigate to Form_Field page with form ID as query parameter
  navigateTo(`/masters/form_builder/form_field?id=${form.id}`);
};

const handleFormSubmit = (formData) => {
  if (selectedForm.value) {
    const index = forms.value.findIndex(f => f.id === selectedForm.value.id);
    if (index !== -1) {
      forms.value[index] = {
        ...forms.value[index],
        title: formData.formTitle,
        formCode: formData.formCode,
        template: formData.template,
        css: formData.css,
        header: formData.header,
        footer: formData.footer,
        letterhead: formData.letterhead,
        documentType: formData.documentType
      };
    }
  } else {
    forms.value.push({
      id: forms.value.length + 1,
      title: formData.formTitle,
      formCode: formData.formCode,
      template: formData.template || 'Template Name',
      css: formData.css || 'CSS',
      header: formData.header || 'Header',
      footer: formData.footer || 'Footer',
      letterhead: formData.letterhead || 'Letterhead',
      documentType: formData.documentType
    });
  }
  selectedForm.value = null;
};
</script>
