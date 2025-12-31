<template>
    
    <!-- Text Input Types -->
    <UFormField
        v-if="['TEXT', 'EMAIL', 'NUMBER', 'PASSWORD', 'TEL', 'URL', 'DATE'].includes(field.data_type)"
        :required="field.required"
        :class="['w-full', 'sm:w-' + field.col + '/12']"
        :hint="field.hint"
        :help="field.help"
        :error="field.error"
        :label="field.label">
        <UInput
            v-model="field.value[0]"
            :type="field.data_type.toLowerCase()"
            :placeholder="field.label"
            :icon="field.icon"
            :maxlength="field.data_type === 'NUMBER' ? 10 : undefined"
            class="w-full"
        />
    </UFormField>
    
    <!-- Select Dropdown -->
    <UFormField
        v-else-if="field.data_type === 'DROPDOWN'"
        :required="field.required"
        :class="['w-full', 'sm:w-' + field.col + '/12']"
        :hint="field.hint"
        :help="field.help"
        :error="field.error"
        :label="field.label">
        <USelectMenu
            v-model="field.value[0]"
            :items="field.choices"
            value-key="key"
            label-key="value"
            :icon="field.icon"
            class="w-full"
            :placeholder="field.label"
        />
    </UFormField>
    
    <!-- Textarea -->
    <UFormField
        v-else-if="field.data_type === 'TEXTAREA'"
        :required="field.required"
        :hint="field.hint"
        :help="field.help"
        :error="field.error"
        :label="field.label">
        <UTextarea
            v-model="field.value[0]"
            :placeholder="field.label"
            :rows="field.rows || 4"
            class="w-full"
        />
    </UFormField>
    
    <!-- Single Checkbox -->
    <UFormField
        v-else-if="field.data_type === 'CHECKBOX' && !options.length"
        :required="field.required"
        :hint="field.hint"
        :help="field.help"
        :error="field.error"
        :label="field.label">
        <UCheckbox
            v-model="field.value[0]"
            :label="field.checkboxLabel || field.label"
        />
    </UFormField>
    
    <!-- Multiple Checkboxes -->
    <UFormField
        v-else-if="field.data_type === 'CHECKBOX' && options.length"
        :required="field.required"
        :hint="field.hint"
        :help="field.help"
        :error="field.error"
        :label="field.label">
        <div class="space-y-2">
            <UCheckbox
                v-for="opt in options"
                :key="opt.id || opt.key || opt.value"
                :model-value="isSelected(opt.id || opt.key || opt.value)"
                @update:model-value="toggleCheckbox(opt.id || opt.key || opt.value, $event)"
                :label="opt.value || opt.label || opt.name"
            />
        </div>
    </UFormField>
    
    <!-- Radio -->
    <UFormField
        v-else-if="field.data_type === 'RADIO'"
        :required="field.required"
        :hint="field.hint"
        :help="field.help"
        :error="field.error"
        :label="field.label">
        <div class="flex gap-4">
            <label
                v-for="opt in options"
                :key="opt.id || opt.key || opt.value"
                class="flex items-center gap-2 cursor-pointer"
            >
                <input
                    type="radio"
                    :name="field.id"
                    :value="opt.id || opt.key || opt.value"
                    :checked="field.value[0] === (opt.id || opt.key || opt.value)"
                    @change="field.value[0] = opt.id || opt.key || opt.value"
                    class="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span class="text-sm text-gray-700 dark:text-gray-300">
                    {{ opt.value || opt.label || opt.name }}
                </span>
            </label>
        </div>
    </UFormField>
    
    <!-- Star Rating -->
    <UFormField
        v-else-if="['STAR', 'star'].includes(field.data_type)"
        :required="field.required"
        :hint="field.hint"
        :help="field.help"
        :error="field.error"
        :label="field.label">
        <CKStar
            :model-value="field.value[0]"
            @update:model-value="field.value[0] = $event"
        />
    </UFormField>
</template>

<script setup>
import CKStar from '~/components/common/CKStar.vue'

const props = defineProps({
    field: { type: Object, required: true }
})

const options = computed(() => props.field.choices || props.field.options || [])

onMounted(() => {
    props.field.col = props.field.col>0 ? props.field.col : 4
})

// Checkbox helpers
const isSelected = (value) => {
    const val = props.field.value?.[0]
    return Array.isArray(val) && val.includes(value)
}

const toggleCheckbox = (value, checked) => {
    const current = props.field.value?.[0]
    const arr = Array.isArray(current) ? [...current] : (current ? [current] : [])
    
    if (checked && !arr.includes(value)) {
        arr.push(value)
    } else if (!checked) {
        arr.splice(arr.indexOf(value), 1)
    }
    
    props.field.value[0] = arr
}
</script>
