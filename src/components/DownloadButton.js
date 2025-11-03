import React from 'react';
import { formatDataForDocx, downloadDocxFile } from '../utils/downloadUtils';
import './DownloadButton.css';

const DownloadButton = ({ analysisData, uploadedFileName, disabled = false }) => {
  const handleDownload = async () => {
    if (!analysisData || disabled) return;
    
    try {
      console.log('Starting download with data:', analysisData);
      const doc = await formatDataForDocx(analysisData, uploadedFileName);
      const filename = uploadedFileName ? uploadedFileName.replace(/\.[^/.]+$/, "") : 'lease-document';
      await downloadDocxFile(doc, filename);
    } catch (error) {
      console.error('Error generating download file:', error);
      console.error('Analysis data structure:', analysisData);
      alert(`Error generating download file: ${error.message}. Please check the console for more details.`);
    }
  };

  const hasData = analysisData && (
    analysisData.leaseInformation || 
    analysisData.space || 
    analysisData.chargeSchedules || 
    analysisData.otherLeaseProvisions || 
    analysisData.executiveSummary
  );

  if (!hasData) {
    return null;
  }

  return (
    <button 
      className={`download-button ${disabled ? 'disabled' : ''}`}
      onClick={handleDownload}
      disabled={disabled}
      title="Download analysis results as Word document"
    >
      <svg className="download-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7,10 12,15 17,10"/>
        <line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
      Download Report
    </button>
  );
};

export default DownloadButton;
