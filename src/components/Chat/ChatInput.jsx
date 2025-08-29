import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import React from "react";

export default function ChatInput({ input, setInput, sendMessage, loading }) {
  return (
    <div className="fwc-chat-input" style={{ position: "relative", padding: "10px", background: "#fff", borderTop: "1px solid #ddd" }}>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Message…"
        className="fwc-chat-input-textarea"
        style={{
          width: "100%", height: "auto", maxHeight: "100px", minHeight: "42px",
          fontSize: "15px", padding: "10px 48px 10px 12px", lineHeight: "1.4",
          border: "1px solid #ccc", borderRadius: "20px", backgroundColor: "#fff",
          boxSizing: "border-box", outline: "none", resize: "none", overflowY: "auto",
          scrollbarWidth: "none"
        }}
        rows={1}
        onInput={(e) => {
          e.target.style.height = "auto";
          e.target.style.height = `${Math.min(e.target.scrollHeight, 100)}px`;
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey && !loading) {
            e.preventDefault();
            sendMessage();
          }
        }}
      />
      <button
        onClick={sendMessage}
        disabled={loading}
        style={{
          position: "absolute", right: "20px", bottom: "14px",
          width: "32px", height: "32px", backgroundColor: "#3366ff",
          border: "none", borderRadius: "50%", display: "flex",
          justifyContent: "center", alignItems: "center", cursor: loading ? "not-allowed" : "pointer",
          color: "#fff", opacity: input.trim() === "" ? 0 : 1,
          transform: input.trim() === "" ? "scale(0.8)" : "scale(1)",
          pointerEvents: input.trim() === "" ? "none" : "auto",
          transition: "opacity 0.25s ease, transform 0.25s ease",
          boxShadow: input.trim() === "" ? "none" : "0 0 8px rgba(51, 102, 255, 0.4)"
        }}
      >
        <FontAwesomeIcon icon={faArrowUp} />
      </button>
    </div>
  );
}