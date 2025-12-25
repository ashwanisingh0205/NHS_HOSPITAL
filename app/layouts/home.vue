<template>
    <div class="flex h-screen bg-gray-50 dark:bg-gray-950">
        <!-- Icon Sidebar -->
        <aside class="w-16 bg-white dark:bg-gray-900 flex flex-col border-r border-gray-200 dark:border-gray-800">
            <div class="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-800">
                <img src="/assets/images/NHS-logo.png" alt="NHS Logo" class="h-10 w-10 object-contain" />
            </div>

            <nav class="flex-1 flex flex-col items-center py-4 space-y-2">
                <UButton v-for="item in mainNavItems" :key="item.id" @click="handleMainNavClick(item.id)"
                    variant="primary" :icon="item.icon" :ui="getNavButtonUI(item.id)" :title="item.name" />
            </nav>
        </aside>

        <!-- Secondary Sidebar -->
        <aside
            class="bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col transition-all duration-300 overflow-hidden"
            :class="isSidebarCollapsed ? 'w-0' : 'w-64'">
            <template v-if="!isSidebarCollapsed">
                <div class="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
                    <h2 class="font-semibold text-gray-900 dark:text-gray-100">{{ currentSectionName }}</h2>
                </div>

                <div class="p-4 border-b border-gray-200 dark:border-gray-800">
                    <UDashboardSearchButton v-model:search-term="searchTerm" :groups="groups" class="w-full" />
                    <UDashboardSearch :groups="groups" />
                </div>

                <div class="flex-1 flex flex-col overflow-hidden">
                    <nav class="flex-1 overflow-y-auto p-3">
                        <div class="space-y-1">
                            <template v-for="item in currentNavItems" :key="item.name">
                                <NuxtLink v-if="!item.children" :to="item.path"
                                    class="flex items-center px-3 py-2 rounded-lg text-sm group" :class="isActive(item.path)
                                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'">
                                    <div class="flex items-center gap-3 flex-1">
                                        <UIcon :name="item.icon" class="w-4 h-4 shrink-0" />
                                        <span class="truncate">{{ item.name }}</span>
                                    </div>
                                    <UIcon v-if="item.count" name="lucide:chevron-right"
                                        class="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 shrink-0" />
                                </NuxtLink>

                                <div v-else>
                                    <UButton @click="toggleExpanded(item.name)" variant="ghost"
                                        class="w-full justify-between">
                                        <div class="flex items-center gap-3 flex-1">
                                            <UIcon :name="item.icon" class="w-4 h-4 shrink-0" />
                                            <span class="truncate">{{ item.name }}</span>
                                        </div>
                                        <UIcon name="lucide:chevron-down"
                                            class="w-4 h-4 text-gray-400 shrink-0 transition-transform"
                                            :class="expandedItems.includes(item.name) ? 'rotate-180' : ''" />
                                    </UButton>

                                    <ul v-if="expandedItems.includes(item.name)" class="ml-8 mt-1 space-y-1">
                                        <li v-for="child in item.children" :key="child.name">
                                            <NuxtLink :to="child.path"
                                                class="flex items-center px-3 py-2 rounded-lg text-sm"
                                                :class="isActive(child.path)
                                                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium'
                                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'">
                                                {{ child.name }}
                                            </NuxtLink>
                                        </li>
                                    </ul>
                                </div>
                            </template>
                        </div>
                    </nav>

                    <div class="p-3 pt-2 border-t border-gray-200 dark:border-gray-800 mt-auto">
                        <UButton @click="navigateTo('/upgrade')" variant="soft" color="neutral" block
                            icon="lucide:sparkles" label="Upgrade" />
                    </div>
                </div>
            </template>
        </aside>

        <!-- Main Content -->
        <div class="flex-1 flex flex-col overflow-hidden">
            <header
                class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 h-16 flex items-center justify-between px-6">
                <div class="flex items-center gap-4 flex-1">
                    <UButton @click="isSidebarCollapsed = !isSidebarCollapsed" variant="ghost" color="gray" size="sm"
                        :icon="isSidebarCollapsed ? 'lucide:panel-left-open' : 'lucide:panel-left-close'" />

                    <nav class="flex items-center gap-2">
                        <template v-for="(item, index) in breadcrumbItems" :key="index">
                            <NuxtLink v-if="item.to" :to="item.to"
                                class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                                <span>{{ item.label }}</span>
                            </NuxtLink>
                            <span v-else
                                class="flex items-center gap-2 text-sm text-gray-900 dark:text-gray-100 font-medium">
                                {{ item.label }}
                            </span>
                            <UIcon v-if="index < breadcrumbItems.length - 1" name="lucide:chevron-right"
                                class="w-4 h-4 text-gray-400 dark:text-gray-500" />
                        </template>
                    </nav>
                </div>

                <div class="flex items-center gap-3">
                    <!-- Customer Care Button (Account Manager) -->
                    <UButton variant="outline" color="neutral">
                        <UAvatar :src="accountManagerAvatar" :alt="accountManagerName" size="sm" />
                        <div class="flex flex-col items-start ml-2">
                            <span class="text-sm leading-tight">Meet {{ accountManagerName }}</span>
                            <span class="text-xs leading-tight text-gray-500 dark:text-gray-400">Your Account
                                Manager</span>
                        </div>
                    </UButton>

                    <!-- Notification Button -->
                    <div class="relative">
                        <UButton variant="soft" color="neutral" size="md" icon="tabler:message"
                            @click="console.log('Notifications')" />
                        <!-- <UBadge
                            v-if="notificationCount > 0"
                            :label="notificationCount > 9 ? '9+' : String(notificationCount)"
                            color="red"
                            class="absolute -top-1 -right-1"
                        /> -->
                    </div>

                    <!-- User Profile Avatar with Dropdown -->
                    <div ref="userMenuRef" class="relative">
                        <UButton variant="solid" color='info' class="p-0.5 rounded-full"
                            @click="isUserMenuOpen = !isUserMenuOpen">
                            <UAvatar :src="userAvatar" :alt="userName" :text="!userAvatar ? userInitials : undefined"
                                size="sm" />
                        </UButton>

                        <!-- Dropdown Menu -->
                        <div v-if="isUserMenuOpen"
                            class="absolute right-0 mt-2 w-72 rounded-lg bg-white dark:bg-gray-800 shadow-lg ring-1 ring-gray-200 dark:ring-gray-700 z-50 overflow-hidden"
                            @click.stop>
                            <div class="px-4 py-4 border-b border-gray-200 dark:border-gray-700">
                                <div class="flex items-center gap-3">
                                    <UAvatar :src="userAvatar" :alt="userName"
                                        :text="!userAvatar ? userInitials : undefined" size="md" />
                                    <div class="flex-1">
                                        <p class="text-sm font-semibold text-gray-900 dark:text-white truncate">{{
                                            userName }}
                                        </p>
                                        <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ userEmail }}</p>
                                    </div>
                                </div>
                            </div>

                            <div class="py-2 px-4 space-y-2">
                                <UButton @click="isUserMenuOpen = false; navigateTo('/profile')" variant="outline" block
                                    color="neutral" icon="lucide:user" label="My Profile" />
                                <UButton @click="isUserMenuOpen = false; navigateTo('/settings')" variant="outline"
                                    color="neutral" block icon="lucide:settings" label="Settings" />
                            </div>

                            <div class="border-t border-gray-200 dark:border-gray-700"></div>

                            <div class="px-4 py-2.5">
                                <div class="flex items-center justify-between gap-4">
                                    <div class="flex items-center gap-2">
                                        <UIcon name="lucide:moon" class="w-4 h-4" />
                                        <span class="text-sm text-gray-700 dark:text-gray-300">Dark Mode</span>
                                    </div>
                                    <USwitch :model-value="isDarkMode"
                                        @update:model-value="colorMode.preference = $event ? 'dark' : 'light'" />
                                </div>
                            </div>

                            <div class="px-4 pb-3 pt-2">
                                <UButton @click="isUserMenuOpen = false; navigateTo('/')" label="Log out" color="error"
                                    variant="solid" block />
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main class="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900">
                <slot />
            </main>
        </div>
    </div>
