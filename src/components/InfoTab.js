import { useState, useEffect } from 'react';
import { FormattedText, extractExecutiveSummary } from '../utils/textFormatter';
import './InfoTab.css';
import '../utils/textFormatter.css';

const InfoTab = ({ data, executiveSummary, loading }) => {

  const renderDataItem = (label, item, key) => {
    if (!item) return null;
    
    return (
      <div key={key} className="data-item">
        <span className="data-item-label">{label}:</span>
        <div className="data-item-value">
          <FormattedText text={item.value || 'N/A'} maxSentences={2} />
        </div>
        {item.citation && (
          <div className="data-item-citation">
            📄 Citation: {item.citation}
          </div>
        )}
        {item.amendments && item.amendments.length > 0 && (
          <ul className="amendments-list">
            {item.amendments.map((amendment, index) => (
              <li key={index}>
                <strong>Amendment {index + 1}:</strong> 
                <FormattedText text={amendment} maxSentences={2} />
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
          {executiveSummary ? (
            <div className="summary-data">
              {(() => {
                const summaryData = extractExecutiveSummary(executiveSummary);
                
                if (typeof summaryData === 'string') {
                  return <FormattedText text={summaryData} maxSentences={3} />;
                }
                
                if (summaryData && summaryData.value) {
                  return (
                    <div className="executive-summary-formatted">
                      <div className="summary-item">
                        <span className="summary-label">Summary:</span>
                        <div className="summary-value">
                          <FormattedText text={summaryData.value || 'No summary available'} maxSentences={3} />
                        </div>
                        {summaryData.citation && (
                          <div className="summary-citation">
                            📄 Citation: {summaryData.citation}
                          </div>
                        )}
                        {summaryData.amendments && summaryData.amendments.length > 0 && (
                          <div className="summary-amendments">
                            <h5>Amendments:</h5>
                            <ul className="amendments-list">
                              {summaryData.amendments.map((amendment, index) => (
                                <li key={index}>
                                  <strong>Amendment {index + 1}:</strong> 
                                  <FormattedText text={amendment} maxSentences={2} />
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }
                
                // Fallback for unexpected data structure
                return (
                  <div className="summary-fallback">
                    <FormattedText text={JSON.stringify(executiveSummary, null, 2)} maxSentences={3} />
                  </div>
                );
              })()}
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
