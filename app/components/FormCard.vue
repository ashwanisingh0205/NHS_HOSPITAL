<template>
    <div 
        class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 cursor-pointer transition-all hover:shadow-md"
        :class="{ 'ring-2 ring-blue-500 dark:ring-blue-400': isSelected }"
        @click="$emit('view', form)"
    >
        <div class="flex items-start justify-between gap-4">
            <div class="flex-1 min-w-0">
                <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-3">
                    {{ form.title }}
                </h3>
                <ul class="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <li><span class="font-medium">Template:</span> <span class="font-semibold">{{ form.template || 'Template Name' }}</span></li>
                    <li><span class="font-medium">CSS:</span> <span class="font-semibold">{{ form.css || 'CSS' }}</span></li>
                    <li><span class="font-medium">Header:</span> <span class="font-semibold">{{ form.header || 'Header' }}</span></li>
                    <li><span class="font-medium">Footer:</span> <span class="font-semibold">{{ form.footer || 'Footer' }}</span></li>
                    <li><span class="font-medium">Letterhead:</span> <span class="font-semibold">{{ form.letterhead || 'Letterhead' }}</span></li>
                </ul>
            </div>
            <div class="flex items-center gap-2 shrink-0">
                <UButton
                    @click.stop="$emit('view', form)"
                    variant="solid"
                    size="sm"
                    icon="i-lucide:eye"
                    color="neutral"
                    class="bg-gray-800 dark:bg-gray-700 text-white hover:bg-gray-700 dark:hover:bg-gray-600"
                />
                <UButton
                    @click.stop="$emit('edit', form)"
                    variant="outline"
                    size="sm"
                    icon="i-lucide:pencil"
                    color='neutral'
                />
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    form: {
        type: Object,
        required: true
    },
    isSelected: {
        type: Boolean,
        default: false
    }
});

defineEmits(['edit', 'view']);
</script>

