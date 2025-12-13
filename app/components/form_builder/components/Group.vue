<template>
    <div class="w-full">
        <div v-if="field.label || field.title" :style="field.label_style" class="mb-2">
            <span class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ field.label || field.title }}
            </span>
        </div>
        <div class="border border-gray-200 rounded-lg p-5 bg-white">
            <FormRenderer :fields="field.fields" />
        </div>
    </div>
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
