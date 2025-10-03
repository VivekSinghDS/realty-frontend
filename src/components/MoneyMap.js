// src/components/MoneyMap.js
import React from 'react';
import Card from './Card';
import DataItem from './DataItem';

const MoneyMap = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <Card title="Money Map">
      {data.map((item, index) => (
        <DataItem
          key={index}
          label={item.clause_name}
          value={item.explanation}
          citation={item.citation}
          amendments={item.amendments}
        />
      ))}
    </Card>
  );
};

export default MoneyMap;