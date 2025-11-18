const API_BASE_URL = process.env.REACT_APP_DEV === 'true' ? "http://localhost:8000" : 'https://realty-lease-poc-6uti.onrender.com';


// Document management API functions
export const documentApi = {
  // Get all documents for a company
  getDocuments: async (companyId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/companies/${companyId}/documents`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch documents: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching documents:', error);
      throw error;
    }
  },

  // Upload document to a company
  uploadDocument: async (companyId, file, metadata = {}) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('companyId', companyId);
      
      // Add metadata if provided
      if (metadata.type) formData.append('type', metadata.type);
      if (metadata.parentId) formData.append('parentId', metadata.parentId);
      if (metadata.description) formData.append('description', metadata.description);

      const response = await fetch(`${API_BASE_URL}/api/companies/${companyId}/documents`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to upload document: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  },

  // Analyze document with company context
  analyzeDocument: async (companyId, file, documentType = 'lease') => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('companyId', companyId);
      formData.append('documentType', documentType);

      const response = await fetch(`${API_BASE_URL}/company/${companyId}/documents/analyze`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to analyze document: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error analyzing document:', error);
      throw error;
    }
  },

  // Note: getDocumentAnalysis is no longer needed since the /documents endpoint
  // already contains all the analysis data. This function is deprecated.

  // Get document hierarchy for a company
  getDocumentHierarchy: async (companyId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/company/${companyId}/documents`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch document hierarchy: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching document hierarchy:', error);
      throw error;
    }
  },

  // Link amendment to lease
  linkAmendment: async (amendmentId, leaseId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/documents/${amendmentId}/link`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ parentLeaseId: leaseId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to link amendment: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error linking amendment:', error);
      throw error;
    }
  },

  // Update document metadata
  updateDocument: async (documentId, metadata) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/documents/${documentId}`, {
        method: 'PUT',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metadata),
      });

      if (!response.ok) {
        throw new Error(`Failed to update document: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error updating document:', error);
      throw error;
    }
  },

  // Delete document
  deleteDocument: async (documentId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/documents/${documentId}`, {
        method: 'DELETE',
        headers: {
          'accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete document: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  },

  // Search documents
  searchDocuments: async (query, companyId = null) => {
    try {
      let url = `${API_BASE_URL}/api/documents/search?q=${encodeURIComponent(query)}`;
      if (companyId) {
        url += `&companyId=${companyId}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to search documents: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error searching documents:', error);
      throw error;
    }
  },

  // Get CAM data for a document (lazy loading)
  getCamData: async (companyId, file, documentType = 'lease') => {
    try {
      // Return static JSON directly without making API call
      return {
        "documentMetadata": {
          "filename": "BAYER ORIGINAL LEASE",
          "currentPage": 37,
          "previousPage": 36,
          "nextPage": "N/A",
          "analysisTimestamp": "2025-11-11T23:58:12Z",
          "documentStatus": "Complete"
        },
        "newCamRules": [],
        "continuedRules": [],
        "updatedRules": [
          {
            "ruleId": "CAM-P13-002",
            "updateType": "Clarification",
            "updateReason": "Page 37 adds explicit language that only landlord‑employed personnel may perform janitorial work without landlord consent, reinforcing the earlier consent requirement.",
            "sourceDocument": "BAYER ORIGINAL LEASE",
            "newInformation": {
              "locations": [
                {
                  "pageNumber": 37,
                  "section": "Rules and Regulations",
                  "paragraph": "24",
                  "sourceDocument": "BAYER ORIGINAL LEASE"
                }
              ],
              "additionalText": "No person or contractor not employed by Landlord shall be used to perform janitorial work, window washing, cleaning, decorating, repair or other work on the Premises without express written consent of Landlord.",
              "contextualExplanation": "This language clarifies that any janitorial or related services must be performed by landlord employees unless the landlord expressly consents to an external contractor, aligning with the earlier rule that tenant may not provide janitorial services without consent."
            },
            "impactAssessment": {
              "originalInterpretation": "Tenant may request landlord‑arranged janitorial services; costs are tenant’s responsibility and landlord consent is required for any external contractor.",
              "updatedInterpretation": "Tenant may only use landlord‑employed personnel for janitorial work unless landlord provides written consent for an external contractor, reinforcing the consent requirement.",
              "impactChange": "Neutral Clarification",
              "materialityOfChange": "Moderate Clarification",
              "severityChange": "No Change",
              "favorabilityChange": "No Change"
            }
          },
          {
            "ruleId": "CAM-P13-003",
            "updateType": "Clarification",
            "updateReason": "Page 37 introduces a tenant duty not to waste electricity, water, or air‑conditioning, providing additional context to the inclusion of utilities in CAM.",
            "sourceDocument": "BAYER ORIGINAL LEASE",
            "newInformation": {
              "locations": [
                {
                  "pageNumber": 37,
                  "section": "Rules and Regulations",
                  "paragraph": "21",
                  "sourceDocument": "BAYER ORIGINAL LEASE"
                }
              ],
              "additionalText": "Tenant shall not waste electricity, water or air conditioning and shall reasonably cooperate with Landlord to assure the most effective operation of the Building's heating and air conditioning and shall refrain from attempting to adjust any controls other than room thermostats installed for Tenant's use.",
              "contextualExplanation": "This provision adds a tenant obligation to conserve utilities that are part of the common‑area expenses, potentially limiting the amount of utility costs passed through to the tenant."
            },
            "impactAssessment": {
              "originalInterpretation": "Utilities for common areas are included in CAM and passed through to tenants on a pro‑rata basis.",
              "updatedInterpretation": "In addition to being passed through, the tenant must actively avoid waste of electricity, water, and air‑conditioning, supporting cost control.",
              "impactChange": "More Favorable",
              "materialityOfChange": "Moderate Clarification",
              "severityChange": "Decreased",
              "favorabilityChange": "Improved"
            }
          }
        ],
        "flagsAndObservations": {
          "ambiguities": [],
          "conflicts": [],
          "missingProvisions": [
            {
              "provisionType": "reconciliationProcedures",
              "significance": "High",
              "tenantRisk": "Lack of clear annual true‑up process could lead to disputes over CAM amounts."
            },
            {
              "provisionType": "controllableVsNonControllable",
              "significance": "High",
              "tenantRisk": "Without a clear distinction, tenant may be liable for expenses that are typically landlord‑controlled."
            },
            {
              "provisionType": "calculationMethods",
              "significance": "High",
              "tenantRisk": "Absence of detailed calculation methodology may allow landlord discretion in expense allocation."
            }
          ],
          "tenantConcerns": [
            {
              "concernType": "utilityWasteObligation",
              "description": "Tenant is required to avoid waste of electricity, water, and air‑conditioning, which may be difficult to monitor and enforce.",
              "riskLevel": "Medium",
              "negotiationPoint": true,
              "sourceDocument": "BAYER ORIGINAL LEASE"
            },
            {
              "concernType": "janitorialServiceRestriction",
              "description": "Tenant cannot engage its own janitorial contractors without landlord consent, limiting flexibility and potentially increasing costs.",
              "riskLevel": "Medium",
              "negotiationPoint": true,
              "sourceDocument": "BAYER ORIGINAL LEASE"
            }
          ],
          "provisionsSpanningToNextPage": []
        },
        "cumulativeCamRulesSummary": {
          "sourceDocument": "BAYER ORIGINAL LEASE",
          "totalRulesExtracted": 26,
          "totalUpdates": 9,
          "totalContinuations": 1,
          "rulesByCategory": {
            "proportionateShare": 1,
            "camExpenseCategories": 7,
            "exclusions": 1,
            "paymentTerms": 9,
            "capsLimitations": 1,
            "reconciliationProcedures": 0,
            "baseYearProvisions": 1,
            "grossUpProvisions": 1,
            "administrativeFees": 2,
            "auditRights": 1,
            "noticeRequirements": 2,
            "controllableVsNonControllable": 0,
            "definitions": 2,
            "calculationMethods": 0
          },
          "completenessScore": {
            "categoriesWithRules": 13,
            "criticalMissingProvisions": [
              "reconciliationProcedures",
              "controllableVsNonControllable",
              "calculationMethods"
            ],
            "overallCompleteness": "Moderate"
          },
          "riskAssessment": {
            "overallTenantRisk": "High",
            "highRiskRuleCount": 0,
            "unfavorableRuleCount": 9,
            "keyTenantProtections": [
              "5% annual cap on controllable operating expense increases",
              "Explicit definition of Operating Expenses",
              "Detailed exclusions list protecting tenant from certain costs",
              "Clear payment schedule (monthly estimates, annual true‑up within 30 days)",
              "Annual audit right for Operating Expenses with 30‑day reimbursement for overpayments",
              "Landlord must reimburse audit costs when overstatement exceeds 5%",
              "No overhead or supervision fee for alteration contractors",
              "Payments deemed Additional Rent only satisfied upon actual receipt by Landlord",
              "Tenant set‑off right against Base Rent and Additional Rent in case of Landlord default"
            ],
            "keyTenantExposures": [
              "Gross‑up to 95% occupancy may increase CAM liability",
              "No overall ceiling on total CAM expenses",
              "Potential for non‑controllable expense growth without limit",
              "Hourly charge for landlord‑provided maintenance personnel",
              "Undefined \"reasonable rates\" for supplementary HVAC costs",
              "Unpriced optional janitorial services",
              "Extra services billed as additional rent without CAM audit rights",
              "Tenant‑caused insurance cost increases payable to landlord",
              "5% late fee on overdue CAM payments",
              "All Tenant payments, including CAM, classified as rent, triggering rent‑related penalties",
              "CAM payment obligations survive lease termination",
              "Offset provision ambiguous, may lead to disputes"
            ]
          }
        },
        "allExtractedRules": [
          {
            "ruleId": "CAM-P3-001",
            "ruleCategory": "proportionateShare",
            "sourceDocument": "BAYER ORIGINAL LEASE",
            "locations": [
              {
                "pageNumber": 3,
                "section": "Premises",
                "paragraph": "",
                "locationType": "Original",
                "sourceDocument": "BAYER ORIGINAL LEASE"
              },
              {
                "pageNumber": 4,
                "section": "Basic Lease Information",
                "paragraph": "",
                "locationType": "Continuation",
                "sourceDocument": "BAYER ORIGINAL LEASE"
              },
              {
                "pageNumber": 8,
                "section": "Taxes / Operating Expenses",
                "paragraph": "",
                "locationType": "Update",
                "sourceDocument": "BAYER ORIGINAL LEASE"
              },
              {
                "pageNumber": 9,
                "section": "Operating Expenses",
                "paragraph": "",
                "locationType": "Update",
                "sourceDocument": "BAYER ORIGINAL LEASE"
              }
            ],
            "ruleSummary": "Tenant's proportionate share of CAM expenses is based on the rentable square footage of the Premises relative to the building; taxes and operating expenses exceeding the Base Year are passed through on a pro‑ra square‑footage basis.",
            "exactLanguage": "After such measurements have been measured and validated, Landlord shall insert the rentable square feet of the Premises and Tenant's Proportionate Share in Exhibit D (Memorandum Of Acceptance Of Delivery of Premises). Tenant's Proportionate Share shall be adjusted in accordance with the Premises paragraph above. Property taxes incurred in any year during the lease term which exceed the taxes on the property during the \"Base Year\", will be passed through to building tenants based on a pro‑ra square footage basis. Operating expenses (as defined herein) incurred in any year during the lease term which exceed the operating expenses on the Building for the Base Year (2016) will be passed through to the Building tenants on a prorata basis. Tenant's pro‑ra share of building expenses shall be calculated as the resultant percentage based on the rentable square footage of the Building as the denominator and tenant's rentable square footage as the numerator.",
            "tenantImpact": "Tenant now knows that its CAM liability will be calculated as a percentage of the building based on square footage, providing a clear method for allocating tax and operating expense pass‑throughs and an explicit formula for the share.",
            "crossReferences": [],
            "impactSeverity": "Medium",
            "favorability": "Neutral",
            "ruleStatus": "Updated",
            "updateHistory": [
              {
                "updatePage": 8,
                "updateType": "Clarification",
                "updateSummary": "Added square‑footage based calculation for tax and operating expense pass‑throughs.",
                "materialityOfChange": "Moderate Clarification",
                "sourceDocument": "BAYER ORIGINAL LEASE"
              },
              {
                "updatePage": 9,
                "updateType": "Clarification",
                "updateSummary": "Provided explicit formula for proportionate share calculation.",
                "materialityOfChange": "Moderate Clarification",
                "sourceDocument": "BAYER ORIGINAL LEASE"
              }
            ],
            "firstExtractedPage": 3
          },
          {
            "ruleId": "CAM-P8-001",
            "ruleCategory": "camExpenseCategories",
            "sourceDocument": "BAYER ORIGINAL LEASE",
            "locations": [
              {
                "pageNumber": 8,
                "section": "Taxes",
                "paragraph": "",
                "locationType": "Original",
                "sourceDocument": "BAYER ORIGINAL LEASE"
              }
            ],
            "ruleSummary": "Taxes and special assessments are passed through to tenants on a pro‑ra square‑footage basis when they exceed the Base Year amount.",
            "exactLanguage": "Property taxes incurred in any year during the lease term which exceed the taxes on the property during the \"Base Year\", will be passed through to building tenants based on a pro‑ra square footage basis.",
            "tenantImpact": "Tenant will be responsible for its share of any excess real‑property taxes and special assessments, calculated according to its square‑footage proportion.",
            "crossReferences": [],
            "impactSeverity": "Medium",
            "favorability": "Neutral",
            "ruleStatus": "Complete",
            "updateHistory": [],
            "firstExtractedPage": 8
          },
          {
            "ruleId": "CAM-P8-002",
            "ruleCategory": "camExpenseCategories",
            "sourceDocument": "BAYER ORIGINAL LEASE",
            "locations": [
              {
                "pageNumber": 8,
                "section": "Operating Expenses",
                "paragraph": "",
                "locationType": "Original",
                "sourceDocument": "BAYER ORIGINAL LEASE"
              }
            ],
            "ruleSummary": "Operating expenses exceeding the Base Year (2016) are passed through to tenants on a prorata basis.",
            "exactLanguage": "Operating expenses (as defined herein) incurred in any year during the lease term which exceed the operating expenses on the Building for the Base Year (2016) (the \"Base Year'') will be passed through to the Building tenants on a prorata basis.",
            "tenantImpact": "Tenant will pay its proportionate share of any operating expense increases above the 2016 baseline.",
            "crossReferences": [],
            "impactSeverity": "Medium",
            "favorability": "Neutral",
            "ruleStatus": "Complete",
            "updateHistory": [],
            "firstExtractedPage": 8
          },
          {
            "ruleId": "CAM-P8-003",
            "ruleCategory": "baseYearProvisions",
            "sourceDocument": "BAYER ORIGINAL LEASE",
            "locations": [
              {
                "pageNumber": 8,
                "section": "Taxes / Operating Expenses",
                "paragraph": "",
                "locationType": "Original",
                "sourceDocument": "BAYER ORIGINAL LEASE"
              }
            ],
            "ruleSummary": "Base Year for tax and operating expense pass‑through is defined as calendar year 2016 (or later if building not completed).",
            "exactLanguage": "The Base Year shall be the calendar year of 2016 or such later year to the extent the assessment for the Building and Land does not reflect the value of the completed Building and Premises as contemplated hereunder.",
            "tenantImpact": "Establishes the benchmark year against which excess taxes and operating expenses are measured for pass‑through calculations.",
            "crossReferences": [],
            "impactSeverity": "Low",
            "favorability": "Neutral",
            "ruleStatus": "Complete",
            "updateHistory": [],
            "firstExtractedPage": 8
          },
          {
            "ruleId": "CAM-P8-004",
            "ruleCategory": "auditRights",
            "sourceDocument": "BAYER ORIGINAL LEASE",
            "locations": [
              {
                "pageNumber": 8,
                "section": "Taxes",
                "paragraph": "",
                "locationType": "Original",
                "sourceDocument": "BAYER ORIGINAL LEASE"
              },
              {
                "pageNumber": 10,
                "section": "Tenant's Review of Operating Expenses",
                "paragraph": "",
                "locationType": "Update",
                "sourceDocument": "BAYER ORIGINAL LEASE"
              },
              {
                "pageNumber": 11,
                "section": "Operating Expenses – Audit",
                "paragraph": "",
                "locationType": "Update",
                "sourceDocument": "BAYER ORIGINAL LEASE"
              }
            ],
            "ruleSummary": "Tenant may examine books for tax invoices within 180 days; page 10 adds an annual right to audit all Operating Expenses with a six‑month notice period and 30‑day reimbursement for overpayments; page 11 adds under‑payment obligation and landlord’s duty to reimburse audit costs when overstatement exceeds 5%.",
            "exactLanguage": "For any year in which Landlord invoices Tenant for excess property taxes, Tenant shall have a right to inspect the books and records of the property within one hundred eighty (180) days of receipt of such invoice with respect to such account. Tenant waives any right to audit after one hundred eighty (180) days. Tenant and its representatives shall have the right to examine and review Landlord's books and records pertaining to Operating Expenses (\"Tenant's Review\"), at Tenant's expense, one time during each calendar year (it is agreed that Tenant or its agents can conduct this review remotely via computer/telephone and Landlord shall use reasonable efforts to cooperate) provided that (i) Tenant provides Landlord with written notice of its election to conduct Tenant's Review no later than six (6) months following Tenant's receipt of the Annual Statement. Tenant and the person(s) conducting Tenant's Review agree that they will not divulge the contents of Landlord's books and records or the result of their examination to any other person, including any other tenant in the Building, other than Tenant's attorneys, accountants, employees and consultants who have need of the information for purposes of administering this Lease for Tenant or as otherwise required by law or in connection with legal proceedings. In the event Tenant's Review demonstrates that Landlord has overstated Operating Expenses, Landlord shall reimburse Tenant for any overpayment of Tenant's Proportionate Share of such Operating Expenses within thirty (30) days of Landlord's receipt of reasonably sufficient documentation of such overstatement from Tenant. Tenant shall promptly reimburse Landlord for any underpayment of Tenant's Proportionate Share of such Operating Expenses. In the event that Tenant's Review indicates that Operating Expenses were overstated by more than five percent (5%), then Landlord shall reimburse Tenant for the reasonable cost of such audit.",
            "tenantImpact": "Provides comprehensive audit rights, obligates tenant to pay any under‑paid CAM amounts, and protects tenant from bearing audit costs when the overstatement is material (>5%).",
            "crossReferences": [],
            "impactSeverity": "Medium",
            "favorability": "Favorable",
            "ruleStatus": "Updated",
            "updateHistory": [
              {
                "updatePage": 10,
                "updateType": "Expansion",
                "updateSummary": "Added annual Operating Expense audit rights, notice period, remote review option, confidentiality clause, and 30‑day reimbursement requirement.",
                "materialityOfChange": "Significant Change",
                "sourceDocument": "BAYER ORIGINAL LEASE"
              },
              {
                "updatePage": 11,
                "updateType": "Expansion",
                "updateSummary": "Added Tenant's obligation to reimburse under‑payments and Landlord's duty to cover audit costs when overstatement exceeds 5%.",
                "materialityOfChange": "Significant Change",
                "sourceDocument": "BAYER ORIGINAL LEASE"
              }
            ],
            "firstExtractedPage": 8
          },
          {
            "ruleId": "CAM-P8-005",
            "ruleCategory": "paymentTerms",
            "sourceDocument": "BAYER ORIGINAL LEASE",
            "locations": [
              {
                "pageNumber": 8,
                "section": "Taxes",
                "paragraph": "B",
                "locationType": "Original",
                "sourceDocument": "BAYER ORIGINAL LEASE"
              }
            ],
            "ruleSummary": "Tenant must pay any invoiced excess property taxes or taxes on personal property to Landlord upon demand.",
            "exactLanguage": "Tenant shall be liable for all taxes levied or assessed against any personal property or fixtures placed in the Premises. If any such taxes are levied or assessed against Landlord or Landlord's property and (i) Landlord pays the same or (ii) the assessed value of Landlord's property is increased by inclusion of such personal property and fixtures and Landlord pays the increased taxes, then, upon demand Tenant shall pay to Landlord such taxes.",
            "tenantImpact": "Creates an immediate payment obligation for any tax charges that the landlord passes through to the tenant.",
            "crossReferences": [],
            "impactSeverity": "Medium",
            "favorability": "Neutral",
            "ruleStatus": "Complete",
            "updateHistory": [],
            "firstExtractedPage": 8
          },
          {
            "ruleId": "CAM-P9-001",
            "ruleCategory": "definitions",
            "sourceDocument": "BAYER ORIGINAL LEASE",
            "locations": [
              {
                "pageNumber": 9,
                "section": "Operating Expenses",
                "paragraph": "",
                "locationType": "Definition",
                "sourceDocument": "BAYER ORIGINAL LEASE"
              }
            ],
            "ruleSummary": "Defines \"Operating Expense\" as all ordinary and reasonable costs incurred by Landlord for ownership, management, maintenance, repair, replacement, restoration, and operation of the property.",
            "exactLanguage": "The term \"Operating Expense\" as used herein means the actual ordinary and reasonable costs and expenses incurred by or on behalf of Landlord for each calendar year that occurs wholly or partially during the Initial Term or any Renewal Term because of or in connection with the ownership, management, maintenance, repair, replacement, restoration or operation of the Real Property, including all costs and expenses paid or incurred by Landlord for operating, equipping, policing and protecting, lighting, utilities, heating, air-conditioning, providing sanitation and other services, providing a public address system, insuring, repairing, replacing and maintaining the Building.",
            "tenantImpact": "Clarifies which costs are considered CAM, allowing the tenant to assess whether particular charges fall within the definition.",
            "crossReferences": [],
            "impactSeverity": "Medium",
            "favorability": "Neutral",
            "ruleStatus": "Complete",
            "updateHistory": [],
            "firstExtractedPage": 9
          },
          {
            "ruleId": "CAM-P9-002",
            "ruleCategory": "exclusions",
            "sourceDocument": "BAYER ORIGINAL LEASE",
            "locations": [
              {
                "pageNumber": 9,
                "section": "Operating Expenses",
                "paragraph": "",
                "locationType": "Original",
                "sourceDocument": "BAYER ORIGINAL LEASE"
              },
              {
                "pageNumber": 10,
                "section": "Operating Expenses – Exclusions",
                "paragraph": "",
                "locationType": "Update",
                "sourceDocument": "BAYER ORIGINAL LEASE"
              },
              {
                "pageNumber": 11,
                "section": "Landlord's Repairs and Maintenance",
                "paragraph": "",
                "locationType": "Update",
                "sourceDocument": "BAYER ORIGINAL LEASE"
              }
            ],
            "ruleSummary": "Specifies items excluded from Operating Expenses, now covering (i) through (xxix) plus explicit exclusion of roof, foundation, exterior and interior structural walls, and Building Systems.",
            "exactLanguage": "Notwithstanding anything in this Lease to the contrary, Operating Expenses shall not include any of the following: (i) expenses for capital improvements except as expressly provided in this Section 4; (ii) costs (in excess of Landlord's insurance deductible) of repairs, restoration, replacements or other work occasioned by fire, windstorm or other casualty of an insurable nature (whether such destruction be total or partial), or the negligence or intentional tort of Landlord, or any subsidiary or affiliate of Landlord, or any representative, employee or agent of same; (iii) interest and amortization of funds borrowed by Landlord, whether secured or unsecured, and other financing costs; (iv) depreciation of the Building; (vi) costs, fines, interest, penalties, legal fees or costs of litigation incurred due to the late payments of taxes, utility bills and other costs incurred by Landlord's failure to make such payments when due; (vii) costs incurred (less cost of recovery) for any items to the extent covered by a manufacturer's, materialmen's, vendor's or contractor's warranty; (viii) income, excess profits, franchise taxes or other such taxes imposed on or measured by the income of Landlord from the operation of the Building; (ix) costs of Landlord's defense of lawsuits against Landlord and any judgments or costs of settlement; (x) legal fees and other costs (including prepayment of any indebtedness) incurred in connection with any mortgaging, financing, refinancing, sale, change of ownership or entering into or extending or modifying any financing; (xi) the costs of services or items provided by Landlord's affiliates to the extent that such costs exceed reasonable and customary charges for such services or items in the market area; (xii) acquisition or leasing costs of sculpture, paintings or other objects of art; (xiii) accounting fees, other than those incurred in connection with the preparation of statements required pursuant to the provisions of this Lease; (xiv) costs and expenses (including court costs, attorneys' fees and disbursements) related to or in connection with disputes with any holder of a mortgage or by or among any persons having an interest in the Landlord or the Building; (xv) consulting costs and expenses paid by Landlord unless such costs and expenses result in a reduction of Operating Expenses or property taxes; (xvi) any costs incurred in connection with the investigation or remediation of any Hazardous Materials (as specified in Section 24 of this Lease) located in, on, under or about the Premises as of the date hereof or any Hazardous Materials stored, used, or released in, on, under or about the Premises after the date hereof, and any cost incurred in connection with any government investigation, order, proceeding or report with respect thereto (unless such materials were introduced in the Premises by Tenant, its invitees or guests); (xvii) costs incurred in connection with a sale, lease or transfer (including testamentary transfers) of all or any part of the Building or any interest therein, or of any interest in Landlord, or in any person comprising, directly or indirectly, Landlord, or in any person having an equity interest, directly or indirectly in Landlord; (xviii) the cost of any '1ap fees' or one‑time lump sum sewer or water connection fees for the Building payable in connection with the initial construction of the Building; (xix) any costs, fines or penalties incurred as a result of a violation by Landlord of any legal requirements; (xx) all costs and expenses (including services and utilities) payable directly by Tenant; (xxi) costs of repairing, replacing or otherwise correcting defects (but not the costs of repair or normal wear and tear) in the initial construction of the Building; (xxii) any tax other than property taxes required to be paid by the Tenant as specified in this Lease; (xxiii) costs of initial construction of the Building, including all project costs; (xxiv) costs and expenses incurred by Landlord associated with the operation of the business of the legal entity or entities which constitute Landlord (as opposed to operation of the Building); (xxv) charitable or political contributions; (xxvi) any other costs or expenses which, under generally accepted accounting principles consistently applied, would not be a normal and customary expense in comparable office buildings in the market area; (xxvii) costs of compliance with any laws (including without limitation, laws governing fire, life safety and disabilities) enacted or in effect and applicable to the Building as of the date hereof and cost of compliance with any present and future laws (including without limitation, laws governing fire, life safety and disability) affecting structural walls, roof, columns, and common areas of the Building; and (xxix) costs of any items for which Landlord is reimbursed, Landlord, at its expense and not as part of Operating Expenses shall be responsible only for repair and replacement of the roof, foundation, the exterior walls of the Building, interior structural walls, all structural components, common areas of the Building, grounds, walkways, windows, and the Building Systems, reasonable wear and tear excluded.",
            "tenantImpact": "Broadens the scope of excluded items, explicitly removing major structural components from CAM calculations and thereby reducing Tenant's expense exposure.",
            "crossReferences": [],
            "impactSeverity": "Medium",
            "favorability": "Favorable",
            "ruleStatus": "Updated",
            "updateHistory": [
              {
                "updatePage": 10,
                "updateType": "Expansion",
                "updateSummary": "Added exclusions (xi) through (xxix) to Operating Expenses.",
                "materialityOfChange": "Significant Change",
                "sourceDocument": "BAYER ORIGINAL LEASE"
              },
              {
                "updatePage": 11,
                "updateType": "Additional Context",
                "updateSummary": "Explicitly excluded roof, foundation, structural walls, and Building Systems from Operating Expenses.",
                "materialityOfChange": "Moderate Clarification",
                "sourceDocument": "BAYER ORIGINAL LEASE"
              }
            ],
            "firstExtractedPage": 9
          },
          {
            "ruleId": "CAM-P9-003",
            "ruleCategory": "capsLimitations",
            "sourceDocument": "BAYER ORIGINAL LEASE",
            "locations": [
              {
                "pageNumber": 9,
                "section": "Operating Expenses",
                "paragraph": "",
                "locationType": "Original",
                "sourceDocument": "BAYER ORIGINAL LEASE"
              }
            ],
            "ruleSummary": "Controllable Operating Expenses shall not increase by more than five percent (5%) annually following the Base Year.",
            "exactLanguage": "Controllable Operating Expenses (defined as all Operating Expenses other than property taxes and insurance) shall not increase by more than five percent (5%) annually following Tenant's Base Year.",
            "tenantImpact": "Limits the annual growth of controllable CAM costs, providing predictability for the tenant.",
            "crossReferences": [],
            "impactSeverity": "Low",
            "favorability": "Favorable",
            "ruleStatus": "Complete",
            "updateHistory": [],
            "firstExtractedPage": 9
          },
          {
            "ruleId": "CAM-P9-004",
            "ruleCategory": "grossUpProvisions",
            "sourceDocument": "BAYER ORIGINAL LEASE",
            "locations": [
              {
                "pageNumber": 9,
                "section": "Operating Expenses",
                "paragraph": "",
                "locationType": "Original",
                "sourceDocument": "BAYER ORIGINAL LEASE"
              }
            ],
            "ruleSummary": "Expenses are calculated as though the building were 95% occupied at all times (gross‑up provision).",
            "exactLanguage": "Expenses of the project as though ninety-five percent (95%) were occupied at all times (including the Base Year).",
            "tenantImpact": "If actual occupancy is below 95%, the tenant may pay a higher share of expenses than would otherwise be required.",
            "crossReferences": [],
            "impactSeverity": "Medium",
            "favorability": "Unfavorable",
            "ruleStatus": "Complete",
            "updateHistory": [],
            "firstExtractedPage": 9
          },
          {
            "ruleId": "CAM-P9-005",
            "ruleCategory": "paymentTerms",
            "sourceDocument": "BAYER ORIGINAL LEASE",
            "locations": [
              {
                "pageNumber": 9,
                "section": "Operating Expenses",
                "paragraph": "",
                "locationType": "Original",
                "sourceDocument": "BAYER ORIGINAL LEASE"
              }
            ],
            "ruleSummary": "Landlord must provide monthly estimates and an annual statement; Tenant pays estimated increases monthly as Additional Rent and settles final amounts within 30 days of the annual statement.",
            "exactLanguage": "For the calendar year commencing on January 1st of the first calendar year after the Base Year and for each calendar year thereafter during the Term, Landlord shall estimate the amount the Operating Expenses shall increase for such calendar year above the Operating Expenses incurred during the Base Year. Landlord shall send to Tenant a written statement of the amount of Tenant's Proportionate Share of any estimated increase in Operating Expenses and Tenant shall pay to Landlord, monthly as Additional Rent, Tenant's prorata share of such increase in Operating Expenses. Within ninety (90) days after the end of each calendar year, Landlord shall send an annual statement of Operating Expenses, which shall be accounted for and reported in accordance with generally accepted accounting principles (the \"Annual Statement\") to Tenant. Pursuant to the Annual Statement, Tenant shall pay to Landlord Additional Rent in a lump sum as owed or Landlord shall adjust Tenant's Rent payments if Landlord owes Tenant a credit, such payment or adjustment to be made within thirty (30) days after the Annual Statement is received by Tenant.",
            "tenantImpact": "Establishes clear timing for estimates, monthly payments, annual reconciliation, and the deadline for final settlement, reducing uncertainty.",
            "crossReferences": [],
            "impactSeverity": "Medium",
            "favorability": "Neutral",
            "ruleStatus": "Complete",
            "updateHistory": [],
            "firstExtractedPage": 9
          },
          {
            "ruleId": "CAM-P11-001",
            "ruleCategory": "definitions",
            "sourceDocument": "BAYER ORIGINAL LEASE",
            "locations": [
              {
                "pageNumber": 11,
                "section": "Landlord's Repairs and Maintenance",
                "paragraph": "",
                "locationType": "Definition",
                "sourceDocument": "BAYER ORIGINAL LEASE"
              }
            ],
            "ruleSummary": "Defines \"Building Systems\" as all plant, machinery, transformers, duct work, cable wires and other equipment designed to supply HVAC, utilities, electrical, gas, plumbing, sprinkler, communication, alarm, security, fire/life safety services, excluding tenant‑specific equipment.",
            "exactLanguage": "For purposes of this Lease, the term \"Building Systems\" shall mean any plant, machinery, transformer, duct work, cable, wires and other equipment, facilities and systems designed to supply heat, ventilation, air‑conditioning and humidity or any other services or utilities, or comprising or serving as a component or portion of the electrical, gas, plumbing, sprinkler, communication, alarm, security, or fire/life/safety systems or equipment, for the Building or the Premises, excluding, however, any equipment, computer, electronic, cabling or other systems associated with Tenant's specific design and use of the Premises.",
            "tenantImpact": "Clarifies that Building Systems are part of Operating Expenses (CAM) unless excluded elsewhere, helping Tenant assess which utility‑related costs are chargeable.",
            "crossReferences": [
              "CAM-P9-001"
            ],
            "impactSeverity": "Low",
            "favorability": "Neutral",
            "ruleStatus": "Complete",
            "updateHistory": [],
            "firstExtractedPage": 11
          },
          {
            "ruleId": "CAM-P11-002",
            "ruleCategory": "administrativeFees",
            "sourceDocument": "BAYER ORIGINAL LEASE",
            "locations": [
              {
                "pageNumber": 11,
                "section": "Landlord's Repairs and Maintenance",
                "paragraph": "",
                "locationType": "Original",
                "sourceDocument": "BAYER ORIGINAL LEASE"
              }
            ],
            "ruleSummary": "Landlord may charge Tenant $50.00 per hour (minimum one hour) for use of Landlord’s maintenance personnel when services are requested for Tenant‑responsible repairs; payment due upon invoice.",
            "exactLanguage": "In the event that such personnel are requested to attend to maintenance issues that are the responsibility of Tenant, Landlord shall charge, and Tenant shall pay, fifty dollars ($50.00) per hour, with a one hour minimum, for work performed by such personnel. Tenant shall reimburse Landlord for the cost of using such personnel upon (i) delivery and receipt of invoice(s) and (ii) confirmation that said repairs are complete.",
            "tenantImpact": "Creates a potential additional cost for Tenant beyond standard CAM charges; fees are payable upon invoicing and may accumulate if many tenant‑responsible repairs occur.",
            "crossReferences": [],
            "impactSeverity": "Medium",
            "favorability": "Unfavorable",
            "ruleStatus": "Complete",
            "updateHistory": [],
            "firstExtractedPage": 11
          },
          {
            "ruleId": "CAM-P12-001",
            "ruleCategory": "administrativeFees",
            "sourceDocument": "BAYER ORIGINAL LEASE",
            "locations": [
              {
                "pageNumber": 12,
                "section": "Alterations",
                "paragraph": "",
                "locationType": "Original",
                "sourceDocument": "BAYER ORIGINAL LEASE"
              }
            ],
            "ruleSummary": "Landlord will not charge any overhead or supervision fee for contractors used by Tenant for alterations, additions, or improvements.",
            "exactLanguage": "and there shall be no overhead or supervision fee charged by Landlord.",
            "tenantImpact": "Provides a cost‑saving benefit for Tenant when using landlord‑approved contractors for alterations, preventing additional administrative charges.",
            "crossReferences": [],
            "impactSeverity": "Low",
            "favorability": "Favorable",
            "ruleStatus": "Complete",
            "updateHistory": [],
            "firstExtractedPage": 12
          },
          {
            "ruleId": "CAM-P13-001",
            "ruleCategory": "camExpenseCategories",
            "sourceDocument": "BAYER ORIGINAL LEASE",
            "locations": [
              {
                "pageNumber": 13,
                "section": "Services",
                "paragraph": "(b)",
                "locationType": "Original",
                "sourceDocument": "BAYER ORIGINAL LEASE"
              }
            ],
            "ruleSummary": "Tenant must pay cost, operation and maintenance of any supplementary air‑conditioning units installed due to tenant equipment, at reasonable rates.",
            "exactLanguage": "Wherever heat generating machines or equipment are used in Premises which affect the temperature otherwise maintained by the air conditioning system, Landlord reserves the right to install supplementary air conditioning units in Premises and the cost, operation and maintenance thereof shall be paid by Tenant to Landlord at reasonable rates.",
            "tenantImpact": "Tenant may incur additional CAM charges for extra HVAC capacity required by its equipment, with rates set at landlord's discretion.",
            "crossReferences": [
              "CAM-P9-001"
            ],
            "impactSeverity": "Medium",
            "favorability": "Unfavorable",
            "ruleStatus": "Complete",
            "updateHistory": [],
            "firstExtractedPage": 13
          },
          {
            "ruleId": "CAM-P13-002",
            "ruleCategory": "camExpenseCategories",
            "sourceDocument": "BAYER ORIGINAL LEASE",
            "locations": [
              {
                "pageNumber": 13,
                "section": "Services",
                "paragraph": "(c)",
                "locationType": "Original",
                "sourceDocument": "BAYER ORIGINAL LEASE"
              }
            ],
            "ruleSummary": "Janitorial services may be arranged by Landlord at tenant's request; costs are borne solely by Tenant.",
            "exactLanguage": "At an additional expense to Tenant, and only if requested by Tenant, Janitorial services may be arranged by Landlord through a third‑party janitorial service. Tenant shall not be permitted to provide janitorial services without Landlord's prior written consent, such consent not to be unreasonably withheld, and then, only by a janitor contractor or employee at all times satisfactory to Landlord and subject to the supervision of Landlord. Any such service provider, contractor or employee permitted by Landlord shall be at Tenant's sole responsibility and expense.",
            "tenantImpact": "Tenant can obtain janitorial services but must pay all associated fees; inability to use its own staff without consent may limit cost control.",
            "crossReferences": [],
            "impactSeverity": "Medium",
            "favorability": "Unfavorable",
            "ruleStatus": "Complete",
            "updateHistory": [
              {
                "updatePage": 37,
                "updateType": "Clarification",
                "updateSummary": "Added language that only landlord‑employed personnel may perform janitorial work without landlord consent, reinforcing the consent requirement.",
                "materialityOfChange": "Moderate Clarification",
                "sourceDocument": "BAYER ORIGINAL LEASE"
              }
            ],
            "firstExtractedPage": 13
          },
          {
            "ruleId": "CAM-P13-003",
            "ruleCategory": "camExpenseCategories",
            "sourceDocument": "BAYER ORIGINAL LEASE",
            "locations": [
              {
                "pageNumber": 13,
                "section": "Services",
                "paragraph": "(e)",
                "locationType": "Original",
                "sourceDocument": "BAYER ORIGINAL LEASE"
              }
            ],
            "ruleSummary": "Electrical lighting, heating and air‑conditioning for all public and special service areas are provided as standard and are included in CAM.",
            "exactLanguage": "Electrical lighting services and heating and air conditioning for all public areas and special service areas of Building in the manner and to the extent reasonably deemed by Landlord to be standard.",
            "tenantImpact": "These common‑area utilities are part of the Operating Expenses that Tenant must pay its proportionate share of.",
            "crossReferences": [
              "CAM-P9-001"
            ],
            "impactSeverity": "Low",
            "favorability": "Neutral",
            "ruleStatus": "Complete",
            "updateHistory": [
              {
                "updatePage": 37,
                "updateType": "Clarification",
                "updateSummary": "Added tenant duty not to waste electricity, water, or air‑conditioning, providing additional context to the inclusion of utilities in CAM.",
                "materialityOfChange": "Moderate Clarification",
                "sourceDocument": "BAYER ORIGINAL LEASE"
              }
            ],
            "firstExtractedPage": 13
          },
          {
            "ruleId": "CAM-P13-004",
            "ruleCategory": "camExpenseCategories",
            "sourceDocument": "BAYER ORIGINAL LEASE",
            "locations": [
              {
                "pageNumber": 13,
                "section": "Services",
                "paragraph": "(e)",
                "locationType": "Original",
                "sourceDocument": "BAYER ORIGINAL LEASE"
              }
            ],
            "ruleSummary": "Passenger elevator service in common with Landlord and other tenants, 24/7, is a standard common‑area expense passed to Tenant.",
            "exactLanguage": "(ij Passenger elevator service in common with Landlord and other Tenants, twenty‑four hours, seven days a week.",
            "tenantImpact": "Elevator operation costs are allocated to Tenant as part of its CAM obligations.",
            "crossReferences": [],
            "impactSeverity": "Low",
            "favorability": "Neutral",
            "ruleStatus": "Complete",
            "updateHistory": [],
            "firstExtractedPage": 13
          },
          {
            "ruleId": "CAM-P14-001",
            "ruleCategory": "paymentTerms",
            "sourceDocument": "BAYER ORIGINAL LEASE",
            "locations": [
              {
                "pageNumber": 14,
                "section": "Services (additional)",
                "paragraph": "",
                "locationType": "Original",
                "sourceDocument": "BAYER ORIGINAL LEASE"
              }
            ],
            "ruleSummary": "Landlord‑provided extra services requested by Tenant are treated as additional rent and payable under the lease’s rent payment provisions.",
            "exactLanguage": "In the event that by agreement with Tenant, Landlord furnishes extra or additional services to be paid for by Tenant, a failure to pay for such services within thirty days after notice shall, ipso facto, authorize Landlord, in Landlord's discretion and without further notice, to discontinue such services and terminate any agreement for services. The money due for services shall be deemed additional rental due hereunder and the same shall be subject to all of the provisions pertaining to the payment of rental.",
            "tenantImpact": "Tenant may incur extra‑service charges that are classified as additional rent, meaning they are subject to the same payment schedule and enforcement mechanisms as base rent, potentially without the audit and reconciliation protections that apply to other CAM items.",
            "crossReferences": [],
            "impactSeverity": "Medium",
            "favorability": "Unfavorable",
            "ruleStatus": "Complete",
            "updateHistory": [],
            "firstExtractedPage": 14
          },
          {
            "ruleId": "CAM-P14-002",
            "ruleCategory": "camExpenseCategories",
            "sourceDocument": "BAYER ORIGINAL LEASE",
            "locations": [
              {
                "pageNumber": 14,
                "section": "Insurance",
                "paragraph": "C",
                "locationType": "Original",
                "sourceDocument": "BAYER ORIGINAL LEASE"
              }
            ],
            "ruleSummary": "Tenant must reimburse Landlord for any increase in building or premises insurance costs caused by Tenant’s use or vacancy.",
            "exactLanguage": "If any increase in the cost of any insurance on the Premises or the Building of which the Premises are a part is caused by Tenant's use of the Premises, or because Tenant vacates the Premises, then Tenant shall pay the amount of such increase to Landlord.",
            "tenantImpact": "Tenant bears the financial burden for insurance premium increases directly attributable to its activities or vacancy, expanding its CAM‑related cost exposure beyond standard operating expenses.",
            "crossReferences": [],
            "impactSeverity": "Medium",
            "favorability": "Unfavorable",
            "ruleStatus": "Complete",
            "updateHistory": [],
            "firstExtractedPage": 14
          },
          {
            "ruleId": "CAM-P21-001",
            "ruleCategory": "paymentTerms",
            "sourceDocument": "BAYER ORIGINAL LEASE",
            "locations": [
              {
                "pageNumber": 21,
                "section": "Remedies - Late Charge",
                "paragraph": "C",
                "locationType": "Original",
                "sourceDocument": "BAYER ORIGINAL LEASE"
              }
            ],
            "ruleSummary": "Late charge of 5% applied to any payment due, including CAM, if not paid within 5 business days after notice; considered additional default, not liquidated damages.",
            "exactLanguage": "In the event Tenant fails to make any payment due hereunder within (5) business days from the date of Landlord's written notice to Tenant that such payment is past due, to help defray the additional cost to Landlord for processing such late payments, Tenant shall pay to Landlord on demand a late charge in an amount equal to five percent (5%) of such payment; and the failure to pay such amount within five (5) days after demand therefor shall be an additional Event of Default hereunder. The provision for such late charge shall be in addition to all of Landlord's other rights and remedies hereunder or at law and shall not be construed as liquidated damages or as limiting Landlord's remedies in any manner.",
            "tenantImpact": "Tenant incurs a 5% penalty on overdue CAM (Additional Rent) payments, increasing cost and creating an additional default trigger.",
            "crossReferences": [],
            "impactSeverity": "Medium",
            "favorability": "Unfavorable",
            "ruleStatus": "Complete",
            "updateHistory": [],
            "firstExtractedPage": 21
          },
          {
            "ruleId": "CAM-P22-001",
            "ruleCategory": "paymentTerms",
            "sourceDocument": "BAYER ORIGINAL LEASE",
            "locations": [
              {
                "pageNumber": 22,
                "section": "H",
                "paragraph": "",
                "locationType": "Original",
                "sourceDocument": "BAYER ORIGINAL LEASE"
              }
            ],
            "ruleSummary": "All Tenant payments, including CAM and other charges, are deemed rent under the lease.",
            "exactLanguage": "Notwithstanding anything in this Lease to the contrary, all amounts payable by Tenant to or on behalf of Landlord under this Lease, whether or not expressly denominated as rent, shall constitute rent.",
            "tenantImpact": "CAM charges are treated as rent, making them subject to rent‑related penalties and default consequences.",
            "crossReferences": [
              "CAM-P21-001"
            ],
            "impactSeverity": "Medium",
            "favorability": "Unfavorable",
            "ruleStatus": "Complete",
            "updateHistory": [],
            "firstExtractedPage": 22
          },
          {
            "ruleId": "CAM-P26-001",
            "ruleCategory": "paymentTerms",
            "sourceDocument": "BAYER ORIGINAL LEASE",
            "locations": [
              {
                "pageNumber": 26,
                "section": "F",
                "paragraph": "",
                "locationType": "Original",
                "sourceDocument": "BAYER ORIGINAL LEASE"
              }
            ],
            "ruleSummary": "Tenant's payment obligations for taxes and insurance survive lease expiration or early termination, and any security deposit is credited against amounts due under this provision.",
            "exactLanguage": "All obligations of Tenant hereunder not fully performed as of the expiration or earlier termination of the Term of this Lease shall survive the expiration or earlier termination of the Term hereof, including without limitation, all payment obligations with respect to taxes and insurance and all obligations concerning the condition and repair of the Premises. Any security deposit held by Landlord shall be credited against the amounts due from Tenant under this Paragraph 28F.",
            "tenantImpact": "Tenant remains liable for tax and insurance payments and related CAM obligations even after vacating, creating post‑termination financial exposure.",
            "crossReferences": [],
            "impactSeverity": "Medium",
            "favorability": "Unfavorable",
            "ruleStatus": "Complete",
            "updateHistory": [],
            "firstExtractedPage": 26
          },
          {
            "ruleId": "CAM-P27-001",
            "ruleCategory": "paymentTerms",
            "sourceDocument": "BAYER ORIGINAL LEASE",
            "locations": [
              {
                "pageNumber": 27,
                "section": "29. NOTICES",
                "paragraph": "",
                "locationType": "Original",
                "sourceDocument": "BAYER ORIGINAL LEASE"
              }
            ],
            "ruleSummary": "All sums of money and payments due Landlord, including CAM, are classified as Additional Rent and must be actually received by Landlord to be satisfied.",
            "exactLanguage": "In addition to Base Rent due hereunder, all sums of money and all payments due Landlord hereunder shall be deemed to be additional rental (\"Additional Rent\") owed to Landlord.",
            "tenantImpact": "Clarifies that CAM charges are treated as Additional Rent and that payment is not deemed satisfied until Landlord actually receives the funds, increasing tenant's risk of default if payments are delayed.",
            "crossReferences": [],
            "impactSeverity": "Medium",
            "favorability": "Unfavorable",
            "ruleStatus": "Complete",
            "updateHistory": [],
            "firstExtractedPage": 27
          },
          {
            "ruleId": "CAM-P27-002",
            "ruleCategory": "noticeRequirements",
            "sourceDocument": "BAYER ORIGINAL LEASE",
            "locations": [
              {
                "pageNumber": 27,
                "section": "29. NOTICES",
                "paragraph": "(a)-(c)",
                "locationType": "Original",
                "sourceDocument": "BAYER ORIGINAL LEASE"
              }
            ],
            "ruleSummary": "Payments and notices must be delivered to the addresses set forth in the Basic Lease Information; delivery by certified mail, overnight carrier, or personal delivery satisfies notice requirements.",
            "exactLanguage": "All rent and other payments required to be made by Tenant to Landlord hereunder shall be payable to Landlord at the address for Landlord set forth in title Basic Lease Information or at such other address as Landlord may specify from time to time by written notice delivered in accordance herewith. ... All payments required to be made by Landlord to Tenant hereunder shall be payable to Tenant at the address set forth in the Basic Lease Information, or at such other address within the continental United States as Tenant may specify from time to time by written notice delivered in accordance herewith. ... Any written notice or document required or permitted to be delivered hereunder shall be in writing and personally delivered or sent by nationally recognized overnight carrier, such as Federal Express, or by certified mail, return receipt requested, postage prepaid, addressed to the parties hereto at the respective addresses set out in the Basic Lease Information, or at such other address as they have theretofore specified by written notice delivered in accordance herewith. All notices shall be effective upon delivery or attempted delivery as shown by the carrier's records.",
            "tenantImpact": "Establishes clear procedural requirements for delivering CAM invoices and related notices, reducing ambiguity about proper service of payment demands.",
            "crossReferences": [],
            "impactSeverity": "Low",
            "favorability": "Neutral",
            "ruleStatus": "Complete",
            "updateHistory": [],
            "firstExtractedPage": 27
          },
          {
            "ruleId": "CAM-P28-001",
            "ruleCategory": "paymentTerms",
            "sourceDocument": "BAYER ORIGINAL LEASE",
            "locations": [
              {
                "pageNumber": 28,
                "section": "33. LANDLORD DEFAULT / RIGHT OF OFFSET",
                "paragraph": "",
                "locationType": "Original",
                "sourceDocument": "BAYER ORIGINAL LEASE"
              }
            ],
            "ruleSummary": "Tenant may offset amounts owed by Landlord against Base Rent and Additional Rent (including CAM) until reimbursed, in event of Landlord default.",
            "exactLanguage": "To the extent Tenant incurs any costs in connection with the foregoing for which Landlord is responsible, Tenant may offset the amounts owed against monthly installments of Base Rent and Additional Rent due from Tenant to Landlord until Tenant is reimbursed, in full.",
            "tenantImpact": "Provides a protective set‑off mechanism allowing the tenant to withhold or reduce CAM (Additional Rent) payments if the landlord fails to meet its obligations, mitigating financial exposure.",
            "crossReferences": [
              "CAM-P27-001"
            ],
            "impactSeverity": "Medium",
            "favorability": "Favorable",
            "ruleStatus": "Complete",
            "updateHistory": [],
            "firstExtractedPage": 28
          }
        ]
      };
    } catch (error) {
      console.error('Error fetching CAM data:', error);
      throw error;
    }
  }
};
