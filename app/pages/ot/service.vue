<template>
  <div class="space-y-6 bg-gray-50 min-h-screen p-6" style="background-color: #F8FAFC;">
    <!-- Header Section -->
    <PatientHeader
      :patient-data="patientData"
      :attending-physician="attendingPhysician"
      v-model:search-query="searchQuery"
      :suggestions="allSuggestions"
      @search="handleSearch"
    />

    <!-- Two Column Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column - Summary Cards -->
      <div class="lg:col-span-1 space-y-4">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Summary</h2>
        <SummaryCard
          v-for="(card, index) in filteredSummaryCards"
          :key="index"
          :data="card"
        />
      </div>

      <!-- Right Column - Action Items by Category -->
      <div class="lg:col-span-2 space-y-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Actions</h2>
        
        <!-- CLINICAL & NURSING -->
        <div v-if="hasActionsInCategory('clinical')" class="space-y-3 rounded-lg p-4" style="background-color: #EAFBF0;">
          <div class="flex items-center gap-2 mb-3">
            <UIcon name="lucide:stethoscope" class="w-4 h-4 text-green-600" />
            <h3 class="text-sm font-semibold text-green-600 uppercase tracking-wide">
              Clinical & Nursing
            </h3>
          </div>
          <div class="space-y-2">
            <ActionItem
              v-for="(action, index) in getActionsByCategory('clinical')"
              :key="index"
              :data="action"
            />
          </div>
        </div>

        <!-- SERVICES & FRONT DESK -->
        <div v-if="hasActionsInCategory('services')" class="space-y-3 rounded-lg p-4" style="background-color: #EBF7FE;">
          <div class="flex items-center gap-2 mb-3">
            <UIcon name="lucide:file-plus" class="w-4 h-4 text-blue-600" />
            <h3 class="text-sm font-semibold text-blue-600 uppercase tracking-wide">
              Services & Front Desk
            </h3>
          </div>
          <div class="space-y-2">
            <ActionItem
              v-for="(action, index) in getActionsByCategory('services')"
              :key="index"
              :data="action"
            />
          </div>
        </div>

        <!-- BED MANAGEMENT -->
        <div v-if="hasActionsInCategory('bed')" class="space-y-3 rounded-lg p-4" style="background-color: #F5F0FC;">
          <div class="flex items-center gap-2 mb-3">
            <UIcon name="lucide:bed" class="w-4 h-4 text-purple-600" />
            <h3 class="text-sm font-semibold text-purple-600 uppercase tracking-wide">
              Bed Management
            </h3>
          </div>
          <div class="space-y-2">
            <ActionItem
              v-for="(action, index) in getActionsByCategory('bed')"
              :key="index"
              :data="action"
            />
          </div>
        </div>

        <!-- TPA & INSURANCE -->
        <div v-if="hasActionsInCategory('tpa')" class="space-y-3 rounded-lg p-4" style="background-color: #EDFDFC;">
          <div class="flex items-center gap-2 mb-3">
            <UIcon name="lucide:shield-check" class="w-4 h-4 text-teal-600" />
            <h3 class="text-sm font-semibold text-teal-600 uppercase tracking-wide">
              TPA & Insurance
            </h3>
          </div>
          <div class="space-y-2">
            <ActionItem
              v-for="(action, index) in getActionsByCategory('tpa')"
              :key="index"
              :data="action"
            />
          </div>
        </div>

        <!-- LAB & REPORTS -->
        <div v-if="hasActionsInCategory('lab')" class="space-y-3 rounded-lg p-4" style="background-color: #E0F7FA;">
          <div class="flex items-center gap-2 mb-3">
            <UIcon name="lucide:flask-conical" class="w-4 h-4 text-cyan-600" />
            <h3 class="text-sm font-semibold text-cyan-600 uppercase tracking-wide">
              Lab & Reports
            </h3>
          </div>
          <div class="space-y-2">
            <ActionItem
              v-for="(action, index) in getActionsByCategory('lab')"
              :key="index"
              :data="action"
            />
          </div>
        </div>

        <!-- ACCOUNTS & BILLING -->
        <div v-if="hasActionsInCategory('accounts')" class="space-y-3 rounded-lg p-4" style="background-color: #FFF4E6;">
          <div class="flex items-center gap-2 mb-3">
            <UIcon name="lucide:wallet" class="w-4 h-4 text-orange-600" />
            <h3 class="text-sm font-semibold text-orange-600 uppercase tracking-wide">
              Accounts & Billing
            </h3>
          </div>
          <div class="space-y-2">
            <ActionItem
              v-for="(action, index) in getActionsByCategory('accounts')"
              :key="index"
              :data="action"
            />
          </div>
        </div>

        <!-- DISCHARGE MANAGEMENT -->
        <div v-if="hasActionsInCategory('discharge')" class="space-y-3 rounded-lg p-4" style="background-color: #FEE2E2;">
          <div class="flex items-center gap-2 mb-3">
            <UIcon name="lucide:file-check-2" class="w-4 h-4 text-red-600" />
            <h3 class="text-sm font-semibold text-red-600 uppercase tracking-wide">
              Discharge Management
            </h3>
          </div>
          <div class="space-y-2">
            <ActionItem
              v-for="(action, index) in getActionsByCategory('discharge')"
              :key="index"
              :data="action"
            />
          </div>
        </div>

        <!-- OFFICE & ADMINISTRATION -->
        <div v-if="hasActionsInCategory('office')" class="space-y-3 rounded-lg p-4" style="background-color: #F5F0FC;">
          <div class="flex items-center gap-2 mb-3">
            <UIcon name="lucide:folder" class="w-4 h-4 text-purple-600" />
            <h3 class="text-sm font-semibold text-purple-600 uppercase tracking-wide">
              Office & Administration
            </h3>
          </div>
          <div class="space-y-2">
            <ActionItem
              v-for="(action, index) in getActionsByCategory('office')"
              :key="index"
              :data="action"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import PatientHeader from '~/components/ot/PatientHeader.vue'
