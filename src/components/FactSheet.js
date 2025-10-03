// src/components/FactSheet.js
import React from 'react';
import Card from './Card';
import DataItem from './DataItem';

const FactSheet = ({ data }) => {
  if (!data) return null;

  return (
    <Card title="Fact Sheet">
      {data.key_facts && (
        <div className="sub-section">
          <h3>Key Facts</h3>
          {Object.entries(data.key_facts).map(([key, item]) => (
            <DataItem 
              key={key} 
              label={key.replace(/_/g, ' ')} 
              {...item} 
            />
          ))}
        </div>
      )}
      {data.rent_schedule && (
        <div className="sub-section">
          <h3>Rent Schedule</h3>
          {data.rent_schedule.map((item, index) => (
             <DataItem key={index} {...item.period_description} />
          ))}
        </div>
      )}
       {data.key_clauses && (
        <div className="sub-section">
          <h3>Key Clauses</h3>
          {Object.entries(data.key_clauses).map(([key, item]) => (
            <DataItem 
              key={key} 
              label={key.replace(/_/g, ' ')} 
              {...item} 
            />
          ))}
        </div>
      )}
    </Card>
  );
};

export default FactSheet;