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
