const API_BASE_URL = 'https://realty-lease-poc-6uti.onrender.com';

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
    // Make all API calls in parallel
    const [infoResponse, spaceResponse, chargeSchedulesResponse, miscResponse] = await Promise.all([
      uploadFile(file, '/debug/info'),
      uploadFile(file, '/debug/space'),
      uploadFile(file, '/debug/charge-schedules'),
      uploadFile(file, '/debug/misc')
    ]);

    return {
      info: infoResponse,
      space: spaceResponse,
      chargeSchedules: chargeSchedulesResponse,
      misc: miscResponse
    };
  } catch (error) {
    console.error('Error analyzing document:', error);
    throw new Error(`Failed to analyze document: ${error.message}`);
  }
};

export const getExecutiveSummary = async (file) => {
  return uploadFile(file, '/debug/executive-summary');
};
