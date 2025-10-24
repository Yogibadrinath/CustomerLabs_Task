import React, { useState } from "react";
import "./SaveSegment.css";

const SaveSegment: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        style={{
          padding: "10px 16px",
          background: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Open Panel
      </button>

      <div className={`side-panel ${isOpen ? "open" : ""}`}>
        <div className="side-panel-content">
          <h2>Save Segment</h2>
          <p>This panel slides in from the right.</p>
          <button
            onClick={() => setIsOpen(false)}
            style={{
              padding: "8px 12px",
              background: "#dc3545",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      </div>

      {isOpen && <div className="overlay" onClick={() => setIsOpen(false)}></div>}
    </>
  );
};

export default SaveSegment;
