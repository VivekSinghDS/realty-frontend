// Utility functions for downloading analysis results
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';

export const formatDataForText = (analysisData, uploadedFileName) => {
  try {
    const timestamp = new Date().toLocaleString();
    const fileName = uploadedFileName || 'lease-document';
    
    let textContent = '';
    
    // Header
    textContent += '='.repeat(80) + '\n';
    textContent += 'LEASE ANALYSIS REPORT\n';
    textContent += '='.repeat(80) + '\n';
    textContent += `Generated: ${timestamp}\n`;
    textContent += `Document: ${fileName}\n`;
    textContent += '='.repeat(80) + '\n\n';

  // Executive Summary
  if (analysisData.executiveSummary) {
    textContent += 'EXECUTIVE SUMMARY\n';
    textContent += '-'.repeat(40) + '\n';
    
    // Handle different possible structures for executive summary
    let summaryText = '';
    if (typeof analysisData.executiveSummary === 'string') {
      summaryText = analysisData.executiveSummary;
    } else if (analysisData.executiveSummary.value) {
      summaryText = analysisData.executiveSummary.value;
    } else if (analysisData.executiveSummary.executiveSummary && analysisData.executiveSummary.executiveSummary.value) {
      summaryText = analysisData.executiveSummary.executiveSummary.value;
    } else {
      summaryText = formatTextValue(analysisData.executiveSummary);
    }
    
    textContent += formatTextValue(summaryText) + '\n\n';
  }

  // Lease Information
  if (analysisData.info?.leaseInformation) {
    textContent += 'LEASE INFORMATION\n';
    textContent += '-'.repeat(40) + '\n';
    const leaseInfo = analysisData.info.leaseInformation;
    
    Object.entries(leaseInfo).forEach(([key, value]) => {
      if (value && (value.value !== undefined && value.value !== null)) {
        textContent += `${formatLabel(key)}: ${formatTextValue(value.value)}\n`;
        if (value.citation) {
          textContent += `  Citation: ${formatTextValue(value.citation)}\n`;
        }
        if (value.amendments && Array.isArray(value.amendments) && value.amendments.length > 0) {
          value.amendments.forEach((amendment, index) => {
            textContent += `  Amendment ${index + 1}: ${formatTextValue(amendment)}\n`;
          });
        }
        textContent += '\n';
      }
    });
  }

  // Space Information
  if (analysisData.space?.space) {
    textContent += 'SPACE INFORMATION\n';
    textContent += '-'.repeat(40) + '\n';
    const spaceData = analysisData.space.space;
    
    Object.entries(spaceData).forEach(([key, value]) => {
      if (value && (value.value !== undefined && value.value !== null)) {
        textContent += `${formatLabel(key)}: ${formatTextValue(value.value)}\n`;
        if (value.citation) {
          textContent += `  Citation: ${formatTextValue(value.citation)}\n`;
        }
        if (value.amendments && Array.isArray(value.amendments) && value.amendments.length > 0) {
          value.amendments.forEach((amendment, index) => {
            textContent += `  Amendment ${index + 1}: ${formatTextValue(amendment)}\n`;
          });
        }
        textContent += '\n';
      }
    });
  }

  // Charge Schedules
  if (analysisData.chargeSchedules?.chargeSchedules) {
    textContent += 'CHARGE SCHEDULES\n';
    textContent += '-'.repeat(40) + '\n';
    const chargeSchedules = analysisData.chargeSchedules.chargeSchedules;
    
    // Base Rent Entries
    if (chargeSchedules.baseRent && chargeSchedules.baseRent.length > 0) {
      textContent += 'BASE RENT ENTRIES\n';
      textContent += '='.repeat(60) + '\n';
      
      chargeSchedules.baseRent.forEach((entry, index) => {
        textContent += `Entry ${index + 1}:\n`;
        textContent += '-'.repeat(20) + '\n';
        
        const fields = [
          'chargeCode', 'description', 'dateFrom', 'dateTo',
          'monthlyAmount', 'annualAmount', 'areaRentable', 
          'amountPerArea', 'managementFees'
        ];
        
        fields.forEach(field => {
          if (entry[field] && (entry[field].value !== undefined && entry[field].value !== null)) {
            textContent += `${formatLabel(field)}: ${formatTextValue(entry[field].value)}\n`;
            if (entry[field].citation) {
              textContent += `  Citation: ${formatTextValue(entry[field].citation)}\n`;
            }
          }
        });
        
        if (entry.amendments && Array.isArray(entry.amendments) && entry.amendments.length > 0) {
          textContent += 'Amendments:\n';
          entry.amendments.forEach((amendment, amendIndex) => {
            textContent += `  Amendment ${amendIndex + 1}: ${formatTextValue(amendment)}\n`;
          });
        }
        textContent += '\n';
      });
    }
    
    // Late Fee Information
    if (chargeSchedules.lateFee) {
      textContent += 'LATE FEE INFORMATION\n';
      textContent += '='.repeat(60) + '\n';
      
      const lateFeeFields = [
        'calculationType', 'graceDays', 'percent', 'secondFeeCalculationType',
        'secondFeeGrace', 'secondFeePercent', 'perDayFee'
      ];
      
      lateFeeFields.forEach(field => {
        if (chargeSchedules.lateFee[field] && (chargeSchedules.lateFee[field].value !== undefined && chargeSchedules.lateFee[field].value !== null)) {
          textContent += `${formatLabel(field)}: ${formatTextValue(chargeSchedules.lateFee[field].value)}\n`;
          if (chargeSchedules.lateFee[field].citation) {
            textContent += `  Citation: ${formatTextValue(chargeSchedules.lateFee[field].citation)}\n`;
          }
        }
      });
      textContent += '\n';
    }
  }

  // Miscellaneous Information
  if (analysisData.misc) {
    textContent += 'MISCELLANEOUS INFORMATION\n';
    textContent += '-'.repeat(40) + '\n';
    
    Object.entries(analysisData.misc).forEach(([sectionKey, sectionData]) => {
      if (sectionData && typeof sectionData === 'object') {
        textContent += `${formatLabel(sectionKey)}:\n`;
        Object.entries(sectionData).forEach(([key, value]) => {
          if (value && (value.value !== undefined && value.value !== null)) {
            textContent += `  ${formatLabel(key)}: ${formatTextValue(value.value)}\n`;
            if (value.citation) {
              textContent += `    Citation: ${formatTextValue(value.citation)}\n`;
            }
            if (value.amendments && Array.isArray(value.amendments) && value.amendments.length > 0) {
              value.amendments.forEach((amendment, index) => {
                textContent += `    Amendment ${index + 1}: ${formatTextValue(amendment)}\n`;
              });
            }
          }
        });
        textContent += '\n';
      }
    });
  }

    textContent += '='.repeat(80) + '\n';
    textContent += 'End of Report\n';
    textContent += '='.repeat(80) + '\n';
    
    return textContent;
  } catch (error) {
    console.error('Error formatting data for text:', error);
    throw new Error(`Failed to format data: ${error.message}`);
  }
};

