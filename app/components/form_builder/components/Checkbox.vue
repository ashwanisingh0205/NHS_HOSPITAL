<template>
    <div class="flex items-center gap-2">
        <UCheckbox 
            v-model="field.value" 
            :icon="field.icon"
            :label="field.label"
        />
    </div>
</template>
<script setup>
const props = defineProps({
    field: { type: Object, required: true },
});
</script>
