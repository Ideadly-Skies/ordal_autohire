
import ChatMessageItem from "./ChatMessageItem.jsx";
import React from "react";

export default function ChatBody({ renderItems, chatEndRef }) {
  // Find the index of the first assistant message (from !== 'user' and not action/loading)
  const firstAssistantIdx = renderItems.findIndex(
    (msg) => msg.from !== "user" && msg.type !== "action-group" && msg.type !== "loading"
  );
  return (
    <div className="fwc-chat-body">
      {renderItems.map((msg, i) => {
        if (msg.type === "action-group") {
          return <ChatMessageItem key={i} type="action" allActions={msg.actions} />;
        } else if (msg.type === "loading") {
          return <ChatMessageItem key={i} type="loading" />;
        } else {
          return (
            <ChatMessageItem
              key={i}
              from={msg.from}
              text={msg.text}
              type={msg.type}
              timestamp={msg.timestamp}
              useTypewriter={i === firstAssistantIdx}
            />
          );
        }
      })}
      <div ref={chatEndRef} />
    </div>
  );
}