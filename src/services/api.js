const API_BASE_URL = 'https://realty-lease-poc-6uti.onrender.com';
// const API_BASE_URL = "http://localhost:8000";
const uploadFile = async (file, endpoint) => {
  const formData = new FormData();
  formData.append('assets', file);

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

export const analyzeDocument = async (file) => {
  try {
    // Check if filename contains "amendment" (case-insensitive)
    const isAmendment = file.name.toLowerCase().includes('amendment');
    
    if (isAmendment) {
      // Use amendment analysis for amendment files
      return await analyzeAmendment(file);
    } else {
      // Use regular analysis for non-amendment files
      // Make all API calls in parallel
      const [infoResponse, spaceResponse, chargeSchedulesResponse, miscResponse, executiveSummaryResponse, auditResponse] = await Promise.all([
        uploadFile(file, '/debug/info'),
        uploadFile(file, '/debug/space'),
        uploadFile(file, '/debug/charge-schedules'),
        uploadFile(file, '/debug/misc'),
        uploadFile(file, '/debug/executive-summary'),
        uploadFile(file, '/debug/audit')
      ]);

      // Combine all results into the lease abstract format
      const leaseAbstractData = {
        space: spaceResponse,
        executiveSummary: executiveSummaryResponse,
        otherLeaseProvisions: miscResponse,
        chargeSchedules: chargeSchedulesResponse,
        leaseInformation: infoResponse
      };

      // Save the combined lease abstract
      const saveResponse = await saveLeaseAbstract(leaseAbstractData, file.name);

      return {
        info: infoResponse,
        space: spaceResponse,
        chargeSchedules: chargeSchedulesResponse,
        misc: miscResponse,
        executiveSummary: executiveSummaryResponse,
        audit: auditResponse,
        saveResponse: saveResponse
      };
    }
  } catch (error) {
    console.error('Error analyzing document:', error);
    throw new Error(`Failed to analyze document: ${error.message}`);
  }
};

export const getExecutiveSummary = async (file) => {
  return uploadFile(file, '/debug/executive-summary');
};

const analyzeAmendment = async (file) => {
  try {
    // Call the amendments endpoint
    const amendmentResponse = await uploadFile(file, '/debug/amendments');
    
    // Save the amendment data
    const saveResponse = await saveLeaseAbstract(amendmentResponse, file.name);
    
    return {
      info: amendmentResponse.leaseInformation,
      space: amendmentResponse.space,
      chargeSchedules: amendmentResponse.chargeSchedules,
      misc: amendmentResponse.otherLeaseProvisions,
      executiveSummary: amendmentResponse.executiveSummary,
      audit: null, // Amendments don't have audit data
      saveResponse: saveResponse
    };
  } catch (error) {
    console.error('Error analyzing amendment:', error);
    throw new Error(`Failed to analyze amendment: ${error.message}`);
  }
};

const saveLeaseAbstract = async (leaseAbstractData, filename) => {
  const payload = {
    lease_abstract: leaseAbstractData,
    filename: filename
  };

  const response = await fetch(`${API_BASE_URL}/debug/save`, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Save request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
};
