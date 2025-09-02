import React from "react";

export default function ChatConnectingFallback() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "30px 20px", textAlign: "center" }}>
      <div className="spinner" style={{ height: 60, width: 60, marginBottom: 20 }} />
      <p style={{ color: "#999" }}>Connecting to assistant...</p>
    </div>
  );
}