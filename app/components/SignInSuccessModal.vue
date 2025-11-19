<template>
  <UModal v-model:open="isOpen" :ui="{ width: 'max-w-4xl' }">
    <template #body>
      <div class="space-y-8 p-6">
        
        <!-- Header -->
        <header>
          <h2 class="text-4xl font-bold text-gray-900 mb-4">Select Your Role</h2>
          <p class="text-lg text-gray-600">
            Choose the role that matches your position to access the appropriate dashboard and features.
          </p>
        </header>

        <!-- Role Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            v-for="role in roles"
            :key="role.id"
            @click="selectRole(role.id)"
            class="bg-white rounded-2xl p-6 text-center flex flex-col items-center cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md border-2"
            :class="selectedRole === role.id ? 'border-green-500 ring-0 ring-green-500' : 'border-transparent'"
          >
            <div :class="['w-16 h-16 rounded-2xl flex items-center justify-center mb-4', role.bg]">
              <component :is="role.icon" :class="['w-8 h-8', role.color]" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900">{{ role.title }}</h3>
          </div>
        </div>

        <!-- Actions -->
        <div class="mb-6">
          <p class="text-gray-900 mb-4">Please select your role to continue</p>
          <div class="flex items-center justify-end gap-3">
            <UButton label="Cancel" color="neutral" variant="outline" @click="closeModal" />
            <UButton :disabled="!selectedRole" color="primary" @click="handleContinue">
              <span class="flex items-center gap-2">
                Continue <ArrowRightIcon class="w-5 h-5" />
              </span>
            </UButton>
          </div>
        </div>

        <!-- Footer -->
        <footer class="bg-gray-100 rounded-lg p-4">
          <p class="text-sm text-gray-700">
            Your role selection determines which modules and features you can access. 
            If you need to change roles, please contact your system administrator.
          </p>
        </footer>

      </div>
    </template>
  </UModal>
</template>

<script setup>
import { computed, ref } from "vue";
import { UserGroupIcon, BeakerIcon, CalculatorIcon, ArrowRightIcon } from "@heroicons/vue/24/outline";

const props = defineProps({
  open: { type: Boolean, required: true }
});

const emit = defineEmits(["update:open", "continue", "select"]);

const selectedRole = ref(null);


const isOpen = computed({
  get: () => props.open,
  set: (value) => {
    emit("update:open", value);

    if (!value) {
      selectedRole.value = null;
    }
  },
});

const roles = [
  {
    id: 1,
    title: "Nursing Head",
    icon: UserGroupIcon,
    bg: "bg-blue-100",
    color: "text-blue-600",
  },
  {
    id: 2,
    title: "Medical Officer",
    icon: BeakerIcon,
    bg: "bg-green-100",
    color: "text-green-600",
  },
  {
    id: 3,
    title: "Accounting Incharge",
    icon: CalculatorIcon,
    bg: "bg-purple-100",
    color: "text-purple-600",
  },
];

function selectRole(id) {
  selectedRole.value = id;
  emit("select", id);
}

function handleContinue() {
  if (!selectedRole.value) return;
  emit("continue", selectedRole.value);
  isOpen.value = false;
}

function closeModal() {
  isOpen.value = false;
}
</script>
