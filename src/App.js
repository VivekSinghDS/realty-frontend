import React, { useState } from "react";
import "./App.css";
import { CompanyProvider } from "./context/CompanyContext";
import { DocumentProvider } from "./context/DocumentContext";
import CompanySelector from "./components/company/CompanySelector";
import DocumentSidebar from "./components/documents/DocumentSidebar";
import TabNavigation from "./components/TabNavigation";
import InfoTab from "./components/InfoTab";
import SpaceTab from "./components/SpaceTab";
import ChargeSchedulesTab from "./components/ChargeSchedulesTab";
import MiscTab from "./components/MiscTab";
import AuditTab from "./components/AuditTab";
import CamTab from "./components/CamTab";
import DownloadButton from "./components/DownloadButton";
import { useCompany } from "./context/CompanyContext";
import { useDocument } from "./context/DocumentContext";

// Main content component that uses the contexts
function AppContent() {
  const { selectedCompany, clearSelectedCompany, deleteCompany, loadCompanies } = useCompany();
  const { 
    selectedDocument, 
    analysisData, 
    camData,
    camLoading,
    loading, 
    error,
    analyzeDocument,
    uploadDocument
  } = useDocument();
  
  const [activeTab, setActiveTab] = useState("info");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleTabChange = async (tabId) => {
    console.log('App: Tab change requested:', tabId);
    console.log('App: Current activeTab:', activeTab);
    setActiveTab(tabId);
    console.log('App: Tab changed to:', tabId);
  };
  const [showCompanySelector, setShowCompanySelector] = useState(!selectedCompany);

  const handleCompanySelect = (company) => {
    setShowCompanySelector(false);
  };

  const handleBackToCompanySelection = () => {
    clearSelectedCompany();
    setShowCompanySelector(true);
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCompany?.uid) return;
    
    try {
      setIsDeleting(true);
      await deleteCompany(selectedCompany.uid);
      // Reload companies list to refresh the UI
      await loadCompanies();
      // Redirect to company selection page after successful deletion
      clearSelectedCompany();
      setShowCompanySelector(true);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Error deleting company:', error);
      alert('Failed to delete company. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  const handleDocumentSelect = (document) => {
    // Document selection is handled by the DocumentContext
    console.log('Document selected:', document);
  };

  const handleDocumentUpload = async (file, metadata = {}) => {
    if (!selectedCompany?.uid) return;
    
    try {
      await analyzeDocument(selectedCompany.uid, file, metadata.type || 'lease');
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const renderActiveTab = () => {
    if (!selectedDocument) return null;
    
    console.log('Rendering tab with analysisData:', analysisData);
    console.log('Selected document:', selectedDocument);
    console.log('analysisData.info:', analysisData?.leaseInformation);
    console.log('analysisData.space:', analysisData?.space);
    console.log('analysisData.chargeSchedules:', analysisData?.chargeSchedules);
    console.log('analysisData.misc:', analysisData?.otherLeaseProvisions);
    console.log('analysisData.executiveSummary:', analysisData?.executiveSummary);
    
    switch (activeTab) {
      case "info":
        return <InfoTab 
          data={analysisData?.leaseInformation} 
          executiveSummary={analysisData?.executiveSummary} 
          loading={loading} 
        />;
      case "space":
        return <SpaceTab data={analysisData?.space} loading={loading} />;
      case "charge-schedules":
        return <ChargeSchedulesTab data={analysisData?.chargeSchedules} loading={loading} />;
      case "misc":
        return <MiscTab data={analysisData?.otherLeaseProvisions} loading={loading} />;
      case "audit":
        return <AuditTab data={analysisData?.audit_items} loading={loading}/>
      case "cam":
        return <CamTab data={camData} loading={camLoading} />
      default:
        return <InfoTab data={analysisData?.leaseInformation} loading={loading} />;
    }
  };
  // switch (activeTab) {
  //     case "info":
  //       return <InfoTab 
  //         data={selectedDocument?.leaseInformation} 
  //         executiveSummary={selectedDocument?.executiveSummary} 
  //         loading={loading} 
  //       />;
  //     case "space":
  //       return <SpaceTab data={selectedDocument?.space} loading={loading} />;
  //     case "charge-schedules":
  //       return <ChargeSchedulesTab data={selectedDocument?.chargeSchedules} loading={loading} />;
  //     case "misc":
  //       return <MiscTab data={selectedDocument?.otherLeaseProvisions} loading={loading} />;
  //     case "audit":
  //       return <AuditTab data={selectedDocument?.audit_items} loading={loading}/>
  //     default:
  //       return <InfoTab data={selectedDocument?.leaseInformation} loading={loading} />;
  //   }
  // };

  if (showCompanySelector) {
    return (
      <div className="app">
        <header className="app-header">
          <h1>Lease Abstract</h1>
          <p>Select a company to manage lease documents</p>
        </header>
        <main className="app-main">
          <CompanySelector onCompanySelect={handleCompanySelect} />
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="header-title">
            <h1>Lease Abstraction</h1>
          </div>
          <div className="header-actions">
            <button 
              className="back-to-company-btn"
              onClick={handleBackToCompanySelection}
              title="Back to company selection"
            >
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </button>
            <button 
              className="delete-company-btn"
              onClick={handleDeleteClick}
              title="Delete company"
              disabled={isDeleting}
            >
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={handleDeleteCancel}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Delete Company</h2>
            <p>Are you sure you want to delete this company? This action cannot be undone.</p>
            <div className="modal-actions">
              <button 
                className="modal-btn modal-btn-cancel" 
                onClick={handleDeleteCancel}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button 
                className="modal-btn modal-btn-confirm" 
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="app-main">
        <div className="app-layout">
          <DocumentSidebar 
            company={selectedCompany}
            onDocumentSelect={handleDocumentSelect}
            onUpload={handleDocumentUpload}
          />
          
          <div className="analysis-section">
            {selectedDocument ? (
              <>
                <div className="analysis-header">
                  {/* <div className="document-header"> */}
                    {/* <h2>{selectedDocument.filename}</h2> */}
                    {/* <span className="document-type-badge">
                      {selectedDocument.type === 'lease' ? 'Lease Agreement' : 'Amendment'}
                    </span> */}
                  {/* </div> */}
                  <div className="analysis-controls">
                    <TabNavigation 
                      activeTab={activeTab}
                      onTabChange={handleTabChange}
                    />
                    <DownloadButton 
                      analysisData={analysisData}
                      uploadedFileName={selectedDocument.filename}
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="tab-content">
                  {renderActiveTab()}
                </div>
              </>
            ) : (
              <div className="no-document-selected">
                <div className="empty-state">
                  <h3>No Document Selected</h3>
                  <p>Choose a document from the sidebar to view its analysis</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// Main App component with providers
function App() {
  return (
    <CompanyProvider>
      <DocumentProvider>
        <AppContent />
      </DocumentProvider>
    </CompanyProvider>
  );
}

export default App;