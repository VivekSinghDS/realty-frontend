import { useState } from "react";

// A utility function to deeply merge objects, useful for state updates.
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
  
  // Define the top-level keys you expect to render iteratively
  const topLevelKeys = ['fact_sheet', 'money_map', 'obligations_list', 'audit_and_exceptions'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRenderedData({});
    setLoading(true);

    let jsonBuffer = "";
    // Keep track of keys that have already been fully parsed and rendered
    const parsedKeys = new Set();

    try {
      const res = await fetch("http://localhost:8000/sample-stream", {
        method: "POST",
        body: new FormData(e.target), // Simpler way to handle form data
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        jsonBuffer += decoder.decode(value, { stream: true });

        // **NEW PARSING LOGIC**
        // For each key we are looking for...
        for (const key of topLevelKeys) {
          // ...if we haven't already parsed it...
          if (!parsedKeys.has(key)) {
            // ...try to find a complete object for it in the buffer.
            const keyPattern = `"${key}"`;
            const keyIndex = jsonBuffer.indexOf(keyPattern);

            if (keyIndex === -1) continue;

            // Find the opening brace of the object value
            const startIndex = jsonBuffer.indexOf('{', keyIndex + keyPattern.length);
            if (startIndex === -1) continue;

            let braceCount = 1;
            let endIndex = -1;

            // Start scanning from after the opening brace
            for (let i = startIndex + 1; i < jsonBuffer.length; i++) {
              if (jsonBuffer[i] === '{') {
                braceCount++;
              } else if (jsonBuffer[i] === '}') {
                braceCount--;
              }
              // If braceCount is 0, we've found the end of the object
              if (braceCount === 0) {
                endIndex = i;
                break;
              }
            }
            
            // If we found a complete object...
            if (endIndex !== -1) {
              const objectString = jsonBuffer.substring(startIndex, endIndex + 1);
              try {
                const parsedObject = JSON.parse(objectString);
                
                // Merge the newly parsed object into our state
                setRenderedData(prev => deepMerge(prev, { [key]: parsedObject }));
                
                // Mark this key as done
                parsedKeys.add(key);
              } catch (e) {
                // This can happen if the extracted string is still not perfect JSON. Ignore and wait.
              }
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
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>Lease Analysis</h1>
      {/* Added name attributes to inputs for easier FormData creation */}
      <form onSubmit={handleSubmit}>
        <input
          name="text"
          type="text"
          placeholder="Enter text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ padding: "0.5rem", marginBottom: "1rem", display: "block" }}
        />
        <input
          name="file"
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          style={{ marginBottom: "1rem", display: "block" }}
        />
        <button type="submit" style={{ padding: "0.5rem" }}>
          Submit
        </button>
      </form>
      {loading && <p>Streaming...</p>}
      <div
        style={{
          marginTop: "2rem",
          padding: "1rem",
          border: "1px solid #ddd",
          minHeight: "100px",
        }}
      >
        <strong>Response:</strong>
        <div style={{ whiteSpace: "pre-wrap" }}>
          {Object.keys(renderedData).length > 0 ? (
             Object.keys(renderedData).map((key) => {
               if (topLevelKeys.includes(key) && renderedData[key]) {
                 return (
                   <div key={key} style={{ border: '1px solid #eee', padding: '10px', marginTop: '10px' }}>
                     <h2 style={{textTransform: 'capitalize'}}>{key.replace(/_/g, ' ')}</h2>
                     <pre>{JSON.stringify(renderedData[key], null, 2)}</pre>
                   </div>
                 );
               }
               return null;
             })
          ) : (
            !loading && <p>No data yet. Submit to start.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;