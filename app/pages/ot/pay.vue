<template>
    <div class="space-y-4 bg-white dark:bg-gray-950 min-h-screen">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold">Payment Billing Dashboard</h1>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Comprehensive view of patient billing and payment records.
                </p>
            </div>
            <UBadge label="Still Admitted" variant="outline" size="lg" />
        </div>

        <PatientInfoCard :patient="patientInfo" />

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ServiceBreakdownCard
                v-for="service in services"
                :key="service.title"
                v-bind="service"
               
            />
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-2">
            <PaymentTrendChart title="Payment Trend" subtitle="Daily total vs paid amounts." :data="paymentTrendData" />
            <div class="flex flex-row gap-2">
                <SummaryCard title="Total Bill" subtitle="Generated amount." :amount="totalBill" icon="lucide:indian-rupee" card-color="bg-teal-500" icon-color="bg-teal-500" />
                <SummaryCard title="Total Payment" subtitle="Collected amount." :amount="totalPayment" icon="lucide:wallet" card-color="bg-green-500" icon-color="bg-green-500" />
            </div>
            <PaymentStatusDonut title="Payment Status" subtitle="Paid vs Pending breakdown." :data="paymentStatusData" />
        </div>

        <BillActionsCard
            :week-days="weekDays"
            :selected-date="selectedDate"
            @date-select="selectedDate = $event"
            
        />

        <PayorInfoCard :payor="payorInfo" " />

        <UCard>
            <template #header>
                <h3 class="font-semibold">Bill Details</h3>
            </template>
            <UTabs :items="tabItems" v-model="activeTab">
                <template #item="{ item }">
                    <span class="flex items-center gap-2">
                        <UIcon :name="item.icon" class="w-4 h-4" />
                        {{ item.label }}
                    </span>
                </template>
            </UTabs>
            <div class="mt-4">
                <UTable :data="billDetails" :columns="tableColumns" :loading="loading">
                    <template #loading><div class="flex justify-center p-4"><span class="text-gray-500">Loading...</span></div></template>
                    <template #empty><div class="flex justify-center p-4"><span class="text-gray-500">No data available</span></div></template>
                    <template #description-cell="{ row }">
                        <div class="flex items-center gap-2">
                            <UIcon :name="row.original.icon" class="w-4 h-4 text-gray-400" />
                            <span>{{ row.original.description }}</span>
                        </div>
                    </template>
                    <template #quantity-cell="{ row }"><span class="text-center">{{ row.original.quantity }}</span></template>
                    <template #rate-cell="{ row }"><span class="text-right">₹{{ formatNumber(row.original.rate) }}</span></template>
                    <template #total-cell="{ row }"><span class="text-right font-medium">₹{{ formatNumber(row.original.total) }}</span></template>
                </UTable>
                <div class="mt-4 flex justify-end">
                    <div class="text-right">
                        <p class="text-sm text-gray-600 dark:text-gray-400">Total Bill Amount:</p>
                        <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">₹{{ formatNumber(currentTabTotal) }}</p>
                    </div>
                </div>
            </div>
        </UCard>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div class="lg:col-span-2">
                <UCard>
                    <template #header>
                        <div class="flex items-center justify-between">
                            <div>
                                <h3 class="font-semibold">Hospital Breakdown</h3>
                                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Hospital department breakdown.</p>
                            </div>
                            <div class="flex gap-2">
                                <UButton color="gray" variant="outline" size="sm" icon="lucide:printer" @click="() => {}">Print</UButton>
                                <UButton color="gray" variant="outline" size="sm" icon="lucide:file-spreadsheet" @click="() => {}">CSV</UButton>
                            </div>
                        </div>
                    </template>
                    <div class="space-y-3">
                        <UCard v-for="payment in hospitalPayments" :key="payment.id" class="bg-gray-50 dark:bg-gray-900">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-3">
                                    <div class="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
                                        <UIcon :name="payment.icon" class="w-5 h-5 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <p class="font-medium">{{ payment.method }}</p>
                                        <p class="text-sm text-gray-500 dark:text-gray-400">Handled by {{ payment.handledBy }}</p>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <p class="text-lg font-bold">₹{{ formatNumber(payment.amount) }}</p>
                                    <p class="text-xs text-gray-500 dark:text-gray-400">{{ payment.date }}</p>
                                </div>
                            </div>
                        </UCard>
                    </div>
                </UCard>
            </div>
            <HospitalBalanceCard
                :current-balance="hospitalBalance.currentBalance"
                :total-bill="hospitalBalance.totalBill"
                :total-paid="hospitalBalance.totalPaid"
                @collect-payment="() => {}"
            />
        </div>
    </div>
</template>

<script setup>
import ServiceBreakdownCard from '~/components/payment/ServiceBreakdownCard.vue'
import PatientInfoCard from '~/components/payment/PatientInfoCard.vue'
import PaymentTrendChart from '~/components/payment/PaymentTrendChart.vue'
import PaymentStatusDonut from '~/components/payment/PaymentStatusDonut.vue'
import SummaryCard from '~/components/payment/SummaryCard.vue'
import PayorInfoCard from '~/components/payment/PayorInfoCard.vue'
import HospitalBalanceCard from '~/components/payment/HospitalBalanceCard.vue'
import BillActionsCard from '~/components/payment/BillActionsCard.vue'