import SummaryCard from '~/components/ot/SummaryCard.vue'
import ActionItem from '~/components/ot/ActionItem.vue'

definePageMeta({
  layout: 'home'
})

const searchQuery = ref('')

// Patient Data
const patientData = ref({
  name: 'Amit Patel',
  badges: [
    { label: 'Open', color: 'cyan' },
    { label: 'Provisional', color: 'orange' }
  ],
  age: '28',
  gender: 'Male',
  patientId: '#PAT-2845',
  admittedDate: '3 Jan 2025',
  profileImage: null
})

// Attending Physician Data
const attendingPhysician = ref({
  name: 'Dr. Rajesh Kumar',
  profileImage: null
})

// Summary Cards Data
const summaryCards = ref([
  {
    title: 'Services Today',
    subtitle: '5 scheduled services',
    icon: 'lucide:activity',
    iconColor: 'blue',
    items: [
      { name: 'ECG', time: '09:00 AM', department: 'Cardiology', status: 'Done' },
      { name: 'Blood Test - CBC', time: '10:30 AM', department: 'Laboratory', status: 'Done' },
      { name: 'X-Ray Chest', time: '02:00 PM', department: 'Radiology', status: 'Pending' },
      { name: 'Physiotherapy Session', time: '04:00 PM', department: 'Physiotherapy', status: 'Pending' },
      { name: 'Evening Medication', time: '06:00 PM', department: 'Nursing', status: 'Pending' }
    ],
    keywords: ['services', 'scheduled', 'ecg', 'blood test', 'x-ray', 'physiotherapy', 'medication']
  },
  {
    title: 'OT Status',
    subtitle: 'Scheduled - OT-3',
    icon: 'lucide:heart',
    iconColor: 'purple',
    keywords: ['ot', 'operation', 'theatre', 'surgery', 'scheduled']
  },
  {
    title: 'TPA Status',
    subtitle: 'Approved - Star Health Insurance',
    icon: 'lucide:shield-check',
    iconColor: 'green',
    keywords: ['tpa', 'insurance', 'approved', 'star health']
  },
  {
    title: 'Pending Reports',
    subtitle: '4 pending',
    icon: 'lucide:file-text',
    iconColor: 'red',
    keywords: ['reports', 'pending', 'lab', 'radiology', 'investigation']
  },
  {
    title: 'Clinical Notes',
    subtitle: '3 recent notes',
    icon: 'lucide:file-text',
    iconColor: 'blue',
    keywords: ['clinical', 'notes', 'medical', 'records']
  },
  {
    title: 'Vitals Summary',
    subtitle: 'Updated 15 Jan, 2:30 PM',
    icon: 'lucide:heart-pulse',
    iconColor: 'green',
    keywords: ['vitals', 'blood pressure', 'temperature', 'pulse', 'spo2']
  },
  {
    title: 'Payments Summary',
    subtitle: 'Due: ₹15,000',
    icon: 'lucide:indian-rupee',
    iconColor: 'orange',
    keywords: ['payment', 'billing', 'due', 'amount', 'rupee']
  }
])

