import { useState, useEffect } from 'react';
import { getExecutiveSummary } from '../services/api';
import './InfoTab.css';

const InfoTab = ({ data, loading }) => {
  const [executiveSummary, setExecutiveSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);

  // This would be called when the component mounts if we had the file
  // For now, we'll just show the lease information data

  const renderDataItem = (label, item, key) => {
    if (!item) return null;
    
    return (
      <div key={key} className="data-item">
        <span className="data-item-label">{label}:</span>
        <div className="data-item-value">{item.value || 'N/A'}</div>
        {item.citation && (
          <div className="data-item-citation">
            📄 Citation: {item.citation}
          </div>
        )}
        {item.amendments && item.amendments.length > 0 && (
          <ul className="amendments-list">
            {item.amendments.map((amendment, index) => (
              <li key={index}>
                <strong>Amendment {index + 1}:</strong> {amendment}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="tab-content-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading lease information...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="tab-content-container">
        <div className="no-data">
          <p>No lease information available. Please upload a document first.</p>
        </div>
      </div>
    );
  }

  const leaseInfo = data.leaseInformation || {};

  return (
    <div className="tab-content-container">
      <div className="info-section">
        <h2 className="section-title">📋 Lease Information</h2>
        <div className="info-grid">
          {renderDataItem('Lease', leaseInfo.lease, 'lease')}
          {renderDataItem('Property', leaseInfo.property, 'property')}
          {renderDataItem('Lease From', leaseInfo.leaseFrom, 'leaseFrom')}
          {renderDataItem('Lease To', leaseInfo.leaseTo, 'leaseTo')}
        </div>
      </div>

      <div className="executive-summary-section">
        <h2 className="section-title">📊 Executive Summary</h2>
        <div className="summary-content">
          {summaryLoading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading executive summary...</p>
            </div>
          ) : executiveSummary ? (
            <div className="summary-data">
              {typeof executiveSummary === 'string' ? (
                <p>{executiveSummary}</p>
              ) : (
                <pre>{JSON.stringify(executiveSummary, null, 2)}</pre>
              )}
            </div>
          ) : (
            <div className="no-data">
              <p>Executive summary will be displayed here once available.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfoTab;