</template>

<script setup>
const props = defineProps(['pageTitle', 'pageDescription']);
const route = useRoute();
const colorMode = useColorMode();

const activeSection = ref('dashboard');
const expandedItems = ref(['Settings', 'Team']);
const notificationCount = ref(1);
const isSidebarCollapsed = ref(false);
const isUserMenuOpen = ref(false);
const userMenuRef = ref(null);

const userName = ref('NHS Hospital');
const userEmail = ref('nhsuser@example.com');
const userAvatar = ref(null);
const accountManagerName = ref('Helper');
const accountManagerAvatar = ref('https://www.qualtrics.com/sites/default/files/styles/standard_medium_retina/public/2025-11/great-customer-service.jpg.webp?itok=XBoyPxI_');

const userInitials = computed(() => {
    if (!userName.value) return 'U';
    const names = userName.value.split(' ');
    return names.length >= 2 ? (names[0][0] + names[1][0]).toUpperCase() : userName.value.substring(0, 2).toUpperCase();
});

const isDarkMode = computed({
    get: () => colorMode.value === 'dark',
    set: (value) => {
        colorMode.preference = value ? 'dark' : 'light';
    }
});

const searchTerm = ref("");
const showSearch = ref(false);
const groups = ref([
    {
        id: 'users',
        label: 'Users',
        items: [
            {
                label: 'Benjamin Canac',
                suffix: 'benjamincanac',
                avatar: {
                    src: 'https://github.com/benjamincanac.png'
                }
            },
            {
                label: 'Romain Hamel',
                suffix: 'romhml',
                avatar: {
                    src: 'https://github.com/romhml.png'
                }
            },
            {
                label: 'Sébastien Chopin',
                suffix: 'atinux',
                avatar: {
                    src: 'https://github.com/atinux.png'
                }
            },
            {
                label: 'Hugo Richard',
                suffix: 'HugoRCD',
                avatar: {
                    src: 'https://github.com/HugoRCD.png'
                }
            },
            {
                label: 'Sandro Circi',
                suffix: 'sandros94',
                avatar: {
                    src: 'https://github.com/sandros94.png'
                }
            },
            {
                label: 'Daniel Roe',
                suffix: 'danielroe',
                avatar: {
                    src: 'https://github.com/danielroe.png'
                }
            },
            {
                label: 'Jakub Michálek',
                suffix: 'J-Michalek',
                avatar: {
                    src: 'https://github.com/J-Michalek.png'
                }
            },
            {
                label: 'Eugen Istoc',
                suffix: 'genu',
                avatar: {
                    src: 'https://github.com/genu.png'
                }
            }
        ]
    },
    {
        id: 'IPD',
        label: 'IPD Patients',
        items: [
            {
                label: 'Benjamin Canac',
                suffix: 'benjamincanac',
                avatar: {
                    src: 'https://github.com/benjamincanac.png'
                }
            },
            {
                label: 'Romain Hamel',
                suffix: 'romhml',
                avatar: {
                    src: 'https://github.com/romhml.png'
                }
            },
            {
                label: 'Sébastien Chopin',
                suffix: 'atinux',
                avatar: {
                    src: 'https://github.com/atinux.png'
                }
            },
            {
                label: 'Hugo Richard',
                suffix: 'HugoRCD',
                avatar: {
                    src: 'https://github.com/HugoRCD.png'
                }
            },
            {
                label: 'Sandro Circi',
                suffix: 'sandros94',
                avatar: {
                    src: 'https://github.com/sandros94.png'
                }
            },
            {
                label: 'Daniel Roe',
                suffix: 'danielroe',
                avatar: {
                    src: 'https://github.com/danielroe.png'
                }
            },
            {
                label: 'Jakub Michálek',
                suffix: 'J-Michalek',
                avatar: {
                    src: 'https://github.com/J-Michalek.png'
                }
            },
            {
                label: 'Eugen Istoc',
                suffix: 'genu',
                avatar: {
                    src: 'https://github.com/genu.png'
                }
            }
        ]
    },
    {
        id: 'consultants',
        label: 'Consultants',
        items: [
            {
                label: 'Dr. Naveen Chitkara',
                suffix: 'Sr.Spine & Neuro Surgeon',
                avatar: {
                    src: 'https://www.nhshospital.in/images/doctors/founder1.png'
                }
            },
            {
                label: 'Dr. Shubhang Aggarwal',
                suffix: 'Sr.Orthopaedic',
                avatar: {
                    src: 'https://www.nhshospital.in/images/doctors/founder3.png'
                }
            },
            {
                label: 'Dr. Sandeep Goel',
                suffix: 'Sr.Neurologist',
                avatar: {
                    src: 'https://www.nhshospital.in/images/doctors/founder2.png'
                }
            },
        ]
    }
])
const value = ref({})

