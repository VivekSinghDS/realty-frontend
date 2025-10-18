import { AmendmentRenderer } from '../utils/textFormatter';
import './SpaceTab.css';
import '../utils/textFormatter.css';

const SpaceTab = ({ data, loading }) => {
  const renderDataItem = (label, item, key) => {
    if (!item) return null;
    
    // Handle different types of values
    const renderValue = (value) => {
      if (typeof value === 'object' && value !== null) {
        // If it's an object, render it as a formatted list
        return (
          <div className="object-value">
            {Object.entries(value).map(([key, val]) => (
              <div key={key} className="object-entry">
                <strong>{key}:</strong> {String(val)}
              </div>
            ))}
          </div>
        );
      }
      return String(value || 'N/A');
    };
    
    return (
      <div key={key} className="data-item">
        <span className="data-item-label">{label}:</span>
        <div className="data-item-value">
          {renderValue(item.value)}
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

  if (loading) {
    return (
      <div className="tab-content-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading space details...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="tab-content-container">
        <div className="no-data">
          <p>No space information available. Please upload a document first.</p>
        </div>
      </div>
    );
  }

  const spaceData = data || {};

  return (
    <div className="tab-content-container">
      <div className="space-section">
        <h2 className="section-title">🏢 Space Details</h2>
        <div className="space-grid">
          {renderDataItem('Unit', spaceData.unit, 'unit')}
          {renderDataItem('Building', spaceData.building, 'building')}
          {renderDataItem('Floor', spaceData.floor, 'floor')}
          {renderDataItem('Area Rentable', spaceData.areaRentable, 'areaRentable')}
          {renderDataItem('Area Usable', spaceData.areaUsable, 'areaUsable')}
          {renderDataItem('Status', spaceData.status, 'status')}
          {renderDataItem('Notes', spaceData.notes, 'notes')}
        </div>
      </div>
    </div>
  );
};

export default SpaceTab;
