import './TabNavigation.css';

const TabNavigation = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'info', label: 'Info', icon: '' },
    { id: 'space', label: 'Space', icon: '' },
    { id: 'charge-schedules', label: 'Rent Schedules', icon: '' },
    { id: 'misc', label: 'Provisions', icon: '' },
    { id: 'audit', label: 'Audit', icon: '' },
    { id: 'cam', label: 'CAM', icon: '' }
  ];

  const handleTabClick = (tabId) => {
    console.log('Tab clicked:', tabId);
    console.log('Current activeTab:', activeTab);
    console.log('onTabChange function:', onTabChange);
    onTabChange(tabId);
  };

  return (
    <div className="tab-navigation">
      <div className="tab-list">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => handleTabClick(tab.id)}
            style={{ 
              pointerEvents: 'auto',
              zIndex: 1,
              position: 'relative'
            }}
          >
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabNavigation;
