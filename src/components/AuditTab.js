import { useState } from 'react';
import { FormattedText } from '../utils/textFormatter';
import './AuditTab.css';
import '../utils/textFormatter.css';

const AuditTab = ({ data, loading }) => {
  const [expandedItems, setExpandedItems] = useState(new Set());

  if (loading) {
    return (
      <div className="tab-content-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading Audit Information...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="tab-content-container">
        <div className="no-data">
          <p>No audit information available. Please upload a document first.</p>
        </div>
      </div>
    );
  }

  const auditChecklist = data.audit_checklist || [];

  const toggleExpanded = (index) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  const getCertaintyColor = (certainty) => {
    switch (certainty?.toUpperCase()) {
      case 'HIGH':
        return '#e74c3c';
      case 'MEDIUM':
        return '#f39c12';
      case 'LOW':
        return '#27ae60';
      default:
        return '#667eea';
    }
  };

  const getCertaintyIcon = (certainty) => {
    switch (certainty?.toUpperCase()) {
      case 'HIGH':
        return '🔴';
      case 'MEDIUM':
        return '🟡';
      case 'LOW':
        return '🟢';
      default:
        return '⚪';
    }
  };

  return (
    <div className="tab-content-container">
      <div className="audit-header">
        <h2>Lease Audit Checklist</h2>
        <p className="audit-summary">
          Found {auditChecklist.length} potential issues requiring attention
        </p>
      </div>

      {auditChecklist.length === 0 ? (
        <div className="no-issues">
          <div className="success-icon">✅</div>
          <h3>No Issues Found</h3>
          <p>Great! No potential issues were identified in this lease document.</p>
        </div>
      ) : (
        <div className="audit-checklist">
          {auditChecklist.map((item, index) => (
            <div key={index} className="audit-item">
              <div 
                className="audit-item-header"
                onClick={() => toggleExpanded(index)}
              >
                <div className="audit-item-title">
                  <span className="certainty-indicator" style={{ color: getCertaintyColor(item.certainty_level) }}>
                    {getCertaintyIcon(item.certainty_level)}
                  </span>
                  <h3>{item.category}</h3>
                  <span className="certainty-badge" style={{ backgroundColor: getCertaintyColor(item.certainty_level) }}>
                    {item.certainty_level}
                  </span>
                </div>
                <div className="expand-icon">
                  {expandedItems.has(index) ? '▼' : '▶'}
                </div>
              </div>

              {expandedItems.has(index) && (
                <div className="audit-item-details">
                  <div className="audit-section">
                    <h4>Issue Description</h4>
                    <div className="audit-text">
                      {item.issue_description}
                    </div>
                  </div>

                  <div className="audit-section">
                    <h4>Affected Clause</h4>
                    <div className="audit-text">
                      {item.affected_clause}
                    </div>
                  </div>

                  {item.page_references && item.page_references.length > 0 && (
                    <div className="audit-section">
                      <h4>Page References</h4>
                      <div className="page-references">
                        {item.page_references.map((page, pageIndex) => (
                          <span key={pageIndex} className="page-reference">
                            Page {page}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="audit-section">
                    <h4>Recommended Action</h4>
                    <div className="audit-text">
                      {item.recommended_action}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AuditTab;