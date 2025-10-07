import { useState } from "react";
import Card from "./components/Card";
import DataItem from "./components/DataItem";
import { formatLabel, renderValue, renderObject } from "./utils/helpers";
import "./App.css";

// The deepMerge utility is still very useful for robust state updates.
const deepMerge = (target, source) => {
  const output = { ...target };
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
};

const isObject = (item) => {
  return (item && typeof item === 'object' && !Array.isArray(item));
};

function App() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [renderedData, setRenderedData] = useState({});
  const [loading, setLoading] = useState(false);
  
  // Updated list to include "obligations_list" from your example
  const topLevelKeys = ['executiveSummary', 'leaseInformation', 'space', 'chargeSchedules', "otherLeaseProvisions"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRenderedData({});
    setLoading(true);

    let jsonBuffer = "";

    try {
      const res = await fetch("http://localhost:8000/lease/general", {
        method: "POST",
        body: new FormData(e.target),
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        jsonBuffer += decoder.decode(value, { stream: true });

        // On every chunk, try to parse all keys. This allows for growing arrays.
        for (const key of topLevelKeys) {
          const keyPattern = `"${key}"`;
          let keyIndex = -1;
          let searchFrom = 0;
          
          // Find the last occurrence of the key in case the stream is weird
          while(jsonBuffer.indexOf(keyPattern, searchFrom) !== -1){
            keyIndex = jsonBuffer.indexOf(keyPattern, searchFrom);
            searchFrom = keyIndex + 1;
          }

          if (keyIndex === -1) continue;

          // Find the start of the value (the first '{' or '[' after the key)
          let startIndex = -1;
          let openingChar = '';
          let closingChar = '';

          for (let i = keyIndex + keyPattern.length; i < jsonBuffer.length; i++) {
            const char = jsonBuffer[i];
            if (char === '{' || char === '[') {
              startIndex = i;
              openingChar = char;
              closingChar = (char === '{') ? '}' : ']';
              break;
            }
          }
          
          if (startIndex === -1) continue;

          // Balance the delimiters (either braces or brackets)
          let delimiterCount = 1;
          let endIndex = -1;

          for (let i = startIndex + 1; i < jsonBuffer.length; i++) {
            if (jsonBuffer[i] === openingChar) {
              delimiterCount++;
            } else if (jsonBuffer[i] === closingChar) {
              delimiterCount--;
            }
            if (delimiterCount === 0) {
              endIndex = i;
              break;
            }
          }
          
          if (endIndex !== -1) {
            const valueString = jsonBuffer.substring(startIndex, endIndex + 1);
            try {
              const parsedValue = JSON.parse(valueString);
              
              // Use deepMerge to update the state with the latest version of this key's value
              setRenderedData(prev => deepMerge(prev, { [key]: parsedValue }));
              
            } catch (e) {
              // Incomplete but parsable segment found, ignore and wait for more data
            }
          }
        }
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div style={{ 
      padding: "2rem", 
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      backgroundColor: "#f5f5f5",
      minHeight: "100vh"
    }}>
      <h1 style={{ color: "#333", marginBottom: "2rem" }}>Lease Analysis</h1>
      <form onSubmit={handleSubmit} style={{
        backgroundColor: "white",
        padding: "1.5rem",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        marginBottom: "2rem"
      }}>
        <input 
          name="text" 
          type="text" 
          placeholder="Enter text" 
          value={text} 
          onChange={(e) => setText(e.target.value)} 
          style={{ 
            padding: "0.75rem", 
            marginBottom: "1rem", 
            display: "block",
            width: "100%",
            border: "1px solid #ddd",
            borderRadius: "4px",
            fontSize: "1rem"
          }} 
        />
        <input 
          name="assets" 
          type="file" 
          onChange={(e) => setFile(e.target.files[0])} 
          style={{ 
            marginBottom: "1rem", 
            display: "block",
            padding: "0.5rem"
          }} 
        />
        <button 
          type="submit" 
          style={{ 
            padding: "0.75rem 2rem",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontSize: "1rem",
            cursor: "pointer",
            fontWeight: "600"
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = "#0056b3"}
          onMouseOut={(e) => e.target.style.backgroundColor = "#007bff"}
        >
          Submit
        </button>
      </form>
      
      {loading && (
        <div style={{
          backgroundColor: "#fff3cd",
          color: "#856404",
          padding: "1rem",
          borderRadius: "4px",
          marginBottom: "1rem",
          border: "1px solid #ffeaa7"
        }}>
          <strong>⏳ Streaming data...</strong>
        </div>
      )}
      
      <div style={{ marginTop: "2rem" }}>
        {Object.keys(renderedData).length > 0 ? (
          <div style={{ display: "grid", gap: "1.5rem" }}>
            {topLevelKeys.map((key) => {
              if (renderedData[key]) {
                // Check if the section has any non-empty content
                const hasContent = typeof renderedData[key] === "object" && !Array.isArray(renderedData[key]) 
                  ? Object.values(renderedData[key]).some(value => {
                      if (value === null || value === undefined) return false;
                      if (typeof value === 'string' && value.trim() === '') return false;
                      if (Array.isArray(value) && value.length === 0) return false;
                      if (typeof value === 'object' && Object.keys(value).length === 0) return false;
                      return true;
                    })
                  : !(renderedData[key] === null || renderedData[key] === undefined || 
                      (typeof renderedData[key] === 'string' && renderedData[key].trim() === '') ||
                      (Array.isArray(renderedData[key]) && renderedData[key].length === 0) ||
                      (typeof renderedData[key] === 'object' && Object.keys(renderedData[key]).length === 0));

                if (!hasContent) return null;

                return (
                  <Card key={key} title={formatLabel(key)}>
                    {typeof renderedData[key] === "object" && !Array.isArray(renderedData[key]) ? (
                      <div>
                        {Object.entries(renderedData[key]).map(([subKey, subValue]) => (
                          <DataItem
                            key={subKey}
                            label={formatLabel(subKey)}
                            value={renderValue(subValue)}
                          />
                        ))}
                      </div>
                    ) : (
                      <div>{renderValue(renderedData[key])}</div>
                    )}
                  </Card>
                );
              }
              return null;
            })}
          </div>
        ) : (
          !loading && (
            <div style={{
              backgroundColor: "white",
              padding: "3rem",
              borderRadius: "8px",
              textAlign: "center",
              color: "#666",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}>
              <p style={{ fontSize: "1.1rem" }}>No data yet. Submit the form to start analyzing.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default App;