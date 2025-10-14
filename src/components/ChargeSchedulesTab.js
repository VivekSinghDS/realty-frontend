import { useState } from 'react';
import { FormattedText, AmendmentRenderer } from '../utils/textFormatter';
import './ChargeSchedulesTab.css';
import '../utils/textFormatter.css';

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
              <AmendmentRenderer key={index} amendment={amendment} index={index} />
            ))}
          </ul>
        )}
      </div>
    );
  };

  const renderBaseRentTable = (baseRentEntries) => {
    if (!baseRentEntries || baseRentEntries.length === 0) return null;

    return (
      <div className="base-rent-table-container">
        <table className="base-rent-table">
          <thead>
            <tr>
              <th>Entry #</th>
              <th>Description</th>
              <th>Date From</th>
              <th>Date To</th>
              <th>Monthly Amount</th>
              <th>Annual Amount</th>
              <th>Area Rentable</th>
              <th>Amount Per Area</th>
              <th>Amendments</th>
            </tr>
          </thead>
          <tbody>
            {baseRentEntries.map((item, index) => (
              <tr key={index} className="base-rent-row">
                <td className="entry-number">{index + 1}</td>
                <td className="table-cell">
                  <FormattedText text={item.description?.value || 'N/A'} maxSentences={2} />
                  {item.description?.citation && (
                    <div className="table-citation">📄 {item.description.citation}</div>
                  )}
                </td>
                <td className="table-cell">
                  <FormattedText text={item.dateFrom?.value || 'N/A'} maxSentences={1} />
                  {item.dateFrom?.citation && (
                    <div className="table-citation">📄 {item.dateFrom.citation}</div>
                  )}
                </td>
                <td className="table-cell">
                  <FormattedText text={item.dateTo?.value || 'N/A'} maxSentences={1} />
                  {item.dateTo?.citation && (
                    <div className="table-citation">📄 {item.dateTo.citation}</div>
                  )}
                </td>
                <td className="table-cell amount-cell">
                  <span className="amount-value">{item.monthlyAmount?.value || 'N/A'}</span>
                  {item.monthlyAmount?.citation && (
                    <div className="table-citation">📄 {item.monthlyAmount.citation}</div>
                  )}
                </td>
                <td className="table-cell amount-cell">
                  <span className="amount-value">{item.annualAmount?.value || 'N/A'}</span>
                  {item.annualAmount?.citation && (
                    <div className="table-citation">📄 {item.annualAmount.citation}</div>
                  )}
                </td>
                <td className="table-cell">
                  <FormattedText text={item.areaRentable?.value || 'N/A'} maxSentences={1} />
                  {item.areaRentable?.citation && (
                    <div className="table-citation">📄 {item.areaRentable.citation}</div>
                  )}
                </td>
                <td className="table-cell amount-cell">
                  <span className="amount-value">{item.amountPerArea?.value || 'N/A'}</span>
                  {item.amountPerArea?.citation && (
                    <div className="table-citation">📄 {item.amountPerArea.citation}</div>
                  )}
                </td>
                <td className="amendments-cell">
                  {item.amendments && item.amendments.length > 0 ? (
                    <div className="amendments-inline">
                      {item.amendments.map((amendment, amendIndex) => (
                        <AmendmentRenderer key={amendIndex} amendment={amendment} index={amendIndex} />
                      ))}
                    </div>
                  ) : (
                    <span className="no-amendments">None</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
                {renderBaseRentTable(chargeSchedules.baseRent)}
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