const mainNavItems = [
    { id: 'dashboard', name: 'Dashboard', icon: 'lucide:layout-dashboard' },
    { id: 'projects', name: 'Projects', icon: 'lucide:folder' },
    { id: 'analytics', name: 'Analytics', icon: 'lucide:bar-chart-3' },
    { id: 'team', name: 'Team', icon: 'lucide:users' },
    { id: 'messages', name: 'Messages', icon: 'lucide:message-square' },
    { id: 'calendar', name: 'Calendar', icon: 'lucide:calendar' },
    { id: 'files', name: 'Files', icon: 'lucide:file-text' },
];

const navSections = {
    dashboard: [
        { name: 'Forms', path: '/masters/forms/form_builder/forms', icon: 'lucide:file-text' },
         {
            name: 'Accounts',
            icon: 'lucide:file-bar-chart',
            children: [
                { name: 'Bank Account Form', path: '/masters/accounts/bank_account_form' },
                { name: 'Bank Accounts', path: '/masters/accounts/bank_accounts' },
                { name: 'Bank Form', path: '/masters/accounts/bank_form' },
                { name: 'Banks', path: '/masters/accounts/banks' },
                { name: 'Companies', path: '/masters/accounts/companies' },
                { name: 'Company Form', path: '/masters/accounts/company_form' },
                { name: 'Financial Year Form', path: '/masters/accounts/financial_year_form' },
                { name: 'Financial Years', path: '/masters/accounts/financial_years' },
                { name: 'Gst Form', path: '/masters/accounts/gst_form' },
                { name: 'Gst List', path: '/masters/accounts/gst_list' },
                { name: 'Ledger Form', path: '/masters/accounts/ledger_form' },
                { name: 'Ledger Group Form', path: '/masters/accounts/ledger_group_form' },
                { name: 'Voucher Type Form', path: '/masters/accounts/voucher_type_form' },
                { name: 'Voucher Types', path: '/masters/accounts/voucher_types' },
            ]
        },
        {
            name: 'Communication',
            icon: 'lucide:megaphone',
            children: [
                { name: 'Template Form', path: '/masters/communication/template_form' },
                { name: 'Templates', path: '/masters/communication/templates' },
            ]
        },
        {
            name: 'HRM',
            icon: 'lucide:users',
            children: [
                { name: 'Hr Appraisal Master', path: '/masters/hrm/hr_appraisal_master' },
                { name: 'Hr Department Master', path: '/masters/hrm/hr_department_master' },
                { name: 'Hr Designation Master', path: '/masters/hrm/hr_designation_master' },
                { name: 'Hr Document Details', path: '/masters/hrm/hr_document_details' },
                { name: 'Hr Employee Master', path: '/masters/hrm/hr_employee_master' },
                { name: 'Hr Document Type Master', path: '/masters/hrm/hr_document_type_master' },
                { name: 'Hr Grade Master', path: '/masters/hrm/hr_grade_master' },
                { name: 'Hr Holiday Master', path: '/masters/hrm/hr_holiday_master' },
                { name: 'Hr Leave Type Master', path: '/masters/hrm/hr_leave_type_master' },
                { name: 'Hr Shift Master', path: '/masters/hrm/hr_shift_master' },
                { name: 'Hr Roster Master', path: '/masters/hrm/hr_roster_master' },
            ]
        },
        {
            name: 'Infra',
            icon: 'lucide:building',
            children: [
                { name: 'Blocks', path: '/masters/infra/blocks' },
                { name: 'Location Category Master', path: '/masters/infra/location_category_master' },
                { name: 'Location Master', path: '/masters/infra/location_master' },
                { name: 'Location Type Master', path: '/masters/infra/location_type_master' },
            ]
        },
        {
            name: 'Items',
            icon: 'lucide:list-ordered',
            children: [
                { name: 'Billing Head Mapping', path: '/masters/items/billing_head_mapping' },
                { name: 'Item Category Master', path: '/masters/items/item_category_master' },
                { name: 'Lis Reference Range Master', path: '/masters/items/lis_reference_range_master' },
                { name: 'Lis Template Mapping', path: '/masters/items/lis_template_mapping' },
                { name: 'Package Mapping', path: '/masters/items/package_mapping' },
                { name: 'Package Master', path: '/masters/items/package_master' },
                { name: 'Payer Bed Category', path: '/masters/items/payer_bed_category' },
                { name: 'Payer Mapping', path: '/masters/items/payer_mapping' },
                { name: 'Payer Master', path: '/masters/items/payer_master' },
                { name: 'Service Category Master', path: '/masters/items/service_category_master' },
                { name: 'Service Master', path: '/masters/items/service_master' },
                { name: 'Item POS', path: '/masters/items/item_pos' },
                { name: 'Item Radiology', path: '/masters/items/item_radiology' },
                { name: 'Item Diet', path: '/masters/items/item_diet' },
                { name: 'Item Expenses', path: '/masters/items/item_expenses' },
                { name: 'Item Hospital', path: '/masters/items/item_hospital' },
                { name: 'Item Inventory', path: '/masters/items/item_inventory' },
                { name: 'Item Laboratory', path: '/masters/items/item_laboratory' },
                { name: 'Item Medical Insturment', path: '/masters/items/item_medical_instruments' },
                { name: 'Item Pharmacy', path: '/masters/items/item_pharmacy' },


            ]
        },
        {
            name: 'Stores',
            icon: 'lucide:shopping-cart',
            children: [
                { name: 'Demand Details', path: '/masters/stores/demand_details' },
                { name: 'Demand Master', path: '/masters/stores/demand_master' },
                { name: 'Vendor Item Mapping', path: '/masters/stores/vendor_item_mapping' },
                { name: 'Vendor Master', path: '/masters/stores/vendor_master' },
            ]
        },
        {
            name: 'Training',
            icon: 'lucide:graduation-cap',
            children: [
                { name: 'Training Category Master', path: '/masters/training/training_category_master' },
                { name: 'Training Session Invite', path: '/masters/training/training_session_invite' },
                { name: 'Training Session Master', path: '/masters/training/training_session_master' },
                { name: 'Training Topic Master', path: '/masters/training/training_topic_master' },
                { name: 'Training Video Master', path: '/masters/training/training_video_master' },
            ]
        },
        {
            name: 'Units',
            icon: 'lucide:building',
            children: [
                { name: 'Unit Corporate Master', path: '/masters/units/unit_corporate_master' },
                { name: 'Unit Master', path: '/masters/units/unit_master' },
            ]
        },
        {
            name: 'Users',
            icon: 'lucide:users',
            children: [
                { name: 'User Master', path: '/masters/users/user_master' },
                { name: 'User Role Master', path: '/masters/users/user_role_master' },
            ]
        },
        {
            name: 'Visits',
            icon: 'lucide:ambulance',
            children: [
                { name: 'Patient Master', path: '/masters/visits/patient_master' },
                { name: 'Visit Master', path: '/masters/visits/visit_master' },
            ]
        },
        {
            name: 'Billings',
            icon: 'lucide:credit-card',
            children: [
                { name: 'Billing Master', path: '/masters/billing/billing_master' },
                { name: 'Slip Details', path: '/masters/billing/slip_details' },
                { name: 'Slip Master', path: '/masters/billing/slip_master' },
                { name: 'Slip Payment Master', path: '/masters/billing/slip_payment_master' },
                { name: 'Slip Report Master', path: '/masters/billing/slip_report_master' },
            ]
        },
        {
            name: 'Feedback',
            icon: 'lucide:star',
            children: [
                { name: 'About Results of Treatment 1', path: '/masters/feedback/feedback_about_results_of_treatment_1' },
                { name: 'About Results of Treatment 2', path: '/masters/feedback/feedback_about_results_of_treatment_2' },
                { name: 'Behaviour', path: '/masters/feedback/feedback_behaviour' },
                { name: 'Cleanliness', path: '/masters/feedback/feedback_cleanliness' },
                { name: 'Food and Bevarage', path: '/masters/feedback/feedback_food_and_bevarage' },
                { name: 'HCAHPS', path: '/masters/feedback/feedback_hcahps' },
                { name: 'House Keeping', path: '/masters/feedback/feedback_house_keeping' },
                { name: 'Laundry and Linen', path: '/masters/feedback/feedback_laundry_and_linen' },
                { name: 'Maintenance', path: '/masters/feedback/feedback_maintenance' },
                { name: 'Medical Officers', path: '/masters/feedback/feedback_medical_officers' },
                { name: 'Nursing Care', path: '/masters/feedback/feedback_nursing_care' },
                { name: 'OPD Cafeteria', path: '/masters/feedback/feedback_opd_cafe' },
                { name: 'Pharmacy', path: '/masters/feedback/feedback_pharmacy' },
                { name: 'Radiology', path: '/masters/feedback/feedback_radiology' },
                { name: 'Reception Staff', path: '/masters/feedback/feedback_reception_staff' },
                { name: 'Waiting Times', path: '/masters/feedback/feedback_waiting_times' },
                { name: 'Ward Helpers', path: '/masters/feedback/feedback_ward_helpers' },
                { name: 'How did you know about the hospital?', path: '/masters/feedback/how_did_you_know_about_the_hospital' },
                { name: 'What good did you hear about this hospital?', path: '/masters/feedback/what_good_did_you_hear_about_this_hospital' }
            ]
        }
    ],
    projects: [
        { name: 'All Projects', path: '/registration', icon: 'lucide:folder-open' },
        { name: 'Active', path: '/projects/active', icon: 'lucide:zap' },
        { name: 'Archived', path: '/projects/archived', icon: 'lucide:archive' },
        { name: 'Templates', path: '/projects/templates', icon: 'lucide:layout-template' },
    ],
    analytics: [
        { name: 'Overview', path: '/analytics', icon: 'lucide:activity' },
        { name: 'Traffic', path: '/analytics/traffic', icon: 'lucide:trending-up' },
        { name: 'Conversion', path: '/analytics/conversion', icon: 'lucide:target' },
        { name: 'Revenue', path: '/analytics/revenue', icon: 'lucide:dollar-sign' },
    ],
    team: [
        { name: 'Members', path: '/team/members', icon: 'lucide:users' },
        { name: 'Roles', path: '/team/roles', icon: 'lucide:shield' },
        { name: 'Permissions', path: '/team/permissions', icon: 'lucide:lock' },

    ],
    messages: [
        { name: 'Inbox', path: '/messages', icon: 'lucide:inbox' },
        { name: 'Sent', path: '/messages/sent', icon: 'lucide:send' },
        { name: 'Drafts', path: '/messages/drafts', icon: 'lucide:file-edit' },
        { name: 'Archived', path: '/messages/archived', icon: 'lucide:archive' },
    ],
    calendar: [
        { name: 'Month View', path: '/calendar', icon: 'lucide:calendar-days' },
        { name: 'Week View', path: '/calendar/week', icon: 'lucide:calendar-range' },
        { name: 'Events', path: '/calendar/events', icon: 'lucide:calendar-check' },
        { name: 'Reminders', path: '/calendar/reminders', icon: 'lucide:bell' },
    ],
    files: [
        { name: 'All Files', path: '/files', icon: 'lucide:folder' },
        { name: 'Recent', path: '/files/recent', icon: 'lucide:clock' },
        { name: 'Shared', path: '/files/shared', icon: 'lucide:share-2' },
        { name: 'Trash', path: '/files/trash', icon: 'lucide:trash-2' },
    ],
};

