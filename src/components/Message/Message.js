// src/components/Message/Message.js
import React, { useState } from "react";
import {
  User,
  Bot,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import "./Message.scss";

const Message = ({ message, isLast }) => {
  const [showSources, setShowSources] = useState(false);
  const [copied, setCopied] = useState(false);
  const isAssistant = message.role === "assistant";
  const hasSources =
    isAssistant && message.sources && message.sources.length > 0;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy message:", error);
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";

    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "";
    }
  };

  return (
    <div className={`message ${isAssistant ? "assistant" : "user"}`}>
      <div className="message-header">
        <div className="message-avatar">
          {isAssistant ? <Bot size={20} /> : <User size={20} />}
        </div>
        <div className="message-info">
          <span className="message-sender">
            {isAssistant ? "Assistant" : "You"}
          </span>
          {message.timestamp && (
            <span className="message-time">
              {formatTimestamp(message.timestamp)}
            </span>
          )}
        </div>
        {isAssistant && (
          <button
            onClick={handleCopy}
            className="copy-button"
            title="Copy message"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        )}
      </div>

      <div className="message-content">
        {isAssistant ? (
          <ReactMarkdown
            components={{
              // Custom renderers for better styling
              p: ({ children }) => (
                <p className="message-paragraph">{children}</p>
              ),
              strong: ({ children }) => (
                <strong className="message-bold">{children}</strong>
              ),
              em: ({ children }) => (
                <em className="message-italic">{children}</em>
              ),
              ul: ({ children }) => (
                <ul className="message-list">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="message-list numbered">{children}</ol>
              ),
              li: ({ children }) => (
                <li className="message-list-item">{children}</li>
              ),
              blockquote: ({ children }) => (
                <blockquote className="message-blockquote">
                  {children}
                </blockquote>
              ),
              code: ({ inline, children }) =>
                inline ? (
                  <code className="message-code-inline">{children}</code>
                ) : (
                  <pre className="message-code-block">
                    <code>{children}</code>
                  </pre>
                ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        ) : (
          <p className="message-text">{message.content}</p>
        )}

        {/* Sources Section */}
        {hasSources && (
          <div className="sources-section">
            <button
              onClick={() => setShowSources(!showSources)}
              className="sources-toggle"
            >
              <span>Sources ({message.sources.length})</span>
              {showSources ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </button>

            {showSources && (
              <div className="sources-list">
                {message.sources.map((source, index) => (
                  <div key={index} className="source-item">
                    <div className="source-header">
                      <h4 className="source-title">{source.title}</h4>
                      {source.score && (
                        <span className="source-score">
                          {(source.score * 100).toFixed(1)}% match
                        </span>
                      )}
                    </div>
                    {source.snippet && (
                      <p className="source-snippet">{source.snippet}</p>
                    )}
                    {source.url && (
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="source-link"
                      >
                        Read full article <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;