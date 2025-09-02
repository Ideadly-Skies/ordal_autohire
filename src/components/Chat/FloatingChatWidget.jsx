import React, { useState } from "react";
import Chat from "./Chat.jsx";
import ChatRest from "./ChatRest.jsx";

// chat icon from font-awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentDots } from "@fortawesome/free-solid-svg-icons";

export default function FloatingChatWidget({ mode = "ws", ...props }) {
  const [isMinimized, setIsMinimized] = useState(true);
  const [chatEnded, setChatEnded] = useState(false);

  const handleRestart = () => {
    setChatEnded(false); 
    setIsMinimized(false); 
  };

  return (
    <>
      {/* Floating Button */}
      {(isMinimized || chatEnded) && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            backgroundColor: "#007bff",
            color: "#fff",
            borderRadius: "50%",
            width: "60px",
            height: "60px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "28px",
            cursor: "pointer",
            zIndex: 1000,
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
          }}
          onClick={() => {
            if (chatEnded) {
              handleRestart();
            } else {
              setIsMinimized(false);
            }
          }}
        >
         <FontAwesomeIcon icon={faCommentDots} />
        </div>
      )}
  
      {/* Chat Window */}
      <div className={`fwc-chat-window ${isMinimized ? "collapsed" : "expanded"}`}>
        {chatEnded ? (
          <div style={{ padding: 20, textAlign: "center" }}>
            <p>🧾 Chat session ended.</p>
            <button
              onClick={handleRestart}
              style={{
                marginTop: 10,
                padding: "8px 16px",
                backgroundColor: "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer"
              }}
            >
              Start New Chat
            </button>
          </div>
        ) : mode === "rest" ? (
          <ChatRest
            isMinimized={isMinimized}
            setIsMinimized={setIsMinimized}
            setChatEnded={setChatEnded}
            {...props}
          />
        ) : (
          <Chat
            isMinimized={isMinimized}
            setIsMinimized={setIsMinimized}
            setChatEnded={setChatEnded}
            {...props}
          />
        )}
      </div>
    </>
  );
}