const formatLabel = (key) => {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
};

const formatTextValue = (value) => {
  if (!value) return 'N/A';
  
  // Convert to string if it's not already
  let stringValue = value;
  if (typeof value !== 'string') {
    if (typeof value === 'number') {
      stringValue = value.toString();
    } else if (typeof value === 'object') {
      stringValue = JSON.stringify(value);
    } else {
      stringValue = String(value);
    }
  }
  
  // Remove HTML tags and clean up text
  return stringValue
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
};

export const downloadTextFile = (content, filename) => {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}-analysis-${new Date().toISOString().split('T')[0]}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

// DOCX formatting functions
export const formatDataForDocx = async (analysisData, uploadedFileName) => {
  try {
    const timestamp = new Date().toLocaleString();
    const fileName = uploadedFileName || 'lease-document';
    
    const children = [];
    
    // Title page
    children.push(
      new Paragraph({
        text: "LEASE ANALYSIS REPORT",
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
      }),
      new Paragraph({
        children: [
          new TextRun({ text: `Generated: ${timestamp}`, bold: true }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      }),
      new Paragraph({
        children: [
          new TextRun({ text: `Document: ${fileName}` }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 600 },
      }),
    );

    // Executive Summary
    if (analysisData.executiveSummary) {
      let summaryText = '';
      if (typeof analysisData.executiveSummary === 'string') {
        summaryText = analysisData.executiveSummary;
      } else if (analysisData.executiveSummary.value) {
        summaryText = analysisData.executiveSummary.value;
      } else if (analysisData.executiveSummary.executiveSummary && analysisData.executiveSummary.executiveSummary.value) {
        summaryText = analysisData.executiveSummary.executiveSummary.value;
      } else {
        summaryText = formatTextValue(analysisData.executiveSummary);
      }
      
      const cleanedSummary = formatTextValue(summaryText);
      // Split by newlines and create paragraphs
      const summaryParagraphs = cleanedSummary.split('\n').filter(p => p.trim());
      
      children.push(
        new Paragraph({
          text: "Executive Summary",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        }),
      );
      
      summaryParagraphs.forEach(para => {
        children.push(
          new Paragraph({
            text: para,
            spacing: { after: 120 },
          })
        );
      });
    }

    // Lease Information
    const leaseInfo = analysisData.leaseInformation || analysisData.info?.leaseInformation;
    if (leaseInfo) {
      children.push(
        new Paragraph({
          text: "Lease Information",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        }),
      );
      Object.entries(leaseInfo).forEach(([key, value]) => {
        if (value && (value.value !== undefined && value.value !== null)) {
          const formattedValue = formatTextValue(value.value);
          
          children.push(
            new Paragraph({
              children: [
                new TextRun({ text: `${formatLabel(key)}: `, bold: true }),
                new TextRun({ text: formattedValue }),
              ],
              spacing: { after: 100 },
            }),
          );
          
          if (value.citation) {
            children.push(
              new Paragraph({
                children: [
                  new TextRun({ text: `  Citation: ${formatTextValue(value.citation)}`, italics: true }),
                ],
                spacing: { after: 100 },
              }),
            );
          }
          
          if (value.amendments && Array.isArray(value.amendments) && value.amendments.length > 0) {
            value.amendments.forEach((amendment, index) => {
              children.push(
                new Paragraph({
                  children: [
                    new TextRun({ text: `  Amendment ${index + 1}: ${formatTextValue(amendment)}`, italics: true }),
                  ],
                  spacing: { after: 100 },
                }),
              );
            });
          }
        }
      });
    }

    // Space Information
    const spaceDataRaw = analysisData.space;
    const spaceData = spaceDataRaw?.space || spaceDataRaw;
    if (spaceData) {
      children.push(
        new Paragraph({
          text: "Space Information",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        }),
      );
      Object.entries(spaceData).forEach(([key, value]) => {
        if (value && (value.value !== undefined && value.value !== null)) {
          const formattedValue = formatTextValue(value.value);
          
          children.push(
            new Paragraph({
              children: [
                new TextRun({ text: `${formatLabel(key)}: `, bold: true }),
                new TextRun({ text: formattedValue }),
              ],
              spacing: { after: 100 },
            }),
          );
          
          if (value.citation) {
            children.push(
              new Paragraph({
                children: [
                  new TextRun({ text: `  Citation: ${formatTextValue(value.citation)}`, italics: true }),
                ],
                spacing: { after: 100 },
              }),
            );
          }
          
          if (value.amendments && Array.isArray(value.amendments) && value.amendments.length > 0) {
            value.amendments.forEach((amendment, index) => {
              children.push(
                new Paragraph({
                  children: [
                    new TextRun({ text: `  Amendment ${index + 1}: ${formatTextValue(amendment)}`, italics: true }),
                  ],
                  spacing: { after: 100 },
                }),
              );
            });
          }
        }
      });
    }

    // Charge Schedules
    const chargeSchedulesRaw = analysisData.chargeSchedules;
    const chargeSchedules = chargeSchedulesRaw?.chargeSchedules || chargeSchedulesRaw;
    if (chargeSchedules) {
      children.push(
        new Paragraph({
          text: "Charge Schedules",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        }),
      );
      
      // Base Rent Entries
      if (chargeSchedules.baseRent && chargeSchedules.baseRent.length > 0) {
        children.push(
          new Paragraph({
            text: "Base Rent Entries",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 200 },
          }),
        );
        
        chargeSchedules.baseRent.forEach((entry, index) => {
          children.push(
            new Paragraph({
              children: [
                new TextRun({ text: `Entry ${index + 1}`, bold: true }),
              ],
              spacing: { before: 200, after: 150 },
            }),
          );
          
          const fields = [
            'chargeCode', 'description', 'dateFrom', 'dateTo',
            'monthlyAmount', 'annualAmount', 'areaRentable', 
            'amountPerArea', 'managementFees'
          ];
          
          fields.forEach(field => {
            if (entry[field] && (entry[field].value !== undefined && entry[field].value !== null)) {
              const formattedValue = formatTextValue(entry[field].value);
              children.push(
                new Paragraph({
                  children: [
                    new TextRun({ text: `${formatLabel(field)}: `, bold: true }),
                    new TextRun({ text: formattedValue }),
                  ],
                  spacing: { after: 100 },
                }),
              );
              
              if (entry[field].citation) {
                children.push(
                  new Paragraph({
                    children: [
                      new TextRun({ text: `  Citation: ${formatTextValue(entry[field].citation)}`, italics: true }),
                    ],
                    spacing: { after: 100 },
                  }),
                );
              }
            }
          });
          
          if (entry.amendments && Array.isArray(entry.amendments) && entry.amendments.length > 0) {
            children.push(
              new Paragraph({
                children: [
                  new TextRun({ text: "Amendments:", bold: true }),
                ],
                spacing: { before: 100, after: 100 },
              }),
            );
            entry.amendments.forEach((amendment, amendIndex) => {
              children.push(
                new Paragraph({
                  children: [
                    new TextRun({ text: `  Amendment ${amendIndex + 1}: ${formatTextValue(amendment)}`, italics: true }),
                  ],
                  spacing: { after: 100 },
                }),
              );
            });
          }
        });
      }
      
      // Late Fee Information
      if (chargeSchedules.lateFee) {
        children.push(
          new Paragraph({
            text: "Late Fee Information",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 200 },
          }),
        );
        
        const lateFeeFields = [
          'calculationType', 'graceDays', 'percent', 'secondFeeCalculationType',
          'secondFeeGrace', 'secondFeePercent', 'perDayFee'
        ];
        
        lateFeeFields.forEach(field => {
          if (chargeSchedules.lateFee[field] && (chargeSchedules.lateFee[field].value !== undefined && chargeSchedules.lateFee[field].value !== null)) {
            const formattedValue = formatTextValue(chargeSchedules.lateFee[field].value);
            children.push(
              new Paragraph({
                children: [
                  new TextRun({ text: `${formatLabel(field)}: `, bold: true }),
                  new TextRun({ text: formattedValue }),
                ],
                spacing: { after: 100 },
              }),
            );
            
            if (chargeSchedules.lateFee[field].citation) {
              children.push(
                new Paragraph({
                  children: [
                    new TextRun({ text: `  Citation: ${formatTextValue(chargeSchedules.lateFee[field].citation)}`, italics: true }),
                  ],
                  spacing: { after: 100 },
                }),
              );
            }
          }
        });
      }
    }

    // Miscellaneous Information (Other Lease Provisions)
    const miscData = analysisData.otherLeaseProvisions || analysisData.misc;
    if (miscData) {
      children.push(
        new Paragraph({
          text: "Miscellaneous Information",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        }),
      );
      
      Object.entries(miscData).forEach(([sectionKey, sectionData]) => {
        if (sectionData && typeof sectionData === 'object') {
          children.push(
            new Paragraph({
              children: [
                new TextRun({ text: formatLabel(sectionKey), bold: true }),
              ],
              spacing: { before: 200, after: 150 },
            }),
          );
          
          Object.entries(sectionData).forEach(([key, value]) => {
            if (value && (value.value !== undefined && value.value !== null)) {
              const formattedValue = formatTextValue(value.value);
              children.push(
                new Paragraph({
                  children: [
                    new TextRun({ text: `  ${formatLabel(key)}: `, bold: true }),
                    new TextRun({ text: formattedValue }),
                  ],
                  spacing: { after: 100 },
                }),
              );
              
              if (value.citation) {
                children.push(
                  new Paragraph({
                    children: [
                      new TextRun({ text: `    Citation: ${formatTextValue(value.citation)}`, italics: true }),
                    ],
                    spacing: { after: 100 },
                  }),
                );
              }
              
              if (value.amendments && Array.isArray(value.amendments) && value.amendments.length > 0) {
                value.amendments.forEach((amendment, index) => {
                  children.push(
                    new Paragraph({
                      children: [
                        new TextRun({ text: `    Amendment ${index + 1}: ${formatTextValue(amendment)}`, italics: true }),
                      ],
                      spacing: { after: 100 },
                    }),
                  );
                });
              }
            }
          });
        }
      });
    }

    // End of report
    children.push(
      new Paragraph({
        text: "End of Report",
        alignment: AlignmentType.CENTER,
        spacing: { before: 400, after: 200 },
      }),
    );

    const doc = new Document({
      sections: [{
        children: children,
      }],
    });

    return doc;
  } catch (error) {
    console.error('Error formatting data for DOCX:', error);
    throw new Error(`Failed to format data: ${error.message}`);
  }
};

export const downloadDocxFile = async (doc, filename) => {
  try {
    const blob = await Packer.toBlob(doc);
    const fileName = `${filename}-analysis-${new Date().toISOString().split('T')[0]}.docx`;
    saveAs(blob, fileName);
  } catch (error) {
    console.error('Error downloading DOCX file:', error);
    throw new Error(`Failed to download document: ${error.message}`);
  }
};
