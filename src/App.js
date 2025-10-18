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
import DownloadButton from "./components/DownloadButton";
import { useCompany } from "./context/CompanyContext";
import { useDocument } from "./context/DocumentContext";

// Main content component that uses the contexts
function AppContent() {
  const { selectedCompany } = useCompany();
  const { 
    selectedDocument, 
    analysisData, 
    loading, 
    error,
    analyzeDocument,
    uploadDocument 
  } = useDocument();
  
  const [activeTab, setActiveTab] = useState("info");

  const handleTabChange = (tabId) => {
    console.log('App: Tab change requested:', tabId);
    console.log('App: Current activeTab:', activeTab);
    setActiveTab(tabId);
    console.log('App: Tab changed to:', tabId);
  };
  const [showCompanySelector, setShowCompanySelector] = useState(!selectedCompany);

  const handleCompanySelect = (company) => {
    setShowCompanySelector(false);
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
    console.log('analysisData.info:', analysisData?.info);
    console.log('analysisData.space:', analysisData?.space);
    console.log('analysisData.chargeSchedules:', analysisData?.chargeSchedules);
    console.log('analysisData.misc:', analysisData?.misc);
    console.log('analysisData.executiveSummary:', analysisData?.executiveSummary);
    
    switch (activeTab) {
      case "info":
        return <InfoTab 
          data={analysisData?.info} 
          executiveSummary={analysisData?.executiveSummary} 
          loading={loading} 
        />;
      case "space":
        return <SpaceTab data={analysisData?.space} loading={loading} />;
      case "charge-schedules":
        return <ChargeSchedulesTab data={analysisData?.chargeSchedules} loading={loading} />;
      case "misc":
        return <MiscTab data={analysisData?.misc} loading={loading} />;
      case "audit":
        return <AuditTab data={analysisData?.audit} loading={loading}/>
      default:
        return <InfoTab data={analysisData?.info} loading={loading} />;
    }
  };

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
            <h1>Lease Abstract</h1>
            <p>Managing documents for {selectedCompany?.name}</p>
          </div>
          <button 
            className="change-company-btn"
            onClick={() => setShowCompanySelector(true)}
          >
            Change Company
          </button>
        </div>
      </header>

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
                  <div className="document-header">
                    <h2>{selectedDocument.filename}</h2>
                    <span className="document-type-badge">
                      {selectedDocument.type === 'lease' ? 'Lease Agreement' : 'Amendment'}
                    </span>
                  </div>
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