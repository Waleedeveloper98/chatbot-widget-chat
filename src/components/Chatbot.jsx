import React, { useEffect, useRef, useState } from "react";
import { Bot, Send, MessageCircle, ChevronDown, X } from "lucide-react";
import { handleChat } from "../services/service.api";

const Chatbot = ({ config = {} }) => {
  const webhookUrl =
    config.webhookUrl || "https://waleedaura.app.n8n.cloud/webhook-test/chat";
  const botName = config.botName || "AI Assistant";
  const primaryColor = config.primaryColor || "#4338ca";
  const position = config.position || "bottom-right";

  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      text: "Assalam o Alaikum! Main aapki kaise madad kar sakta hoon?",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);

  const messagesEndRef = useRef(null);

  // ✅ FIX 1: Proper unique sessionId per user
  const getSessionId = () => {
    let sessionId = localStorage.getItem("chatSessionId");
    if (!sessionId) {
      sessionId = "user_" + Date.now();
      localStorage.setItem("chatSessionId", sessionId);
    }
    return sessionId;
  };

  const toggleChat = () => setIsOpen(!isOpen);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const getCurrentTime = () =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const handleSendMessage = async () => {
    if (!message.trim() || isTyping) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      text: message.trim(),
      time: getCurrentTime(),
    };

    // ✅ FIX 2: Add user message and clear input immediately
    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setIsTyping(true);

    try {
      // ✅ FIX 3: Actually use the response from n8n
      const botReplyText = await handleChat({
        userMessage,
        sessionId: getSessionId(),
        webhookUrl,
      });

      const botReply = {
        id: Date.now() + 1,
        type: "bot",
        text: botReplyText || "Koi jawab nahi mila, dobara try karein.",
        time: getCurrentTime(),
      };

      setMessages((prev) => [...prev, botReply]);
      console.log(messages);
    } catch (error) {
      // ✅ FIX 4: Show error message in chat instead of crashing
      const errorReply = {
        id: Date.now() + 1,
        type: "bot",
        text: "Maafi chahta hoon, kuch masla aa gaya. Thodi der baad dobara try karein.",
        time: getCurrentTime(),
      };
      setMessages((prev) => [...prev, errorReply]);
    } finally {
      // ✅ FIX 5: Always stop typing indicator
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div
      className="fixed z-50 flex flex-col items-end gap-4"
      style={{
        ...(position === "bottom-right" && { bottom: "5%", right: "5%" }),
        ...(position === "bottom-left" && { bottom: "5%", left: "5%" }),
        ...(position === "top-right" && { top: "5%", right: "5%" }),
        ...(position === "top-left" && { top: "5%", left: "5%" }),
      }}
    >
      {/* Chat Window */}
      <div
        className={`
  w-[90vw] md:w-[400px] h-[70vh]
  rounded-2xl flex flex-col overflow-hidden
  border border-white/40 shadow-2xl
  backdrop-blur-xl bg-white/90
  transition-all duration-300
  ${position === "top-right" ? "origin-top-right" : ""}
  ${position === "top-left" ? "origin-top-left" : ""}
  ${position === "bottom-left" ? "origin-bottom-left" : ""}
  ${position === "bottom-right" ? "origin-bottom-right" : ""}
  ${
    isOpen
      ? "opacity-100 scale-100 translate-y-0"
      : "opacity-0 scale-90 translate-y-5 pointer-events-none"
  }
`}
      >
        {/* Header */}
        <header className="bg-white/80 border-b border-gray-200 flex justify-between items-center px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                <Bot size={20} className="text-indigo-700" />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
            </div>
            <div>
              <h2 className="font-bold" style={{ color: primaryColor }}>
                {botName}
              </h2>
              <p className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">
                Online
              </p>
            </div>
          </div>
          <button
            onClick={toggleChat}
            className="text-gray-500 cursor-pointer hover:text-indigo-700 transition-colors"
          >
            <X size={20} />
          </button>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col gap-2 max-w-[85%] ${
                msg.type === "user" ? "items-end ml-auto" : "items-start"
              }`}
            >
              <div
                style={
                  msg.type === "user" ? { backgroundColor: primaryColor } : {}
                }
                className={`p-4 rounded-2xl text-sm shadow-sm ${
                  msg.type === "user"
                    ? "text-white rounded-br-none"
                    : "bg-white text-gray-700 rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[10px] text-gray-400 px-1">{msg.time}</span>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex flex-col gap-2 max-w-[85%]">
              <div className="bg-white py-3 px-4 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"></span>
                <span
                  className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></span>
                <span
                  className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                ></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef}></div>
        </div>

        {/* Input */}
        <div className="p-4 bg-white/50 border-t border-gray-200">
          <div className="flex items-end gap-2 p-2 bg-white rounded-xl border border-gray-200 shadow-lg">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message..."
              rows="1"
              disabled={isTyping}
              className="flex-1 py-2 px-2 bg-transparent border-none outline-none text-sm resize-none max-h-32 disabled:opacity-50"
            />
            <button
              disabled={isTyping || !message.trim()}
              style={{ backgroundColor: primaryColor }}
              onClick={handleSendMessage}
              className="w-10 h-10 flex items-center justify-center text-white rounded-lg hover:opacity-90 transition-all active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Floating Button */}
      <button
        className="w-14 h-14 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all active:scale-95 cursor-pointer"
        style={{ backgroundColor: primaryColor }}
        onClick={toggleChat}
      >
        {isOpen ? <ChevronDown size={26} /> : <MessageCircle size={26} />}
      </button>
    </div>
  );
};

export default Chatbot;
