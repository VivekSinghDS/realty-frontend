import React, { useState, useRef } from 'react';
import { useDocument } from '../../context/DocumentContext';
import DocumentItem from './DocumentItem';
import LeaseGroup from './LeaseGroup';
import './DocumentSidebar.css';

const DocumentSidebar = ({ company, onDocumentSelect, onUpload }) => {
  const { 
    documents, 
    selectedDocument, 
    documentHierarchy, 
    loading, 
    error,
    selectDocument,
    loadDocumentHierarchy 
  } = useDocument();
  
  const [dragActive, setDragActive] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [documentType, setDocumentType] = useState('lease');
  const [parentLeaseId, setParentLeaseId] = useState('');
  const fileInputRef = useRef(null);
  const lastLoadedCompanyRef = useRef(null);

  // Load document hierarchy when company changes
  React.useEffect(() => {
    if (company?.uid && lastLoadedCompanyRef.current !== company.uid) {
      lastLoadedCompanyRef.current = company.uid;
      loadDocumentHierarchy(company.uid);
    }
  }, [company?.uid, loadDocumentHierarchy]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf') {
        setUploadFile(file);
        setShowUploadForm(true);
      } else {
        alert('Please upload a PDF file only.');
      }
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf') {
        setUploadFile(file);
        setShowUploadForm(true);
      } else {
        alert('Please upload a PDF file only.');
      }
    }
  };

  const handleUpload = async () => {
    if (!uploadFile || !company) return;

    try {
      const metadata = {
        type: documentType,
        parentId: documentType === 'amendment' && parentLeaseId ? parseInt(parentLeaseId) : null
      };

      await onUpload(uploadFile, metadata);
      setShowUploadForm(false);
      setUploadFile(null);
      setDocumentType('lease');
      setParentLeaseId('');
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const handleDocumentClick = (document) => {
    selectDocument(document);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  if (!company) {
    return (
      <div className="document-sidebar">
        <div className="sidebar-placeholder">
          <p>Please select a company first</p>
        </div>
      </div>
    );
  }

  return (
    <div className="document-sidebar">
      <div className="sidebar-header">
        <h3>{company.name}</h3>
        <p>Document Library</p>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      <div className="sidebar-content">
        {/* Upload Area */}
        <div className="upload-section">
          <div
            className={`upload-area ${dragActive ? 'drag-active' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={openFileDialog}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileInput}
              style={{ display: 'none' }}
            />
            
            <div className="upload-content">
              <div className="upload-icon">📄</div>
              <p>Drop PDF here or click to upload</p>
            </div>
          </div>
        </div>

        {/* Document Hierarchy */}
        <div className="document-list">
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading documents...</p>
            </div>
          ) : documentHierarchy.length > 0 ? (
            documentHierarchy.map((group, index) => (
              <LeaseGroup
                key={group.lease.uid}
                lease={group.lease}
                amendments={group.amendments}
                selectedDocument={selectedDocument}
                onDocumentSelect={handleDocumentClick}
              />
            ))
          ) : (
            <div className="empty-state">
              <p>No documents found</p>
              <p className="empty-hint">Upload your first lease document to get started</p>
            </div>
          )}
        </div>
      </div>

      {/* Upload Form Modal */}
      {showUploadForm && (
        <div className="upload-modal-overlay">
          <div className="upload-modal">
            <div className="modal-header">
              <h3>Upload Document</h3>
              <button 
                className="close-btn"
                onClick={() => setShowUploadForm(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-content">
              <div className="file-info">
                <p><strong>File:</strong> {uploadFile?.name}</p>
              </div>
              
              <div className="form-group">
                <label htmlFor="document-type">Document Type:</label>
                <select
                  id="document-type"
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  className="document-type-select"
                >
                  <option value="lease">Lease Agreement</option>
                  <option value="amendment">Amendment</option>
                </select>
              </div>
              
              {documentType === 'amendment' && (
                <div className="form-group">
                  <label htmlFor="parent-lease">Parent Lease:</label>
                  <select
                    id="parent-lease"
                    value={parentLeaseId}
                    onChange={(e) => setParentLeaseId(e.target.value)}
                    className="parent-lease-select"
                  >
                    <option value="">Select parent lease...</option>
                    {documents
                      .filter(doc => doc.type === 'lease')
                      .map(doc => (
                        <option key={doc.id} value={doc.id}>
                          {doc.filename}
                        </option>
                      ))}
                  </select>
                </div>
              )}
            </div>
            
            <div className="modal-actions">
              <button
                onClick={handleUpload}
                className="upload-btn"
                disabled={documentType === 'amendment' && !parentLeaseId}
              >
                Upload & Analyze
              </button>
              <button
                onClick={() => setShowUploadForm(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentSidebar;
