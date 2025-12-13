<template>
    <UFormField :label="field.label">
        <div class="border border-gray-200 rounded-lg p-5 bg-white dark:bg-gray-800 dark:border-gray-800 dark:rounded-2xl">
            <FormRenderer :fields="field.fields" />
        </div>
    </UFormField>
</template>

<script setup>
import FormRenderer from "../FormRenderer.vue";

const props = defineProps({
    field: {
        type: Object,
        required: true,
    },
});
</script>
