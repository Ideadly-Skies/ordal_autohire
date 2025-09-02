
import React, { useState } from "react";
import Typewriter from "./TypeWriter.jsx";

export default function ChatMessageItem({ from, text, type, allActions = [], timestamp, useTypewriter }) {
  const [expanded, setExpanded] = useState(false);

  if (type === "attachment") {
    return (
      <div className="fwc-chat-message-row left">
        <div className={`fwc-chat-message ${from === "user" ? "user" : "response"}`}>
          <a
            href={text}
            target="_blank"
            rel="noopener noreferrer"
            className="fwc-chat-attachment-link"
          >
            📎 View Attachment
          </a>
        </div>
        {timestamp && (
          <div className="fwc-chat-timestamp left">
            {timestamp}
          </div>
        )}
      </div>
    );
  }
  if (type === "loading") {
    return (
      <div className="fwc-chat-message-row left">
        <div className="fwc-chat-message loading">
          <span className="dot-flash">Processing</span>
        </div>
        {timestamp && (
          <div className={`fwc-chat-timestamp left`}>
            {timestamp}
          </div>
        )}
      </div>
    );
  }

  if (type !== "action") {
    const direction = from === "user" ? "right" : "left";
    const classes = `fwc-chat-message-row ${direction}`;

    return (
      <div className={classes}>
        <div className={`fwc-chat-message ${from === "user" ? "user" : "response"}`}>
          {useTypewriter && from !== "user" ? (
            <Typewriter text={text} />
          ) : (
            <span
              dangerouslySetInnerHTML={{
                __html:
                  text?.replace(/\n/g, "<br />").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") || "",
              }}
            />
          )}
        </div>
        {timestamp && (
          <div className={`fwc-chat-timestamp ${direction}`}>
            {timestamp}
          </div>
        )}
      </div>
    );
  }

  const visibleActions = expanded ? allActions : [allActions[allActions.length - 1]];

  return (
    <div className={`fwc-chat-message-row left action-group ${expanded ? "expanded" : ""}`}>
      {visibleActions.map((actionText, index) => (
        <div key={index} className="fwc-chat-message action">
          {actionText.text}
          {expanded && actionText.args ? ` with: ${actionText.args}` : ""}
        </div>
      ))}
      {allActions.length > 1 && (
        <div className="fwc-action-expand">
          <button onClick={() => setExpanded(!expanded)}>
            {expanded
              ? "Show Less"
              : `Show ${allActions.length - 1} More Action${allActions.length > 2 ? "s" : ""}`}
          </button>
        </div>
      )}
    </div>
  );
}
