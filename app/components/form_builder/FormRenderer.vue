** Render form components

** Rows & Cols
** Table, Card, Group, Tabs
** Child components >> Text, Number, Date, Select, Checkbox, Radio


<template>
    <template v-for="field in fields" :key="field.id">
        <Group 
            v-if="field.data_type === 'GROUP'" 
            :field="field" 
            :cols="cols"
        />
        
        <div v-else-if="field.data_type === 'TABLE'" class="col-span-full">
            <Table 
                :field="field" 
            />
        </div>
        <Card 
            v-else-if="field.data_type === 'CARD'" 
            :field="field" 
        />
        <FormWrapper 
            v-else 
            :field="field" 
        />
    </template>
</template>

<script setup>
import Group from './components/Group.vue';
import FormWrapper from './FormWrapper.vue';
import Card from './components/Card.vue';
import Table from './components/Table.vue';

const props = defineProps({
    fields: {
        type: Array,
        required: true,
    },
    cols: {
        type: Number,
        default: 1,
    },
});
</script>
