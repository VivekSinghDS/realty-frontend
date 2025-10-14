// Utility function to format long text into bullet points
export const formatLongText = (text, maxSentences = 2) => {
  if (!text || typeof text !== 'string') {
    return text;
  }

  // Split text into sentences
  const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
  
  // If text is short (2 sentences or less), return as is
  if (sentences.length <= maxSentences) {
    return text;
  }

  // Group sentences into chunks
  const chunks = [];
  for (let i = 0; i < sentences.length; i += maxSentences) {
    chunks.push(sentences.slice(i, i + maxSentences).join('. ').trim() + '.');
  }

  return chunks;
};

// Component to render formatted text
export const FormattedText = ({ text, maxSentences = 2, className = "" }) => {
  const formattedText = formatLongText(text, maxSentences);
  
  if (Array.isArray(formattedText)) {
    return (
      <div className={className}>
        {formattedText.map((chunk, index) => (
          <div key={index} className="text-chunk">
            <span className="bullet-point">•</span>
            <span className="chunk-text">{chunk}</span>
          </div>
        ))}
      </div>
    );
  }
  
  return <div className={className}>{formattedText}</div>;
};

// Helper function to determine if text should be formatted
export const shouldFormatText = (text, threshold = 100) => {
  return text && typeof text === 'string' && text.length > threshold;
};

// Helper function to extract executive summary data
export const extractExecutiveSummary = (data) => {
  if (!data) return null;
  
  // Handle different possible data structures
  if (typeof data === 'string') {
    return { value: data };
  }
  
  if (data.executiveSummary) {
    return data.executiveSummary;
  }
  
  if (data.value) {
    return data;
  }
  
  // If it's an object but doesn't match expected structure, return as is
  return data;
};

// Component to render amendment objects properly
export const AmendmentRenderer = ({ amendment, index }) => {
  if (!amendment || typeof amendment !== 'object') {
    return <li key={index}>Invalid amendment data</li>;
  }

  const { amendment_type, previous_value, new_value, amendment_citation, effective_date, description } = amendment;

  return (
    <li key={index} className="amendment-item">
      <div className="amendment-header">
        <strong>Amendment {index + 1}</strong>
        {/* {amendment_type && <span className="amendment-type">({amendment_type})</span>} */}
        {/* {effective_date && <span className="amendment-date"> - Effective: {effective_date}</span>} */}
        {amendment_citation && <span className="amendment-citation"> - Citation: {amendment_citation}</span>}
      </div>
      
      {description && (
        <div className="amendment-description">
          <strong>Description:</strong> {description}
        </div>
      )}
      
      {previous_value && (
        <div className="amendment-previous">
          <strong>Previous Value:</strong>
          <FormattedText text={previous_value} maxSentences={2} />
        </div>
      )}
      
      {/* {new_value && (
        <div className="amendment-new">
          <strong>New Value:</strong>
          <FormattedText text={new_value} maxSentences={2} />
        </div>
      )} */}
    </li>
  );
};
