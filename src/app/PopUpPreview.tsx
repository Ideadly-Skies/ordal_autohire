// PopUpPreview.tsx
"use client";

import dynamic from "next/dynamic";

// import your actual widget entry (adjust path if needed)
const FloatingChatWidget = dynamic(
  () => import("@/components/Chat/FloatingChatWidget"),
  { ssr: false }
);

// dynamically adjust the component later
export default function PopUpPreview() {
  return (
    <div id="chat-widget-container">
      <FloatingChatWidget
        popup
        mode="ws"
        // userId="dev_09cac92d-4606-4e48-8311-fbd014f4b05c.slec.6649"
        userId="EPtwEDTGgcdtF2pE7yuawIa2oi13"
        position={{ bottom: "24px", right: "24px" }}
        width="400px"
        height="600px"
      />
    </div>
  );
}