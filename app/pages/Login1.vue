<template>
  <div class="space-y-6 p-2 m-4 mt-4 max-w-7xl mx-auto">
    <!-- Header Section -->
    <HeaderCard
    title="Ashwani Singh"
    subtitle="Register a new patient to the system"
    icon="lucide:user-plus"

  />

    <!-- Form Container -->
      <FormCard
    title="Registration Form"
    subtitle="Fill in the patient details below"
    icon="lucide:clipboard-list"
    :form-fields="formFields"
    v-model="formData"
    submit-text="Submit Registration"
    @submit="handleSubmit"
  />
  </div>
</template>
  
  <script setup>
  import { ref } from "vue";
  
  const labelPosition = ref("left");
  
  const formFields = [
    { id: "name", model: "name", label: "Name", type: "text", placeholder: "Enter name", },
    { id: "email", model: "email", label: "Email", type: "email", placeholder: "Enter email" },
    { id: "password", model: "password", label: "Password", type: "password", placeholder: "Enter password" },
    { id: "hospitalName", model: "hospitalName", label: "Hospital Name", type: "text", placeholder: "Hospital name" },
    { id: "address", model: "address", label: "Address", type: "text", placeholder: "Enter address" },
    { id: "date", model: "date", label: "Date", type: "date" },
  ];
  
  const formData = ref({
    name: "",
    email: "",
    password: "",
    hospitalName: "",
    address: "",
    description: "",
    date: "",
  });
  
  function handleSubmit(formData) {
    console.log("Form submitted:", formData);
  
  }

  </script>
  