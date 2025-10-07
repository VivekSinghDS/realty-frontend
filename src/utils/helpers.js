import {DataItem} from "../components/DataItem";
export const formatLabel = (str) => {
    return str
      .replace(/([A-Z])/g, " $1")
      .replace(/_/g, " ")
      .replace(/^./, (char) => char.toUpperCase())
      .trim();
  };

  // Helper function to check if a value is empty
  const isEmpty = (value) => {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string' && value.trim() === '') return true;
    if (Array.isArray(value) && value.length === 0) return true;
    if (typeof value === 'object' && Object.keys(value).length === 0) return true;
    return false;
  };

  // Helper function to render nested data
export const renderValue = (value) => {
    if (isEmpty(value)) return null;
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (typeof value === "string" || typeof value === "number") return value;
    if (Array.isArray(value)) {
      return (
        <ul style={{ margin: "0.5rem 0", paddingLeft: "1.5rem" }}>
          {value.map((item, idx) => (
            <li key={idx} style={{ marginBottom: "0.5rem" }}>
              {typeof item === "object" ? renderObject(item) : item}
            </li>
          ))}
        </ul>
      );
    }
    if (typeof value === "object") {
      return renderObject(value);
    }
    return String(value);
  };

// Helper function to render objects
export const renderObject = (obj) => {
    return (
      <div style={{ marginLeft: "1rem", marginTop: "0.5rem" }}>
        {Object.entries(obj)
          .filter(([key, value]) => !isEmpty(value)) // Filter out empty values
          .map(([key, value]) => (
            <DataItem
              key={key}
              label={formatLabel(key)}
              value={renderValue(value)}
            />
          ))}
      </div>
    );
  };