// ChatHeader.jsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faTimes } from "@fortawesome/free-solid-svg-icons";

const AVATAR_URL = "/assets/avatar.jpg";

export default function ChatHeader({ onMinimize, onClose }) {
  return (
    <div className="fwc-chat-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <img
          src={AVATAR_URL}
          alt="Assistant avatar"
          className="fwc-chat-avatar"
          width={32}
          height={32}
          loading="eager"
        />
        Ordal Assistant 
      </div>
      <div>
        <button onClick={onMinimize} className="fwc-chat-header-button">
          <FontAwesomeIcon icon={faChevronDown} />
        </button>
        <button onClick={onClose} className="fwc-chat-header-button">
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
    </div>
  );
}
