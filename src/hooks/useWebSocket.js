import { useEffect, useRef, useState } from "react";
import { getApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";

// ---- helper: get real display name from Firestore ----
async function fetchDisplayName(userId) {
  if (!userId) return null;
  try {
    const app = getApp(); // assumes Firebase already initialized
    const db = getFirestore(app);

    // Try jobseekers/{uid}
    const seekerSnap = await getDoc(doc(db, "jobseekers", userId));
    if (seekerSnap.exists()) {
      const d = seekerSnap.data() || {};
      const pi = d.personal_info || {};
      const name =
        d.displayName ||
        d.fullName ||
        d.name ||
        pi.name ||
        [pi.first_name, pi.last_name].filter(Boolean).join(" ") ||
        null;
      if (name) return name;
    }

    // Try jobposters/{uid}
    const posterSnap = await getDoc(doc(db, "jobposters", userId));
    if (posterSnap.exists()) {
      const d = posterSnap.data() || {};
      const pi = d.personal_info || {};
      const name =
        d.displayName ||
        d.fullName ||
        d.companyContactName ||
        d.name ||
        pi.name ||
        [pi.first_name, pi.last_name].filter(Boolean).join(" ") ||
        null;
      if (name) return name;
    }
  } catch (err) {
    console.warn("fetchDisplayName failed:", err);
  }
  return null;
}

export default function useWebSocket({ userId, path = "/ws/chat", chatBaseUrl = ""}) {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);

  // cache resolved name + flags to show greeting once
  const nameRef = useRef(null);
  const nameLoadedRef = useRef(false);
  const greetedRef = useRef(false);

  // prefetch the name (or conclude null) when userId changes
  useEffect(() => {
    let alive = true;
    nameLoadedRef.current = false;
    fetchDisplayName(userId).then((n) => {
      if (!alive) return;
      nameRef.current = n;           // string or null (but "loaded")
      nameLoadedRef.current = true;
    });
    return () => { alive = false; };
  }, [userId]);

  // const API_BASE_URL = chatBaseUrl 
  // const WS_BASE_URL = API_BASE_URL.replace(/^http/, "ws");
  // const WS_URL = `${WS_BASE_URL}${path}?user_id=${userId}`;
  const API_BASE_URL = chatBaseUrl;

  // Use URL constructor to handle path joining properly
  const constructWebSocketUrl = (baseUrl, path, userId) => {
    // Check if baseUrl is valid and not empty
    if (!baseUrl || typeof baseUrl !== 'string' || baseUrl.trim() === '') {
      console.warn('Invalid baseUrl provided:', baseUrl);
      return ''; // Return empty string to avoid connection attempts
    }
    
    try {
      const url = new URL(baseUrl);
      const wsProtocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = new URL(`${wsProtocol}//${url.host}`);
      
      // Handle path (remove leading slash if present to avoid double slash)
      const cleanPath = path.startsWith('/') ? path.slice(1) : path;
      wsUrl.pathname = cleanPath;
      
      // Add query parameter
      wsUrl.searchParams.set('user_id', userId);
      
      return wsUrl.toString();
    } catch (error) {
      console.error('Error constructing WebSocket URL:', error);
      // Fallback to simple construction
      const cleanBaseUrl = baseUrl.replace(/\/+$/, '');
      const wsBaseUrl = cleanBaseUrl.replace(/^http/, 'ws');
      return `${wsBaseUrl}${path.startsWith('/') ? path : '/' + path}?user_id=${userId}`;
    }
  };

  const WS_URL = chatBaseUrl ? constructWebSocketUrl(API_BASE_URL, path, userId) : '';

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
      greetedRef.current = false; // reset per connection
    };

    socketRef.current.onmessage = async (e) => {
      try {
        const msg = JSON.parse(e.data);
        console.log("Received message:", msg);
        console.log("Message type:", msg.type);

        if (msg.type === "action") {
          setMessages((prev) => [...prev, { type: "action", content: msg.text, args: msg.args }]);
        } else if (msg.type === "response") {
          setMessages((prev) => [...prev, { type: "response", content: msg.text }]);
        } else if (msg.type === "attachment") {
          setMessages((prev) => [...prev, { type: "attachment", content: msg.text }]);
        } else if (msg.type === "error") {
          setMessages((prev) => [...prev, { type: "error", content: msg.text }]);
        } else {
          // ---------- greet ONCE, prefer real name if it resolves shortly ----------
          if (!greetedRef.current) {
            // wait up to ~1.5s for name to load if it hasn't yet
            const start = Date.now();
            while (!nameLoadedRef.current && Date.now() - start < 1500) {
              await new Promise((r) => setTimeout(r, 100));
            }
            const who = nameRef.current || userId || "there";
            setMessages((prev) => [
              ...prev,
              { type: msg.type, content: `Hi ${who}, I am your Ordal virtual assistant! How can I help?` },
            ]);
            greetedRef.current = true;
          }
        }
      } catch {
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
