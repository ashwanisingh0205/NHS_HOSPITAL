<template>
    <div class="space-y-2">

        
        
        <!-- Text Input Types -->
        <UFormField
            v-if="['TEXT', 'EMAIL', 'NUMBER', 'PASSWORD', 'TEL', 'URL', 'DATE'].includes(field.data_type)"
            :required="field?.required"
            :hint="field?.hint"
            :help="field?.help"
            :label="field?.label">
            
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
            v-if="['DROPDOWN'].includes(field.data_type)"
            :required="field?.required"
            :hint="field?.hint"
            :help="field?.help"
            :error="field?.error"
            :label="field?.label">
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
        <UTextarea
            v-else-if="field.data_type === 'TEXTAREA'"
            v-model="field.value[0]"
            :placeholder="field.label"
            :rows="field.rows || 4"
        />
        
        <!-- Single Checkbox -->
        <UCheckbox
            v-else-if="field.data_type === 'CHECKBOX' && !field.options"
            v-model="field.value[0]"
            :label="field.checkboxLabel || field.label"
        />
        
        <!-- Multiple Checkboxes -->
        <div v-else-if="field.data_type === 'CHECKBOX' && (field.choices || field.options)" class="space-y-2">
            <UCheckbox
                v-for="opt in normalizedOptions"
                :key="opt.value"
                :model-value="isCheckboxSelected(opt.value)"
                @update:model-value="toggleCheckbox(opt.value, $event)"
                :label="opt.label"
            />
        </div>
        
        <!-- Radio -->
        <div v-else-if="field.data_type === 'RADIO'" class="flex gap-4">
            <label
                v-for="opt in normalizedOptions"
                :key="opt.value"
                class="flex items-center gap-2 cursor-pointer"
            >
                <input
                    type="radio"
                    :name="field.id"
                    :value="opt.value"
                    :checked="localValue === opt.value"
                    @change="localValue = opt.value"
                    class="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span class="text-sm text-gray-700 dark:text-gray-300">{{ opt.label }}</span>
            </label>
        </div>
        
        <!-- Star Rating -->
        <div v-else-if="['STAR', 'star'].includes(props.field.data_type)" class="flex items-center gap-1">
            
            <UButton
                v-for="star in maxStars"
                :key="star"
                :variant="star <= (hoveredStar || starRating) ? 'solid' : 'outline'"
                :color="star <= (hoveredStar || starRating) ? 'yellow' : 'gray'"
                @click="setStarRating(star)"
                @mouseenter="hoveredStar = star"
                @mouseleave="hoveredStar = null"
                size="md"
                square
            >
                <span v-if="star <= (hoveredStar || starRating)">⭐</span>
                <span v-else>✩</span>
            </UButton>
            <span v-if="starRating > 0" class="ml-2 text-sm text-gray-600 dark:text-gray-400">
        {{ starRating }}/{{ maxStars }}
      </span>
        </div>
        
        
        
       
       
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
    field: { type: Object, required: true },
    modelValue: { type: [String, Number, Boolean, Object, Array], default: '' },
    error: { type: [String, Object], default: null }
})

const emit = defineEmits(['update:modelValue'])




// Nested fields
const nestedValues = ref({})

const updateNested = (id, val) => {
    nestedValues.value[id] = val
    emit('update:modelValue', { ...nestedValues.value })
}



</script>
