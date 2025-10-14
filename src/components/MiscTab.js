import { useState } from 'react';
import { FormattedText, AmendmentRenderer } from '../utils/textFormatter';
import './MiscTab.css';
import '../utils/textFormatter.css';

const MiscTab = ({ data, loading }) => {
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

  const renderProvisionSection = (provisionKey, provisionData, title) => {
    if (!provisionData) return null;

    return (
      <div key={provisionKey} className="provision-section">
        <button
          className="collapsible-button"
          onClick={() => toggleSection(provisionKey)}
        >
          <span className={`collapsible-arrow ${expandedSections[provisionKey] ? 'expanded' : ''}`}>
            ▶
          </span>
          <span>{title}</span>
        </button>
        {expandedSections[provisionKey] && (
          <div className="collapsible-content">
            <div className="provision-grid">
              {renderDataItem('Synopsis', provisionData.synopsis, `${provisionKey}-synopsis`)}
              {renderDataItem('Definition', provisionData.definition, `${provisionKey}-definition`)}
              {renderDataItem('Key Parameters', provisionData.keyParameters, `${provisionKey}-keyParameters`)}
              {renderDataItem('Narrative', provisionData.narrative, `${provisionKey}-narrative`)}
              {renderDataItem('Billing Timeline', provisionData.billingTimeline, `${provisionKey}-billingTimeline`)}
              {renderDataItem('Formulas', provisionData.formulas, `${provisionKey}-formulas`)}
              {renderDataItem('Capital Rules', provisionData.capitalRules, `${provisionKey}-capitalRules`)}
            </div>
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
          <p>Loading Lease Sections</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="tab-content-container">
        <div className="no-data">
          <p>No miscellaneous provisions available. Please upload a document first.</p>
        </div>
      </div>
    );
  }

  const otherLeaseProvisions = data.otherLeaseProvisions || {};

  const provisionSections = [
    { key: 'premisesAndTerm', title: 'Premises and Term', data: otherLeaseProvisions.premisesAndTerm },
    { key: 'taxes', title: 'Taxes', data: otherLeaseProvisions.taxes },
    { key: 'operatingExpenses', title: 'Operating Expenses', data: otherLeaseProvisions.operatingExpenses },
    { key: 'repairsAndMaintenance', title: 'Repairs and Maintenance', data: otherLeaseProvisions.repairsAndMaintenance },
    { key: 'alterations', title: 'Alterations', data: otherLeaseProvisions.alterations },
    { key: 'signs', title: 'Signs', data: otherLeaseProvisions.signs },
    { key: 'services', title: 'Services', data: otherLeaseProvisions.services },
    { key: 'insurance', title: 'Insurance', data: otherLeaseProvisions.insurance },
    { key: 'casualty', title: 'Casualty', data: otherLeaseProvisions.casualty },
    { key: 'liabilityAndIndemnification', title: 'Liability and Indemnification', data: otherLeaseProvisions.liabilityAndIndemnification },
    { key: 'use', title: 'Use', data: otherLeaseProvisions.use },
    { key: 'landlordsRightOfEntry', title: "Landlord's Right of Entry", data: otherLeaseProvisions.landlordsRightOfEntry },
    { key: 'assignmentAndSubletting', title: 'Assignment and Subletting', data: otherLeaseProvisions.assignmentAndSubletting },
    { key: 'parking', title: 'Parking', data: otherLeaseProvisions.parking },
    { key: 'condemnation', title: 'Condemnation', data: otherLeaseProvisions.condemnation },
    { key: 'holdover', title: 'Holdover', data: otherLeaseProvisions.holdover },
    { key: 'quietEnjoyment', title: 'Quiet Enjoyment', data: otherLeaseProvisions.quietEnjoyment },
    { key: 'defaultAndRemedies', title: 'Default and Remedies', data: otherLeaseProvisions.defaultAndRemedies },
    { key: 'subordination', title: 'Subordination', data: otherLeaseProvisions.subordination },
    { key: 'liens', title: 'Liens', data: otherLeaseProvisions.liens },
    { key: 'hazardousMaterials', title: 'Hazardous Materials', data: otherLeaseProvisions.hazardousMaterials },
    { key: 'rulesAndRegulations', title: 'Rules and Regulations', data: otherLeaseProvisions.rulesAndRegulations },
    { key: 'brokerage', title: 'Brokerage', data: otherLeaseProvisions.brokerage },
    { key: 'estoppel', title: 'Estoppel', data: otherLeaseProvisions.estoppel },
    { key: 'notices', title: 'Notices', data: otherLeaseProvisions.notices },
    { key: 'rightOfFirstRefusalOffer', title: 'Right of First Refusal Offer', data: otherLeaseProvisions.rightOfFirstRefusalOffer },
    { key: 'expansionAndRelocation', title: 'Expansion and Relocation', data: otherLeaseProvisions.expansionAndRelocation },
    { key: 'landlordDefault', title: 'Landlord Default', data: otherLeaseProvisions.landlordDefault }
  ];

  return (
    <div className="tab-content-container">
      <div className="misc-section">
        <h2 className="section-title">📄 Miscellaneous Provisions</h2>
        <p className="section-description">
          Click on any provision below to view detailed information extracted from the lease document.
        </p>
        
        <div className="provisions-list">
          {provisionSections.map(({ key, title, data }) => 
            renderProvisionSection(key, data, title)
          )}
        </div>
      </div>
    </div>
  );
};

export default MiscTab;
