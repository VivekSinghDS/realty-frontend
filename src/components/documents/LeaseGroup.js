import React, { useState } from 'react';
import DocumentItem from './DocumentItem';
import './LeaseGroup.css';

const LeaseGroup = ({ 
  lease, 
  amendments = [], 
  selectedDocument, 
  onDocumentSelect 
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleLeaseClick = () => {
    onDocumentSelect(lease);
  };

  const handleAmendmentClick = (amendment) => {
    onDocumentSelect(amendment);
  };

  const isLeaseSelected = selectedDocument?.id === lease.id;
  const hasAmendments = amendments.length > 0;

  return (
    <div className="lease-group">
      <div className="lease-header">
        <button
          className={`lease-toggle ${hasAmendments ? 'has-children' : ''}`}
          onClick={() => setIsExpanded(!isExpanded)}
          disabled={!hasAmendments}
        >
          <span className={`toggle-icon ${isExpanded ? 'expanded' : ''}`}>
            {hasAmendments ? '▼' : ''}
          </span>
        </button>
        
        <DocumentItem
          document={lease}
          isSelected={isLeaseSelected}
          onClick={handleLeaseClick}
          showDelete={false}
        />
      </div>
      
      {hasAmendments && isExpanded && (
        <div className="amendments-list">
          {amendments.map((amendment) => (
            <div key={amendment.id} className="amendment-item">
              <DocumentItem
                document={amendment}
                isSelected={selectedDocument?.id === amendment.id}
                onClick={handleAmendmentClick}
                showDelete={false}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LeaseGroup;
