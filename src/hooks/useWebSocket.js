import { useEffect, useRef, useState } from "react";

export default function useWebSocket({ userId, path = "/ws/chat", chatBaseUrl = ""}) {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);
  
  const API_BASE_URL = chatBaseUrl 
  const WS_BASE_URL = API_BASE_URL.replace(/^http/, "ws");
  const WS_URL = `${WS_BASE_URL}${path}?user_id=${userId}`;

  const connect = () => {
    if (chatBaseUrl === "") {
      return {
        messages: [],
        isConnected: false,
        send: () => {},
        reconnect: () => {},
        socket: null,
      }
    }

    socketRef.current = new WebSocket(WS_URL);

    socketRef.current.onopen = () => {
      setIsConnected(true);
      console.log("🟢 Connected to", WS_URL);
    };

    socketRef.current.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        // log the raw message for debugging
        console.log("Received message:", msg);
        // log msg.type
        console.log("Message type:", msg.type);
        if (msg.type === "action") {
          setMessages((prev) => [...prev, { type: "action", content: msg.text, args: msg.args }]);
        } else if (msg.type === "response") {
          setMessages((prev) => [...prev, { type: "response", content: msg.text }]);
        } else if (msg.type === "attachment") {
          setMessages((prev) => [...prev, { type: "attachment", content: msg.text }]);
        }else if (msg.type === "error") {
          setMessages((prev) => [...prev, { type: "error", content: msg.text }]);
        } else {
          // fallback: unknown structured type
          setMessages((prev) => [...prev, { type: msg.type, content: `Hi i am your ordal virtual assistant! How can I help?` }]);
        }
      } catch {
        // fallback: plain text message
        setMessages((prev) => [...prev, { type: "raw", content: e.data }]);
      }
    };

    socketRef.current.onclose = () => {
      setIsConnected(false);
      console.log("🔴 Disconnected from", WS_URL);
    };
  };

  const send = (message) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(message);
    }
  };

  const disconnect = () => {
    socketRef.current?.close();
  };

  const reconnect = () => {
    disconnect();
    connect();
  };

  useEffect(() => {
    connect();
    return () => disconnect();
  }, []); // connect on mount

  return {
    messages,
    isConnected,
    send,
    reconnect,
    socket: socketRef.current,
  };
}
