<template>
  <div class="flex h-screen bg-gray-50">
    <!-- Sidebar -->
    <aside class="w-64 bg-white border-r border-gray-200 flex flex-col overflow-hidden">
      <!-- Logo Section -->
      <div class="p-4 border-b border-gray-200">
        <div class="flex items-center gap-2">
          <img src='/assets/images/NHS-logo.png' class="h-8 w-8 object-contain" alt="NHS Logo">
          <div>
            <h1 class="text-lg font-bold text-gray-900">MARC</h1>
            <p class="text-xs text-gray-500">Admin Panel</p>
          </div>
        </div>
      </div>

      <!-- Search Bar -->
      <div class="p-4 border-b border-gray-200">
        <UInput
          v-model="searchQuery"
          type="text"
          placeholder="Search"
          class="w-full"
          
        >
          <template #leading>
            <UIcon name="lucide:search" class="w-4 h-4 text-gray-400" />
          </template>
        
        </UInput>
      </div>

      <!-- Navigation Menu -->
      <nav class="flex-1 overflow-y-auto p-4 space-y-1">
        <NuxtLink
          v-for="item in menuItems"
          :key="item.name"
          :to="item.path"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm"
          :class="isActive(item.path) 
            ? 'bg-emerald-50 text-emerald-700 font-medium' 
            : 'text-gray-700 hover:bg-gray-100'"
        >
          <UIcon :name="item.icon" class="w-5 h-5 shrink-0" />
          <span class="flex-1">{{ item.name }}</span>
        </NuxtLink>
      </nav>
    </aside>

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Top Header Bar -->
      <header class="bg-white border-b border-gray-200 px-6 py-3">
        <div class="flex items-center justify-between">
          <!-- Left: Page Title -->
          <div>
            <h2 class="text-xl font-semibold text-gray-900">{{ currentPageTitle }}</h2>
          </div>

         
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 overflow-y-auto bg-gray-50">
        <div class="p-6">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const searchQuery = ref('');

const menuItems = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: 'lucide:layout-dashboard'
  },
  {
    name: 'Registration',
    path: '/registration',
    icon: 'lucide:user-plus'
  },
  {
    name: 'Appointment',
    path: '/appointment',
    icon: 'lucide:calendar'
  },
  {
    name: 'Setting',
    path: '/setting',
    icon: 'lucide:settings'
  }
];

const isActive = (path) => {
  return route.path === path || route.path.startsWith(path + '/');
};

const currentPageTitle = computed(() => {
  const currentItem = menuItems.find(item => isActive(item.path));
  return currentItem ? currentItem.name : 'Dashboard';
});
</script>

