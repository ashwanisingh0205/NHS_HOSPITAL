<!-- List of components >> Text, Number, Date, Select, Checkbox, Radio, File, etc. -->

<template>
    <div class="mb-4">
        <Text v-if="field.data_type === 'TEXT'" :field="field" />
        <Number v-if="field.data_type === 'NUMBER'" :field="field" />
        <Date v-if="field.data_type === 'DATE'" :field="field" />
        <Date v-if="field.data_type === 'DATETIME'" :field="field" />
        <TextArea v-if="field.data_type === 'TEXTAREA'" :field="field" />
        <Switch v-if="field.data_type === 'SWITCH'" :field="field" />
        <Checkbox v-if="field.data_type === 'CHECKBOX'" :field="field" />
        <Radio v-if="field.data_type === 'RADIO'" :field="field" />
        <Dropdown v-if="field.data_type === 'DROPDOWN'" :field="field" />
        <DropdownSearch v-if="field.data_type === 'DROPDOWN_SEARCH'" :field="field" />
        <File v-if="field.data_type === 'FILE'" :field="field" />
        <Table v-if="field.data_type === 'TABLE'" :field="field" class="mb-2" />
    </div>
</template>

<script setup>
import Text from "./components/Text.vue";
import Number from "./components/Number.vue";
import Date from "./components/Date.vue";
import Radio from "./components/Radio.vue";
import TextArea from "./components/TextArea.vue";
import Switch from "./components/Switch.vue";
import Checkbox from "./components/Checkbox.vue";
import Dropdown from "./components/Dropdown.vue";
import DropdownSearch from "./components/DropdownSearch.vue";
import File from "./components/File.vue";
import Table from "./components/Table.vue";

const props = defineProps({
    field: {
        type: Object,
        required: true,
    },
});
</script>
