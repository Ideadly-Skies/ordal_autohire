import React from "react";

export default function ChatSuggestions({ suggestions, onClickSuggestion }) {
  return (
    <div className="fwc-chat-suggestions">
      {suggestions.map((s, i) => (
        <button
          key={i}
          className="fwc-chat-suggestion-button"
          onClick={() => onClickSuggestion(s)}
          style={{
            animationDelay: `${0.1 + i * 0.05}s, ${1 + i * 0.2}s`,
          }}
        >
          {s}
        </button>
      ))}
    </div>
  );
}