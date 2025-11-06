import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { companyApi } from '../services/companyApi';

// Company context for managing company state
const CompanyContext = createContext();

// Company reducer for state management
const companyReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_COMPANIES':
      return { ...state, companies: action.payload, loading: false, error: null };
    case 'SET_SELECTED_COMPANY':
      return { ...state, selectedCompany: action.payload };
    case 'ADD_COMPANY':
      return { 
        ...state, 
        companies: [...state.companies, action.payload],
        loading: false,
        error: null 
      };
    case 'UPDATE_COMPANY':
      return {
        ...state,
        companies: state.companies.map(company => 
          company.id === action.payload.id ? action.payload : company
        ),
        selectedCompany: action.payload.id === state.selectedCompany?.id ? action.payload : state.selectedCompany
      };
    case 'DELETE_COMPANY':
      return {
        ...state,
        companies: state.companies.filter(company => company.id !== action.payload),
        selectedCompany: state.selectedCompany?.id === action.payload ? null : state.selectedCompany
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

// Initial state
const initialState = {
  companies: [],
  selectedCompany: null,
  loading: false,
  error: null
};

// Company provider component
export const CompanyProvider = ({ children }) => {
  const [state, dispatch] = useReducer(companyReducer, initialState);

  // Load companies on mount
  useEffect(() => {
    loadCompanies();
  }, []);

  // Load all companies
  const loadCompanies = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const companies = await companyApi.getCompanies();
      dispatch({ type: 'SET_COMPANIES', payload: companies.companies });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  // Create new company
  const createCompany = async (companyData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const newCompany = await companyApi.createCompany(companyData);
      dispatch({ type: 'ADD_COMPANY', payload: newCompany });
      return newCompany;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  // Select company
  const selectCompany = (company) => {
    dispatch({ type: 'SET_SELECTED_COMPANY', payload: company });
  };

  // Clear selected company
  const clearSelectedCompany = () => {
    dispatch({ type: 'SET_SELECTED_COMPANY', payload: null });
  };

  // Update company
  const updateCompany = async (companyId, companyData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const updatedCompany = await companyApi.updateCompany(companyId, companyData);
      dispatch({ type: 'UPDATE_COMPANY', payload: updatedCompany });
      return updatedCompany;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  // Delete company
  const deleteCompany = async (companyId) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await companyApi.deleteCompany(companyId);
      dispatch({ type: 'DELETE_COMPANY', payload: companyId });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    ...state,
    loadCompanies,
    createCompany,
    selectCompany,
    clearSelectedCompany,
    updateCompany,
    deleteCompany,
    clearError
  };

  return (
    <CompanyContext.Provider value={value}>
      {children}
    </CompanyContext.Provider>
  );
};

// Custom hook to use company context
export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
};
