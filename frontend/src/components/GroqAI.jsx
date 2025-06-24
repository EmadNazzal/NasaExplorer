import React, { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  Rocket,
  Minimize2,
} from "lucide-react";
import { useGroqConversation } from "../hooks/useGroq";
import "./GroqAI.css";

const GroqAI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const { conversation, askAI, clearConversation, isLoading, error } =
    useGroqConversation();

  //   const scrollToBottom = () => {
  //     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  //   };

  useEffect(() => {
    // Scroll after render
    const timeout = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

      // Refocus input if conditions are right
      if (
        isOpen &&
        !isMinimized &&
        inputRef.current &&
        document.activeElement !== inputRef.current
      ) {
        inputRef.current.focus();
      }
    }, 50); // Delay ensures DOM updates first

    return () => clearTimeout(timeout);
  }, [conversation, isOpen, isMinimized]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const message = inputMessage.trim();
    setInputMessage("");

    try {
      await askAI(message);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedQuestions = [
    "Tell me about the James Webb Space Telescope",
    "What are NASA's current Mars missions?",
    "Explain the Artemis program",
    "What is the International Space Station?",
    "How do rockets work?",
  ];

  const FloatingButton = () => (
    <button onClick={() => setIsOpen(true)} className="groq-floating-button">
      <div className="groq-button-content">
        <MessageCircle size={24} />
        <div className="groq-status-indicator"></div>
      </div>
      <div className="groq-tooltip">Ask NASA AI</div>
    </button>
  );

  const ChatPopup = () => (
    <div className="groq-chat-popup">
      {/* Header */}
      <div className="groq-header">
        <div className="groq-header-info">
          <div className="groq-avatar">
            <Rocket size={16} />
          </div>
          <div className="groq-header-text">
            <h3>NASA AI Assistant</h3>
            <p>Space exploration expert</p>
          </div>
        </div>
        <div className="groq-header-actions">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="groq-header-button"
          >
            <Minimize2 size={16} />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="groq-header-button"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="groq-messages-container">
            {conversation.length === 0 && (
              <div className="groq-welcome">
                <div className="groq-welcome-icon">
                  <Sparkles size={24} />
                </div>
                <h4>Welcome to NASA AI!</h4>
                <p>
                  I'm here to help you explore the wonders of space and NASA's
                  missions.
                </p>
                <div className="groq-suggestions">
                  <p className="groq-suggestions-label">Try asking:</p>
                  {suggestedQuestions.slice(0, 3).map((question, index) => (
                    <button
                      key={index}
                      onClick={() => setInputMessage(question)}
                      className="groq-suggestion-button"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {conversation.map((message) => (
              <div
                key={message.id}
                className={`groq-message ${
                  message.isUser ? "groq-message-user" : "groq-message-ai"
                }`}
              >
                <div className="groq-message-bubble">
                  {!message.isUser && (
                    <div className="groq-message-header">
                      <div className="groq-message-avatar">
                        <Rocket size={12} />
                      </div>
                      <span className="groq-message-sender">NASA AI</span>
                    </div>
                  )}
                  <p className="groq-message-text">{message.text}</p>
                  <p className="groq-message-time">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="groq-message groq-message-ai">
                <div className="groq-message-bubble">
                  <div className="groq-loading">
                    <div className="groq-message-avatar">
                      <Rocket size={12} />
                    </div>
                    <div className="groq-typing-indicator">
                      <div className="groq-dot"></div>
                      <div className="groq-dot"></div>
                      <div className="groq-dot"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="groq-error">
                <div className="groq-error-message">
                  {error.message || "Something went wrong. Please try again."}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="groq-input-container">
            {conversation.length > 0 && (
              <div className="groq-input-header">
                <div className="groq-quick-suggestions">
                  {suggestedQuestions.slice(0, 2).map((question, index) => (
                    <button
                      key={index}
                      onClick={() => setInputMessage(question)}
                      className="groq-quick-button"
                    >
                      {question.slice(0, 20)}...
                    </button>
                  ))}
                </div>
                <button
                  onClick={clearConversation}
                  className="groq-clear-button"
                >
                  Clear
                </button>
              </div>
            )}
            <div className="groq-input-wrapper">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about NASA missions, space exploration..."
                className="groq-input"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="groq-send-button"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </>
      )}

      {isMinimized && (
        <div className="groq-minimized">
          <p>Chat minimized</p>
        </div>
      )}
    </div>
  );

  return (
    <>
      {!isOpen && <FloatingButton />}
      {isOpen && <ChatPopup />}
    </>
  );
};

export default GroqAI;
