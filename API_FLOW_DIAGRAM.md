# 🔄 API Integration Flow Diagram

## **Current System vs New System**

### **OLD FLOW (Single Document)**
```
User Uploads PDF
    ↓
analyzeDocument(file)
    ↓
Multiple API Calls in Parallel:
├── POST /debug/info
├── POST /debug/space  
├── POST /debug/charge-schedules
├── POST /debug/misc
├── POST /debug/executive-summary
└── POST /debug/audit
    ↓
Combine Results
    ↓
Display in Tabs (InfoTab, SpaceTab, ChargeSchedulesTab, etc.)
```

### **NEW FLOW (Multi-Company)**
```
User Selects Company
    ↓
User Uploads PDF
    ↓
analyzeDocument(companyId, file)
    ↓
POST /api/companies/{companyId}/documents/analyze
    ↓
Backend calls existing endpoints with company context:
├── POST /debug/info (with companyId)
├── POST /debug/space (with companyId)
├── POST /debug/charge-schedules (with companyId)
├── POST /debug/misc (with companyId)
├── POST /debug/executive-summary (with companyId)
└── POST /debug/audit (with companyId)
    ↓
Save Results with Company Context
    ↓
Store in Document Hierarchy
    ↓
Display in Sidebar + Same Tabs (InfoTab, SpaceTab, ChargeSchedulesTab, etc.)
```

## **Document Hierarchy Structure**

```
Company: ABC Corporation
├── 📄 Main Lease.pdf (Lease Agreement)
│   ├── Analysis Data: {info, space, chargeSchedules, misc, executiveSummary, audit}
│   └── 📝 Amendment 1.pdf (Amendment)
│       └── Analysis Data: {amendment-specific data}
│   └── 📝 Amendment 2.pdf (Amendment)  
│       └── Analysis Data: {amendment-specific data}
└── 📄 Another Lease.pdf (Lease Agreement)
    └── Analysis Data: {info, space, chargeSchedules, misc, executiveSummary, audit}
```

## **API Endpoint Mapping**

### **Existing Endpoints (No Changes Needed)**
```
POST /debug/info              → InfoTab.js
POST /debug/space             → SpaceTab.js  
POST /debug/charge-schedules  → ChargeSchedulesTab.js
POST /debug/misc              → MiscTab.js
POST /debug/executive-summary → InfoTab.js (executiveSummary prop)
POST /debug/audit             → AuditTab.js
POST /debug/amendments        → Amendment analysis
POST /debug/save              → Save lease abstract
```

### **New Endpoints (Need Implementation)**
```
GET    /api/companies                    → CompanySelector.js
POST   /api/companies                    → CompanySelector.js (create)
GET    /api/companies/{id}/documents     → DocumentSidebar.js
POST   /api/companies/{id}/documents     → DocumentSidebar.js (upload)
GET    /api/companies/{id}/documents/analyze → DocumentContext.js
GET    /api/documents/{id}/analysis      → DocumentContext.js
GET    /api/companies/{id}/document-hierarchy → DocumentSidebar.js
POST   /api/documents/{id}/link         → DocumentSidebar.js (link amendment)
```

## **Component Integration**

### **Frontend Components (Already Implemented)**
```
App.js
├── CompanyProvider (CompanyContext)
├── DocumentProvider (DocumentContext)  
├── CompanySelector
│   └── Uses: GET /api/companies, POST /api/companies
├── DocumentSidebar
│   ├── Uses: GET /api/companies/{id}/documents
│   ├── Uses: POST /api/companies/{id}/documents
│   └── Uses: GET /api/companies/{id}/document-hierarchy
└── Analysis Section
    ├── TabNavigation (unchanged)
    ├── InfoTab (unchanged - receives same data)
    ├── SpaceTab (unchanged - receives same data)
    ├── ChargeSchedulesTab (unchanged - receives same data)
    ├── MiscTab (unchanged - receives same data)
    └── AuditTab (unchanged - receives same data)
```

### **Backend Integration Points**
```
/api/companies/{id}/documents/analyze
├── Receives: companyId, file
├── Calls: POST /debug/info (with company context)
├── Calls: POST /debug/space (with company context)
├── Calls: POST /debug/charge-schedules (with company context)
├── Calls: POST /debug/misc (with company context)
├── Calls: POST /debug/executive-summary (with company context)
├── Calls: POST /debug/audit (with company context)
├── Calls: POST /debug/amendments (if amendment)
├── Saves: Results to database with companyId
└── Returns: {document, analysisData}
```

## **Data Flow Example**

### **1. User Selects Company**
```
Frontend: GET /api/companies
Backend: Returns [{id: 1, name: "ABC Corp"}, {id: 2, name: "XYZ Inc"}]
Frontend: User selects "ABC Corp"
```

### **2. User Uploads Document**
```
Frontend: POST /api/companies/1/documents/analyze
Backend: 
├── Calls existing /debug/info
├── Calls existing /debug/space
├── Calls existing /debug/charge-schedules
├── Calls existing /debug/misc
├── Calls existing /debug/executive-summary
├── Calls existing /debug/audit
├── Saves results to database with companyId=1
└── Returns analysis data
```

### **3. User Views Analysis**
```
Frontend: Displays same tabs (InfoTab, SpaceTab, ChargeSchedulesTab, etc.)
Data: Same structure as before, just with company context
```

### **4. User Uploads Amendment**
```
Frontend: POST /api/companies/1/documents/analyze (with parentId)
Backend:
├── Calls existing /debug/amendments
├── Links to parent lease document
└── Returns amendment analysis
```

## **Key Benefits**

✅ **No Changes to Tab Components** - InfoTab, SpaceTab, ChargeSchedulesTab work exactly the same
✅ **Reuse Existing Analysis Logic** - All your existing endpoints are called
✅ **Add Company Context** - Documents are organized by company
✅ **Document Hierarchy** - Clear lease/amendment relationships
✅ **Scalable Architecture** - Can handle multiple companies and documents
