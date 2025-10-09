import { useState } from "react";
import "./App.css";
import FileUpload from "./components/FileUpload";
import TabNavigation from "./components/TabNavigation";
import InfoTab from "./components/InfoTab";
import SpaceTab from "./components/SpaceTab";
import ChargeSchedulesTab from "./components/ChargeSchedulesTab";
import MiscTab from "./components/MiscTab";
import { analyzeDocument } from "./services/api";

function App() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [activeTab, setActiveTab] = useState("info");
  const [analysisData, setAnalysisData] = useState({
    info: null,
    space: null,
    chargeSchedules: null,
    misc: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = async (file) => {
    setUploadedFile(file);
    setError(null);
    setLoading(true);
    
    try {
      const results = await analyzeDocument(file);
      setAnalysisData(results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case "info":
        return <InfoTab data={analysisData.info} loading={loading} />;
      case "space":
        return <SpaceTab data={analysisData.space} loading={loading} />;
      case "charge-schedules":
        return <ChargeSchedulesTab data={analysisData.chargeSchedules} loading={loading} />;
      case "misc":
        return <MiscTab data={analysisData.misc} loading={loading} />;
      default:
        return <InfoTab data={analysisData.info} loading={loading} />;
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Realty Lease Analysis</h1>
        <p>Upload your lease document to analyze key information</p>
      </header>

      <main className="app-main">
        <FileUpload 
          onFileUpload={handleFileUpload}
          loading={loading}
          error={error}
        />

        {uploadedFile && (
          <div className="analysis-section">
            <TabNavigation 
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
            <div className="tab-content">
              {renderActiveTab()}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;