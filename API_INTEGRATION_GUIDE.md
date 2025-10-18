# 🔗 API Integration Guide: Multi-Company Document Management

## 📋 **Current API Structure vs New System**

### **Existing Analysis APIs (What You Have Now)**
Your current system uses these endpoints for document analysis:

```javascript
// Current API endpoints
POST /debug/info              // Lease information
POST /debug/space             // Space details  
POST /debug/charge-schedules  // Charge schedules (used by ChargeSchedulesTab.js)
POST /debug/misc              // Other lease provisions
POST /debug/executive-summary // Executive summary
POST /debug/audit             // Audit information
POST /debug/amendments        // Amendment analysis
POST /debug/save              // Save lease abstract
```

### **New Multi-Company API Structure (What You Need)**
The new system requires these additional endpoints:

```javascript
// Company Management
GET    /api/companies                    // List companies
POST   /api/companies                    // Create company
GET    /api/companies/{id}              // Get company
PUT    /api/companies/{id}              // Update company
DELETE /api/companies/{id}              // Delete company

// Document Management  
GET    /api/companies/{id}/documents           // Get company documents
POST   /api/companies/{id}/documents           // Upload document
GET    /api/companies/{id}/documents/analyze   // Analyze document with company context
GET    /api/documents/{id}/analysis            // Get document analysis
GET    /api/companies/{id}/document-hierarchy  // Get document hierarchy
POST   /api/documents/{id}/link                // Link amendment to lease
PUT    /api/documents/{id}                     // Update document
DELETE /api/documents/{id}                     // Delete document
GET    /api/documents/search                   // Search documents
```

## 🔄 **How Integration Works**

### **1. Document Upload & Analysis Flow**

#### **Old Flow:**
```
Upload PDF → analyzeDocument() → Multiple API calls → Display Results
```

#### **New Flow:**
```
Select Company → Upload PDF → analyzeDocument(companyId, file) → Save with Company Context → Display Results
```

### **2. API Integration Points**

#### **A. Document Upload with Company Context**
```javascript
// In DocumentContext.js - analyzeDocument function
const analyzeDocument = async (companyId, file) => {
  try {
    // 1. Upload file with company context
    const formData = new FormData();
    formData.append('file', file);
    formData.append('companyId', companyId);
    
    // 2. Call your existing analysis endpoints
    const response = await fetch(`${API_BASE_URL}/api/companies/${companyId}/documents/analyze`, {
      method: 'POST',
      body: formData
    });
    
    // 3. Backend should call your existing endpoints:
    // - /debug/info
    // - /debug/space  
    // - /debug/charge-schedules
    // - /debug/misc
    // - /debug/executive-summary
    // - /debug/audit
    // - /debug/amendments (if amendment)
    
    return response.json();
  } catch (error) {
    // Handle error
  }
};
```

#### **B. Backend Integration (What You Need to Implement)**

Your backend should implement the new endpoints by calling your existing analysis functions:

```python
# Example backend implementation
@app.post("/api/companies/{company_id}/documents/analyze")
async def analyze_document_with_company(company_id: int, file: UploadFile):
    # 1. Save file temporarily
    # 2. Call your existing analysis functions
    info_result = await analyze_info(file)
    space_result = await analyze_space(file)
    charge_schedules_result = await analyze_charge_schedules(file)
    misc_result = await analyze_misc(file)
    executive_summary_result = await analyze_executive_summary(file)
    audit_result = await analyze_audit(file)
    
    # 3. Combine results
    analysis_data = {
        "info": info_result,
        "space": space_result,
        "chargeSchedules": charge_schedules_result,
        "misc": misc_result,
        "executiveSummary": executive_summary_result,
        "audit": audit_result
    }
    
    # 4. Save to database with company context
    document = await save_document_analysis(company_id, file.filename, analysis_data)
    
    return {
        "document": document,
        "analysisData": analysis_data
    }
```

### **3. Tab Components Integration**

Your existing tab components (InfoTab, SpaceTab, ChargeSchedulesTab, etc.) work exactly the same way:

#### **ChargeSchedulesTab.js Integration:**
```javascript
// The ChargeSchedulesTab component receives the same data structure
const ChargeSchedulesTab = ({ data, loading }) => {
  // data.chargeSchedules contains the same structure as before
  // No changes needed to the component logic
};
```

#### **Data Flow:**
```
1. User selects company
2. User uploads document  
3. Backend calls existing /debug/charge-schedules endpoint
4. Results stored with company context
5. ChargeSchedulesTab displays same data structure
6. User can switch between documents in sidebar
```

### **4. Document Hierarchy Management**

#### **Lease + Amendments Structure:**
```javascript
// Document hierarchy structure
{
  "lease": {
    "id": 1,
    "filename": "Main Lease.pdf",
    "type": "lease",
    "analysisData": { /* existing analysis structure */ }
  },
  "amendments": [
    {
      "id": 2, 
      "filename": "Amendment 1.pdf",
      "type": "amendment",
      "parentId": 1,
      "analysisData": { /* amendment analysis */ }
    }
  ]
}
```

## 🛠️ **Implementation Steps**

### **Step 1: Backend API Implementation**
1. Create company management endpoints
2. Create document management endpoints  
3. Modify existing analysis endpoints to accept company context
4. Implement document hierarchy logic

### **Step 2: Database Schema**
```sql
-- Companies table
CREATE TABLE companies (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Documents table  
CREATE TABLE documents (
  id SERIAL PRIMARY KEY,
  company_id INTEGER REFERENCES companies(id),
  filename VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'lease' or 'amendment'
  parent_id INTEGER REFERENCES documents(id),
  analysis_data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### **Step 3: Frontend Integration**
The frontend is already implemented! The new components will:
- Use your existing tab components unchanged
- Call the new API endpoints with company context
- Display documents in hierarchical sidebar
- Maintain the same analysis display logic

## 🎯 **Key Benefits**

1. **No Changes to Tab Components** - InfoTab, SpaceTab, ChargeSchedulesTab work exactly the same
2. **Same Analysis Logic** - Your existing analysis endpoints are reused
3. **Company Context** - Documents are now organized by company
4. **Document Hierarchy** - Clear lease/amendment relationships
5. **Scalable** - Can handle multiple companies and documents

## 🔧 **Migration Strategy**

1. **Phase 1**: Implement company management APIs
2. **Phase 2**: Add company context to existing analysis endpoints  
3. **Phase 3**: Implement document hierarchy APIs
4. **Phase 4**: Deploy frontend with new components
5. **Phase 5**: Migrate existing data to new structure

The beauty of this approach is that your existing analysis logic and tab components remain completely unchanged - you're just adding company context and document management on top!
