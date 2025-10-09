import './TabNavigation.css';

const TabNavigation = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'info', label: 'Lease Information & Executive Summary', icon: '📋' },
    { id: 'space', label: 'Space Details', icon: '🏢' },
    { id: 'charge-schedules', label: 'Charge Schedules', icon: '💰' },
    { id: 'misc', label: 'Miscellaneous Provisions', icon: '📄' }
  ];

  return (
    <div className="tab-navigation">
      <div className="tab-list">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabNavigation;