definePageMeta({ layout: 'home' })

const loading = ref(false)
const selectedDate = ref('2025-01-05')
const activeTab = ref('hospital')

const patientInfo = ref({
    name: 'Amit Patel',
    avatar: '',
    age: 28,
    gender: 'Male',
    id: '#PAT-2845',
    admissionDate: '3 Jan 2025',
    badges: ['Open', 'Provisional'],
    physician: { name: 'Dr. Rajesh Kumar', avatar: '' }
})

const services = ref([
    { title: 'Hospital', icon: 'lucide:hospital', iconColor: 'text-blue-600', totalAmount: 6000, paidAmount: 1500, progressColor: 'green' },
    { title: 'Lab', icon: 'lucide:flask-conical', iconColor: 'text-purple-600', totalAmount: 3000, paidAmount: 1500, progressColor: 'green' },
    { title: 'Radio', icon: 'lucide:scan', iconColor: 'text-orange-600', totalAmount: 2000, paidAmount: 1000, progressColor: 'green' },
    { title: 'Pharmacy', icon: 'lucide:briefcase-medical', iconColor: 'text-green-600', totalAmount: 4500, paidAmount: 2000, progressColor: 'green' }
])

const paymentTrendData = ref([
    { date: '2025-01-01', totalAmount: 3000, paidAmount: 2000 },
    { date: '2025-01-02', totalAmount: 6000, paidAmount: 4000 },
    { date: '2025-01-03', totalAmount: 9000, paidAmount: 6000 },
    { date: '2025-01-04', totalAmount: 12000, paidAmount: 9000 },
    { date: '2025-01-05', totalAmount: 14500, paidAmount: 11000 },
    { date: '2025-01-06', totalAmount: 15000, paidAmount: 15000 },
    { date: '2025-01-07', totalAmount: 15500, paidAmount: 18000 }
])

const totalBill = computed(() => services.value.reduce((sum, s) => sum + s.totalAmount, 0))
const totalPayment = computed(() => services.value.reduce((sum, s) => sum + s.paidAmount, 0))

const paymentStatusData = computed(() => {
    const paid = totalPayment.value
    const pending = totalBill.value - paid
    return [
        { label: `Paid ₹${formatNumber(paid)}`, value: paid, color: '#10b981' },
        { label: `Pending ₹${formatNumber(pending)}`, value: pending, color: '#6b7280' }
    ]
})

const weekDays = ref([
    { label: 'Su', date: '2025-01-04' },
    { label: 'Mo', date: '2025-01-05' },
    { label: 'Tu', date: '2025-01-06' },
    { label: 'We', date: '2025-01-07' },
    { label: 'Th', date: '2025-01-08' },
    { label: 'Fr', date: '2025-01-09' },
    { label: 'Sa', date: '2025-01-10' }
])

const payorInfo = ref({
    name: 'Payor ECHS',
    approvedAmount: 200000,
    validTill: '10/Jan/2026'
})

const tableColumns = [
    { accessorKey: 'description', header: 'DESCRIPTION' },
    { accessorKey: 'quantity', header: 'QUANTITY' },
    { accessorKey: 'rate', header: 'RATE' },
    { accessorKey: 'total', header: 'TOTAL' }
]

const tabItems = [
    { label: 'Hospital', value: 'hospital', icon: 'lucide:bed' },
    { label: 'Lab', value: 'lab', icon: 'lucide:flask' },
    { label: 'Radio', value: 'radio', icon: 'lucide:scan' },
    { label: 'Pharmacy', value: 'pharmacy', icon: 'lucide:pills' },
    { label: 'Summary', value: 'summary', icon: 'lucide:file-text' },
    { label: 'Detailed', value: 'detailed', icon: 'lucide:list' },
    { label: 'Compact', value: 'compact', icon: 'lucide:grid' }
]

const billDetails = ref([
    { description: 'Room Rent', icon: 'lucide:bed', quantity: 3, rate: 500, total: 1500 },
    { description: 'Ventilator', icon: 'lucide:wind', quantity: 2, rate: 1000, total: 2000 },
    { description: 'Nursing Care', icon: 'lucide:heart', quantity: 3, rate: 300, total: 900 },
    { description: 'Doctor Consultation', icon: 'lucide:user-md', quantity: 2, rate: 800, total: 1600 }
])

const currentTabTotal = computed(() => billDetails.value.reduce((sum, item) => sum + item.total, 0))

const hospitalPayments = ref([
    { id: 1, method: 'Cash Payment', icon: 'lucide:banknote', amount: 3000, date: '2025-01-05', handledBy: 'Raju' },
    { id: 2, method: 'UPI Payment', icon: 'lucide:smartphone', amount: 1500, date: '2025-01-06', handledBy: 'Priya' }
])

const hospitalBalance = ref({
    currentBalance: 1500,
    totalBill: 6000,
    totalPaid: 4500
})

const formatNumber = (value) => new Intl.NumberFormat('en-IN').format(value)
</script>
