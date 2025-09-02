import React from "react";
import { createRoot } from "react-dom/client";
import Chat from '../Chat/Chat.jsx';
import ChatRest from '../Chat/ChatRest.jsx';
import FloatingChatWidget from '../Chat/FloatingChatWidget.jsx';

// Font Awesome setup
import { config } from "@fortawesome/fontawesome-svg-core";
import faCss from '@fortawesome/fontawesome-svg-core/styles.css';
import widgetCss from '../../styles/App.css';

config.autoAddCss = false;

const roots = new Map();

export function renderChatWidget(containerId, options = {}) {
  let container = document.getElementById(containerId);

  if (!container) {
    container = document.createElement('div');
    container.id = containerId;
    document.body.appendChild(container);
  }

  const { popup = false, mode = "ws", ...props } = options;

  if (popup) {
    const shadowWrapper = document.createElement("div");
    shadowWrapper.id = `fwc-chat-widget-${containerId}`;
    shadowWrapper.className = "fwc-chat-widget";
    shadowWrapper.style.position = "fixed";
    shadowWrapper.style.bottom = options.position?.bottom || "24px";
    shadowWrapper.style.right = options.position?.right || "24px";
    shadowWrapper.style.zIndex = 9999;

    const shadowRoot = shadowWrapper.attachShadow({ mode: "open" });

    // Mount point
    const shadowMount = document.createElement("div");
    shadowRoot.appendChild(shadowMount);
    document.body.appendChild(shadowWrapper);

    // Inject widget styles
    const styleTag = document.createElement('style');
    styleTag.textContent = widgetCss;
    shadowRoot.appendChild(styleTag);

    // Inject Font Awesome styles
    const faStyleTag = document.createElement('style');
    faStyleTag.textContent = faCss;
    shadowRoot.appendChild(faStyleTag);

    const root = createRoot(shadowMount);
    root.render(<FloatingChatWidget mode={mode} {...props} />);
  } else {
    let root = roots.get(containerId);
    if (!root) {
      root = createRoot(container);
      roots.set(containerId, root);
    }

    if (mode === "rest") {
      root.render(<ChatRest {...props} />);
    } else {
      root.render(<Chat {...props} />);
    }
  }
}