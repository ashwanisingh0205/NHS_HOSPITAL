<template>
    
    <!-- Text Input Types -->
    <UFormField
        v-if="['TEXT', 'EMAIL', 'NUMBER', 'PASSWORD', 'TEL', 'URL', 'DATE'].includes(field.data_type)"
        :required="field.required"
        :class="fieldClass"
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
        :class="fieldClass"
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
        :class="fieldClass"
        :hint="field.hint"
        :help="field.help"
        :error="field.error"
        :label="field.label">
        <UTextarea
            v-model="field.value[0]"
            :placeholder="field.label"
            :rows="field.rows || 4"
        />
    </UFormField>
    
    <!-- Single Checkbox -->
    <UFormField
        v-else-if="field.data_type === 'CHECKBOX' && !options.length"
        :required="field.required"
        :class="fieldClass"
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
        :class="fieldClass"
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
        :class="fieldClass"
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
        :class="fieldClass"
        :hint="field.hint"
        :help="field.help"
        :error="field.error"
        :label="field.label">
        <CKStar
            :model-value="field.value[0]"
            @update:model-value="field.value[0] = $event"
        />
    </UFormField>
    
    <!-- Emoji Rating -->
    <UFormField
        v-else-if="['EMOJI', 'emoji'].includes(field.data_type)"
        :required="field.required"
        :class="fieldClass"
        :hint="field.hint"
        :help="field.help"
        :error="field.error"
        :label="field.label">
        <CKEmoji
            :model-value="field.value[0]"
            @update:model-value="field.value[0] = $event"
            :emojis="field.emojis || field.choices?.map(c => c.value || c.key) || undefined"
        />
    </UFormField>
</template>

<script setup>
import CKStar from '~/components/common/CKStar.vue'
import CKEmoji from '~/components/common/CKEmoji.vue'




const props = defineProps({
    field: { type: Object, required: true }
})


onMounted(() => {
    // Ensure col has a default value if not provided
    if (!props.field.col || props.field.col <= 0) {
        props.field.col = 6
    }
})



// Computed property for field width class based on col value
const fieldClass = computed(() => {
    const col = props.field.col || 6
    
    
    const colSpanMap = {
      1: 'col-span-12 sm:col-span-1',
      2: 'col-span-12 sm:col-span-2',
      3: 'col-span-12 sm:col-span-3',
      4: 'col-span-12 sm:col-span-4',
      5: 'col-span-12 sm:col-span-5',
      6: 'col-span-12 sm:col-span-6',
      7: 'col-span-12 sm:col-span-7',
      8: 'col-span-12 sm:col-span-8',
      9: 'col-span-12 sm:col-span-9',
      10: 'col-span-12 sm:col-span-10',
      11: 'col-span-12 sm:col-span-11',
      12: 'col-span-12'
    }
    
    // Get the class for the col value, default to 4 if not found
    return colSpanMap[col] || 'col-span-12 sm:col-span-4'
})

const options = computed(() => props.field.choices || props.field.options || [])
// Checkbox helpers
const isSelected = (value) => {
    const val = props.field.value?.[0]
    return Array.isArray(val) && val.includes(value)
}

const toggleCheckbox = (value, checked) => {
    const current = props.field.value?.[0]
    let arr = []
    
    if (Array.isArray(current)) {
        arr = [...current]
    } else if (current) {
        arr = [current]
    }
    
    if (checked && !arr.includes(value)) {
        arr.push(value)
    } else if (!checked) {
        arr.splice(arr.indexOf(value), 1)
    }
    
    props.field.value[0] = arr
}
</script>
