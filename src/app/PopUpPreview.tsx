// src/app/PopUpPreview.tsx
"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context"; // assumes your provider exports this

const FloatingChatWidget = dynamic(
  () => import("@/components/Chat/FloatingChatWidget"),
  { ssr: false }
);

// Stable anon id so a guest has a consistent session until they sign in
function useStableAnonId() {
  const [id, setId] = useState<string>();
  useEffect(() => {
    if (typeof window === "undefined") return;
    let v = localStorage.getItem("fwc_anon_id");
    if (!v) {
      v =
        "anon_" +
        (crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2, 10));
      localStorage.setItem("fwc_anon_id", v);
    }
    setId(v);
  }, []);
  return id;
}

export default function PopUpPreview() {
  const { user } = useAuth(); // <- from your AuthProvider
  const anonId = useStableAnonId();
  const userId = user?.id ?? anonId;
  
  console.log(`userid connected in this session: ${userId}`)

  // Wait until we have either a real uid or anon id
  if (!userId) return null;

  return (
    <div id="chat-widget-container">
      <FloatingChatWidget
        popup
        mode="ws"
        userId={userId}
        position={{ bottom: "24px", right: "24px" }}
        width="400px"
        height="600px"
      />
    </div>
  );
}
