// src/components/AuditAndExceptions.js
import React from 'react';
import Card from './Card';
import DataItem from './DataItem';

const AuditAndExceptions = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <Card title="Audit & Exceptions">
      {data.map((item, index) => (
        <div className="data-item" key={index}>
            <div className={`flag-type ${item.flag_type?.toLowerCase().replace(' ', '-')}`}>
              {item.flag_type}
            </div>
            <p>{item.description}</p>
            {item.suggested_next_step && <p><strong>Next Step:</strong> {item.suggested_next_step}</p>}
            <DataItem 
                citation={item.citation} 
                amendments={item.amendments} 
            />
        </div>
      ))}
    </Card>
  );
};

export default AuditAndExceptions;