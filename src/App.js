import { useState } from "react";

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
  const topLevelKeys = ['fact_sheet', 'money_map', 'obligations_list', 'audit_and_exceptions'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRenderedData({});
    setLoading(true);

    let jsonBuffer = "";

    try {
      const res = await fetch("http://localhost:8000/sample-stream", {
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
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>Lease Analysis</h1>
      <form onSubmit={handleSubmit}>
        <input name="text" type="text" placeholder="Enter text" value={text} onChange={(e) => setText(e.target.value)} style={{ padding: "0.5rem", marginBottom: "1rem", display: "block" }} />
        <input name="file" type="file" onChange={(e) => setFile(e.target.files[0])} style={{ marginBottom: "1rem", display: "block" }} />
        <button type="submit" style={{ padding: "0.5rem" }}>Submit</button>
      </form>
      {loading && <p>Streaming...</p>}
      <div style={{ marginTop: "2rem", padding: "1rem", border: "1px solid #ddd", minHeight: "100px" }}>
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