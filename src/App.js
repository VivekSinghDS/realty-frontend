import { useState } from "react";
import { createStreamingParser } from "llm-json-validator";

// Setup the streaming parser
const parser = createStreamingParser({
  returnParsedJson: true,
  dummyValues: {
    string: "loading...",
    number: 0,
    boolean: false,
    null: null,
  },
});

function App() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [response, setResponse] = useState([]); // Make this an array for multiple JSON chunks
  const [loading, setLoading] = useState(false);

  // NEW: updateUI function
  const updateUI = (parsedChunk) => {
    if (parsedChunk) {
      setResponse((prev) => {
        const updated = [...prev, parsedChunk];
        try {
          console.log(updated)
        } catch (error) {
          // ❌ do nothing on error
        }
        
        return updated;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponse([]);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("text", text);
      if (file) formData.append("file", file);

      const res = await fetch("http://localhost:8000/sample-stream", {
        method: "POST",
        body: formData,
      });

      const reader = res.body.getReader();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const result = parser.appendChunk(chunk);

        // Update UI with parsed JSON chunk
        updateUI(result);
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
        <input
          type="text"
          placeholder="Enter text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ padding: "0.5rem", marginBottom: "1rem", display: "block" }}
        />

        <input
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
        <pre style={{ whiteSpace: "pre-wrap" }}>
          {response.map((item, idx) => (
            <div key={idx}>
              {JSON.stringify(item, null, 2)}
              {"\n-----\n"} 
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}

export default App;
