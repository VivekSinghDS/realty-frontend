import React, { useState } from 'react';
import { useCompany } from '../../context/CompanyContext';
import './CompanySelector.css';

const CompanySelector = ({ onCompanySelect }) => {
  const { companies, selectedCompany, loading, error, createCompany, selectCompany, clearSelectedCompany } = useCompany();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCompanyChange = (e) => {
    const companyUid = e.target.value;
    if (companyUid) {
      const company = companies.find(c => c.uid === companyUid);
      if (company) {
        selectCompany(company);
        onCompanySelect(company);
      }
    }
  };

  const handleCreateCompany = async (e) => {
    e.preventDefault();
    if (!newCompanyName.trim()) return;

    try {
      setIsCreating(true);
      const newCompany = await createCompany({ name: newCompanyName.trim() });
      selectCompany(newCompany);
      onCompanySelect(newCompany);
      setNewCompanyName('');
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating company:', error);
    } finally {
      setIsCreating(false);
    }
  };

  if (loading && companies.length === 0) {
    return (
      <div className="company-selector">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading companies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="company-selector">
      <div className="company-selector-header">
        <h2>Select Company</h2>
        <p>Choose a company to manage its lease documents</p>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      <div className="company-selection">
        <div className="company-dropdown-container">
          <label htmlFor="company-select">Company:</label>
          <select
            id="company-select"
            value={selectedCompany?.uid || ''}
            onChange={handleCompanyChange}
            disabled={loading}
            className="company-dropdown"
          >
            <option value="">Select a company...</option>
            {console.log(companies)}
            {companies.map(company => (
              <option key={company.uid} value={company.uid}>
                {company.name}
              </option>
            ))}
          </select>
        </div>

        <div className="company-actions">
          <button
            type="button"
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="create-company-btn"
            disabled={loading}
          >
            {showCreateForm ? 'Cancel' : (
              <>
                {/* <span class="plus-icon">+</span> */}
                <span>Create New Company</span>
              </>
            )}
          </button>
        </div>
      </div>

      {showCreateForm && (
        <div className="create-company-form">
          <form onSubmit={handleCreateCompany}>
            <div className="form-group">
              <label htmlFor="company-name">Company Name:</label>
              <input
                id="company-name"
                type="text"
                value={newCompanyName}
                onChange={(e) => setNewCompanyName(e.target.value)}
                placeholder="Enter company name..."
                required
                disabled={isCreating}
                className="company-name-input"
              />
            </div>
            <div className="form-actions">
              <button
                type="submit"
                disabled={!newCompanyName.trim() || isCreating}
                className="submit-btn"
              >
                {isCreating ? 'Creating...' : 'Create Company'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setNewCompanyName('');
                }}
                className="cancel-btn"
                disabled={isCreating}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {selectedCompany && (
        <div className="selected-company-info">
          <div className="company-info-card">
            <div className="company-info-header">
              <h3>{selectedCompany.name}</h3>
              <button
                type="button"
                onClick={() => {
                  clearSelectedCompany();
                  if (onCompanySelect) {
                    onCompanySelect(null);
                  }
                }}
                className="back-button"
                title="Back to company selection"
              >
                ← Back
              </button>
            </div>
            <p>Company ID: {selectedCompany.id}</p>
            <p>Company UID: {selectedCompany.uid}</p>
            {selectedCompany.createdAt && (
              <p>Created: {new Date(selectedCompany.createdAt).toLocaleDateString()}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanySelector;
