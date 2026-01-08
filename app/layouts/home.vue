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
    { id: 'DASHBOARD', name: 'Dashboard', icon: 'lucide:layout-dashboard' },
    { id: 'FRONT', name: 'Front Desk', icon: 'lucide:monitor-check' },
    { id: 'OPD', name: 'OPD', icon: 'lucide:stethoscope' },
    { id: 'IPD', name: 'IPD', icon: 'lucide:bed' },
    { id: 'CORPORATE', name: 'Corporate/TPA', icon: 'lucide:credit-card' },
    { id: 'PHAR', name: 'Store/Pharmacy', icon: 'lucide:tablets' },
    { id: 'OT', name: 'OT', icon: 'lucide:slice' },
    { id: 'LIS', name: 'Laboratory', icon: 'lucide:flask-conical' },
    { id: 'RIS', name: 'Radiology', icon: 'lucide:radiation' },
    { id: 'HR', name: 'Human Resource', icon: 'lucide:users' },
    { id: 'BLOODBANK', name: 'Blood Bank', icon: 'lucide:droplets' },
    { id: 'ACCOUNTS', name: 'Accounts', icon: 'lucide:indian-rupee' },
    { id: 'MIS', name: 'MIS/BI', icon: 'lucide:file-chart-column-increasing' },
];

