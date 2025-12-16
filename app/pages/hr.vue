<template>
  <div class="container mt-4">
    <h1 class="text-2xl font-bold mb-6">HR Forms</h1>
    
    <!-- Forms List -->
   <!-- Forms List -->
   <div v-if="!selectedForm && !loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <UCard v-for="form in forms" :key="form.id" @click="selectForm(form)" :ui="{
        root: 'border-2 border-cyan-500 rounded-xl cursor-pointer',
        body: 'p-4 space-y-2'
      }">
        <div class="flex items-start justify-between mb-3">
          <h3 class="text-lg font-semibold text-gray-900">{{ form.form_name }}</h3>
          <div class="flex gap-1">
            <UIcon v-if="form.whatsapp_template_id" name="i-logos-whatsapp-icon" class="w-5 h-5" />
            <UIcon v-if="form.pdf_id" name="i-heroicons-document-text-solid" class="w-5 h-5 text-orange-500" />
          </div>
        </div>

        <div class="flex items-center gap-2 text-sm text-gray-600">
          <UIcon name="i-heroicons-tag-solid" class="text-cyan-500" />
          <span>Code: <span class="text-gray-900">{{ form.form_code }}</span></span>
        </div>

        <div class="flex items-center gap-2 text-sm text-gray-600">
          <UIcon name="i-heroicons-document-text-solid" class="text-cyan-500" />
          <span>Type: <UBadge color="cyan" size="xs" variant="soft">{{ form.form_type }}</UBadge></span>
        </div>

        <div v-if="form.category_id" class="flex items-center gap-2 text-sm text-gray-600">
          <UIcon name="i-heroicons-folder-solid" class="text-cyan-500" />
          <span>Category: {{ form.category_id }}</span>
        </div>

        <div v-if="form.corporate_id" class="flex items-center gap-2 text-sm text-gray-600">
          <UIcon name="i-heroicons-building-office-solid" class="text-cyan-500" />
          <span>Corp/Unit: {{ form.corporate_id }}</span>
        </div>

        <div v-if="form.frequency" class="flex items-center gap-2 text-sm text-gray-600">
          <UIcon name="i-heroicons-calendar-solid" class="text-cyan-500" />
          <span>Frequency: <span class="text-gray-900">{{ form.frequency }}</span></span>
        </div>
      </UCard>
    </div>

    <!-- Selected Form Details -->
    <div v-if="selectedForm">
      <div class="mb-4 flex items-center gap-4">
        <UButton @click="selectedForm = null" icon="i-lucide:arrow-left" variant="outline">
          Back to Forms
        </UButton>
        <h2 class="text-xl font-bold">{{ selectedForm.form_name }}</h2>
      </div>
      
      <form v-if="formConfig">
        <FormRenderer :fields="formConfig.fields" />
      </form>
    </div>

    <div v-if="loading" class="mt-4">Loading...</div>
    <div v-if="error" class="mt-4 text-red-500">Error: {{ error }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import FormRenderer from '../components/form_builder/FormRenderer.vue';

definePageMeta({ layout: 'home' });

const forms = ref([]);
const selectedForm = ref(null);
const formConfig = ref(null);
const loading = ref(false);
const error = ref(null);

const applyWidthCalculation = (fields) => {
  fields.forEach(f => {
    let labelWidth = f.label_width;
    if (typeof labelWidth === "string" && labelWidth.includes('%')) {
      labelWidth = Number.parseInt(labelWidth.replace('%', ''), 10);
    }
    if (!labelWidth || labelWidth === 0) {
      labelWidth = 30;
    }
    f.value_width = 100 - labelWidth;
    f.label_width = labelWidth;
    if (Array.isArray(f.fields)) {
      applyWidthCalculation(f.fields);
    }
  });
};

const loadForms = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await axios.get('http://13.200.174.164:3001/v1/masters/forms/form');
    const data = response.data;
    if (data.success && Array.isArray(data.forms)) {
      forms.value = data.forms;
    } else {
      error.value = 'Invalid response format from API';
    }
  } catch (err) {
    error.value = err.response?.data?.message || err.message || 'Failed to load forms';
  } finally {
    loading.value = false;
  }
};

const selectForm = async (form) => {
  selectedForm.value = form;
  loading.value = true;
  error.value = null;
  try {
    const response = await axios.get('http://13.200.174.164:3001/v1/hrm/form_department', {
      params: { form_code: form.form_code }
    });
    const data = response.data;
    if (data.success && data.form && data.fields) {
      formConfig.value = {
        form: data.form,
        fields: data.fields,
        fieldMap: data.fieldMap || {}
      };
      applyWidthCalculation(formConfig.value.fields);
    } else {
      error.value = 'Failed to load form details';
    }
  } catch (err) {
    error.value = err.response?.data?.message || err.message || 'Failed to load form details';
  } finally {
    loading.value = false;
  }
};

onMounted(() => loadForms());
</script>