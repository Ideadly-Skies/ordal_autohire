import Lottie from "lottie-react";
import errorAnimation from "../../../public/assets/Errorfailure.json";
import React from "react";

export default function ChatConnectionError() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "30px 20px", textAlign: "center" }}>
      <Lottie animationData={errorAnimation} style={{ height: 120, width: 120 }} />
      <p style={{ color: "#999", marginTop: "1rem" }}>
        Failed to connect. Please check your internet or try again later.
      </p>
    </div>
  );
}