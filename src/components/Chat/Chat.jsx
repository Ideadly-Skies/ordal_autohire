import React, { useState, useEffect, useRef } from "react";
import useWebSocket from "../../hooks/useWebSocket";
import ChatHeader from "./ChatHeader.jsx";
import ChatStatus from "./ChatStatus.jsx";
import ChatBody from "./ChatBody.jsx";
import ChatSuggestions from "./ChatSuggestions.jsx";
import ChatInput from "./ChatInput.jsx";
import ChatConnectingFallback from "./ChatConnectingFallback.jsx";
import ChatConnectionError from "./ChatConnectionError.jsx";

export default function Chat({ userId, setIsMinimized, setChatEnded }) {
  const [baseUrl, setBaseUrl] = useState("");
  const [input, setInput] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const messageIndexRef = useRef(0);
  const chatEndRef = useRef(null);

  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const [connectionTimedOut, setConnectionTimedOut] = useState(false);

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

  const { messages, isConnected, send, reconnect } = useWebSocket({
    userId: processedUserId,
    chatBaseUrl: baseUrl,
  });

  function getConfigUrl() {
    const currentScript = document.currentScript || (() => {
      const script = document.getElementById("chat-widget-script");
      return script;
    })();
    if (!currentScript) return "config.json";
    const base = currentScript?.src || "";
    return new URL("config.json", base).href;
  }

  useEffect(() => {
    fetch(getConfigUrl())
      .then((res) => res.json())
      .then((config) => {
        setBaseUrl(config[`REACT_APP_CHAT_BASE_URL_${env}`]);
      })
      .catch((err) => {
        console.error("Failed to load config:", err);
        setBaseUrl("");
      });
  }, []);

  useEffect(() => {
    if (baseUrl) {
      setIsConnecting(true);
      reconnect();
    }
  }, [baseUrl]);

  useEffect(() => {
    if (isConnected) {
      setIsConnecting(false);
      setConnectionTimedOut(false);
    } else if (!isConnecting) {
      setIsConnecting(false);
    }
  }, [isConnected]);

  useEffect(() => {
    if (isConnecting) {
      const timeout = setTimeout(() => {
        if (!isConnected) {
          setConnectionTimedOut(true);
          setIsConnecting(false);
        }
      }, 5000);
      return () => clearTimeout(timeout);
    } else {
      setConnectionTimedOut(false);
    }
  }, [isConnecting, isConnected]);

  const sendMessage = () => {
    if (!input.trim()) return;
    setLoading(true);
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMessage = { from: "user", text: input, timestamp: now };
    const loadingMessage = { type: "loading", timestamp: now };
    send(input);
    setInput("");
    setSuggestions([]);
    setChatLog(prev => [...prev, userMessage]);
    setTimeout(() => setChatLog(prev => [...prev, loadingMessage]), 500);
  };

  useEffect(() => {
    if (messages.length > messageIndexRef.current) {
      const newMessages = messages.slice(messageIndexRef.current);
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const formatted = newMessages.map(msg => ({
        type: msg.type,
        text: msg.content,
        args: msg.args ? JSON.stringify(msg.args).slice(0, 300) : null,
        timestamp: now
      }));

      setChatLog(prev => {
        const updated = [...prev];
        const loadingIndex = updated.findIndex(m => m.type === "loading");
        if (loadingIndex !== -1) {
          updated.splice(loadingIndex, 1, ...formatted);
        } else {
          updated.push(...formatted);
        }
        return updated;
      });

      messageIndexRef.current = messages.length;
      setLoading(false);
    }
  }, [messages]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatLog]);

  useEffect(() => {
    if (isConnected) {
      setSuggestions([
        "list all job matches",
        "Auto-apply 3 roles",        
        "Add Python skills",       
        "Set my locale to SG"       
      ]);
    }
  }, [isConnected]);

  const renderItems = [];
  let tempActionGroup = [];
  chatLog.forEach((msg) => {
    if (msg.type === "action") {
      tempActionGroup.push({ text: msg.text, args: msg.args || "" });
    } else {
      if (tempActionGroup.length > 0) {
        renderItems.push({ type: "action-group", actions: [...tempActionGroup] });
        tempActionGroup = [];
      }
      renderItems.push(msg);
    }
  });
  if (tempActionGroup.length > 0) {
    renderItems.push({ type: "action-group", actions: [...tempActionGroup] });
  }

  return (
    <div className="fwc-chat-widget" style={{ backgroundColor: "#fff" }}>
      <ChatHeader onMinimize={() => setIsMinimized(true)} onClose={() => { setIsMinimized(true); setChatEnded(true); }} />
      <ChatStatus isConnected={isConnected} reconnect={reconnect} />

      {isConnecting && !connectionTimedOut ? (
        <ChatConnectingFallback />
      ) : !isConnected ? (
        <ChatConnectionError />
      ) : (
        <>
          <ChatBody renderItems={renderItems} chatEndRef={chatEndRef} />
          {suggestions.length > 0 && (
            <ChatSuggestions suggestions={suggestions} onClickSuggestion={setInput} />
          )}
          <ChatInput input={input} setInput={setInput} sendMessage={sendMessage} loading={loading} />
        </>
      )}
    </div>
  );
}