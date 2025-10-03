// src/components/ObligationsList.js
import React from 'react';
import Card from './Card';
import DataItem from './DataItem';

const ObligationsList = ({ data }) => {
  if (!data) return null;

  return (
    <Card title="Obligations List">
      {data.tenant_obligations && (
        <div className="sub-section">
          <h3>Tenant Obligations</h3>
          {data.tenant_obligations.map((item, index) => (
            <DataItem 
              key={index} 
              value={item.description}
              citation={item.citation}
              amendments={item.amendments}
            />
          ))}
        </div>
      )}
      {data.landlord_obligations && (
         <div className="sub-section">
          <h3>Landlord Obligations</h3>
          {data.landlord_obligations.map((item, index) => (
            <DataItem 
              key={index} 
              value={item.description}
              citation={item.citation}
              amendments={item.amendments}
            />
          ))}
        </div>
      )}
    </Card>
  );
};

export default ObligationsList;