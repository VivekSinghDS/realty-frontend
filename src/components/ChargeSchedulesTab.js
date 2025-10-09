import { useState } from 'react';
import './ChargeSchedulesTab.css';

const ChargeSchedulesTab = ({ data, loading }) => {
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (sectionKey) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

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

  const renderBaseRentItem = (item, index) => {
    return (
      <div key={index} className="base-rent-item">
        <h4>Base Rent Entry {index + 1}</h4>
        <div className="base-rent-grid">
          {renderDataItem('Charge Code', item.chargeCode, `chargeCode-${index}`)}
          {renderDataItem('Description', item.description, `description-${index}`)}
          {renderDataItem('Date From', item.dateFrom, `dateFrom-${index}`)}
          {renderDataItem('Date To', item.dateTo, `dateTo-${index}`)}
          {renderDataItem('Monthly Amount', item.monthlyAmount, `monthlyAmount-${index}`)}
          {renderDataItem('Annual Amount', item.annualAmount, `annualAmount-${index}`)}
          {renderDataItem('Area Rentable', item.areaRentable, `areaRentable-${index}`)}
          {renderDataItem('Amount Per Area', item.amountPerArea, `amountPerArea-${index}`)}
          {renderDataItem('Management Fees', item.managementFees, `managementFees-${index}`)}
        </div>
        {item.amendments && item.amendments.length > 0 && (
          <div className="amendments-section">
            <h5>Amendments:</h5>
            <ul className="amendments-list">
              {item.amendments.map((amendment, amendIndex) => (
                <li key={amendIndex}>
                  <strong>Amendment {amendIndex + 1}:</strong> {amendment}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="tab-content-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading charge schedules...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="tab-content-container">
        <div className="no-data">
          <p>No charge schedule information available. Please upload a document first.</p>
        </div>
      </div>
    );
  }

  const chargeSchedules = data.chargeSchedules || {};

  return (
    <div className="tab-content-container">
      <div className="charge-schedules-section">
        <h2 className="section-title">💰 Charge Schedules</h2>
        
        {/* Base Rent Section */}
        {chargeSchedules.baseRent && chargeSchedules.baseRent.length > 0 && (
          <div className="schedule-section">
            <button
              className="collapsible-button"
              onClick={() => toggleSection('baseRent')}
            >
              <span className={`collapsible-arrow ${expandedSections.baseRent ? 'expanded' : ''}`}>
                ▶
              </span>
              <span>Base Rent ({chargeSchedules.baseRent.length} entries)</span>
            </button>
            {expandedSections.baseRent && (
              <div className="collapsible-content">
                {chargeSchedules.baseRent.map((item, index) => renderBaseRentItem(item, index))}
              </div>
            )}
          </div>
        )}

        {/* Late Fee Section */}
        {chargeSchedules.lateFee && (
          <div className="schedule-section">
            <button
              className="collapsible-button"
              onClick={() => toggleSection('lateFee')}
            >
              <span className={`collapsible-arrow ${expandedSections.lateFee ? 'expanded' : ''}`}>
                ▶
              </span>
              <span>Late Fee Information</span>
            </button>
            {expandedSections.lateFee && (
              <div className="collapsible-content">
                <div className="late-fee-grid">
                  {renderDataItem('Calculation Type', chargeSchedules.lateFee.calculationType, 'calculationType')}
                  {renderDataItem('Grace Days', chargeSchedules.lateFee.graceDays, 'graceDays')}
                  {renderDataItem('Percent', chargeSchedules.lateFee.percent, 'percent')}
                  {renderDataItem('Second Fee Calculation Type', chargeSchedules.lateFee.secondFeeCalculationType, 'secondFeeCalculationType')}
                  {renderDataItem('Second Fee Grace', chargeSchedules.lateFee.secondFeeGrace, 'secondFeeGrace')}
                  {renderDataItem('Second Fee Percent', chargeSchedules.lateFee.secondFeePercent, 'secondFeePercent')}
                  {renderDataItem('Per Day Fee', chargeSchedules.lateFee.perDayFee, 'perDayFee')}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChargeSchedulesTab;
