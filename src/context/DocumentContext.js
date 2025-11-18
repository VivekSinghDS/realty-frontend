import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { documentApi } from '../services/documentApi';

// Document context for managing document state
const DocumentContext = createContext();

// Document reducer for state management
const documentReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_DOCUMENTS':
      return { ...state, documents: action.payload, loading: false, error: null };
    case 'SET_SELECTED_DOCUMENT':
      return { ...state, selectedDocument: action.payload };
    case 'SET_ANALYSIS_DATA':
      return { ...state, analysisData: action.payload };
    case 'ADD_DOCUMENT':
      return { 
        ...state, 
        documents: [...state.documents, action.payload],
        loading: false,
        error: null 
      };
    case 'UPDATE_DOCUMENT':
      return {
        ...state,
        documents: state.documents.map(doc => 
          doc.id === action.payload.id ? action.payload : doc
        ),
        selectedDocument: action.payload.id === state.selectedDocument?.id ? action.payload : state.selectedDocument
      };
    case 'DELETE_DOCUMENT':
      return {
        ...state,
        documents: state.documents.filter(doc => doc.id !== action.payload),
        selectedDocument: state.selectedDocument?.id === action.payload ? null : state.selectedDocument
      };
    case 'SET_DOCUMENT_HIERARCHY':
      return { ...state, documentHierarchy: action.payload, loading: false, error: null };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'CLEAR_DOCUMENTS':
      return { ...state, documents: [], selectedDocument: null, analysisData: null, camData: null, uploadedFile: null };
    case 'SET_CAM_LOADING':
      return { ...state, camLoading: action.payload };
    case 'SET_CAM_DATA':
      return { ...state, camData: action.payload, camLoading: false };
    case 'SET_UPLOADED_FILE':
      return { ...state, uploadedFile: action.payload };
    default:
      return state;
  }
};

// Initial state
const initialState = {
  documents: [],
  selectedDocument: null,
  analysisData: null,
  camData: null,
  camLoading: false,
  documentHierarchy: [],
  uploadedFile: null, // Store the uploaded file for CAM API calls
  loading: false,
  error: null
};

