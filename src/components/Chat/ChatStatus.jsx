import React from "react";

export default function ChatStatus({ isConnected, reconnect }) {
  return (
    <div className="fwc-chat-status" style={{ display: "none" }}>
      Status:{" "}
      <span style={{ color: isConnected ? "green" : "red", marginRight: "10px" }}>
        {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
      </span>
      <button onClick={reconnect} disabled={isConnected} className="fwc-reconnect-btn">
        Reconnect
      </button>
    </div>
  );
}