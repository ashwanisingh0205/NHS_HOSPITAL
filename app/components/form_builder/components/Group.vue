<template>
    <div class="w-full">
        <UCard class="h-full">
            <template v-if="field.label || field.title" #header>
                <div :style="field.label_style">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                        {{ field.label || field.title }}
                    </h3>
                </div>
            </template>
            <div class="space-y-4">
                <FormRenderer :fields="field.fields" :cols="cols" />
            </div>
        </UCard>
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
