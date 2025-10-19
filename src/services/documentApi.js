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
  }
};
