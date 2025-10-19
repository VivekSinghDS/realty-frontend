
import MarkdownRenderer from '../components/MarkdownRenderer';

// Helper function to extract executive summary data
export const extractExecutiveSummary = (data) => {
  if (!data) return null;
  
  // Handle different possible data structures
  if (typeof data === 'string') {
    return { value: data };
  }
  
  // If data has an executiveSummary property, extract it
  if (data.executiveSummary) {
    // If executiveSummary is an object with a value property, return it
    if (data.executiveSummary.value) {
      return data.executiveSummary;
    }
    // If executiveSummary is a string, wrap it in an object
    if (typeof data.executiveSummary === 'string') {
      return { value: data.executiveSummary };
    }
    // Otherwise return the executiveSummary object as is
    return data.executiveSummary;
  }
  
  // If data has a value property, return it
  if (data.value) {
    return data;
  }
  
  // If it's an object but doesn't match expected structure, return as is
  return data;
};

// Helper function to render content that might be Markdown
export const renderContent = (content, className = '') => {
  if (!content) return null;
  
  // If content is a string, check if it looks like Markdown
  if (typeof content === 'string') {
    return <MarkdownRenderer content={content} className={className} />;
  }
  
  // If content is an object with a value property, render the value
  if (content.value) {
    return <MarkdownRenderer content={content.value} className={className} />;
  }
  
  // For other object types, stringify and render
  return <MarkdownRenderer content={String(content)} className={className} />;
};

// Component to render amendment objects properly
export const AmendmentRenderer = ({ amendment, index }) => {
  if (!amendment || typeof amendment !== 'object') {
    return <li key={index}>Invalid amendment data</li>;
  }

  const { 
    amendment_type, 
    previous_value, 
    new_value, 
    amendment_citation, 
    effective_date, 
    description 
  } = amendment;

  return (
    <li key={index} className="amendment-item">
      <div className="amendment-header">
        <strong>Amendment {index + 1}</strong>
        {amendment_type && <span className="amendment-type">({amendment_type})</span>}
        {effective_date && <span className="amendment-date"> - Effective: {effective_date}</span>}
        {amendment_citation && <span className="amendment-citation"> - Citation: {amendment_citation}</span>}
      </div>
      
      {description && (
        <div className="amendment-description">
          <strong>Description:</strong> 
          {renderContent(description)}
        </div>
      )}
      
      {previous_value && (
        <div className="amendment-previous">
          <strong>Previous Value:</strong> 
          {renderContent(previous_value)}
        </div>
      )}
      
      {new_value && (
        <div className="amendment-new">
          <strong>New Value:</strong> 
          {renderContent(new_value)}
        </div>
      )}
    </li>
  );
};