const navSections = {
    DASHBOARD: [
        { name: 'Dashboard', path: '/panel/dashboard', icon: 'lucide:layout-dashboard' },
        { name: 'Forms', path: '/masters/forms/form_builder/forms', icon: 'lucide:file-text' },
        { name: "Choices", path: '/masters/forms/choices/choice_master', icon: 'lucide:list-ordered' },
    ],
    FRONT: [
        { name :"Registration", path: '/visit/registration', icon: 'lucide:user-plus'},
        { name :"OPD Queue", path: '/opd/opd_queue', icon: 'lucide:list-ordered'},
        { name :"IPD Help Desk", path: '/ipd/ipd_help_desk', icon: 'lucide:grid-2x2'},
    ],
    OPD: [
        { name :"OPD Queue", path: '/opd/opd_queue', icon: 'lucide:list-ordered'},
        { name :"OPD EMR", path: '/emr/opd_emr', icon: 'lucide:list-ordered'},
        { name :"Appointments", path: '/opd/appointment/calendar', icon: 'lucide:list-ordered'},
        { name :"OPD Register", path: '/mis/opd/opd_register', icon: 'lucide:list-ordered'},
        { name :"Patient Register", path: '/mis/patient/patient_register', icon: 'lucide:list-ordered'},
    ],
    IPD: [
        { name :"IPD Help Desk", path: '/ipd/ipd_help_desk', icon: 'lucide:grid-2x2'},
        { name :"IPD EMR", path: '/emr/ipd_emr', icon: 'lucide:grid-2x2'},
        { name :"IPD Register", path: '/mis/ipd/ipd_register', icon: 'lucide:grid-2x2'},
        { name :"IPD Dues", path: '/mis/ipd/ipd_dues', icon: 'lucide:grid-2x2'},
        { name :"MRD Register", path: '/mis/ipd/mrd_register', icon: 'lucide:grid-2x2'},
    ],
    CORPORATE: [
        { name :"Insurance Register", path: '/insurance/desk/help_desk', icon: 'lucide:user-plus'},
        { name :"Pre-auth", path: '/insurance/desk/pre_auth', icon: 'lucide:list-ordered'},
        { name :"Payments", path: '/insurance/desk/payments', icon: 'lucide:grid-2x2'},
        { name :"Settle Patient Bill", path: '/insurance/settlement/payment_settlement', icon: 'lucide:grid-2x2'},
    ],
    PHAR: [
        {
            name: 'Purchase',
            icon: 'lucide:file-bar-chart',
            children: [
                { name :"Demand", path: '/store/purchase/demand', icon: 'lucide:user-plus'},
                { name :"Approval", path: '/store/purchase/demand_approval', icon: 'lucide:list-ordered'},
                { name :"PO", path: '/store/purchase/po', icon: 'lucide:grid-2x2'},
                { name :"GRN", path: '/store/purchase/grn', icon: 'lucide:grid-2x2'},
                { name :"Receival", path: '/store/purchase/grn_receive', icon: 'lucide:grid-2x2'},
                { name :"Adjustment", path: '/store/purchase/adjustment', icon: 'lucide:grid-2x2'},
                { name :"Demand Register", path: '/store/purchase/demand_register', icon: 'lucide:grid-2x2'},
                { name :"PO Register", path: '/store/purchase/po_register', icon: 'lucide:grid-2x2'},
                { name :"GRN Register", path: '/store/purchase/grn_register', icon: 'lucide:grid-2x2'},
                { name :"Adjustment Register", path: '/store/purchase/adjustment_register', icon: 'lucide:grid-2x2'},
            ]
        },
        {
            name: 'Sale',
            icon: 'lucide:file-bar-chart',
            children: [
                { name :"Medicine Indents", path: '/store/sale/indent', icon: 'lucide:user-plus'},
                { name :"Sale", path: '/store/sale/sale', icon: 'lucide:user-plus'},
                { name :"Sale Register", path: '/store/sale/sale_register', icon: 'lucide:user-plus'},
                { name :"Patient Return", path: '/store/sale/return', icon: 'lucide:list-ordered'},
                { name :"Stock Transfer", path: '/store/sale/stock_transfer', icon: 'lucide:list-ordered'},
                { name :"Consumption", path: '/store/sale/consumption', icon: 'lucide:grid-2x2'},
            ]
        },
        {
            name: 'Stock',
            icon: 'lucide:file-bar-chart',
            children: [
                { name :"Stock In Hand", path: '/store/stock/stock_in_hand', icon: 'lucide:list-ordered'},
                { name :"Stock Summary", path: '/store/stock/stock_summary', icon: 'lucide:grid-2x2'},
                { name :"Stock History", path: '/store/stock/stock_history', icon: 'lucide:grid-2x2'},
                { name :"Item History", path: '/store/stock/item_history', icon: 'lucide:grid-2x2'},
                { name :"Expired/Near Expiry", path: '/store/stock/expired', icon: 'lucide:grid-2x2'},
                { name :"ABC Analysis", path: '/store/stock/abc_analysis', icon: 'lucide:grid-2x2'},
                { name :"Stock Movement", path: '/store/stock/stock_movement', icon: 'lucide:grid-2x2'},
                { name :"NRX/Other Categories", path: '/store/stock/nrx', icon: 'lucide:grid-2x2'},
                { name :"GST Register", path: '/store/stock/gst_register', icon: 'lucide:grid-2x2'},
                { name :"Stock Audits", path: '/store/stock/audit', icon: 'lucide:list-ordered'},
            ]
        },
        {
            name: 'BME',
            icon: 'lucide:file-bar-chart',
            children: [
                { name :"Equipment Register", path: '/store/bme/equipments', icon: 'lucide:grid-2x2'},
                { name :"Downtime Report", path: '/store/bme/downtime', icon: 'lucide:grid-2x2'},
                { name :"Stock Utilization Report", path: '/store/bme/stock_utilization', icon: 'lucide:grid-2x2'},
                { name :"AMC Tracker", path: '/store/bme/amc_tracker', icon: 'lucide:grid-2x2'},
                { name :"History Card", path: '/store/bme/history_card', icon: 'lucide:grid-2x2'},
            ]
        },
    ],
    OT: [
        { name :"OT Scheduler", path: '/ot/ot_scheduler', icon: 'lucide:user-plus'},
        { name :"OT Register", path: '/ot/ot_register', icon: 'lucide:list-ordered'},
        { name :"Patient Tracker", path: '/ot/patient_tracker', icon: 'lucide:grid-2x2'},
        { name :"OT Utilization", path: '/ot/ot_utilization', icon: 'lucide:grid-2x2'},
        { name :"OT Signage", path: '/ot/signage', icon: 'lucide:grid-2x2'},
    ],
    LIS: [
        { name :"Lab Queue", path: '/lis/queue', icon: 'lucide:user-plus'},
        { name :"Lab Orders", path: '/lis/orders', icon: 'lucide:user-plus'},
        { name :"Sample Collection", path: '/lis/collection', icon: 'lucide:list-ordered'},
        { name :"Interface Monitor", path: '/lis/monitor', icon: 'lucide:grid-2x2'},
    ],
    RIS: [
        { name :"Radiology Studies", path: '/ris/studies', icon: 'lucide:user-plus'},
        { name :"Scan Queues", path: '/ris/queue', icon: 'lucide:user-plus'},
        { name :"PACS Monitor", path: '/ris/monitor', icon: 'lucide:list-ordered'},
    ],
    HR: [
        { name :"Employee Register", path: '/hrm/profile/employees', icon: 'lucide:users'},
        {
            name: 'Recruitment',
            icon: 'lucide:file-bar-chart',
            children: [
                { name: 'Job Applications', path: '/hrm/recruitment/applications', icon: 'lucide:user-round-plus' },
                { name: 'New Joining', path: '/hrm/recruitment/joining', icon: 'lucide:user-round-plus' },
            ]
        },
        {
            name: 'Attendance',
            icon: 'lucide:file-bar-chart',
            children: [
                { name: 'Job Applications', path: '/hrm/recruitment/applications', icon: 'lucide:user-round-plus' },
                { name: 'New Joining', path: '/hrm/recruitment/joining', icon: 'lucide:user-round-plus' },
            ]
        },
        {
            name: 'Payroll',
            icon: 'lucide:file-bar-chart',
            children: [
                { name: 'Job Applications', path: '/hrm/recruitment/applications', icon: 'lucide:user-round-plus' },
                { name: 'New Joining', path: '/hrm/recruitment/joining', icon: 'lucide:user-round-plus' },
            ]
        },
        {
            name: 'Training',
            icon: 'lucide:file-bar-chart',
            children: [
                { name: 'Job Applications', path: '/hrm/recruitment/applications', icon: 'lucide:user-round-plus' },
                { name: 'New Joining', path: '/hrm/recruitment/joining', icon: 'lucide:user-round-plus' },
            ]
        },
    ],
    BLOODBANK: [
        { name :"Registration", path: '/visit/registration', icon: 'lucide:user-plus'},
        { name :"OPD Queue", path: '/opd/opd_queue', icon: 'lucide:list-ordered'},
        { name :"IPD Help Desk", path: '/ipd/ipd_help_desk', icon: 'lucide:grid-2x2'},
    ],
    ACCOUNTS: [
        { name :"Registration", path: '/visit/registration', icon: 'lucide:user-plus'},
        { name :"OPD Queue", path: '/opd/opd_queue', icon: 'lucide:list-ordered'},
        { name :"IPD Help Desk", path: '/ipd/ipd_help_desk', icon: 'lucide:grid-2x2'},
    ],
    MIS: [
        { name :"Registration", path: '/visit/registration', icon: 'lucide:user-plus'},
        { name :"OPD Queue", path: '/opd/opd_queue', icon: 'lucide:list-ordered'},
        { name :"IPD Help Desk", path: '/ipd/ipd_help_desk', icon: 'lucide:grid-2x2'},
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
