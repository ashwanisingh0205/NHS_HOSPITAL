<template>
  <div>
    <h1>Dashboard</h1>
    <h3 class="text-3xl font-bold text-gray-900 text-center">{{ role }}</h3>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'home'
});

import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const roleId = route.query.roleTitle;
const role = ref(roleId);

console.log("Received Role ID:", roleId);
</script>