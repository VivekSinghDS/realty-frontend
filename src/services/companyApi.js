// const API_BASE_URL = "http://localhost:8000";
const API_BASE_URL = 'https://realty-lease-poc-6uti.onrender.com';

// Company management API functions
export const companyApi = {
  // Get all companies
  getCompanies: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/company`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch companies: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching companies:', error);
      throw error;
    }
  },

  // Create a new company
  createCompany: async (companyData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/company`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(companyData),
      });

      if (!response.ok) {
        throw new Error(`Failed to create company: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error creating company:', error);
      throw error;
    }
  },

  // Get company by ID
  getCompany: async (company_id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/company/${company_id}`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch company: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching company:', error);
      throw error;
    }
  },

  // Update company
  updateCompany: async (companyId, companyData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/company/${companyId}`, {
        method: 'PUT',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(companyData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update company: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error updating company:', error);
      throw error;
    }
  },

  // Delete company
  deleteCompany: async (companyId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/companies/${companyId}`, {
        method: 'DELETE',
        headers: {
          'accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete company: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error deleting company:', error);
      throw error;
    }
  }
};
