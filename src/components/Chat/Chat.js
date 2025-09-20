// src/components/Chat/Chat.js
import React, { useState, useRef, useEffect } from "react";
import { Send, RotateCcw, AlertCircle } from "lucide-react";
import MessageList from "../Message/MessageList";
import { useChat } from "../../hooks/useChat";
import "./Chat.scss";

const Chat = ({ sessionId }) => {
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);

  const {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    isStreaming,
    streamingMessage,
  } = useChat();

  // ----------------------------
  // Clear messages when sessionId changes
  // ----------------------------
  useEffect(() => {
    clearMessages();
  }, [sessionId, clearMessages]);

  // Auto-focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      const { scrollHeight, clientHeight } = chatContainerRef.current;
      chatContainerRef.current.scrollTop = scrollHeight - clientHeight;
    }
  }, [messages, streamingMessage]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!inputMessage.trim() || isLoading) {
      return;
    }

    const message = inputMessage.trim();
    setInputMessage("");
    setIsTyping(true);

    try {
      await sendMessage(message);
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearHistory = async () => {
    if (window.confirm("Are you sure you want to clear the chat history?")) {
      try {
        clearMessages();
      } catch (error) {
        console.error("Failed to clear history:", error);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const isDisabled = isLoading || isTyping || !inputMessage.trim();

  return (
    <div className="chat-container">
      {/* Chat Header */}
      <div className="chat-header">
        <div className="chat-title">
          <h2>News Chat Assistant</h2>
          <span className="session-id">
            Session: {sessionId?.slice(0, 8)}...
          </span>
        </div>
        <button
          onClick={handleClearHistory}
          className="clear-button"
          disabled={isLoading || messages.length === 0}
          title="Clear chat history"
        >
          <RotateCcw size={16} />
          Clear Chat
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="error-banner">
          <AlertCircle size={16} />
          <span>Error: {error}</span>
        </div>
      )}

      {/* Messages Container */}
      <div ref={chatContainerRef} className="messages-container">
        {messages.length === 0 ? (
          <div className="welcome-message">
            <div className="welcome-content">
              <h3>👋 Welcome to News Chat!</h3>
              <p>
                I can help you find information from recent news articles. Try
                asking questions like:
              </p>
              <ul>
                <li>"What are the latest developments in technology?"</li>
                <li>"Tell me about recent political events"</li>
                <li>"What's happening in the business world?"</li>
                <li>"Any recent sports news?"</li>
              </ul>
            </div>
          </div>
        ) : (
          <MessageList
            messages={messages}
            streamingMessage={streamingMessage}
            isStreaming={isStreaming}
          />
        )}
      </div>

      {/* Chat Input */}
      <div className="chat-input-container">
        <form onSubmit={handleSubmit} className="chat-form">
          <div className="input-wrapper">
            <textarea
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                isLoading ? "Please wait..." : "Ask me about recent news..."
              }
              disabled={isLoading}
              className="chat-input"
              rows={1}
              maxLength={5000}
            />
            <button
              type="submit"
              disabled={isDisabled}
              className={`send-button ${isDisabled ? "disabled" : "enabled"}`}
            >
              {isLoading ? (
                <div className="loading-spinner small"></div>
              ) : (
                <Send size={20} />
              )}
            </button>
          </div>
          <div className="input-footer">
            <span className="character-count">{inputMessage.length}/5000</span>
            {isTyping && (
              <span className="typing-indicator">
                Processing your message...
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;