import React from "react";
import { createRoot } from "react-dom/client";
import Chatbot from "./components/Chatbot";
import cssContent from "./app/App.css?inline";  // 👈 ?inline loads CSS as string

(function () {
  // 👇 Inject CSS as style tag — no separate file needed
  const style = document.createElement("style");
  style.textContent = cssContent;
  document.head.appendChild(style);

  const script =
    document.currentScript || document.querySelector("script[data-chatbot]");

  const config = {
    webhookUrl: script?.getAttribute("data-webhook-url") || "",
    botName: script?.getAttribute("data-bot-name") || "Assistant",
    primaryColor: script?.getAttribute("data-color") || "#6366f1",
    position: script?.getAttribute("data-position") || "bottom-right",
  };

  const container = document.createElement("div");
  container.id = "chatbot-widget-root";
  document.body.appendChild(container);

  createRoot(container).render(<Chatbot config={config} />);
})();