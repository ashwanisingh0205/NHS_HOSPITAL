<template>
  <Form />
</template>

<script setup>
definePageMeta({
  layout: 'home'
})

import Form from '~/components/form_builder/Form.vue'
const handleSubmit = (data) => {
  console.log('Form submitted:', data)
  alert('Form submitted successfully!')
}
</script>


<!--

Core Inventory Management
-------------------------
Item / Product master (code, name, category, unit, HSN, GST)
Batch & lot tracking
Expiry date management
Barcode / QR code support
Multi-unit handling (box → strip → piece)
Item images & documents
Minimum / maximum stock levels

Stock Operations
----------------
Stock in (Purchase / GRN)
Stock out (Sales / Issue / Consumption)
Internal stock transfer (store → store / branch → branch)
Stock adjustment (damage, loss, audit correction)
Free quantity handling
Return management (purchase return, sales return)

Purchase & Vendor Management
----------------------------
Vendor / supplier master
Purchase order (PO)
Goods receipt note (GRN)
Vendor price list & last purchase price
Multiple vendors per item
Auto stock update on purchase
Pending / partial PO tracking

Warehouse / Store Management
----------------------------
Multiple warehouses / stores
Rack / shelf / bin location tracking
Store-wise stock visibility
Central store → department issue
Inter-store transfer approval workflow

Expiry & Reorder Control
------------------------
Expiry alerts (near-expiry & expired stock)
Reorder level alerts
Slow-moving & non-moving stock report
Auto purchase suggestion (based on consumption)

Consumption & Issue Management
------------------------------
Department-wise stock issue
User-wise issue tracking
Purpose / reference-based issue
Daily / monthly consumption reports
FIFO / LIFO stock issue logic

Pricing & Tax
-------------
Cost price, selling price, MRP
Discount & margin setup
GST / VAT configuration
Tax-inclusive / exclusive pricing
Price history tracking

Reports & Analytics
-------------------
Current stock summary
Store-wise & item-wise stock
Stock valuation report
Expiry report
Purchase vs consumption report
Vendor-wise purchase report
Dead stock report
Audit & variance report

Security & Audit
----------------
Role-based access (storekeeper, admin, auditor)
Stock transaction logs
User activity audit trail
Approval workflow (adjustments, transfers)
Data export (Excel / PDF)

Integration (Optional but Powerful)
-----------------------------------
Accounting / ERP integration
POS / Billing system integration
Purchase module integration
Barcode scanner integration
API access for third-party systems

Mobile & Automation (Advanced)
------------------------------
Mobile app for stock issue & receive
Barcode scanning via mobile
Auto alerts via SMS / Email / WhatsApp
Scheduled reports
AI-based demand forecasting (advanced)



Inventory Categories
--------------------
Drugs & medicines (batch, expiry, MRP)
Surgical & consumables
Implants & high-value items
Medical equipment & assets
CSSD & OT consumables
Blood bank & lab reagents

Advanced Features
-----------------
Batch, expiry & recall management (critical)
Near-expiry auto alerts by department
Emergency stock override (ICU / ER)
Patient-linked consumption (IPD / OPD / OT)
Doctor / department-wise issue tracking
Substitute drug mapping
Implant serial number tracking
Consignment stock (vendor-owned)

Store & Workflow
----------------
Central store → pharmacy → ward → OT flow
Multi-store with approval hierarchy
Night emergency issue workflow
Auto stock deduction from billing
Internal indent & approval

Compliance & Reports
--------------------
NABH / JCI audit-ready logs
Schedule H / H1 drug compliance
Dead stock & wastage report
Department consumption analytics
Expiry loss forecasting
-->
