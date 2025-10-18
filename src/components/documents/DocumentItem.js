import React from 'react';
import './DocumentItem.css';

const DocumentItem = ({ 
  document, 
  isSelected, 
  onClick, 
  onDelete, 
  showDelete = false 
}) => {
  // Extract basic document info from the new structure
  const getDocumentInfo = (doc) => {
    // Handle both old format (direct properties) and new format (nested structure)
    if (doc.id && doc.filename) {
      // Old format - direct properties
      return {
        id: doc.id,
        filename: doc.filename,
        type: doc.type,
        createdAt: doc.createdAt
      };
    } else {
      // New format - extract from nested structure
      return {
        id: doc.uid || doc.id || 'unknown',
        filename: doc.filename || doc.name || 'Document',
        type: doc.type || 'lease', // Default to lease for new structure
        createdAt: doc.createdAt || doc.uploadedAt || new Date().toISOString()
      };
    }
  };

  const documentInfo = getDocumentInfo(document);

  const getDocumentIcon = (type) => {
    switch (type) {
      case 'lease':
        return '📄';
      case 'amendment':
        return '📝';
      default:
        return '📄';
    }
  };

  const getDocumentTypeLabel = (type) => {
    switch (type) {
      case 'lease':
        return 'Lease';
      case 'amendment':
        return 'Amendment';
      default:
        return 'Document';
    }
  };

  const handleClick = () => {
    onClick(document);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${documentInfo.filename}"?`)) {
      onDelete(documentInfo.id);
    }
  };

  return (
    <div 
      className={`document-item ${isSelected ? 'selected' : ''}`}
      onClick={handleClick}
    >
      <div className="document-icon">
        {getDocumentIcon(documentInfo.type)}
      </div>
      
      <div className="document-info">
        <div className="document-name">
          {documentInfo.filename}
        </div>
        <div className="document-meta">
          <span className="document-type">
            {getDocumentTypeLabel(documentInfo.type)}
          </span>
          {documentInfo.createdAt && (
            <span className="document-date">
              {new Date(documentInfo.createdAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
      
      {showDelete && (
        <button 
          className="delete-btn"
          onClick={handleDelete}
          title="Delete document"
        >
          🗑️
        </button>
      )}
    </div>
  );
};

export default DocumentItem;