// Action Items Data organized by categories
const actions = ref([
  // CLINICAL & NURSING (Green)
  {
    title: 'Clinical Record',
    description: 'Patient medical records.',
    icon: 'lucide:file-text',
    iconColor: 'green',
    category: 'clinical',
    locked: false,
    keywords: ['clinical', 'record', 'medical', 'patient']
  },
  {
    title: 'Medical Order',
    description: 'Doctor prescriptions & orders.',
    icon: 'lucide:file-text',
    iconColor: 'green',
    category: 'clinical',
    locked: false,
    keywords: ['medical', 'order', 'prescription', 'doctor', 'orders']
  },
  {
    title: 'Nursing Data',
    description: 'Nurse observations & care notes.',
    icon: 'lucide:heart',
    iconColor: 'green',
    category: 'clinical',
    locked: false,
    keywords: ['nursing', 'data', 'nurse', 'observations', 'care']
  },
  {
    title: 'Consultant Log',
    description: 'Doctor consultation history.',
    icon: 'lucide:message-circle',
    iconColor: 'green',
    category: 'clinical',
    locked: false,
    keywords: ['consultant', 'log', 'doctor', 'consultation', 'history']
  },
  {
    title: 'OT Notes',
    description: 'Operation theatre documentation.',
    icon: 'lucide:plus-circle',
    iconColor: 'green',
    category: 'clinical',
    locked: false,
    keywords: ['ot', 'notes', 'operation', 'theatre', 'documentation']
  },
  // SERVICES & FRONT DESK (Blue)
  {
    title: 'Add Service',
    description: 'Register new patient services.',
    icon: 'lucide:plus-circle',
    iconColor: 'blue',
    category: 'services',
    locked: false,
    keywords: ['add', 'service', 'register', 'new']
  },
  {
    title: 'Report Entry',
    description: 'Enter investigation reports.',
    icon: 'lucide:file-input',
    iconColor: 'blue',
    category: 'services',
    locked: false,
    keywords: ['report', 'entry', 'investigation', 'lab', 'radiology']
  },
  {
    title: 'Visitor Pass',
    description: 'Issue visitor access pass.',
    icon: 'lucide:users',
    iconColor: 'blue',
    category: 'services',
    locked: false,
    keywords: ['visitor', 'pass', 'access']
  },
  // BED MANAGEMENT (Purple)
  {
    title: 'Change Bed',
    description: 'Transfer to different bed.',
    icon: 'lucide:bed',
    iconColor: 'purple',
    category: 'bed',
    locked: true,
    keywords: ['bed', 'change', 'transfer', 'move']
  },
  {
    title: 'Port Patient',
    description: 'Move between departments.',
    icon: 'lucide:move',
    iconColor: 'purple',
    category: 'bed',
    locked: true,
    keywords: ['port', 'patient', 'move', 'department', 'transfer']
  },
  // TPA & INSURANCE (Teal)
  {
    title: 'Move to TPA Desk',
    description: 'Send to insurance processing.',
    icon: 'lucide:send',
    iconColor: 'teal',
    category: 'tpa',
    locked: true,
    keywords: ['tpa', 'desk', 'insurance', 'processing', 'send']
  },
  {
    title: 'TPA Remarks',
    description: 'Add insurance comments.',
    icon: 'lucide:message-square',
    iconColor: 'teal',
    category: 'tpa',
    locked: false,
    keywords: ['tpa', 'remarks', 'insurance', 'comments']
  },
  {
    title: 'TPA Procedure Remarks',
    description: 'Document procedure notes.',
    icon: 'lucide:file-text',
    iconColor: 'teal',
    category: 'tpa',
    locked: false,
    keywords: ['tpa', 'procedure', 'remarks', 'document', 'notes']
  },
  {
    title: 'Accounts Checklist',
    description: 'Financial verification tasks.',
    icon: 'lucide:check-square',
    iconColor: 'teal',
    category: 'tpa',
    locked: true,
    keywords: ['accounts', 'checklist', 'financial', 'verification']
  },
  // LAB & REPORTS (Light Blue/Cyan)
  {
    title: 'Lab Reports',
    description: 'View laboratory test results.',
    icon: 'lucide:flask-conical',
    iconColor: 'cyan',
    category: 'lab',
    locked: false,
    keywords: ['lab', 'reports', 'laboratory', 'test', 'results']
  },
  {
    title: 'Radiology Reports',
    description: 'View imaging scan results.',
    icon: 'lucide:scan',
    iconColor: 'cyan',
    category: 'lab',
    locked: false,
    keywords: ['radiology', 'reports', 'imaging', 'scan', 'x-ray', 'ct', 'mri']
  },
  {
    title: 'External Reports',
    description: 'View external lab reports.',
    icon: 'lucide:external-link',
    iconColor: 'cyan',
    category: 'lab',
    locked: false,
    keywords: ['external', 'reports', 'lab', 'outside']
  },
  {
    title: 'Investigation History',
    description: 'Complete investigation timeline.',
    icon: 'lucide:history',
    iconColor: 'cyan',
    category: 'lab',
    locked: false,
    keywords: ['investigation', 'history', 'timeline', 'complete']
  },
  // ACCOUNTS & BILLING (Orange)
  {
    title: 'Payment',
    description: 'Process patient payments.',
    icon: 'lucide:wallet',
    iconColor: 'orange',
    category: 'accounts',
    locked: false,
    keywords: ['payment', 'pay', 'billing', 'process']
  },
  {
    title: 'Settle Account',
    description: 'Final account settlement.',
    icon: 'lucide:file-check',
    iconColor: 'orange',
    category: 'accounts',
    locked: true,
    keywords: ['settle', 'account', 'final', 'settlement']
  },
  {
    title: 'Account Packages',
    description: 'Manage billing packages.',
    icon: 'lucide:package',
    iconColor: 'orange',
    category: 'accounts',
    locked: false,
    keywords: ['account', 'packages', 'billing', 'manage']
  },
  {
    title: 'Estimate',
    description: 'Generate cost estimate.',
    icon: 'lucide:calculator',
    iconColor: 'orange',
    category: 'accounts',
    locked: false,
    keywords: ['estimate', 'cost', 'generate', 'billing']
  },
  // DISCHARGE MANAGEMENT (Red)
  {
    title: 'Free Bed',
    description: 'Release bed for new patient.',
    icon: 'lucide:bed',
    iconColor: 'red',
    category: 'discharge',
    locked: true,
    keywords: ['free', 'bed', 'release', 'new patient']
  },
  {
    title: 'Discharge Clearance',
    description: 'Final discharge authorization.',
    icon: 'lucide:file-check-2',
    iconColor: 'red',
    category: 'discharge',
    locked: true,
    keywords: ['discharge', 'clearance', 'authorization', 'final']
  },
  {
    title: 'Discharge Alert',
    description: 'Notify discharge readiness.',
    icon: 'lucide:bell',
    iconColor: 'red',
    category: 'discharge',
    locked: false,
    keywords: ['discharge', 'alert', 'notify', 'readiness']
  },
  // OFFICE & ADMINISTRATION (Purple)
  {
    title: 'Update Patient',
    description: 'Edit patient information.',
    icon: 'lucide:user-pen',
    iconColor: 'purple',
    category: 'office',
    locked: true,
    keywords: ['update', 'patient', 'edit', 'information']
  },
  {
    title: 'Update Account',
    description: 'Modify billing details.',
    icon: 'lucide:wallet',
    iconColor: 'purple',
    category: 'office',
    locked: true,
    keywords: ['update', 'account', 'billing', 'modify']
  },
  {
    title: 'Documents',
    description: 'Patient document management.',
    icon: 'lucide:folder',
    iconColor: 'purple',
    category: 'office',
    locked: false,
    keywords: ['documents', 'patient', 'management', 'files']
  },
  {
    title: 'Facesheet',
    description: 'Print patient facesheet.',
    icon: 'lucide:file-text',
    iconColor: 'purple',
    category: 'office',
    locked: false,
    keywords: ['facesheet', 'print', 'patient']
  },
  {
    title: 'Consultant',
    description: 'Change assigned doctor.',
    icon: 'lucide:user',
    iconColor: 'purple',
    category: 'office',
    locked: true,
    keywords: ['consultant', 'doctor', 'change', 'assigned']
  },
  {
    title: 'MRD Files',
    description: 'Medical records department files.',
    icon: 'lucide:folder-open',
    iconColor: 'purple',
    category: 'office',
    locked: true,
    keywords: ['mrd', 'files', 'medical', 'records', 'department']
  }
])

