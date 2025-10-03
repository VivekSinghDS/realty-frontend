// src/components/DataItem.js
import React from 'react';

const DataItem = ({ label, value, citation, amendments }) => {
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