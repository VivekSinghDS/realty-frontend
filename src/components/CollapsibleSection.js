import React, { useState } from 'react';
import Card from './Card';
import DataItem from './DataItem';
import { formatLabel, renderValue } from '../utils/helpers';

const CollapsibleSection = ({ title, data, threshold = 4 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Check if this section has more subsections than the threshold
  const hasManySubsections = Object.keys(data).length > threshold;
  
  // If it doesn't have many subsections, render normally
  if (!hasManySubsections) {
    return (
      <Card title={title}>
        <div>
          {Object.entries(data).map(([subKey, subValue]) => (
            <DataItem
              key={subKey}
              label={formatLabel(subKey)}
              value={renderValue(subValue)}
            />
          ))}
        </div>
      </Card>
    );
  }

  // For sections with many subsections, show collapsible interface
  const visibleItems = Object.entries(data).slice(0, threshold);
  const hiddenItems = Object.entries(data).slice(threshold);
  
  return (
    <Card title={title}>
      <div>
        {/* Always show the first few items */}
        {visibleItems.map(([subKey, subValue]) => (
          <DataItem
            key={subKey}
            label={formatLabel(subKey)}
            value={renderValue(subValue)}
          />
        ))}
        
        {/* Collapsible section for remaining items */}
        {hiddenItems.length > 0 && (
          <div style={{ marginTop: '1rem' }}>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="collapsible-button"
            >
              <span className={`collapsible-arrow ${isExpanded ? 'expanded' : ''}`}>
                ▶
              </span>
              {isExpanded 
                ? `Hide ${hiddenItems.length} more items` 
                : `Show ${hiddenItems.length} more items`
              }
            </button>
            
            {isExpanded && (
              <div className="collapsible-content">
                {hiddenItems.map(([subKey, subValue]) => (
                  <DataItem
                    key={subKey}
                    label={formatLabel(subKey)}
                    value={renderValue(subValue)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default CollapsibleSection;
