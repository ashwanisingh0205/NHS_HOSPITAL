<template>
    <UCard :ui="{ body: 'sm:p-0 p-0'}">
        <template #header>
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-lg font-semibold">{{ title }}</h2>
                <CKAdd
                    :loading="loading"
                    :disabled="loading"
                    @click="handleAdd" />
            </div>
            <CKSearch
                v-model="localValue" />
        </template>
        
        <slot />
    </UCard>

</template>

<script setup>
import CKSearch from "~/components/common/CKSearch.vue";
import CKAdd from "~/components/common/CKAdd.vue";

const props = defineProps({
    modelValue: { type: String, default: "" },
    loading: { type: Boolean, default: false },
    title: { type: String, default: "Title" },
})


const emit = defineEmits(['update:modelValue', 'handleAdd']);
const handleAdd = async (submitData) => {
    emit('handleAdd')
}

/* --------------- Model Value: emit and bind with 'localValue' --------------- */
const localValue = ref(props.modelValue)
watch(localValue, (val) => {
    emit('update:modelValue', val)
})
watch(() => props.modelValue, (val) => {
    localValue.value = val
})
</script>

