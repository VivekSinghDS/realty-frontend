// Utility functions for downloading analysis results
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, TableCellBorders, BorderStyle, ShadingType, ShadingPattern } from 'docx';
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

// Helper function to create a card-style cell with blue left border
const createCardCell = (content, widthPercentage = 33.33) => {
  return new TableCell({
    children: content,
    width: { size: widthPercentage, type: WidthType.PERCENTAGE },
    borders: new TableCellBorders({
      top: { style: BorderStyle.SINGLE, size: 4, color: "E9ECEF" },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: "E9ECEF" },
      left: { style: BorderStyle.SINGLE, size: 12, color: "4472C4" }, // Blue left border
      right: { style: BorderStyle.SINGLE, size: 4, color: "E9ECEF" },
    }),
    shading: {
      type: ShadingType.SOLID,
      color: "FFFFFF",
    },
    margins: {
      top: 200,
      bottom: 200,
      left: 200,
      right: 200,
    },
  });
};

// Helper function to create card content paragraphs
const createCardContent = (label, value, citation = null, amendments = []) => {
  const paragraphs = [];
  
  // Label (bold, uppercase)
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({ text: `${label.toUpperCase()}:`, bold: true }),
      ],
      spacing: { after: 120 },
    })
  );
  
  // Value
  paragraphs.push(
    new Paragraph({
      text: formatTextValue(value),
      spacing: { after: 100 },
    })
  );
  
  // Citation
  if (citation) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({ text: `Citation: ${formatTextValue(citation)}`, italics: true, size: 20 }),
        ],
        spacing: { after: 80 },
      })
    );
  }
  
  // Amendments
  if (amendments && Array.isArray(amendments) && amendments.length > 0) {
    amendments.forEach((amendment, index) => {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: `Amendment ${index + 1}: ${formatTextValue(amendment)}`, italics: true, size: 20 }),
          ],
          spacing: { after: 80 },
        })
      );
    });
  }
  
  return paragraphs;
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

    // Lease Information - Card Grid Layout
    const leaseInfo = analysisData.leaseInformation || analysisData.info?.leaseInformation;
    if (leaseInfo) {
      children.push(
        new Paragraph({
          text: "Lease Information",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
          alignment: AlignmentType.CENTER,
        }),
      );
      
      // Filter valid entries and create card cells
      const validEntries = Object.entries(leaseInfo).filter(([key, value]) => 
        value && (value.value !== undefined && value.value !== null)
      );
      
      // Create rows with 3 cards per row
      for (let i = 0; i < validEntries.length; i += 3) {
        const rowEntries = validEntries.slice(i, i + 3);
        const cells = rowEntries.map(([key, value]) => {
          const cardContent = createCardContent(
            formatLabel(key),
            value.value,
            value.citation,
            value.amendments
          );
          return createCardCell(cardContent, 33.33);
        });
        
        // Fill remaining cells if less than 3
        while (cells.length < 3) {
          cells.push(createCardCell([new Paragraph({ text: "" })], 33.33));
        }
        
        children.push(
          new Table({
            rows: [new TableRow({ children: cells })],
            width: { size: 100, type: WidthType.PERCENTAGE },
          }),
          new Paragraph({ text: "", spacing: { after: 150 } }),
        );
      }
    }

    // Space Information - Card Grid Layout
    const spaceDataRaw = analysisData.space;
    const spaceData = spaceDataRaw?.space || spaceDataRaw;
    if (spaceData) {
      children.push(
        new Paragraph({
          text: "Space Information",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
          alignment: AlignmentType.CENTER,
        }),
      );
      
      // Filter valid entries and create card cells
      const validEntries = Object.entries(spaceData).filter(([key, value]) => 
        value && (value.value !== undefined && value.value !== null)
      );
      
      // Create rows with 3 cards per row
      for (let i = 0; i < validEntries.length; i += 3) {
        const rowEntries = validEntries.slice(i, i + 3);
        const cells = rowEntries.map(([key, value]) => {
          const cardContent = createCardContent(
            formatLabel(key),
            value.value,
            value.citation,
            value.amendments
          );
          return createCardCell(cardContent, 33.33);
        });
        
        // Fill remaining cells if less than 3
        while (cells.length < 3) {
          cells.push(createCardCell([new Paragraph({ text: "" })], 33.33));
        }
        
        children.push(
          new Table({
            rows: [new TableRow({ children: cells })],
            width: { size: 100, type: WidthType.PERCENTAGE },
          }),
          new Paragraph({ text: "", spacing: { after: 150 } }),
        );
      }
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
      
      // Base Rent Entries - Table Format
      if (chargeSchedules.baseRent && chargeSchedules.baseRent.length > 0) {
        children.push(
          new Paragraph({
            text: "Base Rent Entries",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 200 },
          }),
        );
        
        // Create table headers
        const tableRows = [
          new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph({ text: "Entry", bold: true })],
                width: { size: 5, type: WidthType.PERCENTAGE },
              }),
              new TableCell({
                children: [new Paragraph({ text: "Description", bold: true })],
                width: { size: 15, type: WidthType.PERCENTAGE },
              }),
              new TableCell({
                children: [new Paragraph({ text: "Date From", bold: true })],
                width: { size: 10, type: WidthType.PERCENTAGE },
              }),
              new TableCell({
                children: [new Paragraph({ text: "Date To", bold: true })],
                width: { size: 10, type: WidthType.PERCENTAGE },
              }),
              new TableCell({
                children: [new Paragraph({ text: "Monthly Amount", bold: true })],
                width: { size: 12, type: WidthType.PERCENTAGE },
              }),
              new TableCell({
                children: [new Paragraph({ text: "Annual Amount", bold: true })],
                width: { size: 12, type: WidthType.PERCENTAGE },
              }),
              new TableCell({
                children: [new Paragraph({ text: "Area Rentable", bold: true })],
                width: { size: 10, type: WidthType.PERCENTAGE },
              }),
              new TableCell({
                children: [new Paragraph({ text: "Amount Per Area", bold: true })],
                width: { size: 12, type: WidthType.PERCENTAGE },
              }),
              new TableCell({
                children: [new Paragraph({ text: "Management Fees", bold: true })],
                width: { size: 14, type: WidthType.PERCENTAGE },
              }),
            ],
          }),
        ];
        
        // Add data rows
        chargeSchedules.baseRent.forEach((entry, index) => {
          const getFieldValue = (field) => {
            if (entry[field] && entry[field].value !== undefined && entry[field].value !== null) {
              return formatTextValue(entry[field].value);
            }
            return 'N/A';
          };
          
          tableRows.push(
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({ text: `${index + 1}` })],
                }),
                new TableCell({
                  children: [new Paragraph({ text: getFieldValue('description') })],
                }),
                new TableCell({
                  children: [new Paragraph({ text: getFieldValue('dateFrom') })],
                }),
                new TableCell({
                  children: [new Paragraph({ text: getFieldValue('dateTo') })],
                }),
                new TableCell({
                  children: [new Paragraph({ text: getFieldValue('monthlyAmount') })],
                }),
                new TableCell({
                  children: [new Paragraph({ text: getFieldValue('annualAmount') })],
                }),
                new TableCell({
                  children: [new Paragraph({ text: getFieldValue('areaRentable') })],
                }),
                new TableCell({
                  children: [new Paragraph({ text: getFieldValue('amountPerArea') })],
                }),
                new TableCell({
                  children: [new Paragraph({ text: getFieldValue('managementFees') })],
                }),
              ],
            }),
          );
        });
        
        children.push(
          new Table({
            rows: tableRows,
            width: { size: 100, type: WidthType.PERCENTAGE },
          }),
          new Paragraph({ text: "", spacing: { after: 200 } }),
        );
      }
      
      // Late Fee Information - Card Grid Layout
      if (chargeSchedules.lateFee) {
        children.push(
          new Paragraph({
            text: "Late Fee Information",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 200 },
            alignment: AlignmentType.CENTER,
          }),
        );
        
        const lateFeeFields = [
          'calculationType', 'graceDays', 'percent', 'secondFeeCalculationType',
          'secondFeeGrace', 'secondFeePercent', 'perDayFee'
        ];
        
        // Filter valid entries
        const validLateFeeEntries = lateFeeFields
          .map(field => ({
            key: field,
            value: chargeSchedules.lateFee[field]
          }))
          .filter(({ value }) => value && (value.value !== undefined && value.value !== null));
        
        // Create rows with 3 cards per row
        for (let i = 0; i < validLateFeeEntries.length; i += 3) {
          const rowEntries = validLateFeeEntries.slice(i, i + 3);
          const cells = rowEntries.map(({ key, value }) => {
            const cardContent = createCardContent(
              formatLabel(key),
              value.value,
              value.citation
            );
            return createCardCell(cardContent, 33.33);
          });
          
          // Fill remaining cells if less than 3
          while (cells.length < 3) {
            cells.push(createCardCell([new Paragraph({ text: "" })], 33.33));
          }
          
          children.push(
            new Table({
              rows: [new TableRow({ children: cells })],
              width: { size: 100, type: WidthType.PERCENTAGE },
            }),
            new Paragraph({ text: "", spacing: { after: 150 } }),
          );
        }
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
          // Use HEADING_3 for subheadings
          children.push(
            new Paragraph({
              text: formatLabel(sectionKey),
              heading: HeadingLevel.HEADING_3,
              spacing: { before: 200, after: 150 },
            }),
          );
          
          Object.entries(sectionData).forEach(([key, value]) => {
            if (value && (value.value !== undefined && value.value !== null)) {
              const formattedValue = formatTextValue(value.value);
              // Bullet point for key-value pairs
              children.push(
                new Paragraph({
                  children: [
                    new TextRun({ text: "• ", bold: true }),
                    new TextRun({ text: `${formatLabel(key)}: `, bold: true }),
                    new TextRun({ text: formattedValue }),
                  ],
                  spacing: { after: 80 },
                }),
              );
              
              if (value.citation) {
                children.push(
                  new Paragraph({
                    children: [
                      new TextRun({ text: `    Citation: ${formatTextValue(value.citation)}`, italics: true, size: 20 }),
                    ],
                    spacing: { after: 60 },
                    indent: { left: 400 },
                  }),
                );
              }
              
              if (value.amendments && Array.isArray(value.amendments) && value.amendments.length > 0) {
                value.amendments.forEach((amendment, index) => {
                  children.push(
                    new Paragraph({
                      children: [
                        new TextRun({ text: `    Amendment ${index + 1}: ${formatTextValue(amendment)}`, italics: true, size: 20 }),
                      ],
                      spacing: { after: 60 },
                      indent: { left: 400 },
                    }),
                  );
                });
              }
            }
          });
        }
      });
    }

    // Audit Section
    const auditData = analysisData.audit_items || analysisData.audit_checklist || analysisData.audit;
    if (auditData && Array.isArray(auditData) && auditData.length > 0) {
      children.push(
        new Paragraph({
          text: "Lease Audit Checklist",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        }),
        new Paragraph({
          text: `Found ${auditData.length} potential issues requiring attention`,
          spacing: { after: 200 },
        }),
      );
      
      auditData.forEach((item, index) => {
        // Category as subheading
        children.push(
          new Paragraph({
            text: item.category || `Issue ${index + 1}`,
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 200, after: 100 },
          }),
        );
        
        // Issue Description
        if (item.issue_description) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({ text: "Issue Description: ", bold: true }),
              ],
              spacing: { after: 60 },
            }),
            new Paragraph({
              text: formatTextValue(item.issue_description),
              spacing: { after: 100 },
              indent: { left: 200 },
            }),
          );
        }
        
        // Affected Clause
        if (item.affected_clause) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({ text: "Affected Clause: ", bold: true }),
              ],
              spacing: { after: 60 },
            }),
            new Paragraph({
              text: formatTextValue(item.affected_clause),
              spacing: { after: 100 },
              indent: { left: 200 },
            }),
          );
        }
        
        // Page References
        if (item.page_references && Array.isArray(item.page_references) && item.page_references.length > 0) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({ text: "Page References: ", bold: true }),
              ],
              spacing: { after: 60 },
            }),
            new Paragraph({
              text: item.page_references.map(page => `Page ${page}`).join(', '),
              spacing: { after: 100 },
              indent: { left: 200 },
            }),
          );
        }
        
        // Recommended Action
        if (item.recommended_action) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({ text: "Recommended Action: ", bold: true }),
              ],
              spacing: { after: 60 },
            }),
            new Paragraph({
              text: formatTextValue(item.recommended_action),
              spacing: { after: 150 },
              indent: { left: 200 },
            }),
          );
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
