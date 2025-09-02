import React, { useState, useRef, useEffect } from "react";
import ChatHeader from "./ChatHeader.jsx";
import ChatBody from "./ChatBody.jsx";
import ChatSuggestions from "./ChatSuggestions.jsx";
import ChatInput from "./ChatInput.jsx";
import ChatStatus from "./ChatStatus.jsx";
import ChatConnectingFallback from "./ChatConnectingFallback.jsx";
import ChatConnectionError from "./ChatConnectionError.jsx";

export default function ChatRest({ userId, setIsMinimized, setChatEnded }) {
  const [messages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatLog, setChatLog] = useState([]);
  const [chatUrl, setChatUrl] = useState("");
  const [apiUrl, setApiUrl] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [connectionTimedOut, setConnectionTimedOut] = useState(false);
  const chatEndRef = useRef(null);
  const messageIndexRef = useRef(0);
  const hasConnected = useRef(false);

  const [suggestions, setSuggestions] = useState([]);

  function extractEnvFromUserId(userId) {
    if (userId?.startsWith("dev_")) return "DEV";
    if (userId?.startsWith("prod_")) return "PROD";
    return "DEV";
  }

  function extractUserId(userId) {
    return userId?.replace(/^(dev_|prod_)/, "") || userId;
  }

  const env = extractEnvFromUserId(userId);
  const processedUserId = extractUserId(userId);

  // function getConfigUrl() {
  //   const currentScript = document.currentScript || (() => {
  //     return document.getElementById("chat-widget-script");
  //   })();
  //   if (!currentScript) return "config.json";
  //   return new URL("config.json", currentScript?.src || "").href;
  // }
  function getConfigUrl() {
    // Always fetch from the site root, works on any route
    return new URL("/config.json", window.location.origin).toString();
  }

  const connect = async () => {
    setIsConnecting(true);
    try {
      const payload = {
        Identifier: processedUserId,
        MessageType: "web_type",
      };

      const res = await fetch(`${apiUrl}/auth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "skip_zrok_interstitial": "True",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!data.UserName) {
        setChatLog((prev) => [
          ...prev,
          { from: "response", text: "Unauthorized user." },
        ]);
        return;
      }

      setIsConnected(true);
      setChatLog((prev) => [
        ...prev,
        { from: "response", text: `Hi, ${data.UserName}! How can I assist you today?` },
      ]);
    } catch (err) {
      setChatLog((prev) => [
        ...prev,
        { from: "response", text: "⚠️ Error: could not reach server." },
      ]);
    } finally {
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    const configUrl = getConfigUrl();
    fetch(configUrl)
      .then((res) => res.json())
      .then((config) => {
        setChatUrl(config[`REACT_APP_CHAT_BASE_URL_${env}`]);
        setApiUrl(config[`REACT_APP_SYSTEM_BASE_URL_${env}`]);
      })
      .catch((err) => {
        console.error("Failed to load config:", err);
        setChatUrl("");
        setApiUrl("");
      });
  }, [userId]);

  useEffect(() => {
    if (apiUrl && !hasConnected.current) {
      hasConnected.current = true;
      connect();
    }
  }, [apiUrl]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatLog]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);
    const userMessage = input;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setSuggestions([]); 
    setInput("");

    setChatLog((prev) => [...prev, { from: "user", text: userMessage, timestamp: now }]);

    setTimeout(() => {
      setChatLog((prev) => [...prev, { type: "loading" }]);
    }, 500);

    try {
      const res = await fetch(`${chatUrl}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "skip_zrok_interstitial": "True",
        },
        body: JSON.stringify({ message: userMessage, code: userId }),
      });

      const data = await res.json();

      setChatLog((prev) => {
        const updated = [...prev];
        const loadingIndex = updated.findIndex((m) => m.type === "loading");
        const responseMessage = { from: "response", text: data.response, timestamp: now };

        if (loadingIndex !== -1) {
          updated.splice(loadingIndex, 1, responseMessage);
        } else {
          updated.push(responseMessage);
        }
        return updated;
      });
    } catch (err) {
      const errorMessage = {
        from: "response",
        text: "⚠️ Error: could not reach server.",
      };
      setChatLog((prev) => {
        const updated = [...prev];
        const loadingIndex = updated.findIndex((m) => m.type === "loading");
        if (loadingIndex !== -1) {
          updated.splice(loadingIndex, 1, errorMessage);
        } else {
          updated.push(errorMessage);
        }
        return updated;
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isConnected) {
      setSuggestions([
        "What is this chatbot?",
        "How many staff members registered?",
        "Generate an excel spreadsheet for August 2024 visitation list",
        "Can you check visitor Shank latest activity? leave the status field blank"
      ]);
    }
  }, [isConnected]);

  return (
    <div className="fwc-chat-widget" style={{ backgroundColor: "#fff" }}>
      <ChatHeader onMinimize={() => setIsMinimized(true)} onClose={() => { setIsMinimized(true); setChatEnded(true); }} />
      <ChatStatus isConnected={isConnected} reconnect={connect} />
      {isConnecting && !connectionTimedOut ? (
        <ChatConnectingFallback />
      ) : !isConnected ? (
        <ChatConnectionError />
      ) : (
        <>
          <ChatBody renderItems={chatLog} chatEndRef={chatEndRef} />
          {suggestions.length > 0 && (
            <ChatSuggestions suggestions={suggestions} onClickSuggestion={setInput} />
          )}
          <ChatInput input={input} setInput={setInput} sendMessage={sendMessage} loading={loading || !isConnected} />
        </>
      )}
    </div>
  );
}