const currentNavItems = computed(() => navSections[activeSection.value] || []);
const currentSectionName = computed(() => mainNavItems.find(item => item.id === activeSection.value)?.name || 'Dashboard');

const breadcrumbItems = computed(() => {
    const items = [
        { label: 'Home', to: '/' },
        { label: currentSectionName.value }
    ];
    if (props.pageTitle) {
        items.push({ label: props.pageTitle });
    } else {
        items.push({ label: 'Overview' });
    }
    return items;
});

const toggleExpanded = (itemName) => {
    const index = expandedItems.value.indexOf(itemName);
    index > -1 ? expandedItems.value.splice(index, 1) : expandedItems.value.push(itemName);
};

const isActive = (path) => {
    const normalizedPath = path.startsWith('/') ? path : '/' + path;
    return route.path === normalizedPath || route.path.startsWith(normalizedPath + '/');
};

const handleMainNavClick = (sectionId) => {
    activeSection.value = sectionId;
};
const getNavButtonUI = (itemId) => {
    const isActive = activeSection.value === itemId;
    return {
        base: isActive
            ? 'transition-all bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-600 dark:hover:bg-blue-500'
            : 'transition-all text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white',
        color: {
            gray: {
                ghost: isActive
                    ? 'bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-600 dark:hover:bg-blue-500'
                    : 'text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
            }
        }
    };
};
watch(() => route.path, () => {
    isUserMenuOpen.value = false;
});

onMounted(() => {
    const handleClickOutside = (event) => {
        if (userMenuRef.value && !userMenuRef.value.contains(event.target)) {
            isUserMenuOpen.value = false;
        }
    };

    if (typeof document !== 'undefined') {
        document.addEventListener('click', handleClickOutside);
        onUnmounted(() => document.removeEventListener('click', handleClickOutside));
    }
});
</script>
