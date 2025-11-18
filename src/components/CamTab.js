import { useState } from 'react';
import './CamTab.css';

const CamTab = ({ data, loading }) => {
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [expandedRules, setExpandedRules] = useState(new Set());
  console.log('clicked here')
  if (loading) {
    return (
      <div className="tab-content-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>CAM Data is still being processed...</p>
          <p className="loading-hint">This may take a few moments. The analysis results are already available in other tabs.</p>
        </div>
      </div>
    );
  }

  if (!data && !loading) {
    return (
      <div className="tab-content-container">
        <div className="no-data">
          <p>No CAM provisions available. Please upload a document to view CAM data.</p>
          <p className="no-data-hint">Note: CAM data is only available for newly uploaded documents.</p>
        </div>
      </div>
    );
  }

  const toggleCategory = (category) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleRule = (ruleId) => {
    const newExpanded = new Set(expandedRules);
    if (newExpanded.has(ruleId)) {
      newExpanded.delete(ruleId);
    } else {
      newExpanded.add(ruleId);
    }
    setExpandedRules(newExpanded);
  };

  const getFavorabilityColor = (favorability) => {
    switch (favorability?.toLowerCase()) {
      case 'favorable':
        return '#27ae60';
      case 'unfavorable':
        return '#e74c3c';
      case 'neutral':
        return '#95a5a6';
      default:
        return '#95a5a6';
    }
  };

  const getFavorabilityBadge = (favorability) => {
    const color = getFavorabilityColor(favorability);
    return (
      <span className="favorability-badge" style={{ backgroundColor: color }}>
        {favorability || 'Neutral'}
      </span>
    );
  };

  const getImpactColor = (impact) => {
    switch (impact?.toLowerCase()) {
      case 'high':
        return '#e74c3c';
      case 'medium':
        return '#f39c12';
      case 'low':
        return '#27ae60';
      default:
        return '#95a5a6';
    }
  };

  const getCategoryDisplayName = (category) => {
    const categoryMap = {
      'proportionateShare': 'Proportionate Share',
      'camExpenseCategories': 'CAM Expense Categories',
      'exclusions': 'Exclusions',
      'paymentTerms': 'Payment Terms',
      'capsLimitations': 'Caps & Limitations',
      'reconciliationProcedures': 'Reconciliation Procedures',
      'baseYearProvisions': 'Base Year Provisions',
      'grossUpProvisions': 'Gross-Up Provisions',
      'administrativeFees': 'Administrative Fees',
      'auditRights': 'Audit Rights',
      'noticeRequirements': 'Notice Requirements',
      'controllableVsNonControllable': 'Controllable vs Non-Controllable',
      'definitions': 'Definitions',
      'calculationMethods': 'Calculation Methods'
    };
    return categoryMap[category] || category;
  };

  const getCategoryStatus = (rules) => {
    if (!rules || rules.length === 0) return 'neutral';
    const favorabilities = rules.map(r => r.favorability?.toLowerCase()).filter(Boolean);
    if (favorabilities.some(f => f === 'favorable')) {
      if (favorabilities.some(f => f === 'unfavorable')) {
        return 'neutral';
      }
      return 'favorable';
    }
    if (favorabilities.some(f => f === 'unfavorable')) {
      return 'unfavorable';
    }
    return 'neutral';
  };

  // Handle nested response structure (backward compatibility)
  const camData = data?.cam || data;
  console.log('camData:', camData);
  // Group rules by category
  const rulesByCategory = {};
  if (camData.allExtractedRules) {
    camData.allExtractedRules.forEach(rule => {
      const category = rule.ruleCategory;
      if (!rulesByCategory[category]) {
        rulesByCategory[category] = [];
      }
      rulesByCategory[category].push(rule);
    });
  }

  const summary = camData.cumulativeCamRulesSummary || {};
  const riskAssessment = summary.riskAssessment || {};
  const rulesByCategoryCount = summary.rulesByCategory || {};

  // Calculate overall risk
  const overallRisk = riskAssessment.overallTenantRisk || 'Unknown';
  const totalRules = summary.totalRulesExtracted || 0;
  const protections = riskAssessment.keyTenantProtections?.length || 0;
  const exposures = riskAssessment.keyTenantExposures?.length || 0;

  // Get base year and controllable cap
  const baseYearRule = camData.allExtractedRules?.find(r => r.ruleCategory === 'baseYearProvisions');
  const baseYear = baseYearRule?.exactLanguage?.match(/20\d{2}/)?.[0] || 'N/A';
  const controllableCapRule = camData.allExtractedRules?.find(r => r.ruleCategory === 'capsLimitations');
  const controllableCap = controllableCapRule?.exactLanguage?.match(/(\d+)%/)?.[1] || 'N/A';

  return (
    <div className="tab-content-container cam-tab">
      {/* CAM Provisions Overview */}
      <div className="cam-overview">
        <h2 className="cam-title">Overview</h2>
        
        <div className="cam-summary-cards">
          <div className="summary-card risk-card">
            <div className="summary-label">Overall Risk</div>
            <div className="summary-value" style={{ color: overallRisk === 'High' ? '#e74c3c' : overallRisk === 'Medium' ? '#f39c12' : '#27ae60' }}>
              {overallRisk}
            </div>
          </div>
          <div className="summary-card rules-card">
            <div className="summary-label">Total Rules</div>
            <div className="summary-value">{totalRules}</div>
          </div>
          <div className="summary-card protections-card">
            <div className="summary-label">Protections</div>
            <div className="summary-value">{protections}</div>
          </div>
          <div className="summary-card exposures-card">
            <div className="summary-label">Exposures</div>
            <div className="summary-value">{exposures}</div>
          </div>
        </div>

        <div className="cam-metadata">
          <div className="metadata-item">
            <strong>Base Year:</strong> {baseYear}
          </div>
          <div className="metadata-item">
            <strong>Controllable Cap:</strong> {controllableCap !== 'N/A' ? `${controllableCap}% annually` : 'N/A'}
          </div>
        </div>
      </div>

      {/* CAM Rules by Category */}
      <div className="cam-rules-section">
        <div className="cam-section-header">
          <h2 className="cam-section-title">Rules</h2>
          <p className="cam-instruction">Click on any category to view detailed rules and provisions</p>
        </div>

        <div className="cam-categories">
          {Object.keys(rulesByCategoryCount).map(category => {
            const rules = rulesByCategory[category] || [];
            const ruleCount = rulesByCategoryCount[category] || 0;
            const isExpanded = expandedCategories.has(category);
            const status = getCategoryStatus(rules);

            if (ruleCount === 0) return null;

            return (
              <div key={category} className="cam-category">
                <button
                  className="cam-category-header"
                  onClick={() => toggleCategory(category)}
                >
                  <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>
                    ▶
                  </span>
                  <span className="category-name">{getCategoryDisplayName(category)}</span>
                  <span className="category-count">({ruleCount} {ruleCount === 1 ? 'rule' : 'rules'})</span>
                  {getFavorabilityBadge(status)}
                </button>

                {isExpanded && (
                  <div className="cam-category-rules">
                    {rules.map(rule => {
                      const isRuleExpanded = expandedRules.has(rule.ruleId);
                      return (
                        <div key={rule.ruleId} className="cam-rule-item">
                          <div className="cam-rule-header">
                            <span className="rule-id-badge">{rule.ruleId}</span>
                            {rule.ruleStatus === 'Updated' && (
                              <span className="updated-badge">Updated</span>
                            )}
                            <button
                              className="rule-expand-btn"
                              onClick={() => toggleRule(rule.ruleId)}
                            >
                              <span className={`expand-icon small ${isRuleExpanded ? 'expanded' : ''}`}>
                                ▶
                              </span>
                            </button>
                          </div>
                          <div className="rule-summary">{rule.ruleSummary}</div>
                          
                          {rule.locations && rule.locations.length > 0 && (
                            <div className="rule-meta">
                              <span className="meta-item">
                                📄 Page {rule.locations.map(l => l.pageNumber).filter((v, i, a) => a.indexOf(v) === i).join(', ')}
                              </span>
                              <span className="meta-item">
                                ℹ️ {rule.impactSeverity || 'Medium'} Impact
                              </span>
                              <span className="meta-item">
                                {getFavorabilityBadge(rule.favorability)}
                              </span>
                            </div>
                          )}

                          {isRuleExpanded && (
                            <div className="rule-details">
                              <div className="detail-section">
                                <h4>Exact Language</h4>
                                <p className="exact-language">{rule.exactLanguage}</p>
                              </div>
                              <div className="detail-section">
                                <h4>Tenant Impact</h4>
                                <p>{rule.tenantImpact}</p>
                              </div>
                              {rule.updateHistory && rule.updateHistory.length > 0 && (
                                <div className="detail-section">
                                  <h4>Update History</h4>
                                  {rule.updateHistory.map((update, idx) => (
                                    <div key={idx} className="update-item">
                                      <strong>Page {update.updatePage}:</strong> {update.updateSummary}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Key Protections and Exposures */}
      <div className="cam-summary-boxes">
        <div className="summary-box protections-box">
          <div className="box-header">
            <div className="box-icon">✓</div>
            <h3>Key Tenant Protections</h3>
          </div>
          <ul className="box-list">
            {riskAssessment.keyTenantProtections?.map((protection, idx) => (
              <li key={idx}>{protection}</li>
            ))}
          </ul>
        </div>

        <div className="summary-box exposures-box">
          <div className="box-header">
            <div className="box-icon">!</div>
            <h3>Key Tenant Exposures</h3>
          </div>
          <ul className="box-list">
            {riskAssessment.keyTenantExposures?.map((exposure, idx) => (
              <li key={idx}>{exposure}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CamTab;