// Document provider component
export const DocumentProvider = ({ children }) => {
  const [state, dispatch] = useReducer(documentReducer, initialState);

  // Load documents for a company
  const loadDocuments = useCallback(async (companyId) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const documents = await documentApi.getDocuments(companyId);
      dispatch({ type: 'SET_DOCUMENTS', payload: documents });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  }, []);

  // Load document hierarchy for a company
  const loadDocumentHierarchy = useCallback(async (companyId) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await documentApi.getDocumentHierarchy(companyId);
      
      console.log('API Response:', response);
      console.log('Response lease:', response.lease);
      console.log('Response amendments:', response.amendments);
      
      // Transform the API response to match frontend expectations
      // API returns: { lease: {}, amendments: [] }
      // Frontend expects: [{ lease: {}, amendments: [] }]
      if (response.lease) {
        // Add basic document properties to the lease object for UI display
        // Include all the analysis data that's already in the response
        const leaseWithBasicProps = {
          ...response.lease,
          id: `${companyId}`,
          filename: `${companyId} Lease Document`,
          type: 'lease',
          createdAt: new Date().toISOString(),
          // The analysis data is already in the response, so we keep it
          leaseInformation: response.lease.leaseInformation,
          space: response.lease.space,
          chargeSchedules: response.lease.chargeSchedules,
          otherLeaseProvisions: response.lease.otherLeaseProvisions,
          executiveSummary: response.lease.executiveSummary,
          audit_checklist: response.lease.audit_checklist || response.lease.audit_items
        };
        
        // Process amendments to include analysis data
        const processedAmendments = (response.amendments || []).map((amendment, index) => {
          console.log(`Processing amendment ${index}:`, amendment);
          console.log(`Amendment keys:`, Object.keys(amendment));
          console.log(`Amendment leaseInformation:`, amendment.leaseInformation);
          console.log(`Amendment space:`, amendment.space);
          
          // Handle nested amendment data structure
          // Amendment data is nested like: { space: { space: { unit: {...} } } }
          // We need to extract the inner data
          const extractNestedData = (data) => {
            if (!data) return null;
            // If data has a property with the same name as the parent, extract it
            const keys = Object.keys(data);
            if (keys.length === 1 && data[keys[0]] && typeof data[keys[0]] === 'object') {
              return data[keys[0]];
            }
            return data;
          };
          
          return {
            ...amendment,
            id: `${companyId}_amendment_${index}`,
            uid: `${companyId}_amendment_${index}`,
            filename: `Amendment ${index + 1}`,
            type: 'amendment',
            createdAt: new Date().toISOString(),
            // Include analysis data for amendments with nested structure handling
            leaseInformation: extractNestedData(amendment.leaseInformation),
            space: extractNestedData(amendment.space),
            chargeSchedules: extractNestedData(amendment.chargeSchedules),
            otherLeaseProvisions: extractNestedData(amendment.otherLeaseProvisions),
            executiveSummary: extractNestedData(amendment.executiveSummary),
            audit_checklist: amendment.audit_checklist || amendment.audit_items
          };
        });
        
        const transformedHierarchy = [{
          lease: leaseWithBasicProps,
          amendments: processedAmendments
        }];
        
        console.log('Transformed hierarchy:', transformedHierarchy);
        console.log('Lease with basic props:', leaseWithBasicProps);
        
        dispatch({ type: 'SET_DOCUMENT_HIERARCHY', payload: transformedHierarchy });
      } else {
        dispatch({ type: 'SET_DOCUMENT_HIERARCHY', payload: [] });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  }, []);

  // Upload document
  const uploadDocument = async (companyId, file, metadata = {}) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const newDocument = await documentApi.uploadDocument(companyId, file, metadata);
      dispatch({ type: 'ADD_DOCUMENT', payload: newDocument });
      return newDocument;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  // Analyze document
  const analyzeDocument = async (companyId, file, documentType = 'lease') => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      // Store the file for later CAM API calls
      dispatch({ type: 'SET_UPLOADED_FILE', payload: file });
      const result = await documentApi.analyzeDocument(companyId, file, documentType);
      console.log('this was the result, biki biki bow bow', result)
      
      // Set the analysis data
      if (result.analysisData) {
        // Transform audit_checklist to audit_items for component compatibility
        const transformedAnalysisData = {
          ...result.analysisData,
          audit_items: result.analysisData.audit_checklist || result.analysisData.audit_items
        };
        dispatch({ type: 'SET_ANALYSIS_DATA', payload: transformedAnalysisData });
      }
      if (result.document) {
        dispatch({ type: 'ADD_DOCUMENT', payload: result.document });
        dispatch({ type: 'SET_SELECTED_DOCUMENT', payload: result.document });
      }
      
      // Refresh the document hierarchy to show the newly analyzed document in the sidebar
      await loadDocumentHierarchy(companyId);
      
      // Clear previous CAM data and trigger CAM data loading in parallel (fire and forget - don't wait for it)
      // This allows the UI to render analyze results immediately while CAM processes in background
      dispatch({ type: 'SET_CAM_DATA', payload: null }); // Clear previous CAM data
      dispatch({ type: 'SET_CAM_LOADING', payload: true }); // Set loading state
      loadCamData(companyId, file, documentType).catch(error => {
        console.error('Failed to load CAM data in background:', error);
        // Error is already handled in loadCamData, so we just log it here
      });
      
      return result;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  // Select document and extract analysis data from already loaded hierarchy
  const selectDocument = useCallback(async (document) => {
    try {
      dispatch({ type: 'SET_SELECTED_DOCUMENT', payload: document });
      
      // Extract analysis data from the document hierarchy that's already loaded
      // The /documents endpoint already contains all the analysis data
      let analysisData = null;
      
      console.log('Selecting document:', document);
      console.log('Document type:', document.type);
      console.log('Document keys:', Object.keys(document));
      console.log('Document leaseInformation:', document.leaseInformation);
      console.log('Document space:', document.space);
      console.log('Document chargeSchedules:', document.chargeSchedules);
      
      if (document.type === 'lease') {
        // For lease documents, create the structure that the UI components expect
        analysisData = {
          leaseInformation: document.leaseInformation,
          space: document.space,
          chargeSchedules: document.chargeSchedules,
          otherLeaseProvisions: document.otherLeaseProvisions,
          executiveSummary: document.executiveSummary,
          audit_items: document.audit_checklist || document.audit_items
        };
      } else if (document.type === 'amendment') {
        // For amendments, create the structure that the UI components expect
        console.log('Creating analysis data for amendment');
        console.log('document.leaseInformation:', document.leaseInformation);
        console.log('document.space:', document.space);
        console.log('document.chargeSchedules:', document.chargeSchedules);
        
        // Handle nested amendment data structure
        // Amendment data is nested like: { space: { space: { unit: {...} } } }
        // We need to extract the inner data
        const extractNestedData = (data) => {
          if (!data) return null;
          // If data has a property with the same name as the parent, extract it
          const keys = Object.keys(data);
          if (keys.length === 1 && data[keys[0]] && typeof data[keys[0]] === 'object') {
            return data[keys[0]];
          }
          return data;
        };
        
        analysisData = {
          leaseInformation: extractNestedData(document.leaseInformation),
          space: extractNestedData(document.space),
          chargeSchedules: extractNestedData(document.chargeSchedules),
          otherLeaseProvisions: extractNestedData(document.otherLeaseProvisions),
          executiveSummary: extractNestedData(document.executiveSummary),
          audit_items: document.audit_checklist || document.audit_items
        };
        
        console.log('Created analysis data for amendment:', analysisData);
      }
      
      console.log('Created analysis data:', analysisData);
      
      if (analysisData) {
        console.log('Setting analysis data:', analysisData);
        dispatch({ type: 'SET_ANALYSIS_DATA', payload: analysisData });
      } else {
        console.log('No analysis data found for document:', document);
        console.log('Document keys:', Object.keys(document));
      }
    } catch (error) {
      console.error('Error in selectDocument:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  }, []);

  // Update document
  const updateDocument = async (documentId, metadata) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const updatedDocument = await documentApi.updateDocument(documentId, metadata);
      dispatch({ type: 'UPDATE_DOCUMENT', payload: updatedDocument });
      return updatedDocument;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  // Delete document
  const deleteDocument = async (documentId) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await documentApi.deleteDocument(documentId);
      dispatch({ type: 'DELETE_DOCUMENT', payload: documentId });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  // Link amendment to lease
  const linkAmendment = async (amendmentId, leaseId) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await documentApi.linkAmendment(amendmentId, leaseId);
      
      // Reload documents to reflect the link
      const documents = await documentApi.getDocuments(state.documents[0]?.companyId);
      dispatch({ type: 'SET_DOCUMENTS', payload: documents });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  // Search documents
  const searchDocuments = async (query, companyId = null) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const results = await documentApi.searchDocuments(query, companyId);
      dispatch({ type: 'SET_DOCUMENTS', payload: results });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  // Clear documents (when switching companies)
  const clearDocuments = () => {
    dispatch({ type: 'CLEAR_DOCUMENTS' });
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Load CAM data (lazy loading)
  const loadCamData = async (companyId, file, documentType = 'lease') => {
    try {
      dispatch({ type: 'SET_CAM_LOADING', payload: true });
      const response = await documentApi.getCamData(companyId, file, documentType);
      // Extract the 'cam' property from the response if it exists
      const camData = response.cam || response;
      dispatch({ type: 'SET_CAM_DATA', payload: camData });
      return camData;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      dispatch({ type: 'SET_CAM_LOADING', payload: false });
      throw error;
    }
  };

  const value = {
    ...state,
    loadDocuments,
    loadDocumentHierarchy,
    uploadDocument,
    analyzeDocument,
    selectDocument,
    updateDocument,
    deleteDocument,
    linkAmendment,
    searchDocuments,
    clearDocuments,
    clearError,
    loadCamData
  };

  return (
    <DocumentContext.Provider value={value}>
      {children}
    </DocumentContext.Provider>
  );
};

// Custom hook to use document context
export const useDocument = () => {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error('useDocument must be used within a DocumentProvider');
  }
  return context;
};
