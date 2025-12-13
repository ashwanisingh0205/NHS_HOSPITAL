<template>
    <div class="w-full ">
        <div v-if="field.label || field.title" :style="field.label_style" class="mb-2">
            <span class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ field.label || field.title }}
            </span>
        </div>
        <div class="border border-gray-200 rounded-lg p-5 bg-white dark:bg-gray-800 dark:border-gray-800 dark:rounded-2xl">
            <div :class="getGridClass()">
                <FormRenderer :fields="field.fields" :cols="cols" />
            </div>
            
                
            
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
    cols: {
        type: Number,
        default: 3,
    },
});
function getGridClass() {
    const colsMap = {
        1: 'grid grid-cols-1 gap-4',
        2: 'grid grid-cols-2 gap-4',
        3: 'grid grid-cols-3 gap-4',
        4: 'grid grid-cols-4 gap-4',
        5: 'grid grid-cols-5 gap-4',
        6: 'grid grid-cols-6 gap-4',
    };
    return colsMap[props.cols] || 'grid grid-cols-3 gap-4';
}

</script>
