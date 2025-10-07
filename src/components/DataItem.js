// src/components/DataItem.js
import React from 'react';

// Helper function to check if a value is empty
const isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string' && value.trim() === '') return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (typeof value === 'object' && Object.keys(value).length === 0) return true;
  return false;
};

export const DataItem = ({ label, value, citation, amendments }) => {
  // Don't render if the main value is empty
  if (isEmpty(value)) {
    return null;
  }

  return (
    <div className="data-item">
      {label && <strong className="data-item-label">{label}:</strong>}
      <p className="data-item-value">{value}</p>
      {citation && <small className="data-item-citation">Citation: {citation}</small>}
      {amendments && amendments.length > 0 && (
        <ul className="amendments-list">
          {amendments.map((amendment, index) => (
            <li key={index}>
              <strong>{amendment[0]}:</strong> {amendment[1]}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DataItem;