// Create suggestions for search autocomplete
const allSuggestions = computed(() => {
  const suggestions = []
  
  // Add summary cards as suggestions
  summaryCards.value.forEach(card => {
    suggestions.push({
      title: card.title,
      description: card.subtitle,
      icon: card.icon,
      type: 'summary',
      keywords: card.keywords || []
    })
    
    // Add items within cards
    if (card.items) {
      card.items.forEach(item => {
        suggestions.push({
          title: `${item.name} - ${card.title}`,
          description: `${item.time} • ${item.department}`,
          icon: card.icon,
          type: 'service',
          keywords: [item.name.toLowerCase(), item.department.toLowerCase(), ...(card.keywords || [])]
        })
      })
    }
  })

  
  // Add actions as suggestions
  actions.value.forEach(action => {
    suggestions.push({
      title: action.title,
      description: action.description,
      icon: action.icon,
      type: 'action',
      locked: action.locked,
      keywords: action.keywords || []
    })
  })
  
  return suggestions
})

// Filter summary cards based on search
const filteredSummaryCards = computed(() => {
  if (!searchQuery.value.trim()) {
    return summaryCards.value
  }
  
  const query = searchQuery.value.toLowerCase().trim()
  return summaryCards.value.filter(card => {
    // Check title, subtitle, and keywords
    const titleMatch = card.title.toLowerCase().includes(query)
    const subtitleMatch = card.subtitle.toLowerCase().includes(query)
    const keywordMatch = card.keywords?.some(k => k.toLowerCase().includes(query))
    
    // Check items within card
    const itemMatch = card.items?.some(item => {
      return item.name.toLowerCase().includes(query) ||
             item.department.toLowerCase().includes(query) ||
             item.status.toLowerCase().includes(query)
    })
    
    return titleMatch || subtitleMatch || keywordMatch || itemMatch
  })
})

// Filter actions based on search
const filteredActions = computed(() => {
  if (!searchQuery.value.trim()) {
    return actions.value
  }
  
  const query = searchQuery.value.toLowerCase().trim()
  return actions.value.filter(action => {
    const titleMatch = action.title.toLowerCase().includes(query)
    const descMatch = action.description.toLowerCase().includes(query)
    const keywordMatch = action.keywords?.some(k => k.toLowerCase().includes(query))
    
    return titleMatch || descMatch || keywordMatch
  })
})

// Get actions by category
const getActionsByCategory = (category) => {
  const categoryActions = filteredActions.value.filter(action => action.category === category)
  return categoryActions
}

// Check if category has actions
const hasActionsInCategory = (category) => {
  return getActionsByCategory(category).length > 0
}



// Handle search
const handleSearch = (query) => {
  searchQuery.value = query
}




</script>
